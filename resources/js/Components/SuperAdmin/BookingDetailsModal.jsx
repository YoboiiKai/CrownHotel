import React, { useState } from "react";
import {
  X,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash2,
  Users,
  Bed,
  User,
  Mail,
  Phone,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
// Toast notifications are handled in the main page

export default function BookingDetailsModal({
  showBookingDetails,
  setShowBookingDetails,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  formatDate,
  getStatusColor,
  getPaymentStatusColor,
  getRoomTypeLabel,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [error, setError] = useState(null);
  
  if (!showBookingDetails) return null;
  
  // Helper function to get status information
  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmed", color: "text-green-600 bg-green-50", icon: <CheckCircle className="h-4 w-4 text-green-500" /> }
      case "pending":
        return { label: "Pending", color: "text-amber-600 bg-amber-50", icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> }
      case "cancelled":
        return { label: "Cancelled", color: "text-red-600 bg-red-50", icon: <XCircle className="h-4 w-4 text-red-500" /> }
      case "checked_in":
        return { label: "Checked In", color: "text-blue-600 bg-blue-50", icon: <CheckCircle className="h-4 w-4 text-blue-500" /> }
      case "checked_out":
        return { label: "Checked Out", color: "text-purple-600 bg-purple-50", icon: <CheckCircle className="h-4 w-4 text-purple-500" /> }
      default:
        return { label: "Unknown", color: "text-gray-600 bg-gray-50", icon: <AlertTriangle className="h-4 w-4 text-gray-500" /> }
    }
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsChangingStatus(true);
    setError(null);
    
    try {
      // Call the API to update the status
      const response = await axios.post(`/api/bookings/${showBookingDetails.id}/status`, {
        status: newStatus
      });
      
      // Get the updated booking from the response or create one with the new status
      const updatedBooking = response.data.booking || {...showBookingDetails, status: newStatus};
      
      // Success message will be shown in the main page
      
      // Call the updateBookingStatus callback
      if (typeof updateBookingStatus === 'function') {
        updateBookingStatus(updatedBooking);
      }
      
      // Close the modal after successful status change
      setShowBookingDetails(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError("Failed to update booking status. Please try again.");
      // Error message will be shown in the main page
    } finally {
      setIsChangingStatus(false);
    }
  };
  
  // Handle payment status change
  const handlePaymentChange = async (newStatus) => {
    setIsUpdatingPayment(true);
    setError(null);
    
    try {
      // Make API request to update payment status
      const response = await axios.post(`/api/bookings/${showBookingDetails.id}/payment-status`, {
        status: newStatus
      });
      
      // Get the updated booking from the response or create one with the new payment status
      const updatedBooking = response.data.booking || {...showBookingDetails, payment_status: newStatus};
      
      // Success message will be shown in the main page
      // The message type is determined by the payment status
      let messageType = '';
      if (newStatus === 'paid') {
        messageType = 'fully paid';
      } else if (newStatus === 'partially_paid') {
        messageType = 'partially paid';
      } else {
        messageType = 'unpaid';
      }
      
      // Call the updateBookingStatus callback
      if (typeof updateBookingStatus === 'function') {
        updateBookingStatus(updatedBooking);
      }
      
      // Close the modal after successful payment status update
      setShowBookingDetails(null);
    } catch (error) {
      console.error('Error updating payment status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update payment status. Please try again.';
      setError(errorMessage);
      // Error message will be shown in the main page
    } finally {
      setIsUpdatingPayment(false);
    }
  };
  
  // Handle booking deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      // Make API request to delete the booking
      await axios.delete(`/api/bookings/${showBookingDetails.id}`);
      
      // Success message will be shown in the main page
      
      // Call the deleteBooking callback
      if (typeof deleteBooking === 'function') {
        deleteBooking();
      }
      
      // Close the modal after successful deletion
      setShowBookingDetails(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking. Please try again.');
      // Error message will be shown in the main page
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
            <button 
              onClick={() => setShowBookingDetails(null)} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Booking Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">#{showBookingDetails.bookingNumber}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-gray-600">Created on {formatDate(showBookingDetails.createdAt)}</p>
                </div>
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    showBookingDetails.status || 'pending'
                  )} shadow-sm`}
                >
                  {(showBookingDetails.status || 'pending').charAt(0).toUpperCase() + (showBookingDetails.status || 'pending').slice(1).replace("_", " ")}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">{showBookingDetails.totalAmount}</span>
                </div>
                <div
                  className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                    showBookingDetails.payment_status || 'unpaid'
                  )} shadow-sm`}
                >
                  {(showBookingDetails.payment_status || 'unpaid').charAt(0).toUpperCase() + (showBookingDetails.payment_status || 'unpaid').slice(1)}
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Guest Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium">{showBookingDetails.client?.name || showBookingDetails.guestName || 'Guest'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{showBookingDetails.client?.email || showBookingDetails.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{showBookingDetails.client?.phone || showBookingDetails.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="text-sm font-medium">
                      {showBookingDetails.adults || 1} {(showBookingDetails.adults || 1) === 1 ? "Adult" : "Adults"}
                      {(showBookingDetails.children > 0) &&
                        `, ${showBookingDetails.children} ${showBookingDetails.children === 1 ? "Child" : "Children"}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Booking Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Room</p>
                    <p className="text-sm font-medium">
                      Room {showBookingDetails.roomNumber || showBookingDetails.room_number || 'N/A'} 
                      ({getRoomTypeLabel(showBookingDetails.roomType || showBookingDetails.room_type)})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-in Date</p>
                    <p className="text-sm font-medium">{formatDate(showBookingDetails.checkInDate || showBookingDetails.check_in_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-out Date</p>
                    <p className="text-sm font-medium">{formatDate(showBookingDetails.checkOutDate || showBookingDetails.check_out_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Length of Stay</p>
                    <p className="text-sm font-medium">{showBookingDetails.nights || showBookingDetails.total_nights || 1} {(showBookingDetails.nights || showBookingDetails.total_nights || 1) === 1 ? "Night" : "Nights"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {showBookingDetails.specialRequests && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-sm text-gray-600">{showBookingDetails.specialRequests}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col pt-3 border-t border-gray-100 mt-4">
              {/* Status Management */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-3">
                  {/* Confirm Booking */}
                  {(showBookingDetails.status === "pending" || showBookingDetails.status === undefined) && (
                    <button 
                      onClick={() => handleStatusChange('confirmed')}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {isChangingStatus ? 'Updating...' : 'Confirm Booking'}
                    </button>
                  )}
                  
                  {/* Check In */}
                  {showBookingDetails.status === "confirmed" && (
                    <button 
                      onClick={() => handleStatusChange('checked_in')}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {isChangingStatus ? 'Updating...' : 'Check In'}
                    </button>
                  )}
                  
                  {/* Check Out */}
                  {showBookingDetails.status === "checked_in" && (
                    <button 
                      onClick={() => handleStatusChange('checked_out')}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {isChangingStatus ? 'Updating...' : 'Check Out'}
                    </button>
                  )}
                  
                  {/* Cancel Booking */}
                  {(showBookingDetails.status !== "cancelled" && showBookingDetails.status !== "checked_out") && (
                    <button 
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={isChangingStatus}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {isChangingStatus ? 'Updating...' : 'Cancel Booking'}
                    </button>
                  )}
                  
                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowBookingDetails(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}