import React, { useEffect, useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { JOB_API_END_POINT,} from '@/utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
    Building2, Briefcase, Users, TrendingUp, 
    Target, Clock, Award, Bell, BarChart3, // Changed ChartBar to BarChart3
    FileSpreadsheet, UserCheck, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import { setAllJobs } from '@/redux/jobSlice'
import { BASE_URL } from '@/utils/constant'
import { toast } from 'sonner'

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const { allJobs } = useSelector(store => store.job);
    const [recentApplications, setRecentApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, applicationsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/v1/job/getadminjobs`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/v1/job/recent-applications`, { withCredentials: true })
                ]);
                
                if (jobsRes.data.success) {
                    dispatch(setAllJobs(jobsRes.data.jobs));
                }
                if (applicationsRes.data.success) {
                    setRecentApplications(applicationsRes.data.applications);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [dispatch]);

    const stats = [
        {
            title: "Total Companies",
            value: companies?.length || 0,
            icon: Building2,
            color: "from-blue-500 to-blue-700",
            link: "/admin/companies",
            description: "View and manage all registered companies"
        },
        {
            title: "Active Jobs",
            value: allJobs?.length || 0,
            icon: Briefcase,
            color: "from-emerald-500 to-emerald-700",
            link: "/admin/jobs",
            description: "Manage your posted job listings"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <AdminNavbar />
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
                {/* Welcome Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-10 lg:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                        Welcome to Your Dashboard
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                        Streamline your recruitment process and manage your job postings efficiently
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
                    {stats.map((stat, index) => (
                        <Link key={index} to={stat.link}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 lg:p-8 border border-slate-100 h-full"
                            >
                                <div className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-4 sm:mb-6`}>
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-2">
                                    {stat.title}
                                </h3>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                                    {stat.value}
                                </p>
                                <p className="text-slate-600 text-sm sm:text-base">{stat.description}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-100"
                >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center text-slate-800">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <Link to="/admin/jobs/create">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="group bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white transition-all duration-300 shadow-md hover:shadow-lg h-full"
                            >
                                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Post New Job</h3>
                                <p className="text-blue-100 text-sm sm:text-base">Create and publish a new job listing</p>
                            </motion.div>
                        </Link>
                        <Link to="/admin/companies">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="group bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white transition-all duration-300 shadow-md hover:shadow-lg h-full"
                            >
                                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Manage Companies</h3>
                                <p className="text-emerald-100 text-sm sm:text-base">View and update company information</p>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;

const fetchDashboardData = async () => {
    try {
        const res = await axios.get(`${JOB_API_END_POINT}/dashboard`, API_CONFIG);
        
        if (res.data.success) {
            // Process dashboard data
            setDashboardData(res.data);
        }
    } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard data");
    }
};
