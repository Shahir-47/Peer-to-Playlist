import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import {
	getMatches,
	getUserProfiles,
	swipeLeft,
	swipeRight,
} from "../controllers/matchController.js";

// Create a new Express router instance.
// A router is a mini Express application that can handle its own routes and middleware.
const router = express.Router();

// Define a POST route for "swipe right" (liking a user).
// The protectedRoute middleware ensures the user is authenticated.
router.post("/swipe-right/:likedUserId", protectedRoute, swipeRight);

// Define a POST route for "swipe left" (disliking a user).
// The protectedRoute middleware ensures the user is authenticated.
router.post("/swipe-left/:dislikedUserId", protectedRoute, swipeLeft);

// Define a GET route to retrieve all matches for the current user.
// The protectedRoute middleware ensures the user is authenticated.
router.get("/", protectedRoute, getMatches);

// Define a GET route to fetch user profiles (potential matches).
// This endpoint excludes users that have already been swiped on or matched.
// The protectedRoute middleware ensures the user is authenticated.
router.get("/user-profiles", protectedRoute, getUserProfiles);

export default router;
