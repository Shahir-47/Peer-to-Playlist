import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
	const { checkAuth } = useAuthStore();

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

	return (
		<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
			{/* 
			<Routes> is the container for all route definitions.
			Each <Route> maps a specific URL path to a React component.
			When the URL changes, the matching component is rendered.
			*/}
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/chat/:id" element={<ChatPage />} />
			</Routes>
			<Toaster /> {/* To show success/error notifications */}
		</div>
	);
}

export default App;
