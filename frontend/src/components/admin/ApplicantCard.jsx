import React from 'react';
import { Check, X } from 'lucide-react';

const ApplicantCard = ({ applicant, index, onUpdateStatus, updatingStatus }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return '✅';
            case 'rejected':
                return '❌';
            case 'pending':
            default:
                return '⏳';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {applicant?.applicant?.fullname?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {applicant?.applicant?.fullname || 'Unknown Applicant'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Applied on {formatDate(applicant?.appliedAt || applicant?.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(applicant?.status)}`}>
                        <span className="mr-1">{getStatusIcon(applicant?.status)}</span>
                        {applicant?.status?.toUpperCase() || 'PENDING'}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
                {/* Contact Information */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-2-2m0 0l2-2m2 2l2-2m-2 2l-2 2" />
                        </svg>
                        <span className="text-sm font-medium">{applicant?.applicant?.email || 'No email'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2v3a2 2 0 01-2 2h6a2 2 0 01-2-2V5a2 2 0 012-2H5a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V6a3 3 0 00-3-3H7a3 3 0 00-3 3v3" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9v6a3 3 0 01-3 3H7a3 3 0 01-3-3V9" />
                        </svg>
                        <span className="text-sm font-medium">{applicant?.applicant?.phoneNumber || 'No phone'}</span>
                    </div>
                </div>

                {/* Resume and Portfolio Links */}
                <div className="flex flex-wrap gap-2">
                    {applicant?.applicant?.profile?.signedResumeUrl && (
                        <a 
                            href={applicant.applicant.profile.signedResumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707 0l4.586-4.586V11a1 1 0 01-1-1H7a1 1 0 00-1 1v5a1 1 0 001 1h5.586z" />
                            </svg>
                            View Resume
                        </a>
                    )}
                    
                    {applicant?.applicant?.profile?.website && (
                        <a 
                            href={applicant.applicant.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9 9m0 0c1.657 0 3-4.03 3-7s-1.343-7-3-7m0 0c-1.657 0-3 4.03-3 7s1.343 7 3 7m0 0a9 9 0 019-9 9m0 0c-1.657 0-3-4.03-3-7s1.343-7 3-7" />
                            </svg>
                            Portfolio
                        </a>
                    )}
                </div>

                {/* Skills Section */}
                {applicant?.applicant?.profile?.skills && applicant.applicant.profile.skills.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                            {applicant.applicant.profile.skills.slice(0, 5).map((skill, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {applicant.applicant.profile.skills.length > 5 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    +{applicant.applicant.profile.skills.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Bio Section */}
                {applicant?.applicant?.profile?.bio && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Bio</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            {applicant.applicant.profile.bio}
                        </p>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        Applicant ID: {applicant._id || 'N/A'}
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => onUpdateStatus(applicant._id, 'accepted')}
                            disabled={updatingStatus[applicant._id] || applicant.status === 'accepted'}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {updatingStatus[applicant._id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                                <Check className="w-3 h-3" />
                            )}
                            {applicant.status === 'accepted' ? 'Accepted' : 'Accept'}
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(applicant._id, 'rejected')}
                            disabled={updatingStatus[applicant._id] || applicant.status === 'rejected'}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {updatingStatus[applicant._id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                                <X className="w-3 h-3" />
                            )}
                            {applicant.status === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                    </div>
                </div>
                
                {/* Status Badge */}
                <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        applicant.status === 'accepted' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : applicant.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                        {applicant.status?.toUpperCase() || 'PENDING'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ApplicantCard;
