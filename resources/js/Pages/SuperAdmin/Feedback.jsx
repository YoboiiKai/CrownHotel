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

    // Mock feedback data
    const feedbackData = {
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
    const allFeedback = [...feedbackData.positive, ...feedbackData.negative, ...feedbackData.recent];

    // Filter feedback based on active tab, search query, and category
    const filteredFeedback = allFeedback.filter(feedback => {
        const matchesTab = 
            activeTab === "all" || 
            (activeTab === "positive" && feedback.rating >= 4) || 
            (activeTab === "negative" && feedback.rating < 4);
        
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
                    <h2 className="text-2xl font-bold text-gray-900">
                        Client Feedback
                    </h2>
                    <p className="text-sm text-gray-500">
                        Review and manage client feedback about employee services and hotel experiences
                    </p>
                </div>
            }
        >
            <Head title="Client Feedback" />

            
                <div className="mx-auto max-w-6xl">
                    {/* Feedback Controls */}
                    <div className="mb-6">
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search feedback..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                                
                                {/* Category Filter */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    >
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <span>Filter</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </button>
                                    {showFilterDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                {["all", "room", "restaurant", "spa", "concierge", "pool", "checkout"].map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            setFilterCategory(category);
                                                            setShowFilterDropdown(false);
                                                        }}
                                                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
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
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    >
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>Date</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                {["today", "week", "month", "quarter", "year", "all time"].map((range) => (
                                                    <button
                                                        key={range}
                                                        onClick={() => {
                                                            setDateRange(range);
                                                            setShowDropdown(false);
                                                        }}
                                                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                    >
                                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Feedback Type Tabs */}
                        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("all")}
                            >
                                All Feedback
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "positive" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("positive")}
                            >
                                Positive
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "negative" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("negative")}
                            >
                                Negative
                            </button>
                        </div>
                    </div>

                    {/* Feedback Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Feedback Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <MessageSquare className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Total Feedback</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{allFeedback.length}</p>
                                    <span className="ml-2 text-sm text-gray-500">responses</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">This Month</p>
                                        <p className="text-sm font-medium text-gray-900">{allFeedback.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Average Rating Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <Star className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Average Rating</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {(allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length).toFixed(1)}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">out of 5</span>
                                </div>
                                <div className="mt-4 flex">
                                    {renderStarRating(Math.round(allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length))}
                                </div>
                            </div>
                        </div>

                        {/* Positive Feedback Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <ThumbsUp className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Positive Feedback</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {allFeedback.filter(item => item.rating >= 4).length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">responses</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Satisfaction Rate</p>
                                        <p className="text-sm font-medium text-green-600">
                                            {Math.round((allFeedback.filter(item => item.rating >= 4).length / allFeedback.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Negative Feedback Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                            <ThumbsDown className="h-5 w-5 text-red-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Negative Feedback</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {allFeedback.filter(item => item.rating < 4).length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">responses</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Improvement Needed</p>
                                        <p className="text-sm font-medium text-red-600">
                                            {Math.round((allFeedback.filter(item => item.rating < 4).length / allFeedback.length) * 100)}%
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {activeTab === "all" 
                                        ? "All Feedback" 
                                        : activeTab === "positive" 
                                            ? "Positive Feedback" 
                                            : "Negative Feedback"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {filteredFeedback.length} {filteredFeedback.length === 1 ? 'entry' : 'entries'} found
                                </p>
                            </div>

                            {filteredFeedback.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredFeedback.map((feedback) => (
                                        <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {renderStarRating(feedback.rating)}
                                                        </div>
                                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                                            feedback.rating >= 4 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {feedback.rating >= 4 ? 'Positive' : 'Negative'}
                                                        </span>
                                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                            {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">{feedback.comment}</p>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span>{feedback.client}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(feedback.date)}</span>
                                                        </div>
                                                        {feedback.employee && feedback.employee !== "General" && feedback.employee !== "Reception Staff" && (
                                                            <div className="flex items-center gap-1">
                                                                <Award className="h-4 w-4 text-amber-500" />
                                                                <span className="font-medium text-gray-700">Employee: {feedback.employee}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row md:flex-col gap-2 self-start">
                                                    <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                                                        Reply
                                                    </button>
                                                    <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                                                        Archive
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
        </SuperAdminLayout>
    );
}