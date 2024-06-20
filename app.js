import express from "express";
import cors from "cors";
import configRoutes from "./routes/index.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	cors({
		origin: ["*"],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
