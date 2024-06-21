import userRoutes from "./users.js";
import videoRoutes from "./videos.js";
import doubtRoutes from "./doubts.js";
import homePageRoutes from "./home.js";

const constructorMethod = (app) => {
	app.use("/", homePageRoutes);
	app.use("/users", userRoutes);
	app.use("/videos", videoRoutes);
	app.use("/doubts", doubtRoutes);

	app.use("*", (req, res) => {
		return res.json("Not found");
	});
};

export default constructorMethod;
