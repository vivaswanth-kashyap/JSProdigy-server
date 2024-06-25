import express from "express";
import { listVideos } from "../data/videos.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const videos = await listVideos();
		return res.status(200).json({
			title: "Full Stack Web Development with JavaScript",
			description: "This course is extremely comprehensive",
			videos: videos,
		});
	} catch (error) {
		console.error("Error fetching course data:", error);
		res.status(500).json({ error: "Failed to fetch course data" });
	}
});

export default router;
