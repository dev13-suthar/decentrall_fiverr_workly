"use client"
import React, { useState } from 'react'
import UploadImage from './UploadImage'
import Image from 'next/image';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/utils';
import { useRouter } from 'next/navigation';

const Upload = () => {
    const [title, settitle] = useState("");
    const [images, setimages] = useState<string[]>([]);
    const router = useRouter();

    const onSubmit = async () => {
      try {
        const res = await axios.post(`${BACKEND_URL}/v1/user/task`,
          {
            options: images.map((image) => ({
              imageUrl: image,
            })),
            title,
            signature: "Hardcoded_signature_now",
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        router.push(`/task/${res.data.id}`)
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div className='pt-[4rem] px-4 flex flex-col items-center gap-3'>
        <div className='w-[80%] p-2 border px-4'>
            <div className='flex flex-col justify-center'>
                <p className='text-center text-4xl font-semibold mb-5'>Create Task!</p>
                {/* Form */}
                <div className='flex flex-col items-center gap-2 w-full'>
                    <section className='flex flex-col w-[100%]'>
                    <label htmlFor="title">Title</label>
                    <input type="text" value={title} onChange={(e)=>settitle(e.target.value)} placeholder='Title' className='p-2 w-full bg-stone-100 shadow-sm rounded-md outline-none focus:outline-none text-stone-800'/>
                    </section>
                    <p className='mt-2'>Select Images</p>
                    <UploadImage setImages={setimages}/>
                    <button className='bg-red-400 p-2 rounded-2xl mt-5' onClick={onSubmit}>Submit a Task</button>
                </div>
            </div>
                {/* Display Images */}
               {
                images.length>=1 && (
                    <div className='p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10'>
                    {images.map((img)=>(
                    <div key={Math.random()} className='w-full h-full flex justify-center items-center'>
                        <div className='w-[300px] h-[210px] p-2 border flex items-center justify-center'>
                        <Image src={img} alt='option' height={300} width={300} className='w-full h-full'/>
                    </div>  
                    </div>
                    ))}
            </div>
                )
               }
        </div>
    </div>
  )
}

export default Upload