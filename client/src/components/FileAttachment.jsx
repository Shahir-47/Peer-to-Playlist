// client/src/components/FileAttachment.jsx
import React from "react";
import FilePreview from "reactjs-file-preview";

// This component displays a condensed preview inside a fixed container.
// It wraps the preview within an anchor element so that when clicked it opens or downloads the file.
const FileAttachment = ({ fileUrl, fileType }) => {
	return (
		<a
			href={fileUrl}
			download
			target="_blank"
			rel="noreferrer"
			className="block"
		>
			<div className="p-2 border rounded-md shadow w-32 h-32 flex items-center justify-center overflow-hidden bg-white">
				<FilePreview
					preview={fileUrl}
					fileType={fileType}
					clarity="800"
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>
		</a>
	);
};

export default FileAttachment;
