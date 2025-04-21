import { useAuthStore } from "../store/useAuthStore";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AudioLines, User, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
	const { authUser, logout } = useAuthStore(); // Get the authUser and logout function from the store

	const [dropdownOpen, setDropdownOpen] = useState(false); // state to toggle dropdown menu
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // state to toggle mobile menu
	const dropdownRef = useRef(null); // ref to manage dropdown menu

	// Detects clicks outside the dropdown and closes it
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 shadow-lg">
			{/* Logo and title */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						{/* Logo */}
						<Link
							to="/"
							className="group flex items-center space-x-2 hover:bg-white/10 rounded-md transition"
						>
							<AudioLines className="w-8 h-8 text-white group-hover:scale-105 transition-transform" />
							<span className="text-2xl font-bold text-white hidden sm:inline group-hover:scale-101 transition-transform">
								Peer To Playlist
							</span>
						</Link>
					</div>

					{/* Show user image and name on larger screens */}
					<div className="hidden md:flex items-center space-x-4">
						{/* show this if the user is logged in */}
						{authUser ? (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center space-x-2 focus:outline-none cursor-pointer hover:bg-white/10 rounded-md px-2 py-1 transition"
								>
									<img
										src={authUser.image || "/avatar.png"} // Default image if none provided
										className="h-10 w-10 object-cover rounded-full border-2 border-white"
										alt="User image"
									/>
									<span className="text-white font-medium">
										{authUser.name}
									</span>
								</button>

								{/* Dropdown menu */}
								<AnimatePresence>
									{dropdownOpen && (
										<motion.div
											initial={{ opacity: 0, y: -20 }}
											animate={{
												opacity: 1,
												y: 0,
												transition: { type: "spring", stiffness: 125 },
											}}
											exit={{
												opacity: 0,
												y: -10,
												transition: { duration: 0.2 },
											}}
											className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
										>
											{/* Link to profile page */}
											<Link
												to="/profile"
												className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
												onClick={() => setDropdownOpen(false)}
											>
												<User className="mr-2" size={16} />
												Profile
											</Link>

											{/* Logout button */}
											<button
												onClick={logout}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
											>
												<LogOut className="mr-2" size={16} />
												Logout
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							// Show login and signup links if user is not logged in
							<>
								<Link
									to="/auth"
									className="text-white hover:text-pink-200 transition duration-150 ease-in-out"
								>
									Login
								</Link>
								<Link
									to="/auth"
									className="bg-white text-pink-600 px-4 py-2 rounded-full font-medium hover:bg-pink-100 transition duration-150 ease-in-out"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-white focus:otline-none"
						>
							<Menu className="size-6" />
						</button>
					</div>
				</div>
			</div>

			{/* MOBILE MENU */}

			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { type: "spring", stiffness: 150 },
						}}
						exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
						className="md:hidden bg-pink-600"
					>
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{/* show this if the user is logged in */}
							{authUser ? (
								<>
									<Link
										to="/profile"
										className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
										onClick={() => setMobileMenuOpen(false)}
									>
										Profile
									</Link>
									<button
										onClick={() => {
											logout();
											setMobileMenuOpen(false);
										}}
										className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
									>
										Logout
									</button>
								</>
							) : (
								// Show login and signup links if user is not logged in
								<>
									<Link
										to="/auth"
										className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
										onClick={() => setMobileMenuOpen(false)}
									>
										Login
									</Link>
									<Link
										to="/auth"
										className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700"
										onClick={() => setMobileMenuOpen(false)}
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};
