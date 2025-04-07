import axios from "axios"; // Axios is a library for making HTTP requests which is used to interact with APIs

// Create a custom Axios instance with default settings
export const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api", // Base URL for all API requests
	withCredentials: true, // Automatically include cookies with every request
});
