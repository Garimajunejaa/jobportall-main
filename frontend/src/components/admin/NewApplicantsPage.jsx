import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import ApplicantCard from './ApplicantCard';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

const NewApplicantsPage = () => {
    const params = useParams();
    const id = params.jobId;
    console.log('=== useParams() result ===');
    console.log('Full params object:', params);
    console.log('Job ID extracted:', id);

    const [applicants, setApplicants] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            console.log('=== UPDATING APPLICATION STATUS ===');
            console.log('Application ID:', applicationId);
            console.log('New Status:', newStatus);
            
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));
            
            const response = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status: newStatus },
                { withCredentials: true }
            );
            
            console.log('Update Response:', response.data);
            
            if (response.data.success) {
                toast.success(`Application ${newStatus} successfully!`);
                
                // Update local state to reflect the change
                setApplicants(prev => 
                    prev.map(app => 
                        app._id === applicationId 
                            ? { ...app, status: newStatus.toLowerCase() }
                            : app
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    useEffect(() => {
        console.log('=== USEEFFECT TRIGGERED ===');
        console.log('Job ID from params:', id);
        
        const fetchApplicants = async () => {
            try {
                console.log('=== NEW APPLICANTS PAGE ===');
                console.log('Job ID:', id);
                console.log('API URL:', `${APPLICATION_API_END_POINT}/${id}/applicants`);
                console.log('About to make API call...');

                setLoading(true);
                setError(null);

                const response = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('=== API RESPONSE ===');
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                console.log('Response headers:', response.headers);

                if (response?.data?.success) {
                    const applications = response.data.applications || [];
                    console.log('✅ Applicants received:', applications.length);
                    console.log('✅ First applicant:', applications[0]);
                    console.log('✅ All applicants:', applications);
                    setApplicants(applications);
                    setJobDetails(response.data.job || null);
                } else {
                    console.log('❌ API Response indicates failure');
                    console.log('❌ Response data:', response.data);
                    setApplicants([]);
                    setJobDetails(null);
                }
            } catch (error) {
                console.error('=== FETCH ERROR ===');
                console.error('Error:', error);
                console.error('Error response:', error.response);
                console.error('Error status:', error.response?.status);
                console.error('Error data:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch applicants";
                setError(errorMessage);
                setApplicants([]);
                setJobDetails(null);
            } finally {
                console.log('=== FINALLY BLOCK ===');
                setLoading(false);
            }
        };

        if (id) {
            console.log('=== CALLING FETCH APPLICANTS ===');
            fetchApplicants();
        } else {
            console.log('=== NO JOB ID PROVIDED ===');
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading applicants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Applicants</h2>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Applicants for {jobDetails?.title || 'Job'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Total Applicants: <span className="font-semibold text-blue-600">{applicants.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants Grid */}
                {applicants.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applicants Yet</h3>
                        <p className="text-gray-500 mb-6">
                            No students have applied to this job yet. Applications will appear here once students start applying.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-700">
                                <strong>Debug Info:</strong> Job ID: {id} | Applicants Count: {applicants.length}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants.map((applicant, index) => (
                            <ApplicantCard 
                                key={applicant._id || index} 
                                applicant={applicant} 
                                index={index}
                                onUpdateStatus={updateApplicationStatus}
                                updatingStatus={updatingStatus}
                            />
                        ))}
                    </div>
                )}

                </div>
        </div>
    );
};

export default NewApplicantsPage;
