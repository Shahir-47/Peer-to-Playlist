import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/auth.js";

// Create a new Express router instance.
// A router is a mini Express application that can handle its own routes and middleware.
const router = express.Router();

// Define a POST route for user signup.
// When a POST request is made to "/signup", the signup controller function is called.
router.post("/signup", signup);

// Define a POST route for user login.
// When a POST request is made to "/login", the login controller function is called.
router.post("/login", login);

// Define a POST route for user logout.
// When a POST request is made to "/logout", the logout controller function is called.
router.post("/logout", logout);

// Define a GET route for fetching the current user's information.
// First, the protectedRoute middleware is executed to check if the user is authenticated.
// If authenticated, the user information is sent back in the response.
router.get("/me", protectedRoute, (req, res) => {
	res.send({
		success: true,
		user: req.user,
	});
});

export default router;
