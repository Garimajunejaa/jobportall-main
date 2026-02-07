import React, { useEffect, useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams } from 'react-router-dom'

const Applicants = () => {
    const params = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            if (!params.id) {
                console.log('❌ No job ID provided');
                setError('No job ID provided');
                return;
            }

            console.log('=== FETCHING APPLICANTS ===');
            console.log('Job ID from URL:', params.id);
            console.log('API URL:', `${APPLICATION_API_END_POINT}/${params.id}/applicants`);
            console.log('Timestamp:', new Date().toISOString());

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, {
                    withCredentials: true
                });

                console.log('=== API RESPONSE RECEIVED ===');
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                if (response?.data?.success && response?.data?.applications) {
                    console.log('✅ Applicants found:', response.data.applications);
                    console.log('✅ Applicants count:', response.data.applications.length);
                    setApplicants(response.data.applications);
                } else {
                    console.log('❌ No applicants found');
                    console.log('❌ Response data structure:', response.data);
                    setApplicants([]);
                }
            } catch (err) {
                console.error('=== FETCH ERROR ===');
                console.error('Error:', err);
                console.error('Error timestamp:', new Date().toISOString());
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch applicants';
                setError(errorMessage);
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [params.id]);

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <AdminNavbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                                Job Applicants
                            </h1>
                            <p className='text-gray-500 mt-1'>
                                View Applicants ({applicants?.length || 0})
                            </p>
                        </div>
                        <div className='text-sm text-gray-500'>
                            Job ID: {params.id || 'None'}
                        </div>
                    </div>

                    {/* Enhanced Debug Panel */}
                    <div className='mb-4 p-4 bg-gray-100 rounded'>
                        <p className='text-sm font-mono mb-2'>🔍 Debug Info:</p>
                        <p className='text-sm font-mono'>Applicants Count: {applicants?.length || 0}</p>
                        <p className='text-sm font-mono'>Loading: {loading ? 'Yes' : 'No'}</p>
                        <p className='text-sm font-mono'>Error: {error || 'None'}</p>
                        <p className='text-sm font-mono'>Job ID: {params.id || 'None'}</p>
                        <p className='text-sm font-mono'>API URL: {params.id ? `${APPLICATION_API_END_POINT}/${params.id}/applicants` : 'No Job ID'}</p>
                        {applicants?.length > 0 && (
                            <div className='mt-2'>
                                <p className='text-sm font-mono'>First Applicant:</p>
                                <p className='text-xs font-mono ml-2'>Name: {applicants[0]?.applicant?.fullname || 'N/A'}</p>
                                <p className='text-xs font-mono ml-2'>Email: {applicants[0]?.applicant?.email || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className='mb-4 p-4 bg-red-100 rounded'>
                            <p className='text-sm font-mono text-red-800'>❌ Error: {error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className='text-center py-12'>
                            <div className='text-6xl mb-4'>⏳</div>
                            <h3 className='text-lg font-medium text-gray-900'>Loading applicants...</h3>
                            <p className='text-gray-500'>Please wait while we fetch the data</p>
                        </div>
                    ) : applicants?.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='text-6xl mb-4'>👥</div>
                            <h3 className='text-lg font-medium text-gray-900'>No applicants yet</h3>
                            <p className='text-gray-500'>Wait for candidates to apply for this position</p>
                            <p className='text-xs text-gray-400 mt-2'>Make sure students have applied to this job</p>
                        </div>
                    ) : (
                        <ApplicantsTable applicants={applicants} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Applicants