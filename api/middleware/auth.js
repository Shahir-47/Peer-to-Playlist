import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes by verifying JWT tokens.
 * This middleware checks if the request has a valid JWT token in the cookies.
 * If the token is valid, it retrieves the user from the database and attaches it to the request object.
 * If the token is invalid or not present, it sends an unauthorized response.
 *
 */
export const protectedRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - No token provided",
			});
		}

		// Verify the token using the secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - Invalid token",
			});
		}

		// Find the user by ID from the decoded token
		const currentUser = await User.findById(decoded.id);

		req.user = currentUser;

		next();
	} catch (error) {
		console.log("Error in auth middleware: ", error);

		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - Invalid token",
			});
		} else {
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
};
