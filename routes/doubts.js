import express from "express";
import * as doubtsData from "../data/doubts.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const doubts = await doubtsData.findAllDoubts();
		return res.status(200).json(doubts);
	} catch (error) {
		console.error(error);
		return res.status(500).json("Couldn't find the doubts");
	}
});

router.post("/", async (req, res) => {
	try {
		const uid = xss(req.body.uid);
		const doubt = xss(req.body.doubt);

		const newDoubt = await doubtsData.askDoubt(uid, doubt);

		return res.status(200).json(newDoubt);
	} catch (error) {
		console.error(error);
		return res.status(500).json("doubt addition unsuccessful");
	}
});

export default router;
