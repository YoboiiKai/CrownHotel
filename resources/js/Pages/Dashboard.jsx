import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import ClientLayout from "@/Layouts/ClientLayout";
import KitchenLayout from "@/Layouts/KitchenLayout";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import {
    UserCircle,
    Calendar,
    Clock,
    Users,
    UserCog,
    LayoutDashboard,
    UserPen,
    BookOpen,
    DollarSign,
    TrendingUp,
    Award,
    UserX,
    Bed,
    Utensils,
    Package,
    CreditCard,
    Home,
    Star,
    Sparkles,
    Coffee,
    Wifi,
    Bath,
    Sunrise,
    Wind,
    Wine,
    Car,
    Heart,
    Phone,
    MapPin,
    ChevronRight,
    Bell,
    Bookmark,
    FileText,
    Cog,
    BarChart4,
    TrendingDown,
    Plus,
    Eye,
    ChevronLeft,
    PlusCircle,
    ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const SuperAdminDashboard = () => {
    const { userCounts } = usePage().props;

    return (
        <div className="mx-auto max-w-7xl">
            <Head title="SuperAdmin Dashboard" />

            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        CROWN OF THE ORIENT
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome back,{" "}
                                    <span className="text-[#DEB887]">
                                        SuperAdmin
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Manage your hotel operations, users, and
                                    system settings all in one place. <span className="hidden sm:inline">Monitor
                                    performance metrics and ensure exceptional
                                    service quality.</span>
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                        <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">System Settings</span>
                                    </button>
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">View Reports</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Cog className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        System Overview
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {/* Room Occupancy Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Bed className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Room Occupancy
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.occupancyRate || "78%"}
                                </p>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+12%</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[78%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Bookings Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Total Bookings
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.bookings || "245"}
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    bookings
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+32</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Revenue
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱{userCounts?.monthlyRevenue || "1.2M"}
                                </p>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+8.5%</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[85%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Users Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Active Users
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.activeUsers || "128"}
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    users
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        Staff & Clients
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                        <span>24 / 104</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[70%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Rating Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Star className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Feedback
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    4.7
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    rating
                                </span>
                            </div>
                            <div className="mt-2 flex">
                                {Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`h-3.5 w-3.5 ${
                                                index < 4
                                                    ? "text-[#DEB887] fill-[#DEB887]"
                                                    : index === 4
                                                    ? "text-[#DEB887] fill-[#DEB887]/70"
                                                    : "text-[#DEB887]/30"
                                            }`}
                                        />
                                    ))}
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+0.3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 p-6">
                {/* Elegant Header */}
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Transaction Overview
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Breakdown Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Revenue Breakdown
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.24M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total revenue
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Room Bookings
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱845,200</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (68%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[68%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Restaurant
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱235,400</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (19%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[19%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Additional Services
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱162,300</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (13%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[13%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Channels Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Booking Channels
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    245
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total bookings
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Direct Website
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>142</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (58%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[58%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        OTA Partners
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>76</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (31%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[31%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Corporate Accounts
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>27</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (11%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[11%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <CreditCard className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Payment Methods
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.24M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total payments
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Credit Card
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱782,450</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (63%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[63%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Online Payment
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱348,200</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (28%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[28%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Cash
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱112,250</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (9%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[9%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="mt-6 bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="p-4 border-b border-[#DEB887]/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                Recent Transactions
                            </h3>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-[#8B5A2B] hover:text-[#5D3A1F] bg-[#F5EFE7] hover:bg-[#DEB887]/20 rounded-full transition-colors duration-200">
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#DEB887]/20">
                            <thead className="bg-[#F5EFE7]">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Transaction ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Client
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#DEB887]/20">
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8294
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Maria Santos
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Room Booking
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱24,500
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 14, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8293
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        John Davis
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Restaurant
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱3,850
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 14, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8292
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Robert Chen
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Spa Service
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱5,200
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 13, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8291
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Sarah Kim
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Room Booking
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱18,750
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 13, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* System Functions Overview */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        System Functions
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* User Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        User Management
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    248
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    users
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Staff
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>42</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (17%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[17%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Clients
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>206</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (83%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[83%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Users className="h-3.5 w-3.5 mr-1.5" /> Manage
                                Users
                            </button>
                        </div>
                    </div>

                    {/* Inventory Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Inventory
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    1,245
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    items
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        In Stock
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>1,225</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (98%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[98%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Low Stock
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                            8
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-300 w-[2%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Package className="h-3.5 w-3.5 mr-1.5" /> View
                                Inventory
                            </button>
                        </div>
                    </div>

                    {/* Room Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Bed className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Rooms
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    120
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    rooms
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Occupied
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>94</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (78%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[78%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Maintenance
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>3</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (2.5%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 w-[2.5%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Bed className="h-3.5 w-3.5 mr-1.5" /> Manage
                                Rooms
                            </button>
                        </div>
                    </div>

                    {/* Financial Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Finance
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.2M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    revenue
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Revenue (MTD)
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱1.2M</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[100%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Expenses (MTD)
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱450K</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (37.5%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[37.5%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <FileText className="h-3.5 w-3.5 mr-1.5" />{" "}
                                Financial Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { userCounts } = usePage().props;

    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Admin Dashboard" />

            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        CROWN OF THE ORIENT
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome back,{" "}
                                    <span className="text-[#DEB887]">
                                        Admin
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Manage your hotel operations, users, and
                                    system settings all in one place. <span className="hidden sm:inline">Monitor
                                    performance metrics and ensure exceptional
                                    service quality.</span>
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                        <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">System Settings</span>
                                    </button>
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">View Reports</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Cog className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        System Overview
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {/* Room Occupancy Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Bed className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Room Occupancy
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.occupancyRate || "78%"}
                                </p>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+12%</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[78%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Bookings Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Total Bookings
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.bookings || "245"}
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    bookings
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+32</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Revenue
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱{userCounts?.monthlyRevenue || "1.2M"}
                                </p>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+8.5%</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[85%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Users Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Active Users
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    {userCounts?.activeUsers || "128"}
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    users
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        Staff & Clients
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                        <span>24 / 104</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[70%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Rating Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Star className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Feedback
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    4.7
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    rating
                                </span>
                            </div>
                            <div className="mt-2 flex">
                                {Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`h-3.5 w-3.5 ${
                                                index < 4
                                                    ? "text-[#DEB887] fill-[#DEB887]"
                                                    : index === 4
                                                    ? "text-[#DEB887] fill-[#DEB887]/70"
                                                    : "text-[#DEB887]/30"
                                            }`}
                                        />
                                    ))}
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        This month
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+0.3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 p-6">
                {/* Elegant Header */}
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Transaction Overview
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Breakdown Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Revenue Breakdown
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.24M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total revenue
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Room Bookings
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱845,200</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (68%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[68%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Restaurant
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱235,400</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (19%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[19%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Additional Services
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱162,300</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (13%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[13%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Channels Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Booking Channels
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    245
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total bookings
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Direct Website
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>142</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (58%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[58%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        OTA Partners
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>76</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (31%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[31%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Corporate Accounts
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>27</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (11%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[11%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Card */}
                    <div className="bg-gradient-to-br from-white to-[#F5EFE7] rounded-xl border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <CreditCard className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Payment Methods
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.24M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    total payments
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Credit Card
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱782,450</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (63%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[63%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Online Payment
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱348,200</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (28%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[28%]"></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Cash
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱112,250</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (9%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[9%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="mt-6 bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="p-4 border-b border-[#DEB887]/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                Recent Transactions
                            </h3>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-[#8B5A2B] hover:text-[#5D3A1F] bg-[#F5EFE7] hover:bg-[#DEB887]/20 rounded-full transition-colors duration-200">
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#DEB887]/20">
                            <thead className="bg-[#F5EFE7]">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Transaction ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Client
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#DEB887]/20">
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8294
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Maria Santos
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Room Booking
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱24,500
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 14, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8293
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        John Davis
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Restaurant
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱3,850
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 14, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8292
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Robert Chen
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Spa Service
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱5,200
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 13, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#5D3A1F]">
                                        #TRX-8291
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Sarah Kim
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        Room Booking
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        ₱18,750
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6B4226]">
                                        May 13, 2025
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* System Functions Overview */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        System Functions
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* User Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        User Management
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    248
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    users
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Staff
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>42</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (17%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[17%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Clients
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>206</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (83%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[83%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Users className="h-3.5 w-3.5 mr-1.5" /> Manage
                                Users
                            </button>
                        </div>
                    </div>

                    {/* Inventory Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Inventory
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    1,245
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    items
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        In Stock
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>1,225</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (98%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[98%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Low Stock
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                            8
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-300 w-[2%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Package className="h-3.5 w-3.5 mr-1.5" /> View
                                Inventory
                            </button>
                        </div>
                    </div>

                    {/* Room Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Bed className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Rooms
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    120
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    rooms
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Occupied
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>94</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (78%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[78%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Maintenance
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>3</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (2.5%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 w-[2.5%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <Bed className="h-3.5 w-3.5 mr-1.5" /> Manage
                                Rooms
                            </button>
                        </div>
                    </div>

                    {/* Financial Management */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Finance
                                    </h3>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE7] text-[#A67C52] hover:bg-[#A67C52]/10 transition-colors cursor-pointer">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    ₱1.2M
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    revenue
                                </span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Revenue (MTD)
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱1.2M</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[100%]"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#6B4226]/80">
                                        Expenses (MTD)
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#A67C52]">
                                        <span>₱450K</span>
                                        <span className="text-[10px] text-[#A67C52]/70">
                                            (37.5%)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[37.5%]"></div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white text-xs font-medium hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-300 flex items-center justify-center">
                                <FileText className="h-3.5 w-3.5 mr-1.5" />{" "}
                                Financial Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmployeeDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Employee Dashboard" />
            
            {/*Hero Section*/}
            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        STAFF PORTAL
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome back,{" "}
                                    <span className="text-[#DEB887]">
                                        Employee
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Track your tasks, manage guest requests, and
                                    deliver exceptional service at Crown of the
                                    Orient. <span className="hidden sm:inline">Your dedication makes our hotel
                                    shine.</span>
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Today's Tasks</span>
                                    </button>
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Guest Requests</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Employee Stats */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Task Overview
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Today's Tasks Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Today's Tasks
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    7
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    tasks
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        Completion rate
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-[#A67C52]">
                                        <span>3/7 completed</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[43%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Award className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Completed Tasks
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    3
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    completed
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        Today's progress
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-green-500">
                                        <TrendingUp className="h-2.5 w-2.5" />
                                        <span>+2 since morning</span>
                                    </div>
                                </div>
                                <div className="mt-1 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-[43%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guest Requests Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <UserCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Guest Requests
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-2xl font-bold text-[#5D3A1F]">
                                    4
                                </p>
                                <span className="ml-1 text-xs text-[#6B4226]/70">
                                    requests
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-[#6B4226]/70">
                                        Priority level
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">2 urgent</span>
                                    </div>
                                </div>
                                <div className="mt-1 flex items-center">
                                    <div className="h-1 w-full flex">
                                        <div className="h-full bg-red-500 rounded-l-full" style={{ width: '50%' }}></div>
                                        <div className="h-full bg-amber-500" style={{ width: '25%' }}></div>
                                        <div className="h-full bg-green-500 rounded-r-full" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Task List */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Today's Tasks
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="p-4 border-b border-[#DEB887]/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                Task Schedule
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                Completed: 3
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                Pending: 4
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-[#DEB887]/10">
                        <div className="flex items-center p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 h-6 w-6 rounded-full border-2 border-[#A67C52] flex-shrink-0 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full bg-[#A67C52] opacity-0"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-[#5D3A1F]">
                                    Clean rooms 201-205
                                </p>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        9:00 AM - 11:00 AM
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Bed className="h-3 w-3 mr-1" />
                                        Standard Rooms
                                    </div>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                                Pending
                            </span>
                        </div>

                        <div className="flex items-center p-4 bg-[#F5EFE7]/20 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 h-6 w-6 rounded-full border-2 border-[#A67C52] flex-shrink-0 bg-[#A67C52] flex items-center justify-center">
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-[#5D3A1F]">
                                    Deliver room service to 304
                                </p>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        8:30 AM - 8:45 AM
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Utensils className="h-3 w-3 mr-1" />
                                        Breakfast
                                    </div>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Completed
                            </span>
                        </div>

                        <div className="flex items-center p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 h-6 w-6 rounded-full border-2 border-[#A67C52] flex-shrink-0 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full bg-[#A67C52] opacity-0"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-[#5D3A1F]">
                                    Restock mini bar in VIP suites
                                </p>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        1:00 PM - 2:30 PM
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Wine className="h-3 w-3 mr-1" />
                                        VIP Suites
                                    </div>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                                Pending
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Schedule */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Your Schedule
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                <div className="bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="p-4 border-b border-[#DEB887]/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                Today's Schedule
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                                <Clock className="h-3 w-3 mr-1" />
                                May 19, 2025
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-[#DEB887]/10">
                        <div className="flex items-center p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 flex-shrink-0">
                                <Clock className="h-5 w-5 text-[#A67C52]" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center">
                                    <p className="text-sm font-medium text-[#5D3A1F]">
                                        Morning Briefing - 8:00 AM
                                    </p>
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        Daily
                                    </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Home className="h-3 w-3 mr-1" />
                                        Staff Room - Ground Floor
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        30 min
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-[#F5EFE7]/20 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 flex-shrink-0">
                                <Clock className="h-5 w-5 text-[#A67C52]" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center">
                                    <p className="text-sm font-medium text-[#5D3A1F]">
                                        Lunch Break - 12:00 PM
                                    </p>
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                        Break
                                    </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Utensils className="h-3 w-3 mr-1" />
                                        Staff Cafeteria
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        60 min
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 flex-shrink-0">
                                <Clock className="h-5 w-5 text-[#A67C52]" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center">
                                    <p className="text-sm font-medium text-[#5D3A1F]">
                                        VIP Guest Check-in - 3:00 PM
                                    </p>
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                        Priority
                                    </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <UserCircle className="h-3 w-3 mr-1" />
                                        Front Desk - Assist with luggage
                                    </div>
                                    <div className="ml-3 flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="h-3 w-3 mr-1" />
                                        45 min
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Client Dashboard" />
            
            {/* Hero Section */}
            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        GUEST PORTAL
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome back, <span className="text-[#DEB887]">Guest</span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Experience luxury and comfort during your stay.
                                    <span className="hidden sm:inline"> Access all our premium services and amenities
                                    through your personalized dashboard.</span>
                                </p>
                                
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Request Service</span>
                                    </button>
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Room Details</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-wrap gap-3 mt-4 md:mt-0 w-full md:w-auto justify-between sm:justify-start">
                                <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">
                                        Your Stay
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                            4
                                        </span>
                                        <span className="text-xs sm:text-sm text-white/70">
                                            Nights
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">
                                        Loyalty Status
                                    </p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                        Gold
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Current Booking */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Bed className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Your Current Stay
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                    <div className="px-3 py-1 rounded-full bg-[#A67C52]/10 text-[#8B5A2B] text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> 3 nights remaining
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Room Image */}
                        <div className="w-full lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                alt="Deluxe King Suite"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#8B5A2B]/80 text-white text-xs font-medium backdrop-blur-sm">
                                Premium Room
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="p-6 lg:p-8 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-[#5D3A1F]">
                                    Deluxe King Suite
                                </h3>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-[#DEB887] fill-[#DEB887]" />
                                    <Star className="w-4 h-4 text-[#DEB887] fill-[#DEB887]" />
                                    <Star className="w-4 h-4 text-[#DEB887] fill-[#DEB887]" />
                                    <Star className="w-4 h-4 text-[#DEB887] fill-[#DEB887]" />
                                    <Star className="w-4 h-4 text-[#DEB887] fill-[#DEB887]" />
                                </div>
                            </div>

                            {/* Room Features */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-[#A67C52]/10 text-[#8B5A2B] text-xs font-medium flex items-center">
                                    <Wifi className="w-3 h-3 mr-1" /> High-Speed
                                    WiFi
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[#A67C52]/10 text-[#8B5A2B] text-xs font-medium flex items-center">
                                    <Bath className="w-3 h-3 mr-1" /> Luxury
                                    Bathroom
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[#A67C52]/10 text-[#8B5A2B] text-xs font-medium flex items-center">
                                    <Sunrise className="w-3 h-3 mr-1" /> Ocean View
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[#A67C52]/10 text-[#8B5A2B] text-xs font-medium flex items-center">
                                    <Coffee className="w-3 h-3 mr-1" /> Mini Bar
                                </span>
                            </div>

                            {/* Stay Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                    <p className="text-xs text-[#6B4226]/70 mb-1">
                                        Check-in
                                    </p>
                                    <p className="text-sm font-medium text-[#5D3A1F] flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-[#8B5A2B]" />
                                        May 14, 2025
                                    </p>
                                </div>
                                <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                    <p className="text-xs text-[#6B4226]/70 mb-1">
                                        Check-out
                                    </p>
                                    <p className="text-sm font-medium text-[#5D3A1F] flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-[#8B5A2B]" />
                                        May 18, 2025
                                    </p>
                                </div>
                                <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                    <p className="text-xs text-[#6B4226]/70 mb-1">
                                        Room Number
                                    </p>
                                    <p className="text-sm font-medium text-[#5D3A1F] flex items-center">
                                        <MapPin className="w-4 h-4 mr-1 text-[#8B5A2B]" />
                                        Suite 302
                                    </p>
                                </div>
                                <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                    <p className="text-xs text-[#6B4226]/70 mb-1">
                                        Guests
                                    </p>
                                    <p className="text-sm font-medium text-[#5D3A1F] flex items-center">
                                        <Users className="w-4 h-4 mr-1 text-[#8B5A2B]" />
                                        2 Adults
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> Extend
                                    Stay
                                </button>
                                <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[#A67C52] text-[#6B4226] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                                    <Bell className="w-4 h-4 mr-2" /> Request
                                    Service
                                </button>
                                <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[#A67C52] text-[#6B4226] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                                    <Bookmark className="w-4 h-4 mr-2" /> Room
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Services */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Premium Hotel Services
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                    <button className="text-sm font-medium text-[#8B5A2B] flex items-center hover:text-[#A67C52] transition-colors">
                        View All Services{" "}
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Room Service Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Utensils className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Room Service
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    24/7
                                </span>
                            </div>
                            <div className="mt-3 text-xs text-[#6B4226]/70">
                                <p>Gourmet dining delivered to your room anytime, day or night.</p>
                            </div>
                            <div className="mt-3">
                                <button className="w-full py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                                    <Phone className="h-3 w-3 mr-1" /> Order Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Spa & Wellness Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Heart className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Spa & Wellness
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Premium
                                </span>
                            </div>
                            <div className="mt-3 text-xs text-[#6B4226]/70">
                                <p>Rejuvenate your senses with our luxury spa treatments and wellness services.</p>
                            </div>
                            <div className="mt-3">
                                <button className="w-full py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                                    <Calendar className="h-3 w-3 mr-1" /> Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Concierge Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Concierge
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    VIP
                                </span>
                            </div>
                            <div className="mt-3 text-xs text-[#6B4226]/70">
                                <p>Personalized assistance for all your needs during your stay with us.</p>
                            </div>
                            <div className="mt-3">
                                <button className="w-full py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                                    <Bell className="h-3 w-3 mr-1" /> Request Assistance
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transportation Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Car className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Transportation
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Luxury
                                </span>
                            </div>
                            <div className="mt-3 text-xs text-[#6B4226]/70">
                                <p>Premium car service for airport transfers and city exploration.</p>
                            </div>
                            <div className="mt-3">
                                <button className="w-full py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                                    <MapPin className="h-3 w-3 mr-1" /> Book Transport
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Recent Orders & Services
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                    <button className="text-sm font-medium text-[#8B5A2B] flex items-center hover:text-[#A67C52] transition-colors">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                
                <div className="bg-white rounded-xl border border-[#DEB887]/30 shadow-md overflow-hidden">
                    <div className="p-4 border-b border-[#DEB887]/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                Order History
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                                <Clock className="h-3 w-3 mr-1" />
                                May 19, 2025
                            </span>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-[#DEB887]/10">
                        {/* Order 1 - Breakfast */}
                        <div className="flex p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 border border-[#DEB887]/20">
                                <img
                                    src="https://images.unsplash.com/photo-1533089860892-a9b969df67e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Breakfast"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-[#5D3A1F] flex items-center">
                                        Breakfast - American Set
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                                            Delivered
                                        </span>
                                    </h3>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm">
                                        ₱850
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Utensils className="w-3 h-3 mr-1 text-[#A67C52]" />
                                        Room Service
                                    </div>
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Today at 8:15 AM
                                    </div>
                                </div>
                                <div className="mt-3 flex">
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center mr-2">
                                        <ShoppingBag className="w-3 h-3 mr-1" /> Order Again
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg border border-[#A67C52] text-[#6B4226] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                                        <FileText className="w-3 h-3 mr-1" /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order 2 - Laundry */}
                        <div className="flex p-4 bg-[#F5EFE7]/20 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 border border-[#DEB887]/20">
                                <img
                                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                                    alt="Laundry Service"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-[#5D3A1F] flex items-center">
                                        Premium Laundry Service
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                            Completed
                                        </span>
                                    </h3>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm">
                                        ₱450
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Package className="w-3 h-3 mr-1 text-[#A67C52]" />
                                        Housekeeping
                                    </div>
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Yesterday
                                    </div>
                                </div>
                                <div className="mt-3 flex">
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center mr-2">
                                        <ShoppingBag className="w-3 h-3 mr-1" /> Order Again
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg border border-[#A67C52] text-[#6B4226] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                                        <FileText className="w-3 h-3 mr-1" /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order 3 - Spa */}
                        <div className="flex p-4 hover:bg-[#F5EFE7]/30 transition-colors duration-200">
                            <div className="mr-4 w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 border border-[#DEB887]/20">
                                <img
                                    src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Spa Treatment"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-[#5D3A1F] flex items-center">
                                        Aromatherapy Massage
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                                            Upcoming
                                        </span>
                                    </h3>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm">
                                        ₱1,200
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Heart className="w-3 h-3 mr-1 text-[#A67C52]" />
                                        Spa & Wellness
                                    </div>
                                    <div className="flex items-center text-xs text-[#6B4226]/70">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        Tomorrow, 2:00 PM
                                    </div>
                                </div>
                                <div className="mt-3 flex">
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center mr-2">
                                        <Calendar className="w-3 h-3 mr-1" /> Reschedule
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium rounded-lg border border-[#A67C52] text-[#6B4226] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                                        <FileText className="w-3 h-3 mr-1" /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KitchenDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Kitchen Dashboard" />

            {/* Hero Section */}
            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        KITCHEN PORTAL
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome back, <span className="text-[#DEB887]">Chef</span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Manage your kitchen operations, menu items, and food orders efficiently.
                                    <span className="hidden sm:inline"> Your culinary excellence drives our guest satisfaction and dining experience.</span>
                                </p>
                                
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                                        <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Manage Orders</span>
                                    </button>
                                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center">
                                        <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Update Menu</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-wrap gap-3 mt-4 md:mt-0 w-full md:w-auto justify-between sm:justify-start">
                                <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">
                                        Pending Orders
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                            6
                                        </span>
                                        <span className="text-xs sm:text-sm text-white/70">
                                            Orders
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                    <p className="text-xs text-white/70 mb-1">
                                        Today's Specials
                                    </p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Kitchen Stats */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <BarChart4 className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Kitchen Performance
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pending Orders Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Utensils className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Pending Orders
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Today
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-[#5D3A1F]">6</p>
                                    <div className="flex items-center text-xs text-green-600">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        <span>12% from yesterday</span>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-[#DEB887]/20">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Completed Orders Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Award className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Completed Orders
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Today
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-[#5D3A1F]">32</p>
                                    <div className="flex items-center text-xs text-green-600">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        <span>8% from yesterday</span>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-[#DEB887]/20">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Coffee className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Menu Items
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Total
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-[#5D3A1F]">48</p>
                                    <div className="flex items-center text-xs text-blue-600">
                                        <Plus className="h-3 w-3 mr-1" />
                                        <span>3 new this week</span>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-[#DEB887]/20">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '90%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Dishes Card */}
                    <div className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                                        <Star className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#5D3A1F]">
                                        Special Dishes
                                    </h3>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#A67C52]/10 text-[#8B5A2B]">
                                    Featured
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-[#5D3A1F]">12</p>
                                    <div className="flex items-center text-xs text-amber-600">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        <span>4.8 avg rating</span>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 w-full rounded-full bg-[#DEB887]/20">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Food Order Management */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Utensils className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Active Food Orders
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                    <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center">
                        <Eye className="w-4 h-4 mr-1.5" />
                        View All
                    </button>
                </div>
                
                <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#A67C52]/20">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10">
                                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-[#5D3A1F]">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-[#5D3A1F]">
                                        Items
                                    </th>
                                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-[#5D3A1F]">
                                        Table
                                    </th>
                                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-[#5D3A1F]">
                                        Time
                                    </th>
                                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-[#5D3A1F]">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-[#5D3A1F]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#A67C52]/10">
                                <tr className="hover:bg-[#F5EFE7] transition-colors duration-150">
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#5D3A1F]">
                                        #FO-1082
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Grilled Salmon</span>
                                            <span className="text-xs text-[#6B4226]/70">Caesar Salad, Lemon Sauce</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                                            Table 12
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1.5 text-[#A67C52]" />
                                            10:15 AM
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                            Preparing
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                                        <button className="p-1.5 rounded-lg text-[#5D3A1F] hover:bg-[#A67C52]/10 transition-colors duration-150">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#F5EFE7] transition-colors duration-150">
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#5D3A1F]">
                                        #FO-1081
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Beef Wellington</span>
                                            <span className="text-xs text-[#6B4226]/70">Tiramisu, Red Wine</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                                            Table 8
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1.5 text-[#A67C52]" />
                                            10:08 AM
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                                            Ready to Serve
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                                        <button className="p-1.5 rounded-lg text-[#5D3A1F] hover:bg-[#A67C52]/10 transition-colors duration-150">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#F5EFE7] transition-colors duration-150">
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#5D3A1F]">
                                        #FO-1080
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Eggs Benedict</span>
                                            <span className="text-xs text-[#6B4226]/70">Fresh Fruit, Orange Juice</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                                            Table 5
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B4226]">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1.5 text-[#A67C52]" />
                                            9:45 AM
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                                        <span className="inline-flex rounded-full bg-[#A67C52]/20 px-2.5 py-1 text-xs font-semibold text-[#6B4226]">
                                            Served
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                                        <button className="p-1.5 rounded-lg text-[#5D3A1F] hover:bg-[#A67C52]/10 transition-colors duration-150">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gradient-to-r from-[#A67C52]/5 to-[#8B5A2B]/5 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center text-sm text-[#6B4226]">
                            <span>Showing 3 of 12 orders</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-1.5 rounded-lg text-[#5D3A1F] hover:bg-[#A67C52]/10 transition-colors duration-150">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 rounded-lg text-[#5D3A1F] hover:bg-[#A67C52]/10 transition-colors duration-150">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Item Status */}
            <div className="relative z-10 p-6">
                <div className="flex items-center mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-3">
                        <Coffee className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#5D3A1F]">
                        Popular Menu Items
                    </h2>
                    <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#A67C52] to-transparent"></div>
                    <button className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#A67C52]/10 transition-all duration-300 flex items-center">
                        <PlusCircle className="w-4 h-4 mr-1.5" />
                        Add Item
                    </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Grilled Salmon */}
                    <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-24 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 shadow-sm">
                                    Available
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-[#5D3A1F]">
                                    Grilled Salmon
                                </h3>
                                <div className="flex items-center">
                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                    <span className="text-xs font-medium text-[#6B4226] ml-1">4.8</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-[#6B4226]">
                                    <ShoppingBag className="h-3 w-3 mr-1 text-[#A67C52]" />
                                    <span>12 orders today</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <div className="w-6 h-1.5 rounded-full bg-[#DEB887]/20">
                                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Beef Wellington */}
                    <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-24 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 shadow-sm">
                                    Available
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-[#5D3A1F]">
                                    Beef Wellington
                                </h3>
                                <div className="flex items-center">
                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                    <span className="text-xs font-medium text-[#6B4226] ml-1">4.9</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-[#6B4226]">
                                    <ShoppingBag className="h-3 w-3 mr-1 text-[#A67C52]" />
                                    <span>8 orders today</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <div className="w-6 h-1.5 rounded-full bg-[#DEB887]/20">
                                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chocolate Soufflé */}
                    <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-24 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1611329695518-1763fc1fac1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 shadow-sm">
                                    Sold Out
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-[#5D3A1F]">
                                    Chocolate Soufflé
                                </h3>
                                <div className="flex items-center">
                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                    <span className="text-xs font-medium text-[#6B4226] ml-1">4.7</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-[#6B4226]">
                                    <ShoppingBag className="h-3 w-3 mr-1 text-[#A67C52]" />
                                    <span>15 orders today</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <div className="w-6 h-1.5 rounded-full bg-[#DEB887]/20">
                                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eggs Benedict */}
                    <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-24 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 shadow-sm">
                                    Available
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-[#5D3A1F]">
                                    Eggs Benedict
                                </h3>
                                <div className="flex items-center">
                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                    <span className="text-xs font-medium text-[#6B4226] ml-1">4.6</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-[#6B4226]">
                                    <ShoppingBag className="h-3 w-3 mr-1 text-[#A67C52]" />
                                    <span>10 orders today</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <div className="w-6 h-1.5 rounded-full bg-[#DEB887]/20">
                                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { auth } = usePage().props;
    const role = auth.user.role.toLowerCase();

    // Determine which layout and dashboard content to use based on user role
    let Layout, DashboardContent;

    switch (role) {
        case "superadmin":
            Layout = SuperAdminLayout;
            DashboardContent = SuperAdminDashboard;
            break;
        case "admin":
            Layout = AdminLayout;
            DashboardContent = AdminDashboard;
            break;
        case "employee":
            Layout = EmployeeLayout;
            DashboardContent = EmployeeDashboard;
            break;
        case "client":
            Layout = ClientLayout;
            DashboardContent = ClientDashboard;
            break;
        case "kitchen":
            Layout = KitchenLayout;
            DashboardContent = KitchenDashboard;
            break;
        default:
            // Fallback to client layout if role is not recognized
            Layout = ClientLayout;
            DashboardContent = ClientDashboard;
    }

    return (
        <Layout>
            <Head title="Dashboard" />
            <DashboardContent />
        </Layout>
    );
}
