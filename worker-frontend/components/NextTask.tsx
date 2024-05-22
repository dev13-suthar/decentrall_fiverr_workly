"use client"

import { BACKEND_URL } from '@/app/configs/config'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Options from './Options'

const NextTask = () => {
    const [task, settask] = useState<userTask | null>(null);
    const [loading, setloading] = useState(true);
    const [submitting, setsubmitting] = useState(false);
    useEffect(()=>{
        setloading(true)
        axios.get(`${BACKEND_URL}/v1/worker/nexttask`,{
            headers:{
                "Authorization":localStorage.getItem("token")
            }
        }).then(res=>{
            settask(res.data.task);
            console.log(res.data.task)
            setloading(false)
        }).catch(e=>{
            setloading(false);
            settask(null);
            console.log(e)
        })
    },[]);

    if(loading) return "Loaddinggg..."

    if(!task){
        return <div className='w-full h-full flex justify-center pt-6 p-5'>
            Please Check after Some time,Currently there is no pending Tasks
        </div>
    }
  return (
    <div>
         <div className="p-2 text-2xl pt-14 flex justify-center">
          {task.title} {submitting && 'Submittin task...'}
          </div>
          <div className='flex justify-center p-1 pt-8 flex-wrap gap-9'>
            {task.options.map(option=> <Options key={option.id} imageUrl={option.image_url} onSelect={async()=>{
                setsubmitting(true)
                try {
                    const res = await axios.post(`${BACKEND_URL}/v1/worker/submission`,{
                        taskId:task.id.toString(),
                        selection:option.id.toString(),
                    },{
                        headers:{
                            "Authorization":localStorage.getItem("token")
                        }
                    }
                );
                    const nextTask = await res.data.nexTask;
                    if(nextTask){
                        settask(nextTask)
                    }else{
                        settask(null)
                    }
                } catch (error) {
                    console.log(error)
                }
                setsubmitting(false);
            }} />)}
          </div>
    </div>
  )
}

export default NextTask