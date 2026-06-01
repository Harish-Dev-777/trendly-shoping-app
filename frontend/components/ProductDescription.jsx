'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from '@clerk/nextjs'
import { fetchAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const ProductDescription = ({ product, onReviewAdded }) => {

    const [selectedTab, setSelectedTab] = useState('Description');
    const { userId, getToken } = useAuth();
    
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("Please sign in to write a review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!review.trim()) {
            toast.error("Please write a review");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const newReview = await fetchAPI(`/products/${product.id}/rate`, {
                method: 'POST',
                body: JSON.stringify({ userId, rating, review }),
                getToken: () => token
            });
            
            if (onReviewAdded) onReviewAdded(newReview);
            setRating(0);
            setReview('');
            toast.success("Review submitted successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-6 mt-8">
                    
                    {/* Write Review Form */}
                    {userId && !product.rating?.some(r => r.userId === userId) && (
                        <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-lg max-w-2xl border border-slate-100 mb-6">
                            <h3 className="font-semibold text-slate-800 mb-3">Write a Review</h3>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon 
                                        key={star} 
                                        size={22} 
                                        className={`cursor-pointer transition-colors ${rating >= star ? 'text-green-500' : 'text-slate-300'}`} 
                                        fill={rating >= star ? "#00C950" : "transparent"}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea 
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full border border-slate-200 rounded p-3 outline-none mb-3 resize-none bg-white"
                                rows="3"
                                placeholder="Share your thoughts about this product..."
                            />
                            <button 
                                disabled={isSubmitting}
                                type="submit" 
                                className="bg-slate-800 text-white px-5 py-2 rounded font-medium hover:bg-slate-900 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {(!product.rating || product.rating.length === 0) ? (
                        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
                    ) : (
                        product.rating.map((item, index) => (
                            <div key={index} className="flex gap-5 mb-6 border-b border-slate-100 pb-6 last:border-0">
                                <Image src={item.user?.image || '/upload_area.png'} alt="" className="size-10 rounded-full bg-slate-200" width={100} height={100} />
                                <div>
                                    <div className="flex items-center" >
                                        {Array(5).fill('').map((_, idx) => (
                                            <StarIcon key={idx} size={16} className='text-transparent mt-0.5' fill={item.rating >= idx + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                    <p className="text-sm max-w-lg my-3 text-slate-600">{item.review}</p>
                                    <p className="font-medium text-slate-800 text-xs">{item.user?.name}</p>
                                    <p className="mt-1 font-light text-xs text-slate-400">{new Date(item.createdAt).toDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Store Page */}
            <div className="flex gap-3 mt-14">
                <Image src={product.store?.logo || '/upload_area.png'} alt="" className="size-11 rounded-full ring ring-slate-400 bg-slate-200" width={100} height={100} />
                <div>
                    <p className="font-medium text-slate-600">Product by {product.store?.name}</p>
                    <Link href={`/shop/${product.store?.username}`} className="flex items-center gap-1.5 text-green-500"> view store <ArrowRight size={14} /></Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription