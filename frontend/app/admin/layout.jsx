'use client'

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

export default function RootAdminLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const adminAuth = localStorage.getItem("trendly_admin_auth");
        if (adminAuth === "true") {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "TrendlyAdmin@123") {
            localStorage.setItem("trendly_admin_auth", "true");
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Invalid username or password");
        }
    };

    if (isChecking) return null;

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Trendly Admin Login</h2>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-900 transition">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
