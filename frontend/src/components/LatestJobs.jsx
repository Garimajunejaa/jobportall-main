import React, { useState, useEffect } from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { setAllJobs } from '@/redux/jobSlice';
import { BASE_URL } from '@/utils/constant';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const LatestJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const allJobs = useGetAllJobs(); // Call the hook once at the top
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [salaryRange, setSalaryRange] = useState([0, 200000]); // Set realistic salary range
    const [visibleJobs, setVisibleJobs] = useState(55); // Show all jobs by default
    
    // If no user, don't render the latest jobs
    if (!user) return null;

    const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'remote', 'internship'];

    const filteredJobs = allJobs.filter(job => {
        const matchesFilter = filter === 'all' || job.jobType.toLowerCase() === filter;
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (job.company && job.company.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSalary = job.salary >= salaryRange[0] && job.salary <= salaryRange[1];
        
        return matchesFilter && matchesSearch && matchesSalary;
    });

    const loadMore = () => {
        setVisibleJobs(prev => Math.min(prev + 6, filteredJobs.length));
    };

    return (
        <div className='max-w-7xl mx-auto my-12 sm:my-16 lg:my-20 px-2 sm:px-4'>
            <div className="flex flex-col gap-6 sm:gap-8">
                <div className='flex flex-col gap-4 sm:gap-6'>
                    <div className='flex flex-col md:flex-row justify-between items-start sm:items-center gap-4'>
                        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>
                            <span className='bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent'>
                                Latest & Top 
                            </span> 
                            <span className='block text-xl sm:text-2xl lg:text-3xl'> Jobs</span>
                        </h1>
                        
                        <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto'>
                            <div className='relative w-full sm:w-auto'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-64 text-sm sm:text-base'
                                />
                            </div>
                            
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="gap-2 text-sm sm:text-base">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 sm:w-80 p-3 sm:p-4">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2 text-sm sm:text-base">Salary Range ($)</h4>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="200000"
                                                    step="10000"
                                                    value={salaryRange[1]}
                                                    onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                                                    className="w-full"
                                                />
                                                <span className="text-xs sm:text-sm text-gray-600">${(salaryRange[1]/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    
                    <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        {jobTypes.map(type => (
                            <Button
                                key={type}
                                variant="outline"
                                onClick={() => setFilter(type)}
                                className={`
                                    capitalize transition-all duration-300 text-xs sm:text-sm
                                    ${filter === type 
                                        ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent' 
                                        : 'hover:border-violet-500 hover:text-violet-600'
                                    }
                                `}
                            >
                                {type.replace('-', ' ')}
                            </Button>
                        ))}
                    </div>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {filteredJobs.length === 0 ? (
                        <div className="col-span-full text-center py-8 sm:py-12 bg-white rounded-xl shadow-md">
                            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔍</div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">No jobs found</h3>
                            <p className="text-xs sm:text-sm text-gray-500">Try adjusting your search filters</p>
                        </div>
                    ) : (
                        filteredJobs.slice(0, visibleJobs).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <LatestJobCards job={job} />
                            </motion.div>
                        ))
                    )}
                </div>
                
                {filteredJobs.length > visibleJobs && (
                    <div className='text-center mt-8 sm:mt-10'>
                        <Button 
                            onClick={loadMore}
                            variant="outline" 
                            className="bg-white hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5"
                        >
                            Load More Jobs ({filteredJobs.length - visibleJobs} remaining)
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestJobs;