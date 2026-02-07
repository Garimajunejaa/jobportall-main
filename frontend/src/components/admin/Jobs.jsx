import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { setAllJobs } from '@/redux/jobSlice';
import { BASE_URL } from '@/utils/constant';
import { toast } from 'sonner';
import Job from './Job'; // Import Job component
import AdminNavbar from '../shared/AdminNavbar';
import axios from 'axios';

const Jobs = () => {
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchJobs = async (showToast = false) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/job/all`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                dispatch(setAllJobs(response.data.jobs));
                if (showToast) {
                    toast.success("Jobs refreshed successfully");
                }
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs(false);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchJobs(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminNavbar />
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Available Jobs</h1>
                    <button 
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        <span className="sm:hidden">{isRefreshing ? '...' : '↻'}</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    </div>
                ) : allJobs && allJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No Jobs Available</h3>
                            <p className="text-sm sm:text-base text-slate-600">No jobs are available at the moment. Check back later!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;