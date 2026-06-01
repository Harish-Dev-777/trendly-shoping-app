'use client'
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { fetchAPI } from "@/lib/api"
import toast from "react-hot-toast"

export default function AdminCoupons() {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: ''
    })

    const fetchCoupons = async () => {
        try {
            const data = await fetchAPI('/admin/coupons', { getToken })
            setCoupons(data || [])
        } catch (error) {
            console.error('Failed to fetch coupons', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleCreateCoupon = async (e) => {
        e.preventDefault()
        try {
            await fetchAPI('/admin/coupons', {
                method: 'POST',
                body: JSON.stringify(formData),
                getToken
            })
            fetchCoupons()
            toast.success('Coupon created successfully')
            setFormData({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: true,
                expiresAt: ''
            })
        } catch (error) {
            console.error('Failed to create coupon', error)
            toast.error('Failed to create coupon')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl mb-8">Manage <span className="text-slate-800 font-medium">Coupons</span></h1>
            
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-10 max-w-4xl">
                <h2 className="text-lg font-medium text-slate-700 mb-4">Create New Coupon</h2>
                <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Coupon Code (e.g. SUMMER20)" className="p-2 border border-slate-300 rounded outline-none" required />
                        <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="Discount Percentage (e.g. 20)" className="p-2 border border-slate-300 rounded outline-none" required />
                    </div>
                    <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="p-2 border border-slate-300 rounded outline-none" required />
                    <input type="date" name="expiresAt" value={formData.expiresAt} onChange={handleInputChange} className="p-2 border border-slate-300 rounded outline-none" required />
                    
                    <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="forNewUser" checked={formData.forNewUser} onChange={handleInputChange} className="accent-slate-700" />
                            For New Users Only
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="forMember" checked={formData.forMember} onChange={handleInputChange} className="accent-slate-700" />
                            For Members
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleInputChange} className="accent-slate-700" />
                            Publicly Available
                        </label>
                    </div>

                    <button type="submit" className="mt-4 bg-slate-800 text-white py-2 px-6 rounded w-fit hover:bg-slate-900 transition-all">Create Coupon</button>
                </form>
            </div>

            <div className="overflow-x-auto max-w-4xl">
                <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Target</th>
                            <th className="px-4 py-3">Expires At</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {coupons.map((coupon) => (
                            <tr key={coupon.code} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold">{coupon.code}</td>
                                <td className="px-4 py-3">{coupon.discount}%</td>
                                <td className="px-4 py-3">{coupon.description}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {coupon.forNewUser && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">New Users</span>}
                                        {coupon.forMember && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Members</span>}
                                        {coupon.isPublic && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Public</span>}
                                    </div>
                                </td>
                                <td className="px-4 py-3">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}