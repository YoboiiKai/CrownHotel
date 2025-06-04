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
  
  console.log('showBookingDetails:', showBookingDetails);
  
  // Map booking data with fallbacks
  const booking = {
    id: showBookingDetails.id || '',
    bookingNumber: showBookingDetails.bookingNumber || showBookingDetails.booking_number || `BK-${(showBookingDetails.id || '').toString().padStart(6, '0')}`,
    booking_reference: showBookingDetails.bookingNumber || showBookingDetails.booking_number || `BK-${(showBookingDetails.id || '').toString().padStart(6, '0')}`,
    status: (showBookingDetails.bookingStatus || showBookingDetails.status || 'pending').toLowerCase(),
    payment_status: (showBookingDetails.paymentStatus || showBookingDetails.payment_status || 'unpaid').toLowerCase(),
    check_in_date: showBookingDetails.checkInDate || showBookingDetails.check_in_date || '',
    check_out_date: showBookingDetails.checkOutDate || showBookingDetails.check_out_date || '',
    createdAt: showBookingDetails.createdAt || showBookingDetails.created_at || new Date().toISOString(),
    total_amount: parseFloat(showBookingDetails.totalAmount || showBookingDetails.total_amount || 0),
    roomNumber: showBookingDetails.roomNumber || showBookingDetails.room_number || 'N/A',
    roomType: showBookingDetails.roomType || showBookingDetails.room_type || '',
    adults: parseInt(showBookingDetails.adults || 1),
    children: parseInt(showBookingDetails.children || 0),
    extra_beds: parseInt(showBookingDetails.extraBeds || showBookingDetails.extra_beds || 0),
    extra_bed_rate: parseFloat(showBookingDetails.extraBedRate || showBookingDetails.extra_bed_rate || 500),
    specialRequests: showBookingDetails.specialRequests || showBookingDetails.special_requests || '',
    guest: {
      name: showBookingDetails.guestName || (showBookingDetails.guest ? showBookingDetails.guest.name : ''),
      email: showBookingDetails.email || (showBookingDetails.guest ? showBookingDetails.guest.email : ''),
      phone: showBookingDetails.phone || (showBookingDetails.guest ? showBookingDetails.guest.phone : '')
    }
  };
  
  // Helper function to get status information with better fallbacks
  const getStatusInfo = (status) => {
    if (!status) {
      return { 
        label: 'Pending', 
        color: 'text-amber-600 bg-amber-50', 
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> 
      };
    }
    
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'confirmed':
        return { 
          label: 'Confirmed', 
          color: 'text-green-600 bg-green-50', 
          icon: <CheckCircle className="h-4 w-4 text-green-500" /> 
        };
      case 'pending':
        return { 
          label: 'Pending', 
          color: 'text-amber-600 bg-amber-50', 
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> 
        };
      case 'cancelled':
      case 'canceled':
        return { 
          label: 'Cancelled', 
          color: 'text-red-600 bg-red-50', 
          icon: <XCircle className="h-4 w-4 text-red-500" /> 
        };
      case 'checked_in':
      case 'checked-in':
        return { 
          label: 'Checked In', 
          color: 'text-blue-600 bg-blue-50', 
          icon: <CheckCircle className="h-4 w-4 text-blue-500" /> 
        };
      case 'checked_out':
      case 'checked-out':
      case 'completed':
        return { 
          label: 'Checked Out', 
          color: 'text-purple-600 bg-purple-50', 
          icon: <CheckCircle className="h-4 w-4 text-purple-500" /> 
        };
      default:
        return { 
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '), 
          color: 'text-gray-600 bg-gray-50', 
          icon: <AlertTriangle className="h-4 w-4 text-gray-500" /> 
        };
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-tr border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Booking Details</h3>
                <p className="text-xs text-white/80">View booking information and manage status</p>
              </div>
            </div>
            <button 
              onClick={() => setShowBookingDetails(null)} 
              className="text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 mb-6 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Booking Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">#{booking.bookingNumber}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-gray-600">Created on {formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#DEB887]/30 p-5 mb-6 shadow-sm">
              <h4 className="text-sm font-medium text-[#5D3A1F] mb-4 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-[#8B5A2B]" />
                Booking Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Booking Reference</p>
                  <p className="text-sm font-medium text-gray-900">{booking.booking_reference}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Check-in</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Check-out</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status === 'paid' ? (
                        <CheckCircle className="h-3 w-3 mr-1.5" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1.5" />
                      )}
                      {booking.payment_status ? (booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1).replace('_', ' ')) : 'Unpaid'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-bold text-[#5D3A1F]">
                    ₱{booking.total_amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest & Room Information */}
            <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#DEB887]/30 p-5 mb-6 shadow-sm">
              <h4 className="text-sm font-medium text-[#5D3A1F] mb-4 flex items-center">
                <User className="h-4 w-4 mr-2 text-[#8B5A2B]" />
                Guest & Room Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Room Number</p>
                  <p className="text-sm font-medium">{booking.roomNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Room Type</p>
                  <p className="text-sm font-medium">{getRoomTypeLabel(booking.roomType) || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Adults</p>
                  <p className="text-sm font-medium">{booking.adults}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Children</p>
                  <p className="text-sm font-medium">{booking.children}</p>
                </div>
                {booking.extra_beds > 0 && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Extra Beds</p>
                      <p className="text-sm font-medium">{booking.extra_beds}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Extra Bed Rate</p>
                      <p className="text-sm font-medium">
                        ₱{booking.extra_bed_rate.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#DEB887]/30 p-5 mb-6 shadow-sm">
              <h4 className="text-sm font-medium text-[#5D3A1F] mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-[#8B5A2B]" />
                Special Requests
              </h4>
              <p className="text-sm text-gray-600">{showBookingDetails.specialRequests}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#DEB887]/30 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Pending Status - Show Confirm and Cancel buttons */}
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => cancelBooking(showBookingDetails.id)}
                  disabled={isChangingStatus}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] transition-colors duration-200"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isChangingStatus}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isChangingStatus ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </>
            )}
            
            {/* Confirmed Status - Show Check-In button */}
            {booking.status === 'confirmed' && (
              <>
                <button
                  onClick={() => setShowBookingDetails(null)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStatusChange('checked_in')}
                  disabled={isChangingStatus}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isChangingStatus ? 'Processing...' : 'Check-In'}
                </button>
              </>
            )}
            
            {/* Checked-In Status - Show Check-Out button */}
            {booking.status === 'checked_in' && (
              <>
                <button
                  onClick={() => setShowBookingDetails(null)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStatusChange('checked_out')}
                  disabled={isChangingStatus}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isChangingStatus ? 'Processing...' : 'Check-Out'}
                </button>
              </>
            )}
            
            {/* Other statuses (checked-out, cancelled) - Just show Close button */}
            {(booking.status === 'checked_out' || booking.status === 'cancelled' || booking.status === 'canceled') && (
              <button
                onClick={() => setShowBookingDetails(null)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] transition-colors duration-200"
              >
                Close
              </button>
            )}
            
            {/* Delete button only for pending or confirmed bookings */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#8B5A2B] hover:bg-[#6B4226] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D3A1F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Delete Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}