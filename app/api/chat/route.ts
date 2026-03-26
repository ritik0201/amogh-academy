import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const systemPrompt = `You are a helpful and friendly AI assistant for Amogh Academy, a highly reputed coaching institute and computer education center in Varanasi. 
You should be concise, professional, and very helpful. If asked about prices or very specific details not provided, kindly tell the user to contact the academy directly via the contact form or phone call.
Address of the center: 1st Floor, La-paradise Building, (Above Axis Bank) Panchkoshi Road, Ashok Nagar, Sarang Talab, Varanasi.
Phone numbers: +91-9807737046, +91-7460008625.
Courses: 
- Foundation Coaching (6th-12th CBSE/ICSE): Science, Commerce, Arts streams. Regular tests and mock exams.
- Competitive Target Prep: CUET, NEET, IIT-JEE. 
- Computer Education (Ministry of Corporate Affairs approved): MDCA (12 mo), DCA (6 mo), CCC (3 mo). Covers basic computer concepts, MS Office, Tally with GST, Desktop Publishing. Free or min fee tests for computer courses with job placement training.
Never invent contact details, course fees, or other specific operational information not provided here.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API Key is not configured." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Priority list of models we want to try in order
        const modelNames = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-pro"];
        let lastError = null;

        const finalMessage = messages[messages.length - 1].content;
        const msgHistory = messages.slice(0, -1);

        for (const modelName of modelNames) {
            try {
                console.log(`>>> Attempting AI response with: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood! I am ready to assist visitors to the Amogh Academy website." }],
                        },
                        ...msgHistory.map((msg: any) => ({
                            role: msg.role === "user" ? "user" : "model",
                            parts: [{ text: msg.content }],
                        })),
                    ],
                });

                const result = await chat.sendMessage(finalMessage);
                const response = await result.response;
                const text = response.text();

                if (text) {
                    console.log(`>>> Success with model: ${modelName}`);
                    return NextResponse.json({ message: text });
                }
            } catch (err: any) {
                console.warn(`>>> Model ${modelName} failed:`, err.message);
                lastError = err;
                continue; // Move to next model
            }
        }

        // If all models in the list failed, try to discover ANY other valid model
        try {
            console.log(">>> Final attempt: Discovering any available model...");
            const modelsResult = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
            const modelsData = await modelsResult.json();

            if (modelsData.models) {
                const autoFound = modelsData.models.find((m: any) =>
                    m.supportedGenerationMethods.includes("generateContent") &&
                    !m.name.includes("vision") && !m.name.includes("tts")
                );

                if (autoFound) {
                    const modelName = autoFound.name.replace("models/", "");
                    console.log(`>>> Trying auto-discovered model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const chat = model.startChat({
                        history: [
                            { role: "user", parts: [{ text: systemPrompt }] },
                            { role: "model", parts: [{ text: "Understood! I am ready." }] },
                            ...msgHistory.map((msg: any) => ({
                                role: msg.role === "user" ? "user" : "model",
                                parts: [{ text: msg.content }],
                            })),
                        ],
                    });
                    const result = await chat.sendMessage(finalMessage);
                    const text = (await result.response).text();
                    return NextResponse.json({ message: text });
                }
            }
        } catch (e) {
            console.error(">>> Auto-discovery also failed.");
        }

        throw lastError || new Error("All AI models failed to respond. Please check your API key quota and permissions.");
    } catch (error: any) {
        console.error("Chatbot API Final Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get response from AI.", message: "I'm currently unavailable due to an API quota issue." },
            { status: 500 }
        );
    }
}
