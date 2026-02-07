import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, MapPin, Clock, DollarSign } from 'lucide-react'
import { Button } from './ui/button'

const COMPANY_LOGO_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="12" fill="#EEF2FF" />' +
      '<path d="M20 44V26a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v18" fill="#C7D2FE"/>' +
      '<path d="M18 44h28" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M26 28v16M38 28v16" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>' +
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

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    if (!job) return null;
    
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className='p-5 rounded-xl shadow-lg bg-white border border-gray-100 cursor-pointer hover:border-teal-200 transition-all duration-300'
            onClick={() => navigate(`/description/${job._id}`)}
        >
            <div className='flex justify-between items-start'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center'>
                        <img 
                            src={getSafeLogoUrl(job?.company?.logo)} 
                            alt={job?.company?.name || 'Company'}
                            className='w-8 h-8 object-contain'
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = COMPANY_LOGO_PLACEHOLDER;
                            }}
                        />
                    </div>
                    <div>
                        <h1 className='font-medium text-lg'>{job?.company?.name || 'Company Name'}</h1>
                        <p className='text-sm text-gray-500 flex items-center gap-1'>
                            <MapPin className='w-4 h-4' /> {job?.location || 'Location'}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" className="hover:text-teal-600">
                    <Bookmark className="w-5 h-5" />
                </Button>
            </div>

            <div className='mt-4'>
                <h1 className='font-bold text-lg text-gray-900'>{job?.title}</h1>
                <p className='text-sm text-gray-600 mt-2 line-clamp-2'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap gap-2 mt-4'>
                <Badge className='bg-violet-100 text-violet-700 hover:bg-violet-200'>
                    {job?.position} Positions
                </Badge>
                <Badge className='bg-teal-100 text-teal-700 hover:bg-teal-200'>
                    {job?.jobType}
                </Badge>
                <Badge className='bg-cyan-100 text-cyan-700 hover:bg-cyan-200'>
                    <DollarSign className='w-4 h-4 mr-1' />
                    {job?.salary}LPA
                </Badge>
            </div>

            <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                <span className='text-sm text-gray-500 flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    Posted {new Date(job?.createdAt).toLocaleDateString()}
                </span>
                <Button 
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
                >
                    Apply Now
                </Button>
            </div>
        </motion.div>
    );
};
export default LatestJobCards