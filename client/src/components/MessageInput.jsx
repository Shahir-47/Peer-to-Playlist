import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

//TODO - modify to allow file uploads

const MessageInput = ({ match }) => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);

	const { sendMessage } = useMessageStore();

	const handleSendMessage = (e) => {
		e.preventDefault(); // so it doesn't refresh the page
		if (message.trim()) {
			// if message is not an empty string...
			sendMessage(match._id, message);
			setMessage(""); // empties message input after previous message is sent
		}
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
		//when we submit the form, we call handleSendMessage
		<form onSubmit={handleSendMessage} className="flex relative">
			{/* button for emojis */}
			<button
				type="button"
				onClick={() => setShowEmojiPicker(!showEmojiPicker)} // toggle emoji picker
				className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
			>
				<Smile size={24} />
			</button>

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
				className="flex-grow p-3 pl-12 rounded-l-lg border-2 border-pink-500 
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
	);
};
export default MessageInput;
