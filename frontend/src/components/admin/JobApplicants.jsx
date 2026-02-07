import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../shared/AdminNavbar';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Download, ExternalLink, Check, X } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState({});

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            console.log('=== UPDATING APPLICATION STATUS ===');
            console.log('Application ID:', applicationId);
            console.log('New Status:', newStatus);
            
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));
            
            const response = await axios.post(
                `${BASE_URL}/api/v1/application/status/${applicationId}/update`,
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
        const fetchApplicants = async () => {
            if (!jobId) {
                toast.error("No job ID provided");
                setIsLoading(false);
                return;
            }

            try {
                console.log('=== FETCHING APPLICANTS ===');
                console.log('Job ID:', jobId);
                console.log('API URL:', `${BASE_URL}/api/v1/application/${jobId}/applicants`);
                
                const response = await axios.get(`${BASE_URL}/api/v1/application/${jobId}/applicants`, {
                    withCredentials: true
                });
                
                console.log('=== API RESPONSE ===');
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Applications key exists:', 'applications' in response.data);
                console.log('Applications value:', response.data.applications);
                console.log('Applications type:', typeof response.data.applications);
                console.log('Applications length:', response.data.applications?.length);
                console.log('Applications is array:', Array.isArray(response.data.applications));
                
                if (response?.data?.success) {
                    const applications = response.data.applications || [];
                    console.log('✅ Final applicants array:', applications);
                    console.log('✅ Final applicants length:', applications.length);
                    console.log('✅ Final applicants type:', typeof applications);
                    console.log('✅ Final applicants is array:', Array.isArray(applications));
                    
                    setApplicants(applications);
                    setJobDetails(response.data.job || null);
                    
                    // Show detailed breakdown
                    if (applications.length > 0) {
                        console.log('📋 First applicant details:');
                        console.log('  - ID:', applications[0]._id);
                        console.log('  - Name:', applications[0].applicant?.fullname);
                        console.log('  - Email:', applications[0].applicant?.email);
                        console.log('  - Phone:', applications[0].applicant?.phoneNumber);
                        console.log('  - Resume:', applications[0].applicant?.profile?.signedResumeUrl);
                    } else {
                        console.log('📋 No real applicants found - students need to apply to this job first');
                    }
                } else {
                    console.log('❌ API Response indicates failure');
                    setApplicants([]);
                    setJobDetails(null);
                }
            } catch (error) {
                console.error('=== FETCH ERROR ===');
                console.error('Error:', error);
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch applicants";
                toast.error(errorMessage);
                setApplicants([]);
                setJobDetails(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-cyan-50">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Button 
                    onClick={() => navigate('/admin/jobs')}
                    variant="ghost" 
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </Button>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {jobDetails?.title} - Applicants
                    </h1>
                    <p className="text-gray-600">
                        Total Applications: {applicants.length}
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {applicants.map((application) => {
                            const applicant = application.applicant || {};
                            return (
                            <motion.div
                                key={application._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {applicant.fullname || 'N/A'}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${applicant.email}`} className="hover:text-violet-600">
                                                    {applicant.email || 'N/A'}
                                                </a>
                                            </div>
                                            {applicant.phoneNumber && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    <a href={`tel:${applicant.phoneNumber}`} className="hover:text-violet-600">
                                                        {applicant.phoneNumber}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {applicant.profile?.signedResumeUrl && (
                                        <Button 
                                            variant="outline" 
                                            className="mr-2"
                                            onClick={() => window.open(applicant.profile.signedResumeUrl, '_blank')}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Resume
                                        </Button>
                                    )}
                                    {applicant.profile?.website && (
                                        <Button 
                                            variant="outline"
                                            className="mr-2"
                                            onClick={() => window.open(applicant.profile.website, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Portfolio
                                        </Button>
                                    )}
                                    
                                    {/* Accept/Reject Buttons */}
                                    <div className="flex gap-2 mt-3">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                                            disabled={updatingStatus[application._id] || application.status === 'accepted'}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {updatingStatus[application._id] ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : (
                                                <Check className="w-4 h-4 mr-2" />
                                            )}
                                            {application.status === 'accepted' ? 'Accepted' : 'Accept'}
                                        </Button>
                                        
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                                            disabled={updatingStatus[application._id] || application.status === 'rejected'}
                                        >
                                            {updatingStatus[application._id] ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : (
                                                <X className="w-4 h-4 mr-2" />
                                            )}
                                            {application.status === 'rejected' ? 'Rejected' : 'Reject'}
                                        </Button>
                                    </div>
                                    
                                    {/* Status Badge */}
                                    <div className="mt-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            application.status === 'accepted' 
                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                : application.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 border-red-200'
                                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                        }`}>
                                            {application.status?.toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;