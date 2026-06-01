'use client';
import { useEffect, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { setProduct } from '@/lib/features/product/productSlice';
import { setCart } from '@/lib/features/cart/cartSlice';
import { setWishlist } from '@/lib/features/wishlist/wishlistSlice';
import { fetchAPI } from '@/lib/api';
import { useAuth, useUser } from '@clerk/nextjs';

export default function StoreInitializer({ children }) {
    const dispatch = useDispatch();
    const store = useStore();
    const { userId, getToken } = useAuth();
    const { user } = useUser();
    
    const initialized = useRef(false);
    const authRef = useRef({ userId, getToken, user });
    const syncTimeoutRef = useRef(null);

    // Update ref when auth changes
    useEffect(() => {
        authRef.current = { userId, getToken, user };
    }, [userId, getToken, user]);

    // Fetch user data when logged in
    useEffect(() => {
        if (userId) {
            const loadUserData = async () => {
                try {
                    const token = await getToken();
                    const data = await fetchAPI(`/users/${userId}`, { getToken: () => token });
                    if (data.cart && Object.keys(data.cart).length > 0) dispatch(setCart(data.cart));
                    if (data.wishlist && data.wishlist.length > 0) dispatch(setWishlist(data.wishlist));
                } catch (e) {
                    console.error('Failed to load user data', e);
                }
            };
            loadUserData();
        }
    }, [userId, dispatch]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchAPI('/products');
                dispatch(setProduct(products));
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        if (!initialized.current) {
            // Load from localStorage
            try {
                const savedCart = localStorage.getItem('trendly_cart');
                if (savedCart) dispatch(setCart(JSON.parse(savedCart)));
                
                const savedWishlist = localStorage.getItem('trendly_wishlist');
                if (savedWishlist) dispatch(setWishlist(JSON.parse(savedWishlist)));
            } catch (e) {
                console.error('Failed to load from local storage', e);
            }

            // Subscribe to save changes
            store.subscribe(() => {
                const state = store.getState();
                const cartData = {
                    cartItems: state.cart.cartItems,
                    total: state.cart.total
                };
                const wishlistData = state.wishlist.wishlistItems;

                // Always save to local storage
                localStorage.setItem('trendly_cart', JSON.stringify(cartData));
                localStorage.setItem('trendly_wishlist', JSON.stringify(wishlistData));

                // Sync to backend if logged in
                const currentAuth = authRef.current;
                if (currentAuth.userId) {
                    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
                    syncTimeoutRef.current = setTimeout(async () => {
                        try {
                            await fetchAPI(`/users/${currentAuth.userId}/sync-data`, {
                                method: 'PUT',
                                body: JSON.stringify({ 
                                    cart: cartData, 
                                    wishlist: wishlistData,
                                    name: currentAuth.user?.fullName || currentAuth.user?.firstName || 'Trendly User',
                                    image: currentAuth.user?.imageUrl || ''
                                }),
                                getToken: currentAuth.getToken
                            });
                        } catch (err) {
                            console.error('Failed to sync data to backend', err);
                        }
                    }, 1500);
                }
            });

            loadProducts();
            initialized.current = true;
        }
    }, [dispatch, store]);

    return <>{children}</>;
}
