import { useState, useRef } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const ProfilePage = () => {
	const { authUser } = useAuthStore();
	const [name, setName] = useState(authUser.name || "");
	const [bio, setBio] = useState(authUser.bio || "");
	const [age, setAge] = useState(authUser.age || "");
	const [ageValid, setAgeValid] = useState(true);
	const [gender, setGender] = useState(authUser.gender || "");
	const [genderPreference, setGenderPreference] = useState(
		authUser.genderPreference || []
	);
	const [image, setImage] = useState(authUser.image || null);

	const fileInputRef = useRef(null); // use this to upload an image

	const { loading, updateProfile } = useUserStore();

	// function to update the image state so we can display it and upload it to the database
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault(); // Stops page reload so we can handle form submission with JavaScript
		updateProfile({ name, bio, age, gender, genderPreference, image }); // Call the update function to update user data
	}; // The updateProfile function will handle the API call and update the loading state

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			<div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Your Profile
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
						{/* FORM */}
						<form onSubmit={handleSubmit} className="space-y-6">
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
										required
										value={name}
										maxLength={100}
										autoCapitalize="words"
										onChange={(e) => {
											const formatted = e.target.value
												.toLowerCase()
												.split(" ")
												.map(
													(word) => word.charAt(0).toUpperCase() + word.slice(1)
												)
												.join(" ");
											setName(formatted);
										}}
										className="capitalize appearance-none block w-full px-3 py-2 border border-gray-300
										 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 
										sm:text-sm"
									/>
								</div>
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
										min="18"
										max="120"
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
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
									/>
								</div>
								{age && !ageValid && (
									<p className="text-sm text-red-600 mt-1">
										You must be between 18 and 120 years old.
									</p>
								)}
							</div>

							{/* GENDER */}
							<div>
								<span className="block text-sm font-medium text-gray-700 mb-2">
									Gender
								</span>
								<div className="flex space-x-4">
									{["Male", "Female"].map((option) => (
										<label key={option} className="inline-flex items-center">
											<input
												type="radio"
												className="form-radio text-pink-600"
												name="gender"
												value={option.toLowerCase()} // convert to lowercase value so it matches the database
												checked={gender === option.toLowerCase()}
												onChange={() => setGender(option.toLowerCase())} // update the gender state
											/>
											<span className="ml-2">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* GENDER PREFERENCE */}
							<div>
								<span className="block text-sm font-medium text-gray-700 mb-2">
									Gender Preference
								</span>
								<div className="flex space-x-4">
									{["Male", "Female", "Both"].map((option) => (
										<label key={option} className="inline-flex items-center">
											<input
												type="checkbox"
												className="form-checkbox text-pink-600"
												checked={
													genderPreference.toLowerCase() ===
													option.toLowerCase()
												} // convert to lowercase value so it matches the database
												onChange={
													() => setGenderPreference(option.toLowerCase()) // update gender preference state
												}
											/>
											<span className="ml-2">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* BIO */}
							<div>
								<label
									htmlFor="bio"
									className="block text-sm font-medium text-gray-700"
								>
									Bio
								</label>
								<div className="mt-1">
									<textarea
										id="bio"
										name="bio"
										rows={3}
										value={bio}
										onChange={(e) => setBio(e.target.value)}
										maxLength={200}
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
									/>
								</div>
								<div className="text-right text-xs text-gray-500 mt-1">
									{bio.length} / 200 characters
								</div>
							</div>

							{/* PROFILE PICTURE */}
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Cover Image
								</label>
								<div className="mt-1 flex items-center">
									<button
										type="button"
										onClick={() => fileInputRef.current.click()} // refers to the input below
										className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
									>
										Upload Image
									</button>
									{/* This input allows you to upload files and is used above in the onClick function of the button */}
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageChange} // call handleImageChange to show the newly selected photo
									/>
								</div>
							</div>

							{/* Renders the image chosen */}
							{image && (
								<div className="mt-4">
									<img
										src={image}
										alt="User Image"
										className="w-48 h-full object-cover rounded-md"
									/>
								</div>
							)}

							<button
								type="submit"
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
									// if loading is true, show loading styles, else show normal styles
									loading
										? "bg-pink-400 cursor-not-allowed"
										: "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
								}`}
								disabled={loading} // disable when loading
							>
								{/* if loading, show "Saving...", else show "Save" */}
								{loading ? "Saving..." : "Save"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
