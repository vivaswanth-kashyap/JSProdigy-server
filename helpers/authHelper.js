import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

admin.initializeApp({
	// Your Firebase service account credentials
	apiKey: process.env.fbApiKey,
	authDomain: process.env.fbAuthDomain,
	projectId: process.env.fbProjectId,
	storageBucket: process.env.fbStorageBucket,
	messagingSenderId: process.env.fbMessagingSenderId,
	appId: process.env.fbAppId,
});

export async function verifyToken(token) {
	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		const uid = decodedToken.uid;
		return uid;
	} catch (error) {
		console.error("Error verifying token:", error);
		throw new Error("Unauthorized");
	}
}
