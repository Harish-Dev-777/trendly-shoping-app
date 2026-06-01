'use client'
import React, { useState } from 'react'
import Title from './Title'
import { fetchAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await fetchAPI('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            toast.success("Subscribed successfully!");
            setEmail('');
        } catch (error) {
            toast.error(error.message || "Failed to subscribe");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            <form onSubmit={handleSubmit} className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200'>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} className='flex-1 pl-5 outline-none bg-transparent' type="email" placeholder='Enter your email address' />
                <button disabled={loading} type="submit" className='font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition disabled:opacity-50'>
                    {loading ? 'Subscribing...' : 'Get Updates'}
                </button>
            </form>
        </div>
    )
}

export default Newsletter