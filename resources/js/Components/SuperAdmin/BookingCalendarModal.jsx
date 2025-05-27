import React from "react";
import {
  X,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Bed,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
} from "lucide-react";

export default function BookingCalendarModal({ show, onClose, initialBookingInfo }) {
  if (!show || !initialBookingInfo) return null;
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Helper function to get room type label
  const getRoomTypeLabel = (type) => {
    if (!type) return 'Standard';
    
    const roomTypeMap = {
      'standard': 'Standard',
      'deluxe': 'Deluxe',
      'suite': 'Suite',
      'executive': 'Executive',
      'presidential': 'Presidential'
    };
    
    return roomTypeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper function to get payment status color
  const getPaymentStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper function to get status information with icon
  const getStatusInfo = (status) => {
    if (!status) return { label: "Unknown", color: "gray", icon: <AlertTriangle className="h-4 w-4 text-gray-500" /> };
    
    switch (status.toLowerCase()) {
      case "confirmed":
        return { label: "Confirmed", color: "green", icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      case "pending":
        return { label: "Pending", color: "amber", icon: <AlertTriangle className="h-4 w-4 text-[#8B5A2B]" /> };
      case "cancelled":
        return { label: "Cancelled", color: "red", icon: <XCircle className="h-4 w-4 text-red-500" /> };
      case "checked_in":
        return { label: "Checked In", color: "blue", icon: <CheckCircle className="h-4 w-4 text-blue-500" /> };
      case "checked_out":
        return { label: "Checked Out", color: "purple", icon: <CheckCircle className="h-4 w-4 text-purple-500" /> };
      default:
        return { label: status.charAt(0).toUpperCase() + status.slice(1), color: "gray", icon: <AlertTriangle className="h-4 w-4 text-gray-500" /> };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn border border-[#E8DCCA]">
        {/* Elegant header with gradient background */}
        <div className="bg-gradient-to-r from-[#F5EFE7] via-[#E8DCCA] to-[#F5EFE7] border-b border-[#D8C4A9] p-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#442918] flex items-center">
              <span className="mr-2 text-[#6B4226]">✦</span> Booking Details <span className="ml-2 text-[#6B4226]">✦</span>
            </h3>
            <button 
              onClick={onClose} 
              className="text-[#6B4226] hover:text-[#442918] transition-colors duration-200 p-1 rounded-full hover:bg-[#F5EFE7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-b from-[#F5EFE7]/30 to-white">

          <div className="space-y-8">
            {/* Booking Header - Elegant design */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-[#F5EFE7] to-[#E8DCCA]/40 p-5 rounded-xl border border-[#E8DCCA] shadow-sm">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-inner">
                    <Calendar className="h-5 w-5 text-[#5C341F]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#442918]">BK#{initialBookingInfo.bookingNumber || initialBookingInfo.id}</h2>
                    <p className="text-sm text-[#6B4226] font-medium">
                      Created on {formatDate(initialBookingInfo.createdAt || initialBookingInfo.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 ml-1">
                  <div
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm inline-flex items-center border ${getStatusColor(
                      initialBookingInfo.status || 'pending'
                    )}`}
                  >
                    {getStatusInfo(initialBookingInfo.status || 'pending').icon}
                    <span className="ml-1.5 font-semibold">
                      {(initialBookingInfo.status || 'pending').charAt(0).toUpperCase() + (initialBookingInfo.status || 'pending').slice(1).replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right bg-white/80 p-4 rounded-lg border border-[#E8DCCA] shadow-sm">
                <p className="text-sm font-medium text-[#5C341F] mb-1">Total Amount</p>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[#6B4226] font-medium text-xl">₱</span>
                  <span className="text-3xl font-bold text-[#5C341F]">
                    {initialBookingInfo.totalAmount || initialBookingInfo.total_amount || 0}
                  </span>
                </div>
                <div className="mt-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      initialBookingInfo.payment_status || initialBookingInfo.paymentStatus || 'unpaid'
                    )} shadow-sm inline-block`}
                  >
                    {(initialBookingInfo.payment_status || initialBookingInfo.paymentStatus || 'unpaid').charAt(0).toUpperCase() + 
                     (initialBookingInfo.payment_status || initialBookingInfo.paymentStatus || 'unpaid').slice(1).replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information - Luxurious design */}
            <div>
              <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                <Users className="h-5 w-5 text-[#6B4226] mr-2" />
                <span>Guest Information</span>
                <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
              </h4>
              <div className="bg-white rounded-xl p-5 border border-[#E8DCCA] shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EFE7] rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F5EFE7] rounded-full -ml-12 -mb-12 z-0 opacity-50"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Users className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Guest Name</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {initialBookingInfo.client?.name || initialBookingInfo.guestName || initialBookingInfo.guest_name || 'Guest'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Mail className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Email Address</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {initialBookingInfo.client?.email || initialBookingInfo.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Phone className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Phone Number</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {initialBookingInfo.client?.phone || initialBookingInfo.phone || initialBookingInfo.phoneNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Users className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Party Size</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {initialBookingInfo.adults || initialBookingInfo.num_adults || 1} 
                        {(initialBookingInfo.adults || initialBookingInfo.num_adults || 1) === 1 ? "Adult" : "Adults"}
                        {((initialBookingInfo.children || initialBookingInfo.num_children) > 0) &&
                          `, ${initialBookingInfo.children || initialBookingInfo.num_children} 
                          ${(initialBookingInfo.children || initialBookingInfo.num_children) === 1 ? "Child" : "Children"}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details - Luxurious design */}
            <div>
              <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                <Bed className="h-5 w-5 text-[#6B4226] mr-2" />
                <span>Booking Details</span>
                <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
              </h4>
              <div className="bg-white rounded-xl p-5 border border-[#E8DCCA] shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EFE7] rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F5EFE7] rounded-full -ml-12 -mb-12 z-0 opacity-50"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Bed className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Room Information</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        Room {initialBookingInfo.roomNumber || initialBookingInfo.room_number || 'N/A'} 
                        <span className="inline-block ml-2 px-2 py-0.5 bg-[#E8DCCA] text-[#442918] rounded-md text-xs font-medium">
                          {getRoomTypeLabel(initialBookingInfo.roomType || initialBookingInfo.room_type)}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Check-in Date</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {formatDate(initialBookingInfo.checkInDate || initialBookingInfo.check_in_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Check-out Date</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {formatDate(initialBookingInfo.checkOutDate || initialBookingInfo.check_out_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-4 w-4 text-[#5C341F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider">Length of Stay</p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {initialBookingInfo.nights || initialBookingInfo.total_nights || 1} 
                        {(initialBookingInfo.nights || initialBookingInfo.total_nights || 1) === 1 ? "Night" : "Nights"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests - Luxurious design */}
            {(initialBookingInfo.specialRequests || initialBookingInfo.special_requests) && (
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <MapPin className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Special Requests</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                <div className="bg-white rounded-xl p-5 border border-[#E8DCCA] shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EFE7] rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F5EFE7] rounded-full -ml-12 -mb-12 z-0 opacity-50"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start mb-3">
                      <div className="h-8 w-8 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3 shadow-sm">
                        <MapPin className="h-4 w-4 text-[#5C341F]" />
                      </div>
                      <p className="text-xs font-medium text-[#6B4226] uppercase tracking-wider pt-1">Guest's Special Requests</p>
                    </div>
                    <div className="bg-[#F5EFE7]/50 p-4 rounded-lg border border-[#E8DCCA] italic">
                      <p className="text-base text-gray-700 leading-relaxed">
                        "{initialBookingInfo.specialRequests || initialBookingInfo.special_requests}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}