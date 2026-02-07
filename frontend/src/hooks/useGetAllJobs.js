import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { allJobs } = useSelector(state => state.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await fetch(`${JOB_API_END_POINT}/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    dispatch(setAllJobs(data.jobs || []));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchAllJobs();
    }, [dispatch]);

    return allJobs;
};

export default useGetAllJobs;
