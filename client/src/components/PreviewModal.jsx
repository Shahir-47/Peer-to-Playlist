// client/src/components/PreviewModal.jsx
import React from "react";
import FileViewer from "react-file-viewer";
import { X } from "lucide-react";

const PreviewModal = ({ visible, setVisible, fileUrl, mimeType }) => {
	if (!visible) return null;

	// derive extension for FileViewer (e.g. "png", "mp4", "pdf", "docx", etc)
	const extension = mimeType.includes("/")
		? mimeType.split("/")[1].split(";")[0]
		: mimeType;

	return (
		<div
			className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
			onClick={() => setVisible(false)}
		>
			<div
				className="relative bg-white rounded-md shadow-lg max-w-full max-h-full overflow-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={() => setVisible(false)}
					className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
				>
					<X size={24} />
				</button>

				<div className="p-4 w-screen max-w-3xl h-screen max-h-[80vh]">
					<FileViewer
						fileType={extension}
						filePath={fileUrl}
						onError={(e) => console.error("Preview error:", e)}
					/>
				</div>
			</div>
		</div>
	);
};

export default PreviewModal;
