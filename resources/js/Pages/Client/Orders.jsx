import React, { useState, useEffect } from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import { Head } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChevronsRight, 
  Calendar, 
  Utensils,
  Eye,
  X,
  MapPin,
  User,
  ChevronDown,
  AlertCircle,
  Trash2,
  ClipboardList,
} from "lucide-react";
import axios from 'axios';

export default function Orders({ auth }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Debug: Log the auth prop to verify it's being passed correctly
  console.log('Auth prop in Orders component:', auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        if (!auth?.user?.id) {
          console.error('No user ID found in auth prop:', auth);
          toast.error("Please log in to view your orders");
          setIsLoading(false);  
          return;
        }
        
        console.log('Fetching orders for user ID:', auth.user.id);
        
        // Fetch orders for the logged-in user
        const response = await axios.get(`/api/orders?user_id=${auth.user.id}`);
        console.log('Orders API response:', response.data);
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error("Failed to fetch orders. Using sample data instead.");
        
        // Only set sample data if user is authenticated
        if (auth?.user?.id) {
          setOrders([
            {
              id: 1,
              orderNumber: 'ORD-2025-001',
              customerName: auth.user.name, // Use the logged-in user's name
              customerId: auth.user.id,     // Include the user ID
              roomNumber: '302',
              status: 'completed',
              total: 250,
              subtotal: 250,
              discount: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              completed_time: new Date().toISOString(),
              items: [
                {
                  id: 1,
                  menuItemId: 1,
                  name: 'Chicken Adobo',
                  price: 250,
                  quantity: 1
                }
              ]
            }
          ]);
        } else {
          setOrders([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [auth?.user?.id]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase()) ||
      (order.roomNumber?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (order.status ?? '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Utensils className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <ClientLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <Head title="My Orders" />
      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "pending" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "processing" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("processing")}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "completed" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "cancelled" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-lg shadow-md">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedOrderId(order.id === expandedOrderId ? null : order.id)}
                      className="p-1.5 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                    >
                      <ChevronDown className={`h-4 w-4 text-[#5D3A1F] ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-6 border-t border-gray-100 pt-6 px-4 pb-2 bg-gradient-to-r from-amber-50/30 to-white">
                  {/* Section Header with Icon */}
                  <div className="flex items-center mb-5">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md mr-3">
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Order Details</h3>
                  </div>

                  {/* Two-column layout for expanded details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Order Items and Details */}
                    <div className="space-y-5">
                      {/* Order Items */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <Utensils className="h-4 w-4 text-amber-500 mr-2" />
                            Order Items
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 hover:bg-amber-50/30 transition-colors">
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 shadow-sm group relative">
                                  <div className="w-full h-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
                                    <Utensils className="h-6 w-6 text-white" />
                                  </div>
                                  <img
                                    src={`/${item.image || 'default-image.jpg'}`}
                                    alt={item.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">{item.name}</span>
                                  <p className="text-xs text-gray-500 mt-0.5">Unit price: ₱{parseFloat(item.price/item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500 mr-2">x{item.quantity}</span>
                                  <span className="text-sm font-semibold text-[#8B5A2B]">₱{parseFloat(item.price).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                          <h4 className="font-medium text-gray-800">Payment Summary</h4>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Subtotal:</span>
                            <span className="text-sm font-medium">₱{parseFloat(order.subtotal || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Discount:</span>
                            <span className="text-xs font-medium text-[#8B5A2B]">-₱{parseFloat(order.discount || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                            <span className="font-medium text-gray-800">Total:</span>
                            <span className="font-bold text-[#8B5A2B]">₱{parseFloat(order.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <MapPin className="h-4 w-4 text-amber-500 mr-2" />
                            Delivery Information
                          </h4>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-gray-800">Room {order.roomNumber}</span>
                          </div>
                          {order.notes && (
                            <div className="pt-3 mt-3 border-t border-gray-100">
                              <p className="text-xs font-medium text-gray-700 mb-1">Special Instructions:</p>
                              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">"{order.notes}"</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Order Timeline */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <Clock className="h-4 w-4 text-amber-500 mr-2" />
                            Order Timeline
                          </h4>
                        </div>
                        <div className="p-5">
                          <div className="relative pb-5">
                            <div className={`absolute top-0 left-4 -ml-px w-1 bg-gradient-to-b from-amber-200 via-amber-100 to-gray-100 rounded-full ${order.status === 'pending' ? 'h-[60px]' : order.status === 'processing' ? 'h-[140px]' : 'h-[220px]'}`}>
                            </div>

                            {/* Order Placed */}
                            <div className="relative flex items-start group mb-8">
                              <div className="h-9 flex items-center">
                                <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md">
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 ml-4 py-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-900">Order Placed</span>
                                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">{formatTimeAgo(order.created_at)}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                  <span>{formatDateTime(order.created_at)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5">Your order has been received and is being processed.</p>
                              </div>
                            </div>

                            {/* Processing */}
                            <div className="relative flex items-start group mb-8">
                              <div className="h-9 flex items-center">
                                <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md">
                                  <Utensils className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 ml-4 py-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-900">Processing</span>
                                  {order.status === 'processing' && (
                                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">{formatTimeAgo(order.updated_at)}</span>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                  <span>{formatDateTime(order.updated_at)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5">Your order is being prepared and will be delivered soon.</p>
                              </div>
                            </div>

                            {/* Completed */}
                            <div className="relative flex items-start group">
                              <div className="h-9 flex items-center">
                                <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-md">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 ml-4 py-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-900">Completed</span>
                                  {order.status === 'completed' && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{formatTimeAgo(order.completed_time)}</span>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                  <span>{formatDateTime(order.completed_time)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5">Your order has been successfully delivered and completed.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
