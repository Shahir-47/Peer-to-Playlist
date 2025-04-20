import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile, Paperclip, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import PreviewAttachment from "./PreviewAttachment";

const MAX_ATTACHMENTS = 10;

const MessageInput = ({ match }) => {
	const [message, setMessage] = useState("");
	const [attachments, setAttachments] = useState([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);
	const fileInputRef = useRef(null);

	const { sendMessage } = useMessageStore();

	const handleSendMessage = (e) => {
		e.preventDefault(); // so it doesn't refresh the page

		// if the message is empty and no file is selected, do nothing
		if (!message.trim() && attachments.length === 0) {
			return;
		}

		sendMessage(match._id, message, attachments); // send message to the backend
		setMessage(""); // empties message input after previous message is sent
		setAttachments([]); // empties attachments after previous message is sent
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file || attachments.length >= MAX_ATTACHMENTS) return;

		const name = file.name;
		const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";

		const reader = new FileReader();
		reader.onloadend = () => {
			let category;
			if (file.type.startsWith("image/")) category = "image";
			else if (file.type.startsWith("video/")) category = "video";
			else if (file.type.startsWith("audio/")) category = "audio";
			else if (ext === "pdf") category = "pdf";
			else if (["xls", "xlsx", "csv"].includes(ext)) category = "spreadsheet";
			else if (["ppt", "pptx"].includes(ext)) category = "presentation";
			else if (["doc", "docx"].includes(ext)) category = "word";
			else if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
				category = "archive";
			else category = "other";

			const newAttachment = { data: reader.result, name, ext, category };
			setAttachments((prev) => [...prev, newAttachment]);
		};
		reader.readAsDataURL(file);
	};

	const removeAttachment = (idx) => {
		setAttachments((prev) => prev.filter((_, i) => i !== idx));
	};

	// to exit the emoji picker
	useEffect(() => {
		// Function to handle clicks outside the emoji picker
		const handleClickOutside = (event) => {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target)
			) {
				setShowEmojiPicker(false); // close the emoji picker if clicked outside
			}
		};

		// Add event listener to detect clicks outside the emoji picker
		document.addEventListener("mousedown", handleClickOutside);

		// Clean up by removing the event listener when the component unmounts.
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	//styling
	return (
		<div className="w-full">
			{attachments.length > 0 && (
				<div className="mb-2 flex items-center space-x-2 overflow-x-auto p-2 pt-5 bg-gray-300 rounded-md shadow">
					{attachments.map((att, idx) => (
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
							<button
								onClick={() => removeAttachment(idx)}
								className={
									att.category === "audio"
										? "absolute bg-white border border-gray-300 rounded-full p-1 shadow-md text-red-600 hover:bg-red-50 z-10 top-0 right-0 transform translate-x-1 -translate-y-2/6 cursor-pointer"
										: "absolute bg-white border border-gray-300 rounded-full p-1 shadow-md text-red-600 hover:bg-red-50 z-10 top-0 right-0 transform translate-x-1 -translate-y-2/3 cursor-pointer"
								}
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			<form onSubmit={handleSendMessage} className="flex relative">
				{/* button for emojis */}
				<button
					type="button"
					onClick={() => setShowEmojiPicker(!showEmojiPicker)} // toggle emoji picker
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
				>
					<Smile size={24} />
				</button>

				{/* File Attachment Button */}
				<button
					type="button"
					onClick={() => fileInputRef.current.click()}
					disabled={attachments.length >= MAX_ATTACHMENTS}
					className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
				>
					<Paperclip size={20} />
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="*/*"
					className="hidden"
					onChange={handleFileChange}
				/>

				{/* here for file input */}
				{/* <input 
                type="file" 
                id="file-selector" 
                multiple
            /> */}
				{/* <script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script> */}

				{/* input for messages */}
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="flex-grow p-3 pl-20 rounded-l-lg border-2 border-pink-500 
        focus:outline-none focus:ring-2 focus:ring-pink-300"
					placeholder="Type a message..."
				/>

				{/* button to send message */}
				<button
					type="submit"
					className="bg-pink-500 text-white p-3 rounded-r-lg 
        hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
				>
					<Send size={24} />
				</button>

				{/* Emoji picker */}
				{showEmojiPicker && (
					<div ref={emojiPickerRef} className="absolute bottom-20 left-4">
						<EmojiPicker
							onEmojiClick={(emojiObject) => {
								// when an emoji is clicked, it adds the emoji to the message input
								setMessage((prevMessage) => prevMessage + emojiObject.emoji);
							}}
						/>
					</div>
				)}
			</form>
		</div>
	);
};
export default MessageInput;
