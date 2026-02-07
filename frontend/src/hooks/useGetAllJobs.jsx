import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery, allJobs} = useSelector(store=>store.job);
    
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                console.log('useGetAllJobs - fetching from:', JOB_API_END_POINT);
                // Use the correct endpoint - either /all or /jobs
                const endpoint = searchedQuery ? `/jobs?keyword=${searchedQuery}` : '/all';
                const res = await axios.get(`${JOB_API_END_POINT}${endpoint}`,{withCredentials:true});
                console.log('useGetAllJobs - response:', res.data);
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs || []));
                    console.log('useGetAllJobs - dispatched jobs:', res.data.jobs?.length);
                }
            } catch (error) {
                console.error('useGetAllJobs - error:', error);
            }
        }
        fetchAllJobs();
    },[searchedQuery])
}

export default useGetAllJobs