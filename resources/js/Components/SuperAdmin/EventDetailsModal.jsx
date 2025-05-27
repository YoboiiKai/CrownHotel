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
  Trash2
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventDetailsModal({ event, show, onClose, onStatusChange, getStatusInfo }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  
  if (!event) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    setIsChangingStatus(true);
    
    // Call the API to update the status
    const updatedEvent = {...event, status: newStatus};
    
    // Make API request to update status
    axios.post(`/api/events/${event.id}/status`, {
      status: newStatus,
      _method: 'PUT'
    })
    .then(response => {
      toast.success(`Event status changed to ${getStatusInfo(newStatus).label}`);
      // Call the onStatusChange callback with the updated event
      if (typeof onStatusChange === 'function') {
        onStatusChange(updatedEvent);
      }
    })
    .catch(error => {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status. Please try again.');
    })
    .finally(() => {
      setIsChangingStatus(false);
    });
  };
  
  // Handle payment status change - enhanced with better error handling and CSRF protection
  const handlePaymentChange = (newStatus) => {
    setIsUpdatingPayment(true);
    
    // Create updated event object with the new payment status
    const updatedEvent = {...event, paymentStatus: newStatus};
    
    // Make API request to update payment status with CSRF token
    axios.post(`/api/events/${event.id}/payment-status`, {
      status: newStatus
    }, {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
    .then(response => {
      if (response.data.success) {
        // Get appropriate message based on the payment status
        let message;
        if (newStatus === 'fully_paid') {
          message = 'Event marked as fully paid';
        } else if (newStatus === 'deposit_paid') {
          message = 'Deposit marked as paid';
        } else {
          message = 'Event marked as unpaid';
        }
        toast.success(message);
        
        // Call the onStatusChange callback with the updated event from the response
        if (typeof onStatusChange === 'function') {
          // Use the event from the response if available, otherwise use our local update
          const updatedEventData = response.data.event || updatedEvent;
          onStatusChange(updatedEventData);
        }
      } else {
        // Handle unexpected success: false response
        console.error('Payment status update failed:', response.data.message);
        toast.error(response.data.message || 'Failed to update payment status');
      }
    })
    .catch(error => {
      console.error('Error updating payment status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update payment status. Please try again.';
      toast.error(errorMessage);
    })
    .finally(() => {
      setIsUpdatingPayment(false);
    });
  };
  
  // Handle event deletion
  const handleDelete = () => {
    setIsDeleting(true);
    
    // Make API request to delete the event
    axios.delete(`/api/events/${event.id}`)
    .then(response => {
      toast.success("Event deleted successfully");
      // Close the modal
      if (typeof onClose === 'function') {
        onClose();
      }
    })
    .catch(error => {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    })
    .finally(() => {
      setIsDeleting(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#F5EFE7] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
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
            {/* Event Information */}
            <div className="space-y-5">
              {/* Event Type and Overview */}
              <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#E8DCCA] shadow-sm p-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5EFE7] rounded-full -mr-12 -mt-12 opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F5EFE7] rounded-full -ml-8 -mb-8 opacity-30"></div>
                
                {/* Event Header with Type and Status */}
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#E8DCCA]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-[#8B5A2B] to-[#A67C52] rounded-lg shadow-md">
                      {event.eventType === 'wedding' ? (
                        <Calendar className="h-5 w-5 text-white" />
                      ) : event.eventType === 'corporate' ? (
                        <Users className="h-6 w-6 text-white" />
                      ) : (
                        <Calendar className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">Organized by <span className="font-medium text-[#8B5A2B]">{event.clientName}</span></p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getStatusInfo(event.status).color} transition-all duration-200 hover:shadow-md`}>
                    {getStatusInfo(event.status).label}
                  </span>
                </div>
                
                {/* Event Details - Compact */}
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{formatDate(event.date).split(',')[0]}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{event.startTime} - {event.endTime}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Venue:</span>
                      <span className="text-gray-700 font-medium ml-1.5 truncate">{event.venue}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                      <span className="text-gray-500">Guests:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{event.guestCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information - Compact */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <User className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Contact Information</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <span className="text-gray-500">Name:</span>
                    <span className="text-gray-700 font-medium ml-1.5 truncate">{event.clientName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <span className="text-gray-500">Phone:</span>
                    <span className="text-gray-700 font-medium ml-1.5 truncate">{event.contactNumber}</span>
                  </div>
                  
                  <div className="flex items-center col-span-2">
                    <Mail className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-700 font-medium ml-1.5 truncate">{event.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Details - Compact */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <span className="text-[#8B5A2B] font- text-sm mr-1.5">₱</span>
                  <h5 className="text-xs font-semibold text-gray-900">Payment Details</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center">
                      <span className="text-gray-500">Package:</span>
                      <span className="text-gray-700 font-medium ml-1.5 truncate">{event.packageType}</span>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <span className="text-gray-500">Deposit:</span>
                      <span className={`font-medium ml-1.5 flex items-center ${event.depositPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {event.depositPaid ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-0.5" />
                            Paid
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-0.5" />
                            Not Paid
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 mb-2">
                    <div>
                      <span className="text-gray-500">Deposit:</span>
                      <span className="text-gray-700 font-medium ml-1.5">
                        ₱{typeof event.depositAmount === 'number' ? event.depositAmount.toLocaleString() : (parseFloat(event.depositAmount || 0).toLocaleString())}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="text-[#8B5A2B] font-bold ml-1.5">
                        ₱{typeof event.totalAmount === 'number' ? event.totalAmount.toLocaleString() : (parseFloat(event.totalAmount || 0).toLocaleString())}
                      </span>
                    </div>
                  </div>
                                    <div className="flex flex-col border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-gray-500">Payment Status:</span>
                        <span className={`font-medium ml-1.5 flex items-center ${(event.paymentStatus || 'unpaid') === 'fully_paid' ? 'text-green-600' : (event.paymentStatus || 'unpaid') === 'deposit_paid' ? 'text-[#8B5A2B]' : 'text-red-600'}`}>
                          {(event.paymentStatus || 'unpaid') === 'fully_paid' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-0.5" />
                              Fully Paid
                            </>
                          ) : (event.paymentStatus || 'unpaid') === 'deposit_paid' ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-0.5" />
                              Deposit Paid
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-0.5" />
                              Unpaid
                            </>
                          )}
                        </span>
                      </div>
                      {event.paymentStatus === 'fully_paid' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Paid in Full
                        </span>
                      )}
                    </div>
                    
                    {/* Payment Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {/* Button to mark as unpaid */}
                      {event.paymentStatus !== 'unpaid' && (
                        <button
                          onClick={() => handlePaymentChange('unpaid')}
                          disabled={isUpdatingPayment}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Mark as Unpaid</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Button to mark deposit as paid */}
                      {event.paymentStatus === 'unpaid' && (
                        <button
                          onClick={() => handlePaymentChange('deposit_paid')}
                          disabled={isUpdatingPayment}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-[#F5EFE7] text-[#8B5A2B] hover:bg-[#F5EFE7] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#A67C52]"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Mark Deposit Paid</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Button to mark as fully paid */}
                      {event.paymentStatus !== 'fully_paid' && (
                        <button
                          onClick={() => handlePaymentChange('fully_paid')}
                          disabled={isUpdatingPayment}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Mark as Fully Paid</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Requests - Compact */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Special Requests</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <p className="text-gray-700 italic">
                    {event.specialRequests || 'No special requests provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col pt-3 border-t border-gray-100 mt-4">
            {/* Status Management */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-3">
                {event.status !== 'confirmed' && (
                  <button 
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    {isChangingStatus ? 'Updating...' : 'Confirm Event'}
                  </button>
                )}
                
                {event.status !== 'pending' && (
                  <button 
                    onClick={() => handleStatusChange('pending')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isChangingStatus ? 'Updating...' : 'Mark as Pending'}
                  </button>
                )}
                
                {event.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {isChangingStatus ? 'Updating...' : 'Cancel Event'}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
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
  );
}