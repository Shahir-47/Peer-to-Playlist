import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; // import the auth store file to use the login function and loading state

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useAuthStore(); // get login function and loading state from the auth store file

	return (
		<form
			className="space-y-6"
			onSubmit={(e) => {
				e.preventDefault(); // Stops page reload so we can handle form submission with JavaScript
				login({ email, password }); // Call the login function from the auth store with the form data
				// The login function will handle the API call and update the loading state
			}}
		>
			{/* Email input field */}
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email address
				</label>
				<div className="mt-1">
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

			{/* Password input field */}
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<div className="mt-1">
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

			{/* Sign in button */}
			<button
				type="submit"
				className={`w-full flex justify-center py-2 px-4 border border-transparent 
					rounded-md shadow-sm text-sm font-medium text-white ${
						// if loading is true, show loading styles, else show normal styles
						loading
							? "bg-pink-400 cursor-not-allowed"
							: "bg-pink-600 cursor-pointer hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
					}`}
				disabled={loading} // disable the button if loading is true
			>
				{/* if loading is true, show "Signing in...", else show "Sign in" */}
				{loading ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
};

export default LoginForm;
