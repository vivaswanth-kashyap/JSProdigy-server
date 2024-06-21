import express from "express";
import cors from "cors";
import configRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	cors({
		origin: [
			"https://jsprodigy.netlify.app",
			"https://jsprodigy.com",
			"http://localhost:3000",
		],
		credentials: true,
	})
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
	"handlebars",
	exphbs.engine("handlebars", {
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "views/layouts"),
		partialsDir: path.join(__dirname, "views/partials"),
	})
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
