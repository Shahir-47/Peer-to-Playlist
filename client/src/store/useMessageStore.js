import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
	messages: [], // List of all messages in the current conversation
	loading: true, // Tracks loading state while fetching messages

	sendMessage: async (receiverId, content, file, fileType) => {
		try {
			// show message in chat
			set((state) => ({
				messages: [
					...state.messages,
					{
						_id: Date.now(),
						sender: useAuthStore.getState().authUser._id,
						content,
						fileUrl: file,
						fileType,
					},
				],
			}));

			// send message to backend
			const res = await axiosInstance.post("/messages/send", {
				receiverId,
				content,
				file,
				fileType,
			});
			console.log("message sent", res.data);
		} catch (error) {
			toast.error(error.response.data.message || "Something went wrong");
		}
	},
	getMessages: async (userId) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.get(`/messages/conversation/${userId}`);
			set({ messages: res.data.messages });
		} catch (error) {
			console.log(error);
			set({ messages: [] });
		} finally {
			set({ loading: false });
		}
	},

	//these two make it real time
	subscribeToMessages: () => {
		const socket = getSocket();

		// When "newMessage" is received, append to chat in real-time
		socket.on("newMessage", ({ message }) => {
			set((state) => ({ messages: [...state.messages, message] }));
		});
	},

	unsubscribeFromMessages: () => {
		const socket = getSocket();
		socket.off("newMessage"); // Remove the listener
	},
}));
