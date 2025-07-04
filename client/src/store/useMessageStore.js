import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
	messages: [], // List of all messages in the current conversation
	loading: true, // Tracks loading state while fetching messages

	sendMessage: async (receiverId, content, attachments, previewUrls = []) => {
		try {
			// show message in chat
			set((state) => ({
				messages: [
					...state.messages,
					{
						_id: Date.now(),
						sender: useAuthStore.getState().authUser._id,
						receiver: receiverId,
						content,
						attachments,
						linkPreviews: previewUrls,
						createdAt: new Date().toISOString(),
					},
				],
			}));

			// send message to backend
			await axiosInstance.post("/messages/send", {
				receiverId,
				content,
				attachments,
				previewUrls,
			});
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
		try {
			const socket = getSocket();
			socket.on("newMessage", (message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});
		} catch (error) {
			console.log("Error subscribing to messages: ", error);
		}
	},

	unsubscribeFromMessages: () => {
		try {
			const socket = getSocket();
			socket.off("newMessage");
		} catch (error) {
			console.log("Error unsubscribing from messages: ", error);
		}
	},
}));
