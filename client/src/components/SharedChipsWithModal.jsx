// components/SharedChipsWithModal.jsx
import { useState } from "react";

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
	limit = 2, // show at most 2 inline
}) {
	const [open, setOpen] = useState(false);
	const visible = items.slice(0, limit);
	const moreCount = items.length - visible.length;
	const {
		bg: bgClass,
		text: textClass,
		hoverBg,
	} = COLOR_VARIANTS[bg] || COLOR_VARIANTS.gray;

	return (
		<div className="mt-3">
			{/* inline chips */}
			<div className="flex flex-wrap gap-2">
				{visible.map((it) => (
					<span
						key={it.id}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bgClass} ${textClass} text-xs`}
					>
						<span>{icon}</span>
						<span>{it.name}</span>
					</span>
				))}

				{moreCount > 0 && (
					<button
						onClick={() => setOpen(true)}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bgClass} ${textClass} text-xs cursor-pointer ${hoverBg}`}
					>
						<span>+{moreCount} more</span>
					</button>
				)}
			</div>

			{open && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
					onClick={() => setOpen(false)}
				>
					<div
						className="bg-white p-6 rounded-lg max-w-xs w-full border shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg font-semibold mb-4">{title}</h3>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{items.map((it) => (
								<div
									key={it.id}
									className={`flex items-center space-x-2 px-3 py-2 rounded-md ${bgClass} ${textClass}`}
								>
									<span>{icon}</span>
									<span>{it.name}</span>
								</div>
							))}
						</div>
						<button
							onClick={() => setOpen(false)}
							className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
