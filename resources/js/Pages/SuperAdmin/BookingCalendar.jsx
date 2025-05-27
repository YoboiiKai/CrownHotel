"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import axios from "axios"
import { toast } from "react-toastify"
import {
  Calendar as CalendarIcon,
  Users,
  Bed,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Import modal
import BookingCalendarModal from "@/Components/SuperAdmin/BookingCalendarModal"

export default function BookingCalendar() {
  // State for calendar and bookings
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  // Fetch bookings from the API
  useEffect(() => {
    fetchBookings()
  }, [selectedDate, searchQuery, statusFilter])
  
  const fetchBookings = async () => {
    setLoading(true)
    try {
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1 // JavaScript months are 0-indexed
      
      // Build query parameters
      const params = {
        month,
        year
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      const response = await axios.get('/api/calendar-bookings', { params })
      
      if (response.data.success) {
        // Transform the grouped bookings data into a flat array
        const bookingsList = []
        Object.entries(response.data.bookings).forEach(([date, dayBookings]) => {
          dayBookings.forEach(booking => {
            bookingsList.push(booking)
          })
        })
        setBookings(bookingsList)
        setError(null)
      } else {
        throw new Error(response.data.message || 'Failed to load bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again.')
      toast.error('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Generate calendar days with actual bookings
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    const daysFromPrevMonth = firstDay.getDay()
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({
        date,
        isCurrentMonth: false,
        bookings: getBookingsForDate(date)
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        bookings: getBookingsForDate(date)
      })
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        bookings: getBookingsForDate(date)
      })
    }
    
    return days
  }
  
  // Helper function to get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    const filteredBookings = bookings.filter(booking => {
      // Filter by date - use check-in date for bookings
      const checkInDate = new Date(booking.checkInDate || booking.check_in_date).toISOString().split('T')[0]
      if (checkInDate !== dateString) return false
      
      // Apply search filter if present
      if (searchQuery && 
          !(booking.guestName || booking.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(booking.roomNumber || booking.room_number || '').toString().includes(searchQuery) &&
          !(booking.bookingNumber || booking.booking_reference || '').toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all' && (booking.status || booking.bookingStatus) !== statusFilter) {
        return false
      }
      
      return true
    })
    
    return {
      items: filteredBookings,
      total: filteredBookings.length
    }
  }
  
  const calendarDays = generateCalendarDays()
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Navigation functions
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
  }
  
  // Booking handlers
  const handleBookingClick = (booking) => {
    console.log('Booking clicked:', booking)
    // Fetch the complete booking details from the API
    axios.get(`/api/bookings/${booking.id}`)
      .then(response => {
        setSelectedBooking(response.data)
        setShowDetailsModal(true)
      })
      .catch(error => {
        console.error('Error fetching booking details:', error)
        toast.error('Failed to load booking details. Please try again.')
      })
  }
  
  const handleBookingUpdated = () => {
    fetchBookings()
    setShowDetailsModal(false)
    toast.success('Booking updated successfully!')
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Helper function to get room type label
  const getRoomTypeLabel = (roomType) => {
    if (!roomType) return 'Standard'
    
    const roomTypeMap = {
      'standard': 'Standard',
      'deluxe': 'Deluxe',
      'suite': 'Suite',
      'executive': 'Executive',
      'presidential': 'Presidential'
    }
    
    return roomTypeMap[roomType.toLowerCase()] || roomType
  }
  
  // Helper function to get status information
  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmed", color: "green", icon: <CheckCircle className="h-4 w-4 text-green-500" /> }
      case "pending":
        return { label: "Pending", color: "amber", icon: <AlertCircle className="h-4 w-4 text-amber-500" /> }
      case "cancelled":
        return { label: "Cancelled", color: "red", icon: <X className="h-4 w-4 text-red-500" /> }
      case "checked_in":
        return { label: "Checked In", color: "blue", icon: <CheckCircle className="h-4 w-4 text-blue-500" /> }
      case "checked_out":
        return { label: "Checked Out", color: "purple", icon: <CheckCircle className="h-4 w-4 text-purple-500" /> }
      default:
        return { label: "Unknown", color: "gray", icon: <AlertCircle className="h-4 w-4 text-gray-500" /> }
    }
  }
  
  // Helper function to get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800'
      case 'unpaid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SuperAdminLayout>
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                >
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span>Filter</span>
                  {filterOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                {filterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                    <div className="space-y-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="checked_out">Checked Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('all')
                          setSearchQuery('')
                        }}
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5A2B] to-[#6B4226]">
              <h2 className="text-lg font-medium text-white">Booking Calendar</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={goToPreviousMonth} 
                  className="p-2 rounded-full hover:bg-[#F5EFE7] text-white hover:text-[#8B5A2B] transition-colors"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <span className="font-medium text-white">
                  {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button 
                  onClick={goToNextMonth} 
                  className="p-2 rounded-full hover:bg-[#F5EFE7] text-white hover:text-[#8B5A2B] transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B5A2B] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                <p className="mt-2 text-gray-600">{error}</p>
                <button 
                  onClick={fetchBookings}
                  className="mt-4 px-4 py-2 bg-[#8B5A2B] text-white rounded-lg hover:bg-[#6B4226] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="p-4 overflow-x-auto">
                <div className="min-w-[768px]">
                  <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[100px] border rounded-lg p-2 ${
                          day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                        } ${
                          day.date.getDate() === new Date().getDate() &&
                          day.date.getMonth() === new Date().getMonth() &&
                          day.date.getFullYear() === new Date().getFullYear()
                            ? "border-[#8B5A2B] bg-[#F5EFE7]"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{day.date.getDate()}</span>
                          {day.bookings.total > 0 && (
                            <span className="text-xs bg-[#F5EFE7] text-[#8B5A2B] font-medium px-2 py-1 rounded-full">
                              {day.bookings.total}
                            </span>
                          )}
                        </div>

                        {day.bookings.total > 0 && (
                          <div className="mt-2 space-y-1">
                            {day.bookings.items.map((booking, bookingIndex) => (
                              <div 
                                key={bookingIndex}
                                onClick={() => handleBookingClick(booking)}
                                className={`flex items-center text-xs p-1 rounded cursor-pointer hover:bg-gray-100 ${
                                  booking.status === 'confirmed' || booking.bookingStatus === 'confirmed' ? 'text-green-700 bg-green-50' :
                                  booking.status === 'cancelled' || booking.bookingStatus === 'cancelled' ? 'text-red-700 bg-red-50' :
                                  booking.status === 'checked_in' || booking.bookingStatus === 'checked_in' ? 'text-blue-700 bg-blue-50' :
                                  booking.status === 'checked_out' || booking.bookingStatus === 'checked_out' ? 'text-purple-700 bg-purple-50' :
                                  'text-gray-700 bg-gray-50'
                                }`}
                              >
                                <Bed className="h-3 w-3 mr-1" />
                                <span className="truncate">Room {booking.roomNumber || booking.room_number}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingCalendarModal
          show={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onBookingSelected={() => {}}
          initialBookingInfo={selectedBooking}
        />
      )}
      {/* Debug info */}
      <div className="hidden">
        Modal state: {showDetailsModal ? 'open' : 'closed'}, 
        Selected booking: {selectedBooking ? JSON.stringify(selectedBooking) : 'none'}
      </div>
    </SuperAdminLayout>
  )
}
