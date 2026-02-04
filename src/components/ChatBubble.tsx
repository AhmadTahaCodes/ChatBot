import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ChatBubbleProps {
    message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "flex w-full gap-3 p-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
                {!isUser && <AvatarImage src="/ai-avatar.png" alt="AI" />}
            </Avatar>

            <div
                className={cn(
                    "relative group max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                )}
            >
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-2 -right-10 opacity-0 group-hover:opacity-100 transition-opacity",
                        isUser && "-left-10 right-auto"
                    )}
                    onClick={handleCopy}
                    title="Copy message"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
