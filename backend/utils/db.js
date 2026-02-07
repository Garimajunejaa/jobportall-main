import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('=== DATABASE CONNECTION START ===');
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        console.log('MongoDB URI from env:', mongoURI ? 'Set' : 'Not set');
        
        if (!mongoURI) {
            console.error('MONGODB_URI not set in environment variables');
            throw new Error('MongoDB URI is missing in environment variables');
        }

        // Add connection options for better reliability
        const options = {
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, options);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('=== DATABASE CONNECTION ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        process.exit(1);
    }
}

export default connectDB;