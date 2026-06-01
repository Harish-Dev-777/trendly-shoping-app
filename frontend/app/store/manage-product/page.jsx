'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import { fetchAPI } from "@/lib/api"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const { userId, getToken } = useAuth()
    const [storeId, setStoreId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

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

    const fetchProducts = async () => {
        if (!storeId) return;
        try {
            const data = await fetchAPI(`/seller/${storeId}/products`, { getToken })
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId, currentStock) => {
        try {
            await fetchAPI(`/seller/${storeId}/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({ inStock: !currentStock }),
                getToken
            })
            fetchProducts()
        } catch (error) {
            console.error('Error toggling stock', error)
            throw error
        }
    }

    const deleteProduct = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetchAPI(`/seller/${storeId}/products/${productId}`, {
                method: 'DELETE',
                getToken
            })
            fetchProducts()
            toast.success("Product deleted successfully")
        } catch (error) {
            console.error('Error deleting product', error)
            toast.error("Failed to delete product")
        }
    }

    useEffect(() => {
        if (userId) {
            fetchStoreId()
        }
    }, [userId])

    useEffect(() => {
        if (storeId) {
            fetchProducts()
        }
    }, [storeId])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center flex items-center justify-center gap-4 h-[65px]">
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id, product.inStock), { loading: "Updating data..." })} checked={product.inStock} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                                <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}