import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector, useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'
import { showErrorOnce } from '@/utils/errorHandler'

const AppliedJobTable = () => {
    const allAppliedJobs = useSelector(store => store.job.allAppliedJobs);
    const { user } = useSelector(store => store.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchApplications = async () => {
        try {
            setError(null);
            setIsLoading(true);
            
            if (!user) {
                setError('Please login to view applications');
                setIsLoading(false);
                return;
            }
            
            // Fast API call with timeout
            const response = await axios.get('/api/v1/user/applications', { 
                withCredentials: true,
                timeout: 5000 // 5 second timeout
            });
            
            console.log('=== APPLIED JOBS API RESPONSE ===');
            console.log('Response data:', response.data);
            console.log('Applications:', response.data.applications);
            
            if (response.data.applications && response.data.applications.length > 0) {
                console.log('=== APPLICATION STATUS CHECK ===');
                response.data.applications.forEach((app, index) => {
                    console.log(`Application ${index + 1}:`, {
                        _id: app._id,
                        status: app.status,
                        jobTitle: app.job?.title,
                        companyName: app.job?.company?.name,
                        appliedAt: app.appliedAt
                    });
                });
            }
            
            if (response.data.success && response.data.applications) {
                dispatch(setAllAppliedJobs(response.data.applications));
            } else {
                setError('No applications found');
            }
        } catch (error) {
            console.error('=== APPLIED JOBS API ERROR ===');
            console.error('Error:', error);
            
            if (error.code === 'ECONNABORTED') {
                setError('Request timeout. Please try again.');
            } else {
                setError('Failed to fetch applications');
            }
        } finally {
            setIsLoading(false);
        }
    };

    
    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    // Auto-refresh every 30 seconds to check for status updates
    useEffect(() => {
        if (!user) return;
        
        const interval = setInterval(() => {
            console.log('=== AUTO-REFRESHING APPLICATIONS ===');
            fetchApplications();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user]);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
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
        <div className='bg-white rounded-xl shadow-lg p-3 sm:p-6'>
            <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
                <h2 className="text-base sm:text-xl font-semibold text-gray-800">Applied Jobs</h2>
                            </div>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[640px]">
                <TableCaption className="text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">
                    {allAppliedJobs && allAppliedJobs.length > 0 
                        ? `A list of your ${allAppliedJobs.length} job applications` 
                        : "You haven't applied to any jobs yet"
                    }
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-violet-50 to-cyan-50">
                        <TableHead className="font-semibold text-violet-900 text-xs sm:text-sm whitespace-nowrap">Date</TableHead>
                        <TableHead className="font-semibold text-violet-900 text-xs sm:text-sm whitespace-nowrap">Job Role</TableHead>
                        <TableHead className="font-semibold text-violet-900 text-xs sm:text-sm whitespace-nowrap">Company</TableHead>
                        <TableHead className="font-semibold text-violet-900 text-xs sm:text-sm text-right whitespace-nowrap">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl">📋</span>
                                    <p className="text-gray-500">No applications found</p>
                                    <Button onClick={fetchApplications} variant="outline" size="sm">
                                        Refresh
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs.map((appliedJob, index) => (
                            <TableRow 
                                key={appliedJob._id || index}
                                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 transition-colors duration-200"
                            >
                                <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                                    {formatDate(appliedJob?.appliedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-violet-900 text-xs sm:text-sm">
                                            {appliedJob.job?.title || 'Unknown Job'}
                                        </span>
                                        <span className="text-[11px] sm:text-sm text-gray-500">
                                            {appliedJob.job?.jobType || 'Not specified'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs sm:text-sm">
                                            {appliedJob.job?.company?.name || 'Unknown Company'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${getStatusColor(appliedJob?.status || 'pending')} border text-[11px] sm:text-xs whitespace-nowrap`}>
                                        {(appliedJob?.status || 'pending').toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AppliedJobTable
