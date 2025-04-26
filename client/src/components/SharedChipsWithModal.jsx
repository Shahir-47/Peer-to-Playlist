// components/SharedChipsWithModal.jsx
import { useState } from "react";

export default function SharedChipsWithModal({
	items,
	icon,
	title,
	bg = "gray",
	text = "800",
	limit = 2, // show at most 2 inline
}) {
	const [open, setOpen] = useState(false);
	const visible = items.slice(0, limit);
	const moreCount = items.length - visible.length;

	return (
		<div className="mt-3">
			{/* inline chips, no scroll */}
			<div className="flex space-x-2">
				{visible.map((it) => (
					<span
						key={it.id}
						className={`
              flex items-center space-x-1 
              px-3 py-1 rounded-full 
              bg-${bg}-200 text-${text} text-xs
            `}
					>
						<span className="mr-4">{icon}</span>
						<span>{it.name}</span>
					</span>
				))}

				{moreCount > 0 && (
					<button
						onClick={() => setOpen(true)}
						className={`
              px-3 py-1 rounded-full 
              bg-${bg}-100 text-${text} text-xs 
              hover:bg-${bg}-200
            `}
					>
						+{moreCount} more
					</button>
				)}
			</div>

			{open && (
				<div
					className="fixed inset-0 flex items-center justify-center z-50 absolute inset-0 bg-opacity-50 backdrop-blur-sm"
					onClick={() => setOpen(false)}
				>
					<div
						className="bg-white p-6 rounded-lg max-w-sm w-full border shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg font-semibold mb-4">{title}</h3>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{items.map((it) => (
								<div
									key={it.id}
									className={`
                    px-3 py-2 rounded-md flex items-center 
                    bg-${bg}-100 text-${text}
                  `}
								>
									<span className="mr-2">{icon}</span>
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
