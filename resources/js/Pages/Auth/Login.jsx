"use client"

import { useState, useEffect, useRef, Fragment } from "react"
import { Eye, EyeOff, Mail, Lock, Crown, Hotel, ChevronRight, Moon, Sun, Coffee, Utensils, Wifi, Star, UserCircle, Calendar, Clock, Users, BarChart4 } from "lucide-react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Transition } from "@headlessui/react"

import InputError from "@/Components/InputError"

export default function Login() {
    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check user preference from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('hotelTheme');
            if (savedTheme) return savedTheme === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    
    // UI state management
    const [uiState, setUiState] = useState({
        showPassword: false,
        isEmailFocused: false,
        isPasswordFocused: false,
        mounted: false,
        formTransformed: false,
        animationComplete: false,
        currentImageIndex: 0
    });
    
    // Refs
    const starsRef = useRef(null);
    const parallaxRef = useRef(null);
    const formRef = useRef(null);
    
    // Form handling with Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    // Destructure UI state for easier access
    const {
        showPassword,
        isEmailFocused,
        isPasswordFocused,
        mounted,
        formTransformed,
        animationComplete,
        currentImageIndex
    } = uiState;
    
    // Helper function to update UI state partially
    const updateUiState = (newState) => {
        setUiState(prevState => ({ ...prevState, ...newState }));
    };

    // Handle theme toggle
    const toggleTheme = () => {
        const newThemeValue = !isDarkMode;
        setIsDarkMode(newThemeValue);
        localStorage.setItem('hotelTheme', newThemeValue ? 'dark' : 'light');
    };

    // Create background elements effect
    useEffect(() => {
        // Avoid running this effect during SSR
        if (typeof window === 'undefined') return;
        
        // Update mounted state
        updateUiState({ mounted: true });
        
        // Create twinkling stars with performance optimization
        if (starsRef.current) {
            const starsContainer = starsRef.current;
            const starCount = 150; // Increased star count for more immersive effect
            const fragment = document.createDocumentFragment(); // Use document fragment for better performance
            
            // Clear any existing stars
            starsContainer.innerHTML = '';
            
            // Create stars with random positions, sizes, and animations
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                const size = Math.random() * 3 + 1; // Random size between 1-4px
                const posX = Math.random() * 100; // Random X position
                const posY = Math.random() * 100; // Random Y position
                const duration = Math.random() * 3 + 2; // Random animation duration
                const delay = Math.random() * 5; // Random animation delay
                
                // Set custom properties for animation
                star.style.setProperty('--duration', `${duration}s`);
                star.style.setProperty('--delay', `${delay}s`);
                
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${posX}%`;
                star.style.top = `${posY}%`;
                star.className = 'absolute rounded-full bg-white opacity-0 animate-twinkle';
                
                // Add a subtle glow to larger stars
                if (size > 2.5) {
                    star.classList.add('star-glow');
                }
                
                fragment.appendChild(star);
            }
            
            // Append all stars at once for better performance
            starsRef.current.appendChild(fragment);
        }
        
        // Setup parallax effect for background images
        const handleParallax = (e) => {
            if (!parallaxRef.current) return;
            
            const layers = parallaxRef.current.querySelectorAll('.parallax-layer');
            const speed = 0.01;
            
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            layers.forEach((layer, index) => {
                const depth = index + 1;
                const translateX = x * depth;
                const translateY = y * depth;
                
                layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            });
        };
        
        // Add parallax effect listener
        document.addEventListener('mousemove', handleParallax);
        
        // Simulate loading for a smoother entrance with staggered animations
        const loadingTimer = setTimeout(() => {
            updateUiState({ isLoading: false });
            
            // Start the form transformation after loading is complete
            setTimeout(() => {
                updateUiState({ formTransformed: true });
                
                // Set animation complete after transformation is done
                setTimeout(() => {
                    updateUiState({ animationComplete: true });
                }, 1000);
            }, 300);
        }, 2000); // Slightly longer loading time to showcase the enhanced loader
        
        // Image rotation for background slideshow
        const imageInterval = setInterval(() => {
            updateUiState(prevState => ({
                currentImageIndex: (prevState.currentImageIndex + 1) % 4 // Assuming 4 background images
            }));
        }, 8000); // Change image every 8 seconds
        
        // Cleanup function
        return () => {
            clearTimeout(loadingTimer);
            clearInterval(imageInterval);
            document.removeEventListener('mousemove', handleParallax);
        };
    }, []);
    
    // Add resize listener for responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            // Adjust UI based on screen size if needed
            const isMobile = window.innerWidth < 768;
            // You could update state here based on screen size
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Form submission handler with error tracking
    const submit = async (e) => {
        e.preventDefault();
        
        // Focus form for better UX during submission
        if (formRef.current) {
            formRef.current.classList.add('submitting');
        }
        
        // Track login attempt for analytics (if needed)
        try {
            // You could add analytics tracking here
            // analyticsService.trackEvent('login_attempt');
            
            await post(route('login'), {
                onFinish: () => {
                    reset('password');
                    if (formRef.current) {
                        formRef.current.classList.remove('submitting');
                    }
                },
                onError: () => {
                    // You could add failed login tracking here
                    // analyticsService.trackEvent('login_failed');
                    if (formRef.current) {
                        formRef.current.classList.remove('submitting');
                        // Add shake animation on error
                        formRef.current.classList.add('shake');
                        setTimeout(() => {
                            formRef.current?.classList.remove('shake');
                        }, 500);
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            if (formRef.current) {
                formRef.current.classList.remove('submitting');
            }
        }
    };
    
    // Toggle password visibility with improved UX
    const togglePasswordVisibility = () => {
        updateUiState({ showPassword: !showPassword });
        
        // Focus back on password field after toggling for better UX
        setTimeout(() => {
            document.getElementById('password')?.focus();
        }, 10);
    };
    
    // Input field focus handlers with debounce
    const handleFocus = (field) => {
        updateUiState({ [field]: true });
    };
    
    const handleBlur = (field) => {
        updateUiState({ [field]: false });
    };

    return (
        <>
            <Head title="Crown of the Orient | Login" />
            
            {/* Main container with theme support */}
            <div className={`relative min-h-screen w-full overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-[#1A0F00] via-[#3D2914] to-[#1A0F00]' : 'bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]'}`}>
                {/* Theme toggle */}
                <button 
                    onClick={toggleTheme} 
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* Stars container */}
                <div ref={starsRef} className="absolute inset-0 z-0 overflow-hidden"></div>
                
                {/* Parallax background elements - matching Dashboard decorative elements */}
                <div ref={parallaxRef} className="absolute inset-0 z-0 overflow-hidden">
                    <div className="parallax-layer absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="parallax-layer absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                    <div className="parallax-layer absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#DEB887] opacity-5 blur-[80px] rounded-full"></div>
                </div>
                
                {/* Background image slideshow */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {[0, 1, 2, 3].map((index) => (
                        <div 
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-10' : 'opacity-0'}`}
                            style={{ 
                                backgroundImage: `url('/images/hotel-bg-${index + 1}.jpg')`,
                                backgroundBlendMode: 'overlay'
                            }}
                        />
                    ))}
                </div>
                

                
                {/* Main content */}
                <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-6xl">
                        {/* Hotel branding header - visible on mobile */}
                        <div className="mb-8 text-center md:hidden">
                            <div className="inline-flex items-center justify-center mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-xl bg-[#DEB887] blur-[15px] opacity-40"></div>
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#6B4226] text-white shadow-lg">
                                        <Crown size={32} className="animate-float" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white font-serif tracking-wide">CROWN of the ORIENT</h1>
                            <p className="text-sm text-[#DEB887] tracking-wider">BEACH RESORT</p>
                        </div>
                        
                        <div className="overflow-hidden rounded-xl shadow-lg backdrop-blur-sm">
                            {/* Login form - landscape layout */}
                            <div className="flex flex-col md:flex-row">
                                {/* Left side - Brand and welcome */}
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] text-white flex flex-col justify-between relative overflow-hidden">
                                    {/* Background image overlay - matching Dashboard */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-6">
                                            <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                            <span className="text-xs font-medium text-[#DEB887]">
                                                CROWN OF THE ORIENT
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 mb-8">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-xl bg-[#DEB887] blur-[15px] opacity-40"></div>
                                                <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#6B4226] text-white shadow-lg">
                                                    <Hotel size={48} className="animate-float" />
                                                    <div className="absolute inset-0 rounded-xl border border-[#DEB887]/30 animate-pulse-slow"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back</h1>
                                                <p className="text-sm text-[#DEB887]/80">Sign in to continue your luxury journey with us</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 space-y-6">
                                            {/* Feature cards - matching Dashboard style */}
                                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                                    <span className="whitespace-nowrap">Premium Services</span>
                                                </button>
                                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                                    <Hotel className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                                    <span className="whitespace-nowrap">Luxury Rooms</span>
                                                </button>
                                            </div>
                                            
                                            {/* Luxury Experience Card */}
                                            <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-[#A67C52]/20 backdrop-blur-sm shadow-md">
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm">
                                                                <Coffee className="w-4 h-4" />
                                                            </div>
                                                            <h3 className="font-semibold text-white">The Luxury Experience</h3>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                                                            <span className="text-xs font-medium text-[#DEB887]">5.0</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-[#E6CCB2] text-sm mb-4">
                                                        At Crown of the Orient, we believe luxury is in the details. Every moment of your stay is designed to exceed expectations.
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <div className="flex items-center px-2 py-1 rounded-full bg-[#DEB887]/20 text-xs text-[#DEB887]">
                                                            <Wifi className="w-3 h-3 mr-1" />
                                                            <span>High-speed WiFi</span>
                                                        </div>
                                                        <div className="flex items-center px-2 py-1 rounded-full bg-[#DEB887]/20 text-xs text-[#DEB887]">
                                                            <Utensils className="w-3 h-3 mr-1" />
                                                            <span>Fine Dining</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 hidden md:block relative z-10 text-center">
                                        <p className="text-xs text-[#DEB887]/70">
                                            &copy; {new Date().getFullYear()} Crown of the Orient Beach Resort. All rights reserved.
                                        </p>
                                    </div>
                                    
                                    {/* Animated light beam */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#DEB887] opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
                                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#A67C52] opacity-20 blur-3xl rounded-full animate-pulse-slow delay-700"></div>
                                </div>
                                
                                {/* Right side - Form */}
                                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gradient-to-r from-white to-[#F5EFE6] flex items-center justify-center relative"> 
                                    
                                    {/* Enhanced decorative elements */}
                                    <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-[#DEB887] opacity-10 blur-[80px] rounded-full"></div>
                                    <div className="absolute bottom-1/3 right-1/3 w-[200px] h-[200px] bg-[#A67C52] opacity-10 blur-[60px] rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] bg-[#8B5A2B] opacity-5 blur-[50px] rounded-full"></div>
                                    
                                    <div className={`relative z-10 max-w-lg mx-auto w-full transition-all duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'} ${formTransformed ? 'translate-y-0' : 'translate-y-8'}`}>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F]">Sign in to your account</h2>
                                            <p className="mt-2 text-sm text-gray-600">Access your premium luxury experience</p>
                                        </div>
                                        
                                        <form onSubmit={submit} className="space-y-6">
                                            {/* Email Field */}
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email Address
                                                </label>
                                                <div
                                                    className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${
                                                        isEmailFocused ? "ring-2 ring-[#A67C52]" : ""
                                                    } ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                                >
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Mail className={`h-5 w-5 ${isEmailFocused ? "text-[#A67C52]" : "text-gray-400"}`} />
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
                                                            errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#A67C52]"
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
                                                        isPasswordFocused ? "ring-2 ring-[#A67C52]" : ""
                                                    } ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                                >
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className={`h-5 w-5 ${isPasswordFocused ? "text-[#A67C52]" : "text-gray-400"}`} />
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
                                                            errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#A67C52]"
                                                        }`}
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <button
                                                            type="button"
                                                            onClick={togglePasswordVisibility}
                                                            className="text-gray-400 hover:text-[#A67C52] focus:outline-none"
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
                                                        className="h-4 w-4 text-[#A67C52] focus:ring-[#A67C52] border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                                        Remember me
                                                    </label>
                                                </div>

                                                <div className="text-sm">
                                                    <Link
                                                        href={route("password.request")}
                                                        className="font-medium text-[#A67C52] hover:text-[#8B5A2B] transition-colors"
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
                                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] py-3.5 px-4 text-sm font-medium text-white shadow-lg hover:shadow-xl hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
                                                >
                                                     <span className="absolute inset-0 overflow-hidden">
                                                         <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#DEB887]/20 to-transparent transform -translate-x-full hover:translate-x-0 transition-transform ease-in-out duration-700 group-hover:translate-x-full"></span>
                                                     </span>
                                                    {processing ? (
                                                        <span className="flex items-center relative z-10">
                                                            <div className="relative mr-3">
                                                                <div className="h-5 w-5 relative">
                                                                    <div className="absolute inset-0 rounded-full border-2 border-[#DEB887] border-t-[#A67C52] animate-spin"></div>
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
                                                    className="font-medium text-[#A67C52] hover:text-[#8B5A2B] transition-colors"
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
                
                @keyframes twinkle {
                    0% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.5); }
                }
                
                .animate-twinkle {
                    animation: twinkle var(--duration, 3s) ease-in-out infinite;
                    animation-delay: var(--delay, 0s);
                }
                
                .glow-effect {
                    box-shadow: 0 0 40px 20px rgba(166, 124, 82, 0.3);
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
