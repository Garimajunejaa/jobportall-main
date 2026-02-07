const mongoose = require('mongoose');

// Test different connection strings
const connectionStrings = [
    'mongodb+srv://garima22csu068:1fiAy7IdNV3MOjyA@cluster0.vsvop.mongodb.net/jp?retryWrites=true&w=majority',
    'mongodb://garima22csu068:1fiAy7IdNV3MOjyA@cluster0.vsvop.mongodb.net:27017/jp?ssl=true&authSource=admin',
    'mongodb://garima22csu068:1fiAy7IdNV3MOjyA@cluster0-shard-00-00.vsvop.mongodb.net:27017/jp?ssl=true&authSource=admin'
];

async function testConnections() {
    for (let i = 0; i < connectionStrings.length; i++) {
        const uri = connectionStrings[i];
        console.log(`\n🔍 Testing connection ${i + 1}:`);
        console.log(`URI: ${uri.substring(0, 50)}...`);
        
        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000
            });
            console.log('✅ SUCCESS: Connected to MongoDB!');
            
            // Test a simple operation
            const db = mongoose.connection.db;
            await db.admin().ping();
            console.log('✅ SUCCESS: Database ping successful!');
            
            await mongoose.disconnect();
            console.log('✅ SUCCESS: Disconnected gracefully');
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ FAILED: ${error.message}`);
            await mongoose.disconnect().catch(() => {});
        }
    }
    
    console.log('\n🚨 All connection attempts failed!');
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Check MongoDB Atlas cluster status');
    console.log('2. Verify username and password');
    console.log('3. Check IP whitelist in Network Access');
    console.log('4. Verify cluster name: cluster0.vsvop.mongodb.net');
    console.log('5. Try getting fresh connection string from MongoDB Atlas');
}

testConnections().catch(console.error);
