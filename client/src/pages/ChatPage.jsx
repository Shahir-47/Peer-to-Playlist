import { useEffect } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";
import PreviewAttachment from "../components/PreviewAttachment";

const ChatPage = () => {
	const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
	const {
		messages,
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useMessageStore();
	const { authUser } = useAuthStore();

	// Get the match ID from the URL parameters
	const { id } = useParams();

	// Find the matched user from the matches array
	// This is used to display the match's name and image in the chat header
	const match = matches.find((m) => m?._id === id);

	// Fetch matches and messages when the component mounts
	useEffect(() => {
		if (authUser && id) {
			getMyMatches(); // Fetch matches to populate the matches array above
			getMessages(id); // Fetch messages for the selected match
			subscribeToMessages(); // Subscribe to real-time messages
		}

		return () => {
			unsubscribeFromMessages(); // Unsubscribe from real-time messages when the component unmounts
		};
	}, [
		getMyMatches,
		authUser,
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
		id,
	]);

	if (isLoadingMyMatches) return <LoadingMessagesUI />;
	if (!match) return <MatchNotFound />;

	return (
		//UI stuff
		<div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
			<Header />

			<div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
				<div className="flex items-center mb-4 bg-white rounded-lg shadow p-3">
					<img
						src={match.image || "/avatar.png"}
						className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pink-300"
					/>
					<h2 className="text-xl font-semibold text-gray-800">{match.name}</h2>
				</div>

				<div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
					{/* No messages yet */}
					{messages.length === 0 ? (
						<p className="text-center text-gray-500 py-8">
							Start your conversation with {match.name}
						</p>
					) : (
						// Map through messages and display them
						messages.map((msg) => (
							<div
								key={msg._id}
								className={`mb-3 ${
									// Aligns my messages to the right and the other user's messages to the left
									msg.sender === authUser._id ? "text-right" : "text-left"
								}`}
							>
								<span
									// Gives the sent messages a different color from the received ones
									className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
										msg.sender === authUser._id
											? "bg-pink-500 text-white"
											: "bg-gray-200 text-gray-800"
									}`}
								>
									{/* If there is an attached file, render the clickable FileAttachment */}
									{msg.attachments?.length > 0 && (
										<div className="mb-2 flex items-center space-x-2 overflow-x-auto">
											{msg.attachments.map((att, idx) => (
												<div
													key={idx}
													className={
														att.category === "audio"
															? "relative flex-shrink-0"
															: `relative flex-shrink-0 bg-white p-1 rounded-md ${
																	["image", "video"].includes(att.category)
																		? "h-32 flex items-end justify-center"
																		: "h-12 flex items-center space-x-2"
															  }`
													}
												>
													<PreviewAttachment attachment={att} />
												</div>
											))}
										</div>
									)}
									{msg.content && <div>{msg.content}</div>}
								</span>
							</div>
						))
					)}
				</div>
				{/* input for messages */}
				<MessageInput match={match} />

				{/* universal preview modal */}
				{/* <PreviewModal
					visible={Boolean(previewModalData)}
					setVisible={(v) => !v && setPreviewModalData(null)}
					fileUrl={previewModalData?.fileUrl}
					mimeType={previewModalData?.mimeType}
				/> */}
			</div>
		</div>
	);
};
export default ChatPage;

//shows if match not found - all styling
const MatchNotFound = () => (
	<div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern">
		<div className="bg-white p-8 rounded-lg shadow-md text-center">
			<UserX size={64} className="mx-auto text-pink-500 mb-4" />
			<h2 className="text-2xl font-semibold text-gray-800 mb-2">
				Match Not Found
			</h2>
			<p className="text-gray-600">
				Oops! It seems this match doesn&apos;t exist or has been removed.
			</p>
			<Link
				to="/"
				className="mt-6 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors 
				focus:outline-none focus:ring-2 focus:ring-pink-300 inline-block"
			>
				Go Back To Home
			</Link>
		</div>
	</div>
);

//shows if loading - all styling
const LoadingMessagesUI = () => (
	<div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50">
		<div className="bg-white p-8 rounded-lg shadow-md text-center">
			<Loader size={48} className="mx-auto text-pink-500 animate-spin mb-4" />
			<h2 className="text-2xl font-semibold text-gray-800 mb-2">
				Loading Chat
			</h2>
			<p className="text-gray-600">
				Please wait while we fetch your conversation...
			</p>
			<div className="mt-6 flex justify-center space-x-2">
				<div
					className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
					style={{ animationDelay: "0s" }}
				></div>
				<div
					className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
					style={{ animationDelay: "0.2s" }}
				></div>
				<div
					className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
					style={{ animationDelay: "0.4s" }}
				></div>
			</div>
		</div>
	</div>
);
