import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import ClientLayout from "@/Layouts/ClientLayout";
import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { UserCircle, Calendar, Clock, Users, UserCog, UserPen, BookOpen, DollarSign, TrendingUp, Award, UserX, Bed, Utensils, Package, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
    const { userCounts } = usePage().props;

    return (
        <div className="mx-auto max-w-7xl">
            <Head title="SuperAdmin Dashboard" />
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-xl mb-8 p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center">
                        <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                            <UserCog className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, SuperAdmin!</h1>
                            <p className="text-amber-100">Manage your hotel operations, users, and system settings all in one place.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
            </div>

            {/* Stats Cards */}
            <div className="w-full z-0 mb-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* SuperAdmin Stats Cards */}
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-amber-800 mb-1">Total Rooms</p>
                                <p className="text-3xl font-bold text-amber-900">{userCounts?.rooms || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-md">
                                <Bed className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-200 opacity-20"></div>
                    </div>

                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-blue-800 mb-1">Total Clients</p>
                                <p className="text-3xl font-bold text-blue-900">{userCounts?.clients || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-md">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200 opacity-20"></div>
                    </div>
                    
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-green-800 mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-green-900">₱{userCounts?.revenue || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-md">
                                <CreditCard className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-green-200 opacity-20"></div>
                    </div>

                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-purple-800 mb-1">Menu Items</p>
                                <p className="text-3xl font-bold text-purple-900">{userCounts?.menuItems || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-md">
                                <Utensils className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-200 opacity-20"></div>
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
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-xl mb-8 p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center">
                        <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                            <UserCog className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
                            <p className="text-blue-100">Manage hotel operations and monitor system performance.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
            </div>

            {/* Stats Cards - Similar to SuperAdmin but with admin-specific metrics */}
            <div className="w-full z-0 mb-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Admin-specific stats */}
                    {/* You can customize these cards for admin-specific metrics */}
                </div>
            </div>
        </div>
    );
};

const EmployeeDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Employee Dashboard" />
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-xl shadow-xl mb-8 p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center">
                        <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                            <UserPen className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                            <p className="text-green-100">Track your tasks, schedules, and guest requests.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
            </div>

            {/* Employee-specific dashboard content */}
            {/* Add employee-specific components here */}
        </div>
    );
};

const ClientDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Client Dashboard" />
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-xl shadow-xl mb-8 p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center">
                        <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                            <UserCircle className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                            <p className="text-purple-100">View your bookings, orders, and hotel services.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
            </div>

            {/* Client-specific dashboard content */}
            {/* Add client-specific components here */}
        </div>
    );
};

const SupplierDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl">
            <Head title="Supplier Dashboard" />
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 rounded-xl shadow-xl mb-8 p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center">
                        <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                            <Package className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                            <p className="text-yellow-100">Manage your supplies, orders, and delivery schedules.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
            </div>

            {/* Supplier-specific dashboard content */}
            {/* Add supplier-specific components here */}
        </div>
    );
};

export default function Dashboard() {
    const { auth } = usePage().props;
    const role = auth.user.role.toLowerCase();

    // Determine which layout and dashboard content to use based on user role
    let Layout, DashboardContent;
    
    switch (role) {
        case 'superadmin':
            Layout = SuperAdminLayout;
            DashboardContent = SuperAdminDashboard;
            break;
        case 'admin':
            Layout = AdminLayout;
            DashboardContent = AdminDashboard;
            break;
        case 'employee':
            Layout = EmployeeLayout;
            DashboardContent = EmployeeDashboard;
            break;
        case 'client':
            Layout = ClientLayout;
            DashboardContent = ClientDashboard;
            break;
        case 'supplier':
            Layout = SupplierLayout;
            DashboardContent = SupplierDashboard;
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