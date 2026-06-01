'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAPI } from "@/lib/api";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();

    const fetchProduct = async () => {
        try {
            const data = await fetchAPI(`/products/${productId}`);
            setProduct(data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    }

    useEffect(() => {
        fetchProduct();
        scrollTo(0, 0);
    }, [productId]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (
                    <ProductDescription 
                        product={product} 
                        onReviewAdded={(newReview) => setProduct(prev => ({ ...prev, rating: [newReview, ...prev.rating] }))} 
                    />
                )}
            </div>
        </div>
    );
}