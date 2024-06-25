import express from "express";
import { getVideoUrl } from "../data/videos.js";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/:key", async (req, res) => {
	const videoKey = req.params.key;
	const tempDir = path.join(__dirname, "../temp");
	const inputPath = path.join(tempDir, `${uuidv4()}_input.mov`);
	const outputPath = path.join(tempDir, `${uuidv4()}_output.mp4`);

	try {
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}

		console.log(`Generating URL for video: ${videoKey}`);
		const url = await getVideoUrl(videoKey);

		console.log("Downloading video...");
		const response = await axios({
			method: "get",
			url: url,
			responseType: "stream",
		});

		const writer = fs.createWriteStream(inputPath);
		response.data.pipe(writer);

		await new Promise((resolve, reject) => {
			writer.on("finish", resolve);
			writer.on("error", reject);
		});

		console.log("Video downloaded. Starting conversion...");

		await new Promise((resolve, reject) => {
			ffmpeg(inputPath)
				.outputOptions([
					"-c:v libx264",
					"-crf 23",
					"-preset medium",
					"-c:a aac",
					"-b:a 128k",
				])
				.output(outputPath)
				.on("end", () => {
					console.log("Conversion finished");
					resolve();
				})
				.on("error", (err) => {
					console.error("Error:", err);
					reject(err);
				})
				.run();
		});

		console.log("Sending converted video...");
		res.sendFile(outputPath, () => {
			// Clean up temporary files after sending
			fs.unlinkSync(inputPath);
			fs.unlinkSync(outputPath);
		});
	} catch (error) {
		console.error("Error processing video:", error);
		res
			.status(500)
			.json({ error: "Failed to process video", details: error.message });
	}
});

export default router;
