import { useEffect, useState, useRef } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";
import PreviewAttachment from "../components/PreviewAttachment";
import ViewAttachmentModal from "../components/ViewAttachmentModal";
import LinkPreviewCard from "../components/LinkPreviewCard";
import Masonry from "react-masonry-css";
import { axiosInstance } from "../lib/axios";

const masonryBreakpoints = {
	default: 2, // two columns normally
	768: 2, // ≥768px still 2 cols
	480: 1, // <480px → 1 col
};

const ChatPage = () => {
	const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

	const {
		messages,
		sendMessage,
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useMessageStore();
	const { authUser } = useAuthStore();
	const [viewAttachment, setViewAttachment] = useState(null);
	const [linkPreviewMap, setLinkPreviewMap] = useState({}); // message._id -> [{ url, preview }]

	const messagesEndRef = useRef(null); // dummy div to scroll to the bottom of the chat

	// Get the match ID from the URL parameters
	const { id } = useParams();

	// Find the matched user from the matches array
	// This is used to display the match's name and image in the chat header
	const match = matches.find((m) => m?._id === id);

	// filter out Kanye / Dexter from any list
	const filterBad = (arr = []) =>
		arr.filter((it) => {
			const n = it.name.toLowerCase();
			return n !== "kanye west" && !n.includes("dexter");
		});

	// Handle opening the attachment modal
	const handleViewAttachmentClick = (attachment) => {
		setViewAttachment(attachment);
	};

	// Handle closing the attachment modal
	const handleCloseModal = () => {
		setViewAttachment(null);
	};

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

	// Scroll to the bottom of the chat when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const fetchPreviews = async () => {
			for (const msg of messages) {
				if (!msg.linkPreviews?.length || linkPreviewMap[msg._id]) continue;

				const results = await Promise.all(
					msg.linkPreviews.map((url) =>
						axiosInstance
							.post("/link-preview", { url })
							.then((r) => ({ url, preview: r.data }))
							.catch(() => null)
					)
				);

				setLinkPreviewMap((prev) => ({
					...prev,
					[msg._id]: results.filter(Boolean),
				}));
			}
		};
		fetchPreviews();
	}, [messages]);

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

				<div
					className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4"
					ref={messagesEndRef} // Ref for scrolling to the bottom
				>
					{/* No messages yet */}
					{messages.length === 0 ? (
						<div className="text-center text-gray-600 py-8 space-y-4">
							<p className="text-lg">
								You both love{" "}
								<span className="font-semibold">
									{filterBad(match.commonArtists)
										.map((a) => a.name)
										.join(", ") || "music"}
								</span>
								—break the ice!
							</p>

							<div className="inline-grid grid-cols-1 gap-2 sm:grid-cols-2">
								{/* 1) Ask about a shared artist */}
								{filterBad(match.commonArtists)
									.slice(0, 2)
									.map((a, i) => (
										<button
											key={`artist-${i}`}
											onClick={() =>
												sendMessage(
													match._id,
													`What’s your favorite song by ${a.name}?`,
													[],
													[]
												)
											}
											className="px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full text-sm transition"
										>
											Ask about {a.name}
										</button>
									))}

								{/* 2) Ask about a shared track */}
								{filterBad(match.commonTracks)
									.slice(0, 2)
									.map((t, i) => (
										<button
											key={`track-${i}`}
											onClick={() =>
												sendMessage(
													match._id,
													`I loved "${t.name}". What do you think of it?`,
													[],
													[]
												)
											}
											className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-sm transition"
										>
											Talk about "{t.name}"
										</button>
									))}

								{/* 3) Ask about a saved track */}
								{filterBad(match.commonSaved)
									.slice(0, 2)
									.map((s, i) => (
										<button
											key={`saved-${i}`}
											onClick={() =>
												sendMessage(
													match._id,
													`We both saved "${s.name}". Why did you save it?`,
													[],
													[]
												)
											}
											className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full text-sm transition"
										>
											Why save "{s.name}"?
										</button>
									))}

								{/* 4) Ask about a followed artist */}
								{filterBad(match.commonFollowed)
									.slice(0, 2)
									.map((f, i) => (
										<button
											key={`followed-${i}`}
											onClick={() =>
												sendMessage(
													match._id,
													`You're following ${f.name}—any song recs?`,
													[],
													[]
												)
											}
											className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full text-sm transition"
										>
											Recommend from {f.name}
										</button>
									))}
							</div>
						</div>
					) : (
						<>
							{
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
											{msg.attachments?.length > 0 &&
												(() => {
													// split out audio vs rest
													const audioItems = msg.attachments.filter(
														(a) => a.category === "audio"
													);
													const otherItems = msg.attachments.filter(
														(a) => a.category !== "audio"
													);

													return (
														<div>
															{/* render audio full‑width */}
															{audioItems.map((att, i) => (
																<div
																	key={`audio-${i}`}
																	className="mb-4 w-full bg-white p-1 rounded-md"
																>
																	<PreviewAttachment attachment={att} />
																</div>
															))}

															{/* Masonry for everything else */}
															<Masonry
																breakpointCols={masonryBreakpoints}
																className="flex -ml-4"
																columnClassName="pl-4"
															>
																{otherItems.map((att, i) => {
																	const sizeClasses = [
																		"image",
																		"video",
																	].includes(att.category)
																		? "w-50 flex items-end justify-center"
																		: "h-12 w-min flex items-center space-x-2";

																	return (
																		<div
																			key={`other-${i}`}
																			className={`mb-4 bg-white p-1 rounded-md ${sizeClasses}`}
																		>
																			<PreviewAttachment
																				attachment={att}
																				onClick={() =>
																					handleViewAttachmentClick(att)
																				}
																			/>
																		</div>
																	);
																})}
															</Masonry>
														</div>
													);
												})()}

											{linkPreviewMap[msg._id]?.length > 0 && (
												<div className="mt-2 space-y-2">
													{linkPreviewMap[msg._id].map(
														({ url, preview }, idx) => (
															<LinkPreviewCard
																key={url + idx}
																preview={preview}
															/>
														)
													)}
												</div>
											)}

											{msg.content && (
												<div
													className="break-words"
													dangerouslySetInnerHTML={{
														__html: msg.content
															// URLs
															.replace(
																/(https?:\/\/[^\s]+)/g,
																(url) =>
																	`<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline text-blue-500">${url}</a>`
															)
															// Emails
															.replace(
																/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
																(email) =>
																	`<a href="mailto:${email}" class="underline text-blue-600">${email}</a>`
															)
															// Location phrases like "Location: XYZ"
															.replace(
																/\bLocation:\s*(.+)/gi,
																(_, location) =>
																	`Location: <a href="https://www.google.com/maps/search/${encodeURIComponent(
																		location
																	)}" target="_blank" class="underline text-blue-600">${location}</a>`
															)
															// Dates (MM/DD/YYYY, MM/DD/YY, or MM-DD-YYYY)
															.replace(
																/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/g,
																(_, m, d, y) => {
																	const year = y.length === 2 ? `20${y}` : y;
																	const startDate = `${year}-${m.padStart(
																		2,
																		"0"
																	)}-${d.padStart(2, "0")}T09:00`; // 9AM default
																	const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?dates=${startDate.replace(
																		/-/g,
																		""
																	)}/${startDate.replace(/-/g, "")}`;
																	return `<a href="${calendarUrl}" target="_blank" class="underline text-blue-600">${m}/${d}/${y}</a>`;
																}
															),
													}}
												/>
											)}
										</span>

										{/* Show date and time of the message */}
										<p className="text-xs text-gray-500 mt-1">
											{(() => {
												const date = new Date(msg.createdAt);
												const day = date.getDate();
												const month = date.toLocaleString("en-US", {
													month: "short",
												});
												const year = date.getFullYear();
												const time = date.toLocaleTimeString("en-US", {
													hour: "numeric",
													minute: "2-digit",
													hour12: true,
												});

												const getOrdinal = (n) => {
													const s = ["th", "st", "nd", "rd"];
													const v = n % 100;
													return s[(v - 20) % 10] || s[v] || s[0];
												};

												return `${day}${getOrdinal(
													day
												)} ${month} ${year}, ${time}`;
											})()}
										</p>
									</div>
								))
							}
							{/* Scroll to the bottom of the chat when new messages arrive */}
							<div ref={messagesEndRef} />
						</>
					)}
				</div>
				{/* input for messages */}
				<MessageInput match={match} />

				{/* Modal for viewing attachments */}
				{viewAttachment && (
					<ViewAttachmentModal
						attachment={viewAttachment}
						onClose={handleCloseModal}
					/>
				)}
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
