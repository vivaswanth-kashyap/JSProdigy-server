import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		return res.render("homePage", { title: "jsProdigy" });
	} catch (error) {
		return res.status(500).json(error);
	}
});

export default router;
