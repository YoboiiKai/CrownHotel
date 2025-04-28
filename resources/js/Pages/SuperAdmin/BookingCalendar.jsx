"use client"

import { useState } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Calendar,
  Users,
  Bed,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
} from "lucide-react"

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterOpen, setFilterOpen] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Sample room types
  const roomTypes = [
    { id: 1, name: "Standard", color: "bg-blue-100 text-blue-800" },
    { id: 2, name: "Deluxe", color: "bg-purple-100 text-purple-800" },
    { id: 3, name: "Suite", color: "bg-amber-100 text-amber-800" },
    { id: 4, name: "Family", color: "bg-green-100 text-green-800" },
  ]

  // Sample room data
  const rooms = [
    { id: 1, number: "101", type: 1, status: "available" },
    { id: 2, number: "102", type: 1, status: "booked" },
    { id: 3, number: "103", type: 1, status: "maintenance" },
    { id: 4, number: "201", type: 2, status: "available" },
    { id: 5, number: "202", type: 2, status: "booked" },
    { id: 6, number: "301", type: 3, status: "available" },
    { id: 7, number: "302", type: 3, status: "booked" },
    { id: 8, number: "401", type: 4, status: "available" },
  ]

  // Generate calendar days
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
        bookings: generateSampleBookings(false)
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        bookings: generateSampleBookings(true)
      })
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        bookings: generateSampleBookings(false)
      })
    }
    
    return days
  }

  // Generate sample bookings for demo purposes
  const generateSampleBookings = (isCurrentMonth) => {
    const bookingCount = isCurrentMonth ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2)
    const bookings = []
    
    for (let i = 0; i < bookingCount; i++) {
      const roomTypeId = Math.floor(Math.random() * 4) + 1
      bookings.push({
        id: Math.floor(Math.random() * 1000),
        roomTypeId,
        roomNumber: rooms.find(r => r.type === roomTypeId)?.number || "101",
        guestName: ["John Smith", "Jane Doe", "Alex Johnson", "Maria Garcia"][Math.floor(Math.random() * 4)]
      })
    }
    
    return bookings
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

  // Helper function to get room type color
  const getRoomTypeColor = (typeId) => {
    const roomType = roomTypes.find(rt => rt.id === typeId)
    return roomType ? roomType.color : "bg-gray-100 text-gray-800"
  }

  // Helper function to get room type name
  const getRoomTypeName = (typeId) => {
    const roomType = roomTypes.find(rt => rt.id === typeId)
    return roomType ? roomType.name : "Unknown"
  }

  // Helper function to get room status color
  const getRoomStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "booked":
        return "bg-amber-100 text-amber-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedRoom(booking)
    setShowRoomModal(true)
  }

  return (
    <SuperAdminLayout>
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Room Booking Calendar</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                >
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-10">
                    <h3 className="font-medium text-gray-900 mb-3">Filter by Room Type</h3>
                    <div className="space-y-2">
                      {roomTypes.map(type => (
                        <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                          <span className="text-sm text-gray-700">{type.name}</span>
                        </label>
                      ))}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-3 mt-4">Filter by Status</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                        <span className="text-sm text-gray-700">Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                        <span className="text-sm text-gray-700">Booked</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                        <span className="text-sm text-gray-700">Maintenance</span>
                      </label>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all">
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Room Type Legend */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-3">Room Types</h3>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(type => (
                <div key={type.id} className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 ${type.color}`}>
                  <Bed className="h-4 w-4" />
                  <span>{type.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 to-amber-800">
              <h2 className="text-lg font-medium text-white">Booking Calendar</h2>
              <div className="flex items-center space-x-2">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-amber-50 text-white hover:text-amber-600">
                  <ChevronUp className="h-5 w-5" />
                </button>
                <span className="font-medium text-white">
                  {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-amber-50 text-white hover:text-amber-600">
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

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
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{day.date.getDate()}</span>
                        {day.bookings.length > 0 && (
                          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full">
                            {day.bookings.length}
                          </span>
                        )}
                      </div>

                      {day.isCurrentMonth && day.bookings.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {day.bookings.map((booking, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center text-xs px-2 py-1 rounded ${getRoomTypeColor(booking.roomTypeId)} cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => handleBookingClick(booking)}
                            >
                              <Bed className="h-3 w-3 mr-1" />
                              <span className="truncate">Room {booking.roomNumber}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Booking Modal */}
      {showRoomModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Room Booking Details</h3>
                <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-amber-600" />
                  <span className="text-lg font-medium">Room {selectedRoom.roomNumber}</span>
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(selectedRoom.roomTypeId)}`}>
                    {getRoomTypeName(selectedRoom.roomTypeId)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Guest Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selectedRoom.guestName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Check-in: March 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Check-out: March 18, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Booking Status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor("booked")}`}>
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-4">
                  <button
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600 shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1 transition-all"
                  >
                    <span>Edit Booking</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>Check In</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}
