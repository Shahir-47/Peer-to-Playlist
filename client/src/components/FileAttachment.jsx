import React from "react";
import { FileText, FileAudio2, FileVideo2 } from "lucide-react";

const FileAttachment = ({ fileUrl, fileType, onClick }) => {
	let content;
	switch (fileType) {
		case "image":
			content = (
				<img
					src={fileUrl}
					alt="attachment"
					className="w-full h-full object-cover"
				/>
			);
			break;
		case "video":
			content = (
				<video
					src={fileUrl}
					className="w-full h-full object-cover"
					muted
					loop
					playsInline
				/>
			);
			break;
		case "audio":
			content = (
				<div className="flex flex-col items-center">
					<FileAudio2 size={48} />
					<audio src={fileUrl} controls className="mt-2 w-full" />
				</div>
			);
			break;
		case "pdf":
		case "document":
		default:
			content = (
				<div className="flex flex-col items-center text-gray-500">
					<FileText size={48} />
					<p className="mt-2 text-sm">
						{fileType === "pdf" ? "PDF Document" : "Attachment"}
					</p>
				</div>
			);
	}

	return (
		<div
			onClick={onClick}
			className="cursor-pointer p-2 border rounded-md shadow w-32 h-32 flex items-center justify-center bg-white overflow-hidden"
		>
			{content}
		</div>
	);
};

export default FileAttachment;
