import { isObjectIdOrHexString } from "mongoose";
import User from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

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
		// Get the current user's document from the database using their ID.
		// The 'matches' field contains references (ObjectIds) to other users document — similar to foreign keys in SQL.
		// Using populate(), we replace those ObjectIds with the actual user data they point to,
		// selecting only each matched user's 'name' and 'image' (plus '_id', which is included by default).
		// In the end, 'user.matches' will be an array of user objects with: { _id, name, image }.
		const user = await User.findById(req.user.id).populate(
			"matches",
			"name image"
		);

		res.status(200).json({
			success: true,
			matches: user.matches,
		});
	} catch (error) {
		console.log("Error in getMatches: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const getUserProfiles = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user.id);

		const users = await User.find({
			// exclude current user
			$and: [
				{ _id: { $ne: currentUser.id } }, // ne means not equal (so exclude current user)
				{ _id: { $nin: currentUser.likes } }, // nin means not in (so exclude all the users that are in the likes array)
				{ _id: { $nin: currentUser.dislikes } }, // nin means not in (so exclude all the users that are in the dislikes array)
				{ _id: { $nin: currentUser.matches } }, // nin means not in (so exclude all the users that are in the matches array)
				// find users that match the current user's genderPreference
				{
					gender:
						currentUser.genderPreference === "both"
							? {
									$in: ["male", "female"], // if genderPreference is both, show all users
							  }
							: currentUser.genderPreference, // else show only the users that match the genderPreference
				},
				// makes sure that the other user has the same genderPreference as the current user
				{ genderPreference: { $in: [currentUser.gender, "both"] } },
			],
		});

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		console.log("Error in getUserProfiles: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
