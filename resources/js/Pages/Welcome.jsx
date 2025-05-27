import { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { Building2, ChevronRight, Users, BarChart3, Calendar, Utensils, Shield, Star, X, ChevronLeft, Hotel, Crown, ChevronUp } from "lucide-react";

// Custom styles for the scrollbar
const scrollbarStyles = `
  /* Global scrollbar styles */
  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  html::-webkit-scrollbar-track,
  body::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
  }
  
  html::-webkit-scrollbar-thumb,
  body::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #A67C52, #8B5A2B);
    border-radius: 10px;
  }
  
  html::-webkit-scrollbar-thumb:hover,
  body::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7C5E42, #5D3A1F);
  }
  
  /* Firefox scrollbar */
  html, body {
    scrollbar-width: thin;
    scrollbar-color: #A67C52 rgba(255, 255, 255, 0.4);
  }
  
  /* For touch devices */
  @media (hover: none) {
    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
  
  /* Element-specific scrollbar styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #A67C52, #8B5A2B);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7C5E42, #5D3A1F);
  }
`;

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [scrollY, setScrollY] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const carouselRef = useRef(null);
    const autoPlayRef = useRef(null);
    
    // Apply scrollbar styles when component mounts
    useEffect(() => {
        // Create a style element
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Global scrollbar styles */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.4);
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #A67C52, #8B5A2B);
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #7C5E42, #5D3A1F);
            }
            
            /* Firefox scrollbar */
            * {
                scrollbar-width: thin;
                scrollbar-color: #A67C52 rgba(255, 255, 255, 0.4);
            }
        `;
        
        // Append the style element to the document head
        document.head.appendChild(styleElement);
        
        // Clean up function to remove the style element when component unmounts
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    
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

    // Carousel auto-play functionality
    useEffect(() => {
        const playCarousel = () => {
            setCurrentSlide(prev => (prev === 3 ? 0 : prev + 1));
        };
        
        autoPlayRef.current = setInterval(playCarousel, 6000); // Change slide every 6 seconds
        
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, []);
    
    // Handle scroll events to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowScrollTop(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Function to scroll to section
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };
    
    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setActiveSection("home");
    };
    
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
            {/* Apply custom scrollbar styles */}
            <style>{scrollbarStyles}</style>
            <Head title="LuxStay - Hotel & Restaurant Management System">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet" />
            </Head>
            
            {/* Main container with gradient background */}
            <div className="relative min-h-screen w-full overflow-x-hidden custom-scrollbar bg-gradient-to-br from-[#F5EFE6] via-white to-[#F5EFE6]">
                {/* Subtle light effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#A67C52] opacity-5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#8B5A2B] opacity-5 blur-[80px] rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#DEB887] opacity-5 blur-[80px] rounded-full"></div>
                
                {/* Navigation */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-[#A67C52]/10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-3">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-xl bg-[#DEB887] blur-[8px] opacity-40"></div>
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] text-white shadow-lg">
                                        <Crown size={26} className="animate-float" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#DEB887]">
                                        <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>CROWN</span>
                                        <span className="text-sm font-light"> of the </span>
                                        <span style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.05em' }}>ORIENT</span>
                                    </h1>
                                    <p className="text-xs text-[#A67C52] font-medium tracking-wider">BEACH RESORT</p>
                                </div>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-6">
                                <button 
                                    onClick={() => scrollToSection("home")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "home" ? "text-[#8B5A2B] font-semibold" : "text-[#5D3A1F]/80 hover:text-[#8B5A2B]"}`}
                                >
                                    Home
                                </button>
                                <button 
                                    onClick={() => scrollToSection("features")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "features" ? "text-[#8B5A2B] font-semibold" : "text-[#5D3A1F]/80 hover:text-[#8B5A2B]"}`}
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => scrollToSection("benefits")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "benefits" ? "text-[#8B5A2B] font-semibold" : "text-[#5D3A1F]/80 hover:text-[#8B5A2B]"}`}
                                >
                                    Benefits
                                </button>
                                <button 
                                    onClick={() => scrollToSection("testimonials")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "testimonials" ? "text-[#8B5A2B] font-semibold" : "text-[#5D3A1F]/80 hover:text-[#8B5A2B]"}`}
                                >
                                    Feedback
                                </button>
                                <button 
                                    onClick={() => scrollToSection("rooms")}
                                    className={`text-sm font-medium transition-colors ${activeSection === "rooms" ? "text-[#8B5A2B] font-semibold" : "text-[#5D3A1F]/80 hover:text-[#8B5A2B]"}`}
                                >
                                    Rooms
                                </button>
                            </nav>
                            
                            {/* Auth Buttons */}
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="px-4 py-2 rounded-md bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-sm font-medium shadow-md hover:shadow-[0_4px_12px_rgba(166,124,82,0.3)] transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="px-4 py-2 rounded-md text-[#8B5A2B] text-sm font-medium hover:bg-[#F5EFE6] transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-sm font-medium shadow-md hover:shadow-[0_4px_12px_rgba(166,124,82,0.3)] transition-all duration-200"
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
                            <div className="md:hidden py-4 border-t border-gray-200 custom-scrollbar">
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
                
                {/* Hero Section with Image Carousel */}
                <section id="home" className="relative h-screen overflow-hidden custom-scrollbar">
                    {/* Image Carousel */}
                    <div ref={carouselRef} className="relative h-full w-full">
                        {/* Carousel slides */}
                        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" 
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
                                opacity: currentSlide === 0 ? '1' : '0',
                                zIndex: currentSlide === 0 ? '1' : '0'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F00]/60 via-[#1A0F00]/40 to-[#1A0F00]/60"></div>
                        </div>
                        
                        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" 
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
                                opacity: currentSlide === 1 ? '1' : '0',
                                zIndex: currentSlide === 1 ? '1' : '0'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F00]/60 via-[#1A0F00]/40 to-[#1A0F00]/60"></div>
                        </div>
                        
                        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" 
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80')`,
                                opacity: currentSlide === 2 ? '1' : '0',
                                zIndex: currentSlide === 2 ? '1' : '0'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F00]/60 via-[#1A0F00]/40 to-[#1A0F00]/60"></div>
                        </div>
                        
                        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" 
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
                                opacity: currentSlide === 3 ? '1' : '0',
                                zIndex: currentSlide === 3 ? '1' : '0'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F00]/60 via-[#1A0F00]/40 to-[#1A0F00]/60"></div>
                        </div>
                        
                        {/* Twinkling stars overlay - matches login page */}
                        <div className="absolute inset-0 overflow-hidden z-[1]">
                            {Array.from({ length: 100 }).map((_, index) => (
                                <div 
                                    key={index}
                                    className="absolute rounded-full bg-white opacity-0 animate-twinkle"
                                    style={{
                                        width: `${Math.random() * 3 + 1}px`,
                                        height: `${Math.random() * 3 + 1}px`,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        '--duration': `${Math.random() * 3 + 2}s`,
                                        '--delay': `${Math.random() * 5}s`
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Hotel name and logo in center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
                            <div className="text-center">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 rounded-full bg-[#DEB887] blur-[30px] opacity-40 glow-effect"></div>
                                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] text-white shadow-[0_0_30px_rgba(166,124,82,0.4)] mx-auto">
                                        <Crown size={56} className="animate-float" />
                                        <div className="absolute inset-0 rounded-full border-4 border-[#DEB887]/20 animate-ping"></div>
                                    </div>
                                </div>
                                
                                <h1 className="mb-4 tracking-tight drop-shadow-lg">
                                    <span className="inline-flex items-center">
                                        <span className="text-5xl md:text-7xl font-bold text-[#DEB887]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>CROWN</span>
                                        <span className="text-sm md:text-xl uppercase tracking-[0.3em] font-light mx-2 text-[#DEB887]/80 self-center">of the</span>
                                        <span className="text-6xl md:text-8xl text-[#DEB887]" style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: '600', letterSpacing: '0.05em' }}>ORIENT</span>
                                    </span>
                                </h1>
                                
                                <div className="w-32 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#DEB887] to-[#A67C52]/0 mx-auto mb-8"></div>
                                
                                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow-md font-light">
                                    Experience unparalleled luxury at our 5-star beachfront resort
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-5">
                                    <Link
                                        href={route("register")}
                                        className="px-8 py-4 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white font-medium shadow-lg hover:shadow-[0_5px_20px_rgba(166,124,82,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                                    >
                                        <span>Book Now</span>
                                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    
                                    <button
                                        onClick={() => scrollToSection("rooms")}
                                        className="px-8 py-4 rounded-full border-2 border-[#DEB887]/40 backdrop-blur-sm text-white font-medium hover:bg-[#DEB887]/10 transition-all duration-300"
                                    >
                                        View Rooms
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Navigation arrows */}
                        <button 
                            onClick={() => setCurrentSlide(prev => (prev === 0 ? 3 : prev - 1))}
                            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#1A0F00]/30 backdrop-blur-sm text-white border border-[#DEB887]/20 hover:bg-[#8B5A2B]/40 transition-all duration-300"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        
                        <button 
                            onClick={() => setCurrentSlide(prev => (prev === 3 ? 0 : prev + 1))}
                            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#1A0F00]/30 backdrop-blur-sm text-white border border-[#DEB887]/20 hover:bg-[#8B5A2B]/40 transition-all duration-300"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={24} />
                        </button>
                        
                        {/* Slide indicators */}
                        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
                            {[0, 1, 2, 3].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#DEB887] w-10' : 'bg-white/40 w-3 hover:bg-[#DEB887]/60'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                    
                    {/* CSS for animations */}
                    <style jsx>{`
                        @keyframes twinkle {
                            0% { opacity: 0; transform: scale(0.5); }
                            50% { opacity: 1; transform: scale(1); }
                            100% { opacity: 0; transform: scale(0.5); }
                        }
                        
                        .animate-twinkle {
                            animation: twinkle var(--duration, 3s) ease-in-out infinite;
                            animation-delay: var(--delay, 0s);
                        }
                        
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                            100% { transform: translateY(0px); }
                        }
                        
                        .animate-float {
                            animation: float 3s ease-in-out infinite;
                        }
                        
                        .glow-effect {
                            animation: pulse-slow 2s ease-in-out infinite;
                        }
                        
                        @keyframes pulse-slow {
                            0% { opacity: 0.3; }
                            50% { opacity: 0.6; }
                            100% { opacity: 0.3; }
                        }
                    `}</style>
                </section>
                
                
                {/* Benefits Section */}
                <section id="benefits" className="py-16 bg-gradient-to-b from-[#F5EFE6] to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-block mb-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#A67C52]"></div>
                                    <div className="text-[#8B5A2B] font-medium text-sm uppercase tracking-[0.2em]" style={{ fontFamily: '"Playfair Display", serif' }}>Experience Excellence</div>
                                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#A67C52]"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                Why Choose Crown of the Orient
                            </h2>
                            <p className="text-base text-[#6B4226]/80 max-w-2xl mx-auto">
                                Our beachfront resort offers an unparalleled luxury experience with exceptional amenities and personalized service.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                            <div className="order-2 lg:order-1 lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Benefit 1 */}
                                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#DEB887]/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#A67C52]/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-2 text-[#5D3A1F]" style={{ fontFamily: '"Playfair Display", serif' }}>Luxury Accommodations</h3>
                                                <p className="text-sm text-[#6B4226]/70 leading-relaxed">
                                                    Elegantly designed rooms and suites with premium amenities and breathtaking ocean views.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 2 */}
                                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#DEB887]/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#A67C52]/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-2 text-[#5D3A1F]" style={{ fontFamily: '"Playfair Display", serif' }}>Fine Dining Experience</h3>
                                                <p className="text-sm text-[#6B4226]/70 leading-relaxed">
                                                    Four gourmet restaurants offering international cuisine prepared by award-winning chefs.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 3 */}
                                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#DEB887]/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#A67C52]/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-2 text-[#5D3A1F]" style={{ fontFamily: '"Playfair Display", serif' }}>Exclusive Spa Retreat</h3>
                                                <p className="text-sm text-[#6B4226]/70 leading-relaxed">
                                                    Rejuvenate with our signature treatments in a tranquil setting overlooking the ocean.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Benefit 4 */}
                                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#DEB887]/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#A67C52]/5 rounded-full -mt-10 -mr-10"></div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-2 text-[#5D3A1F]" style={{ fontFamily: '"Playfair Display", serif' }}>Private Beach Access</h3>
                                                <p className="text-sm text-[#6B4226]/70 leading-relaxed">
                                                    Exclusive access to pristine white sand beaches with personalized cabana service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="order-1 lg:order-2 lg:col-span-2 relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#DEB887]/20 rounded-full blur-lg"></div>
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#A67C52]/10 rounded-full blur-xl"></div>
                                
                                {/* Image collage with luxury styling */}
                                <div className="relative">
                                    {/* Outer glow */}
                                    <div className="absolute inset-0 bg-[#DEB887] rounded-xl blur-[15px] opacity-20 transform -rotate-2"></div>
                                    
                                    {/* Gold frame border */}
                                    <div className="relative p-[3px] rounded-xl bg-gradient-to-br from-[#DEB887] via-[#A67C52] to-[#8B5A2B] shadow-xl">
                                        {/* Inner container */}
                                        <div className="relative overflow-hidden rounded-lg custom-scrollbar">
                                            {/* Twinkling stars overlay - matches login page */}
                                            <div className="absolute inset-0 overflow-hidden z-[1]">
                                                {Array.from({ length: 30 }).map((_, index) => (
                                                    <div 
                                                        key={index}
                                                        className="absolute rounded-full bg-white opacity-0 animate-twinkle"
                                                        style={{
                                                            width: `${Math.random() * 2 + 1}px`,
                                                            height: `${Math.random() * 2 + 1}px`,
                                                            left: `${Math.random() * 100}%`,
                                                            top: `${Math.random() * 100}%`,
                                                            '--duration': `${Math.random() * 3 + 2}s`,
                                                            '--delay': `${Math.random() * 5}s`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {/* Image collage layout */}
                                            <div className="grid grid-cols-4 grid-rows-5 gap-1 h-[420px]">
                                                {/* Main large image - beach view */}
                                                <div className="col-span-3 row-span-3 relative overflow-hidden group">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80" 
                                                        alt="Crown of the Orient Beach View" 
                                                        className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-[#1A0F00]/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90">Beach View</div>
                                                </div>
                                                
                                                {/* Top right - luxury suite */}
                                                <div className="col-span-1 row-span-2 relative overflow-hidden group">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                                                        alt="Luxury Suite" 
                                                        className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-[#1A0F00]/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90">Suite</div>
                                                </div>
                                                
                                                {/* Middle right - spa */}
                                                <div className="col-span-1 row-span-1 relative overflow-hidden group">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                                                        alt="Spa Treatment" 
                                                        className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-[#1A0F00]/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90">Spa</div>
                                                </div>
                                                
                                                {/* Bottom left - restaurant */}
                                                <div className="col-span-2 row-span-2 relative overflow-hidden group">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                                                        alt="Fine Dining" 
                                                        className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-[#1A0F00]/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90">Restaurant</div>
                                                </div>
                                                
                                                {/* Bottom right - pool */}
                                                <div className="col-span-2 row-span-2 relative overflow-hidden group">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                                                        alt="Infinity Pool" 
                                                        className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-[#1A0F00]/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90">Pool</div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                                <div className="flex flex-col space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-2xl font-bold" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Crown of the Orient</h3>
                                                            <div className="flex items-center mt-1">
                                                                <span className="ml-2 text-sm text-[#DEB887]">Beach Resort & Spa</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-[#F5EFE6]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#A67C52]/50 to-[#A67C52]/0"></div>
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#DEB887]/20 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A67C52]/20 rounded-full mix-blend-multiply opacity-70 blur-3xl"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16 relative">
                            {/* Decorative element */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#DEB887]/20 rounded-full mix-blend-multiply opacity-70 blur-xl"></div>
                            
                            <div className="inline-block mb-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#A67C52]"></div>
                                    <div className="text-[#8B5A2B] font-medium text-sm uppercase tracking-[0.2em]" style={{ fontFamily: '"Playfair Display", serif' }}>Guest Experiences</div>
                                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#A67C52]"></div>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                What Our Guests Say
                            </h2>
                            <p className="text-base text-[#6B4226]/80 max-w-2xl mx-auto">
                                Discover the experiences of our valued guests who have enjoyed their stay at Crown of the Orient Beach Resort.
                            </p>
                            <div className="w-32 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#DEB887] to-[#A67C52]/0 mx-auto mt-6"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="group relative">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] to-[#DEB887]/20 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-[#DEB887]/30 shadow-lg transform transition-all duration-500 group-hover:border-[#A67C52]/50 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-[#A67C52] opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-[#DEB887] mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-[#5D3A1F] mb-6 italic leading-relaxed">
                                            "LuxStay has completely transformed how we manage our hotel. The intuitive interface and comprehensive features have streamlined our operations and improved guest satisfaction significantly."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-[#DEB887]/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/women/48.jpg" 
                                                    alt="Sarah Johnson" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-[#A67C52]"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-[#5D3A1F]">Sarah Johnson</h4>
                                                <p className="text-sm text-[#8B5A2B]/80">General Manager, The Grand Hotel</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#DEB887]/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#DEB887]/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Testimonial 2 */}
                            <div className="group relative mt-8 md:mt-0">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] to-[#DEB887]/20 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-[#DEB887]/30 shadow-lg transform transition-all duration-500 group-hover:border-[#A67C52]/50 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-[#A67C52] opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-[#DEB887] mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-[#5D3A1F] mb-6 italic leading-relaxed">
                                            "The restaurant management features in LuxStay are exceptional. We've reduced food waste by 30% and improved table turnover rates since implementing the system."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-[#DEB887]/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                                                    alt="Michael Chen" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-[#A67C52]"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-[#5D3A1F]">Michael Chen</h4>
                                                <p className="text-sm text-[#8B5A2B]/80">Owner, Azure Fine Dining</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#DEB887]/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#DEB887]/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                            
                            {/* Testimonial 3 */}
                            <div className="group relative mt-8 md:mt-16">
                                {/* Card background with hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] to-[#DEB887]/20 rounded-xl transform transition-all duration-500 group-hover:scale-[1.02]"></div>
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl border border-[#DEB887]/30 shadow-lg transform transition-all duration-500 group-hover:border-[#A67C52]/50 group-hover:shadow-xl"></div>
                                
                                {/* Card content */}
                                <div className="relative p-8">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-2 text-[#A67C52] opacity-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {/* 5 stars */}
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-[#DEB887] mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </Star>
                                            ))}
                                        </div>
                                        
                                        <p className="text-[#5D3A1F] mb-6 italic leading-relaxed">
                                            "The analytics provided by LuxStay have given us insights we never had before. We've been able to optimize our pricing strategy and increase revenue by 25% in just six months."
                                        </p>
                                        
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-[#DEB887]/30 blur-sm transform -translate-x-1 translate-y-1"></div>
                                                <img 
                                                    src="https://randomuser.me/api/portraits/women/65.jpg" 
                                                    alt="Elena Rodriguez" 
                                                    className="h-14 w-14 rounded-full object-cover relative border-2 border-[#A67C52]"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-bold text-[#5D3A1F]">Elena Rodriguez</h4>
                                                <p className="text-sm text-[#8B5A2B]/80">Director, Sunset Resort & Spa</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#DEB887]/50 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#DEB887]/50 rounded-bl-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Room Showcase Section */}
                <section id="rooms" className="py-20 bg-gradient-to-b from-[#F5EFE6] to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#A67C52]/50 to-[#A67C52]/0"></div>
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#DEB887]/30 rounded-full mix-blend-multiply blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#A67C52]/20 rounded-full mix-blend-multiply blur-3xl"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#A67C52]"></div>
                                    <div className="text-[#8B5A2B] font-medium text-sm uppercase tracking-wider">Luxury Accommodations</div>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#A67C52]"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                                Our Exclusive Rooms & Suites
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover our collection of luxurious accommodations designed for comfort, elegance, and unforgettable experiences.
                            </p>
                        </div>
                        
                        {/* Room Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {roomsData.map((room) => (
                                <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#DEB887]/30 group hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#5D3A1F]/70 to-transparent z-10"></div>
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
                                                        className={`h-4 w-4 ${i < Math.floor(room.rating) ? "text-[#DEB887] fill-[#DEB887]" : "text-[#DEB887]/50 fill-[#DEB887]/50"}`} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-white text-xs">{room.rating} ({room.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-[#5D3A1F] mb-2">{room.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[#8B5A2B] font-bold">
                                                {room.price}<span className="text-gray-500 text-xs font-normal"> / night</span>
                                            </div>
                                            <button 
                                                onClick={() => openRoomModal(room)} 
                                                className="px-4 py-2 bg-[#F5EFE6] hover:bg-[#DEB887]/20 text-[#5D3A1F] rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
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
                                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-md bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] group-hover:opacity-100"></span>
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#5D3A1F]/70 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h2 className="text-2xl font-bold text-white mb-2">{selectedRoom.name}</h2>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`h-5 w-5 ${i < Math.floor(selectedRoom.rating) ? "text-[#DEB887] fill-[#DEB887]" : "text-[#DEB887]/50 fill-[#DEB887]/50"}`} 
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-white">{selectedRoom.rating} ({selectedRoom.reviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Thumbnail Gallery */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5D3A1F]/80 to-transparent p-4">
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
                                            <h3 className="text-2xl font-bold text-[#5D3A1F] mb-4">Room Details</h3>
                                            <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-[#F5EFE6] text-[#8B5A2B] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-[#5D3A1F]">Room Size</h4>
                                                        <p className="text-gray-600 text-sm">{selectedRoom.size}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-[#F5EFE6] text-[#8B5A2B] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-[#5D3A1F]">Occupancy</h4>
                                                        <p className="text-gray-600 text-sm">{selectedRoom.occupancy}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-[#5D3A1F] mb-3">Amenities</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {selectedRoom.amenities.map((amenity, index) => (
                                                    <li key={index} className="flex items-center text-gray-600 text-sm">
                                                        <div className="mr-2 text-[#A67C52]">•</div>
                                                        {amenity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <span className="text-gray-600 text-sm">Price per night</span>
                                                    <p className="text-2xl font-bold text-[#8B5A2B]">{selectedRoom.price}</p>
                                                </div>
                                                <button className="px-6 py-3 bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white rounded-md font-medium hover:shadow-lg transition-all duration-300">
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
                                <div className="p-6 bg-[#F5EFE6]/30 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-[#5D3A1F] mb-4">Room Gallery</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {selectedRoom.images.map((image, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden group h-48">
                                                <img 
                                                    src={image.url} 
                                                    alt={image.title} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#5D3A1F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <h4 className="font-bold">{image.title}</h4>
                                                    <p className="text-sm text-[#DEB887]">{image.subtitle}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Map Section */}
                <section id="location" className="relative py-20 bg-[#F5EFE7] overflow-hidden custom-scrollbar">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#A67C52]/50 to-[#A67C52]/0"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#A67C52] rounded-full filter blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#DEB887] rounded-full filter blur-[100px] opacity-10 translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#5D3A1F] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                                <span className="relative inline-block">
                                    Find Us
                                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#A67C52]/0 via-[#A67C52] to-[#A67C52]/0"></span>
                                </span>
                            </h2>
                            <p className="text-[#8B5A2B] max-w-2xl mx-auto">
                                Nestled on the pristine shores of Paradise Bay, Crown of the Orient offers an idyllic beachfront location with easy access to all major attractions.
                            </p>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                            {/* Map */}
                            <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-white h-[400px] lg:h-auto">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802548850311!2d121.04882857489424!3d14.553740977357802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0ed01%3A0x2b066ed57830cace!2sMakati%20Shangri-La%2C%20Manila!5e0!3m2!1sen!2sph!4v1684211456040!5m2!1sen!2sph" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                            
                            {/* Contact Information */}
                            <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl overflow-hidden custom-scrollbar">
                                <div className="h-32 bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                                            Contact Information
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {/* Address */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10 border border-[#DEB887]/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[#5D3A1F] font-semibold mb-1">Our Address</h4>
                                            <p className="text-[#8B5A2B] text-sm">Beachfront Boulevard, Paradise Bay</p>
                                            <p className="text-[#8B5A2B] text-sm">Tropical Islands, 10001</p>
                                        </div>
                                    </div>
                                    
                                    {/* Phone */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10 border border-[#DEB887]/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[#5D3A1F] font-semibold mb-1">Phone Numbers</h4>
                                            <p className="text-[#8B5A2B] text-sm">Reservations: +1 (555) 123-4567</p>
                                            <p className="text-[#8B5A2B] text-sm">Customer Service: +1 (555) 987-6543</p>
                                        </div>
                                    </div>
                                    
                                    {/* Email */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10 border border-[#DEB887]/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[#5D3A1F] font-semibold mb-1">Email Addresses</h4>
                                            <p className="text-[#8B5A2B] text-sm">Reservations: bookings@crownorient.com</p>
                                            <p className="text-[#8B5A2B] text-sm">General Inquiries: info@crownorient.com</p>
                                        </div>
                                    </div>
                                    
                                    {/* Hours */}
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10 border border-[#DEB887]/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[#5D3A1F] font-semibold mb-1">Hours of Operation</h4>
                                            <p className="text-[#8B5A2B] text-sm">Front Desk: 24/7</p>
                                            <p className="text-[#8B5A2B] text-sm">Reservations: 8:00 AM - 10:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="relative bg-gradient-to-b from-[#5D3A1F] to-[#3D2614] text-white pt-16 pb-10 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DEB887]/0 via-[#DEB887]/50 to-[#DEB887]/0"></div>
                    <div className="absolute top-0 inset-x-0 h-64 bg-[#8B5A2B] opacity-10 transform -skew-y-6"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A67C52] rounded-full filter blur-[100px] opacity-10"></div>
                    <div className="absolute top-20 left-20 w-64 h-64 bg-[#DEB887] rounded-full filter blur-[80px] opacity-5"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Top footer with logo and newsletter */}
                        <div className="flex flex-col lg:flex-row justify-between items-center pb-10 mb-10 border-b border-[#A67C52]/30">
                            <div className="flex items-center space-x-3 mb-8 lg:mb-0">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-xl bg-[#DEB887] blur-[8px] opacity-40"></div>
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#5D3A1F] text-white shadow-lg">
                                        <Building2 size={28} className="animate-float" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        <span className="text-[#DEB887]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>CROWN</span>
                                        <span className="text-sm font-light text-[#DEB887]/80"> of the </span>
                                        <span className="text-[#DEB887]" style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.05em' }}>ORIENT</span>
                                    </h1>
                                    <p className="text-xs text-[#A67C52] font-medium tracking-wider">BEACH RESORT</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main footer content - simplified */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            {/* About */}
                            <div>
                                <h4 className="text-lg font-bold mb-5 text-[#DEB887] relative inline-block">
                                    About Us
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#DEB887]/0 via-[#DEB887] to-[#DEB887]/0 rounded-full"></span>
                                </h4>
                                <p className="text-[#DEB887]/80 mb-6 leading-relaxed">
                                    Crown of the Orient Beach Resort offers an unparalleled luxury experience with breathtaking ocean views, world-class amenities, and exceptional service that creates unforgettable memories for our guests.
                                </p>
                                
                                {/* Social Media Icons */}
                                <div className="flex space-x-3">
                                    {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
                                        <a key={platform} href="#" className="group">
                                            <div className="w-9 h-9 rounded-lg bg-[#5D3A1F]/40 flex items-center justify-center border border-[#A67C52]/30 transition-all duration-300 group-hover:bg-[#8B5A2B]/50 group-hover:border-[#DEB887]/50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DEB887] group-hover:text-[#F5EFE6]" fill="currentColor" viewBox="0 0 24 24">
                                                    {platform === 'facebook' && <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z" />}
                                                    {platform === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                                    {platform === 'twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />}
                                                    {platform === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                                                </svg>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Quick Links */}
                            <div>
                                <h4 className="text-lg font-bold mb-5 text-[#DEB887] relative inline-block">
                                    Quick Links
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#DEB887]/0 via-[#DEB887] to-[#DEB887]/0 rounded-full"></span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["Home", "Rooms & Suites", "Dining", "Spa & Wellness", "Events", "Gallery", "Special Offers", "Contact"].map((item) => (
                                        <button 
                                            key={item}
                                            onClick={() => scrollToSection(item.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))} 
                                            className="text-[#DEB887]/80 hover:text-[#F5EFE6] transition-colors flex items-center group hover:translate-x-1 duration-300"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] mr-2 opacity-70 group-hover:opacity-100"></span>
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-lg font-bold mb-5 text-[#DEB887] relative inline-block">
                                    Contact Us
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#DEB887]/0 via-[#DEB887] to-[#DEB887]/0 rounded-full"></span>
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DEB887]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">+1 (555) 123-4567</p>
                                            <p className="text-[#DEB887]/70 text-sm">Reservations: 24/7</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DEB887]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">info@crownorient.com</p>
                                            <p className="text-[#DEB887]/70 text-sm">We reply within 24 hours</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DEB887]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Beachfront Boulevard</p>
                                            <p className="text-[#DEB887]/70 text-sm">Paradise Bay, Tropical Islands</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Bottom footer */}
                        <div className="pt-6 border-t border-[#A67C52]/30 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-[#DEB887]/70 text-sm mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()} Crown of the Orient Beach Resort. All rights reserved.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-4">
                                {["Privacy", "Terms", "Cookies", "Sitemap"].map((item) => (
                                    <a key={item} href="#" className="text-[#DEB887]/70 text-sm hover:text-[#F5EFE6] transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>

                {/* CSS for animations */}
                <style>{`
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
                
                {/* Scroll to top button */}
                <button 
                    onClick={scrollToTop} 
                    className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-[#8B5A2B] to-[#5D3A1F] text-white shadow-lg hover:shadow-xl transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                    aria-label="Scroll to top"
                >
                    <div className="absolute inset-0 rounded-full bg-[#DEB887]/20 blur-[4px] opacity-60"></div>
                    <ChevronUp size={24} className="relative animate-float" />
                </button>
            </div>
        </>
    );
}
