// components/SharedChipsWithModal.jsx
import { useState } from "react";
import { X } from "lucide-react";

const COLOR_VARIANTS = {
	pink: {
		bg: "bg-pink-200",
		text: "text-pink-700",
		hoverBg: "hover:bg-pink-300",
	},
	blue: {
		bg: "bg-blue-200",
		text: "text-blue-700",
		hoverBg: "hover:bg-blue-300",
	},
	green: {
		bg: "bg-green-200",
		text: "text-green-700",
		hoverBg: "hover:bg-green-300",
	},
	gray: {
		bg: "bg-gray-200",
		text: "text-gray-700",
		hoverBg: "hover:bg-gray-300",
	},
};

export default function SharedChipsWithModal({
	items,
	icon,
	title,
	bg = "gray",
	limit = 2,
	spotifyType = "track", // either "track" or "artist"
}) {
	const [openList, setOpenList] = useState(false);
	const [embedOpen, setEmbedOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const {
		bg: bgClass,
		text: textClass,
		hoverBg,
	} = COLOR_VARIANTS[bg] || COLOR_VARIANTS.gray;

	const filtered = items.filter((it) => {
		const n = it.name.toLowerCase();
		return n !== "kanye west" && !n.includes("dexter");
	});

	const visible = filtered.slice(0, limit);
	const moreCount = filtered.length - visible.length;

	function openEmbed(item) {
		setSelectedItem(item);
		setEmbedOpen(true);
	}

	function closeEmbed() {
		setEmbedOpen(false);
		setSelectedItem(null);
	}

	return (
		<div className="mt-3">
			{/* inline chips */}
			<div className="flex flex-wrap gap-2">
				{visible.map((it) => (
					<span
						key={it.id}
						onClick={() => openEmbed(it)}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bgClass} ${textClass} text-xs cursor-pointer ${hoverBg}`}
					>
						<span>{icon}</span>
						<span>{it.name}</span>
					</span>
				))}

				{moreCount > 0 && (
					<button
						onClick={() => setOpenList(true)}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bgClass} ${textClass} text-xs cursor-pointer ${hoverBg}`}
					>
						<span>+{moreCount} more</span>
					</button>
				)}
			</div>

			{/* list-modal */}
			{openList && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
					onClick={() => setOpenList(false)}
				>
					<div
						className="bg-white p-6 rounded-lg max-w-xs w-full border border-pink-600 shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg font-semibold mb-4">{title}</h3>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{filtered.map((it) => (
								<div
									key={it.id}
									onClick={() => {
										setOpenList(false);
										openEmbed(it);
									}}
									className={`flex items-center space-x-2 px-3 py-2 rounded-md ${bgClass} ${textClass} cursor-pointer ${hoverBg}`}
								>
									<span>{icon}</span>
									<span>{it.name}</span>
								</div>
							))}
						</div>
						<button
							onClick={() => setOpenList(false)}
							className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* spotify-embed modal */}
			{embedOpen && selectedItem && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
					onClick={closeEmbed}
				>
					<div
						className="p-0 rounded-xl shadow-lg "
						onClick={(e) => e.stopPropagation()}
					>
						{/* close button */}
						<button
							onClick={closeEmbed}
							className="absolute top-5 right-4 text-gray-500 hover:text-red-500 z-10 transition-colors cursor-pointer bg-pink-200 rounded-full p-1 hover:bg-pink-300"
						>
							<X size={16} />
						</button>

						{/* spotify embed */}
						<iframe
							src={`https://open.spotify.com/embed/${spotifyType}/${selectedItem.id}`}
							width="300"
							height="380"
							frameBorder="0"
							allow="encrypted-media"
							title={selectedItem.name}
						></iframe>
					</div>
				</div>
			)}
		</div>
	);
}
