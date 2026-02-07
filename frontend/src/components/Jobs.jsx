import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setFilteredJobs, setSearchFilters } from '@/redux/jobSlice';
import{ BASE_URL } from '@/utils/constant';

const salaryRanges = [
    { value: '0-30000', label: '$0 - $30,000' },
    { value: '30000-60000', label: '$30,000 - $60,000' },
    { value: '60000-90000', label: '$60,000 - $90,000' },
    { value: '90000-120000', label: '$90,000 - $120,000' },
    { value: '120000-', label: '$120,000+' }
];

const experienceLevels = [
    { value: '1', label: 'Entry Level' },
    { value: '2', label: 'Intermediate' },
    { value: '3', label: 'Senior' },
    { value: '4', label: 'Expert' }
];

const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' }
];


const Jobs = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { filteredJobs, searchQuery } = useSelector((state) => state.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const [viewType, setViewType] = useState('grid');
    const [sortBy, setSortBy] = useState('latest');
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState(searchQuery || '');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        jobType: '',
        experienceLevel: '',
        salaryRange: '',
        industry: '',
        postedWithin: ''
    });
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // Initialize filters and searchText from navigation state on mount
    useEffect(() => {
        if (location.state && location.state.searchFilters) {
            const sf = location.state.searchFilters;
            setFilters({
                location: sf.location || '',
                jobType: sf.jobType || '',
                experienceLevel: sf.experienceLevel || '',
                salaryRange: sf.salaryRange || '',
                industry: sf.industry || '',
                postedWithin: sf.postedWithin || ''
            });
            setSearchText(sf.query || '');
        }
    }, [location.state]);

    useEffect(() => {
        const applyFilters = () => {
            let filteredResults = filteredJobs && filteredJobs.length > 0 ? [...filteredJobs] : [];
            
            // Search text filter
            if (searchText) {
                filteredResults = filteredResults.filter(job => 
                    job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.company?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.location?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Apply filters
            if (filters.jobType) {
                filteredResults = filteredResults.filter(job => 
                    job.jobType?.toLowerCase() === filters.jobType.toLowerCase()
                );
            }

            if (filters.experienceLevel) {
                filteredResults = filteredResults.filter(job =>
                    job.experienceLevel?.toString() === filters.experienceLevel
                );
            }

            if (filters.salaryRange) {
                const [min, max] = filters.salaryRange.split('-').map(Number);
                filteredResults = filteredResults.filter(job => {
                    const salary = Number(job.salary);
                    if (max) {
                        return salary >= min && salary <= max;
                    }
                    return salary >= min;
                });
            }

            // Apply sorting
            filteredResults.sort((a, b) => {
                switch (sortBy) {
                    case 'latest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'salary-high':
                        return b.salary - a.salary;
                    case 'salary-low':
                        return a.salary - b.salary;
                    default:
                        return 0;
                }
            });

            setFilterJobs(filteredResults);
        };

        applyFilters();
    }, [filteredJobs, searchText, filters, sortBy]);

    // Fetch jobs in background without blocking UI
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/v1/job/filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: '',
                        location: '',
                        jobType: '',
                        experienceLevel: '',
                        salaryRange: '',
                        industry: '',
                        postedWithin: ''
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setFilterJobs(data.jobs);
                    dispatch(setFilteredJobs(data.jobs));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
                setIsInitialLoad(false);
            }
        };
        
        // Always fetch in background, don't block UI
        fetchJobs();
    }, []); // Empty dependency array - only run once on mount

    // Separate useEffect for search and filter changes
    useEffect(() => {
        if (!isInitialLoad) {
            const fetchJobs = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`${BASE_URL}/api/v1/job/filter`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            query: searchText,
                            ...filters
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.success) {
                        setFilterJobs(data.jobs);
                        dispatch(setFilteredJobs(data.jobs));
                    }
                } catch (error) {
                    console.error('Error fetching jobs:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchJobs();
        }
    }, [searchText, filters, isInitialLoad, dispatch]);

    // Update the handleSearch function
    const handleSearch = () => {
        setIsLoading(true);
        try {
            setSearchText(searchText.trim());
        } finally {
            setIsLoading(false);
        }
    };

    // Update the quickFilter function
    const quickFilter = (tag) => {
        const tagLower = tag.toLowerCase();
        switch (tagLower) {
            case 'remote work':
                setFilters(prev => ({ ...prev, jobType: 'remote' }));
                break;
            case 'full-time':
                setFilters(prev => ({ ...prev, jobType: 'full-time' }));
                break;
            case 'tech jobs':
                setFilters(prev => ({ ...prev, industry: 'technology' }));
                break;
            case 'entry level':
                setFilters(prev => ({ ...prev, experienceLevel: '1' }));
                break;
            case 'urgent hiring':
                setSortBy('latest');
                break;
            default:
                break;
        }
    };

    // Add search input in the return JSX
    return (
        <div className='bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8'>
                {/* Enhanced Search Section */}
                <div className='mb-4 sm:mb-8 bg-white p-3 sm:p-6 rounded-xl shadow-lg'>
                    <h2 className='text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4'>
                        Discover Your Dream Career
                    </h2>
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4'>
                        <div className='flex-1'>
                            <input
                                type="text"
                                placeholder="Search your perfect role..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className='w-full p-2 sm:p-3 lg:p-4 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-300 text-sm sm:text-base lg:text-lg'
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className='px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-50'
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className='flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 items-center'>
                        <span className='text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg whitespace-nowrap'>Popular Searches:</span>
                        {['Remote Work', 'Full-Time', 'Tech Jobs', 'Entry Level', 'Urgent Hiring'].map((tag, index) => {
                            const tagColors = [
                                'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-blue-200',
                                'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-200',
                                'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-purple-200',
                                'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-orange-200',
                                'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-red-200'
                            ];
                            return (
                                <button
                                    key={tag}
                                    onClick={() => quickFilter(tag.toLowerCase())}
                                    className={`px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap overflow-hidden max-w-[80px] sm:max-w-[100px] md:max-w-none ${tagColors[index]}`}
                                >
                                    <span className='truncate block'>{tag}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className='flex flex-col xl:flex-row gap-4 xl:gap-6'>
                    {/* Enhanced Filter Section */}
                    <div className='w-full xl:w-1/4 space-y-4 xl:space-y-6'>
                        <div className='bg-white p-3 sm:p-6 rounded-xl shadow-lg'>
                            <h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 whitespace-nowrap'>Advanced Filters</h3>

                            {/* Salary Range Slider */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Salary Range</label>
                                <select
                                    value={filters.salaryRange}
                                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                                    className='w-full p-3 rounded-lg border-2 border-gray-100 focus:border-violet-500 transition-all duration-300'
                                >
                                    <option value="">Any Salary</option>
                                    {salaryRanges.map(range => (
                                        <option key={range.value} value={range.value}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Experience Level</label>
                                <div className='space-y-2'>
                                    {experienceLevels.map(level => (
                                        <label key={level.value} className='flex items-center space-x-2 cursor-pointer'>
                                            <input
                                                type="radio"
                                                name="experience"
                                                value={level.value}
                                                checked={filters.experienceLevel === level.value}
                                                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                                className='text-violet-600 focus:ring-violet-500'
                                            />
                                            <span className='text-sm text-gray-600'>{level.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Job Type Tags */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Job Type</label>
                                <div className='flex flex-wrap gap-2'>
                                    {jobTypes.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => setFilters({...filters, jobType: type.value})}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                                filters.jobType === type.value
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            <button
                                onClick={() => setFilters({
                                    location: '',
                                    jobType: '',
                                    experienceLevel: '',
                                    salaryRange: '',
                                    industry: '',
                                    postedWithin: ''
                                })}
                                className='w-full py-3 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-all duration-300 font-medium'
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                    {/* Main Content Section */}
                    <div className='w-full xl:flex-1'>
                        {/* Controls Bar */}
                        <div className='bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3'>
                            <div className='text-gray-600 text-xs sm:text-sm lg:text-base'>
                                Found <span className='font-semibold text-violet-600'>{filterJobs.length}</span> jobs
                            </div>
                            <div className='flex gap-2 sm:gap-3 lg:gap-4 items-center w-full sm:w-auto'>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='bg-gray-50 border border-gray-200 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm w-full sm:w-auto'
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="salary-high">Highest Salary</option>
                                    <option value="salary-low">Lowest Salary</option>
                                </select>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400'}`}
                                    >
                                        □□□
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={`p-1.5 rounded ${viewType === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400'}`}
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Jobs Grid/List */}
                        {filterJobs.length === 0 ? (
                            <div className='text-center py-6 sm:py-8 lg:py-12 bg-white rounded-lg'>
                                <div className='text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4'>🔍</div>
                                <h3 className='text-sm sm:text-base lg:text-lg font-medium text-gray-900'>No jobs found</h3>
                                <p className='text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2'>Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className={`${
                                viewType === 'grid' 
                                ? 'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6' 
                                : 'flex flex-col gap-2 sm:gap-3 lg:gap-4'
                            }`}>
                                {filterJobs.map((job, index) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="w-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Jobs;
