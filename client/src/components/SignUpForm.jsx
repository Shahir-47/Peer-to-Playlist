import { useState, useEffect, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const SignUpForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [emailValid, setEmailValid] = useState(true);
	const [password, setPassword] = useState("");
	const [age, setAge] = useState("");
	const [ageValid, setAgeValid] = useState(true);

	const [passwordFeedback, setPasswordFeedback] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [spotifyUrl, setSpotifyUrl] = useState("");
	const [spotifyTokens, setSpotifyTokens] = useState(null);
	const popupRef = useRef(null);

	const { signup, loading } = useAuthStore(); // get signup function and loading state from the auth store file

	const validateEmail = (email) => {
		// Stricter regex for valid domain and TLD (like .com, .org, etc.)
		const regex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		return regex.test(email);
	};

	const getPasswordFeedback = (pass) => {
		const feedback = [];

		if (pass.length < 6) feedback.push("at least 6 characters");
		if (!/[A-Z]/.test(pass)) feedback.push("an uppercase letter");
		if (!/[a-z]/.test(pass)) feedback.push("a lowercase letter");
		if (!/\d/.test(pass)) feedback.push("a number");
		if (!/[!@#$%^&*]/.test(pass))
			feedback.push("a special character (!@#$%^&*)");

		return feedback;
	};

	const connectSpotify = () => {
		popupRef.current = window.open(
			spotifyUrl,
			"SpotifyLogin",
			"width=500,height=600"
		);
	};

	useEffect(() => {
		axiosInstance
			.get("/auth/spotify/login")
			.then((res) => {
				setSpotifyUrl(res.data.url);
			})
			.catch((err) => {
				console.error("Spotify login axios failed:", err);
				toast.error("Could not fetch Spotify URL");
			});
	}, []);

	useEffect(() => {
		const handleMessage = (e) => {
			const allowed = [window.location.origin, "http://127.0.0.1:5000"];

			if (!allowed.includes(e.origin)) return;

			if (e.data?.type === "spotify") {
				setSpotifyTokens(e.data.payload);
			}
		};
		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return (
		<form
			className="space-y-6"
			onSubmit={(e) => {
				e.preventDefault(); // Stops page reload so we can handle form submission with JavaScript
				// only strong passwords allowed
				if (passwordFeedback.length > 0) {
					toast.error("Please meet all password requirements.");
					return;
				}
				signup({
					name,
					email,
					password,
					age,
					spotify: spotifyTokens,
				}); // Call the signup function from the auth store with the form data
				// The signup function will handle the API call and update the loading state
			}}
		>
			{/* NAME */}
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Name
				</label>
				<div className="mt-1">
					<input
						id="name"
						name="name"
						type="text"
						maxLength={100}
						autoCapitalize="words"
						required
						value={name}
						onChange={(e) => {
							const formatted = e.target.value
								.toLowerCase()
								.split(" ")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ");
							setName(formatted);
						}}
						className="capitalize appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

			{/* EMAIL */}
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
						onChange={(e) => {
							const val = e.target.value;
							setEmail(val);
							setEmailValid(validateEmail(val));
						}}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
				{email && !emailValid && (
					<p className="text-sm text-red-600 mt-1">
						Please enter a valid email address (e.g. you@example.com)
					</p>
				)}
			</div>

			{/* PASSWORD */}
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<div className="mt-1 relative">
					<input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"} // show / hide password
						autoComplete="new-password"
						required
						value={password}
						onChange={(e) => {
							const val = e.target.value;
							setPassword(val);
							setPasswordFeedback(getPasswordFeedback(val));
						}}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>

					{/* Toggle password visibility button */}
					<div
						onClick={() => setShowPassword(!showPassword)}
						className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:text-pink-500 transition-colors duration-200"
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</div>
				</div>

				{/* PASSWORD FEEDBACK */}
				{password && passwordFeedback.length > 0 && (
					<ul className="mt-2 text-sm text-red-500 list-disc list-inside space-y-1">
						{passwordFeedback.map((item, index) => (
							<li key={index}>Include {item}</li>
						))}
					</ul>
				)}

				{password && passwordFeedback.length === 0 && (
					<p className="mt-2 text-sm text-green-600">Strong password 💪</p>
				)}
			</div>

			{/* AGE */}
			<div>
				<label
					htmlFor="age"
					className="block text-sm font-medium text-gray-700"
				>
					Age
				</label>
				<div className="mt-1">
					<input
						id="age"
						name="age"
						type="number"
						required
						value={age}
						onChange={(e) => {
							const val = e.target.value;
							// Allow only digits
							if (/^\d*$/.test(val)) {
								setAge(val);

								// Validate: age must be a number between 18 and 120
								const ageNum = parseInt(val, 10);
								setAgeValid(ageNum >= 18 && ageNum <= 120);
							}
						}}
						min="18"
						max="120"
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
				{age && !ageValid && (
					<p className="text-sm text-red-600 mt-1">
						You must be between 18 and 120 years old.
					</p>
				)}
			</div>

			{/* SPOTIFY CONNECT BUTTON */}
			{!spotifyTokens ? (
				<button
					type="button"
					onClick={connectSpotify}
					className="w-full flex items-center justify-center py-2 px-4 rounded shadow-sm bg-green-600 hover:bg-green-700 cursor-pointer"
				>
					<FaSpotify className="h-5 w-5 mr-2" />
					Connect with Spotify
				</button>
			) : (
				<div className="flex items-center p-2 bg-green-100 rounded">
					<FaSpotify className="h-8 w-8 text-green-600 mr-4 " />
					<p className="text-green-800">
						Spotify connected! Now we can match you with music lovers.
					</p>
				</div>
			)}

			{/* SIGN UP BUTTON */}
			<div>
				<button
					type="submit"
					className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
						// if loading is true, show loading styles, else show normal styles
						loading
							? "bg-pink-400 cursor-not-allowed"
							: "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
					}`}
					disabled={loading} // disable the button if loading is true
				>
					{/* if loading is true, show "Signing up...", else show "Sign up" */}
					{loading ? "Signing up..." : "Sign up"}
				</button>
			</div>
		</form>
	);
};

export default SignUpForm;
