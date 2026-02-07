import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = ({ applicants: propApplicants }) => {
    const applicants = propApplicants || [];

    console.log('=== APPLICANTS TABLE RENDER ===');
    console.log('Applicants prop:', propApplicants);
    console.log('Applicants length:', applicants?.length);

    const statusHandler = (status, id) => {
        console.log(`=== STATUS UPDATE ===`);
        console.log(`Status: ${status}, ID: ${id}`);
        alert(`Status updated to: ${status}`);
    };

    if (!applicants || applicants.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500">No applicants found</div>
            </div>
        );
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname || 'N/A'}</TableCell>
                                <TableCell>{item?.applicant?.email || 'N/A'}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                                <TableCell>
                                    {item?.applicant?.profile?.signedResumeUrl ? 
                                        <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.signedResumeUrl} target="_blank" rel="noopener noreferrer">
                                            {item?.applicant?.profile?.resumeOriginalName || 'Download Resume'}
                                        </a> : 
                                        <span className="text-gray-500">NA</span>
                                    }
                                </TableCell>
                                <TableCell>
                                    {item?.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div 
                                                        onClick={() => statusHandler(status, item?._id)} 
                                                        key={index} 
                                                        className='flex w-fit items-center my-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded'
                                                    >
                                                        <span>{status}</span>
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable
