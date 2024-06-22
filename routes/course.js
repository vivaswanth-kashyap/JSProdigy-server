import express from "express";
import xss from "xss";

const router = express.Router();

router.get("/", async (req, res) => {
	return res.status(200).json({
		title: "Full Stack Web development with javascript",
		description: "This course is extremely comprehensive",
		videoIds: ["965167835"],
	});
});

export default router;
