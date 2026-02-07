import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, Filter, Briefcase, Users, TrendingUp, MapPin, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

const Browse = () => {
    const allJobs = useGetAllJobs();
    const navigate = useNavigate();
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [salaryRange, setSalaryRange] = useState([0, 200000]);
    const [sortBy, setSortBy] = useState('recent');
    
    // Get unique locations and job types
    const locations = React.useMemo(() => {
        const locs = [...new Set(allJobs.map(job => job.location).filter(Boolean))];
        return locs.sort();
    }, [allJobs]);
    
    const jobTypes = React.useMemo(() => {
        const types = [...new Set(allJobs.map(job => job.jobType).filter(Boolean))];
        return types.sort();
    }, [allJobs]);

    // Group jobs by category
    const jobCategories = React.useMemo(() => {
        const categories = {
            technology: [],
            marketing: [],
            design: [],
            finance: [],
            other: []
        };

        allJobs.forEach(job => {
            if (!job) return;
            
            const category = job.category ? job.category.toLowerCase() : 'other';
            if (Object.prototype.hasOwnProperty.call(categories, category)) {
                categories[category].push(job);
            } else {
                categories.other.push(job);
            }
        });

        return categories;
    }, [allJobs]);

    // Filter jobs based on search and filters
    const filteredJobs = React.useMemo(() => {
        return allJobs.filter(job => {
            const matchesSearch = !searchTerm || 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.company && job.company.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
            const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
            const matchesSalary = job.salary >= salaryRange[0] && job.salary <= salaryRange[1];
            
            return matchesSearch && matchesCategory && matchesLocation && matchesSalary;
        });
    }, [allJobs, searchTerm, selectedCategory, selectedLocation, salaryRange]);

    // Sort jobs
    const sortedJobs = React.useMemo(() => {
        const jobs = [...filteredJobs];
        switch (sortBy) {
            case 'recent':
                return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'salary-high':
                return jobs.sort((a, b) => b.salary - a.salary);
            case 'salary-low':
                return jobs.sort((a, b) => a.salary - b.salary);
            default:
                return jobs;
        }
    }, [filteredJobs, sortBy]);

    // Category icons and colors
    const categoryInfo = {
        technology: { icon: Briefcase, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
        marketing: { icon: TrendingUp, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
        design: { icon: Users, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
        finance: { icon: DollarSign, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50' },
        other: { icon: Briefcase, color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-50' }
    };

    return (
        <div className="bg-gradient-to-br from-violet-50 via-white to-cyan-50 min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Browse Jobs
                        </span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        Discover your dream job from {allJobs.length}+ opportunities across {Object.keys(jobCategories).length} categories
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Search jobs, companies, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
                                />
                            </div>
                        </div>

                        {/* Filter Button */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2 px-4 py-3">
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {(selectedCategory !== 'all' || selectedLocation !== 'all' || searchTerm) && (
                                        <Badge variant="secondary" className="ml-1">Active</Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg"
                                        >
                                            <option value="all">All Categories</option>
                                            {Object.keys(jobCategories).map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)} ({jobCategories[cat].length})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Location</label>
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg"
                                        >
                                            <option value="all">All Locations</option>
                                            {locations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Max Salary: ${(salaryRange[1]/1000).toFixed(0)}k
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200000"
                                            step="10000"
                                            value={salaryRange[1]}
                                            onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg"
                                        >
                                            <option value="recent">Most Recent</option>
                                            <option value="salary-high">Highest Salary</option>
                                            <option value="salary-low">Lowest Salary</option>
                                        </select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Active Filters */}
                    {(selectedCategory !== 'all' || selectedLocation !== 'all' || searchTerm) && (
                        <div className="flex flex-wrap gap-2">
                            {selectedCategory !== 'all' && (
                                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                                    {selectedCategory} ×
                                </Badge>
                            )}
                            {selectedLocation !== 'all' && (
                                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLocation('all')}>
                                    {selectedLocation} ×
                                </Badge>
                            )}
                            {searchTerm && (
                                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                                    {searchTerm} ×
                                </Badge>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-violet-600">{allJobs.length}</div>
                        <div className="text-sm text-gray-600">Total Jobs</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{locations.length}</div>
                        <div className="text-sm text-gray-600">Locations</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{jobCategories.technology.length}</div>
                        <div className="text-sm text-gray-600">Tech Jobs</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{sortedJobs.length}</div>
                        <div className="text-sm text-gray-600">Filtered</div>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <div className="space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Browse by Category
                    </h2>
                    
                    {Object.entries(jobCategories).map(([category, jobs], index) => {
                        const Icon = categoryInfo[category]?.icon || Briefcase;
                        const colorClass = categoryInfo[category]?.color || 'from-gray-500 to-slate-500';
                        const bgColorClass = categoryInfo[category]?.bgColor || 'bg-gray-50';
                        
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${bgColorClass} rounded-2xl p-6 sm:p-8`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold capitalize text-gray-800">
                                                {category}
                                            </h3>
                                            <p className="text-gray-600">{jobs.length} jobs available</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-sm">
                                        {jobs.length} Active
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {jobs.slice(0, 6).map((job) => (
                                        <motion.div
                                            key={job._id}
                                            whileHover={{ scale: 1.02 }}
                                            className="cursor-pointer"
                                            onClick={() => navigate(`/description/${job._id}`)}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {jobs.length > 6 && (
                                    <div className="text-center mt-6">
                                        <Button
                                            onClick={() => navigate(`/jobs/category/${category}`)}
                                            className={`bg-gradient-to-r ${colorClass} hover:opacity-90 text-white px-6 py-3 rounded-full`}
                                        >
                                            View All {category.charAt(0).toUpperCase() + category.slice(1)} Jobs ({jobs.length})
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Browse;
