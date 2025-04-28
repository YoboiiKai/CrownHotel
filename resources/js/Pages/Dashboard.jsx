"use client"

import { useState, useEffect } from 'react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Head } from '@inertiajs/react';
import { 
    Hotel, 
    CreditCard, 
    Calendar, 
    Users, 
    DollarSign, 
    ShoppingBag, 
    UtensilsCrossed, 
    Coffee, 
    CheckSquare, 
    AlertTriangle, 
    BarChart, 
    PieChart, 
    Activity,
    BedDouble,
    Star,
    ChevronDown,
    ArrowUp,
} from 'lucide-react';
import { motion } from "framer-motion";

export default function Dashboard() {
    // State for dashboard tabs
    const [activeTab, setActiveTab] = useState("overview");
    const [dateRange, setDateRange] = useState("today");
    const [showDropdown, setShowDropdown] = useState(false);
    const [animateCards, setAnimateCards] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Animation effect when component mounts
    useEffect(() => {
        setAnimateCards(true);
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    // Mock data for the dashboard
    const dashboardData = {
        hotel: {
            occupancyRate: 75,
            availableRooms: 12,
            totalRooms: 48,
            averageRating: 4.7,
            upcomingCheckIns: 5,
            upcomingCheckOuts: 3,
            roomCategories: [
                { name: "Standard", booked: 10, available: 2 },
                { name: "Deluxe", booked: 8, available: 4 },
                { name: "Suite", booked: 18, available: 6 }
            ]
        },
        restaurant: {
            tableOccupancy: 60,
            reservations: 12,
            popularDishes: [
                { name: "Grilled Salmon", orders: 24 },
                { name: "Beef Wellington", orders: 18 },
                { name: "Chocolate Soufflé", orders: 15 }
            ],
            averageOrderValue: 85,
            totalOrders: 42
        },
        financial: {
            totalRevenue: 12345,
            hotelRevenue: 8765,
            restaurantRevenue: 3580,
            expensesByCategory: [
                { category: "Staff", amount: 3200 },
                { category: "Supplies", amount: 1500 },
                { category: "Utilities", amount: 800 },
                { category: "Marketing", amount: 600 }
            ],
            pendingPayments: 3,
            pendingAmount: 1250
        },
        inventory: {
            lowStockItems: 5,
            recentDeliveries: 2,
            pendingOrders: 3,
            totalItems: 342
        },
        tasks: {
            pending: 8,
            completed: 15,
            overdue: 2
        }
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <ClientLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Dashboard
                    </h2>
                    <p className="text-sm text-gray-500">
                        Welcome to Luxe Hotel & Restaurant Management System
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />
                <div className="mx-auto max-w-6xl">
                    {/* Dashboard Controls */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Tabs */}
                        <div className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
                            {["overview", "hotel", "restaurant", "financial"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        activeTab === tab
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Date Range Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                            >
                                <Calendar className="h-4 w-4 text-amber-600" />
                                <span>{dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-10">
                                    {["today", "yesterday", "week", "month", "quarter", "year"].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => {
                                                setDateRange(range);
                                                setShowDropdown(false);
                                            }}
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                dateRange === range
                                                    ? "bg-amber-50 text-amber-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {range.charAt(0).toUpperCase() + range.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Occupancy Rate Card */}
                        <motion.div 
                            className={`rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            variants={itemVariants}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <Hotel className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Occupancy Rate</h3>
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                        <ArrowUp className="h-3 w-3" /> 5%
                                    </span>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.hotel.occupancyRate}%</p>
                                    <span className="ml-2 text-sm text-gray-500">of capacity</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" 
                                            style={{ width: `${dashboardData.hotel.occupancyRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">{dashboardData.hotel.totalRooms - dashboardData.hotel.availableRooms} of {dashboardData.hotel.totalRooms} rooms occupied</p>
                            </div>
                        </motion.div>

                        {/* Total Revenue Card */}
                        <motion.div 
                            className={`rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            variants={itemVariants}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Total Revenue</h3>
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                        <ArrowUp className="h-3 w-3" /> 12%
                                    </span>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.financial.totalRevenue)}</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-xs text-gray-500">Hotel</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(dashboardData.financial.hotelRevenue)}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-xs text-gray-500">Restaurant</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(dashboardData.financial.restaurantRevenue)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Restaurant Orders Card */}
                        <motion.div 
                            className={`rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            variants={itemVariants}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Restaurant Orders</h3>
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                        <ArrowUp className="h-3 w-3" /> 8%
                                    </span>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.restaurant.totalOrders}</p>
                                    <span className="ml-2 text-sm text-gray-500">orders today</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Average Order Value</p>
                                        <p className="text-sm font-medium text-gray-900">{formatCurrency(dashboardData.restaurant.averageOrderValue)}</p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Table Occupancy</p>
                                        <p className="text-sm font-medium text-gray-900">{dashboardData.restaurant.tableOccupancy}%</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Upcoming Reservations Card */}
                        <motion.div 
                            className={`rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            variants={itemVariants}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Upcoming Check-ins</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{dashboardData.hotel.upcomingCheckIns}</p>
                                    <span className="ml-2 text-sm text-gray-500">today</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                        <p className="text-sm text-gray-500">Check-ins</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{dashboardData.hotel.upcomingCheckIns}</p>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-500">Check-outs</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{dashboardData.hotel.upcomingCheckOuts}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Main Dashboard Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center">
                                        <div className="w-8 h-8 bg-amber-500 opacity-75 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 mb-6">
                            {/* Hotel Overview Section */}
                            <motion.div 
                                className={`rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                            >
                                <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Hotel className="h-5 w-5 text-amber-600" />
                                            <h3 className="font-semibold text-gray-900">Hotel Overview</h3>
                                        </div>
                                        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View Details</button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Room Categories */}
                                        <div className="md:col-span-2">
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Room Categories</h4>
                                            <div className="space-y-4">
                                                {dashboardData.hotel.roomCategories.map((category) => (
                                                    <div key={category.name} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-gray-900">{category.name}</h5>
                                                            <span className="text-sm text-gray-500">{category.booked} / {category.booked + category.available} booked</span>
                                                        </div>
                                                        <div className="h-2 w-full rounded-full bg-gray-100">
                                                            <div 
                                                                className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" 
                                                                style={{ width: `${(category.booked / (category.booked + category.available)) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                                            <span>{category.available} available</span>
                                                            <span>{Math.round((category.booked / (category.booked + category.available)) * 100)}% occupancy</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Room Status */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Room Status</h4>
                                            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                        <span className="text-sm text-gray-700">Available</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{dashboardData.hotel.availableRooms}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                                        <span className="text-sm text-gray-700">Occupied</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{dashboardData.hotel.totalRooms - dashboardData.hotel.availableRooms}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                                        <span className="text-sm text-gray-700">Maintenance</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">2</span>
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-medium text-gray-500 mt-6 mb-4">Guest Satisfaction</h4>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-700">Rating</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.hotel.averageRating}/5.0</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star 
                                                            key={star} 
                                                            className={`h-5 w-5 ${star <= Math.floor(dashboardData.hotel.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Restaurant Overview Section */}
                            <motion.div 
                                className={`rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UtensilsCrossed className="h-5 w-5 text-amber-600" />
                                            <h3 className="font-semibold text-gray-900">Restaurant Overview</h3>
                                        </div>
                                        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View Details</button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Table Status */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Table Status</h4>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm text-gray-700">Table Occupancy</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.restaurant.tableOccupancy}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                                                    <div 
                                                        className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" 
                                                        style={{ width: `${dashboardData.restaurant.tableOccupancy}%` }}
                                                    ></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                                                        <p className="text-xs text-gray-500 mb-1">Reservations Today</p>
                                                        <p className="text-lg font-semibold text-gray-900">{dashboardData.restaurant.reservations}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                                                        <p className="text-xs text-gray-500 mb-1">Avg. Order Value</p>
                                                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(dashboardData.restaurant.averageOrderValue)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Popular Dishes */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Popular Dishes</h4>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="space-y-3">
                                                    {dashboardData.restaurant.popularDishes.map((dish, index) => (
                                                        <div key={dish.name} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-medium text-sm">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">{dish.name}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">{dish.orders} orders</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Financial Overview Section */}
                            <motion.div 
                                className={`rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-5 w-5 text-amber-600" />
                                            <h3 className="font-semibold text-gray-900">Financial Overview</h3>
                                        </div>
                                        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View Details</button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Revenue Breakdown */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Revenue Breakdown</h4>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                                            <span className="text-sm text-gray-700">Hotel</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{formatCurrency(dashboardData.financial.hotelRevenue)}</span>
                                                            <span className="text-xs text-gray-500">({Math.round((dashboardData.financial.hotelRevenue / dashboardData.financial.totalRevenue) * 100)}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                            <span className="text-sm text-gray-700">Restaurant</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{formatCurrency(dashboardData.financial.restaurantRevenue)}</span>
                                                            <span className="text-xs text-gray-500">({Math.round((dashboardData.financial.restaurantRevenue / dashboardData.financial.totalRevenue) * 100)}%)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-10 w-full rounded-lg overflow-hidden bg-gray-100 flex">
                                                    <div 
                                                        className="h-full bg-amber-500" 
                                                        style={{ width: `${(dashboardData.financial.hotelRevenue / dashboardData.financial.totalRevenue) * 100}%` }}
                                                    ></div>
                                                    <div 
                                                        className="h-full bg-blue-500" 
                                                        style={{ width: `${(dashboardData.financial.restaurantRevenue / dashboardData.financial.totalRevenue) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expenses by Category */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Expenses by Category</h4>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="space-y-3">
                                                    {dashboardData.financial.expensesByCategory.map((expense) => (
                                                        <div key={expense.category} className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">{expense.category}</span>
                                                            <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                                                        </div>
                                                    ))}
                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">Total Expenses</span>
                                                        <span className="font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                dashboardData.financial.expensesByCategory.reduce(
                                                                    (total, expense) => total + expense.amount, 0
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Inventory & Tasks Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Inventory Status */}
                                <motion.div 
                                    className={`rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShoppingBag className="h-5 w-5 text-amber-600" />
                                                <h3 className="font-semibold text-gray-900">Inventory Status</h3>
                                            </div>
                                            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All</button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                <span className="text-sm font-medium text-gray-900">Low Stock Items</span>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                                {dashboardData.inventory.lowStockItems} items
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Pending Orders</span>
                                                <span className="font-medium text-gray-900">{dashboardData.inventory.pendingOrders}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Recent Deliveries</span>
                                                <span className="font-medium text-gray-900">{dashboardData.inventory.recentDeliveries}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Total Items</span>
                                                <span className="font-medium text-gray-900">{dashboardData.inventory.totalItems}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tasks */}
                                <motion.div 
                                    className={`rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckSquare className="h-5 w-5 text-amber-600" />
                                                <h3 className="font-semibold text-gray-900">Tasks</h3>
                                            </div>
                                            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All</button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="rounded-lg bg-green-50 p-3 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Completed</p>
                                                <p className="text-lg font-semibold text-green-700">{dashboardData.tasks.completed}</p>
                                            </div>
                                            <div className="rounded-lg bg-amber-50 p-3 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Pending</p>
                                                <p className="text-lg font-semibold text-amber-700">{dashboardData.tasks.pending}</p>
                                            </div>
                                            <div className="rounded-lg bg-red-50 p-3 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Overdue</p>
                                                <p className="text-lg font-semibold text-red-700">{dashboardData.tasks.overdue}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-3">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Tasks</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                        <span className="text-sm text-gray-700">Room cleaning for 204</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Today</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                        <span className="text-sm text-gray-700">Restock bar inventory</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Completed</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                        <span className="text-sm text-gray-700">Maintenance for room 118</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Overdue</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Hotel Tab Content */}
                    {activeTab === "hotel" && (
                        <motion.div 
                            className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Hotel Management Dashboard</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Room Occupancy */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Room Occupancy Overview</h4>
                                            <div className="h-64 w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-amber-700 font-medium mb-2">Room Occupancy Chart</p>
                                                    <p className="text-sm text-gray-500">Interactive chart will be displayed here</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Room Availability Calendar</h4>
                                            <div className="h-64 w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-amber-700 font-medium mb-2">Room Calendar</p>
                                                    <p className="text-sm text-gray-500">Interactive calendar will be displayed here</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    <div className="space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">New Reservation</span>
                                                    <Calendar className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Check-in Guest</span>
                                                    <Users className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Check-out Guest</span>
                                                    <BedDouble className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Room Maintenance</span>
                                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Today's Overview</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Check-ins</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.hotel.upcomingCheckIns}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Check-outs</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.hotel.upcomingCheckOuts}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Room Cleaning</span>
                                                    <span className="font-medium text-gray-900">8</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">VIP Guests</span>
                                                    <span className="font-medium text-gray-900">2</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Restaurant Tab Content */}
                    {activeTab === "restaurant" && (
                        <motion.div 
                            className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Restaurant Management Dashboard</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Sales Overview */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Sales Overview</h4>
                                            <div className="h-64 w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-amber-700 font-medium mb-2">Sales Chart</p>
                                                    <p className="text-sm text-gray-500">Interactive chart will be displayed here</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                                <h4 className="font-medium text-gray-900 mb-4">Top Selling Items</h4>
                                                <div className="space-y-3">
                                                    {dashboardData.restaurant.popularDishes.map((dish, index) => (
                                                        <div key={dish.name} className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-medium text-sm">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                                                                <p className="text-xs text-gray-500">{dish.orders} orders</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                                <h4 className="font-medium text-gray-900 mb-4">Table Reservations</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">Today's Reservations</span>
                                                        <span className="font-medium text-gray-900">{dashboardData.restaurant.reservations}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">Available Tables</span>
                                                        <span className="font-medium text-gray-900">8</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">VIP Reservations</span>
                                                        <span className="font-medium text-gray-900">3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    <div className="space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">New Reservation</span>
                                                    <Calendar className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Create Order</span>
                                                    <UtensilsCrossed className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Manage Menu</span>
                                                    <Coffee className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Kitchen Status</span>
                                                    <Activity className="h-5 w-5 text-amber-600" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Today's Overview</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Total Orders</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.restaurant.totalOrders}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Avg. Order Value</span>
                                                    <span className="font-medium text-gray-900">{formatCurrency(dashboardData.restaurant.averageOrderValue)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Table Turnover</span>
                                                    <span className="font-medium text-gray-900">4.2 / day</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Financial Tab Content */}
                    {activeTab === "financial" && (
                        <motion.div 
                            className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Financial Management Dashboard</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Revenue Overview */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Revenue Overview</h4>
                                            <div className="h-64 w-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-amber-700 font-medium mb-2">Revenue Chart</p>
                                                    <p className="text-sm text-gray-500">Interactive chart will be displayed here</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                                <h4 className="font-medium text-gray-900 mb-4">Revenue Breakdown</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                                            <span className="text-sm text-gray-700">Hotel</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{formatCurrency(dashboardData.financial.hotelRevenue)}</span>
                                                            <span className="text-xs text-gray-500">({Math.round((dashboardData.financial.hotelRevenue / dashboardData.financial.totalRevenue) * 100)}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                            <span className="text-sm text-gray-700">Restaurant</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{formatCurrency(dashboardData.financial.restaurantRevenue)}</span>
                                                            <span className="text-xs text-gray-500">({Math.round((dashboardData.financial.restaurantRevenue / dashboardData.financial.totalRevenue) * 100)}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 h-10 w-full rounded-lg overflow-hidden bg-gray-100 flex">
                                                        <div 
                                                            className="h-full bg-amber-500" 
                                                            style={{ width: `${(dashboardData.financial.hotelRevenue / dashboardData.financial.totalRevenue) * 100}%` }}
                                                        ></div>
                                                        <div 
                                                            className="h-full bg-blue-500" 
                                                            style={{ width: `${(dashboardData.financial.restaurantRevenue / dashboardData.financial.totalRevenue) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                                <h4 className="font-medium text-gray-900 mb-4">Expenses Overview</h4>
                                                <div className="space-y-3">
                                                    {dashboardData.financial.expensesByCategory.map((expense) => (
                                                        <div key={expense.category} className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">{expense.category}</span>
                                                            <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                                                        </div>
                                                    ))}
                                                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">Total</span>
                                                        <span className="font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                dashboardData.financial.expensesByCategory.reduce(
                                                                    (total, expense) => total + expense.amount, 0
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    <div className="space-y-6">
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Generate Report</span>
                                                    <BarChart className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Process Payment</span>
                                                    <CreditCard className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Manage Invoices</span>
                                                    <DollarSign className="h-5 w-5 text-amber-600" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                                                    <span className="font-medium text-amber-700">Budget Planning</span>
                                                    <PieChart className="h-5 w-5 text-amber-600" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-4">Financial Status</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Pending Payments</span>
                                                    <span className="font-medium text-gray-900">{dashboardData.financial.pendingPayments}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Pending Amount</span>
                                                    <span className="font-medium text-gray-900">{formatCurrency(dashboardData.financial.pendingAmount)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Profit Margin</span>
                                                    <span className="font-medium text-gray-900">24.8%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
        </ClientLayout>
    );
}
