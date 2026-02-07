import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable.jsx'
import UpdateProfileDialog from './UpdateProfileDialog.jsx'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'

const isResume = true;

const Profile = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Removed unused appliedJobs state and fetching logic since AppliedJobTable handles it

    // If no user, redirect to login
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <>
            <div className="bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50">
                <Navbar />
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8'>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl sm:rounded-3xl my-4 sm:my-8 p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300'
                    >
                        <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
                            <motion.div 
                                className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full'
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 ring-2 ring-sky-500 ring-offset-2 sm:ring-offset-4 shadow-lg flex-shrink-0">
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                </Avatar>
                                <div className='text-center sm:text-left flex-1'>
                                    <motion.h1 
                                        className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent mb-2'
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {user?.fullname}
                                    </motion.h1>
                                    <motion.p 
                                        className='text-gray-600 text-sm sm:text-base lg:text-lg'
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {user?.profile?.bio}
                                    </motion.p>
                                </div>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='w-full sm:w-auto'
                            >
                                <Button 
                                    onClick={() => setOpen(true)} 
                                    variant="outline"
                                    className="w-full sm:w-auto hover:bg-gradient-to-r from-sky-500 to-violet-500 hover:text-white transition-all duration-300 rounded-xl px-4 py-2 text-sm sm:text-base"
                                >
                                    <Pen className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div 
                            className='my-6 sm:my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100'>
                                <Mail className="text-sky-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className='text-gray-700 text-xs sm:text-sm truncate'>{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100'>
                                <Contact className="text-violet-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className='text-gray-700 text-xs sm:text-sm truncate'>{user?.phoneNumber}</span>
                            </div>
                            <div className='flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 sm:col-span-2 lg:col-span-1'>
                                <MapPin className="text-rose-600 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className='text-gray-700 text-xs sm:text-sm truncate'>{user?.profile?.location || 'Location not specified'}</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className='my-6 sm:my-8'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800'>Skills</h2>
                            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                {user?.profile?.skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Badge className="bg-gradient-to-r from-sky-100 to-violet-100 text-sky-700 px-2 sm:px-3 lg:px-4 py-1 text-xs sm:text-sm font-medium rounded-full">
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            className='mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Label className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Resume</Label>
                            {isResume && user?.profile?.resume ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Resume:</span>
                                        <span className="text-sm font-medium text-blue-600">
                                            {user.profile.resumeOriginalName || 'resume.pdf'}
                                        </span>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={async () => {
                                            try {
                                                // Use the dedicated resume download endpoint
                                                const response = await fetch('/api/v1/resume/download', {
                                                    credentials: 'include'
                                                });
                                                
                                                if (!response.ok) {
                                                    throw new Error('Failed to download resume');
                                                }
                                                
                                                const blob = await response.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = user.profile.resumeOriginalName || 'resume.pdf';
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (error) {
                                                console.error('Download error:', error);
                                                // Fallback to opening in new tab
                                                const resumeUrl = user.profile.resume.startsWith('http') 
                                                    ? user.profile.resume 
                                                    : `${window.location.origin}/api/v1/files/${user.profile.resume.split('/').pop()}`;
                                                window.open(resumeUrl, '_blank');
                                            }
                                        }}
                                    >
                                        Download Resume
                                    </Button>
                                </div>
                            ) : (
                                <span className="text-gray-500 text-sm sm:text-base">No resume uploaded</span>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 pb-8'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6'>
                        <h1 className='font-bold text-base sm:text-lg my-3 sm:my-5'>Applied Jobs</h1>
                        {/* Applied Job Table */}
                        <AppliedJobTable />
                    </div>
                </div>
                <UpdateProfileDialog open={open} setOpen={setOpen}/>
            </div>
        </>
    );
}

export default Profile
