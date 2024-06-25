import { doubts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const askDoubt = async (uid, doubt) => {
	doubt = doubt.trim();
	const newDoubt = {
		uid: uid,
		doubt: doubt,
		replies: [],
	};
	const doubtsCollection = await doubts();
	const insertInfo = await doubtsCollection.insertOne(newDoubt);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {
		throw "could not add a question";
	}
	const newId = insertInfo.insertedId.toString();
	const the_doubt = await findDoubt(newId);
	return the_doubt;
};

const findDoubt = async (id) => {
	const doubtsCollection = await doubts();
	const doubt = await doubtsCollection.findOne({
		_id: new ObjectId(id),
	});
	if (!doubt) {
		throw "No doubt with id";
	}
	doubt._id = doubt._id.toString();
	return doubt;
};

const findAllDoubts = async () => {
	const doubtsCollection = await doubts();
	const doubtsList = await doubtsCollection.find({}).toArray();
	if (!doubtsList) {
		throw "couldn't get all doubts";
	}
	return doubtsList.map((doubt) => {
		doubt._id = doubt._id.toString();
		return doubt;
	});
};

const addReply = async (uid, id, reply, isAI = false) => {
	const doubtsCollection = await doubts();
	const newReply = {
		uid: uid,
		reply: reply,
		isAI: isAI,
		timestamp: new Date(),
	};
	console.log("Adding reply:", { id, newReply });

	try {
		if (!ObjectId.isValid(id)) {
			throw new Error("Invalid doubt id format");
		}

		// First, check if the document exists
		const existingDoubt = await doubtsCollection.findOne({
			_id: new ObjectId(id),
		});
		if (!existingDoubt) {
			throw new Error(`No document found with id: ${id}`);
		}

		console.log("Existing doubt found:", existingDoubt);

		const updateResult = await doubtsCollection.updateOne(
			{ _id: new ObjectId(id) },
			{ $push: { replies: newReply } }
		);

		console.log("Update result:", updateResult);

		if (updateResult.modifiedCount === 0) {
			throw new Error(
				`Failed to update the document. Update result: ${JSON.stringify(
					updateResult
				)}`
			);
		}

		const updatedDoubt = await doubtsCollection.findOne({
			_id: new ObjectId(id),
		});
		console.log("Updated doubt:", updatedDoubt);
		return updatedDoubt;
	} catch (error) {
		console.error("Error in addReply:", error);
		throw error;
	}
};

export { askDoubt, findAllDoubts, findDoubt, addReply };
