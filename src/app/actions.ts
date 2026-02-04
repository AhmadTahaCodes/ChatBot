"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getConversations() {
    try {
        return await prisma.conversation.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 1
                }
            }
        });
    } catch (error) {
        console.error("Failed to get conversations:", error);
        return [];
    }
}

export async function getMessages(conversationId: string) {
    try {
        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' }
        });
    } catch (error) {
        console.error("Failed to get messages:", error);
        return [];
    }
}

export async function createConversation(title: string) {
    try {
        const conversation = await prisma.conversation.create({
            data: { title }
        });
        revalidatePath("/");
        return conversation;
    } catch (error) {
        console.error("Failed to create conversation:", error);
        return null;
    }
}

export async function addMessage(conversationId: string, role: "user" | "assistant", content: string) {
    try {
        const message = await prisma.message.create({
            data: {
                conversationId,
                role,
                content
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        revalidatePath("/");
        return message;
    } catch (error) {
        console.error("Failed to add message:", error);
        return null;
    }
}

export async function deleteConversation(id: string) {
    try {
        await prisma.conversation.delete({
            where: { id }
        });
        revalidatePath("/");
        return true;
    } catch (error) {
        console.error("Failed to delete conversation:", error);
        return false;
    }
}

export async function updateConversationTitle(id: string, title: string) {
    try {
        await prisma.conversation.update({
            where: { id },
            data: { title }
        });
        revalidatePath("/");
        return true;
    } catch (error) {
        console.error("Failed to update title:", error);
        return false;
    }
}
