import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
	// When the app first loads, checkingAuth is true so nothing is rendered yet
	// Then useEffect runs checkAuth() to check if the user is logged in
	// After the check, checkingAuth becomes false and we render the appropriate routes

	const { checkAuth, authUser, checkingAuth } = useAuthStore();

	useEffect(() => {
		/* 
		This runs once when the App component mounts.

		It calls checkAuth() to:
		- Send a request to the backend (/auth/me)
		- Check if the user has a valid JWT token in cookies
		- If so, update authUser global state

		This ensures that the app knows whether a user is already logged in
		when the app loads or refreshes.
		*/
		checkAuth();
	}, [checkAuth]); // The dependency array makes sure this effect only runs once on mount,
	// 	unless the checkAuth function itself changes

	// Wait until auth check is complete before rendering protected routes
	if (checkingAuth) {
		return null;
	}

	return (
		<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
			{/* 
			<Routes> is the container for all the <Route> components.
			Each <Route> maps a URL path to a specific component.
			When the URL changes, the matching component is rendered.
			*/}
			<Routes>
				<Route
					path="/"
					element={
						// If the user is authenticated, show the home page
						// Else, redirect to the auth page
						authUser ? <HomePage /> : <Navigate to={"/auth"} />
					}
				/>
				<Route
					path="/auth"
					// If the user is not authenticated, show the auth page
					// Else, redirect to the home page
					element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
				/>
				<Route
					path="/profile"
					// If the user is authenticated, show the profile page
					// Else, redirect to the auth page
					element={authUser ? <ProfilePage /> : <Navigate to={"/"} />}
				/>
				<Route
					// :id is a dynamic URL segment (example: /chat/123)
					path="/chat/:id"
					// If the user is authenticated, show the chat page
					// Else, redirect to the auth page
					element={authUser ? <ChatPage /> : <Navigate to={"/"} />}
				/>
			</Routes>
			<Toaster /> {/* To show success/error notifications */}
		</div>
	);
}

export default App;
