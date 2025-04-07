import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMatchStore = create((set) => ({
	matches: [], // list of matches
	loading: false,

	getMyMatches: async () => {
		try {
			set({ loading: true }); // Set loading to true when fetching user's matches
			const res = await axiosInstance.get("/matches"); //  Sends a GET request to the backend to fetch all matches
			set({ matches: res.data.matches }); // successful, update matches global state with the user's matches fetched from the api
		} catch (error) {
			set({ matches: [] }); // Reset matches when an error occurs
			toast.error(error.response.data.message || "Something went wrong!"); // Show error message
		} finally {
			set({ loading: false }); // Set loading to false when the fetching process is complete
		}
	},
}));
