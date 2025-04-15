import mangoose from "mongoose";

// This function connects to the MongoDB database
export const connectDB = async () => {
	try {
		const conn = await mangoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB: ", error);
		process.exit(1);
	}
};
