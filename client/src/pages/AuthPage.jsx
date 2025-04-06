import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true); // State to track if the user is on the login or signup page

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 p-4">
			<div className="w-full max-w-md">
				<h2 className="text-center text-3xl font-extrabold text-white mb-8">
					{/* if on login page, show "Sign in to Swipe", else show "Create a swipe account" */}
					{isLogin ? "Sign in to Swipe" : "Create a swipe account"}
				</h2>

				<div className="bg-white shadow-xl rounded-lg pb-8">
					{/* if on login page, show LoginForm, else show SignUpForm */}
					{isLogin ? <LoginForm /> : <SignUpForm />}

					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600">
							{/* if on login page, show "New to Swipe?", else show "Already have an account?" */}
							{isLogin ? "New to Swipe?" : "Already have an account?"}
						</p>
						<button
							className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
							// if user is on the login page, set is login to false so that the signup form is shown when the button is clicked,
							// else if user is on the signup page, set is login to true so that the login form is shown when the button is clicked
							onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
						>
							{/* if on login page, show "Create a new account" on the button, else show "Sign in to your account" */}
							{isLogin ? "Create a new account" : "Sign in to your account"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
