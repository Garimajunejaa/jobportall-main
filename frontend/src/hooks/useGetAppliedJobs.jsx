import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = (forceRefresh = false) => {
    const dispatch = useDispatch();
    const allAppliedJobs = useSelector(store => store.job.allAppliedJobs);

    useEffect(()=>{
        // Only fetch if forceRefresh is true or if no data exists
        if (!forceRefresh && allAppliedJobs && allAppliedJobs.length > 0) {
            return;
        }

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                console.log(res.data);
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application || []));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[allAppliedJobs, forceRefresh, dispatch]);
};
export default useGetAppliedJobs;