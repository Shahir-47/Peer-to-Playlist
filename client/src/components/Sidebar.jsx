import { useState, useEffect } from "react";
import { X, Loader, Disc3, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false); // track if the sidebar is open or closed on smaller screens

	const toggleSidebar = () => setIsOpen(!isOpen);

	const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

	// Once the component mounts, get all matches
	useEffect(() => {
		getMyMatches();
	}, [getMyMatches]);

	return (
		<>
			<div
				className={`
                fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300
                ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:w-1/4
            `}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="p-4 pb-[27px] border-b border-pink-200 flex justify-between items-center">
						<h2 className="text-xl font-bold text-pink-600">Matches</h2>
						<button
							className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
							onClick={toggleSidebar} // button to close sidebar on smaller screens
						>
							<X size={24} />
						</button>
					</div>

					<div className="flex-grow overflow-y-auto p-4 z-10 relative">
						{/* If loading, then show loading animation. If done loading, then:
                        No matches => show No Matches UI, else show Matches
                    */}
						{isLoadingMyMatches ? (
							<LoadingState />
						) : matches.length === 0 ? (
							<NoMatchesFound />
						) : (
							// All Matches rendered here
							matches.map((match) => (
								// Navigates to the chat page with the matched user on click
								<Link key={match._id} to={`/chat/${match._id}`}>
									{/* Renders pfp and name of the matches user */}
									<div className="flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors duration-300">
										<img
											src={match.image || "/avatar.png"}
											alt="User avatar"
											className="size-12 object-cover rounded-full mr-3 border-2 border-pink-300"
										/>

										<h3 className="font-semibold text-gray-800">
											{match.name}
										</h3>
									</div>
								</Link>
							))
						)}
					</div>
				</div>
			</div>

			{/* Button to open sidebar on smaller screens */}
			<button
				className="lg:hidden fixed top-4 left-4 md:pt-2 md:pl-2.5 p-2.0 pl-2.5 bg-pink-500 text-white rounded-md z-0"
				onClick={toggleSidebar}
			>
				<MessageCircle size={30} />
			</button>
		</>
	);
};

// UI if user has no matches
const NoMatchesFound = () => (
	<div className="flex flex-col items-center justify-center h-full text-center">
		<Disc3 className="text-pink-400 mb-4" size={78} />
		<h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Yet</h3>
		<p className="text-gray-500 max-w-xs">
			Don&apos;t worry! Your perfect match is just around the corner. Keep
			swiping!
		</p>
	</div>
);

// Custom component for displaying loading animation
const LoadingState = () => (
	<div className="flex flex-col items-center justify-center h-full text-center">
		<Loader className="text-pink-500 mb-4 animate-spin" size={48} />
		<h3 className="text-xl font-semibold text-gray-700 mb-2">
			Loading Matches
		</h3>
		<p className="text-gray-500 max-w-xs">
			We&apos;re finding your perfect matches. This might take a moment...
		</p>
	</div>
);

export default Sidebar;
