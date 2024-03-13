import { useEffect, useRef, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Dialog, Group, Button, Text, ScrollArea, Textarea, Box, Loader, FileInput } from '@mantine/core';
// import 'dotenv/config';
import { HarmBlockThreshold, HarmCategory, TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { formatDocumentsAsString } from "langchain/util/document";
import { createRetrieverTool } from "langchain/tools/retriever";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

const Chatbot = () => {
    const [input, setInput] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const [opened, { toggle, close }] = useDisclosure(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<string[]>([
        "Hi, how can I be of service to you?",
    ]);

    //Scroll to bottom after every response
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [reply, chatHistory]);

    //Save the user input
    const inputChange = (e: any) => {
        e.preventDefault();

        setInput(e.target.value);
    }

    //LLM (Langchain + Gemini AI)
    const chatlog = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setReply("");

        const outputParser = new StringOutputParser();
        const updatedChat: string[] = [...chatHistory];

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
            modelName: "gemini-pro",
            maxOutputTokens: 500,
            safetySettings,
            cache: true,
            temperature: 0.5,
            streaming: true,
            apiKey: "AIzaSyCaV5djusWE31J5Atgd71eqpHhN6Uwmy2E"
        });

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });
        const loader = new CheerioWebBaseLoader(
            "https://js.langchain.com/docs/get_started/introduction"
        );
        const docs = await loader.load();
        const splitDocs = await splitter.splitDocuments(docs);
        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "LeetNode",
            apiKey: "AIzaSyCaV5djusWE31J5Atgd71eqpHhN6Uwmy2E"
        });
        const vectorstore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            embeddings
        );
        const retriever = vectorstore.asRetriever();

        const formatChatHistory = (messages: string[]) => {
            return messages.map((message, i) => {
                if (i % 2 === 0) {
                    return `You: ${message}`
                }
                else { return `Bot: ${message}` }
            }).join('\n')
        }

        const questionPrompt = PromptTemplate.fromTemplate(
            `Use the following pieces of context to answer the question at the end. Look at the chatHistory first to have context. If you don't know the answer, use Tavily to search the web, don't try to make up an answer.
            ----------------
            CONTEXT: {context}
            ----------------
            CHAT HISTORY: {chatHistory}
            ----------------
            QUESTION: {question}
            ----------------
            Helpful Answer:`
        );
          
        const chain = RunnableSequence.from([
            {
              question: (input: { question: string; chatHistory?: string }) =>
                input.question,
              chatHistory: (input: { question: string; chatHistory?: string }) =>
                input.chatHistory ?? "",
              context: async (input: { question: string; chatHistory?: string }) => {
                const relevantDocs = await retriever.getRelevantDocuments(input.question);
                const serialized = formatDocumentsAsString(relevantDocs);
                return serialized;
              },
            },
            questionPrompt,
            llm,
            new StringOutputParser(),
        ]);

        const res = await chain.invoke({
            chatHistory: formatChatHistory(chatHistory),
            question: input,
        });

        const retrieverTool = await createRetrieverTool(retriever, {
            name: "langsmith_search",
            description:
              "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
        });

        const searchTool = new TavilySearchResults({
            apiKey: "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"
        });
        // const tools = [retrieverTool, searchTool];
        const tools = [searchTool];

        // Get the prompt to use - you can modify this!
        // If you want to see the prompt in full, you can at:
        // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
        const agentPrompt = await pull<ChatPromptTemplate>(
            "hwchase17/openai-functions-agent"
        );

        const agent = await createOpenAIFunctionsAgent({
        llm: llm,
        tools,
        prompt: agentPrompt,
        });

        const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true,
        });

        // const agentResult = await agentExecutor.invoke({
        //     input: "how can LangSmith help with testing?",
        // });
          
        // console.log(agentResult.output);

        const agentResult = await agentExecutor.invoke({
            input: formatChatHistory(chatHistory) + input,
        });
          
        // console.log('agent2 reply: ' + agentResult2.output);
          
        let text = '';
        for await (const chunk of agentResult.output) {
            text += chunk;
            setReply(text);
        };
        // let text = '';
        // for await (const chunk of res) {
        //     text += chunk;
        //     setReply(text);
        // };

        updatedChat.push(input);
        updatedChat.push(text);
        setChatHistory(updatedChat);
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

                        : chatHistory.map((msg) => (
                            <Box key={chatHistory.indexOf(msg)} className="mt-5">
                                <Text size="md" fw={600} color={chatHistory.indexOf(msg) % 2 == 0 ? "cyan" : "orange"}>
                                    {chatHistory.indexOf(msg) % 2 == 0 ? "Bot" : "You"}
                                </Text>
                                <p className="px-4 py-2 bg-neutral-100 rounded-md leading-8">
                                    {msg}
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
                            value={input}
                            onChange={(e) => inputChange(e)}
                            onKeyDown={(e) => { if (e.key === "Enter") { chatlog(e); setInput(""); } }}
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
                                <Button onClick={(e) => { chatlog(e); setInput(""); }}>
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