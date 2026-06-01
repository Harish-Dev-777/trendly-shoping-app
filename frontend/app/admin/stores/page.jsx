'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchAPI } from "@/lib/api"

export default function AdminStores() {

    const { getToken } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const data = await fetchAPI('/admin/stores', { getToken })
            // Only show approved stores in the live stores page
            const approvedStores = data.filter(store => store.status === 'approved')
            setStores(approvedStores)
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to load stores')
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId, currentStatus) => {
        try {
            await fetchAPI(`/admin/stores/${storeId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'approved', isActive: !currentStatus }),
                getToken
            })
            // Refresh list
            fetchStores()
        } catch (error) {
            console.error('Error updating store:', error)
            toast.error(error.message || 'Failed to update store status')
            throw error
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Live <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <p>Active</p>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleIsActive(store.id, store.isActive), { loading: "Updating data..." })} checked={store.isActive} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No stores Available</h1>
                </div>
            )
            }
        </div>
    ) : <Loading />
}