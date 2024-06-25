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
	const updatedInfo = await doubtsCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $push: { replies: newReply } },
		{ returnDocument: "after" }
	);
	if (!updatedInfo.value) {
		throw "could not update doubt with new reply";
	}
	return findDoubt(id);
};

export { askDoubt, findAllDoubts, findDoubt, addReply };
