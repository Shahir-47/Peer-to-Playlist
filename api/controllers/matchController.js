import User from "../models/User";

export const swipeRight = async (req, res) => {
	try {
		const { likedUserId } = req.params;
		const currentUser = await User.findById(req.user.id);
		const likedUser = await User.findById(likedUserId);

		if (!likedUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (!currentUser.likes.includes(likedUserId)) {
			currentUser.likes.push(likedUserId); // add the liked user to the current user's likes array
			await currentUser.save();

			// if the liked user has already liked the current user, add them to each other's matches
			if (likedUser.likes.includes(currentUser.id)) {
				currentUser.matches.push(likedUserId);
				likedUser.matches.push(currentUser.id);

				//TODO: Send notification if it is a match => socket.io

				// saves the matches at the same time
				await Promise.all([await currentUser.save(), await likedUser.save()]);
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
		const dislikedUserId = req.params;
		const currentUser = await User.findById(req.user.id);

		if (!currentUser.dislikes.includes(dislikedUserId)) {
			currentUser.dislikes.push(dislikeUserId);
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
		// The 'matches' field contains references (ObjectIds) to other user documents — similar to foreign keys in SQL.
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
