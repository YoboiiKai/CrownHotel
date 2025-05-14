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
  ClipboardList
} from "lucide-react";
import axios from 'axios';

export default function Orders({ auth }) {
  // State for orders
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Fetch orders
        const response = await axios.get('/api/orders');
        let ordersData = response.data.data || [];
        console.log('Orders data:', ordersData);
        
        // Check if we have order items with image data
        if (ordersData.length > 0) {
          console.log('First order:', ordersData[0]);
          console.log('First order images:', ordersData[0].images);
          console.log('First order images type:', typeof ordersData[0].images);
          
          if (ordersData[0].items && ordersData[0].items.length > 0) {
            const firstItem = ordersData[0].items[0];
            console.log('First item details:', firstItem);
            // Log specific image-related properties
            console.log('Item menuItemId:', firstItem.menuItemId);
            
            // Check if images array exists and has data
            if (ordersData[0].images) {
              if (Array.isArray(ordersData[0].images)) {
                console.log('Images is an array with length:', ordersData[0].images.length);
                console.log('First image path:', ordersData[0].images[0]);
              } else if (typeof ordersData[0].images === 'string') {
                console.log('Images is a string:', ordersData[0].images);
                try {
                  // Try to parse if it's a JSON string
                  const parsedImages = JSON.parse(ordersData[0].images);
                  console.log('Parsed images:', parsedImages);
                } catch (e) {
                  console.log('Not a valid JSON string');
                }
              } else if (typeof ordersData[0].images === 'object') {
                console.log('Images is an object:', Object.keys(ordersData[0].images));
              }
            } else {
              console.log('No images data available');
            }
          }
        }
        
        // No need to modify the data, just set it directly
        setOrders(ordersData);
      } catch (error) {
        toast.error("Failed to fetch orders");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase()) ||
      (order.roomNumber?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (order.status ?? '') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to get the correct image path based on order data
  const getImagePath = (order, item, index) => {
    // Based on the memory: "Images are stored in the public directory with paths saved in the database as 'Menu/' + imageName"
    const defaultPath = `Menu/${item.menuItemId}.jpg`;
    
    // If no images data at all, use default
    if (!order.images) {
      console.log('No images data in order, using default path:', defaultPath);
      return defaultPath;
    }
    
    console.log('Order images data type:', typeof order.images);
    console.log('Order images data:', order.images);
    
    // Handle array format
    if (Array.isArray(order.images) && order.images[index]) {
      // If the path already includes 'Menu/', return as is
      if (order.images[index].includes('Menu/')) {
        return order.images[index];
      }
      // Otherwise, ensure it has the correct prefix
      return order.images[index].startsWith('Menu/') ? order.images[index] : `Menu/${order.images[index]}`;
    }
    
    // Handle object format with numeric keys
    if (typeof order.images === 'object' && !Array.isArray(order.images)) {
      // Try to get the image by index as string key
      if (order.images[index.toString()]) {
        const imagePath = order.images[index.toString()];
        return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
      }
      
      // Try to get the image by menuItemId
      if (order.images[item.menuItemId]) {
        const imagePath = order.images[item.menuItemId];
        return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
      }
    }
    
    // Handle string format (JSON string)
    if (typeof order.images === 'string') {
      try {
        const parsedImages = JSON.parse(order.images);
        console.log('Parsed images from string:', parsedImages);
        
        if (Array.isArray(parsedImages) && parsedImages[index]) {
          const imagePath = parsedImages[index];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        } else if (parsedImages[index.toString()]) {
          const imagePath = parsedImages[index.toString()];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        } else if (parsedImages[item.menuItemId]) {
          const imagePath = parsedImages[item.menuItemId];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        }
      } catch (e) {
        console.log('Failed to parse images JSON:', e);
      }
    }
    
    // Extract filename from menuItemId
    // Based on the error logs, the images seem to be named with timestamps like 1745810636.jpg
    // Let's try to extract the filename from the menuItemId or use it directly
    if (item.menuItemId) {
      // If menuItemId is a number, assume it's the image name
      if (!isNaN(item.menuItemId)) {
        return `Menu/${item.menuItemId}.jpg`;
      }
      
      // If menuItemId contains a filename pattern (numbers with .jpg extension)
      const filenameMatch = item.menuItemId.match(/(\d+\.jpg)$/);
      if (filenameMatch) {
        return `Menu/${filenameMatch[1]}`;
      }
    }
    
    // Fallback to default path
    console.log('Falling back to default path:', defaultPath);
    return defaultPath;
  };

  // Function to format date
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

  // Function to calculate time ago
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

  // Function to get status badge color
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

  // Function to get status icon
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "processing" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("processing")}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "completed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "cancelled" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Orders Card */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <Utensils className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Total Orders</h3>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                <span className="ml-2 text-sm text-gray-500">orders</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-sm font-medium text-blue-600">
                    {orders.filter(order => order.status !== "completed" && order.status !== "cancelled").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Orders Card */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Processing</h3>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter(order => order.status === "processing").length}
                </p>
                <span className="ml-2 text-sm text-gray-500">orders</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Pending</p>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
                    <p className="text-sm font-medium text-blue-600">
                      {orders.filter(order => order.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Orders Card */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Completed Orders</h3>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter(order => order.status === "completed").length}
                </p>
                <span className="ml-2 text-sm text-gray-500">orders</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                    <p className="text-sm font-medium text-red-600">
                      {orders.filter(order => order.status === "cancelled").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Utensils className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? "There are no orders matching your current filters."
                : "You haven't placed any orders yet."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                className="text-sm font-medium text-amber-600 hover:text-amber-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <li key={order.id} className="relative">
                  <div 
                    className={`px-6 py-5 transition-colors duration-200 ${
                      expandedOrderId === order.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col h-full justify-center space-y-1 mr-4">
                          {/* Status indicator */}
                          <div className={`w-2.5 h-10 rounded-full ${
                            order.status === 'completed' ? 'bg-green-500' : 
                            order.status === 'processing' ? 'bg-amber-500' : 
                            order.status === 'pending' ? 'bg-blue-500' : 
                            order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-medium text-gray-900 truncate">Order #{order.orderNumber}</h3>
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              <span className="truncate">{formatDateTime(order.created_at)}</span>
                            </div>
                            <span className="mx-2 text-gray-300">•</span>
                            <div className="flex items-center">
                              <span className="font-medium text-amber-600">₱{parseFloat(order.total || 0).toFixed(2)}</span>
                            </div>
                            <span className="mx-2 text-gray-300">•</span>
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              <span className="truncate">Room {order.roomNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="p-1.5 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-50 focus:outline-none transition-colors"
                        >
                          <ChevronDown 
                            className={`h-5 w-5 transform transition-transform duration-200 ${
                              expandedOrderId === order.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Order Details with Timeline */}
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
                                        {/* Base gradient background with utensils icon as fallback */}
                                        <div className="w-full h-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
                                          <Utensils className="h-6 w-6 text-white" />
                                        </div>
                                        
                                        {/* Display the actual menu item image */}
                                        {(() => {
                                          const imagePath = getImagePath(order, item, index);
                                          console.log(`Item ${index} image path:`, imagePath);
                                          return (
                                            <img
                                              // Try with direct public path first based on the memory info
                                              src={`/${imagePath}`}
                                              alt={item.name}
                                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                              onError={(e) => {
                                                console.log('Direct path failed to load:', e.target.src);
                                                // Try with storage path
                                                const storagePath = `/storage/${imagePath}`;
                                                console.log('Trying storage path:', storagePath);
                                                e.target.src = storagePath;
                                                
                                                // Add a second error handler for the storage path
                                                e.target.onerror = () => {
                                                  console.log('Storage path also failed');
                                                  // Try with a different format (just the filename)
                                                  const filename = imagePath.split('/').pop();
                                                  if (filename) {
                                                    const simplePath = `/storage/Menu/${filename}`;
                                                    console.log('Trying simple path:', simplePath);
                                                    e.target.src = simplePath;
                                                    
                                                    // Final error handler
                                                    e.target.onerror = () => {
                                                      console.log('All paths failed, hiding image');
                                                      e.target.style.display = 'none';
                                                    };
                                                  } else {
                                                    // If we can't extract a filename, hide the image
                                                    e.target.style.display = 'none';
                                                  }
                                                };
                                              }}
                                            />
                                          );
                                        })()}
                                        
                                        {/* Hover overlay */}
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
                                        <span className="text-sm font-semibold text-amber-600">₱{parseFloat(item.price).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                                <h4 className="font-medium text-gray-800 flex items-center">
                                  Payment Summary
                                </h4>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Subtotal:</span>
                                  <span className="text-sm font-medium">₱{parseFloat(order.subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Discount:</span>
                                  <span className="text-sm font-medium text-green-600">-₱{parseFloat(order.discount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                                  <span className="font-medium text-gray-800">Total:</span>
                                  <span className="font-bold text-amber-600">₱{parseFloat(order.total || 0).toFixed(2)}</span>
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
                          <div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                              <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-amber-50 to-white">
                                <h4 className="font-medium text-gray-800 flex items-center">
                                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                  Order Timeline
                                </h4>
                              </div>
                              <div className="p-5">
                                <div className="relative pb-5">
                                  {/* Timeline track - gradient with dynamic height based on status */}
                                  <div className={`absolute top-0 left-4 -ml-px w-1 bg-gradient-to-b from-amber-200 via-amber-100 to-gray-100 rounded-full ${order.status === 'pending' ? 'h-[60px]' : order.status === 'processing' ? 'h-[140px]' : 'h-[220px]'}`}></div>

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

                                  {/* Order Processing - Only show if status is processing or beyond */}
                                  {(order.status === 'processing' || order.status === 'completed') && (
                                    <div className="relative flex items-start group mb-8">
                                      <div className="h-9 flex items-center">
                                        <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md">
                                          <Utensils className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 ml-4 py-1">
                                        <div className="flex items-center mb-1">
                                          <span className="font-semibold text-gray-900">Order Processing</span>
                                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">{formatTimeAgo(order.processing_time || order.updated_at)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                          <span>{formatDateTime(order.processing_time || order.updated_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1.5">Your order is being prepared by our kitchen staff.</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Order Completed - Only show if status is completed */}
                                  {order.status === 'completed' && (
                                    <div className="relative flex items-start group mb-8">
                                      <div className="h-9 flex items-center">
                                        <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md">
                                          <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 ml-4 py-1">
                                        <div className="flex items-center mb-1">
                                          <span className="font-semibold text-gray-900">Order Completed</span>
                                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{formatTimeAgo(order.completed_time || order.updated_at)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                          <span>{formatDateTime(order.completed_time || order.updated_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1.5">Your order has been delivered successfully.</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Order Cancelled - Only show if status is cancelled */}
                                  {order.status === 'cancelled' && (
                                    <div className="relative flex items-start group">
                                      <div className="h-9 flex items-center">
                                        <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md">
                                          <XCircle className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 ml-4 py-1">
                                        <div className="flex items-center mb-1">
                                          <span className="font-semibold text-gray-900">Order Cancelled</span>
                                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">{formatTimeAgo(order.cancelled_time || order.updated_at)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                          <span>{formatDateTime(order.cancelled_time || order.updated_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1.5">Your order has been cancelled.</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}