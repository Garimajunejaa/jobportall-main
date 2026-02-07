import React, { useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: 0,
        position: 0,
        company: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    const jobTypes = [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
        { label: "Remote", value: "remote" }
    ];

    const experienceLevels = [
        { label: "Entry Level", value: 0 },
        { label: "Junior", value: 1 },
        { label: "Mid-Level", value: 2 },
        { label: "Senior", value: 3 },
        { label: "Lead", value: 4 }
    ];

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleCompanyChange = (value) => {
        const selectedCompany = companies.find((company) => company.name === value);
        if (selectedCompany) {
            setInput({ ...input, company: selectedCompany._id });
        }
    };

    const handleJobTypeChange = (value) => {
        setInput({ ...input, jobType: value });
    };

    const handleExperienceChange = (value) => {
        setInput({ ...input, experienceLevel: parseInt(value) });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.title || !input.description || !input.salary || 
            !input.location || !input.jobType || !input.company || 
            !input.position || input.requirements === "") {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const formattedInput = {
                ...input,
                requirements: input.requirements.split('\n').filter(req => req.trim()),
                salary: Number(input.salary),
                position: Number(input.position),
                experienceLevel: Number(input.experienceLevel)
            };

            const res = await axios.post(`${JOB_API_END_POINT}/post`, formattedInput, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error('Error details:', error);
            toast.error(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <AdminNavbar />
            <div className='w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10'>
                <form onSubmit={submitHandler} className='bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg'>
                    <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                        Post New Job
                    </h2>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-sm sm:text-base"
                                placeholder="e.g. Senior Frontend Developer"
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-sm sm:text-base"
                                placeholder="e.g. New York, Remote"
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Job Type</Label>
                            <Select 
                                name="jobType" 
                                onValueChange={handleJobTypeChange}
                                required
                            >
                                <SelectTrigger className="border-gray-200 text-sm sm:text-base">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {jobTypes.map(type => (
                                            <SelectItem 
                                                key={type.value} 
                                                value={type.value}
                                                className="text-sm sm:text-base"
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Experience Level</Label>
                            <Select 
                                name="experienceLevel" 
                                onValueChange={handleExperienceChange}
                            >
                                <SelectTrigger className="border-gray-200 text-sm sm:text-base">
                                    <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {experienceLevels.map(level => (
                                            <SelectItem 
                                                key={level.value} 
                                                value={level.value.toString()}
                                                className="text-sm sm:text-base"
                                            >
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Salary (LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-sm sm:text-base"
                                placeholder="e.g. 12"
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Number of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-sm sm:text-base"
                                min="1"
                                required
                            />
                        </div>

                        <div className='space-y-2 sm:col-span-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Job Description</Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="w-full h-24 sm:h-32 rounded-md border border-gray-200 focus:border-violet-500 focus:ring-violet-500 p-2 sm:p-3 text-sm sm:text-base resize-none"
                                placeholder="Enter detailed job description..."
                                required
                            />
                        </div>

                        <div className='space-y-2 sm:col-span-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Requirements (one per line)</Label>
                            <textarea
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="w-full h-24 sm:h-32 rounded-md border border-gray-200 focus:border-violet-500 focus:ring-violet-500 p-2 sm:p-3 text-sm sm:text-base resize-none"
                                placeholder="Enter job requirements (one per line)..."
                                required
                            />
                            <p className="text-xs sm:text-sm text-gray-500">Each line will be treated as a separate requirement</p>
                        </div>

                        {companies.length > 0 && (
                            <div className='space-y-2 sm:col-span-2'>
                                <Label className="text-gray-700 text-sm sm:text-base">
                                    Select Company <span className="text-red-500">*</span>
                                </Label>
                                <Select 
                                    onValueChange={handleCompanyChange}
                                    required
                                >
                                    <SelectTrigger className="border-gray-200 text-sm sm:text-base">
                                        <SelectValue placeholder="Choose a company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem 
                                                    key={company._id} 
                                                    value={company.name}
                                                    className="text-sm sm:text-base"
                                                >
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <Button disabled className="w-full mt-6 sm:mt-8 bg-gray-100 text-sm sm:text-base">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button 
                            type="submit" 
                            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-sm sm:text-base"
                        >
                            Post New Job
                        </Button>
                    )}

                    {companies.length === 0 && (
                        <p className='text-xs sm:text-sm text-red-600 text-center mt-4'>
                            Please register a company first before posting jobs
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob