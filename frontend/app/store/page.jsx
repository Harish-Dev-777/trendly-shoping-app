'use client'
import { dummyStoreDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { fetchAPI } from "@/lib/api"

export default function Dashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const router = useRouter()
    
    const { userId, getToken } = useAuth()
    const { user } = useUser()
    const [storeId, setStoreId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recentOrders, setRecentOrders] = useState([])
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    const fetchStoreId = async () => {
        try {
            if (!userId) return
            const store = await fetchAPI(`/seller/store/${userId}`, { getToken })
            if (store && store.id) {
                setStoreId(store.id)
            }
        } catch (error) {
            console.error('Error fetching store info', error)
        }
    }

    const fetchDashboardData = async () => {
        if (!storeId) return
        try {
            const data = await fetchAPI(`/seller/${storeId}/metrics`, { getToken })
            setDashboardData({
                totalProducts: data.totalProducts || 0,
                totalEarnings: data.totalEarnings || 0,
                totalOrders: data.totalOrders || 0,
                ratings: data.ratings || [],
            })

            const ordersData = await fetchAPI(`/seller/${storeId}/orders`, { getToken })
            setRecentOrders(ordersData || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchStoreId()
        }
    }, [userId])

    useEffect(() => {
        if (storeId) {
            fetchDashboardData()
            const interval = setInterval(fetchDashboardData, 5000);
            return () => clearInterval(interval);
        }
    }, [storeId])

    if (loading) return <Loading />

    return (
        <div className=" text-slate-500 mb-28">
            <div className="flex items-center gap-4 mb-6">
                {user?.imageUrl && (
                    <Image src={user.imageUrl} alt="Profile" width={60} height={60} className="rounded-full border-2 border-slate-200" />
                )}
                <div>
                    <h1 className="text-2xl">Welcome back, <span className="text-slate-800 font-medium">{user?.fullName || 'Seller'}</span>!</h1>
                    <p className="text-sm text-slate-400">Here's what's happening in your store today.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <h2 className="text-xl font-medium text-slate-700 mb-4 mt-10">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {recentOrders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-slate-800">#{order.id.slice(-6)}</td>
                                <td className="px-4 py-3">{order.user?.name || 'Guest'}</td>
                                <td className="px-4 py-3">{order.orderItems?.length || 0} items</td>
                                <td className="px-4 py-3 font-medium">{currency} {order.total.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">No orders yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h2 className="mt-10">Total Reviews</h2>
            <div className="mt-5">
                {
                    dashboardData.ratings.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl">
                            <div>
                                <div className="flex gap-3">
                                    <Image src={review.user.image} alt="" className="w-10 aspect-square rounded-full" width={100} height={100} />
                                    <div>
                                        <p className="font-medium">{review.user.name}</p>
                                        <p className="font-light text-slate-500">{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-slate-500 max-w-xs leading-6">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-slate-400">{review.product?.category}</p>
                                    <p className="font-medium">{review.product?.name}</p>
                                    <div className='flex items-center'>
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={17} className='text-transparent mt-0.5' fill={review.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all">View Product</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}