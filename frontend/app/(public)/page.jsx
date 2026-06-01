'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAPI } from "@/lib/api";
import { setProduct } from "@/lib/features/product/productSlice";

export default function Home() {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const latestProducts = await fetchAPI('/products');
                dispatch(setProduct(latestProducts));
            } catch (error) {
                console.error('Failed to fetch latest products for homepage:', error);
            }
        };
        loadProducts();
    }, [dispatch]);

    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
