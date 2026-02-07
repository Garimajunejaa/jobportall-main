require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('All ENV:', Object.keys(process.env).filter(key => key.includes('MONGO')));
