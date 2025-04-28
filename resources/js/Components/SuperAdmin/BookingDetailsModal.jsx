import React from "react";
import {
  X,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash,
  Users,
  Bed,
} from "lucide-react";

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
  if (!showBookingDetails) return null;

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
                    showBookingDetails.bookingStatus
                  )} shadow-sm`}
                >
                  {showBookingDetails.bookingStatus.charAt(0).toUpperCase() + showBookingDetails.bookingStatus.slice(1).replace("_", " ")}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">{showBookingDetails.totalAmount}</span>
                </div>
                <div
                  className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                    showBookingDetails.paymentStatus
                  )} shadow-sm`}
                >
                  {showBookingDetails.paymentStatus.charAt(0).toUpperCase() + showBookingDetails.paymentStatus.slice(1)}
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
                    <p className="text-sm font-medium">{showBookingDetails.guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{showBookingDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{showBookingDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="text-sm font-medium">
                      {showBookingDetails.adults} {showBookingDetails.adults === 1 ? "Adult" : "Adults"}
                      {showBookingDetails.children > 0 &&
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
                      Room {showBookingDetails.roomNumber} ({getRoomTypeLabel(showBookingDetails.roomType)})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-in Date</p>
                    <p className="text-sm font-medium">{formatDate(showBookingDetails.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-out Date</p>
                    <p className="text-sm font-medium">{formatDate(showBookingDetails.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Length of Stay</p>
                    <p className="text-sm font-medium">{showBookingDetails.nights} {showBookingDetails.nights === 1 ? "Night" : "Nights"}</p>
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
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
              {showBookingDetails.bookingStatus === "pending" && (
                <button
                  onClick={() => updateBookingStatus(showBookingDetails.id, "confirmed")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Booking</span>
                </button>
              )}
              {(showBookingDetails.bookingStatus === "confirmed" || showBookingDetails.bookingStatus === "pending") && (
                <button
                  onClick={() => cancelBooking(showBookingDetails.id)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel Booking</span>
                </button>
              )}
              {showBookingDetails.bookingStatus === "confirmed" && (
                <button
                  onClick={() => updateBookingStatus(showBookingDetails.id, "checked_in")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Check In</span>
                </button>
              )}
              {showBookingDetails.bookingStatus === "checked_in" && (
                <button
                  onClick={() => updateBookingStatus(showBookingDetails.id, "checked_out")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Check Out</span>
                </button>
              )}
              <button
                onClick={() => deleteBooking(showBookingDetails.id)}
                className="flex items-center justify-center gap-1 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 transition-all"
              >
                <Trash className="h-4 w-4 text-gray-500" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}