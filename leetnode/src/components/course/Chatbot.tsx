import { useEffect, useRef, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Dialog, Group, Button, TextInput, Text, ScrollArea, Textarea, Box, Loader, FileInput } from '@mantine/core';

interface Message {
    role: 'You' | 'Bot';
    parts: string;
}

const Chatbot = () => {
    const [prompt, setPrompt] = useState<string>("")
    const [reply, setReply] = useState<string>("")
    const [fullChat, setFullChat] = useState<Message[]>([{ role: 'Bot', parts: 'Great to meet you! How can I help you?' }])
    const [opened, { toggle, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [fullChat]);

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }
    ];

    const generationConfig = {
        maxOutputTokens: 200,
        temperature: 0.3,
    };

    const genAI = new GoogleGenerativeAI("AIzaSyCaV5djusWE31J5Atgd71eqpHhN6Uwmy2E");

    const fileToGenerativePart = async (file: any) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string)?.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    const chatlog = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setReply("")

        const updatedChat: Message[] = [...fullChat];
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", safetySettings, generationConfig });
        const chat = model.startChat();

        const fileInputEl = document.querySelector("input[type=file]") as HTMLInputElement;
        const imageParts = await Promise.all(
            [...fileInputEl.files as FileList].map(fileToGenerativePart)
        );

        const typedImageParts = imageParts as { inlineData: { data: string; mimeType: string; }; }[];

        updatedChat.push({ role: 'You', parts: prompt });
        const result = await chat.sendMessageStream([prompt, ...typedImageParts]);

        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += chunkText;
            setReply(text);
        }

        updatedChat.push({ role: 'Bot', parts: text });
        setFullChat(updatedChat);
        setLoading(false)
    }

    const promptChange = (e: any) => {
        e.preventDefault();

        setPrompt(e.target.value);
    }

    return (
        <>
            <Group>
                <Button onClick={toggle}>Smart Bot</Button>
            </Group>

            <Dialog opened={opened} withCloseButton onClose={close} radius="md" size="xl">
                <Text size="xl" mb="xs" fw={700} color="cyan">
                    Smart Bot
                </Text>

                <ScrollArea h={500} my="lg" pr="md" scrollbarSize={6}>
                    {loading ? reply : fullChat.map((msg) => (
                        <Box key={msg.role} className="my-5">
                            <Text size="md" fw={600} color={msg.role == "Bot" ? "cyan" : "orange"}>
                                {msg.role}
                            </Text>
                            <p className="text-justify">
                                {msg.parts}
                            </p>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                <Group align="flex-end">
                    <form onSubmit={(e) => { chatlog(e); setPrompt(""); }} className="flex flex-col gap-2">
                        <Textarea placeholder="Type your prompt" value={prompt} onChange={(e) => promptChange(e)} style={{ width: "270%" }} />
                        {/* <input type="file" accept="image/*" /> */}
                        <FileInput placeholder="Upload Image" />
                    </form>
                    <Button onClick={(e) => { chatlog(e); setPrompt(""); }}>
                        {loading ? <Loader color="white" /> : "Submit"}
                    </Button>
                </Group>
            </Dialog >
        </>
    )
}

export default Chatbot