import express from "express";
import { getVideoDetails } from "../data/videos.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
	const videoId = req.params.id;
	try {
		console.log(`Fetching details for video: ${videoId}`);
		const videoDetails = await getVideoDetails(videoId);
		res.json(videoDetails);
	} catch (error) {
		console.error("Error processing video:", error);
		res
			.status(500)
			.json({ error: "Failed to process video", details: error.message });
	}
});

export default router;
