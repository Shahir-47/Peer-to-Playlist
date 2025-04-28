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
const sampleSavedTrackIds = [
	"0MWUDWyvXuwJzA4yR1dmZJ",
	"7dSCxR4LqkmxoBrq9MzVSD",
	"2oBOaqeWSenwf7M6bJyR1A",
	"71Xtu0sdK3X4EyUKiPjylF",
	"7MXlyK9MD4A3ZhDoaqA7C7",
	"3MjUtNVVq3C8Fn0MP3zhXa",
	"1z3ugFmUKoCzGsI6jdY4Ci",
	"4ylWMuGbMXNDgDd8lErEle",
	"0B9x2BRHqj3Qer7biM3pU3",
	"7wCmS9TTVUcIhRalDYFgPy",
];
const sampleFollowedIds = [
	"0tIqhSs5ERm2J1cOcbxTq5",
	"0ONHkAv9pCAFxb0zJwDNTy",
	"5K4W6rqBFWDnAN6FQUkS6x",
	"0YC192cP3KPCRWx8zr8MfZ",
	"6zFYqv1mOsgBRQbae3JJ9e",
	"1Xyo4u8uXC1ZmMpatF05PJ",
];

const names = [
	"Alex",
	"Blake",
	"Casey",
	"Dana",
	"Elliot",
	"Frankie",
	"Jordan",
	"Kai",
	"Morgan",
	"Pat",
	"Quinn",
	"Riley",
	"Rowan",
	"Sam",
	"Taylor",
	"Terry",
	"Billie",
	"Cameron",
	"Chris",
	"Jamie",
	"Lee",
	"Skyler",
];

const styleNames = [
	"adventurer",
	"adventurer-neutral",
	"avataaars",
	"avataaars-neutral",
	"big-ears",
	"big-ears-neutral",
	"big-smile",
	"bottts",
	"bottts-neutral",
	"croodles",
	"croodles-neutral",
	"dylan",
	"fun-emoji",
	"glass",
	"icons",
	"identicon",
	"initials",
	"lorelei",
	"lorelei-neutral",
	"micah",
	"miniavs",
	"notionists",
	"notionists-neutral",
	"open-peeps",
	"personas",
	"pixel-art",
	"pixel-art-neutral",
	"rings",
	"shapes",
	"thumbs",
];

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

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pick = (arr, n) => {
	const copy = [...arr].sort(() => 0.5 - Math.random());
	return copy.slice(0, n);
};

const generateBio = () => pick(bioDescriptors, 3).join(" | ");

const avatars = names.map((_, i) => {
	const style = pickOne(styleNames);
	const seed = encodeURIComponent(names[i]);
	return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
});

const generateSpotifyData = () => {
	const now = Date.now();
	return {
		id: uuidv4(),
		accessToken: uuidv4().replace(/-/g, ""),
		refreshToken: uuidv4().replace(/-/g, ""),
		expiresAt: new Date(now + 3600 * 1000), // 1 hr from now
		topArtists: pick(sampleArtistIds, 5),
		topTracks: pick(sampleTrackIds, 8),
		savedTracks: pick(sampleSavedTrackIds, 5),
		followedArtists: pick(sampleFollowedIds, 4),
	};
};

const generateRandomUser = (i) => {
	const name = names[i];
	const age = 21 + Math.floor(Math.random() * 25); // 21–45
	const email = `${name.toLowerCase()}${age}@example.com`;
	return {
		name,
		email,
		password: bcrypt.hashSync("password123", 10),
		age,
		bio: generateBio(),
		image: avatars[i],
		spotify: generateSpotifyData(),
	};
};

const EXCLUDE_EMAILS = new Set([
	"shahirahmed30@gmail.comty".toLowerCase(),
	"tEST@123.COM".toLowerCase(),
]);

const seed = async () => {
	await mongoose.connect(process.env.MONGO_URI);

	// Remove all users except those we want to keep
	await User.deleteMany({
		email: { $nin: Array.from(EXCLUDE_EMAILS) },
	});

	const users = [];
	let i = 0,
		count = 0;
	while (count < 5 && i < names.length) {
		const candidate = generateRandomUser(i);
		if (!EXCLUDE_EMAILS.has(candidate.email.toLowerCase())) {
			users.push(candidate);
			count++;
		}
		i++;
	}

	await User.insertMany(users);
	console.log("Seeded", users.length, "users with Spotify data");

	mongoose.disconnect();
};

seed().catch(console.error);
