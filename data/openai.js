import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(doubt) {
	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful AI assistant answering doubts about programming and computer science.",
				},
				{ role: "user", content: doubt },
			],
			max_tokens: 650,
		});

		return completion.choices[0].message.content;
	} catch (error) {
		console.error("Error getting AI response:", error);
		throw new Error("Failed to get AI response");
	}
}
