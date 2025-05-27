import React, { useState } from "react";
import { 
  X, 
  Edit, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Utensils
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function OrderDetailsModal({ order, show, onClose, onStatusChange }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState(null);
  
  if (!order || !show) return null;
  
  // Helper function to get the correct image path based on order data
  const getImagePath = (order, item, index) => {
    // Based on the memory: "Images are stored in the public directory with paths saved in the database as 'Menu/' + imageName"
    const defaultPath = `Menu/${item.menuItemId}.jpg`;
    
    // If no images data at all, use default
    if (!order.images) {
      return defaultPath;
    }
    
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
        // Silent fail for JSON parsing
      }
    }
    
    // Extract filename from menuItemId
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
    return defaultPath;
  };
  
  // Format date for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
          color: 'bg-blue-100 text-blue-800',
          description: 'Order is waiting to be processed'
        };
      case 'processing':
        return {
          icon: <Utensils className="h-4 w-4" />,
          label: 'Processing',
          color: 'bg-amber-100 text-amber-800',
          description: 'Order is being prepared'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          description: 'Order has been delivered and completed'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          description: 'Order has been cancelled'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          description: 'Order status is unknown'
        };
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsChangingStatus(true);
    setError(null);
    
    try {
      const response = await axios.post(`/api/orders/${order.id}/status`, {
        status: newStatus,
        _method: 'PUT'
      });
      
      const updatedOrder = response.data.data || {...order, status: newStatus};
      
      if (onStatusChange) {
        onStatusChange(updatedOrder);
      } else {
        toast.success(`Order status changed to ${getStatusInfo(newStatus).label}`);
        onClose();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError("Failed to update order status. Please try again.");
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#F5EFE7] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
          
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Order Information */}
            <div className="space-y-5">
              {/* Order Type and Overview */}
              <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#E5D3B3] shadow-sm p-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5EFE7] rounded-full -mr-12 -mt-12 opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F5EFE7] rounded-full -ml-8 -mb-8 opacity-30"></div>
                
                {/* Order Header with Number and Status */}
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#E5D3B3]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-md">
                      <Utensils className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Order #{order.orderNumber || 'N/A'}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">Ordered by <span className="font-medium text-[#6B4226]">{order.customerName}</span></p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${statusInfo.color} transition-all duration-200 hover:shadow-md`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                {/* Order Details - Compact */}
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{formatDateTime(order.created_at).split(',')[0]}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{new Date(order.created_at).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Room:</span>
                      <span className="text-gray-700 font-medium ml-1.5 truncate">{order.roomNumber}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Senior Citizen:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{order.isSeniorCitizen ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
          
              {/* Contact Information - Compact */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <User className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Customer Information</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <span className="text-gray-500">Name:</span>
                    <span className="text-gray-700 font-medium ml-1.5 truncate">{order.customerName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <span className="text-gray-500">Room:</span>
                    <span className="text-gray-700 font-medium ml-1.5 truncate">{order.roomNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <Utensils className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Order Items</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className="space-y-2">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center">
                          {/* Food Image */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 shadow-sm group relative">
                            {/* Base gradient background with utensils icon as fallback */}
                            <div className="w-full h-full bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] flex items-center justify-center">
                              <Utensils className="h-4 w-4 text-white" />
                            </div>
                            
                            {/* Display the actual menu item image */}
                            <img
                              src={`/${getImagePath(order, item, index)}`}
                              alt={item.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                // Try with storage path
                                const storagePath = `/storage/${getImagePath(order, item, index)}`;
                                e.target.src = storagePath;
                                
                                // Add a second error handler for the storage path
                                e.target.onerror = () => {
                                  // Try with a different format (just the filename)
                                  const filename = getImagePath(order, item, index).split('/').pop();
                                  if (filename) {
                                    const simplePath = `/storage/Menu/${filename}`;
                                    e.target.src = simplePath;
                                    
                                    // Final error handler
                                    e.target.onerror = () => {
                                      // If all paths fail, hide the image
                                      e.target.style.display = 'none';
                                    };
                                  } else {
                                    // If we can't extract a filename, hide the image
                                    e.target.style.display = 'none';
                                  }
                                };
                              }}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center bg-[#F5EFE7] text-[#6B4226] font-medium rounded w-5 h-5 mr-2">{item.quantity}</span>
                              <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-500 text-[10px] mt-0.5">Unit price: ${parseFloat(item.price/item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        <span className="font-medium text-[#8B5A2B]">${parseFloat(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Payment Details - Compact */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Payment Details</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="text-gray-700 font-medium ml-1.5">
                        ${parseFloat(order.subtotal || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <span className="text-gray-500">Discount:</span>
                      <span className="text-gray-700 font-medium ml-1.5">
                        ${parseFloat(order.discount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-gray-500">Senior Citizen:</span>
                        <span className={`font-medium ml-1.5 flex items-center ${order.isSeniorCitizen ? 'text-green-600' : 'text-gray-600'}`}>
                          {order.isSeniorCitizen ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-0.5" />
                              Yes
                            </>
                          ) : (
                            <>No</>                            
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Total:</span>
                      <span className="text-[#6B4226] font-bold ml-1.5">
                        ${parseFloat(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Information */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Status Information</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className={`flex items-center p-2 rounded ${statusInfo.color}`}>
                    <div className="mr-2">
                      {statusInfo.icon}
                    </div>
                    <div>
                      <p className="font-medium">{statusInfo.label}</p>
                      <p className="text-xs mt-0.5">{statusInfo.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes (if any) */}
              {order.notes && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                  <div className="flex items-center mb-2">
                    <Edit className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <h5 className="text-xs font-semibold text-gray-900">Notes</h5>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-2">
          {/* Status Change Buttons */}
          {order.status === 'pending' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-[#8B5A2B] text-sm font-medium text-white hover:bg-[#6B4226] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleStatusChange('processing')}
                disabled={isChangingStatus}
              >
                <Utensils className="h-4 w-4 mr-1.5" />
                Start Processing
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isChangingStatus}
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Cancel Order
              </button>
            </div>
          )}
          
          {order.status === 'processing' && (
            <button
              type="button"
              className="inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleStatusChange('completed')}
              disabled={isChangingStatus}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Mark as Completed
            </button>
          )}
          
          <button
            type="button"
            className="inline-flex justify-center items-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] transition-colors shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}