export type Role = 'user' | 'assistant';

export interface Message {
    id: string;
    conversationId: string;
    role: Role;
    content: string;
    createdAt: Date;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages?: Message[];
}
