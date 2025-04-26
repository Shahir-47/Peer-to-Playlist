import { makeSpotifyClient } from "../utils/spotifyClientFactory.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * Function to sign a JWT token.
 * This function takes a user ID and generates a JWT token using a secret key.
 * The token is set to expire in 7 days.
 */
const signToken = (id) => {
	// jwt token
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

export const signup = async (req, res) => {
	const {
		name,
		email,
		password,
		age,
		gender,
		genderPreference,
		spotify: spotifyTokens,
	} = req.body;

	try {
		if (!name || !email || !password || !age || !gender || !genderPreference) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		if (age < 18) {
			return res
				.status(400)
				.json({ success: false, message: "You must be at least 18 years old" });
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long",
			});
		}

		const user = new User({
			name,
			email,
			password,
			age,
			gender,
			genderPreference,
		});

		//------------ Spotify processing ------------

		if (spotifyTokens?.access_token) {
			// Save Spotify tokens to the user object

			user.spotify.accessToken = spotifyTokens.access_token;
			user.spotify.refreshToken = spotifyTokens.refresh_token;
			user.spotify.expiresAt = new Date(
				Date.now() + spotifyTokens.expires_in * 1000
			);

			// Fetch Spotify data
			try {
				const client = await makeSpotifyClient(
					{
						accessToken: spotifyTokens.access_token,
						refreshToken: spotifyTokens.refresh_token,
						expiresAt: new Date(Date.now() + spotifyTokens.expires_in * 1000),
					},
					user._id
				);

				// Profile
				const { body: profile } = await client.getMe();
				user.spotify.id = profile.id;

				// Top Artists
				try {
					const { body: artistsData } = await client.getMyTopArtists({
						limit: 10,
					});
					user.spotify.topArtists = artistsData.items.map((a) => a.id);
				} catch (err) {
					console.error("getMyTopArtists failed:", err.body?.error || err);
				}

				// Top Tracks
				try {
					const { body: tracksData } = await client.getMyTopTracks({
						limit: 10,
					});
					user.spotify.topTracks = tracksData.items.map((t) => t.id);
				} catch (err) {
					console.error("getMyTopTracks failed:", err.body?.error || err);
				}

				// Saved Tracks
				try {
					const { body: savedData } = await client.getMySavedTracks({
						limit: 10,
					});
					user.spotify.savedTracks = savedData.items.map((i) => i.track.id);
				} catch (err) {
					console.error("getMySavedTracks failed:", err.body?.error || err);
				}

				// Followed Artists
				try {
					const { body: followData } = await client.getFollowedArtists({
						limit: 10,
					});
					user.spotify.followedArtists = followData.artists.items.map(
						(a) => a.id
					);
				} catch (err) {
					console.error("getFollowedArtists failed:", err.body?.error || err);
				}
			} catch (err) {
				console.error(
					"Overall Spotify data fetch failed:",
					err.body?.error || err
				);
			}
		}

		await user.save();

		// Sign a JWT token with the new user's ID
		const token = signToken(user._id);

		// Set the JWT token as an HTTP-only cookie
		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
			sameSite: "strict", // Helps prevent CSRF attacks
			secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
		});

		res.status(201).json({
			success: true,
			user: user,
		});
	} catch (error) {
		console.log("Error in signup controller:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		// Find the user by email and include the password field for verification
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.matchPassword(password))) {
			// If user not found or password doesn't match
			return res
				.status(401)
				.json({ success: false, message: "Invalid email or password" });
		}

		// If user is found and password matches, sign a JWT token
		const token = signToken(user._id);

		// Set the JWT token as an HTTP-only cookie
		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			httpOnly: true, // prevents client-side JavaScript from accessing the cookie
			sameSite: "strict", // prevents csrf attacks
			secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
		});

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.log("Error in login controller:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const logout = async (req, res) => {
	res.clearCookie("jwt"); // Clear the JWT cookie
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
