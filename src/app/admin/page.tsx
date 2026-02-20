"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("admin_token", data.access_token);
                router.push("/admin/dashboard");
            } else {
                setError("Invalid admin credentials");
            }
        } catch (err) {
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#f8fafc]">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-emerald-300/20 rounded-full blur-[100px] animate-float delay-500" />

            <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/50">
                        <Image src="/assets/logo.png" alt="Rehab 5" width={160} height={50} className="object-contain" />
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/60 relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary" />

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h1>
                        <p className="text-gray-500 text-sm mt-2">Sign in to manage appointments & patients.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50/80 backdrop-blur-sm text-red-600 p-3.5 rounded-xl text-sm font-medium border border-red-100/50 flex items-center justify-center animate-fade-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5 group">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-gray-900 font-medium"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-gray-900 font-medium tracking-widest"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-6 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    "Login to Dashboard"
                                )}
                            </span>
                            {/* Shine effect */}
                            {!loading && (
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine z-0" />
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer text */}
                <p className="mt-8 text-center text-sm text-gray-400 font-medium">
                    Secure Admin Access © 2025
                </p>
            </div>
        </div>
    );
}
