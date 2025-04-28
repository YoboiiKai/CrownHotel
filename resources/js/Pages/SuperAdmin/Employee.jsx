"use client"

import { useState } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react"

export default function Employee() {
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(null)

  // Sample employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      position: "Front Desk Manager",
      department: "Front Office",
      joinDate: "2022-05-15",
      status: "active",
      salary: 4500,
      address: "123 Main St, Anytown, USA",
      createdAt: "2022-05-10T14:30:00",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
      position: "Housekeeping Supervisor",
      department: "Housekeeping",
      joinDate: "2022-03-10",
      status: "active",
      salary: 3800,
      address: "456 Oak Ave, Somewhere, USA",
      createdAt: "2022-03-05T09:15:00",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 456-7890",
      position: "Chef de Cuisine",
      department: "Food & Beverage",
      joinDate: "2021-11-20",
      status: "active",
      salary: 5200,
      address: "789 Pine Rd, Elsewhere, USA",
      createdAt: "2021-11-15T11:45:00",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      phone: "+1 (555) 222-3333",
      position: "Concierge",
      department: "Guest Services",
      joinDate: "2023-01-05",
      status: "active",
      salary: 3600,
      address: "101 Elm St, Nowhere, USA",
      createdAt: "2022-12-28T16:20:00",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.w@example.com",
      phone: "+1 (555) 777-8888",
      position: "Maintenance Technician",
      department: "Maintenance",
      joinDate: "2022-08-12",
      status: "inactive",
      salary: 3400,
      address: "202 Cedar Ln, Anyplace, USA",
      createdAt: "2022-08-05T10:30:00",
    },
  ])

  // Department details for reference
  const departments = {
    "Front Office": {
      description: "Manages guest check-in/check-out, reservations, and front desk operations.",
      positions: ["Front Desk Manager", "Receptionist", "Reservations Agent", "Front Desk Clerk"],
    },
    "Housekeeping": {
      description: "Responsible for cleanliness and maintenance of guest rooms and public areas.",
      positions: ["Housekeeping Supervisor", "Room Attendant", "Public Area Cleaner", "Laundry Attendant"],
    },
    "Food & Beverage": {
      description: "Oversees all restaurant, bar, and catering operations within the hotel.",
      positions: ["F&B Manager", "Chef de Cuisine", "Sous Chef", "Bartender", "Server", "Host/Hostess"],
    },
    "Maintenance": {
      description: "Handles repairs, preventative maintenance, and facility upkeep.",
      positions: ["Maintenance Manager", "Maintenance Technician", "Engineer"],
    },
    "Guest Services": {
      description: "Provides additional services to enhance guest experience.",
      positions: ["Guest Services Manager", "Concierge", "Bell Person", "Valet"],
    },
    "Administration": {
      description: "Manages overall hotel operations, finances, and human resources.",
      positions: ["General Manager", "Assistant Manager", "HR Manager", "Accountant"],
    },
  }

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Calculate years of service
  const calculateYearsOfService = (joinDate) => {
    const start = new Date(joinDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
    return diffYears < 1 
      ? "< 1 year" 
      : `${Math.floor(diffYears)} ${Math.floor(diffYears) === 1 ? "year" : "years"}`
  }

  // Handle employee activation
  const activateEmployee = (id) => {
    setEmployees(employees.map((employee) => (employee.id === id ? { ...employee, status: "active" } : employee)))
  }

  // Handle employee deactivation
  const deactivateEmployee = (id) => {
    setEmployees(employees.map((employee) => (employee.id === id ? { ...employee, status: "inactive" } : employee)))
  }

  // Delete employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id))
  }

  // Filter employees based on status and search query
  const filteredEmployees = employees.filter((employee) => {
    const matchesStatus = filterStatus === "all" || employee.status === filterStatus
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <SuperAdminLayout>
      <div className="mx-auto max-w-6xl">

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
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
                    All Employees
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewEmployeeForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Employees
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "active" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "inactive" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("inactive")}
          >
            Inactive
          </button>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-5">
                {/* Employee Name and Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.name}</h3>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowEmployeeDetails(employee)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no employees matching your current filters.</p>
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

      {/* New Employee Form Modal */}
      {showNewEmployeeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Employee</h3>
                <button onClick={() => setShowNewEmployeeForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="">Select department</option>
                      {Object.keys(departments).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="joinDate"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                      <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary ($/month)
                    </label>
                    <input
                      type="number"
                      id="salary"
                      min="0"
                      step="100"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter monthly salary"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Enter employee address"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewEmployeeForm(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Here you would normally handle form submission
                      // For demo purposes, we'll just close the form
                      setShowNewEmployeeForm(false)
                    }}
                    className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Employee Details Modal */}
      {showEmployeeDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
                <button onClick={() => setShowEmployeeDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Header */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xl">
                    {showEmployeeDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{showEmployeeDetails.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{showEmployeeDetails.email}</p>
                    </div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        showEmployeeDetails.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {showEmployeeDetails.status.charAt(0).toUpperCase() + showEmployeeDetails.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="text-sm font-medium text-gray-900">{showEmployeeDetails.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">{showEmployeeDetails.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Join Date</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-gray-900">{formatDate(showEmployeeDetails.joinDate)}</p>
                        <span className="text-xs text-amber-600">({calculateYearsOfService(showEmployeeDetails.joinDate)})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Salary</p>
                      <p className="text-sm font-medium text-gray-900">${showEmployeeDetails.salary.toLocaleString()}/month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm font-medium text-gray-900">{showEmployeeDetails.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{showEmployeeDetails.address}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                  {showEmployeeDetails.status === "inactive" ? (
                    <button
                      onClick={() => {
                        activateEmployee(showEmployeeDetails.id)
                        setShowEmployeeDetails(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Activate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        deactivateEmployee(showEmployeeDetails.id)
                        setShowEmployeeDetails(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all"
                    >
                      <X className="h-4 w-4" />
                      <span>Deactivate</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteEmployee(showEmployeeDetails.id)
                      setShowEmployeeDetails(null)
                    }}
                    className="flex items-center justify-center gap-1 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 transition-all"
                  >
                    <X className="h-4 w-4" />
                    <span>Delete</span>
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