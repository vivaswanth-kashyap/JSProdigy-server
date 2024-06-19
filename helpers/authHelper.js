import admin from "firebase-admin";

admin.initializeApp({
	// Your Firebase service account credentials
	apiKey: "AIzaSyAZrqo7Kw7oGE-fboi8pandudywZCIv-lo",
	authDomain: "jsprodigy-fdb31.firebaseapp.com",
	projectId: "jsprodigy-fdb31",
	storageBucket: "jsprodigy-fdb31.appspot.com",
	messagingSenderId: "604750583953",
	appId: "1:604750583953:web:bf3ff44479309e37410730",
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
