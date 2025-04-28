"use client"

import { useState } from "react"
import EmployeeLayout from "@/Layouts/EmployeeLayout"
import {
  CheckCircle,
  X,
  Search,
  Filter,
  ChevronDown,
  Clock,
  Calendar,
  User,
  CheckSquare,
  AlertCircle,
  MoreHorizontal,
  Clipboard,
} from "lucide-react"

export default function TaskList() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showTaskDetails, setShowTaskDetails] = useState(null)
  
  // Sample task data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Clean Room 301",
      description: "Complete cleaning of room 301 including bathroom, changing linens, and restocking amenities.",
      assignedTo: "John Doe",
      priority: "high",
      status: "pending",
      dueDate: "2025-03-21T14:00:00",
      createdAt: "2025-03-20T09:30:00",
      category: "housekeeping"
    },
    {
      id: 2,
      title: "Restock Mini Bar in Room 205",
      description: "Restock all items in the mini bar according to the inventory checklist.",
      assignedTo: "John Doe",
      priority: "medium",
      status: "in_progress",
      dueDate: "2025-03-20T16:00:00",
      createdAt: "2025-03-20T10:15:00",
      category: "housekeeping"
    },
    {
      id: 3,
      title: "Fix Leaking Faucet in Room 412",
      description: "Repair the leaking faucet in the bathroom sink of room 412.",
      assignedTo: "Jane Smith",
      priority: "high",
      status: "completed",
      dueDate: "2025-03-19T17:00:00",
      completedAt: "2025-03-19T16:30:00",
      createdAt: "2025-03-19T11:45:00",
      category: "maintenance"
    },
    {
      id: 4,
      title: "Deliver Extra Towels to Room 118",
      description: "Deliver a set of extra towels to room 118 as requested by the guest.",
      assignedTo: "John Doe",
      priority: "low",
      status: "pending",
      dueDate: "2025-03-20T15:30:00",
      createdAt: "2025-03-20T13:00:00",
      category: "guest_request"
    },
    {
      id: 5,
      title: "Replace Light Bulb in Room 527",
      description: "Replace the burnt out light bulb in the bedside lamp in room 527.",
      assignedTo: "Jane Smith",
      priority: "medium",
      status: "completed",
      dueDate: "2025-03-19T14:00:00",
      completedAt: "2025-03-19T13:45:00",
      createdAt: "2025-03-19T10:30:00",
      category: "maintenance"
    }
  ])

  // Handle task status update
  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map((task) => {
      if (task.id === id) {
        const updatedTask = { 
          ...task, 
          status: newStatus 
        }
        
        if (newStatus === "completed") {
          updatedTask.completedAt = new Date().toISOString()
        } else {
          delete updatedTask.completedAt
        }
        
        return updatedTask
      }
      return task
    }))
  }

  // Filter tasks based on status and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />
        }
      case "in_progress":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="h-4 w-4" />
        }
      case "pending":
        return {
          color: "bg-amber-100 text-amber-800",
          icon: <AlertCircle className="h-4 w-4" />
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Clipboard className="h-4 w-4" />
        }
    }
  }

  // Task Details Modal
  const TaskDetailsModal = ({ task, onClose }) => {
    if (!task) return null
    
    const statusInfo = getStatusInfo(task.status)
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="w-full max-w-[90%] sm:max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {task.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{task.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Assigned to: <span className="font-medium">{task.assignedTo}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Due: <span className="font-medium">{formatDate(task.dueDate)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Created: <span className="font-medium">{formatDate(task.createdAt)}</span></span>
              </div>
              {task.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">Completed: <span className="font-medium">{formatDate(task.completedAt)}</span></span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
            >
              Close
            </button>
            {task.status !== "completed" && (
              <button
                onClick={() => {
                  updateTaskStatus(task.id, "completed")
                  onClose()
                }}
                className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmployeeLayout>
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Task List</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and update your assigned tasks</p>
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                <div className="p-2">
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Tasks
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("in_progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Tasks
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "in_progress" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("in_progress")}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "completed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status)
            
            return (
              <div
                key={task.id}
                className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-5">
                  {/* Task Title and Priority */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                  </div>
                  
                  {/* Task Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                  
                  {/* Task Details */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-700">{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-700">Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span>{task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {task.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowTaskDetails(task)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <Clipboard className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    {task.status !== "completed" ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, "completed")}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                      >
                        <CheckSquare className="h-4 w-4" />
                        <span>Complete</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTaskStatus(task.id, "pending")}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-all"
                      >
                        <X className="h-4 w-4" />
                        <span>Reopen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Clipboard className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no tasks matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setSearchQuery("")
              }}
              className="text-sm font-medium text-amber-600 hover:text-amber-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && (
        <TaskDetailsModal
          task={showTaskDetails}
          onClose={() => setShowTaskDetails(null)}
        />
      )}
    </EmployeeLayout>
  )
}