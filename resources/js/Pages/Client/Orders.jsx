import React, { useState, useEffect } from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChevronsRight, 
  Calendar, 
  DollarSign,
  Utensils,
  Eye,
  X
} from "lucide-react";

export default function Orders() {
  // Sample orders data - in a real app, this would come from an API
  const [orders, setOrders] = useState([
    {
      id: "ORD-2025-001",
      date: "2025-03-17T18:30:00",
      roomNumber: "304",
      items: [
        { id: 1, name: "Classic Cheeseburger", price: 12.99, quantity: 1 },
        { id: 5, name: "Iced Coffee", price: 4.99, quantity: 2 }
      ],
      status: "delivered",
      total: 22.97,
      notes: "Extra ketchup please",
      estimatedDelivery: "2025-03-17T19:00:00"
    },
    {
      id: "ORD-2025-002",
      date: "2025-03-18T12:15:00",
      roomNumber: "304",
      items: [
        { id: 2, name: "Margherita Pizza", price: 14.99, quantity: 1 },
        { id: 4, name: "Caesar Salad", price: 9.99, quantity: 1 }
      ],
      status: "preparing",
      total: 24.98,
      notes: "",
      estimatedDelivery: "2025-03-18T12:45:00"
    },
    {
      id: "ORD-2025-003",
      date: "2025-03-18T19:45:00",
      roomNumber: "304",
      items: [
        { id: 6, name: "Seafood Pasta", price: 18.99, quantity: 1 },
        { id: 3, name: "Chocolate Lava Cake", price: 8.99, quantity: 1 }
      ],
      status: "placed",
      total: 27.98,
      notes: "Allergic to shellfish, please ensure pasta has no shellfish",
      estimatedDelivery: "2025-03-18T20:15:00"
    }
  ]);

  // State for UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      placed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      preparing: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        icon: <Utensils className="h-3 w-3 mr-1" />
      },
      delivering: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: <Truck className="h-3 w-3 mr-1" />
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="h-3 w-3 mr-1" />
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="h-3 w-3 mr-1" />
      }
    };

    const style = statusStyles[status] || statusStyles.placed;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate time remaining until delivery
  const getTimeRemaining = (estimatedDelivery) => {
    const now = new Date();
    const deliveryTime = new Date(estimatedDelivery);
    const diffMs = deliveryTime - now;
    
    if (diffMs <= 0) return "Arriving now";
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ${remainingMins} min${remainingMins !== 1 ? 's' : ''}`;
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <ClientLayout>
      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowOrderDetails(false)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center relative"
          >
            <Eye className="h-4 w-4" />
            <span>View All Orders</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "placed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("placed")}
          >
            Placed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "preparing" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("preparing")}
          >
            Preparing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "delivered" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered
          </button>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center col-span-full">
              <div className="rounded-full bg-amber-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Utensils className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {searchQuery || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "You haven't placed any orders yet. Visit our menu to place your first order!"}
              </p>
            </div>
          ) : (
            <>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div 
                    className="relative h-36 w-full overflow-hidden cursor-pointer bg-gray-50 p-4"
                    onClick={() => viewOrderDetails(order)}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{order.id}</h3>
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                      {formatDate(order.date)}
                    </div>
                    <div className="mt-2 flex items-center text-xs">
                      <DollarSign className="h-3 w-3 text-amber-600" />
                      <span className="font-medium text-amber-600">{order.total.toFixed(2)}</span>
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                        {getTimeRemaining(order.estimatedDelivery)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        <span className="font-medium text-gray-700">Items:</span>{' '}
                        {order.items.map((item, index) => (
                          <span key={item.id}>
                            {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                            {index < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(selectedOrder.date)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">{selectedOrder.total.toFixed(2)}</span>
                </div>
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{getTimeRemaining(selectedOrder.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
              
              {/* Order Progress */}
              {selectedOrder.status !== 'cancelled' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Order Progress</h4>
                  <div className="relative">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-amber-700"
                        style={{ 
                          width: selectedOrder.status === 'placed' ? '25%' : 
                                 selectedOrder.status === 'preparing' ? '50%' : 
                                 selectedOrder.status === 'delivering' ? '75%' : 
                                 selectedOrder.status === 'delivered' ? '100%' : '0%' 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div className={`${selectedOrder.status === 'placed' || selectedOrder.status === 'preparing' || selectedOrder.status === 'delivering' || selectedOrder.status === 'delivered' ? 'text-amber-700 font-medium' : ''}`}>
                        Placed
                      </div>
                      <div className={`${selectedOrder.status === 'preparing' || selectedOrder.status === 'delivering' || selectedOrder.status === 'delivered' ? 'text-amber-700 font-medium' : ''}`}>
                        Preparing
                      </div>
                      <div className={`${selectedOrder.status === 'delivering' || selectedOrder.status === 'delivered' ? 'text-amber-700 font-medium' : ''}`}>
                        On the way
                      </div>
                      <div className={`${selectedOrder.status === 'delivered' ? 'text-amber-700 font-medium' : ''}`}>
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Order Items */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3 text-amber-600" />
                          <span className="text-sm font-medium text-amber-600">{item.price}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.quantity > 1 ? `${item.quantity}x` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Delivery Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Information</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Room Number:</span> {selectedOrder.roomNumber}
                  </p>
                  {selectedOrder.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
                      <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-amber-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}