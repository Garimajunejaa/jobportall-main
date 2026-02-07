const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        const mongoURI = 'mongodb+srv://garima22csu068:1fiAy7IdNV3MOjyA@cluster0.vsvop.mongodb.net/jp?retryWrites=true&w=majority';
        console.log('Testing MongoDB connection...');
        
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully!');
        
        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
};

testConnection();
