import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const listVideos = async () => {
	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
	};

	try {
		const data = await s3.listObjectsV2(params).promise();
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

const getVideoUrl = async (key) => {
	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: key,
		Expires: 3600, // URL will be valid for 1 hour
	};

	try {
		return await s3.getSignedUrlPromise("getObject", params);
	} catch (error) {
		console.error("Error generating signed URL:", error);
		throw error;
	}
};

export { listVideos, getVideoUrl };
