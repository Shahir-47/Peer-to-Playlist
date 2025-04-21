import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { updateProfile } from "../controllers/userController.js";

// Create a new Express router instance.
const router = express.Router();

// Define a PUT route for updating the user's profile.
// The protectedRoute middleware ensures that only authenticated users can access this endpoint.
router.put("/update", protectedRoute, updateProfile);

export default router;
