// components/PreviewAttachment.jsx
import React from "react";
import {
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
	FaFilePowerpoint,
	FaFileArchive,
	FaFileAlt,
} from "react-icons/fa";

export default function PreviewAttachment({ attachment, onClick }) {
	const src = attachment.data || attachment.url;
	const { category, name, ext } = attachment;

	switch (category) {
		case "image":
			return (
				<div className="w-50 h-32 bg-gray-100 rounded-sm overflow-hidden">
					<img
						src={src}
						alt={name}
						onClick={onClick}
						className="w-full h-full object-contain"
					/>
				</div>
			);
		case "video":
			return (
				<div className="w-50 h-32 rounded-sm overflow-hidden">
					<video
						src={src}
						controls
						onClick={onClick}
						className="w-full h-full object-contain"
					/>
				</div>
			);
		case "audio":
			return (
				<audio src={src} controls onClick={onClick} className="mt-1 w-100" />
			);
		case "pdf":
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFilePdf size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">PDF Document</div>
					</div>
				</div>
			);
		case "spreadsheet":
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFileExcel size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">
							{ext === "csv" ? "CSV File" : "Excel Spreadsheet"}
						</div>
					</div>
				</div>
			);
		case "presentation":
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFilePowerpoint size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">PowerPoint</div>
					</div>
				</div>
			);
		case "word":
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFileWord size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">Word Document</div>
					</div>
				</div>
			);
		case "archive":
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFileArchive size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">Archive File</div>
					</div>
				</div>
			);
		default:
			return (
				<div
					onClick={onClick}
					className="flex items-center space-x-2 cursor-pointer text-left"
				>
					<FaFileAlt size={32} className="text-gray-800" />
					<div className="w-38">
						<div className="font-medium truncate text-gray-950">{name}</div>
						<div className="text-sm text-gray-500">
							{ext.toUpperCase()} File
						</div>
					</div>
				</div>
			);
	}
}

// ----------------------------
// Usage in MessageInput.jsx
// ----------------------------

/*
import PreviewAttachment from '../components/PreviewAttachment';

// Replace your renderPreview and its wrapper:
{attachments.length > 0 && (
  <div className="mb-2 flex items-center space-x-2 overflow-x-auto p-2 bg-gray-300 rounded-md shadow">
    {attachments.map((att, idx) => (
      <div
        key={idx}
        className={`relative flex-shrink-0 bg-white p-1 rounded-md ${
          ['image', 'video'].includes(att.category)
            ? 'h-32 flex items-end justify-center'
            : 'h-12 flex items-center space-x-2'
        }`}>
        <PreviewAttachment attachment={att} onClick={() => {/* optional preview modal }} />*/
//         <button onClick={() => removeAttachment(idx)} /* ... */>
//           <X size={16} />
//         </button>
//       </div>
//     ))}
//   </div>
// )}
// */

// ----------------------------
// Usage in ChatPage.jsx
// ----------------------------

/*
import PreviewAttachment from '../components/PreviewAttachment';

// Inside your message bubble:
{msg.attachments?.length > 0 && (
  <div className="mb-2 flex items-center space-x-2 overflow-x-auto">
    {msg.attachments.map((att, idx) => (
      <div
        key={idx}
        className={`relative flex-shrink-0 bg-white p-1 rounded-md ${
          ['image', 'video'].includes(att.category)
            ? 'h-32 flex items-end justify-center'
            : 'h-12 flex items-center space-x-2'
        }`}>
        <PreviewAttachment attachment={att} onClick={() => setPreviewModalData(att)} />
      </div>
    ))}
  </div>
)}
*/
