import axios from "axios"; // Axios is a library for making HTTP requests which is used to interact with APIs

// Set the base URL for API requests based on the environment (development or production)
const BASE_URL =
	import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

// Create a custom Axios instance with default settings
export const axiosInstance = axios.create({
	baseURL: BASE_URL, // Base URL for all API requests
	withCredentials: true, // Automatically include cookies with every request
});
