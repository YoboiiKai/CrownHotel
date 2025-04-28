"use client"

import { useState, useEffect } from "react"
import { Mail, Building2, ChevronRight, ArrowLeft } from "lucide-react"
import { Head, Link, useForm } from "@inertiajs/react"

import InputError from "@/Components/InputError"
import Loader from "@/Components/Loader"

export default function ForgotPassword({ status }) {
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [formTransformed, setFormTransformed] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Animation sequence
        setMounted(true);
        const formTimer = setTimeout(() => {
            setFormTransformed(true);
        }, 300);

        return () => {
            clearTimeout(timer);
            clearTimeout(formTimer);
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password | LuxStay" />
            <Loader isLoading={isLoading} />
            
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950">
                {/* Subtle light effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-400 opacity-10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-amber-600 opacity-5 blur-[80px] rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-300 opacity-5 blur-[80px] rounded-full"></div>
                
                {/* Main content */}
                <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-6xl">
                        <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                            {/* Form layout */}
                            <div className="flex flex-col md:flex-row">
                                {/* Left side - Brand and welcome */}
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-br from-amber-800 to-amber-950 text-white flex flex-col justify-between relative overflow-hidden">
                                    
                                    <div className="relative">
                                        <div className="flex items-center space-x-4 mb-12">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-xl bg-amber-400 blur-[15px] opacity-40"></div>
                                                <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-900 text-white shadow-lg">
                                                    <Building2 size={48} className="animate-float" />
                                                    <div className="absolute inset-0 rounded-xl border border-amber-400/30 animate-pulse-slow"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold text-white">LuxStay</h1>
                                                <p className="text-sm text-amber-200">Premium Hotel Experience</p>
                                            </div>
                                        </div>
                                        
                                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-100">Password Recovery</h2>
                                        <p className="text-amber-200 text-lg">We'll help you get back to your luxury journey.</p>
                                        
                                        <div className="mt-10 space-y-6">
                                            {/* Info box */}
                                            <div className="border border-amber-500/20 rounded-lg p-6 bg-gradient-to-br from-amber-800/30 to-amber-950/30 backdrop-blur-sm">
                                                <h3 className="text-xl font-semibold text-amber-300 mb-4">Password Reset Process</h3>
                                                <p className="text-amber-100 text-sm mb-4">
                                                    We'll send a secure password reset link to your email. For your security, the link will expire after 60 minutes.
                                                </p>
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                                                            <span className="text-xs text-amber-300">1</span>
                                                        </div>
                                                        <span className="text-xs text-amber-100">Enter your registered email</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                                                            <span className="text-xs text-amber-300">2</span>
                                                        </div>
                                                        <span className="text-xs text-amber-100">Check your inbox for the reset link</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                                                            <span className="text-xs text-amber-300">3</span>
                                                        </div>
                                                        <span className="text-xs text-amber-100">Create your new password</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 hidden md:block relative z-10 text-center">
                                        <p className="text-xs text-amber-300/70">
                                            &copy; {new Date().getFullYear()} LuxStay Hotels. All rights reserved.
                                        </p>
                                    </div>
                                    
                                    {/* Animated light beam */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-300 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
                                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500 opacity-20 blur-3xl rounded-full animate-pulse-slow delay-700"></div>
                                </div>
                                
                                {/* Right side - Form */}
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-r from-white to-amber-50 flex items-center justify-center relative">
                                    
                                    {/* Decorative corner accents */}
                                    <div className="absolute top-0 right-0 w-[120px] h-[120px] border-t-2 border-r-2 border-amber-300/40 rounded-tl-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-[120px] h-[120px] border-b-2 border-l-2 border-amber-300/40 rounded-tr-2xl"></div>
                                    
                                    {/* Enhanced decorative elements */}
                                    <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-amber-100 opacity-20 blur-[80px] rounded-full"></div>
                                    <div className="absolute bottom-1/3 right-1/3 w-[200px] h-[200px] bg-amber-200 opacity-20 blur-[60px] rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] bg-amber-300 opacity-10 blur-[50px] rounded-full"></div>
                                    
                                    <div className={`relative z-10 max-w-lg mx-auto w-full transition-all duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'} ${formTransformed ? 'translate-y-0' : 'translate-y-8'}`}>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">Forgot Password</h2>
                                            <p className="mt-2 text-sm text-gray-600">Enter your email to receive a password reset link</p>
                                        </div>
                                        
                                        {status && (
                                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                                                <p className="text-sm font-medium text-green-700">{status}</p>
                                            </div>
                                        )}
                                        
                                        <form onSubmit={submit} className="space-y-6">
                                            {/* Email Field */}
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email Address
                                                </label>
                                                <div
                                                    className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                        isEmailFocused ? "ring-2 ring-amber-500" : ""
                                                    } ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                                >
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Mail className={`h-5 w-5 ${isEmailFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                    </div>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        required
                                                        value={data.email}
                                                        onChange={(e) => setData("email", e.target.value)}
                                                        onFocus={() => setIsEmailFocused(true)}
                                                        onBlur={() => setIsEmailFocused(false)}
                                                        className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                            errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                        }`}
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                                {errors.email && <InputError message={errors.email} className="mt-2" />}
                                            </div>
                                            
                                            {/* Submit Button */}
                                            <div className="mt-6">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-amber-600 to-amber-700 py-3.5 px-4 text-sm font-medium text-white shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
                                                >
                                                    <span className="absolute inset-0 overflow-hidden">
                                                        <span className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-400/20 to-transparent transform -translate-x-full hover:translate-x-0 transition-transform ease-in-out duration-700 group-hover:translate-x-full"></span>
                                                    </span>
                                                    {processing ? (
                                                        <span className="flex items-center relative z-10">
                                                            <div className="relative mr-3">
                                                                <div className="h-5 w-5 relative">
                                                                    <div className="absolute inset-0 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin"></div>
                                                                </div>
                                                            </div>
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center relative z-10">
                                                            Send Reset Link
                                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                        
                                        {/* Login Link */}
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                <Link
                                                    href={route("login")}
                                                    className="font-medium text-amber-600 hover:text-amber-500 flex items-center justify-center"
                                                >
                                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                                    Back to Login
                                                </Link>
                                            </p>
                                        </div>
                                        <div className="mt-12 pt-6 border-t border-gray-200"> </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes pulse-slow {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0.3; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                
                .glow-effect {
                    box-shadow: 0 0 40px 20px rgba(245, 158, 11, 0.3);
                    border-radius: 50%;
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                
                .delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </>
    );
}
