import axios from 'axios';

const testEndpoints = async () => {
    try {
        console.log('=== TESTING ENDPOINTS ===');
        
        // Test 1: Test route
        console.log('1. Testing /api/v1/user/test...');
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/test');
            console.log('✅ Test route working:', response.data);
        } catch (error) {
            console.log('❌ Test route failed:', error.message);
        }
        
        // Test 2: Applications endpoint (will fail without auth, but should show route exists)
        console.log('2. Testing /api/v1/user/applications...');
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/applications');
            console.log('✅ Applications route working:', response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Applications route exists (auth required)');
            } else {
                console.log('❌ Applications route failed:', error.message);
            }
        }
        
        console.log('=== ENDPOINTS TEST COMPLETE ===');
        
    } catch (error) {
        console.error('Test error:', error);
    }
};

testEndpoints();
