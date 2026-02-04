import { useRef, useEffect } from "react";
import { Message } from "@/types";
import { ChatBubble } from "./ChatBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "./LoadingSpinner";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <ScrollArea className="flex-1 p-4 h-full">
            <div className="flex flex-col gap-4 pb-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start pl-4">
                        <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                            <LoadingSpinner />
                            <span className="text-xs text-muted-foreground">AI is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    );
}
