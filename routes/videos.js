import express from "express";
import { listVideos, getVideoUrl } from "../data/videos.js";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import stream from "stream";

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

router.get("/:key", async (req, res) => {
	try {
		const videoKey = req.params.key;
		console.log(`Generating URL for video: ${videoKey}`);
		const url = await getVideoUrl(videoKey);

		const response = await axios.get(url, { responseType: "stream" });

		res.setHeader("Content-Type", "video/mp4");

		ffmpeg(response.data)
			.outputFormat("mp4")
			.videoCodec("libx264")
			.audioCodec("aac")
			.on("error", (err) => {
				console.error("An error occurred: " + err.message);
				res.status(500).send("Error processing video");
			})
			.pipe(res, { end: true });
	} catch (error) {
		console.error("Error streaming video:", error);
		res
			.status(500)
			.json({ error: "Failed to stream video", details: error.message });
	}
});

export default router;
