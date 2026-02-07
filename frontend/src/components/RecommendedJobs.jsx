import { useEffect, useState } from 'react';
import Job from './Job';
import { Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendedJobs = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/job/recommendations', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Check if response has content
                const text = await response.text();
                if (!text) {
                    throw new Error('Empty response from server');
                }
                
                let data;
                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    throw new Error('Invalid JSON response from server');
                }
                
                if (data.success) {
                    setRecommendedJobs(data.recommendedJobs || []);
                } else {
                    setError(data.message || 'Failed to fetch recommended jobs');
                }
            } catch (err) {
                console.error('Error fetching recommended jobs:', err);
                setError(err.message || 'Failed to fetch recommended jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []);

    if (loading) return (
        <motion.div 
            className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-violet-600" />
                <div className="absolute inset-0 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-violet-600/20 rounded-full animate-ping"></div>
            </div>
            <motion.span 
                className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Finding perfect matches for you...
            </motion.span>
        </motion.div>
    );
    
    if (error) return (
        <motion.div 
            className="text-center py-8 sm:py-12 lg:py-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full mb-4">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
            </div>
            <div className="text-red-600 font-semibold text-sm sm:text-base lg:text-lg mb-3">Oops! Something went wrong</div>
            <div className="text-gray-600 text-xs sm:text-sm mb-6 max-w-md mx-auto">{error}</div>
            <motion.button 
                onClick={() => window.location.reload()} 
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Try Again
            </motion.button>
        </motion.div>
    );

    if (recommendedJobs.length === 0) {
        return (
            <motion.div 
                className="text-center py-12 sm:py-16 lg:py-20 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative inline-block">
                    <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">🎯</div>
                    <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                    </motion.div>
                </div>
                <div className="text-gray-700 font-semibold text-lg sm:text-xl lg:text-2xl mb-2">No recommended jobs found</div>
                <div className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
                    We couldn't find jobs matching your profile. Update your skills and preferences to get better recommendations.
                </div>
                <motion.button 
                    onClick={() => window.location.href = '/profile'}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    Update Profile
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="recommended-jobs px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Your Personalized Matches</h2>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                    Based on your profile, we found {recommendedJobs.length} perfect matches for you
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {recommendedJobs.map((job, index) => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-violet-200 overflow-hidden h-full">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <Job job={job} />
                            </div>
                            <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs sm:text-sm text-gray-600">Active now</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs sm:text-sm text-yellow-500">★</span>
                                        <span className="text-xs sm:text-sm text-gray-600">95% match</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RecommendedJobs;
