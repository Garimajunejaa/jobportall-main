import RecommendedJobs from '../components/RecommendedJobs';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Users, Briefcase, Star } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const RecommendedJobsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-sky-600/10 to-cyan-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.h1 
                            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-violet-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Recommended Jobs For You
                        </motion.h1>
                        <motion.p 
                            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Personalized job recommendations based on your profile, skills, and preferences
                        </motion.p>
                        
                        {/* Stats Cards */}
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
                                    <span className="text-xs sm:text-sm text-green-600 font-medium">+12%</span>
                                </div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">2,847</div>
                                <div className="text-xs sm:text-sm text-gray-600">Active Jobs</div>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
                                    <span className="text-xs sm:text-sm text-green-600 font-medium">+8%</span>
                                </div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">1,234</div>
                                <div className="text-xs sm:text-sm text-gray-600">Companies</div>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
                                    <span className="text-xs sm:text-sm text-green-600 font-medium">+15%</span>
                                </div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">892</div>
                                <div className="text-xs sm:text-sm text-gray-600">New This Week</div>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                                    <span className="text-xs sm:text-sm text-green-600 font-medium">95%</span>
                                </div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">4.8</div>
                                <div className="text-xs sm:text-sm text-gray-600">Match Score</div>
                            </div>
                        </motion.div>

                        {/* Filter Pills */}
                        <motion.div 
                            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                                Remote
                            </Badge>
                            <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                                Full-time
                            </Badge>
                            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                                Tech
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                                $50k+
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                                Senior
                            </Badge>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Jobs Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <RecommendedJobs />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements */}
            <div className="fixed top-20 right-4 sm:right-8 lg:right-16 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="fixed bottom-20 left-4 sm:left-8 lg:left-16 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sky-400/20 to-violet-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
    );
};

export default RecommendedJobsPage;
