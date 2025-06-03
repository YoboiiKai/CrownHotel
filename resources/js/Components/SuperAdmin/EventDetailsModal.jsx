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
      <div className="bg-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">Event Details</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-1.5 hover:bg-white/20"
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
              <div className="bg-gradient-to-br from-[#F5EFE7]/30 to-white rounded-lg border border-[#DEB887]/30 shadow-sm p-5 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5EFE7]/50 rounded-full -mr-14 -mt-14 opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#F5EFE7]/50 rounded-full -ml-10 -mb-10 opacity-30"></div>
                
                {/* Event Header with Type and Status */}
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#DEB887]/20">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gradient-to-br from-[#5D3A1F] to-[#8B5A2B] rounded-xl shadow-md">
                      {event.eventType === 'wedding' ? (
                        <Calendar className="h-6 w-6 text-white" />
                      ) : event.eventType === 'corporate' ? (
                        <Users className="h-6 w-6 text-white" />
                      ) : (
                        <Calendar className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#5D3A1F]">{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</h4>
                      <p className="text-sm text-[#8B5A2B]/70 mt-0.5">Organized by <span className="font-medium text-[#8B5A2B]">{event.clientName}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusInfo(event.status).icon}
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm 
                      ${event.status === 'confirmed' ? 'bg-gradient-to-r from-green-500/90 to-green-600/90 text-white' : 
                        event.status === 'cancelled' ? 'bg-gradient-to-r from-red-500/90 to-red-600/90 text-white' : 
                        event.status === 'completed' ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white' : 
                        'bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white'} 
                      transition-all duration-200 hover:shadow-md`}>
                      {getStatusInfo(event.status).label}
                    </span>
                  </div>
                </div>
                
                {/* Event Details - Enhanced */}
                <div className="bg-white rounded-lg p-3 border border-[#DEB887]/20 text-sm shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        <Calendar className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Date</span>
                        <p className="text-[#5D3A1F] font-medium">{formatDate(event.date).split(',')[0]}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        <Clock className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Time</span>
                        <p className="text-[#5D3A1F] font-medium">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        <MapPin className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Venue</span>
                        <p className="text-[#5D3A1F] font-medium truncate">{event.venue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        <Users className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Guests</span>
                        <p className="text-[#5D3A1F] font-medium">{event.guestCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information - Enhanced */}
              <div className="bg-white rounded-lg border border-[#DEB887]/30 shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#5D3A1F] to-[#8B5A2B] shadow-sm mr-2">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-[#5D3A1F]">Contact Information</h5>
                </div>
                
                <div className="bg-[#F5EFE7]/20 rounded-lg p-3 border border-[#DEB887]/20 text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                      <User className="h-4 w-4 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <span className="text-[#5D3A1F]/60 text-xs">Client Name</span>
                      <p className="text-[#5D3A1F] font-medium truncate">{event.clientName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                      <Phone className="h-4 w-4 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <span className="text-[#5D3A1F]/60 text-xs">Phone Number</span>
                      <p className="text-[#5D3A1F] font-medium truncate">{event.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                      <Mail className="h-4 w-4 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <span className="text-[#5D3A1F]/60 text-xs">Email Address</span>
                      <p className="text-[#5D3A1F] font-medium truncate">{event.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Details - Enhanced */}
              <div className="bg-white rounded-lg border border-[#DEB887]/30 shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#5D3A1F] to-[#8B5A2B] shadow-sm mr-2">
                    <DollarSign className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-[#5D3A1F]">Payment Details</h5>
                </div>
                
                <div className="bg-[#F5EFE7]/20 rounded-lg p-3 border border-[#DEB887]/20 text-sm">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        <Calendar className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Package Type</span>
                        <p className="text-[#5D3A1F] font-medium truncate">{event.packageType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7] mr-2">
                        {event.depositPaid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-[#5D3A1F]/60 text-xs">Deposit Status</span>
                        <p className={`font-medium ${event.depositPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {event.depositPaid ? 'Paid' : 'Not Paid'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[#DEB887]/20 pt-3 mb-3 px-2">
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-[#DEB887]/20">
                      <span className="text-[#5D3A1F]/60 text-xs block">Deposit Amount</span>
                      <span className="text-[#5D3A1F] font-medium text-lg">
                        ₱{typeof event.depositAmount === 'number' ? event.depositAmount.toLocaleString() : (parseFloat(event.depositAmount || 0).toLocaleString())}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-[#8B5A2B]/10 to-[#A67C52]/10 px-3 py-2 rounded-lg shadow-sm border border-[#DEB887]/30">
                      <span className="text-[#5D3A1F]/60 text-xs block">Total Amount</span>
                      <span className="text-[#8B5A2B] font-bold text-lg">
                        ₱{typeof event.totalAmount === 'number' ? event.totalAmount.toLocaleString() : (parseFloat(event.totalAmount || 0).toLocaleString())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col border-t border-[#DEB887]/20 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE7]">
                          {(event.paymentStatus || 'unpaid') === 'fully_paid' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (event.paymentStatus || 'unpaid') === 'deposit_paid' ? (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <span className="text-[#5D3A1F]/60 text-xs">Payment Status</span>
                          <p className={`font-medium ${(event.paymentStatus || 'unpaid') === 'fully_paid' ? 'text-green-600' : (event.paymentStatus || 'unpaid') === 'deposit_paid' ? 'text-amber-600' : 'text-red-600'}`}>
                            {(event.paymentStatus || 'unpaid') === 'fully_paid' ? 'Fully Paid' : (event.paymentStatus || 'unpaid') === 'deposit_paid' ? 'Deposit Paid' : 'Unpaid'}
                          </p>
                        </div>
                      </div>
                      {event.paymentStatus === 'fully_paid' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500/90 to-green-600/90 text-white text-xs font-medium rounded-full shadow-sm">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 border border-red-200 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 shadow-sm hover:shadow"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Mark as Unpaid</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Button to mark deposit as paid */}
                      {event.paymentStatus !== 'deposit_paid' && (
                        <button
                          onClick={() => handlePaymentChange('deposit_paid')}
                          disabled={isUpdatingPayment}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-600 border border-amber-200 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-amber-600/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 shadow-sm hover:shadow"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <AlertTriangle className="h-3.5 w-3.5" />
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
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 border border-green-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 shadow-sm hover:shadow"
                        >
                          {isUpdatingPayment ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Mark as Fully Paid</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Requests - Enhanced */}
              <div className="bg-white rounded-lg border border-[#DEB887]/30 shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#5D3A1F] to-[#8B5A2B] shadow-sm mr-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-[#5D3A1F]">Special Requests</h5>
                </div>
                
                <div className="bg-[#F5EFE7]/20 rounded-lg p-3 border border-[#DEB887]/20 text-sm">
                  <p className="text-[#5D3A1F]/80 italic">
                    {event.specialRequests || 'No special requests provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col pt-4 border-t border-[#DEB887]/20 mt-5">
            {/* Status Management */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-3">
                {event.status !== 'confirmed' && (
                  <button 
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 disabled:opacity-70"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isChangingStatus ? 'Updating...' : 'Confirm Event'}
                  </button>
                )}
                
                {event.status !== 'pending' && (
                  <button 
                    onClick={() => handleStatusChange('pending')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] rounded-lg shadow-sm hover:shadow-md hover:from-[#8B5A2B] hover:to-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-200 disabled:opacity-70"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {isChangingStatus ? 'Updating...' : 'Mark as Pending'}
                  </button>
                )}
                
                {event.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm hover:shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 disabled:opacity-70"
                  >
                    <XCircle className="h-4 w-4" />
                    {isChangingStatus ? 'Updating...' : 'Cancel Event'}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#5D3A1F] bg-gradient-to-r from-[#F5EFE7]/50 to-[#F5EFE7]/80 border border-[#DEB887]/30 rounded-lg shadow-sm hover:shadow-md hover:from-[#F5EFE7]/80 hover:to-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/50 focus:ring-offset-1 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
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