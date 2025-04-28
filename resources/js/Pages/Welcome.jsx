import { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { Building2, ChevronRight, Users, BarChart3, Calendar, Utensils, Shield, Star, X } from "lucide-react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [scrollY, setScrollY] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    // Sample room data
    const roomsData = [
        {
            id: 1,
            name: "Deluxe Ocean View Suite",
            description: "Experience unparalleled luxury with our premium suite offering breathtaking ocean views and world-class amenities.",
            price: "$450",
            size: "850 sq ft / 79 sq m",
            occupancy: "Up to 4 guests (2 adults, 2 children)",
            rating: 5,
            reviews: 128,
            mainImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            images: [
                {
                    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Luxury Bathroom",
                    subtitle: "Marble finishes with soaking tub"
                },
                {
                    url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "King Bedroom",
                    subtitle: "Premium linens and ocean views"
                },
                {
                    url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Living Area",
                    subtitle: "Spacious seating with private balcony"
                }
            ],
            amenities: [
                "Private balcony with ocean view",
                "King-size bed with premium linens",
                "Marble bathroom with soaking tub",
                "Smart TV with streaming services",
                "Complimentary high-speed WiFi",
                "24-hour room service"
            ]
        },
        {
            id: 2,
            name: "Executive Mountain Suite",
            description: "A spacious retreat with panoramic mountain views, perfect for both business and leisure travelers.",
            price: "$380",
            size: "750 sq ft / 70 sq m",
            occupancy: "Up to 3 guests (2 adults, 1 child)",
            rating: 4.8,
            reviews: 96,
            mainImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
            images: [
                {
                    url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Modern Bathroom",
                    subtitle: "Walk-in shower with mountain views"
                },
                {
                    url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    title: "Executive Workspace",
                    subtitle: "Ergonomic desk with panoramic views"
                },
                {
                    url: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    title: "Queen Bedroom",
                    subtitle: "Luxury bedding with mountain views"
                }
            ],
            amenities: [
                "Dedicated workspace with ergonomic chair",
                "Queen-size bed with premium linens",
                "Walk-in shower with rainfall showerhead",
                "Smart TV with streaming services",
                "Complimentary high-speed WiFi",
                "Mini bar with local selections"
            ]
        },
        {
            id: 3,
            name: "Luxury Garden Villa",
            description: "An exclusive villa surrounded by lush tropical gardens with private pool and outdoor dining area.",
            price: "$650",
            size: "1200 sq ft / 111 sq m",
            occupancy: "Up to 6 guests (4 adults, 2 children)",
            rating: 4.9,
            reviews: 74,
            mainImage: "https://images.unsplash.com/photo-1540541338287-37acb0bfb8f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            images: [
                {
                    url: "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Private Pool",
                    subtitle: "Surrounded by tropical gardens"
                },
                {
                    url: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
                    title: "Master Bedroom",
                    subtitle: "King bed with garden views"
                },
                {
                    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Outdoor Dining",
                    subtitle: "Al fresco dining for six guests"
                }
            ],
            amenities: [
                "Private swimming pool",
                "Outdoor dining and lounge area",
                "Two bedrooms with king-size beds",
                "Full kitchen with premium appliances",
                "Complimentary high-speed WiFi",
                "Private garden with tropical plants"
            ]
        },
        {
            id: 4,
            name: "Penthouse City Suite",
            description: "A luxurious top-floor suite offering panoramic city views, modern design, and exclusive amenities.",
            price: "$550",
            size: "950 sq ft / 88 sq m",
            occupancy: "Up to 4 guests (2 adults, 2 children)",
            rating: 4.7,
            reviews: 103,
            mainImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            images: [
                {
                    url: "https://images.unsplash.com/photo-1630699144867-37acb0bfb8f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Luxury Bathroom",
                    subtitle: "Freestanding tub with city views"
                },
                {
                    url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    title: "Modern Living Room",
                    subtitle: "Stylish seating with panoramic views"
                },
                {
                    url: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
                    title: "Gourmet Kitchen",
                    subtitle: "Fully equipped with premium appliances"
                }
            ],
            amenities: [
                "Panoramic city views",
                "King-size bed with luxury linens",
                "Freestanding bathtub and walk-in shower",
                "Fully equipped gourmet kitchen",
                "Smart home technology throughout",
                "Access to exclusive rooftop lounge"
            ]
        }
    ];

    // Function to open modal with selected room
    const openRoomModal = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    return (
        <>
            <Head title="LuxStay - Hotel & Restaurant Management System" />
            
            {/* Main container with gradient background */}
            <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50">
                {/* Subtle light effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-400 opacity-5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-amber-600 opacity-5 blur-[80px] rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-300 opacity-5 blur-[80px] rounded-full"></div>
                
                {/* Navigation */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md shadow-md">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-xl bg-amber-400 blur-[8px] opacity-40"></div>
                                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg">
                                        <Building2 size={24} className="animate-float" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">Hotel Tech</h1>
                                </div>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <button 
                                    onClick={() => scrollToSection("home")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "home" ? "text-amber-700" : "text-gray-600 hover:text-amber-700"}`}
                                >
                                    Home
                                </button>
                                <button 
                                    onClick={() => scrollToSection("features")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "features" ? "text-amber-700" : "text-gray-600 hover:text-amber-700"}`}
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => scrollToSection("benefits")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "benefits" ? "text-amber-700" : "text-gray-600 hover:text-amber-700"}`}
                                >
                                    Benefits
                                </button>
                                <button 
                                    onClick={() => scrollToSection("testimonials")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "testimonials" ? "text-amber-700" : "text-gray-600 hover:text-amber-700"}`}
                                >
                                    Feedback
                                </button>
                                <button 
                                    onClick={() => scrollToSection("rooms")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "rooms" ? "text-amber-700" : "text-gray-600 hover:text-amber-700"}`}
                                >
                                    Rooms
                                </button>
                            </nav>
                            
                            {/* Auth Buttons */}
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="px-4 py-2 rounded-md text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                            
                            {/* Mobile menu button */}
                            <button 
                                className="md:hidden rounded-md p-2 text-gray-600 hover:bg-amber-50 hover:text-amber-700 focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        
                        {/* Mobile Navigation */}
                        {isMenuOpen && (
                            <div className="md:hidden py-4 border-t border-gray-200">
                                <div className="flex flex-col space-y-3">
                                    <button 
                                        onClick={() => scrollToSection("home")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeSection === "home" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
                                    >
                                        Home
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection("features")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeSection === "features" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
                                    >
                                        Features
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection("benefits")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeSection === "benefits" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
                                    >
                                        Benefits
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection("testimonials")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeSection === "testimonials" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
                                    >
                                        Testimonials
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection("rooms")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeSection === "rooms" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
                                    >
                                        Rooms
                                    </button>
                                    
                                    {/* Auth Buttons for Mobile */}
                                    <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                                        {auth.user ? (
                                            <Link
                                                href={route("dashboard")}
                                                className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center"
                                            >
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route("login")}
                                                    className="px-4 py-2 rounded-md text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors text-center"
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    href={route("register")}
                                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center"
                                                >
                                                    Register
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                
                {/* Hero Section */}
                <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply opacity-15 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply opacity-15 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply opacity-15 animate-blob animation-delay-4000"></div>
                        
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        
                        {/* Subtle diagonal lines */}
                        <div className="absolute inset-0" style={{ 
                            backgroundImage: 'linear-gradient(45deg, rgba(251, 191, 36, 0.03) 25%, transparent 25%, transparent 50%, rgba(251, 191, 36, 0.03) 50%, rgba(251, 191, 36, 0.03) 75%, transparent 75%, transparent)',
                            backgroundSize: '100px 100px'
                        }}></div>
                        
                        {/* Top decorative line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300/0 via-amber-500/50 to-amber-300/0"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            {/* Hero Content */}
                            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    <span className="relative inline-block">
                                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-amber-600 animate-gradient">
                                            Elevate Your Hospitality Experience
                                        </span>
                                        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full"></span>
                                    </span>
                                </h1>
                                
                                <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fadeIn animation-delay-500 leading-relaxed">
                                    A comprehensive ERP solution designed specifically for luxury hotels and fine dining restaurants, crafted to enhance guest satisfaction and operational excellence.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeIn animation-delay-1000">
                                    <Link
                                        href={route("register")}
                                        className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium shadow-lg hover:shadow-amber-200/50 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                                    >
                                        <span className="relative z-10">Get Started</span>
                                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        <span className="absolute inset-0 rounded-full bg-white/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    </Link>
                                    <button
                                        onClick={() => scrollToSection("features")}
                                        className="px-8 py-4 rounded-full border-2 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-700 font-medium hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 group"
                                    >
                                        <span>Explore Features</span>
                                        <span className="absolute inset-0 rounded-full bg-amber-100/50 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Hero Image */}
                            <div className="lg:w-1/2 relative mt-12 lg:mt-0 animate-fadeIn animation-delay-500">
                                {/* Main image with effects */}
                                <div className="relative mx-auto max-w-lg lg:max-w-none">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-[30px] opacity-20 transform rotate-3"></div>
                                    
                                    {/* Image container with frame */}
                                    <div className="relative rounded-2xl overflow-hidden border-[10px] border-white shadow-2xl">
                                        <img 
                                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80" 
                                            alt="Luxury Hotel" 
                                            className="relative object-cover h-[500px] w-full transform transition-transform hover:scale-105 duration-700"
                                        />
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-amber-900/20 to-transparent"></div>
                                        
                                        {/* Decorative corner elements */}
                                        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/40 rounded-tl-lg"></div>
                                        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/40 rounded-tr-lg"></div>
                                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/40 rounded-bl-lg"></div>
                                        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/40 rounded-br-lg"></div>
                                        
                                        {/* Hotel info overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold">Grand LuxStay Hotel</h3>
                                                        <div className="flex items-center mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                            ))}
                                                            <span className="ml-2 text-sm">Luxury Experience</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-bold">
                                                        Managed with LuxStay
                                                    </div>
                                                </div>
                                                
                                                {/* Hotel stats */}
                                                <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
                                                    <div className="text-center">
                                                        <p className="text-amber-200 text-sm">Rooms</p>
                                                        <p className="text-xl font-bold">120+</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-amber-200 text-sm">Restaurants</p>
                                                        <p className="text-xl font-bold">4</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-amber-200 text-sm">Rating</p>
                                                        <p className="text-xl font-bold">5.0</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom wave decoration */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="text-amber-700 w-full h-auto">
                            <path fill="currentColor" fillOpacity="0.05" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
                        </svg>
                    </div>
                </section>
                
                {/* Stats Section */}
                <section className="relative py-16 bg-gradient-to-r from-amber-800 to-amber-950 text-white overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300/0 via-amber-400/50 to-amber-300/0"></div>
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-600/20 rounded-full mix-blend-overlay blur-3xl"></div>
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full mix-blend-overlay blur-3xl"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bS01IDJoNHYxaC00di0xem0wLTJoMXY0aC0xdi00em0tNSAyaDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-100">
                                    Trusted by Industry Leaders
                                </span>
                            </h2>
                            <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 mx-auto"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Luxury Hotels Stat */}
                            <div className="group relative">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-amber-900/50 rounded-xl transform transition-all duration-500 group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl border border-amber-600/20 transform transition-all duration-500 group-hover:border-amber-500/30"></div>
                                
                                {/* Card content */}
                                <div className="relative p-6 text-center">
                                    {/* Icon */}
                                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    
                                    {/* Counter with animated counting */}
                                    <div className="relative">
                                        <h3 className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-white">
                                            500+
                                        </h3>
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"></div>
                                    </div>
                                    
                                    <p className="text-base font-medium text-amber-200 mt-2">Luxury Hotels</p>
                                    <p className="text-xs text-amber-200/70 mt-1">Worldwide partnerships</p>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Fine Restaurants Stat */}
                            <div className="group relative">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-amber-900/50 rounded-xl transform transition-all duration-500 group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl border border-amber-600/20 transform transition-all duration-500 group-hover:border-amber-500/30"></div>
                                
                                {/* Card content */}
                                <div className="relative p-6 text-center">
                                    {/* Icon */}
                                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.9999V7.9999C21 6.8999 20.1 5.9999 19 5.9999H13C11.9 5.9999 11 6.8999 11 7.9999V10.9999M21 15.9999V18.9999C21 20.0999 20.1 20.9999 19 20.9999H5C3.9 20.9999 3 20.0999 3 18.9999V10.9999C3 9.8999 3.9 8.9999 5 8.9999H11M21 15.9999H11M11 15.9999V10.9999M8 15.9999H14M7 12.9999H15" />
                                        </svg>
                                    </div>
                                    
                                    {/* Counter with animated counting */}
                                    <div className="relative">
                                        <h3 className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-white">
                                            200+
                                        </h3>
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"></div>
                                    </div>
                                    
                                    <p className="text-base font-medium text-amber-200 mt-2">Fine Restaurants</p>
                                    <p className="text-xs text-amber-200/70 mt-1">Culinary excellence</p>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Happy Users Stat */}
                            <div className="group relative">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-700/50 to-amber-900/50 rounded-xl transform transition-all duration-500 group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl border border-amber-600/20 transform transition-all duration-500 group-hover:border-amber-500/30"></div>
                                
                                {/* Card content */}
                                <div className="relative p-6 text-center">
                                    {/* Icon */}
                                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    
                                    {/* Counter with animated counting */}
                                    <div className="relative">
                                        <h3 className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-white">
                                            10,000+
                                        </h3>
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"></div>
                                    </div>
                                    
                                    <p className="text-base font-medium text-amber-200 mt-2">Happy Users</p>
                                    <p className="text-xs text-amber-200/70 mt-1">Satisfaction guaranteed</p>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                <section id="benefits" className="py-14 bg-gradient-to-b from-amber-50 to-amber-100/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
                                    <div className="text-amber-600 font-medium text-sm uppercase tracking-wider">Why Choose Us</div>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
                                Why Choose LuxStay?
                            </h2>
                            <p className="text-base text-gray-600 max-w-2xl mx-auto">
                                Our system is designed specifically for luxury hospitality businesses, offering unique advantages that set us apart.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                            <div className="order-2 lg:order-1 lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Benefit 1 */}
                                    <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <span className="font-bold text-sm">1</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 text-amber-900">Tailored for Luxury</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Specifically designed for high-end hotels and restaurants with features for luxury hospitality.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 2 */}
                                    <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <span className="font-bold text-sm">2</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 text-amber-900">All-in-One Solution</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Manage hotel and restaurant operations in a single integrated platform.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 3 */}
                                    <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <span className="font-bold text-sm">3</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 text-amber-900">Enhanced Guest Experience</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Personalized service with detailed guest profiles and preference tracking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 4 */}
                                    <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <span className="font-bold text-sm">4</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 text-amber-900">Data-Driven Insights</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Advanced analytics and reporting tools designed for hospitality industry.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="order-1 lg:order-2 lg:col-span-2 relative">
                                <div className="absolute inset-0 bg-amber-400 rounded-lg blur-[10px] opacity-20 transform -rotate-2"></div>
                                <div className="relative overflow-hidden rounded-lg shadow-xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent z-10"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80" 
                                        alt="Luxury Hotel Lobby" 
                                        className="object-cover h-[350px] w-full transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-bold">Grand LuxStay Hotel</h3>
                                                    <div className="flex items-center mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                        ))}
                                                        <span className="ml-2 text-sm">Luxury Experience</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-bold">
                                                    Managed with LuxStay
                                                </div>
                                            </div>
                                            
                                            {/* Hotel stats */}
                                            <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
                                                <div className="text-center">
                                                    <p className="text-amber-200 text-sm">Rooms</p>
                                                    <p className="text-xl font-bold">120+</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-amber-200 text-sm">Restaurants</p>
                                                    <p className="text-xl font-bold">4</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-amber-200 text-sm">Rating</p>
                                                    <p className="text-xl font-bold">5.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section id="features" className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
                                    <div className="text-amber-600 font-medium text-sm uppercase tracking-wider">Our Solutions</div>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
                                Powerful Features
                            </h2>
                            <p className="text-base text-gray-600 max-w-2xl mx-auto">
                                Our comprehensive ERP system offers everything you need to manage your hotel and restaurant operations efficiently.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {/* Feature 1 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Reservation Management</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Streamline bookings with our intuitive system for room availability and automated confirmations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 2 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Guest Management</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Track guest preferences and history to personalize their experience with your brand.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 3 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <Utensils className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Restaurant POS</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Manage orders, track inventory, and process payments with our integrated system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 4 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Analytics & Reporting</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Gain insights with comprehensive dashboards tracking all key performance indicators.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 5 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Property Management</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Monitor room status, maintenance, and housekeeping to maintain perfect conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 6 */}
                            <div className="group relative overflow-hidden rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 transition-all duration-300 border border-amber-100 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-500/10 rounded-full"></div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-amber-900">Security & Compliance</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Protect guest data and maintain compliance with all industry regulations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16 relative">
                            {/* Decorative element */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-100 rounded-full mix-blend-multiply opacity-70 blur-xl"></div>
                            
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="h-px bg-amber-300 w-8 mr-3"></div>
                                    <span className="text-amber-600 font-medium text-sm uppercase tracking-wider">Testimonials</span>
                                    <div className="h-px bg-amber-300 w-8 ml-3"></div>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
                                What Our Clients Say
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Hear from luxury hotels and restaurants that have transformed their operations with LuxStay.
                            </p>
                            <div className="w-20 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 mx-auto mt-6"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="group relative">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/50 shadow-lg transform transition-all duration-500 group-hover:border-amber-300/70 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-amber-400 opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-gray-700 mb-6 italic leading-relaxed">
                                            "LuxStay has completely transformed how we manage our hotel. The intuitive interface and comprehensive features have streamlined our operations and improved guest satisfaction significantly."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/women/48.jpg" 
                                                    alt="Sarah Johnson" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-amber-300"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-amber-900">Sarah Johnson</h4>
                                                <p className="text-sm text-amber-700/80">General Manager, The Grand Hotel</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Testimonial 2 */}
                            <div className="group relative mt-8 md:mt-0">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/50 shadow-lg transform transition-all duration-500 group-hover:border-amber-300/70 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-amber-400 opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-gray-700 mb-6 italic leading-relaxed">
                                            "The restaurant management features in LuxStay are exceptional. We've reduced food waste by 30% and improved table turnover rates since implementing the system."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                                                    alt="Michael Chen" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-amber-300"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-amber-900">Michael Chen</h4>
                                                <p className="text-sm text-amber-700/80">Owner, Azure Fine Dining</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Testimonial 3 */}
                            <div className="group relative mt-8 md:mt-16">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/50 shadow-lg transform transition-all duration-500 group-hover:border-amber-300/70 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-amber-400 opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-gray-700 mb-6 italic leading-relaxed">
                                            "The analytics provided by LuxStay have given us insights we never had before. We've been able to optimize our pricing strategy and increase revenue by 25% in just six months."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/women/65.jpg" 
                                                    alt="Elena Rodriguez" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-amber-300"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-amber-900">Elena Rodriguez</h4>
                                                <p className="text-sm text-amber-700/80">Director, Sunset Resort & Spa</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Testimonial Banner */}
                        <div className="mt-20 relative overflow-hidden">
                            {/* Background with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl"></div>
                            
                            {/* Decorative elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full" style={{ 
                                    backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a16207' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                                    backgroundSize: "cover"
                                }}></div>
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/30 rounded-full mix-blend-overlay blur-3xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/30 rounded-full mix-blend-overlay blur-3xl"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative z-10 p-10 md:p-12">
                                <div className="max-w-4xl mx-auto text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Join 5,000+ Satisfied Clients</h3>
                                    <div className="w-16 h-0.5 bg-amber-300/50 mx-auto mb-6"></div>
                                    <p className="text-lg text-amber-100 max-w-2xl mx-auto mb-8">
                                        Experience the difference that a purpose-built hospitality management system can make for your business.
                                    </p>
                                    <Link
                                        href={route("register")}
                                        className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-md bg-white text-amber-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:opacity-100"></span>
                                        <span className="relative group-hover:text-white flex items-center">
                                            Start Your Free Trial
                                            <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Decorative border */}
                            <div className="absolute inset-0 rounded-xl border border-amber-500/30"></div>
                        </div>
                    </div>
                </section>

                {/* Room Showcase Section */}
                <section id="rooms" className="py-20 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200/30 rounded-full mix-blend-multiply blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-300/20 rounded-full mix-blend-multiply blur-3xl"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
                                    <div className="text-amber-600 font-medium text-sm uppercase tracking-wider">Luxury Accommodations</div>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
                                Our Exclusive Rooms & Suites
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover our collection of luxurious accommodations designed for comfort, elegance, and unforgettable experiences.
                            </p>
                        </div>
                        
                        {/* Room Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {roomsData.map((room) => (
                                <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100 group hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent z-10"></div>
                                        <img 
                                            src={room.mainImage} 
                                            alt={room.name} 
                                            className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`h-4 w-4 ${i < Math.floor(room.rating) ? "text-amber-500 fill-amber-500" : "text-amber-300 fill-amber-300"}`} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-white text-xs">{room.rating} ({room.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-amber-900 mb-2">{room.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-amber-700 font-bold">
                                                {room.price}<span className="text-gray-500 text-xs font-normal"> / night</span>
                                            </div>
                                            <button 
                                                onClick={() => openRoomModal(room)} 
                                                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                                            >
                                                View Details
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* View All Rooms Button */}
                        <div className="text-center">
                            <Link
                                href="#"
                                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:opacity-100"></span>
                                <span className="relative group-hover:text-white flex items-center">
                                    View All Rooms
                                    <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Room Detail Modal */}
                {isModalOpen && selectedRoom && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                                <div className="absolute top-0 right-0 pt-4 pr-4 z-50">
                                    <button
                                        onClick={closeModal}
                                        className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Image Gallery */}
                                    <div className="relative">
                                        <div className="h-96 md:h-full">
                                            <img 
                                                src={selectedRoom.mainImage} 
                                                alt={selectedRoom.name} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h2 className="text-2xl font-bold text-white mb-2">{selectedRoom.name}</h2>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`h-5 w-5 ${i < Math.floor(selectedRoom.rating) ? "text-amber-500 fill-amber-500" : "text-amber-300 fill-amber-300"}`} 
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-white">{selectedRoom.rating} ({selectedRoom.reviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Thumbnail Gallery */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/80 to-transparent p-4">
                                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                                {selectedRoom.images.map((image, index) => (
                                                    <div key={index} className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 border-white">
                                                        <img 
                                                            src={image.url} 
                                                            alt={image.title} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Room Details */}
                                    <div className="p-6 md:p-8 bg-white">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-amber-900 mb-4">Room Details</h3>
                                            <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-amber-100 text-amber-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-amber-900">Room Size</h4>
                                                        <p className="text-gray-600 text-sm">{selectedRoom.size}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-amber-100 text-amber-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-amber-900">Occupancy</h4>
                                                        <p className="text-gray-600 text-sm">{selectedRoom.occupancy}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-amber-900 mb-3">Amenities</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {selectedRoom.amenities.map((amenity, index) => (
                                                    <li key={index} className="flex items-center text-gray-600 text-sm">
                                                        <div className="mr-2 text-amber-500">•</div>
                                                        {amenity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <span className="text-gray-600 text-sm">Price per night</span>
                                                    <p className="text-2xl font-bold text-amber-700">{selectedRoom.price}</p>
                                                </div>
                                                <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-md font-medium hover:shadow-lg transition-all duration-300">
                                                    Book Now
                                                </button>
                                            </div>
                                            
                                            <p className="text-xs text-gray-500">
                                                *Rates are subject to change based on season and availability. Additional taxes and fees may apply.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Image Gallery Section */}
                                <div className="p-6 bg-gray-50 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-amber-900 mb-4">Room Gallery</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {selectedRoom.images.map((image, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden group h-48">
                                                <img 
                                                    src={image.url} 
                                                    alt={image.title} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <h4 className="font-bold">{image.title}</h4>
                                                    <p className="text-sm text-amber-200">{image.subtitle}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="relative bg-gradient-to-b from-amber-900 to-amber-950 text-white pt-20 pb-10 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300/0 via-amber-400/50 to-amber-300/0"></div>
                    <div className="absolute top-0 inset-x-0 h-64 bg-amber-800 opacity-10 transform -skew-y-6"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-700 rounded-full filter blur-[100px] opacity-10"></div>
                    <div className="absolute top-20 left-20 w-64 h-64 bg-amber-500 rounded-full filter blur-[80px] opacity-5"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Top footer with logo and newsletter */}
                        <div className="flex flex-col lg:flex-row justify-between items-center pb-12 mb-12 border-b border-amber-700/30">
                            <div className="flex items-center space-x-3 mb-8 lg:mb-0">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-xl bg-amber-400 blur-[8px] opacity-40"></div>
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg">
                                        <Building2 size={28} className="animate-float" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Hotel Tech</h1>
                                </div>
                            </div>
                            
                            {/* Newsletter subscription */}
                            <div className="w-full lg:w-auto">
                                <div className="bg-amber-800/30 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto lg:mx-0">
                                    <h4 className="text-lg font-bold mb-2 text-amber-200">Subscribe to our newsletter</h4>
                                    <p className="text-amber-300/80 text-sm mb-4">Stay updated with the latest features and releases</p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input 
                                            type="email" 
                                            placeholder="Your email address" 
                                            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-amber-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white flex-grow"
                                        />
                                        <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main footer content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                            {/* Company Info */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 text-amber-200 relative inline-block">
                                    About Hotel Tech
                                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full"></span>
                                </h4>
                                <p className="text-amber-300/80 mb-6 leading-relaxed">
                                    Elevating hospitality management with innovative solutions for luxury hotels and fine dining restaurants. Our platform is designed to enhance guest experiences and streamline operations.
                                </p>
                                
                                {/* Social Media Icons */}
                                <div className="flex space-x-3">
                                    <a href="#" className="group">
                                        <div className="w-10 h-10 rounded-lg bg-amber-800/30 flex items-center justify-center border border-amber-700/30 transition-all duration-300 group-hover:bg-amber-700/50 group-hover:border-amber-600/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 group-hover:text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                        </div>
                                    </a>
                                    <a href="#" className="group">
                                        <div className="w-10 h-10 rounded-lg bg-amber-800/30 flex items-center justify-center border border-amber-700/30 transition-all duration-300 group-hover:bg-amber-700/50 group-hover:border-amber-600/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 group-hover:text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z" />
                                        </svg>
                                    </div>
                                    </a>
                                    <a href="#" className="group">
                                        <div className="w-10 h-10 rounded-lg bg-amber-800/30 flex items-center justify-center border border-amber-700/30 transition-all duration-300 group-hover:bg-amber-700/50 group-hover:border-amber-600/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 group-hover:text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </a>
                                    <a href="#" className="group">
                                        <div className="w-10 h-10 rounded-lg bg-amber-800/30 flex items-center justify-center border border-amber-700/30 transition-all duration-300 group-hover:bg-amber-700/50 group-hover:border-amber-600/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 group-hover:text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                        </svg>
                                    </div>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Quick Links */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 text-amber-200 relative inline-block">
                                    Quick Links
                                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full"></span>
                                </h4>
                                <ul className="space-y-4">
                                    {["Home", "Features", "Benefits", "Testimonials", "Rooms"].map((item) => (
                                        <li key={item} className="group">
                                            <button 
                                                onClick={() => scrollToSection(item.toLowerCase())} 
                                                className={`text-amber-300/80 hover:text-amber-200 transition-colors flex items-center group-hover:translate-x-1 duration-300`}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-70 group-hover:opacity-100"></span>
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Resources */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 text-amber-200 relative inline-block">
                                    Resources
                                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full"></span>
                                </h4>
                                <ul className="space-y-4">
                                    {["Documentation", "Blog", "Case Studies", "FAQ", "Support Center"].map((item) => (
                                        <li key={item} className="group">
                                            <a 
                                                href="#" 
                                                className="text-amber-300/80 hover:text-amber-200 transition-colors flex items-center group-hover:translate-x-1 duration-300"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-70 group-hover:opacity-100"></span>
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 text-amber-200 relative inline-block">
                                    Contact Us
                                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full"></span>
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-amber-300/80">Phone</p>
                                            <p className="text-white font-medium">+1 (555) 123-4567</p>
                                            <p className="text-amber-100/70 text-sm">Monday - Friday, 9am - 6pm EST</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-amber-300/80">Email</p>
                                            <p className="text-white font-medium">info@hoteltech.com</p>
                                            <p className="text-amber-100/70 text-sm">support@hoteltech.com</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-amber-300/80">Address</p>
                                            <p className="text-white font-medium">123 Tech Avenue</p>
                                            <p className="text-amber-100/70 text-sm">Suite 500, New York, NY 10001</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Bottom footer */}
                        <div className="pt-8 border-t border-amber-700/30 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-amber-300/70 text-sm mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()} Hotel Tech. All rights reserved.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-6">
                                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((item) => (
                                    <a key={item} href="#" className="text-amber-300/70 text-sm hover:text-amber-200 transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>

                {/* CSS for animations */}
                <style jsx global>{`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-10px) rotate(2deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    
                    @keyframes blob {
                        0% { transform: scale(1) translate(0px, 0px); }
                        33% { transform: scale(1.1) translate(20px, -20px); }
                        66% { transform: scale(0.9) translate(-20px, 20px); }
                        100% { transform: scale(1) translate(0px, 0px); }
                    }
                    
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-blob {
                        animation: blob 10s infinite alternate;
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 1s forwards;
                    }
                    
                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient 4s ease infinite;
                    }
                    
                    .animation-delay-500 {
                        animation-delay: 0.5s;
                    }
                    
                    .animation-delay-1000 {
                        animation-delay: 1s;
                    }
                    
                    .animation-delay-1500 {
                        animation-delay: 1.5s;
                    }
                    
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    
                    .animation-delay-3000 {
                        animation-delay: 3s;
                    }
                    
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    
                    .bg-grid-pattern {
                        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a16207' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    }
                `}</style>
            </div>
        </>
    );
}
