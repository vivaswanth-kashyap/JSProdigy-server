import express from "express";
import { getVideoUrl } from "../data/videos.js";

const router = express.Router();

router.get("/:key", async (req, res) => {
	const videoKey = req.params.key;

	try {
		console.log(`Generating URL for video: ${videoKey}`);
		const url = await getVideoUrl(videoKey);

		// Instead of converting and sending the file, we'll return the signed URL
		res.json({ url: url });
	} catch (error) {
		console.error("Error processing video:", error);
		res
			.status(500)
			.json({ error: "Failed to process video", details: error.message });
	}
});

export default router;
