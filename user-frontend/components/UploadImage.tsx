"use client"
import { BACKEND_URL, CLoudFront_URL } from '@/utils/utils';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react'

type props = {
    setImages:Dispatch<SetStateAction<string[]>>
}

const UploadImage = ({setImages}:props) => {
    const [isUploading, setisUploading] = useState(false);

    const onFileSelect = async(e:any)=>{
        setisUploading(true);
        try {
            const file = e.target.files[0];
            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`,{
                headers:{
                    "Authorization":localStorage.getItem("token")
                }
            });
            const presignedUrl = response.data.presignedUrl;
            const formData = new FormData();
            formData.set("bucket", response.data.fields["bucket"])
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"]);
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
            formData.set("key", response.data.fields["key"]);
            formData.set("Policy", response.data.fields["Policy"]);
            formData.set("Content-type","image/png")
            formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.append("file", file);
            const awsResponse = await axios.post(presignedUrl,formData);
             const ImgUrl = (`${CLoudFront_URL}/${response.data.fields["key"]}`);
             setImages((i)=>[...i,ImgUrl]);
            console.log(awsResponse)
        } catch (error) {
            console.log(error)
        }
        setisUploading(false)
    } 
  return (
    <div className='w-40 h-40 rounded border text-2xl cursor-pointer mt-2 bg-blue-950'>
        <div className='h-full flex justify-center'>
            <div className='h-full flex justify-center flex-col relative'>
                {isUploading ? <div className='text-sm'>Loadinggg..</div>:
                <>
                <span>+</span>
                <input type='file' className="opacity-0 absolute top-0 right-0 left-0 bottom-0 w-[100%] h-[100%]" onChange={onFileSelect}/>
                </>
                }
            </div>  
        </div>
    </div>
  )
}

export default UploadImage