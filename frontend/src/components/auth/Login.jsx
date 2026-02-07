import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.email || !input.password || !input.role) {
            toast.error("Please fill all the fields");
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, {
                email: input.email.trim().toLowerCase(),
                password: input.password,
                role: input.role
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', input.role);
                dispatch(setUser(res.data.user));
                
                if (input.role === 'recruiter') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
                toast.success("Login successful!");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";
            toast.error(errorMessage);
            setInput(prev => ({ ...prev, password: '' }));
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8'>
                <form onSubmit={submitHandler} className='w-full sm:w-4/5 md:w-3/4 lg:w-1/2 bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 my-4 sm:my-8 lg:my-10'>
                    <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center mb-4 sm:mb-6 lg:mb-8'>Welcome Back</h1>
                    
                    <div className='space-y-2 mb-4 sm:mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="your@email.com"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                    </div>

                    <div className='space-y-2 mb-4 sm:mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </Link>
                    </div>

                    <div className='flex items-center justify-center mb-4 sm:mb-6'>
                        <RadioGroup className="flex items-center gap-4 sm:gap-6 my-3 sm:my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1" className="text-sm sm:text-base">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2" className="text-sm sm:text-base">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>

                    <div className='text-center mt-4 sm:mt-6'>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login