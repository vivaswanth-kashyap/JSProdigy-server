import express from "express";
import xss from "xss";
import { marked } from "marked";
import { ObjectId } from "mongodb";
import { getAIResponse } from "../data/openai.js";
import * as doubtsData from "../data/doubts.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const doubts = await doubtsData.findAllDoubts();
		return res.status(200).json(doubts);
	} catch (error) {
		console.error("Error in GET /doubts:", error);
		return res
			.status(500)
			.json({ error: "Couldn't find the doubts", details: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const uid = xss(req.body.uid);
		const doubt = xss(req.body.doubt);
		const newDoubt = await doubtsData.askDoubt(uid, doubt);
		return res.status(200).json(newDoubt);
	} catch (error) {
		console.error("Error in POST /doubts:", error);
		return res
			.status(500)
			.json({ error: "Doubt addition unsuccessful", details: error.message });
	}
});

// ... (keep the unescapeString and parseAIResponse functions as they are)
function unescapeString(str) {
	str = str
		.replace(/\\n/g, "\n")
		.replace(/\\r/g, "\r")
		.replace(/\\t/g, "\t")
		.replace(/\\b/g, "\b")
		.replace(/\\f/g, "\f")
		.replace(/\\\"/g, '"')
		.replace(/\\\'/g, "'")
		.replace(/\\\\/g, "\\");

	return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
		String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
	);
}

function parseAIResponse(rawResponse) {
	const tokens = marked.lexer(rawResponse);
	let structuredResponse = {
		title: "AI Response",
		steps: [],
		conclusion: "",
	};

	let currentStep = null;
	let isInConclusion = false;

	tokens.forEach((token) => {
		if (token.type === "heading") {
			if (token.depth === 1) {
				structuredResponse.title = token.text;
			} else if (token.depth === 2) {
				if (token.text.toLowerCase().includes("conclusion")) {
					isInConclusion = true;
				} else {
					if (currentStep) structuredResponse.steps.push(currentStep);
					currentStep = { description: token.text, code: null, language: null };
				}
			}
		} else if (token.type === "paragraph") {
			if (isInConclusion) {
				structuredResponse.conclusion += token.text + " ";
			} else if (currentStep) {
				currentStep.description += " " + token.text;
			} else {
				if (structuredResponse.steps.length === 0) {
					currentStep = { description: token.text, code: null, language: null };
				} else {
					structuredResponse.conclusion += token.text + " ";
				}
			}
		} else if (token.type === "code") {
			if (currentStep) {
				currentStep.code = token.text;
				currentStep.language = token.lang || "plaintext";
				structuredResponse.steps.push(currentStep);
				currentStep = null;
			} else {
				structuredResponse.steps.push({
					description: "Code snippet:",
					code: token.text,
					language: token.lang || "plaintext",
				});
			}
		}
	});

	if (currentStep) structuredResponse.steps.push(currentStep);
	structuredResponse.conclusion = structuredResponse.conclusion.trim();

	return structuredResponse;
}

router.post("/ai-response", async (req, res) => {
	try {
		const { doubt, id } = req.body;
		if (!doubt || typeof doubt !== "string" || doubt.trim().length === 0) {
			return res
				.status(400)
				.json({ error: "Invalid doubt. Please provide a non-empty string." });
		}
		const aiResponse = await getAIResponse(doubt);
		const unescapedResponse = unescapeString(aiResponse);
		const structuredResponse = parseAIResponse(unescapedResponse);

		// Save AI response as a reply
		const updatedDoubt = await doubtsData.addReply(
			"AI",
			id,
			JSON.stringify(structuredResponse),
			true
		);

		res.json(updatedDoubt);
	} catch (error) {
		console.error("Error in POST /doubts/ai-response:", error);
		res.status(500).json({
			error: "An error occurred while processing your request.",
			details: error.message,
		});
	}
});

router.post("/reply", async (req, res) => {
	try {
		const { uid, id, reply } = req.body;
		console.log("Received reply request:", { uid, id, reply });

		if (!id || !reply) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid doubt id format" });
		}

		// Log the doubt before update
		const doubtBeforeUpdate = await doubtsData.findDoubt(id);
		console.log("Doubt before update:", doubtBeforeUpdate);

		const updatedDoubt = await doubtsData.addReply(uid, id, reply);
		console.log("Updated doubt:", updatedDoubt);
		res.json(updatedDoubt);
	} catch (error) {
		console.error("Error in POST /doubts/reply:", error);
		if (error.message.includes("No document found with id")) {
			res.status(404).json({
				error: "Doubt not found",
				details: error.message,
			});
		} else {
			res.status(500).json({
				error: "An error occurred while processing your request.",
				details: error.message,
				stack: error.stack,
			});
		}
	}
});

export default router;
