import express from "express";
import { listVideos, getVideoUrl } from "../data/videos.js";

const router = express.Router();

// Get list of all videos
router.get("/", async (req, res) => {
	try {
		const videos = await listVideos();
		res.json(videos);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve videos" });
	}
});

// Get signed URL for a specific video
router.get("/:key", async (req, res) => {
	try {
		const videoKey = decodeURIComponent(req.params.key);
		const url = await getVideoUrl(videoKey);
		res.json({ url });
	} catch (error) {
		res.status(500).json({ error: "Failed to generate video URL" });
	}
});

export default router;
