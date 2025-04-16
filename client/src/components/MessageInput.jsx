import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile, Paperclip, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import FilePreview from "reactjs-file-preview";

//TODO - modify to allow file uploads

const MessageInput = ({ match }) => {
	const [message, setMessage] = useState("");
	const [file, setFile] = useState(null);
	const [fileType, setFileType] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);
	const fileInputRef = useRef(null);

	const { sendMessage } = useMessageStore();

	const handleSendMessage = (e) => {
		e.preventDefault(); // so it doesn't refresh the page

		// if the message is empty and no file is selected, do nothing
		if (message.trim() === "" && !file) {
			return;
		}

		sendMessage(match._id, message, file, fileType); // send message to the backend
		setMessage(""); // empties message input after previous message is sent
		setFile(null); // reset file input
		setFileType(""); // reset file type
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];

		if (selectedFile) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFile(reader.result);

				// Determine file type explicitly
				if (selectedFile.type.startsWith("image")) {
					setFileType("image");
				} else if (selectedFile.type === "application/pdf") {
					setFileType("pdf");
				} else if (selectedFile.type.startsWith("audio")) {
					setFileType("audio");
				} else if (selectedFile.type.startsWith("video")) {
					setFileType("video");
				} else {
					setFileType("document");
				}
			};
			reader.readAsDataURL(selectedFile);
		}
	};

	// Remove the selected file (clear the attachment)
	const removeFile = () => {
		setFile(null);
		setFileType("");
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
			{file && (
				<div className="mb-2 flex items-center bg-gray-100 p-2 rounded-md shadow">
					<div className="flex-grow h-20 w-20">
						<FilePreview
							preview={file}
							fileType={fileType}
							clarity="800"
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					</div>
					<button
						onClick={removeFile}
						type="button"
						className="ml-2 text-gray-600 hover:text-red-600 transition"
					>
						<X size={20} />
					</button>
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
					className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
				>
					<Paperclip size={20} />
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*,audio/*,video/*,application/pdf" // Allow various file types
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
