import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB URI is missing in environment variables');
        }

        // Add connection options for better reliability
        const options = {
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoURI, options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

export default connectDB;