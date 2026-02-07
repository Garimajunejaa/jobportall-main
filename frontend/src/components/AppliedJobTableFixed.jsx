import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector, useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const AppliedJobTableFixed = () => {
    const allAppliedJobs = useSelector(store => store.job.allAppliedJobs);
    const { user } = useSelector(store => store.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchApplications = async () => {
        try {
            console.log('=== FETCHING APPLICATIONS START ===');
            setError(null);
            setIsLoading(true);

            if (!user) {
                console.log('ERROR: No user found');
                setError('Please login to view applications');
                setIsLoading(false);
                return;
            }

            console.log('User ID:', user._id);
            console.log('Making API call to: /api/v1/user/applications');

            const response = await axios.get('/api/v1/user/applications', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response Status:', response.status);
            console.log('API Response Data:', response.data);

            if (response.data.success) {
                console.log('Applications received:', response.data.applications?.length || 0);
                dispatch(setAllAppliedJobs(response.data.applications || []));
            } else {
                console.log('API returned success: false');
                setError(response.data.message || 'Failed to fetch applications');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to fetch applications');
        } finally {
            setIsLoading(false);
            console.log('=== FETCHING APPLICATIONS END ===');
        }
    };

    
    useEffect(() => {
        console.log('=== APPLIED JOB TABLE MOUNTED ===');
        console.log('User from Redux:', user);
        fetchApplications();
    }, [user, dispatch]);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.log('Invalid date:', dateString);
                return 'N/A';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'N/A';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading applications...</span>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-xl font-semibold text-gray-800">Applied Jobs</h2>
                            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <p className="font-medium">Error: {error}</p>
                </div>
            )}

            <Table>
                <TableCaption className="text-gray-500 mb-4">
                    {!allAppliedJobs || allAppliedJobs.length === 0 
                        ? "You haven't applied to any jobs yet" 
                        : `A list of your ${allAppliedJobs.length} job applications`
                    }
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-violet-50 to-cyan-50">
                        <TableHead className="font-semibold text-violet-900">Date</TableHead>
                        <TableHead className="font-semibold text-violet-900">Job Role</TableHead>
                        <TableHead className="font-semibold text-violet-900">Company</TableHead>
                        <TableHead className="font-semibold text-violet-900 text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl">📋</span>
                                    <p className="text-gray-500">No applications found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs.map((appliedJob, index) => (
                            <TableRow 
                                key={appliedJob._id || index}
                                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 transition-colors duration-200"
                            >
                                <TableCell className="font-medium">
                                    {formatDate(appliedJob?.appliedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-violet-900">
                                            {appliedJob.job?.title || 'Unknown Job'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {appliedJob.job?.jobType || 'Not specified'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">
                                            {appliedJob.job?.company?.name || 'Unknown Company'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${getStatusColor(appliedJob?.status)} border`}>
                                        {appliedJob?.status?.toUpperCase() || 'UNKNOWN'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTableFixed;
