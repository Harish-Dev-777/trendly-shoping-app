'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const WishlistPage = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems)
    const products = useSelector(state => state.product.list)

    const wishlistProducts = products.filter(product => wishlistItems.includes(product.id))

    const handleMoveToCart = (productId) => {
        dispatch(addToCart({ productId }))
        dispatch(removeFromWishlist({ productId }))
    }

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist({ productId }))
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
                <h1 className="text-3xl font-semibold text-slate-800 mb-8">My Wishlist</h1>
                
                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 mb-4">Your wishlist is empty.</p>
                        <Link href="/shop" className="text-indigo-500 hover:underline">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistProducts.map(product => (
                            <div key={product.id} className="border border-slate-200 rounded-lg p-4 flex flex-col relative group">
                                <button onClick={() => handleRemove(product.id)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition z-10">
                                    <Trash2 size={18} />
                                </button>
                                <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
                                    <div className="bg-[#F5F5F5] h-48 rounded-lg flex items-center justify-center mb-4">
                                        <Image width={200} height={200} className="max-h-36 w-auto object-contain group-hover:scale-110 transition duration-300" src={product.images[0]} alt={product.name} />
                                    </div>
                                    <h3 className="font-medium text-slate-800 line-clamp-1">{product.name}</h3>
                                    <p className="text-slate-600 mt-1">{currency}{product.price}</p>
                                </Link>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={() => handleMoveToCart(product.id)}
                                        className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm font-medium"
                                    >
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default WishlistPage
