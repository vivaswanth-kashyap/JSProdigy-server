import Vimeo from "vimeo";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new Vimeo.Vimeo(
	process.env.VIMEO_CLIENT_ID,
	process.env.VIMEO_CLIENT_SECRET,
	process.env.VIMEO_ACCESS_TOKEN
);

export const listVideos = async () => {
	return new Promise((resolve, reject) => {
		client.request(
			{
				method: "GET",
				path: "/me/videos",
			},
			(error, body, status_code, headers) => {
				if (error) {
					console.error("Error listing videos:", error);
					reject(error);
				} else {
					console.log("Successfully listed videos");
					resolve(
						body.data.map((video) => ({
							key: video.uri.split("/").pop(),
							name: video.name,
							description: video.description,
							duration: video.duration,
							thumbnail: video.pictures.sizes[2].link,
						}))
					);
				}
			}
		);
	});
};

export const getVideoDetails = async (videoId) => {
	return new Promise((resolve, reject) => {
		client.request(
			{
				method: "GET",
				path: `/videos/${videoId}`,
			},
			(error, body, status_code, headers) => {
				if (error) {
					console.error("Error getting video details:", error);
					reject(error);
				} else {
					console.log("Successfully retrieved video details");
					resolve({
						id: videoId,
						name: body.name,
						description: body.description,
						duration: body.duration,
						embed: body.embed.html,
					});
				}
			}
		);
	});
};
