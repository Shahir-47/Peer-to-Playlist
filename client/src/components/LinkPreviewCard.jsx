import React from "react";
import { X } from "lucide-react";

export default function LinkPreviewCard({ preview, onClose }) {
	if (!preview) return null;
	const { title, description, images, url } = preview;
	const thumb = images?.[0];
	return (
		<div className="relative mb-2 border rounded-lg overflow-hidden hover:shadow-lg transition">
			{/* close button */}
			<button
				onClick={onClose}
				className="absolute top-1 right-1 text-gray-500 hover:text-red-500 z-10 transition-colors cursor-pointer"
			>
				<X size={16} />
			</button>
			<a href={url} target="_blank" rel="noopener noreferrer" className="flex">
				{thumb && <img src={thumb} className="w-24 object-cover" alt={title} />}
				<div className="p-2 flex-1">
					<h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
						{title}
					</h4>
					{/* now rendering description */}
					{description && (
						<p className="text-gray-600 text-xs line-clamp-3">{description}</p>
					)}
					<p className="text-blue-500 text-xs mt-1 truncate">{url}</p>
				</div>
			</a>
		</div>
	);
}
