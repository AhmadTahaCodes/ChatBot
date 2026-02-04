import { useState, useEffect, useCallback } from "react";
import { Message, Conversation } from "@/types";
import { generateResponse } from "@/lib/api";
import {
    getConversations,
    getMessages,
    createConversation,
    addMessage,
    deleteConversation,
    updateConversationTitle
} from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [apiEndpoint, setApiEndpoint] = useState<string>("");

    useEffect(() => {
        const stored = localStorage.getItem("apiEndpoint");
        if (stored) setApiEndpoint(stored);
    }, []);

    const updateApiEndpoint = (url: string) => {
        setApiEndpoint(url);
        localStorage.setItem("apiEndpoint", url);
    };

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, []);

    // Load messages when conversation changes
    useEffect(() => {
        if (currentConversationId) {
            loadMessages(currentConversationId);
        } else {
            setMessages([]);
        }
    }, [currentConversationId]);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            // Cast the result to match the expected type since Prisma dates are Objects in Client components? 
            // Actually Server Actions return JSON serializable data. Dates become strings typically unless mapped?
            // Next.js Server Actions usually handle Date serialization.
            setConversations(data as any);
            setIsInitializing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load history");
        }
    };

    const loadMessages = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await getMessages(id);
            setMessages(data as any);
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentConversationId(undefined);
        setMessages([]);
    };

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        // Optimistic user message
        const tempId = Date.now().toString();
        const optimisticMsg: Message = {
            id: tempId,
            conversationId: currentConversationId || "temp",
            role: "user",
            content,
            createdAt: new Date()
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setIsLoading(true);

        try {
            let conversationId = currentConversationId;

            // Create conversation if it doesn't exist
            if (!conversationId) {
                // Auto-title: first 30 chars
                const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
                const newConv = await createConversation(title);
                if (newConv) {
                    conversationId = newConv.id;
                    setCurrentConversationId(conversationId);
                    // Refresh list
                    loadConversations();
                } else {
                    throw new Error("Failed to create conversation");
                }
            }

            // Save user message to DB
            await addMessage(conversationId, "user", content);

            // Build history string for context (optional feature)
            // We can grab the last 5 messages for context
            const historyContext = messages.slice(-5).map(m =>
                m.role === "user" ? `User: ${m.content}` : `AI: ${m.content}`
            ).join("\n");

            // Call API
            const aiResponseText = await generateResponse(content, historyContext, apiEndpoint);

            // Save AI message to DB
            const aiMsg = await addMessage(conversationId!, "assistant", aiResponseText);

            if (aiMsg) {
                // Update messages with real data
                // We need to re-fetch to ensure sync or just append. 
                // Re-fetching is safer for IDs but might flicker? 
                // Let's just append the AI message.
                setMessages(prev => {
                    // Replace optimistic user message with confirmed one? 
                    // Actually, since we re-fetched messages in `loadMessages` if we changed ID, 
                    // we might be in a mixed state. 
                    // Easiest is to fetch fresh messages.
                    return [...prev.filter(m => m.id !== tempId),
                    { ...optimisticMsg, id: 'confirmed-user-id', conversationId: conversationId! } as any, // bit hacky without real ID
                    aiMsg as any
                    ];
                });

                // Actually, better to just reload messages from DB to be clean
                await loadMessages(conversationId!);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to send message");
            // Remove optimistic message if failed?
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this chat?")) {
            const success = await deleteConversation(id);
            if (success) {
                if (currentConversationId === id) {
                    startNewChat();
                }
                await loadConversations();
                toast.success("Conversation deleted");
            } else {
                toast.error("Failed to delete");
            }
        }
    };

    return {
        conversations,
        currentConversationId,
        messages,
        isLoading,
        isInitializing,
        setCurrentConversationId,
        startNewChat,
        sendMessage,
        handleDeleteConversation,
        apiEndpoint,
        updateApiEndpoint
    };
}
