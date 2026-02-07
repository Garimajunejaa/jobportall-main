import axios from 'axios';

const testApplicationsEndpoint = async () => {
    try {
        console.log('Testing /api/v1/user/applications endpoint...');
        
        // First, let's try without authentication to see if the route exists
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/test');
            console.log('✅ Backend test route working:', response.data);
        } catch (error) {
            console.log('❌ Backend test route failed:', error.message);
            return;
        }
        
        // Now try the applications endpoint (will fail without auth, but should show route exists)
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/applications');
            console.log('✅ Applications route working:', response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Applications route exists (authentication required)');
            } else {
                console.log('❌ Applications route failed:', error.message);
                console.log('Error details:', error.response?.data);
            }
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
};

testApplicationsEndpoint();
