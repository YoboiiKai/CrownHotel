"use client"

import { useState } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
import { Head } from "@inertiajs/react"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  X,
  Hotel,
  Bed,
  Users,
  CreditCard,
  CalendarClock,
  Tag
} from "lucide-react"

export default function BookingHistory() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookingDetails, setShowBookingDetails] = useState(null)
  
  // Sample booking data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      roomNumber: "101",
      roomType: "Deluxe Suite",
      checkIn: "2024-12-10T14:00:00",
      checkOut: "2024-12-15T12:00:00",
      guests: 2,
      status: "completed",
      totalAmount: 1250.00,
      paymentStatus: "paid",
      bookingDate: "2024-11-25T09:30:00",
      specialRequests: "Room with ocean view if possible",
      amenities: ["Free Wi-Fi", "Breakfast", "Swimming Pool", "Spa Access"]
    },
    {
      id: 2,
      roomNumber: "205",
      roomType: "Executive Room",
      checkIn: "2025-01-20T15:00:00",
      checkOut: "2025-01-25T11:00:00",
      guests: 1,
      status: "upcoming",
      totalAmount: 950.00,
      paymentStatus: "paid",
      bookingDate: "2024-12-15T14:45:00",
      specialRequests: "High floor room",
      amenities: ["Free Wi-Fi", "Breakfast", "Gym Access"]
    },
    {
      id: 3,
      roomNumber: "310",
      roomType: "Family Suite",
      checkIn: "2025-02-05T13:00:00",
      checkOut: "2025-02-10T12:00:00",
      guests: 4,
      status: "upcoming",
      totalAmount: 1800.00,
      paymentStatus: "partial",
      bookingDate: "2025-01-10T11:20:00",
      specialRequests: "Extra beds for children",
      amenities: ["Free Wi-Fi", "Breakfast", "Kids Club", "Swimming Pool"]
    },
    {
      id: 4,
      roomNumber: "118",
      roomType: "Standard Room",
      checkIn: "2024-09-15T14:00:00",
      checkOut: "2024-09-18T11:00:00",
      guests: 2,
      status: "cancelled",
      totalAmount: 450.00,
      paymentStatus: "refunded",
      bookingDate: "2024-08-20T16:30:00",
      specialRequests: "",
      amenities: ["Free Wi-Fi", "Breakfast"]
    },
    {
      id: 5,
      roomNumber: "422",
      roomType: "Penthouse Suite",
      checkIn: "2024-10-01T15:00:00",
      checkOut: "2024-10-05T12:00:00",
      guests: 2,
      status: "completed",
      totalAmount: 2200.00,
      paymentStatus: "paid",
      bookingDate: "2024-09-01T10:15:00",
      specialRequests: "Champagne upon arrival",
      amenities: ["Free Wi-Fi", "Breakfast", "Butler Service", "Spa Access", "Private Terrace"]
    }
  ])

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Format time to display in a more readable format
  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleTimeString("en-US", options)
  }

  // Calculate days until check-in or since check-out
  const calculateDaysFromNow = (dateString) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 0) {
      return `in ${diffDays} ${diffDays === 1 ? "day" : "days"}`
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "day" : "days"} ago`
    } else {
      return "today"
    }
  }

  // Filter bookings based on status and search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch =
      booking.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800"
      case "partial":
        return "bg-amber-100 text-amber-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ClientLayout>
      <Head title="Booking History" />
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600">View and manage all your hotel bookings</p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Search by room number or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500 sm:w-44"
                onClick={() => document.getElementById("filter-dropdown").classList.toggle("hidden")}
              >
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <span>
                    {filterStatus === "all"
                      ? "All Bookings"
                      : filterStatus === "upcoming"
                      ? "Upcoming"
                      : filterStatus === "completed"
                      ? "Completed"
                      : "Cancelled"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div
                id="filter-dropdown"
                className="absolute z-10 mt-1 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFilterStatus("all")
                        document.getElementById("filter-dropdown").classList.add("hidden")
                      }}
                    >
                      All Bookings
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFilterStatus("upcoming")
                        document.getElementById("filter-dropdown").classList.add("hidden")
                      }}
                    >
                      Upcoming
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFilterStatus("completed")
                        document.getElementById("filter-dropdown").classList.add("hidden")
                      }}
                    >
                      Completed
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setFilterStatus("cancelled")
                        document.getElementById("filter-dropdown").classList.add("hidden")
                      }}
                    >
                      Cancelled
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Room</th>
                  <th scope="col" className="px-6 py-3">Check-in / Check-out</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Payment</th>
                  <th scope="col" className="px-6 py-3">Booked On</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b bg-white hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">Room {booking.roomNumber}</span>
                          <span className="text-gray-500">{booking.roomType}</span>
                          <div className="mt-1 flex items-center text-gray-500">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3.5 w-3.5 text-amber-600" />
                            <span className="font-medium">{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>{formatTime(booking.checkIn)}</span>
                          </div>
                          <div className="mt-2 flex items-center">
                            <Calendar className="mr-1 h-3.5 w-3.5 text-red-600" />
                            <span className="font-medium">{formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>{formatTime(booking.checkOut)}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {booking.status === "upcoming" ? (
                              <span>Check-in {calculateDaysFromNow(booking.checkIn)}</span>
                            ) : booking.status === "completed" ? (
                              <span>Checked out {calculateDaysFromNow(booking.checkOut)}</span>
                            ) : (
                              <span>Cancelled</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">${booking.totalAmount.toFixed(2)}</span>
                          <span className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{formatDate(booking.bookingDate)}</span>
                          <span className="text-xs text-gray-500">{formatTime(booking.bookingDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowBookingDetails(booking)}
                          className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200"
                        >
                          <div className="flex items-center">
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            <span>Details</span>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b bg-white">
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarClock className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="mb-1 text-lg font-medium text-gray-900">No bookings found</p>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "Try adjusting your search or filter criteria"
                            : filterStatus !== "all"
                            ? `You don't have any ${filterStatus} bookings`
                            : "You haven't made any bookings yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details Modal */}
        {showBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-lg">
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setShowBookingDetails(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Booking Status Banner */}
                <div className={`mb-6 rounded-lg p-4 ${
                  showBookingDetails.status === "completed" 
                    ? "bg-green-50" 
                    : showBookingDetails.status === "upcoming" 
                    ? "bg-blue-50" 
                    : "bg-red-50"
                }`}>
                  <div className="flex items-center">
                    {showBookingDetails.status === "completed" ? (
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    ) : showBookingDetails.status === "upcoming" ? (
                      <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                    ) : (
                      <X className="mr-3 h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        showBookingDetails.status === "completed" 
                          ? "text-green-800" 
                          : showBookingDetails.status === "upcoming" 
                          ? "text-blue-800" 
                          : "text-red-800"
                      }`}>
                        {showBookingDetails.status === "completed"
                          ? "Completed Stay"
                          : showBookingDetails.status === "upcoming"
                          ? "Upcoming Reservation"
                          : "Cancelled Booking"}
                      </p>
                      <p className={`text-sm ${
                        showBookingDetails.status === "completed" 
                          ? "text-green-600" 
                          : showBookingDetails.status === "upcoming" 
                          ? "text-blue-600" 
                          : "text-red-600"
                      }`}>
                        {showBookingDetails.status === "upcoming"
                          ? `Check-in ${calculateDaysFromNow(showBookingDetails.checkIn)}`
                          : showBookingDetails.status === "completed"
                          ? `Checked out ${calculateDaysFromNow(showBookingDetails.checkOut)}`
                          : "This booking has been cancelled"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Room Information */}
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 text-lg font-medium text-gray-900">Room Information</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Room Number</p>
                      <p className="font-medium text-gray-900">{showBookingDetails.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room Type</p>
                      <p className="font-medium text-gray-900">{showBookingDetails.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {showBookingDetails.guests} {showBookingDetails.guests === 1 ? "Guest" : "Guests"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stay Details */}
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 text-lg font-medium text-gray-900">Stay Details</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-amber-600" />
                        <p className="font-medium text-gray-900">{formatDate(showBookingDetails.checkIn)}</p>
                      </div>
                      <div className="mt-1 flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="text-gray-600">{formatTime(showBookingDetails.checkIn)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-red-600" />
                        <p className="font-medium text-gray-900">{formatDate(showBookingDetails.checkOut)}</p>
                      </div>
                      <div className="mt-1 flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="text-gray-600">{formatTime(showBookingDetails.checkOut)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 text-lg font-medium text-gray-900">Payment Information</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-semibold text-gray-900">${showBookingDetails.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(showBookingDetails.paymentStatus)}`}>
                        {showBookingDetails.paymentStatus.charAt(0).toUpperCase() + showBookingDetails.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <div className="flex items-center">
                        <CreditCard className="mr-1 h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">{formatDate(showBookingDetails.bookingDate)}</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatTime(showBookingDetails.bookingDate)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 text-lg font-medium text-gray-900">Included Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {showBookingDetails.amenities.map((amenity, index) => (
                      <span key={index} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                        <div className="flex items-center">
                          <Tag className="mr-1 h-3.5 w-3.5" />
                          {amenity}
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Special Requests */}
                {showBookingDetails.specialRequests && (
                  <div className="mb-6 rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 text-lg font-medium text-gray-900">Special Requests</h4>
                    <p className="text-gray-700">{showBookingDetails.specialRequests}</p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBookingDetails(null)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {showBookingDetails.status === "upcoming" && (
                    <button
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                    >
                      Modify Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}