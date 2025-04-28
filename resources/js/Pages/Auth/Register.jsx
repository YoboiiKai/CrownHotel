"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, Building2, User, ChevronRight, Shield, Star, Phone, Calendar, MapPin, Briefcase } from "lucide-react"
import { Head, Link, useForm } from "@inertiajs/react"

import InputError from "@/Components/InputError"
import Loader from "@/Components/Loader"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const [isNameFocused, setIsNameFocused] = useState(false)
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [isAddressFocused, setIsAddressFocused] = useState(false)
    const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false)
    const [isOccupationFocused, setIsOccupationFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isPasswordConfirmationFocused, setIsPasswordConfirmationFocused] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formTransformed, setFormTransformed] = useState(false)
    const [animationComplete, setAnimationComplete] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        date_of_birth: '',
        occupation: '',
        password: '',
        password_confirmation: '',
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

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation)
    }

    return (
        <>
            <Head title="Register | LuxStay" />
            <Loader isLoading={isLoading} />
            
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950">
                {/* Background pattern */}
                <div className="absolute inset-0 pattern-overlay"></div>
                
                {/* Subtle light effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-400 opacity-10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-amber-600 opacity-5 blur-[80px] rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-300 opacity-5 blur-[80px] rounded-full"></div>
                
                {/* Main content */}
                <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-6xl">
                        <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                            {/* Registration form - landscape layout */}
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
                                        
                                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-100">Join our community</h2>
                                        <p className="text-amber-200 text-lg">Create an account to start your luxury journey with us.</p>
                                        
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
                                                            <MapPin size={16} className="text-amber-300" />
                                                        </div>
                                                        <span className="text-xs text-center text-amber-100">Prime Locations</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-amber-900/30 rounded-lg">
                                                        <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-2">
                                                            <User size={16} className="text-amber-300" />
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
                                
                                {/* Right side - Registration form */}
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-r from-white to-amber-50 relative">
                                    {/* Decorative corner accents */}
                                    <div className="absolute top-0 right-0 w-[120px] h-[120px] border-t-2 border-r-2 border-amber-300/40 rounded-tl-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-[120px] h-[120px] border-b-2 border-l-2 border-amber-300/40 rounded-tr-2xl"></div>
                                    
                                    {/* Enhanced decorative elements */}
                                    <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-amber-100 opacity-20 blur-[80px] rounded-full"></div>
                                    <div className="absolute bottom-1/3 right-1/3 w-[200px] h-[200px] bg-amber-200 opacity-20 blur-[60px] rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] bg-amber-300 opacity-10 blur-[50px] rounded-full"></div>
                                    
                                    
                                    <div className="relative z-10 max-w-md mx-auto">
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">Create an account</h2>
                                            <p className="mt-2 text-sm text-gray-600">Fill in your details to join our luxury experience</p>
                                        </div>

                                        {/* Registration Form */}
                                        <form className="space-y-6" onSubmit={submit}>
                                            {/* Two columns for personal info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Name Field */}
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                        Full Name
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isNameFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <User className={`h-5 w-5 ${isNameFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            autoComplete="name"
                                                            required
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            onFocus={() => setIsNameFocused(true)}
                                                            onBlur={() => setIsNameFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                    {errors.name && <InputError message={errors.name} className="mt-2" />}
                                                </div>

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

                                                {/* Phone Field */}
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                        Phone Number
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isPhoneFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Phone className={`h-5 w-5 ${isPhoneFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="phone"
                                                            name="phone"
                                                            type="text"
                                                            autoComplete="phone"
                                                            required
                                                            value={data.phone}
                                                            onChange={(e) => setData("phone", e.target.value)}
                                                            onFocus={() => setIsPhoneFocused(true)}
                                                            onBlur={() => setIsPhoneFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="+1 (123) 456-7890"
                                                        />
                                                    </div>
                                                    {errors.phone && <InputError message={errors.phone} className="mt-2" />}
                                                </div>

                                                {/* Date of Birth Field */}
                                                <div>
                                                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                                                        Date of Birth
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isDateOfBirthFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Calendar className={`h-5 w-5 ${isDateOfBirthFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="date_of_birth"
                                                            name="date_of_birth"
                                                            type="date"
                                                            autoComplete="date_of_birth"
                                                            required
                                                            value={data.date_of_birth}
                                                            onChange={(e) => setData("date_of_birth", e.target.value)}
                                                            onFocus={() => setIsDateOfBirthFocused(true)}
                                                            onBlur={() => setIsDateOfBirthFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.date_of_birth ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="YYYY-MM-DD"
                                                        />
                                                    </div>
                                                    {errors.date_of_birth && <InputError message={errors.date_of_birth} className="mt-2" />}
                                                </div>
                                            </div>
                                            
                                            {/* Two columns for additional info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Address Field */}
                                                <div>
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                        Address
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isAddressFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.address ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <MapPin className={`h-5 w-5 ${isAddressFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="address"
                                                            name="address"
                                                            type="text"
                                                            autoComplete="address"
                                                            required
                                                            value={data.address}
                                                            onChange={(e) => setData("address", e.target.value)}
                                                            onFocus={() => setIsAddressFocused(true)}
                                                            onBlur={() => setIsAddressFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.address ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="123 Main St, Anytown, USA"
                                                        />
                                                    </div>
                                                    {errors.address && <InputError message={errors.address} className="mt-2" />}
                                                </div>

                                                {/* Occupation Field */}
                                                <div>
                                                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                                                        Occupation
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isOccupationFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.occupation ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Briefcase className={`h-5 w-5 ${isOccupationFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="occupation"
                                                            name="occupation"
                                                            type="text"
                                                            autoComplete="occupation"
                                                            required
                                                            value={data.occupation}
                                                            onChange={(e) => setData("occupation", e.target.value)}
                                                            onFocus={() => setIsOccupationFocused(true)}
                                                            onBlur={() => setIsOccupationFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.occupation ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="Software Engineer"
                                                        />
                                                    </div>
                                                    {errors.occupation && <InputError message={errors.occupation} className="mt-2" />}
                                                </div>
                                            </div>
                                            
                                            {/* Two columns for password fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            autoComplete="new-password"
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

                                                {/* Password Confirmation Field */}
                                                <div>
                                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                                        Confirm Password
                                                    </label>
                                                    <div
                                                        className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                            isPasswordConfirmationFocused ? "ring-2 ring-amber-500" : ""
                                                        } ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}`}
                                                    >
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Lock className={`h-5 w-5 ${isPasswordConfirmationFocused ? "text-amber-500" : "text-gray-400"}`} />
                                                        </div>
                                                        <input
                                                            id="password_confirmation"
                                                            name="password_confirmation"
                                                            type={showPasswordConfirmation ? "text" : "password"}
                                                            autoComplete="new-password"
                                                            required
                                                            value={data.password_confirmation}
                                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                                            onFocus={() => setIsPasswordConfirmationFocused(true)}
                                                            onBlur={() => setIsPasswordConfirmationFocused(false)}
                                                            className={`block w-full rounded-md border pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm ${
                                                                errors.password_confirmation ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-amber-500"
                                                            }`}
                                                            placeholder="••••••••"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <button
                                                                type="button"
                                                                onClick={togglePasswordConfirmationVisibility}
                                                                className="text-gray-400 hover:text-amber-500 focus:outline-none"
                                                            >
                                                                {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {errors.password_confirmation && <InputError message={errors.password_confirmation} className="mt-2" />}
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
                                                            Create Account
                                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        {/* Login Link */}
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                Already have an account?{" "}
                                                <Link
                                                    href={route("login")}
                                                    className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                >
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>
                                        
                                        {/* Footer */}
                                        <div className="mt-8 pt-6 border-t border-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Animation keyframes */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient-pulse {
                    0%, 100% { background-size: 100% 100%; }
                    50% { background-size: 120% 120%; }
                }
                
                @keyframes pulse-glow {
                    0% { opacity: 0; transform: scale(0); }
                    50% { opacity: 0.9; transform: scale(2.5); }
                    100% { opacity: 0; transform: scale(5); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
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
                
                .delay-700 {
                    animation-delay: 700ms;
                }
                
                .glow-effect {
                    box-shadow: 0 0 40px 20px rgba(245, 158, 11, 0.3);
                    border-radius: 50%;
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50% { opacity: 0.8; transform: scale(1.2); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out both;
                }
                
                @keyframes slide-in-right {
                    0% {
                        transform: translateX(50px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
            `}} />
        </>
    );
}
