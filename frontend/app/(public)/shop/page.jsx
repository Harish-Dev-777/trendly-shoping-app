'use client'
import { Suspense, useState, useMemo, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, FilterIcon, Star, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { fetchAPI } from "@/lib/api"
import { setProduct } from "@/lib/features/product/productSlice"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const products = useSelector(state => state.product.list)

    // Fetch latest products when page loads to ensure instant updates
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const latestProducts = await fetchAPI('/products');
                dispatch(setProduct(latestProducts));
            } catch (error) {
                console.error('Failed to fetch latest products:', error);
            }
        };
        loadProducts();
    }, [dispatch]);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([])
    const [maxPrice, setMaxPrice] = useState(20000) // Default max price matching INR updates
    const [minRating, setMinRating] = useState(0)
    const [showFilters, setShowFilters] = useState(false) // For mobile toggle

    // Derived distinct categories from products
    const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products])

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search text
            if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
            
            // Category
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

            // Price
            if (product.price > maxPrice) return false;

            // Rating
            const avgRating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length) || 0;
            if (avgRating < minRating) return false;

            return true;
        });
    }, [products, search, selectedCategories, maxPrice, minRating]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setMaxPrice(20000)
        setMinRating(0)
        if (search) router.push('/shop')
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center my-6">
                    <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"> 
                        {search && <MoveLeftIcon size={20} />} All <span className="text-slate-700 font-medium">Products</span>
                    </h1>
                    <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-md text-slate-600">
                        <FilterIcon size={18} /> Filters
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8 mb-32 relative items-start">
                    
                    {/* Products Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                        ) : (
                            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-lg">
                                No products found matching your criteria.
                            </div>
                        )}
                    </div>

                    {/* Mobile Overlay */}
                    {showFilters && (
                        <div 
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
                            onClick={() => setShowFilters(false)}
                        />
                    )}

                    {/* Sidebar Filters */}
                    <div className={`
                        fixed inset-y-0 right-0 z-50 w-[280px] sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto
                        ${showFilters ? 'translate-x-0' : 'translate-x-full'}
                        lg:relative lg:translate-x-0 lg:shadow-none lg:w-72 lg:flex-shrink-0 lg:order-last lg:border lg:border-slate-200 lg:rounded-lg lg:self-start lg:sticky lg:top-6 lg:z-0 lg:overflow-visible lg:transform-none
                    `}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 lg:border-none lg:p-6 lg:pb-0 mb-6 lg:mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
                            <div className="flex items-center gap-4">
                                <button onClick={clearFilters} className="text-sm text-indigo-500 hover:underline">Clear all</button>
                                <button onClick={() => setShowFilters(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="px-6 lg:px-6 lg:pt-0">
                            {/* Category Filter */}
                        <div className="mb-6">
                            <h3 className="font-medium text-slate-700 mb-3">Categories</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <hr className="border-slate-100 my-6" />

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <h3 className="font-medium text-slate-700 mb-3 flex justify-between">
                                Max Price
                                <span className="text-indigo-600 font-semibold text-sm">{currency}{maxPrice.toLocaleString()}</span>
                            </h3>
                            <input 
                                type="range" 
                                min="0" 
                                max="20000" 
                                step="500" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>{currency}0</span>
                                <span>{currency}20,000+</span>
                            </div>
                        </div>

                        <hr className="border-slate-100 my-6" />

                        {/* Rating Filter */}
                        <div className="mb-2">
                            <h3 className="font-medium text-slate-700 mb-3">Min Rating</h3>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map(rating => (
                                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="rating"
                                            className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            checked={minRating === rating}
                                            onChange={() => setMinRating(rating)}
                                        />
                                        <div className="flex items-center gap-1">
                                            {Array(5).fill('').map((_, idx) => (
                                                <Star key={idx} size={14} fill={idx < rating ? "#F59E0B" : "#D1D5DB"} className="text-transparent" />
                                            ))}
                                            <span className="text-sm text-slate-600 ml-1">& up</span>
                                        </div>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3 cursor-pointer group mt-2">
                                    <input 
                                        type="radio" 
                                        name="rating"
                                        className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        checked={minRating === 0}
                                        onChange={() => setMinRating(0)}
                                    />
                                    <span className="text-sm text-slate-600">Any rating</span>
                                </label>
                            </div>
                        </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}