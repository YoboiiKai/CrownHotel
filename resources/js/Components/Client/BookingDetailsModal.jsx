"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  X,
  CheckCircle,
  Hotel,
  Bed,
  Users,
  CreditCard,
  CalendarClock,
  Tag,
  Home,
  Sparkles,
  Coffee,
  Wifi,
  Bath,
  Wine,
  Car,
  Utensils,
  AlertTriangle,
  FileText
} from "lucide-react"

export default function BookingDetailsModal({ showBookingDetails, setShowBookingDetails, formatDate, formatTime, calculateDaysFromNow }) {
  // Get status background color for badges
  const getStatusBgColor = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return "bg-yellow-50";
      case "confirm":
      case "confirmed":
        return "bg-green-50";
      case "checkin":
      case "checked_in":
      case "checked-in":
        return "bg-blue-50";
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return "bg-purple-50";
      case "cancelled":
      case "canceled":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  }
  
  // Get status text color for badges
  const getStatusTextColor = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return "text-yellow-800";
      case "confirm":
      case "confirmed":
        return "text-green-800";
      case "checkin":
      case "checked_in":
      case "checked-in":
        return "text-blue-800";
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return "text-purple-800";
      case "cancelled":
      case "canceled":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  }
  
  // Get status icon for badges
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "confirm":
      case "confirmed":
        return <Calendar className="h-5 w-5 text-green-600" />;
      case "checkin":
      case "checked_in":
      case "checked-in":
        return <Bed className="h-5 w-5 text-blue-600" />;
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case "cancelled":
      case "canceled":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Tag className="h-5 w-5 text-gray-600" />;
    }
  }
  
  // Get status label for badges
  const getStatusLabel = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return "Pending";
      case "confirm":
      case "confirmed":
        return "Confirmed";
      case "checkin":
      case "checked_in":
      case "checked-in":
        return "Checked In";
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return "Checked Out";
      case "cancelled":
      case "canceled":
        return "Cancelled";
      default:
        return status;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl border border-[#E8DCCA]">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#F5EFE7] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                <p className="text-xs text-gray-500">Reservation #BK-{showBookingDetails.id}</p>
              </div>
            </div>
            <button
              onClick={() => setShowBookingDetails(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-[#E8DCCA]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          {/* Booking Status Banner */}
          <div className={`mb-6 rounded-lg p-4 border ${
            showBookingDetails.status.toLowerCase() === "confirm" || showBookingDetails.status.toLowerCase() === "confirmed" 
              ? "bg-green-50 border-green-100" 
              : showBookingDetails.status.toLowerCase() === "checkin" || showBookingDetails.status.toLowerCase() === "checked-in" 
              ? "bg-blue-50 border-blue-100" 
              : showBookingDetails.status.toLowerCase() === "checkout" || showBookingDetails.status.toLowerCase() === "checked-out" || showBookingDetails.status.toLowerCase() === "completed"
              ? "bg-purple-50 border-purple-100"
              : showBookingDetails.status.toLowerCase() === "pending"
              ? "bg-yellow-50 border-yellow-100"
              : showBookingDetails.status.toLowerCase() === "cancelled" || showBookingDetails.status.toLowerCase() === "canceled"
              ? "bg-red-50 border-red-100"
              : "bg-gray-50 border-gray-100"
          }`}>
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-opacity-50" style={{backgroundColor: getStatusBgColor(showBookingDetails.status)}}>
                {getStatusIcon(showBookingDetails.status)}
              </div>
              <div>
                <p className={`font-medium text-base ${getStatusTextColor(showBookingDetails.status)}`}>
                  {showBookingDetails.status.toLowerCase() === "confirm" || showBookingDetails.status.toLowerCase() === "confirmed"
                    ? "Confirmed Reservation"
                    : showBookingDetails.status.toLowerCase() === "checkin" || showBookingDetails.status.toLowerCase() === "checked-in"
                    ? "Currently Checked In"
                    : showBookingDetails.status.toLowerCase() === "checkout" || showBookingDetails.status.toLowerCase() === "checked-out" || showBookingDetails.status.toLowerCase() === "completed"
                    ? "Completed Stay"
                    : showBookingDetails.status.toLowerCase() === "pending"
                    ? "Pending Confirmation"
                    : showBookingDetails.status.toLowerCase() === "cancelled" || showBookingDetails.status.toLowerCase() === "canceled"
                    ? "Cancelled Booking"
                    : getStatusLabel(showBookingDetails.status)}
                </p>
                <p className={`text-sm ${getStatusTextColor(showBookingDetails.status)}`}>
                  {showBookingDetails.status.toLowerCase() === "confirm" || showBookingDetails.status.toLowerCase() === "confirmed" || showBookingDetails.status.toLowerCase() === "pending"
                    ? `Check-in ${calculateDaysFromNow(showBookingDetails.checkIn)}`
                    : showBookingDetails.status.toLowerCase() === "checkin" || showBookingDetails.status.toLowerCase() === "checked-in"
                    ? `Check-out ${calculateDaysFromNow(showBookingDetails.checkOut)}`
                    : showBookingDetails.status.toLowerCase() === "checkout" || showBookingDetails.status.toLowerCase() === "checked-out" || showBookingDetails.status.toLowerCase() === "completed"
                    ? `Checked out ${calculateDaysFromNow(showBookingDetails.checkOut)}`
                    : showBookingDetails.status.toLowerCase() === "cancelled" || showBookingDetails.status.toLowerCase() === "canceled"
                    ? "This booking has been cancelled"
                    : `Status: ${showBookingDetails.status}`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Room Information */}
          <div className="mb-6 rounded-lg border border-[#E8DCCA] bg-white p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Home className="h-4 w-4 text-[#8B5A2B] mr-2" />
              <h4 className="text-base font-semibold text-gray-900">Room Information</h4>
            </div>
            <div className="bg-[#F5EFE7]/30 rounded-lg p-3 border border-[#E8DCCA]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#A67C52]/10">
                    <Bed className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room Number</p>
                    <p className="font-medium text-gray-900">{showBookingDetails.roomNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#A67C52]/10">
                    <Hotel className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room Type</p>
                    <p className="font-medium text-gray-900">{showBookingDetails.roomType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#A67C52]/10">
                    <Users className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="font-medium text-gray-900">
                      {showBookingDetails.guests} {showBookingDetails.guests === 1 ? "Guest" : "Guests"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stay Details */}
          <div className="mb-6 rounded-lg border border-[#E8DCCA] bg-white p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Calendar className="h-4 w-4 text-[#8B5A2B] mr-2" />
              <h4 className="text-base font-semibold text-gray-900">Stay Details</h4>
            </div>
            <div className="bg-[#F5EFE7]/30 rounded-lg p-3 border border-[#E8DCCA]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                      <Calendar className="h-3 w-3 text-[#8B5A2B]" />
                    </div>
                    <p className="text-xs text-gray-500">Check-in</p>
                  </div>
                  <p className="ml-7 font-medium text-gray-900">{formatDate(showBookingDetails.checkIn)}</p>
                  <div className="mt-1 flex items-center ml-7">
                    <Clock className="mr-1 h-3 w-3 text-[#8B5A2B]/70" />
                    <p className="text-xs text-gray-600">{formatTime(showBookingDetails.checkIn)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                      <Calendar className="h-3 w-3 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-500">Check-out</p>
                  </div>
                  <p className="ml-7 font-medium text-gray-900">{formatDate(showBookingDetails.checkOut)}</p>
                  <div className="mt-1 flex items-center ml-7">
                    <Clock className="mr-1 h-3 w-3 text-[#8B5A2B]/70" />
                    <p className="text-xs text-gray-600">{formatTime(showBookingDetails.checkOut)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="mb-6 rounded-lg border border-[#E8DCCA] bg-white p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <CreditCard className="h-4 w-4 text-[#8B5A2B] mr-2" />
              <h4 className="text-base font-semibold text-gray-900">Payment Information</h4>
            </div>
            <div className="bg-[#F5EFE7]/30 rounded-lg p-3 border border-[#E8DCCA]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="text-lg font-semibold text-[#8B5A2B]">${parseFloat(showBookingDetails.totalAmount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                  {showBookingDetails.paymentStatus === "paid" ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 w-fit">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700">Paid</span>
                    </div>
                  ) : showBookingDetails.paymentStatus === "partial" ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 w-fit">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-amber-700">Partial</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 w-fit">
                      <CreditCard className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-xs font-medium text-purple-700">Refunded</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                  <div className="flex items-center">
                    <CalendarClock className="mr-1.5 h-3.5 w-3.5 text-[#8B5A2B]" />
                    <p className="font-medium text-gray-900">{formatDate(showBookingDetails.bookingDate)}</p>
                  </div>
                  <p className="text-xs text-gray-500 ml-5">{formatTime(showBookingDetails.bookingDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="mb-6 rounded-lg border border-[#E8DCCA] bg-white p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Sparkles className="h-4 w-4 text-[#8B5A2B] mr-2" />
              <h4 className="text-base font-semibold text-gray-900">Included Amenities</h4>
            </div>
            <div className="bg-[#F5EFE7]/30 rounded-lg p-3 border border-[#E8DCCA]">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(showBookingDetails.amenities) ? showBookingDetails.amenities.map((amenity, index) => {
                  let icon = <Tag className="h-3.5 w-3.5" />;
                  
                  if (amenity.toLowerCase().includes('wifi')) icon = <Wifi className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('breakfast')) icon = <Coffee className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('pool')) icon = <Bath className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('spa')) icon = <Sparkles className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('bar')) icon = <Wine className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('parking')) icon = <Car className="h-3.5 w-3.5" />;
                  else if (amenity.toLowerCase().includes('restaurant')) icon = <Utensils className="h-3.5 w-3.5" />;
                  
                  return (
                    <span key={index} className="rounded-full bg-[#A67C52]/10 px-3 py-1.5 text-xs font-medium text-[#8B5A2B]">
                      <div className="flex items-center">
                        {icon}
                        <span className="ml-1.5">{amenity}</span>
                      </div>
                    </span>
                  );
                }) : (
                  <span className="rounded-full bg-[#A67C52]/10 px-3 py-1.5 text-xs font-medium text-[#8B5A2B]">
                    <div className="flex items-center">
                      <Wifi className="h-3.5 w-3.5" />
                      <span className="ml-1.5">Free Wi-Fi</span>
                    </div>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Special Requests */}
          {showBookingDetails.specialRequests && (
            <div className="mb-6 rounded-lg border border-[#E8DCCA] bg-white p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-4 w-4 text-[#8B5A2B] mr-2" />
                <h4 className="text-base font-semibold text-gray-900">Special Requests</h4>
              </div>
              <div className="bg-[#F5EFE7]/30 rounded-lg p-3 border border-[#E8DCCA]">
                <p className="text-sm text-gray-700 italic">{showBookingDetails.specialRequests}</p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end pt-2 border-t border-[#E8DCCA]">
            <button
              onClick={() => setShowBookingDetails(null)}
              className="rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-4 py-2 text-sm font-medium text-white hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all shadow-sm flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
