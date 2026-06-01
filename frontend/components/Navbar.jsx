'use client'
import { Search, ShoppingCart, Heart, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Show, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { fetchAPI } from "@/lib/api";

const Navbar = () => {

    const router = useRouter();

    const { userId, getToken } = useAuth();
    const [hasApprovedStore, setHasApprovedStore] = useState(false);

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.wishlistItems.length)
    const membership = useSelector(state => state.membership.plan)

    useEffect(() => {
        const checkStoreStatus = async () => {
            if (!userId) return;
            try {
                const store = await fetchAPI(`/seller/store/${userId}`, { getToken });
                if (store && store.status === 'approved' && store.isActive) {
                    setHasApprovedStore(true);
                }
            } catch (error) {
                // Not a seller or error
            }
        };
        checkStoreStatus();
    }, [userId]);

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const UserProfileMenu = () => (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Link 
                    label="My Orders"
                    labelIcon={<ShoppingCart size={16} />} 
                    href="/orders" 
                />
                <UserButton.Link 
                    label={hasApprovedStore ? "Sell Products" : "Become a seller"}
                    labelIcon={<Store size={16} />} 
                    href={hasApprovedStore ? "/store/add-product" : "/create-store"} 
                />
            </UserButton.MenuItems>
        </UserButton>
    )

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-black">Trendly</span>
                        {membership === 'plus' && (
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                                plus
                            </p>
                        )}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/wishlist" className="relative flex items-center gap-2 text-slate-600">
                            <Heart size={18} />
                            Wishlist
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{wishlistCount}</button>
                        </Link>
                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <UserProfileMenu />
                        </Show>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                    Login
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <UserProfileMenu />
                        </Show>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar