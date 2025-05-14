"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import axios from "axios"
import { toast } from "react-toastify"
import {
  Calendar as CalendarIcon,
  Users,
  Music,
  PartyPopper,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Import modal
import EventDetailsModal from "@/Components/SuperAdmin/EventDetailsModal"

export default function AdminReservationCalendar() {
  // State for calendar and events
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  // Fetch events from the API
  useEffect(() => {
    fetchEvents()
  }, [selectedDate, searchQuery, statusFilter])
  
  const fetchEvents = async () => {
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
      
      const response = await axios.get('/api/calendar-events', { params })
      
      if (response.data.success) {
        // Transform the grouped events data into a flat array
        const eventsList = []
        Object.entries(response.data.events).forEach(([date, dayEvents]) => {
          dayEvents.forEach(event => {
            eventsList.push(event)
          })
        })
        setEvents(eventsList)
        setError(null)
      } else {
        throw new Error(response.data.message || 'Failed to load events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again.')
      toast.error('Failed to load events. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Generate calendar days with actual events
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
        events: getEventsForDate(date)
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        events: getEventsForDate(date)
      })
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        events: getEventsForDate(date)
      })
    }
    
    return days
  }
  
  // Helper function to get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    const filteredEvents = events.filter(event => {
      // Filter by date
      const eventDate = new Date(event.date).toISOString().split('T')[0]
      if (eventDate !== dateString) return false
      
      // Apply search filter if present
      if (searchQuery && !event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !event.eventType.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all' && event.status !== statusFilter) {
        return false
      }
      
      return true
    })
    
    return {
      items: filteredEvents,
      total: filteredEvents.length
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
  
  // Event handlers
  const handleEventClick = (event) => {
    console.log('Event clicked:', event)
    // Fetch the complete event details from the API
    axios.get(`/api/events/${event.id}`)
      .then(response => {
        setSelectedEvent(response.data)
        setShowDetailsModal(true)
      })
      .catch(error => {
        console.error('Error fetching event details:', error)
        toast.error('Failed to load event details. Please try again.')
      })
  }
  
  const handleEventUpdated = () => {
    fetchEvents()
    setShowDetailsModal(false)
    toast.success('Event updated successfully!')
  }

  // Helper function to get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case "wedding":
        return <PartyPopper className="h-3 w-3 text-pink-600" />
      case "corporate":
        return <Users className="h-3 w-3 text-blue-600" />
      case "birthday":
        return <CalendarIcon className="h-3 w-3 text-purple-600" />
      default:
        return <Music className="h-3 w-3 text-amber-600" />
    }
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
      case "completed":
        return { label: "Completed", color: "blue", icon: <CheckCircle className="h-4 w-4 text-blue-500" /> }
      default:
        return { label: "Unknown", color: "gray", icon: <AlertCircle className="h-4 w-4 text-gray-500" /> }
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                          className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
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
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 to-amber-800">
              <h2 className="text-lg font-medium text-white">Event Calendar</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={goToPreviousMonth} 
                  className="p-2 rounded-full hover:bg-amber-50 text-white hover:text-amber-600 transition-colors"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <span className="font-medium text-white">
                  {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button 
                  onClick={goToNextMonth} 
                  className="p-2 rounded-full hover:bg-amber-50 text-white hover:text-amber-600 transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                <p className="mt-2 text-gray-600">{error}</p>
                <button 
                  onClick={fetchEvents}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{day.date.getDate()}</span>
                          {day.events.total > 0 && (
                            <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full">
                              {day.events.total}
                            </span>
                          )}
                        </div>

                        {day.events.total > 0 && (
                          <div className="mt-2 space-y-1">
                            {day.events.items.map((event, eventIndex) => (
                              <div 
                                key={eventIndex}
                                onClick={() => handleEventClick(event)}
                                className={`flex items-center text-xs p-1 rounded cursor-pointer hover:bg-gray-100 ${
                                  event.status === 'confirmed' ? 'text-green-700 bg-green-50' :
                                  event.status === 'cancelled' ? 'text-red-700 bg-red-50' :
                                  event.status === 'completed' ? 'text-blue-700 bg-blue-50' :
                                  'text-gray-700 bg-gray-50'
                                }`}
                              >
                                {getEventIcon(event.eventType)}
                                <span className="ml-1 truncate">{event.clientName}</span>
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
      {showDetailsModal && selectedEvent && (
        <EventDetailsModal 
          show={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)} 
          event={selectedEvent} 
          onStatusChange={handleEventUpdated}
          getStatusInfo={getStatusInfo}
        />
      )}
      {/* Debug info */}
      <div className="hidden">
        Modal state: {showDetailsModal ? 'open' : 'closed'}, 
        Selected event: {selectedEvent ? JSON.stringify(selectedEvent) : 'none'}
      </div>
    </AdminLayout>
  )
}
