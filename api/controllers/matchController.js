import User from "../models/User.js";
import { makeSpotifyClient } from "../utils/spotifyClientFactory.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// simple in-memory caches
const spotifyNameCache = {
	artists: new Map(),
	tracks: new Map(),
};

async function fetchArtistNames(client, ids) {
	const unknown = ids.filter((id) => !spotifyNameCache.artists.has(id));
	if (unknown.length) {
		const { body } = await client.getArtists(unknown);
		body.artists.forEach((a) => {
			spotifyNameCache.artists.set(a.id, a.name);
		});
	}
	return ids.map((id) => ({
		id,
		name: spotifyNameCache.artists.get(id) || id,
	}));
}

async function fetchTrackNames(client, ids) {
	const unknown = ids.filter((id) => !spotifyNameCache.tracks.has(id));
	if (unknown.length) {
		const { body } = await client.getTracks(unknown);
		body.tracks.forEach((t) => {
			spotifyNameCache.tracks.set(t.id, t.name);
		});
	}
	return ids.map((id) => ({
		id,
		name: spotifyNameCache.tracks.get(id) || id,
	}));
}

export const swipeRight = async (req, res) => {
	try {
		const { likedUserId } = req.params;

		// Get current and liked user from the DB
		const currentUser = await User.findById(req.user.id);
		const likedUser = await User.findById(likedUserId);

		// If liked user doesn't exist, send error
		if (!likedUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// If user hasn't already liked this person
		if (!currentUser.likes.includes(likedUserId)) {
			currentUser.likes.push(likedUserId); // add the liked user to the current user's likes array field
			await currentUser.save();

			// Check if it's a match (i.e., they liked each other)
			if (likedUser.likes.includes(currentUser.id)) {
				currentUser.matches.push(likedUserId); // add the current user to the liked user's matches array field
				likedUser.matches.push(currentUser.id);

				// Save both users in parallel
				await Promise.all([await currentUser.save(), await likedUser.save()]);

				// Send real-time match notifications using Socket.IO
				const connectedUsers = getConnectedUsers();
				const io = getIO();

				// Notify the liked user (if they're online)
				const likedUserSocketId = connectedUsers.get(likedUserId);
				if (likedUserSocketId) {
					io.to(likedUserSocketId).emit("newMatch", {
						_id: currentUser._id,
						name: currentUser.name,
						image: currentUser.image,
					});
				}

				// Notify the current user (if they're online)
				const currentSocketId = connectedUsers.get(currentUser._id.toString());
				if (currentSocketId) {
					io.to(currentSocketId).emit("newMatch", {
						_id: likedUser._id,
						name: likedUser.name,
						image: likedUser.image,
					});
				}
			}
		}

		res.status(200).json({
			success: true,
			user: currentUser,
		});
	} catch (error) {
		console.log("Error in swipeRight: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const swipeLeft = async (req, res) => {
	try {
		const { dislikedUserId } = req.params;
		const currentUser = await User.findById(req.user.id);

		// If not already disliked, add to dislikes list
		if (!currentUser.dislikes.includes(dislikedUserId)) {
			currentUser.dislikes.push(dislikedUserId);
			await currentUser.save();
		}

		res.status(200).json({
			success: true,
			user: currentUser,
		});
	} catch (error) {
		console.log("Error in swipeLeft: ", error);

		res.status(500).json({
			success: false,
			message: "Internal service error",
		});
	}
};

export const getMatches = async (req, res) => {
	try {
		// load current user
		const currentUser = await User.findById(req.user.id);
		const client = await makeSpotifyClient(
			currentUser.spotify,
			currentUser._id
		);

		// fetch full User docs for each matched ID
		const matchedUsers = await User.find({ _id: { $in: currentUser.matches } });

		// collect IDs for batch name lookup
		const allArtistIds = new Set();
		const allTrackIds = new Set();

		// compute overlaps & score
		const scored = matchedUsers.map((other) => {
			const mine = currentUser.spotify || {};
			const theirs = other.spotify || {};

			const commonArtists = (theirs.topArtists || []).filter((id) =>
				(mine.topArtists || []).includes(id)
			);
			const commonTracks = (theirs.topTracks || []).filter((id) =>
				(mine.topTracks || []).includes(id)
			);
			const commonSaved = (theirs.savedTracks || []).filter((id) =>
				(mine.savedTracks || []).includes(id)
			);
			const commonFollowed = (theirs.followedArtists || []).filter((id) =>
				(mine.followedArtists || []).includes(id)
			);

			commonArtists.forEach((id) => allArtistIds.add(id));
			commonTracks.forEach((id) => allTrackIds.add(id));
			commonSaved.forEach((id) => allTrackIds.add(id));
			commonFollowed.forEach((id) => allArtistIds.add(id));

			const score =
				commonArtists.length * 3 +
				commonTracks.length * 2 +
				commonSaved.length * 1 +
				commonFollowed.length * 1;

			return {
				other,
				score,
				commonArtists,
				commonTracks,
				commonSaved,
				commonFollowed,
			};
		});

		// fetch human names in bulk
		await fetchArtistNames(client, [...allArtistIds]);
		await fetchTrackNames(client, [...allTrackIds]);

		// sort by score descending
		scored.sort((a, b) => b.score - a.score);

		// build payload
		const matches = scored.map(
			({
				other,
				score,
				commonArtists,
				commonTracks,
				commonSaved,
				commonFollowed,
			}) => ({
				_id: other._id,
				name: other.name,
				image: other.image,
				age: other.age,
				bio: other.bio,
				commonArtists: commonArtists.map((id) => ({
					id,
					name: spotifyNameCache.artists.get(id),
				})),
				commonTracks: commonTracks.map((id) => ({
					id,
					name: spotifyNameCache.tracks.get(id),
				})),
				commonSaved: commonSaved.map((id) => ({
					id,
					name: spotifyNameCache.tracks.get(id),
				})),
				commonFollowed: commonFollowed.map((id) => ({
					id,
					name: spotifyNameCache.artists.get(id),
				})),
			})
		);

		return res.status(200).json({ success: true, matches });
	} catch (err) {
		console.error("Error in getMatches:", err);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const getUserProfiles = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user.id);

		const client = await makeSpotifyClient(
			currentUser.spotify,
			currentUser._id
		);

		const excludeIds = [
			currentUser._id,
			...currentUser.likes,
			...currentUser.dislikes,
			...currentUser.matches,
		];

		const candidates = await User.find({
			_id: { $nin: excludeIds },
		});

		// gather all common IDs to batch-fetch names
		const allArtistIds = new Set();
		const allTrackIds = new Set();

		// first pass: compute overlaps
		const scored = candidates.map((u) => {
			const theirs = u.spotify || {};
			const mine = currentUser.spotify || {};

			const commonArtists = (theirs.topArtists || []).filter((a) =>
				(mine.topArtists || []).includes(a)
			);
			const commonTracks = (theirs.topTracks || []).filter((t) =>
				(mine.topTracks || []).includes(t)
			);
			const commonSaved = (theirs.savedTracks || []).filter((s) =>
				(mine.savedTracks || []).includes(s)
			);

			const commonFollowed = (theirs.followedArtists || []).filter((a) =>
				(mine.followedArtists || []).includes(a)
			);

			commonArtists.forEach((id) => allArtistIds.add(id));
			commonTracks.forEach((id) => allTrackIds.add(id));
			commonSaved.forEach((id) => allTrackIds.add(id));
			commonFollowed.forEach((id) => allArtistIds.add(id));

			const score =
				commonArtists.length * 3 +
				commonTracks.length * 2 +
				commonSaved.length * 1 +
				commonFollowed.length * 1;

			return {
				user: u,
				score,
				commonArtists,
				commonTracks,
				commonSaved,
				commonFollowed,
			};
		});

		// now batch-fetch human names
		await fetchArtistNames(client, [...allArtistIds]);
		await fetchTrackNames(client, [...allTrackIds]);

		// sort descending
		scored.sort((a, b) => b.score - a.score);

		// build payload
		const users = scored.map((s) => ({
			_id: s.user._id,
			name: s.user.name,
			image: s.user.image,
			age: s.user.age,
			bio: s.user.bio,
			score: s.score,
			commonArtists: s.commonArtists.map((id) => ({
				id,
				name: spotifyNameCache.artists.get(id),
			})),
			commonTracks: s.commonTracks.map((id) => ({
				id,
				name: spotifyNameCache.tracks.get(id),
			})),
			commonSaved: s.commonSaved.map((id) => ({
				id,
				name: spotifyNameCache.tracks.get(id),
			})),
			commonFollowed: s.commonFollowed.map((id) => ({
				id,
				name: spotifyNameCache.artists.get(id),
			})),
		}));

		res.status(200).json({ success: true, users });
	} catch (err) {
		console.error("Error in getUserProfiles:", err);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};
