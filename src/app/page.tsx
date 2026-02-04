"use client";

import { useChat } from "@/hooks/useChat";
import { MessageList } from "@/components/MessageList";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCode2, MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
    const {
        conversations,
        currentConversationId,
        messages,
        isLoading,
        setCurrentConversationId,
        startNewChat,
        sendMessage,
        handleDeleteConversation,
        apiEndpoint,
        updateApiEndpoint
    } = useChat();

    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput("");
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const activeConversation = conversations.find(c => c.id === currentConversationId);

    return (
        <main className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <div className="w-[260px] border-r bg-muted/20 flex flex-col hidden md:flex">
                <div className="p-4 border-b">
                    <Button
                        onClick={startNewChat}
                        className="w-full justify-start gap-2"
                        variant="secondary"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto py-2">
                    <div className="px-2 space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={cn(
                                    "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors relative",
                                    currentConversationId === conv.id ? "bg-muted font-medium" : "text-muted-foreground"
                                )}
                                onClick={() => setCurrentConversationId(conv.id)}
                            >
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span className="truncate flex-1">{conv.title}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-2"
                                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t">
                    <SettingsDialog
                        currentEndpoint={apiEndpoint}
                        onSave={updateApiEndpoint}
                    />
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header (Mobile Sidebar trigger could go here, for now just simple header) */}
                <header className="h-14 border-b flex items-center px-6 justify-between bg-background/50 backdrop-blur z-10">
                    <div className="flex items-center gap-2 font-semibold">
                        <FileCode2 className="h-5 w-5" />
                        <span>{activeConversation?.title || "AI Chatbot"}</span>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                                <FileCode2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Welcome to your AI Assistant</h3>
                            <p className="max-w-md">
                                Start a conversation by typing a message below. You can configure the API endpoint in settings.
                            </p>
                        </div>
                    ) : (
                        <MessageList messages={messages} isLoading={isLoading} />
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background">
                    <div className="max-w-3xl mx-auto relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="min-h-[50px] max-h-[200px] pr-12 resize-none py-3"
                            rows={1}
                        />
                        <Button
                            size="icon"
                            className="absolute right-2 bottom-2 h-8 w-8"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-2">
                        AI can make mistakes. Consider checking important information.
                    </div>
                </div>
            </div>
        </main>
    );
}
