"use client"

import { useState } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Calendar,
  Users,
  Music,
  PartyPopper,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function ReservationCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterOpen, setFilterOpen] = useState(false)

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
        events: {
          total: Math.floor(Math.random() * 2), // Sample data
          type: ["wedding", "birthday", "corporate"][Math.floor(Math.random() * 3)]
        }
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        events: {
          total: Math.floor(Math.random() * 3), // Sample data
          type: ["wedding", "birthday", "corporate"][Math.floor(Math.random() * 3)]
        }
      })
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        events: {
          total: Math.floor(Math.random() * 2), // Sample data
          type: ["wedding", "birthday", "corporate"][Math.floor(Math.random() * 3)]
        }
      })
    }
    
    return days
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

  // Helper function to get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case "wedding":
        return <PartyPopper className="h-3 w-3 text-pink-600" />
      case "birthday":
        return <Calendar className="h-3 w-3 text-purple-600" />
      case "corporate":
        return <Users className="h-3 w-3 text-blue-600" />
      default:
        return <Music className="h-3 w-3 text-amber-600" />
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
                  placeholder="Search events..."
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
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 to-amber-800">
              <h2 className="text-lg font-medium text-white">Event Calendar</h2>
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
                        {day.events.total > 0 && (
                          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full">
                            {day.events.total}
                          </span>
                        )}
                      </div>

                      {day.isCurrentMonth && day.events.total > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            {getEventIcon(day.events.type)}
                            <span className="ml-1 capitalize">{day.events.type}</span>
                          </div>
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
    </SuperAdminLayout>
  )
}
