import React, { useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error('Please enter a company name');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, 
                { companyName }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <AdminNavbar />
            <div className='w-full max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10'>
                <div className='bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg'>
                    <div className='mb-6 sm:mb-8'>
                        <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-2'>
                            Create New Company
                        </h1>
                        <p className='text-gray-500 text-sm sm:text-base'>
                            Start by giving your company a name. You can add more details later.
                        </p>
                    </div>

                    <div className='space-y-4 sm:space-y-6'>
                        <div className='space-y-2'>
                            <Label className="text-gray-700 text-sm sm:text-base">Company Name</Label>
                            <Input
                                type="text"
                                className="border-gray-200 focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
                                placeholder="e.g. Microsoft, Apple, Google"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4'>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 text-sm sm:text-base order-2 sm:order-1"
                            >
                                Cancel
                            </Button>
                            {loading ? (
                                <Button disabled className="bg-gray-100 flex-1 order-1 sm:order-2 text-sm sm:text-base">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </Button>
                            ) : (
                                <Button 
                                    onClick={registerNewCompany}
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 order-1 sm:order-2 text-sm sm:text-base"
                                >
                                    Create Company
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate