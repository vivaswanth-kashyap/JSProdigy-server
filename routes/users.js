import express from "express";
import * as userData from "../data/users.js";
import { verifyToken } from "../helpers/authHelper.js";
import xss from "xss";

const router = express.Router();

router.get("/", async (req, res) => {
	return res.status(200).json("Hello from the api");
});

router.post("/profile", async (req, res) => {
	try {
		console.log("Inside /users/profile route handler");

		const uid = xss(req.body.uid);
		const fname = xss(req.body.firstName);
		const lname = xss(req.body.lastName);
		const email = xss(req.body.email);
		const phone = xss(req.body.phoneNumber);
		const dob = xss(req.body.dateOfBirth);
		const gender = xss(req.body.gender);
		const occupation = xss(req.body.occupation);
		const educationLevel = xss(req.body.educationLevel);
		console.lo;

		const user = await userData.addUser(
			uid,
			fname,
			lname,
			email,
			phone,
			dob,
			gender,
			occupation,
			educationLevel
		);

		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
});

router.get("/:uid", async (req, res) => {
	try {
		const uid = xss(req.params.uid);
		const user = await userData.findUser(uid);

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post("/:uid", async (req, res) => {
	try {
		//console.log("inside server");
		if (!req.headers.authorization) {
			return res
				.status(401)
				.json({ error: "Unauthorized: Missing Authorization header" });
		}
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
