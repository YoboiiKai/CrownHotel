import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { 
    MessageSquare, 
    Star, 
    ThumbsUp, 
    ThumbsDown, 
    User, 
    Calendar, 
    Filter, 
    Search,
    ChevronDown,
    Award,
    TrendingUp,
    TrendingDown,
    Clock,
    UserCircle,
    Sparkles,
    Heart,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart4,
    Archive
} from 'lucide-react';

export default function Feedback() {
    // State for feedback data and UI controls
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [dateRange, setDateRange] = useState("month");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Fetch data effect
    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
 
    
    const feedbackData = {
        neutral: [
            {
                id: 10,
                client: "Michael Thompson",
                date: "2023-10-14",
                rating: 3,
                category: "room",
                employee: "General",
                comment: "The room was adequate for our needs. Nothing exceptional but no major issues either. The bathroom could use some updating."
            },
            {
                id: 11,
                client: "Laura Garcia",
                date: "2023-10-11",
                rating: 3,
                category: "restaurant",
                employee: "General",
                comment: "Food quality was average. Service was neither particularly good nor bad. Prices were reasonable for what was offered."
            },
            {
                id: 12,
                client: "Thomas Wright",
                date: "2023-10-09",
                rating: 3,
                category: "spa",
                employee: "Jessica Parker",
                comment: "The spa facilities were standard. Jessica was professional but the treatment was just okay. Not worth the premium price."
            },
        ],
        positive: [
            {
                id: 1,
                client: "Emma Thompson",
                date: "2023-10-15",
                rating: 5,
                category: "room",
                employee: "Michael Chen",
                comment: "The room was immaculate and the view was breathtaking. Michael went above and beyond to ensure our stay was perfect. The attention to detail was impressive!"
            },
            {
                id: 2,
                client: "James Wilson",
                date: "2023-10-12",
                rating: 4,
                category: "restaurant",
                employee: "Sophia Rodriguez",
                comment: "Excellent dining experience! Sophia was attentive and provided great recommendations. The food was delicious and beautifully presented."
            },
            {
                id: 3,
                client: "Robert Johnson",
                date: "2023-10-08",
                rating: 5,
                category: "spa",
                employee: "Olivia Kim",
                comment: "The spa treatment was incredibly relaxing. Olivia was professional and made sure I was comfortable throughout the entire session. Will definitely return!"
            },
            {
                id: 4,
                client: "Sarah Davis",
                date: "2023-10-05",
                rating: 5,
                category: "concierge",
                employee: "Daniel Martinez",
                comment: "Daniel was exceptionally helpful in arranging our tours and transportation. His knowledge of local attractions made our trip memorable."
            }
        ],
        negative: [
            {
                id: 5,
                client: "Thomas Brown",
                date: "2023-10-14",
                rating: 2,
                category: "room",
                employee: "General",
                comment: "The room temperature control wasn't working properly. It took multiple calls to get it fixed, which was frustrating after a long day of travel."
            },
            {
                id: 6,
                client: "Lisa Garcia",
                date: "2023-10-10",
                rating: 3,
                category: "restaurant",
                employee: "General",
                comment: "While the food was good, the wait time was longer than expected. The restaurant seemed understaffed during peak hours."
            },
            {
                id: 7,
                client: "Kevin Miller",
                date: "2023-10-07",
                rating: 2,
                category: "checkout",
                employee: "Reception Staff",
                comment: "The checkout process was confusing and took too long. There was a discrepancy in my bill that took time to resolve."
            }
        ],
        recent: [
            {
                id: 8,
                client: "Jennifer Lee",
                date: "2023-10-16",
                rating: 5,
                category: "room",
                employee: "William Taylor",
                comment: "William was exceptional in handling our request for a room change. The new room had a stunning view of the city skyline."
            },
            {
                id: 9,
                client: "David Wilson",
                date: "2023-10-15",
                rating: 1,
                category: "pool",
                employee: "General",
                comment: "The pool area was not as clean as expected. There were not enough towels available, and we had to wait for them to be restocked."
            }
        ]
    };

    // Combined feedback for filtering and searching
    const allFeedback = [...feedbackData.positive, ...feedbackData.negative, ...feedbackData.neutral, ...feedbackData.recent];

    // Filter feedback based on active tab, search query, and category
    const filteredFeedback = allFeedback.filter(feedback => {
        const matchesTab = 
            activeTab === "all" || 
            (activeTab === "positive" && feedback.rating >= 4) || 
            (activeTab === "neutral" && feedback.rating === 3) || 
            (activeTab === "negative" && feedback.rating < 3);
        
        const matchesSearch = 
            feedback.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
            feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (feedback.employee && feedback.employee.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = filterCategory === "all" || feedback.category === filterCategory;
        
        return matchesTab && matchesSearch && matchesCategory;
    });

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Helper function to render star rating
    const renderStarRating = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            <Star 
                key={index} 
                className={`h-4 w-4 ${index < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
            />
        ));
    };

    // Loading state component
    const LoadingState = () => (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading feedback data...</p>
        </div>
    );

    return (
        <SuperAdminLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold text-[#5D3A1F]">
                        Client Feedback Management
                    </h2>

                    <p className="text-sm text-[#6B4226]/70">
                        Review and analyze client feedback to enhance hotel services and employee performance
                    </p>
                </div>
            }
        >
            <Head title="Client Feedback" />

            <div className="mx-auto max-w-7xl">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">GUEST SATISFACTION</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Feedback <span className="text-[#DEB887]">Insights</span>
                                </h1>
                                <p className="text-white/80 max-w-xl">
                                    Monitor and analyze guest feedback to enhance service quality and maintain our luxury standards.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">Average Rating</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-bold text-white">4.7</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-[#DEB887] fill-[#DEB887]' : i === 4 ? 'text-[#DEB887] fill-[#DEB887]/70' : 'text-white/30'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">Total Feedback</p>
                                    <p className="text-2xl font-bold text-white">{allFeedback.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#DEB887] opacity-20 rounded-full -mt-20 -mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A67C52] opacity-20 rounded-full -mb-10 -ml-10 blur-3xl"></div>
                </div>
                
                <div className="mx-auto max-w-6xl">
                    {/* Feedback Controls */}
                    <div className="mb-6">
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A67C52]" />
                                    <input
                                        type="text"
                                        placeholder="Search feedback..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2 pl-10 pr-4 text-sm text-[#5D3A1F] focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/20 transition-all shadow-sm"
                                    />
                                </div>
                                
                                {/* Category Filter */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        className="flex items-center gap-2 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-2 text-sm text-[#5D3A1F] hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/20 transition-all shadow-sm"
                                    >
                                        <Filter className="h-4 w-4 text-[#A67C52]" />
                                        <span>Filter</span>
                                        <ChevronDown className="h-4 w-4 text-[#A67C52]" />
                                    </button>
                                    {showFilterDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#DEB887]/20 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                {["all", "room", "restaurant", "spa", "concierge", "pool", "checkout"].map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            setFilterCategory(category);
                                                            setShowFilterDropdown(false);
                                                        }}
                                                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-[#5D3A1F]"
                                                    >
                                                        {category === "all" 
                                                            ? "All Categories" 
                                                            : category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Date Range Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-2 text-sm text-[#5D3A1F] hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/20 transition-all shadow-sm"
                                    >
                                        <Calendar className="h-4 w-4 text-[#A67C52]" />
                                        <span>Date</span>
                                        <ChevronDown className="h-4 w-4 text-[#A67C52]" />
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#DEB887]/20 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                {["week", "month", "quarter", "year"].map((range) => (
                                                    <button
                                                        key={range}
                                                        onClick={() => {
                                                            setDateRange(range);
                                                            setShowDropdown(false);
                                                        }}
                                                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-[#5D3A1F]"
                                                    >
                                                        {range === "week" ? "This Week" : range === "month" ? "This Month" : range === "quarter" ? "This Quarter" : "This Year"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
                        {/* Total Feedback Card */}
                        <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                            <MessageSquare className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#5D3A1F]">Total Feedback</h3>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-bold text-[#5D3A1F]">{allFeedback.length}</p>
                                    <span className="ml-1 text-xs text-[#6B4226]/70">responses</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] text-[#6B4226]/70">This {dateRange}</div>
                                        <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                            <TrendingUp className="h-2.5 w-2.5" />
                                            <span>+12%</span>
                                        </div>
                                    </div>
                                    <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[75%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Average Rating Card */}
                        <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                            <Star className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#5D3A1F]">Average Rating</h3>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-bold text-[#5D3A1F]">
                                        {(allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length).toFixed(1)}
                                    </p>
                                    <span className="ml-1 text-xs text-[#6B4226]/70">out of 5</span>
                                </div>
                                <div className="mt-2 flex">
                                    {Array(5).fill(0).map((_, index) => (
                                        <Star 
                                            key={index} 
                                            className={`h-3.5 w-3.5 ${index < Math.round(allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length) ? 'text-[#DEB887] fill-[#DEB887]' : 'text-[#DEB887]/30'}`} 
                                        />
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] text-[#6B4226]/70">This {dateRange}</div>
                                        <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                            <TrendingUp className="h-2.5 w-2.5" />
                                            <span>+0.3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Positive Feedback Card */}
                        <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                            <ThumbsUp className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#5D3A1F]">Positive</h3>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-bold text-[#5D3A1F]">
                                        {allFeedback.filter(item => item.rating >= 4).length}
                                    </p>
                                    <span className="ml-1 text-xs text-[#6B4226]/70">responses</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] text-[#6B4226]/70">This {dateRange}</div>
                                        <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                            <TrendingUp className="h-2.5 w-2.5" />
                                            <span>+15%</span>
                                        </div>
                                    </div>
                                    <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-300 w-[80%]"></div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-[#6B4226]/70">Satisfaction</p>
                                        <p className="text-xs font-medium text-green-600">
                                            {Math.round((allFeedback.filter(item => item.rating >= 4).length / allFeedback.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Neutral Feedback Card */}
                        <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                            <AlertCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#5D3A1F]">Neutral</h3>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-bold text-[#5D3A1F]">
                                        {allFeedback.filter(item => item.rating === 3).length}
                                    </p>
                                    <span className="ml-1 text-xs text-[#6B4226]/70">responses</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] text-[#6B4226]/70">This {dateRange}</div>
                                        <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                                            <TrendingUp className="h-2.5 w-2.5" />
                                            <span>+2%</span>
                                        </div>
                                    </div>
                                    <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 w-[40%]"></div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-[#6B4226]/70">Opportunity</p>
                                        <p className="text-xs font-medium text-amber-600">
                                            {Math.round((allFeedback.filter(item => item.rating === 3).length / allFeedback.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Negative Feedback Card */}
                        <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                            <ThumbsDown className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#5D3A1F]">Negative</h3>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-bold text-[#5D3A1F]">
                                        {allFeedback.filter(item => item.rating < 3).length}
                                    </p>
                                    <span className="ml-1 text-xs text-[#6B4226]/70">responses</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] text-[#6B4226]/70">This {dateRange}</div>
                                        <div className="flex items-center gap-0.5 text-[10px] text-red-500">
                                            <TrendingDown className="h-2.5 w-2.5" />
                                            <span>-5%</span>
                                        </div>
                                    </div>
                                    <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-300 w-[20%]"></div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-[#6B4226]/70">Improvement</p>
                                        <p className="text-xs font-medium text-red-600">
                                            {Math.round((allFeedback.filter(item => item.rating < 3).length / allFeedback.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback List */}
                    {isLoading ? (
                        <LoadingState />
                    ) : (
                        <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl shadow-md border border-[#DEB887]/30 overflow-hidden">
                            <div className="p-6 border-b border-[#DEB887]/30">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#5D3A1F]">
                                            {activeTab === "all" 
                                                ? "All Feedback" 
                                                : activeTab === "positive" 
                                                    ? "Positive Feedback" 
                                                    : "Negative Feedback"}
                                        </h3>
                                        <p className="text-sm text-[#6B4226]/70 mt-1">
                                            {filteredFeedback.length} {filteredFeedback.length === 1 ? 'entry' : 'entries'} found
                                        </p>
                                    </div>
                                    
                                    {/* Luxurious Tabs */}
                                    <div className="flex bg-[#F5EFE7] p-1 rounded-lg shadow-inner">
                                        <button
                                            onClick={() => setActiveTab("all")}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "all" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "text-[#5D3A1F] hover:bg-[#DEB887]/20"}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("positive")}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "positive" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "text-[#5D3A1F] hover:bg-[#DEB887]/20"}`}
                                        >
                                            Positive
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("neutral")}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "neutral" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "text-[#5D3A1F] hover:bg-[#DEB887]/20"}`}
                                        >
                                            Neutral
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("negative")}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "negative" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "text-[#5D3A1F] hover:bg-[#DEB887]/20"}`}
                                        >
                                            Negative
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredFeedback.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5EFE7] mx-auto mb-4">
                                        <MessageSquare className="h-10 w-10 text-[#A67C52]" />
                                    </div>
                                    <h3 className="text-lg font-medium text-[#5D3A1F] mb-1">No feedback found</h3>
                                    <p className="text-[#6B4226]/70">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#DEB887]/30">
                                    {filteredFeedback.map((feedback) => (
                                        <div key={feedback.id} className="p-6 hover:bg-[#F5EFE7]/50 transition-colors duration-150">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {Array(5).fill(0).map((_, index) => (
                                                                <Star 
                                                                    key={index} 
                                                                    className={`h-4 w-4 ${index < feedback.rating ? 'text-[#DEB887] fill-[#DEB887]' : 'text-[#DEB887]/30'}`} 
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                                            feedback.rating >= 4 
                                                                ? 'bg-gradient-to-r from-green-500/20 to-green-300/20 text-green-800 border border-green-300' 
                                                                : feedback.rating === 3
                                                                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-300/20 text-amber-800 border border-amber-300'
                                                                    : 'bg-gradient-to-r from-red-500/20 to-red-300/20 text-red-800 border border-red-300'
                                                        }`}>
                                                            {feedback.rating >= 4 ? 'Positive' : feedback.rating === 3 ? 'Neutral' : 'Negative'}
                                                        </span>
                                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#A67C52]/20 to-[#DEB887]/20 text-[#5D3A1F] border border-[#DEB887]/30">
                                                            {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#5D3A1F] mb-3 leading-relaxed">{feedback.comment}</p>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B4226]/70">
                                                        <div className="flex items-center gap-1.5 bg-[#F5EFE7] px-2.5 py-1 rounded-full">
                                                            <UserCircle className="h-3.5 w-3.5 text-[#A67C52]" />
                                                            <span className="text-xs">{feedback.client}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-[#F5EFE7] px-2.5 py-1 rounded-full">
                                                            <Calendar className="h-3.5 w-3.5 text-[#A67C52]" />
                                                            <span className="text-xs">{formatDate(feedback.date)}</span>
                                                        </div>
                                                        {feedback.employee && feedback.employee !== "General" && feedback.employee !== "Reception Staff" && (
                                                            <div className="flex items-center gap-1.5 bg-[#F5EFE7] px-2.5 py-1 rounded-full">
                                                                <Award className="h-3.5 w-3.5 text-[#DEB887]" />
                                                                <span className="text-xs font-medium text-[#5D3A1F]">Employee: {feedback.employee}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}