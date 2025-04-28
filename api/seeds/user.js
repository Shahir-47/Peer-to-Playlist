// scripts/seedUsersWithSpotify.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// pools of real-looking Spotify IDs
const sampleArtistIds = [
	"25uiPmTg16RbhZWAqwLBy5",
	"3WrFJ7ztbogyGnTHbHJFl2",
	"4E2rKHVDssGJm2SCDOMMJB",
	"1HY2Jd0NmPuamShAr6KMms",
	"163tK9Wjr9P9DmM0AVK7lm",
	"2FXC3k01G6Gw61bmprjgqS",
	"1dfeR4HaWDbWqFHLkxsg1d",
	"7GlBOeep6PqTfFi59PTUUN",
	"4Ge8xMJNwt6EEXOzVXju9a",
	"6ogn9necmbUdCppmNnGOdi",
];
const sampleTrackIds = [
	"1RGidCmtrqER8GBs8TnG9C",
	"3LPLRNr58Z9Pn0clnEtkXb",
	"3QQvSQKV8YmQxGolwwWe59",
	"6nCDnzErqalOaIY3EJM8NK",
	"2LHNTC9QZxsL3nWpt8iaSR",
	"1qKCO2Tocwg8CbepJ9uDtd",
	"2grSOc6HNTXQQXNoRKt9UM",
	"4U45aEWtQhrm8A5mxPaFZ7",
	"1eGgMQyOubLxfZjbROuAR4",
	"5xHgo5JN0wfsV41HnRaos5",
];
const sampleSavedTrackIds = [
	"2jNyiavSywmA472t2m6ZBz",
	"74hD8ZuQLIZyCr597HHAqJ",
	"480rD34KfGbMaT0L6zjeIu",
	"1SdQjKRW52cHg2SEesQLvH",
	"2UcHKgT00bLP7Cjkni3Itg",
	"2GmkHeyjEPiFvpDXvPNKz4",
	"2rvd6akG8qEtBNUvQpN7iY",
	"5IoPnNiYAOvHHJpz13wzRL",
	"0Tqn5Th0wk55eLdga96vZM",
	"5R8dQOPq8haW94K7mgERlO",
];
const sampleFollowedIds = [
	"4nMJn2aEg3mpEwu628igXN",
	"6ogn9necmbUdCppmNnGOdi",
	"5aFcMsQsWLZGtGzvKFH8rF",
	"163tK9Wjr9P9DmM0AVK7lm",
	"0xGUDWjjHnCpSb1VziwRPy",
	"5T2Coe8lhc6gbkB4Sxd0jK",
	"60ae7SALlruTtEbp0JJuRg",
	"5gewx7W06vXxgSpmOWiPqm",
	"43R8Umt7qVmJCcOZGWJy24",
	"0tIqhSs5ERm2J1cOcbxTq5",
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
