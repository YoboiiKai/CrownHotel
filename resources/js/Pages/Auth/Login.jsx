"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, Building2, ChevronRight, Star, Shield } from "lucide-react"
import { Head, Link, useForm } from "@inertiajs/react"

import InputError from "@/Components/InputError"
import Loader from "@/Components/Loader"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formTransformed, setFormTransformed] = useState(false)
    const [animationComplete, setAnimationComplete] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setMounted(true)
        
        // Simulate loading for a smoother entrance
        const timer = setTimeout(() => {
            setIsLoading(false)
            
            // Start the form transformation after loading is complete
            setTimeout(() => {
                setFormTransformed(true)
                
                // Set animation complete after transformation is done
                setTimeout(() => {
                    setAnimationComplete(true)
                }, 1200)
            }, 300)
        }, 800)
        
        return () => {
            clearTimeout(timer)
        }
    }, [])

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <Head title="Login | LuxStay" />
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
                            {/* Login form - landscape layout */}
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
                                        
                                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-100">Welcome back</h2>
                                        <p className="text-amber-200 text-lg">Sign in to continue your luxury journey with us.</p>
                                        
                                        <div className="mt-10 space-y-6">
                                            {/* Luxury Experience */}
                                            <div className="border border-amber-500/20 rounded-lg p-6 bg-gradient-to-br from-amber-800/30 to-amber-950/30 backdrop-blur-sm">
                                                <h3 className="text-xl font-semibold text-amber-300 mb-4">The LuxStay Experience</h3>
                                                <p className="text-amber-100 text-sm mb-4">
                                                    At LuxStay, we believe luxury is in the details. From personalized check-in to curated room amenities, every moment of your stay is designed to exceed expectations.
                                                </p>
                                                <div className="grid grid-cols-2 gap-3 mt-4">
                                                    <div className="flex flex-col items-center p-3 bg-amber-900/30 rounded-lg">
                                                        <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-2">
                                                            <Star size={16} className="text-amber-300" />
                                                        </div>
                                                        <span className="text-xs text-center text-amber-100">5-Star Service</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-amber-900/30 rounded-lg">
                                                        <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-center text-amber-100">Prime Locations</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-amber-900/30 rounded-lg">
                                                        <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-center text-amber-100">Personal Concierge</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-amber-900/30 rounded-lg">
                                                        <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-2">
                                                            <ChevronRight size={16} className="text-amber-300" />
                                                        </div>
                                                        <span className="text-xs text-center text-amber-100">Exclusive Access</span>
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
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-r from-white to-amber-50  flex items-center justify-center relative"> 
                                    
                                    {/* Enhanced decorative elements */}
                                    <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-amber-100 opacity-20 blur-[80px] rounded-full"></div>
                                    <div className="absolute bottom-1/3 right-1/3 w-[200px] h-[200px] bg-amber-200 opacity-20 blur-[60px] rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] bg-amber-300 opacity-10 blur-[50px] rounded-full"></div>
                                    
                                    <div className={`relative z-10 max-w-lg mx-auto w-full transition-all duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'} ${formTransformed ? 'translate-y-0' : 'translate-y-8'}`}>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">Sign in to your account</h2>
                                            <p className="mt-2 text-sm text-gray-600">Access your premium hotel experience</p>
                                        </div>
                                        
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
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                                {errors.email && <InputError message={errors.email} className="mt-2" />}
                                            </div>

                                            {/* Password Field */}
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    Password
                                                </label>
                                                <div
                                                    className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                        isPasswordFocused ? "ring-2 ring-amber-500" : ""
                                                    } ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                                >
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className={`h-5 w-5 ${isPasswordFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        autoComplete="current-password"
                                                        required
                                                        value={data.password}
                                                        onChange={(e) => setData("password", e.target.value)}
                                                        onFocus={() => setIsPasswordFocused(true)}
                                                        onBlur={() => setIsPasswordFocused(false)}
                                                        className={`block w-full rounded-md border pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                            errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                        }`}
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <button
                                                            type="button"
                                                            onClick={togglePasswordVisibility}
                                                            className="text-gray-400 hover:text-amber-500 focus:outline-none"
                                                        >
                                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                {errors.password && <InputError message={errors.password} className="mt-2" />}
                                            </div>

                                            {/* Remember me & Forgot password */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        id="remember"
                                                        name="remember"
                                                        type="checkbox"
                                                        checked={data.remember}
                                                        onChange={(e) => setData("remember", e.target.checked)}
                                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                                        Remember me
                                                    </label>
                                                </div>

                                                <div className="text-sm">
                                                    <Link
                                                        href={route("password.request")}
                                                        className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                </div>
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
                                                            Sign in
                                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        {/* Register Link */}
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                Don't have an account?{" "}
                                                <Link
                                                    href={route("register")}
                                                    className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                >
                                                    Create an account
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
            <style>{`
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
    )
}
