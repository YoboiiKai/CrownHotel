import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Utensils, 
  DollarSign,
  User,
  Calendar,
  MapPin,
  Plus,
  Trash2
} from 'lucide-react';

const Orders = ({ auth }) => {
  // State for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      roomNumber: '101',
      items: [
        { id: 1, name: 'Grilled Salmon', quantity: 1, price: 24.99 },
        { id: 2, name: 'Caesar Salad', quantity: 1, price: 12.99 },
        { id: 3, name: 'Chocolate Mousse', quantity: 2, price: 8.99 }
      ],
      totalAmount: 55.96,
      status: 'pending',
      orderTime: '2025-03-15T19:30:00',
      estimatedDelivery: '2025-03-15T20:00:00',
      specialInstructions: 'No onions in the salad, please.'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      roomNumber: '205',
      items: [
        { id: 4, name: 'Beef Wellington', quantity: 1, price: 34.99 },
        { id: 5, name: 'Truffle Fries', quantity: 1, price: 9.99 },
        { id: 6, name: 'Tiramisu', quantity: 1, price: 7.99 }
      ],
      totalAmount: 52.97,
      status: 'preparing',
      orderTime: '2025-03-15T19:15:00',
      estimatedDelivery: '2025-03-15T19:45:00',
      specialInstructions: 'Medium rare for the beef.'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customerName: 'Robert Johnson',
      roomNumber: '310',
      items: [
        { id: 7, name: 'Lobster Bisque', quantity: 2, price: 18.99 },
        { id: 8, name: 'Garlic Bread', quantity: 1, price: 5.99 }
      ],
      totalAmount: 43.97,
      status: 'delivered',
      orderTime: '2025-03-15T18:00:00',
      estimatedDelivery: '2025-03-15T18:30:00',
      deliveredTime: '2025-03-15T18:25:00',
      specialInstructions: ''
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      customerName: 'Emily Davis',
      roomNumber: '422',
      items: [
        { id: 9, name: 'Vegetarian Pizza', quantity: 1, price: 16.99 },
        { id: 10, name: 'Garden Salad', quantity: 1, price: 9.99 },
        { id: 11, name: 'Sparkling Water', quantity: 2, price: 3.99 }
      ],
      totalAmount: 34.96,
      status: 'cancelled',
      orderTime: '2025-03-15T17:45:00',
      cancelledTime: '2025-03-15T17:50:00',
      cancellationReason: 'Customer changed their mind'
    },
    {
      id: 5,
      orderNumber: 'ORD-005',
      customerName: 'Michael Wilson',
      roomNumber: '118',
      items: [
        { id: 12, name: 'Filet Mignon', quantity: 1, price: 39.99 },
        { id: 13, name: 'Mashed Potatoes', quantity: 1, price: 7.99 },
        { id: 14, name: 'Red Wine', quantity: 1, price: 12.99 }
      ],
      totalAmount: 60.97,
      status: 'delivered',
      orderTime: '2025-03-15T18:30:00',
      estimatedDelivery: '2025-03-15T19:00:00',
      deliveredTime: '2025-03-15T19:05:00',
      specialInstructions: 'Medium well for the steak.'
    }
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Function to update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          ...(newStatus === 'delivered' ? { deliveredTime: new Date().toISOString() } : {}),
          ...(newStatus === 'cancelled' ? { cancelledTime: new Date().toISOString() } : {})
        };
      }
      return order;
    }));
  };

  // Function to format date
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to calculate time remaining
  const calculateTimeRemaining = (estimatedDelivery) => {
    const now = new Date();
    const delivery = new Date(estimatedDelivery);
    const diffMs = delivery - now;
    
    if (diffMs <= 0) return 'Due now';
    
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
  };

  // Function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-amber-100 text-amber-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
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
      case 'preparing':
        return <Utensils className="h-4 w-4" />;
      case 'delivering':
        return <RefreshCw className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>
      }
    >
      <Head title="Orders" />
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
              <div className="relative">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                  <div className="p-2">
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("all")}
                    >
                      All Orders
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("pending")}
                    >
                      Pending
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("preparing")}
                    >
                      Preparing
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("delivering")}
                    >
                      Delivering
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("delivered")}
                    >
                      Delivered
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setStatusFilter("cancelled")}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNewOrderForm(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Order</span>
            </button>
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
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "preparing" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setStatusFilter("preparing")}
            >
              Preparing
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "delivering" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setStatusFilter("delivering")}
            >
              Delivering
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "delivered" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setStatusFilter("delivered")}
            >
              Delivered
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "cancelled" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>

          {/* Orders List */}
          <div className="mt-4 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No orders found matching your criteria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div 
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer bg-gray-50"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-900 mr-2">#{order.orderNumber}</span>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getStatusBadgeClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <User className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{order.customerName}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">Room {order.roomNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="flex flex-col items-end mr-4">
                        <div className="flex items-center">
                          <DollarSign className="h-3.5 w-3.5 text-amber-600 mr-1" />
                          <span className="font-medium text-amber-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {order.status === 'delivered' 
                              ? `Delivered at ${formatDateTime(order.deliveredTime)}` 
                              : order.status === 'cancelled'
                              ? `Cancelled at ${formatDateTime(order.cancelledTime)}`
                              : `Est. delivery: ${formatDateTime(order.estimatedDelivery)} (${calculateTimeRemaining(order.estimatedDelivery)})`}
                          </span>
                        </div>
                      </div>
                      
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Order Details (Expanded) */}
                  {expandedOrder === order.id && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700">{item.quantity}x</span>
                                <span className="ml-2 text-sm text-gray-700">{item.name}</span>
                              </div>
                              <span className="text-sm text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {order.specialInstructions && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Special Instructions</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{order.specialInstructions}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">Ordered at {formatDateTime(order.orderTime)}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowOrderDetails(order)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                          >
                            View Details
                          </button>
                          
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                              >
                                Start Preparing
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivering')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                              Start Delivery
                            </button>
                          )}
                          
                          {order.status === 'delivering' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      {/* New Order Form Modal */}
      {showNewOrderForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="relative h-32 w-full bg-gradient-to-r from-amber-600 to-amber-800">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">Create New Order</h3>
                  <p className="text-sm text-white opacity-90 mt-1">Fill in the details below to create a new order</p>
                </div>
              </div>

              <div className="bg-white px-6 py-5">
                <form>
                  {/* Customer Information */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Customer Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Room Number
                        </label>
                        <input
                          type="text"
                          id="roomNumber"
                          className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                          placeholder="Enter room number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Order Items</h4>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <select
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                          >
                            <option value="">Select menu item</option>
                            <option value="1">Grilled Salmon - $24.99</option>
                            <option value="2">Caesar Salad - $12.99</option>
                            <option value="3">Beef Wellington - $34.99</option>
                            <option value="4">Chocolate Soufflé - $9.99</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                            placeholder="Qty"
                            defaultValue="1"
                          />
                        </div>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mb-6">
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      rows="3"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Any special requests or dietary restrictions"
                    ></textarea>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">Order Summary</h4>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>Subtotal:</span>
                      <span>$24.99</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>Service Charge (10%):</span>
                      <span>$2.50</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-amber-800 pt-2 border-t border-amber-200 mt-2">
                      <span>Total:</span>
                      <span>$27.49</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-base font-medium text-white hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  onClick={() => setShowNewOrderForm(false)}
                >
                  Create Order
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition-all"
                  onClick={() => setShowNewOrderForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header with Image */}
              <div className="relative h-40 w-full bg-gradient-to-r from-amber-600 to-amber-800">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      Order #{showOrderDetails.orderNumber}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusBadgeClass(showOrderDetails.status)}`}>
                      {getStatusIcon(showOrderDetails.status)}
                      <span className="ml-1 capitalize">{showOrderDetails.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <User className="h-4 w-4 text-white opacity-80 mr-2" />
                    <span className="text-sm text-white opacity-90">{showOrderDetails.customerName}</span>
                    <span className="mx-2 text-white opacity-60">•</span>
                    <MapPin className="h-4 w-4 text-white opacity-80 mr-2" />
                    <span className="text-sm text-white opacity-90">Room {showOrderDetails.roomNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-5">
                {/* Order Amount */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formatDateTime(showOrderDetails.orderTime)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-amber-600 mr-1" />
                    <span className="text-lg font-semibold text-amber-600">
                      ${showOrderDetails.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {showOrderDetails.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">{item.quantity}x</span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-amber-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Special Instructions */}
                {showOrderDetails.specialInstructions && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">Special Instructions</h4>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{showOrderDetails.specialInstructions}</p>
                    </div>
                  </div>
                )}
                
                {/* Order Timeline */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Order Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Clock className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Order Placed</p>
                        <p className="text-xs text-gray-500">{formatDateTime(showOrderDetails.orderTime)}</p>
                      </div>
                    </div>
                    
                    {showOrderDetails.status !== 'pending' && showOrderDetails.status !== 'cancelled' && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Utensils className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Preparation Started</p>
                          <p className="text-xs text-gray-500">Estimated completion in 15-20 minutes</p>
                        </div>
                      </div>
                    )}
                    
                    {(showOrderDetails.status === 'delivering' || showOrderDetails.status === 'delivered') && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <RefreshCw className="h-3 w-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Out for Delivery</p>
                          <p className="text-xs text-gray-500">Estimated arrival: {formatDateTime(showOrderDetails.estimatedDelivery)}</p>
                        </div>
                      </div>
                    )}
                    
                    {showOrderDetails.status === 'delivered' && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Delivered</p>
                          <p className="text-xs text-gray-500">{formatDateTime(showOrderDetails.deliveredTime)}</p>
                        </div>
                      </div>
                    )}
                    
                    {showOrderDetails.status === 'cancelled' && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <XCircle className="h-3 w-3 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Cancelled</p>
                          <p className="text-xs text-gray-500">{formatDateTime(showOrderDetails.cancelledTime)}</p>
                          {showOrderDetails.cancellationReason && (
                            <p className="text-xs text-red-500 mt-1">{showOrderDetails.cancellationReason}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                {showOrderDetails.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-base font-medium text-white hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                      onClick={() => {
                        updateOrderStatus(showOrderDetails.id, 'preparing');
                        setShowOrderDetails(null);
                      }}
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      Start Preparing
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-base font-medium text-white hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                      onClick={() => {
                        updateOrderStatus(showOrderDetails.id, 'cancelled');
                        setShowOrderDetails(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </button>
                  </>
                )}
                
                {showOrderDetails.status === 'preparing' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-base font-medium text-white hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                    onClick={() => {
                      updateOrderStatus(showOrderDetails.id, 'delivering');
                      setShowOrderDetails(null);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Start Delivery
                  </button>
                )}
                
                {showOrderDetails.status === 'delivering' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-base font-medium text-white hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                    onClick={() => {
                      updateOrderStatus(showOrderDetails.id, 'delivered');
                      setShowOrderDetails(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </button>
                )}
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition-all"
                  onClick={() => setShowOrderDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default Orders;