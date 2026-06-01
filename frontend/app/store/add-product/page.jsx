'use client'
import { assets } from "@/assets/assets"
import { SparklesIcon } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchAPI, API_URL } from "@/lib/api"

export default function StoreAddProduct() {

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [images, setImages] = useState([])
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)

    const fileInputRef = useRef(null);

    const { userId, getToken } = useAuth();

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            if (images.length >= 10) {
                toast.error("You can only upload up to 10 images");
                return;
            }
            const newImage = e.target.files[0];
            setImages([...images, newImage]);
            
            // Auto trigger AI on first image
            if (images.length === 0 && !productInfo.name) {
                generateWithAI(newImage);
            }
        }
    }

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    const generateWithAI = async (fileToAnalyze = null) => {
        const imageToUse = fileToAnalyze || images[0];
        
        if (!imageToUse) {
            toast.error("Please add an image first to use AI");
            return;
        }

        setIsGeneratingAI(true);
        const toastId = toast.loading("AI is analyzing your image...");
        try {
            const reader = new FileReader();
            
            reader.readAsDataURL(imageToUse);
            reader.onload = async () => {
                const base64Data = reader.result.split(',')[1];
                const mimeType = imageToUse.type;

                const token = await getToken();
                const response = await fetch(`${API_URL}/ai/analyze-product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ image: base64Data, mimeType })
                });

                if (!response.ok) {
                    let errorMessage = "Failed to generate AI content";
                    try {
                        const errData = await response.json();
                        if (errData.error) errorMessage = errData.error;
                    } catch (e) {}
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                
                setProductInfo(prev => ({
                    ...prev,
                    name: data.name || prev.name,
                    description: data.description || prev.description
                }));
                toast.success("Content generated successfully!", { id: toastId });
            };
            
            reader.onerror = () => {
                throw new Error("Failed to read image file");
            };
        } catch (error) {
            console.error("AI Error:", error);
            toast.error(error.message || "Failed to generate AI content", { id: toastId });
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            if (!userId) throw new Error("User not authenticated");
            // 1. Fetch store ID for this user
            const store = await fetchAPI(`/seller/store/${userId}`, { getToken });
            if (!store || !store.id) {
                throw new Error("No approved store found. Please create a store first.");
            }

            // 2. Prepare images
            let imageUrls = [];
            const filesToUpload = images;
            
            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach(file => formData.append('images', file));
                
                const token = await getToken();
                const uploadRes = await fetch(`${API_URL}/upload/multiple`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (!uploadRes.ok) {
                    throw new Error("Failed to upload images");
                }
                
                const uploadData = await uploadRes.json();
                imageUrls = uploadData.urls;
            } else {
                imageUrls = ["placeholder-product-1"];
            }

            // 3. POST product
            const payload = {
                ...productInfo,
                images: imageUrls,
                inStock: true // default availability
            };

            await fetchAPI(`/seller/${store.id}/products`, {
                method: 'POST',
                body: JSON.stringify(payload),
                getToken
            });

            toast.success("Product added successfully!");
            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "" });
            setImages([]);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to add product");
            throw error;
        } finally {
            setLoading(false);
        }
    }


    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div className="flex flex-wrap gap-3 mt-4">
                {images.map((img, index) => (
                    <div key={index} className="relative group">
                        <Image width={300} height={300} className='h-24 w-auto border border-slate-200 rounded object-cover' src={URL.createObjectURL(img)} alt="" />
                        <div onClick={() => removeImage(index)} className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded cursor-pointer transition">
                            <span className="text-white text-xs font-semibold uppercase tracking-wider">Remove</span>
                        </div>
                    </div>
                ))}
                
                {images.length < 10 && (
                    <div 
                        onClick={() => fileInputRef.current.click()} 
                        className="h-24 w-24 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition text-slate-400 hover:text-slate-600"
                    >
                        <span className="text-3xl font-light leading-none">+</span>
                        <span className="text-xs font-medium mt-1">Upload</span>
                    </div>
                )}
                <input type="file" ref={fileInputRef} accept='image/*' onChange={handleImageChange} hidden />
            </div>

            {images.length > 0 && (
                <button 
                    type="button" 
                    onClick={() => generateWithAI()}
                    disabled={isGeneratingAI}
                    className="mt-4 flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-md hover:bg-purple-100 transition active:scale-95 text-sm font-medium disabled:opacity-60"
                >
                    <SparklesIcon size={16} />
                    {isGeneratingAI ? "Generating..." : "Auto-fill using AI"}
                </button>
            )}

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}