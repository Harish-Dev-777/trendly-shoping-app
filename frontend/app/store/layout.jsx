'use client'

import StoreLayout from "@/components/store/StoreLayout";
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function RootStoreLayout({ children }) {
    const { isLoaded, userId } = useAuth();

    if (!isLoaded) return null;

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Seller Dashboard Login</h2>
                <p className="text-slate-500">Please sign in to access your seller dashboard.</p>
                <SignInButton mode="modal">
                    <button className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                        Sign In
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <StoreLayout>
            {children}
        </StoreLayout>
    );
}
