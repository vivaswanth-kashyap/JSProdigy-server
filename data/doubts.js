import { doubts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const askDoubt = async (uid, doubt) => {
	doubt = doubt.trim();

	const newDoubt = {
		uid: uid,
		doubt: doubt,
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
		throw "couldn;t get all doubts";
	}

	return doubtsList;
};

export { askDoubt, findAllDoubts, findDoubt };
