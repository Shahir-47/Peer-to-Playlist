import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		genderPreference: {
			type: String,
			required: true,
			enum: ["male", "female", "both"],
		},
		bio: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		matches: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
); // The timestamps option automatically adds createdAt and updatedAt fields to the schema.

// Anytime you do something like new User({...}).save(), this function runs right before the data is stored in the database.
// We use it here to hash the user's password before saving it, so we never store plain text passwords.
userSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 10);
	next(); // Tells Mongoose to proceed with saving the document in the database after hashing the password.
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	// Compare the entered password with the hashed password in the database
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
