import express from "express";
// import { getUserData } from "../data/users.js";
import { verifyToken } from "../helpers/authHelper.js";

const router = express.Router();

router.post("/:uid", async (req, res) => {
	try {
		console.log("inside server");
		const token = req.headers.authorization.split(" ")[1];
		const uid = await verifyToken(token);
		if (uid && uid === req.params.uid) {
			// Token is valid and matches the requested UID
			// const userData = await getUserData(uid);
			// res.json(userData);
			return res.status(200).json(uid);
		} else {
			// Token is valid but doesn't match the requested UID or uid is not available
			res.status(403).json({ error: "Forbidden" });
		}
	} catch (error) {
		console.error("Error in /users/:uid route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
