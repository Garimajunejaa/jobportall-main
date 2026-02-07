import React, { useEffect, useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update company";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    },[singleCompany]);

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <AdminNavbar />
            <div className='w-full max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10'>
                <form onSubmit={submitHandler} className='bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-6 sm:mb-8'>
                        <Button 
                            onClick={() => navigate("/admin/companies")} 
                            variant="outline" 
                            className="flex items-center gap-2 text-gray-500 font-semibold hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 text-sm sm:text-base"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl sm:text-2xl bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Company Setup
                        </h1>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                        <div className='space-y-2'>
                            <Label className="text-sm sm:text-base">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-sm sm:text-base">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-sm sm:text-base">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-sm sm:text-base">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className='space-y-2 sm:col-span-2'>
                            <Label className="text-sm sm:text-base">Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                    </div>
                    
                    {
                        loading ? 
                            <Button disabled className="w-full mt-6 sm:mt-8 bg-gray-100 text-sm sm:text-base">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                Please wait 
                            </Button> : 
                            <Button type="submit" className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-sm sm:text-base">
                                Update
                            </Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup