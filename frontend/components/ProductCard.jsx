'use client'
import { StarIcon, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const isWishlisted = wishlistItems.includes(product.id)

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            dispatch(removeFromWishlist({ productId: product.id }))
        } else {
            dispatch(addToWishlist({ productId: product.id }))
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ productId: product.id }))
    }

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto flex flex-col'>
            <div className='relative bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' src={product.images[0]} alt="" />
                <button onClick={handleWishlist} className='absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition'>
                    <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "currentColor"} className={isWishlisted ? "text-red-500" : "text-slate-600"} />
                </button>
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
            {product.inStock ? (
                <button onClick={handleAddToCart} className='mt-3 w-full py-2 bg-black text-white rounded-md hover:bg-slate-800 transition text-sm font-medium'>
                    Add to Cart
                </button>
            ) : (
                <button disabled className='mt-3 w-full py-2 bg-slate-300 text-slate-500 cursor-not-allowed rounded-md text-sm font-medium'>
                    Out of Stock
                </button>
            )}
        </Link>
    )
}

export default ProductCard