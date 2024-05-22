"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const Appbar = () => {
  const router = useRouter();
  return (
    <nav className='p-3 flex items-center justify-between px-5 bg-slate-800 shadow-xl'>
        <p className='text-2xl font-medium tracking-widest cursor-pointer' onClick={()=>router.push("/")}>WorkLy</p>
        <button className='p-2 rounded-xl bg-slate-100 text-stone-800 outline-none'>Connect a Wallet</button>
    </nav>
  )
}

export default Appbar