'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuth } from "@clerk/nextjs";
import { fetchAPI } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setRatings } from "@/lib/features/rating/ratingSlice";
export default function Orders() {

    const { userId, getToken } = useAuth();
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();

    const fetchOrders = async () => {
        if (!userId) return;
        try {
            const data = await fetchAPI(`/orders/user/${userId}`, { getToken });
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchRatings = async () => {
        if (!userId) return;
        try {
            const data = await fetchAPI(`/users/${userId}`, { getToken });
            if (data.ratings) {
                dispatch(setRatings(data.ratings));
            }
        } catch (error) {
            console.error('Failed to fetch user ratings:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
            fetchRatings();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}