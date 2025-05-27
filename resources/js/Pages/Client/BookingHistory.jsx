"use client"

import { useState, useEffect } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
import { Head } from "@inertiajs/react"
import ClientBookingsDetailsModal from "@/Components/Client/ClientBookingsDetailsModal"
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
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BookingHistory() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookingDetails, setShowBookingDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  
  // Booking data state
  const [bookings, setBookings] = useState([])
  
  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])
  
  // Fetch bookings from API
  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      // Add cache-busting parameter to prevent caching
      const response = await axios.get(`/api/client/bookings?_t=${new Date().getTime()}`)
      setBookings(response.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load booking history. Please try again.")
      // If API is not available, use sample data for demonstration
      setBookings(sampleBookings)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Sample booking data for demonstration if API fails
  const sampleBookings = [
    {
      id: 1,
      roomNumber: "101",
      roomType: "Deluxe Suite",
      checkIn: "2024-12-10T14:00:00",
      checkOut: "2024-12-15T12:00:00",
      guests: 2,
      adults: 2,
      children: 0,
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
      adults: 1,
      children: 0,
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
      adults: 2,
      children: 2,
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
      adults: 2,
      children: 0,
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
      adults: 2,
      children: 0,
      status: "completed",
      totalAmount: 2200.00,
      paymentStatus: "paid",
      bookingDate: "2024-09-01T10:15:00",
      specialRequests: "Champagne upon arrival",
      amenities: ["Free Wi-Fi", "Breakfast", "Butler Service", "Spa Access", "Private Terrace"]
    }
  ]
  
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
    // Check if booking has all required properties
    if (!booking || typeof booking !== 'object') return false;
    
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    
    // Safely check search terms with null checks
    const matchesSearch = searchQuery === "" || (
      (booking.roomNumber && booking.roomNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.roomType && booking.roomType.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    )
    
    return matchesStatus && matchesSearch
  })

  // Get status badge color
  const getStatusColor = (status) => {
    // Convert to lowercase for case-insensitive comparison
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirm":
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "checkin":
      case "checked_in":
      case "checked-in":
        return "bg-blue-100 text-blue-800";
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
      case "confirm":
      case "confirmed":
        return <Calendar className="h-3.5 w-3.5 text-green-500" />;
      case "checkin":
      case "checked_in":
      case "checked-in":
        return <Bed className="h-3.5 w-3.5 text-blue-500" />;
      case "checkout":
      case "checked_out":
      case "checked-out":
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5 text-purple-500" />;
      case "cancelled":
      case "canceled":
        return <X className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Tag className="h-3.5 w-3.5 text-gray-500" />;
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
    <ClientLayout>
      <Head title="Booking History" />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#442918]">My Booking History</h1>
            <p className="text-sm text-[#6B4226] mt-1">
              View and manage your room bookings
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-8 rounded-xl border border-[#E8DCCA] bg-[#F5EFE7] p-5 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-[#8B5A2B]" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-[#E8DCCA] bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-[#A67C52] focus:ring-[#A67C52] transition-all shadow-sm"
                  placeholder="Search by room number or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <button
                  className="flex w-full items-center justify-between rounded-lg border border-[#E8DCCA] bg-white p-2.5 text-sm text-gray-900 hover:bg-[#F5EFE7]/50 focus:border-[#A67C52] focus:ring-[#A67C52] sm:w-44 transition-all shadow-sm"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-[#8B5A2B]" />
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
                  <ChevronDown className="h-4 w-4 text-[#8B5A2B]" />
                </button>
                {isFilterDropdownOpen && (
                <div
                  className="absolute z-10 mt-1 w-44 divide-y divide-[#E8DCCA] rounded-lg bg-white shadow-lg border border-[#E8DCCA] overflow-hidden"
                >
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-[#F5EFE7] transition-colors"
                        onClick={() => {
                          setFilterStatus("all")
                          setIsFilterDropdownOpen(false)
                        }}
                      >
                        All Bookings
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-[#F5EFE7] transition-colors"
                        onClick={() => {
                          setFilterStatus("upcoming")
                          setIsFilterDropdownOpen(false)
                        }}
                      >
                        Upcoming
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-[#F5EFE7] transition-colors"
                        onClick={() => {
                          setFilterStatus("completed")
                          setIsFilterDropdownOpen(false)
                        }}
                      >
                        Completed
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-[#F5EFE7] transition-colors"
                        onClick={() => {
                          setFilterStatus("cancelled")
                          setIsFilterDropdownOpen(false)
                        }}
                      >
                        Cancelled
                      </button>
                    </li>
                  </ul>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="mb-8 overflow-hidden rounded-xl border border-[#E8DCCA] bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5EFE7] text-xs uppercase text-[#6B4226]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Room</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Check-in / Check-out</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Payment</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Booked On</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E8DCCA] border-t-[#8B5A2B]"></div>
                        <p>Loading your booking history...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="mb-2 h-12 w-12 text-[#D8C4A9]" />
                        <p className="mb-1 text-lg font-medium text-[#5C341F]">No bookings found</p>
                        <p className="text-gray-500">
                          {searchQuery ? "Try a different search term or filter" : "You haven't made any bookings yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <tr key={booking.id} className={`border-b border-[#E8DCCA] hover:bg-[#F5EFE7]/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F5EFE7]/10'}`}>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A67C52]/20 to-[#8B5A2B]/20 shadow-sm">
                              <Home className="h-4 w-4 text-[#8B5A2B]" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Room {booking.roomNumber}</span>
                              <div className="flex items-center text-[#8B5A2B]">
                                <span className="text-sm">{booking.roomType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-gray-500 ml-11">
                            <Users className="mr-1 h-3.5 w-3.5 text-[#8B5A2B]/70" />
                            <span className="text-xs">{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                                <Calendar className="h-3 w-3 text-[#8B5A2B]" />
                              </div>
                              <span className="font-medium text-gray-900">{formatDate(booking.checkIn)}</span>
                            </div>
                            <div className="flex items-center text-gray-500 ml-7">
                              <Clock className="mr-1 h-3 w-3 text-[#8B5A2B]/70" />
                              <span className="text-xs">{formatTime(booking.checkIn)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                                <Calendar className="h-3 w-3 text-red-500" />
                              </div>
                              <span className="font-medium text-gray-900">{formatDate(booking.checkOut)}</span>
                            </div>
                            <div className="flex items-center text-gray-500 ml-7">
                              <Clock className="mr-1 h-3 w-3 text-[#8B5A2B]/70" />
                              <span className="text-xs">{formatTime(booking.checkOut)}</span>
                            </div>
                          </div>
                          
                          <div className="ml-7 text-xs">
                            {booking.status.toLowerCase() === "confirm" || booking.status.toLowerCase() === "confirmed" || booking.status.toLowerCase() === "pending" ? (
                              <span className="text-blue-600 font-medium">Check-in {calculateDaysFromNow(booking.checkIn)}</span>
                            ) : booking.status.toLowerCase() === "checkin" || booking.status.toLowerCase() === "checked-in" ? (
                              <span className="text-indigo-600 font-medium">Currently checked in</span>
                            ) : booking.status.toLowerCase() === "checkout" || booking.status.toLowerCase() === "checked-out" || booking.status.toLowerCase() === "completed" ? (
                              <span className="text-green-600 font-medium">Checked out {calculateDaysFromNow(booking.checkOut)}</span>
                            ) : booking.status.toLowerCase() === "cancelled" || booking.status.toLowerCase() === "canceled" ? (
                              <span className="text-red-600 font-medium">Cancelled</span>
                            ) : (
                              <span className="text-gray-600 font-medium">{booking.status}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 w-fit ${getStatusBgColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className={`text-xs font-medium ${getStatusTextColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                              <CreditCard className="h-3 w-3 text-[#8B5A2B]" />
                            </div>
                            <span className="font-medium text-gray-900">${parseFloat(booking.totalAmount || 0).toFixed(2)}</span>
                          </div>
                          <div className="mt-2 ml-7">
                            {booking.paymentStatus === "paid" ? (
                              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 w-fit">
                                <CheckCircle className="h-3 w-3 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-700">Paid</span>
                              </div>
                            ) : booking.paymentStatus === "partial" ? (
                              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 w-fit">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                <span className="text-xs font-medium text-amber-700">Partial</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 w-fit">
                                <CreditCard className="h-3 w-3 text-purple-500" />
                                <span className="text-xs font-medium text-purple-700">Refunded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                              <CalendarClock className="h-3 w-3 text-[#8B5A2B]" />
                            </div>
                            <span className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-500 ml-7 mt-1">
                            <Clock className="mr-1 h-3 w-3 text-[#8B5A2B]/70" />
                            <span className="text-xs">{formatTime(booking.bookingDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => setShowBookingDetails(booking)}
                          className="rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all shadow-sm"
                        >
                          <div className="flex items-center">
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            <span>View Details</span>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details Modal */}
        {showBookingDetails && (
          <ClientBookingsDetailsModal
            showBookingDetails={showBookingDetails}
            setShowBookingDetails={setShowBookingDetails}
            formatDate={formatDate}
            formatTime={formatTime}
            calculateDaysFromNow={calculateDaysFromNow}
          />
        )}
      </div>
    </ClientLayout>
  )
}