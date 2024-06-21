import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const addUser = async (
	uid,
	fname,
	lname,
	email,
	phone,
	dob,
	gender,
	occupation,
	educationLevel
) => {
	const newUser = {
		uid,
		fname,
		lname,
		email,
		phone,
		dob,
		gender,
		occupation,
		educationLevel,
	};
	const userCollection = await users();
	const insertInfo = await userCollection.insertOne(newUser);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {
		throw "could not add a user";
	}

	const newId = insertInfo.insertedId.toString();

	const user = await findUser(uid);

	return user;
};

const findUser = async (uid) => {
	const userCollection = await users();

	const user = await userCollection.findOne({ uid: uid });
	if (!user) {
		throw `No user with uid:${uid}`;
	}

	user._id = user._id.toString();
	return user;
};

export { addUser, findUser };
