import React, { useState, useEffect } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { Loader2, User, Mail, Phone, Building, Briefcase, Linkedin, Camera, Save, Eye, Edit3, Sparkles, Award, MapPin, Globe, Twitter, Github } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { motion } from 'framer-motion'

const RecruiterProfile = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phoneNumber || user?.profile?.phone || '',
        company: user?.profile?.company || '',
        position: user?.profile?.position || '',
        linkedIn: user?.profile?.linkedIn || '',
        profilePhoto: user?.profile?.profilePhoto || '',
        bio: user?.profile?.bio || '',
        location: user?.profile?.location || '',
        website: user?.profile?.website || '',
        twitter: user?.profile?.twitter || '',
        github: user?.profile?.github || ''
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilePhoto || '');

    // Update profile data when user data changes from Redux
    useEffect(() => {
        if (user) {
            setProfileData({
                fullname: user?.fullname || '',
                email: user?.email || '',
                phone: user?.phoneNumber || user?.profile?.phone || '',
                company: user?.profile?.company || '',
                position: user?.profile?.position || '',
                linkedIn: user?.profile?.linkedIn || '',
                profilePhoto: user?.profile?.profilePhoto || '',
                bio: user?.profile?.bio || '',
                location: user?.profile?.location || '',
                website: user?.profile?.website || '',
                twitter: user?.profile?.twitter || '',
                github: user?.profile?.github || ''
            });
            setPhotoPreview(user?.profile?.profilePhoto || '');
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Create preview URL for display only
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setProfileData({...profileData, profilePhoto: previewUrl});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            
            // Add all the fields that backend expects
            formData.append('fullname', profileData.fullname);
            formData.append('email', profileData.email);
            formData.append('phoneNumber', profileData.phone); // Backend expects 'phoneNumber', not 'phone'
            formData.append('bio', profileData.bio);
            formData.append('location', profileData.location);
            
            // Add company and position fields that backend expects
            if (profileData.company) {
                formData.append('company', profileData.company);
            }
            if (profileData.position) {
                formData.append('position', profileData.position);
            }
            
            // Add social media fields
            if (profileData.linkedIn) {
                formData.append('linkedIn', profileData.linkedIn);
            }
            if (profileData.twitter) {
                formData.append('twitter', profileData.twitter);
            }
            if (profileData.github) {
                formData.append('github', profileData.github);
            }
            if (profileData.website) {
                formData.append('website', profileData.website);
            }
            
            // Add file if selected
            if (photoFile) {
                formData.append('file', photoFile); // Backend expects 'file' field for upload
                console.log('Uploading file:', photoFile.name, photoFile.size);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Use POST method as backend expects POST, not PUT
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            console.log('Response:', res.data);
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Profile updated successfully');
                
                // Update local profileData state to reflect changes
                setProfileData(prev => ({
                    ...prev,
                    fullname: res.data.user.fullname || prev.fullname,
                    email: res.data.user.email || prev.email,
                    phone: res.data.user.phoneNumber || prev.phone,
                    bio: res.data.user.profile?.bio || prev.bio,
                    location: res.data.user.profile?.location || prev.location,
                    company: res.data.user.profile?.company || prev.company,
                    position: res.data.user.profile?.position || prev.position,
                    linkedIn: res.data.user.profile?.linkedIn || prev.linkedIn,
                    twitter: res.data.user.profile?.twitter || prev.twitter,
                    github: res.data.user.profile?.github || prev.github,
                    website: res.data.user.profile?.website || prev.website,
                    profilePhoto: res.data.user.profile?.profilePhoto || prev.profilePhoto
                }));
            }
        } catch (error) {
            console.error('Update error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50">
            <AdminNavbar />
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-violet-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                <Avatar className="relative h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl">
                                    <AvatarImage src={photoPreview} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-xl sm:text-3xl font-bold">
                                        {getInitials(profileData.fullname)}
                                    </AvatarFallback>
                                </Avatar>
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full p-2 sm:p-3 shadow-lg cursor-pointer"
                                    onClick={() => document.getElementById('photo-upload').click()}
                                >
                                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </motion.div>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex-1">
                                <motion.h1 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent"
                                >
                                    {profileData.fullname || 'Admin User'}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" />
                                    </motion.div>
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg sm:text-xl mb-2 text-gray-700"
                                >
                                    {profileData.position || 'Position'} at {profileData.company || 'Company'}
                                </motion.p>
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600"
                                >
                                    {profileData.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {profileData.location}
                                        </span>
                                    )}
                                    {profileData.email && (
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {profileData.email}
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Profile Photo & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-violet-100">
                                <div className="pb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <User className="w-5 h-5 text-violet-600" />
                                        Profile Photo
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                            <Avatar className="relative h-40 w-40 border-4 border-white shadow-xl">
                                                <AvatarImage src={photoPreview} className="object-cover" />
                                                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-4xl font-bold">
                                                    {getInitials(profileData.fullname)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <motion.div 
                                                whileHover={{ scale: 1.1 }}
                                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                onClick={() => document.getElementById('photo-upload-card').click()}
                                            >
                                                <Camera className="w-12 h-12 text-white" />
                                            </motion.div>
                                            <input
                                                id="photo-upload-card"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Upload Photo from Desktop</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50"
                                                onClick={() => document.getElementById('photo-upload-card').click()}
                                            >
                                                <Camera className="w-4 h-4 mr-2" />
                                                Choose File
                                            </Button>
                                            {photoFile && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        setPhotoFile(null);
                                                        setPhotoPreview('');
                                                        setProfileData({...profileData, profilePhoto: ''});
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                        {photoFile && (
                                            <p className="text-xs text-gray-600">
                                                Selected: {photoFile.name}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">or enter image URL below</p>
                                        <Input
                                            type="url"
                                            value={profileData.profilePhoto}
                                            onChange={(e) => {
                                                setProfileData({...profileData, profilePhoto: e.target.value});
                                                setPhotoPreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/photo.jpg"
                                            className="border-gray-200 focus:border-violet-400"
                                        />
                                    </div>
                                    {photoPreview && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 p-3 bg-violet-50 rounded-lg border border-violet-200"
                                        >
                                            <Eye className="w-4 h-4 text-violet-600" />
                                            <span className="text-sm text-violet-700">Photo preview available</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-violet-100">
                                <div className="pb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <Globe className="w-5 h-5 text-violet-600" />
                                        Social Links
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Linkedin className="w-4 h-4" />
                                            LinkedIn Profile
                                        </Label>
                                        <Input
                                            type="url"
                                            value={profileData.linkedIn}
                                            onChange={(e) => setProfileData({...profileData, linkedIn: e.target.value})}
                                            placeholder="https://linkedin.com/in/username"
                                            className="border-gray-200 focus:border-violet-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Twitter className="w-4 h-4" />
                                            Twitter Profile
                                        </Label>
                                        <Input
                                            type="url"
                                            value={profileData.twitter}
                                            onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                                            placeholder="https://twitter.com/username"
                                            className="border-gray-200 focus:border-violet-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Github className="w-4 h-4" />
                                            GitHub Profile
                                        </Label>
                                        <Input
                                            type="url"
                                            value={profileData.github}
                                            onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                                            placeholder="https://github.com/username"
                                            className="border-gray-200 focus:border-violet-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Personal Website
                                        </Label>
                                        <Input
                                            type="url"
                                            value={profileData.website}
                                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                            placeholder="https://yourwebsite.com"
                                            className="border-gray-200 focus:border-violet-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Personal & Professional Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-violet-100">
                                <div className="pb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <User className="w-5 h-5 text-violet-600" />
                                        Personal Information
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                Full Name
                                            </Label>
                                            <Input
                                                type="text"
                                                value={profileData.fullname}
                                                onChange={(e) => setProfileData({...profileData, fullname: e.target.value})}
                                                placeholder="John Doe"
                                                className="border-gray-200 focus:border-violet-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                Email Address
                                            </Label>
                                            <Input
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                placeholder="+1 (555) 123-4567"
                                                className="border-gray-200 focus:border-violet-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                Location
                                            </Label>
                                            <Input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                                placeholder="New York, USA"
                                                className="border-gray-200 focus:border-violet-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Edit3 className="w-4 h-4 text-gray-400" />
                                            Bio
                                        </Label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="w-full border-gray-200 focus:border-violet-400 rounded-lg p-3 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-violet-100">
                                <div className="pb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <Briefcase className="w-5 h-5 text-violet-600" />
                                        Professional Information
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Building className="w-4 h-4 text-gray-400" />
                                                Company
                                            </Label>
                                            <Input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                                                placeholder="Acme Corporation"
                                                className="border-gray-200 focus:border-violet-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                Position
                                            </Label>
                                            <Input
                                                type="text"
                                                value={profileData.position}
                                                onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                                                placeholder="Senior Recruiter"
                                                className="border-gray-200 focus:border-violet-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1"
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg font-semibold py-3 px-6 rounded-xl disabled:from-violet-400 disabled:to-cyan-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Update Profile
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto border-violet-200 text-violet-700 hover:bg-violet-50 font-semibold py-3 px-6 rounded-xl"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterProfile;