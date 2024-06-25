import express from "express";
import { getVideoUrl } from "../data/videos.js";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import stream from "stream";

const router = express.Router();

router.get("/:key", async (req, res) => {
	let ffmpegCommand;
	try {
		const videoKey = req.params.key;
		console.log(`Generating URL for video: ${videoKey}`);
		const url = await getVideoUrl(videoKey);

		const response = await axios.get(url, { responseType: "stream" });

		res.setHeader("Content-Type", "video/mp4");

		ffmpegCommand = ffmpeg(response.data)
			.outputFormat("mp4")
			.videoCodec("libx264")
			.audioCodec("aac")
			.on("start", (commandLine) => {
				console.log("FFmpeg started with command:", commandLine);
			})
			.on("progress", (progress) => {
				console.log("FFmpeg progress:", progress);
			})
			.on("error", (err, stdout, stderr) => {
				console.error("FFmpeg error:", err.message);
				console.error("FFmpeg stdout:", stdout);
				console.error("FFmpeg stderr:", stderr);
				if (!res.headersSent) {
					res
						.status(500)
						.json({ error: "Error processing video", details: err.message });
				}
			})
			.on("end", () => {
				console.log("FFmpeg processing finished");
			});

		ffmpegCommand.pipe(res, { end: true });
	} catch (error) {
		console.error("Error streaming video:", error);
		if (!res.headersSent) {
			res
				.status(500)
				.json({ error: "Failed to stream video", details: error.message });
		}
	}

	// Clean up FFmpeg process if the client disconnects
	req.on("close", () => {
		if (ffmpegCommand) {
			ffmpegCommand.kill("SIGKILL");
		}
	});
});

export default router;
