import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log(
	"AWS_ACCESS_KEY_ID:",
	process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not set"
);
console.log(
	"AWS_SECRET_ACCESS_KEY:",
	process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Not set"
);
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!BUCKET_NAME) {
	console.error("S3_BUCKET_NAME is not set in the environment variables");
	process.exit(1);
}

export const listVideos = async () => {
	const params = {
		Bucket: BUCKET_NAME,
	};

	try {
		console.log("Attempting to list videos from bucket:", BUCKET_NAME);
		const data = await s3.listObjectsV2(params).promise();
		console.log("Successfully listed videos");
		return data.Contents.map((object) => ({
			key: object.Key,
			size: object.Size,
			lastModified: object.LastModified,
		}));
	} catch (error) {
		console.error("Error listing videos:", error);
		throw error;
	}
};

export const getVideoUrl = async (key) => {
	const params = {
		Bucket: BUCKET_NAME,
		Key: key,
		Expires: 3600, // URL will be valid for 1 hour
	};

	try {
		console.log("Generating signed URL for key:", key);
		const url = await s3.getSignedUrlPromise("getObject", params);
		console.log("Successfully generated signed URL");
		return url;
	} catch (error) {
		console.error("Error generating signed URL:", error);
		throw error;
	}
};
