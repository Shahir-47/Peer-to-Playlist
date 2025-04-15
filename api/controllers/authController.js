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
	const { name, email, password, age, gender, genderPreference } = req.body;

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

		// create user
		const newUser = await User.create({
			name,
			email,
			password,
			age,
			gender,
			genderPreference,
		});

		// Sign a JWT token with the new user's ID
		const token = signToken(newUser._id);

		// Set the JWT token as an HTTP-only cookie
		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
			sameSite: "strict", // Helps prevent CSRF attacks
			secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
		});

		res.status(201).json({
			success: true,
			user: newUser,
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
