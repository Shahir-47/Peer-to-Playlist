// scripts/seedUsersWithSpotify.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// pools of real-looking Spotify IDs
const sampleArtistIds = [
	"5K4W6rqBFWDnAN6FQUkS6x",
	"7dGJo4pcD2V6oG8kP0tJRR",
	"2YZyLoL8N0Wb9xBt1NhZWg",
	"5pKCCKE2ajJHZ9KAiaK11H",
	"53XhwfbYqKCa1cC15pYq2q",
	"5INjqkS1o8h1imAzPqGZBb",
	"711MCceyCBcFnzjGY4Q7Un",
	"7Ln80lUS6He07XvHI8qqHH",
];
const sampleTrackIds = [
	"32A1xdQk9lRSFn5CEY5M2S",
	"1i6N76fftMZhijOzFQ5ZtL",
	"07oO1U722crtVcavi6frX6",
	"5TRPicyLGbAF2LGBFbHGvO",
	"2HHtWyy5CgaQbC7XSoOb0e",
	"5JVbvCHX10U2pLa5DEqGav",
	"6NdoWfQdyDIgMX6D2ugS9T",
	"62yJjFtgkhUrXktIoSjgP2",
	"2oBOaqeWSenwf7M6bJyR1A",
	"4xigPf2sigSPmuFH3qCelB",
];
const sampleFollowed = [
	"0tIqhSs5ERm2J1cOcbxTq5",
	"0ONHkAv9pCAFxb0zJwDNTy",
	"5K4W6rqBFWDnAN6FQUkS6x",
	"0YC192cP3KPCRWx8zr8MfZ",
	"6zFYqv1mOsgBRQbae3JJ9e",
	"1Xyo4u8uXC1ZmMpatF05PJ",
];

const maleNames = [
	"James",
	"John",
	"Robert",
	"Michael",
	"William",
	"David",
	"Richard",
	"Joseph",
	"Thomas",
];
const femaleNames = [
	"Mary",
	"Patricia",
	"Jennifer",
	"Linda",
	"Elizabeth",
	"Barbara",
	"Susan",
	"Jessica",
	"Sarah",
	"Karen",
	"Nancy",
	"Lisa",
];
const genderPreferences = ["male", "female", "both"];
const bioDescriptors = [
	"Coffee addict",
	"Cat lover",
	"Dog person",
	"Foodie",
	"Gym rat",
	"Bookworm",
	"Movie buff",
	"Music lover",
	"Travel junkie",
	"Beach bum",
	"City slicker",
	"Outdoor enthusiast",
	"Netflix binger",
	"Yoga enthusiast",
	"Craft beer connoisseur",
	"Sushi fanatic",
	"Adventure seeker",
	"Night owl",
	"Early bird",
	"Aspiring chef",
];

const pick = (arr, n) => {
	const copy = [...arr].sort(() => 0.5 - Math.random());
	return copy.slice(0, n);
};

const generateBio = () => pick(bioDescriptors, 3).join(" | ");

const generateSpotifyData = () => {
	const now = Date.now();
	return {
		id: uuidv4(),
		accessToken: uuidv4().replace(/-/g, ""),
		refreshToken: uuidv4().replace(/-/g, ""),
		expiresAt: new Date(now + 3600 * 1000), // 1 hr from now
		topArtists: pick(sampleArtistIds, 5),
		topTracks: pick(sampleTrackIds, 8),
		savedTracks: pick(sampleTrackIds, 5),
		followedArtists: pick(sampleFollowed, 4),
	};
};

const generateRandomUser = (gender, i) => {
	const names = gender === "male" ? maleNames : femaleNames;
	const name = names[i % names.length];
	const age = 21 + Math.floor(Math.random() * 25); // 21–45
	const email = `${name.toLowerCase()}${age}@example.com`;
	return {
		name,
		email,
		password: bcrypt.hashSync("password123", 10),
		age,
		gender,
		genderPreference: pick(genderPreferences, 1)[0],
		bio: generateBio(),
		image: `/${gender}/${(i % 5) + 1}.jpg`,
		spotify: generateSpotifyData(),
	};
};

const seed = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	await User.deleteMany({});
	const users = [
		...maleNames.map((_, i) => generateRandomUser("male", i)),
		...femaleNames.map((_, i) => generateRandomUser("female", i)),
	];
	await User.insertMany(users);
	console.log("Seeded", users.length, "users with Spotify data");
	mongoose.disconnect();
};

seed().catch(console.error);
