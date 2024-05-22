"use client"
import { BACKEND_URL } from "@/utils/utils";
import axios from "axios";
import { useEffect, useState } from "react"


const useGetTask = (id:string) => {
    const [isLoading, setisLoading] = useState(false);
    const [taskDetails, settaskDetails] = useState([]);

    useEffect(()=>{
        const getTask = async()=>{
            setisLoading(true)
            const res = await axios.get(`${BACKEND_URL}/v1/user/task?taskId=${id}`,{
                headers:{
                    "Authorization":localStorage.getItem("token")
                }
            });
            const result = await res.data;
            settaskDetails(result.resultArray);
            setisLoading(false);
        }
        getTask();
    },[id])
  return {taskDetails,isLoading}
}

export default useGetTask