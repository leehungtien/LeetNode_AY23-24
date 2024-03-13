import { useEffect, useRef, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Dialog, Group, Button, Text, ScrollArea, Textarea, Box, Loader, FileInput } from '@mantine/core';

import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

interface Message {
    role: 'You' | 'Bot';
    parts: string;
}

const Chatbot = () => {
    const [prompt, setPrompt] = useState<string>("")
    const [reply, setReply] = useState<string>("")
    const [fullChat, setFullChat] = useState<Message[]>([{ role: 'Bot', parts: 'Hi, how can I be of service to you?' }])
    const [opened, { toggle, close }] = useDisclosure(false)
    const [loading, setLoading] = useState<boolean>(false)

    //Scroll to bottom after every response
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [reply, fullChat]);

    //Save the user input
    const promptChange = (e: any) => {
        e.preventDefault();

        setPrompt(e.target.value);
    }

    //LLM (Langchain + Gemini AI)
    const chatlog = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setReply("");

        const outputParser = new StringOutputParser();
        const updatedChat: Message[] = [...fullChat];

        //Image conversion to Base64
        const toBase64 = (file: File) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
        const fileInputEl = document.querySelector("input[type=file]") as HTMLInputElement;
        const imageParts = await Promise.all(
            [...fileInputEl.files as FileList].map(toBase64)
        );
        const typedImageParts = imageParts as { inlineData: { data: string; mimeType: string; }; }[];

        // LLM config
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
        const llm = new ChatGoogleGenerativeAI({
            modelName: fileInputEl.files?.length ? "gemini-pro-vision" : "gemini-pro",
            maxOutputTokens: 500,
            safetySettings,
            cache: true,
            temperature: 0.5,
            apiKey: "AIzaSyCaV5djusWE31J5Atgd71eqpHhN6Uwmy2E"
        });

        //Prompt templates
        const systemTemplate = `You are a professor in a prestigious university. Input: {input}`

        const input =
            new HumanMessage({
                content: fileInputEl.files?.length
                    ? [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image_url",
                            image_url: `${typedImageParts}`,
                        },
                    ]

                    : [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
            });

        const chatPromptChain = ChatPromptTemplate.fromMessages([
            ["system", systemTemplate],
            input
        ]);

        const chain = chatPromptChain.pipe(llm).pipe(outputParser);

        const transformFullChatToInputFormat = (fullChat: Message[]) => {
            return fullChat.map(msg => {
                return { type: "text", text: `${msg.role}: ${msg.parts}` };
            });
        };

        const fullChatFormatted = transformFullChatToInputFormat(fullChat);
        const combinedInput = [...fullChatFormatted, ...input.content];
        const res = await chain.stream({
            input: combinedInput
        });

        let text = '';
        for await (const chunk of res) {
            text += chunk;
            setReply(text);
        };

        updatedChat.push({ role: 'You', parts: prompt });
        updatedChat.push({ role: 'Bot', parts: text });
        setFullChat(updatedChat);
        setLoading(false);
    }

    return (
        <>
            <Group>
                <Button onClick={toggle}>Smart Bot</Button>
            </Group>

            <Dialog opened={opened} withCloseButton onClose={close} radius="md" size="40rem">
                <Text size="xl" mb="xs" fw={700} color="cyan">
                    Smart Bot
                </Text>

                <ScrollArea h={430} my="md" pr="md" scrollbarSize={6} className="text-justify mx-2">
                    {loading
                        ? <Box className="mt-5">
                            <p className="px-4 py-2 bg-neutral-100 rounded-md leading-8">
                                {reply}
                            </p>
                        </Box>

                        : fullChat.map((msg) => (
                            <Box key={msg.role} className="mt-5">
                                <Text size="md" fw={600} color={msg.role == "Bot" ? "cyan" : "orange"}>
                                    {msg.role}
                                </Text>
                                <p className="px-4 py-2 bg-neutral-100 rounded-md leading-8">
                                    {msg.parts}
                                </p>
                            </Box>
                        ))}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                <Group className="flex flex-col justify-evenly">
                    {loading ?
                        <Textarea minRows={4} maxRows={4}
                            placeholder="Type your prompt"
                            className="w-full"
                            disabled
                        />
                        :
                        <Textarea minRows={4} maxRows={4}
                            placeholder="Type your prompt"
                            value={prompt}
                            onChange={(e) => promptChange(e)}
                            onKeyDown={(e) => { if (e.key === "Enter") { chatlog(e); setPrompt(""); } }}
                            required
                            withAsterisk
                            className="w-full"
                        />
                    }
                    <Box className="w-full flex justify-evenly">
                        {loading ?
                            <>
                                <FileInput placeholder="Upload Image" clearable disabled />
                                <Button disabled color="red">
                                    <Loader />
                                </Button>
                            </>
                            :
                            <>
                                <FileInput placeholder="Upload Image" clearable />
                                <Button onClick={(e) => { chatlog(e); setPrompt(""); }}>
                                    Submit
                                </Button>
                            </>
                        }
                    </Box>
                </Group>
            </Dialog >
        </>
    )
}

export default Chatbot