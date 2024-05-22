"use client"
import useGetTask from '@/hooks/useGetTask'
import Image from 'next/image'
import React from 'react'

type props = {
  params:{
    id:string
  }
}

const TaskDetailPage = ({params:{id}}:props) => {
  const {taskDetails,isLoading} = useGetTask(id);

  if(isLoading) return "Loadddinggg"
  return (
    <div className='p-1'>
      <p className='text-center text-2xl font-medium tracking-wider mt-5'>Task Review</p>

      <div className='mt-4'>
          <div className='p-2 flex justify-center flex-wrap gap-10'>
              {taskDetails.map((task:tasks)=>(
                 <div className='w-[390px] h-[290px] flex flex-col items-center gap-3'key={task.id}>
                   <Image
                      src={task.option.imageUrl}
                      alt='pic'
                      height={400}
                      width={400}
                      className='h-full w-full min-h-[260px]'
                    />
                    <p className='text-2xl font-semibold'>Votes--{task.count}</p>
                 </div>
              ))}
          </div>
      </div>
    </div>
  )
}

export default TaskDetailPage