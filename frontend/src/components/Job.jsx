import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BASE_URL } from '@/utils/constant'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'

const COMPANY_LOGO_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="12" fill="#ECFEFF" />' +
      '<path d="M20 44V26a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v18" fill="#A5F3FC"/>' +
      '<path d="M18 44h28" stroke="#0891B2" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M26 28v16M38 28v16" stroke="#0891B2" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>'
)}`

const getSafeLogoUrl = (logo) => {
    if (!logo || typeof logo !== 'string') return COMPANY_LOGO_PLACEHOLDER;
    const trimmed = logo.trim();
    if (!trimmed) return COMPANY_LOGO_PLACEHOLDER;

    const isAbsoluteHttp = /^https?:\/\//i.test(trimmed);
    const isDataImage = /^data:image\//i.test(trimmed);
    const isLocalPath = trimmed.startsWith('/') || trimmed.startsWith('./');

    return (isAbsoluteHttp || isDataImage || isLocalPath) ? trimmed : COMPANY_LOGO_PLACEHOLDER;
}

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isApplying, setIsApplying] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Check if user has already applied to this job
    useEffect(() => {
        const checkIfApplied = async () => {
            if (!user) return;
            
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/user/applications`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    const applications = response.data.applications || [];
                    const hasApplied = applications.some(app => 
                        app.job && app.job._id === job._id
                    );
                    setIsApplied(hasApplied);
                }
            } catch (error) {
                console.error('Error checking application status:', error);
            }
        };

        checkIfApplied();
    }, [user, job._id]);

    const {
        _id,
        title = 'Untitled Position',
        company = {},
        location = 'Location Not Specified',
        jobType = 'Not Specified',
        salary = 0,
        experienceLevel = 0,
        requirements = [],
        createdAt
    } = job;

    const daysAgo = (mongodbTime) => {
        const days = Math.floor((new Date() - new Date(mongodbTime))/(1000*24*60*60));
        return days === 0 ? "Today" : `${days} days ago`;
    }

    const formatSalary = (salary) => {
        if (!salary) return "Not specified";
        if (salary >= 100) return `${salary/100}Cr`;
        return `${salary}LPA`;
    };

    const handleQuickApply = async () => {
        try {
            setIsApplying(true);
            // Fix the API endpoint to use BASE_URL
            const response = await axios.post(`${BASE_URL}/api/v1/job/apply/${_id}`, {}, {
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success('Successfully applied for the job!');
                setIsApplied(true); // Update local state immediately
                
                // Refresh applications data
                setTimeout(() => {
                    window.location.reload(); // Simple refresh to update all components
                }, 1000);
            }
        } catch (error) {
            console.error('Error applying:', error);
            toast.error('Failed to apply. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className='w-full h-full p-6 rounded-xl shadow-lg bg-white border border-gray-100 hover:border-violet-200 transition-all duration-300'
        >
            {/* Top section */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500 flex items-center gap-1'>
                        <Clock className="w-4 h-4 text-violet-600" />
                        {daysAgo(createdAt)}
                    </span>
                    <Button 
                        variant="ghost" 
                        className="rounded-full hover:bg-violet-50 hover:text-violet-600"
                        size="icon"
                    >
                        <Bookmark className="w-5 h-5" />
                    </Button>
                </div>

                <div className='flex items-center gap-4'>
                    <Avatar className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100">
                        <AvatarImage 
                            src={getSafeLogoUrl(company?.logo)} 
                            alt={company?.name}
                            className='p-2'
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = COMPANY_LOGO_PLACEHOLDER;
                            }}
                        />
                        <AvatarFallback className="rounded-lg text-xs font-medium text-cyan-700 bg-cyan-50">
                            {(company?.name || 'C').toString().charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                        <h2 className='font-medium text-lg truncate'>{company?.name || 'Company Name'}</h2>
                        <p className='text-sm text-gray-500 flex items-center gap-1'>
                            <MapPin className='w-4 h-4 flex-shrink-0 text-teal-600' /> 
                            <span className='truncate'>{location}</span>
                        </p>
                    </div>
                </div>

                <div className='space-y-2'>
                    <h1 className='font-bold text-lg bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent truncate'>
                        {title}
                    </h1>
                    <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <Badge className='bg-violet-100 text-violet-700 hover:bg-violet-200 whitespace-nowrap'>
                        <Briefcase className='w-4 h-4 mr-1 flex-shrink-0' />
                        {jobType}
                    </Badge>
                    <Badge className='bg-teal-100 text-teal-700 hover:bg-teal-200 whitespace-nowrap'>
                        {experienceLevel} years
                    </Badge>
                    <Badge className='bg-cyan-100 text-cyan-700 hover:bg-cyan-200 whitespace-nowrap'>
                        <DollarSign className='w-4 h-4 mr-1 flex-shrink-0' />
                        {formatSalary(salary)}
                    </Badge>
                </div>
            </div>

            {/* Bottom section - Update the Apply Now button */}
            <div className='mt-4 pt-4 border-t border-gray-100 flex gap-2'>
                <Button 
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white"
                >
                    View Details
                </Button>
                {isApplied ? (
                    <Button 
                        disabled
                        className="flex-1 bg-gray-100 text-gray-600 cursor-not-allowed"
                    >
                        Already Applied
                    </Button>
                ) : (
                    <Button 
                        onClick={handleQuickApply}
                        disabled={isApplying || !user}
                        className="flex-1 bg-violet-50 text-violet-600 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isApplying ? 'Applying...' : 'Apply Now'}
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export default Job;