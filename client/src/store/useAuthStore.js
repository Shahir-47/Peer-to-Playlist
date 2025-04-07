import { create } from "zustand"; // Allows us to create a global state so we can share data across components
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
	// ^ set is a function that updates the states in this function
	authUser: null, // Stores the authenticated user's data
	checkingAuth: true, // Tracks whether the app is currently checking auth status
	loading: false, // Tracks loading state for async operations

	signup: async (signupData) => {
		try {
			set({ loading: true }); // Set loading to true when starting the signup process
			const res = await axiosInstance.post("/auth/signup", signupData); // Sends a POST request to the backend to create a new user
			console.log(res.data);
			set({ authUser: res.data.user }); // If successful, update authUser with the new user's data and set loading to false

			toast.success("Account created successfully!"); // Show success message
		} catch (error) {
			toast.error(error.response.data.message || "Something went wrong!"); // Show error message
		} finally {
			set({ loading: false }); // Set loading to false when the signup process is complete
		}
	},

	checkAuth: async () => {
		try {
			/* 
			Makes a GET request to /auth/me to check if the user is authenticated.

			How it connects to the backend:
			- axiosInstance is preconfigured with baseURL: http://localhost:5000/api
			- So axiosInstance.get("/auth/me") hits: http://localhost:5000/api/auth/me

			Backend route resolution:
			1. Express server mounts authRoutes.js at /api/auth in server.js
			2. /me route is defined in authRoutes.js
			3. It uses protectedRoute middleware (in api/middleware/auth.js) to:
				- Check if a JWT token is in the user's cookies
				- Verify the token
				- If valid, attach the user to req.user and return user data
			4. If authenticated, the response includes user info which is then used to update authUser state globally
			*/

			const res = await axiosInstance.get("/auth/me");
			console.log(res.data);

			// If successful, you'd set authUser and update checkingAuth here (logic can be added)
		} catch (error) {
			console.log(error);
		}
	},
}));
