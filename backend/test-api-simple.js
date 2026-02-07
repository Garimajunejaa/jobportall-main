import axios from 'axios';

const testAPI = async () => {
    try {
        console.log('Testing API endpoint...');
        
        // Test the applications endpoint
        const response = await axios.get('http://localhost:8000/api/v1/user/applications', {
            withCredentials: true
        });
        
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', response.data);
        console.log('Applications Count:', response.data.applications?.length || 0);
        
    } catch (error) {
        console.error('API Error:', error.message);
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
    }
};

testAPI();
