import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                console.log('=== FETCHING ADMIN JOBS START ===');
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                console.log('Admin Jobs API response:', res.data);
                console.log('Admin Jobs count:', res.data.jobs?.length);
                console.log('Admin Jobs data sample:', res.data.jobs?.slice(0, 2));
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                    console.log('=== ADMIN JOBS DISPATCHED ===');
                }
            } catch (error) {
                console.error('=== ADMIN JOBS FETCH ERROR ===');
                console.error(error);
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminJobs