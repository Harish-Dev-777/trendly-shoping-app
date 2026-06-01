'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import { fetchAPI, API_URL } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function CreateStore() {

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const { userId, getToken } = useAuth()
    const router = useRouter()

    const fetchSellerStatus = async () => {
        try {
            if (!userId) return;
            const store = await fetchAPI(`/seller/store/${userId}`, { getToken });
            if (store) {
                setAlreadySubmitted(true);
                setStatus(store.status);
                setMessage(store.status === 'approved' ? 'Your store is approved!' : 'Your store application is pending.');
                if (store.status === 'approved') {
                    setTimeout(() => {
                        router.push('/store');
                    }, 5000);
                }
            }
        } catch (error) {
            console.log('No store application found or error:', error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!userId) {
                toast.error('You must be logged in to create a store');
                return;
            }

            let logoUrl = "placeholder-logo-url";
            
            // Upload logo if provided
            if (storeInfo.image) {
                const formData = new FormData();
                formData.append('image', storeInfo.image);
                
                const token = await getToken();
                const uploadRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (!uploadRes.ok) {
                    throw new Error("Failed to upload logo");
                }
                
                const uploadData = await uploadRes.json();
                logoUrl = uploadData.url;
            }

            const payload = {
                userId,
                ...storeInfo,
                logo: logoUrl
            };

            const response = await fetchAPI('/seller/store', {
                method: 'POST',
                body: JSON.stringify(payload),
                getToken
            });

            setAlreadySubmitted(true);
            setStatus(response.status);
            setMessage('Your store application has been submitted successfully and is pending review.');
        } catch (error) {
            console.error('Error submitting store:', error);
            toast.error(error.message || 'Failed to submit store application');
            throw error; // Let toast.promise handle the rejection
        }
    }

    useEffect(() => {
        if (userId) {
            fetchSellerStatus();
        } else {
            setLoading(false);
        }
    }, [userId]);

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}