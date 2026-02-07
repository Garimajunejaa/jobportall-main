// Simple test to check if frontend can start
console.log('Frontend test - checking if basic imports work...');

// Test basic imports
try {
    const React = require('react');
    console.log('✅ React import works');
} catch (error) {
    console.log('❌ React import failed:', error.message);
}

try {
    const axios = require('axios');
    console.log('✅ Axios import works');
} catch (error) {
    console.log('❌ Axios import failed:', error.message);
}

console.log('Frontend test complete');
