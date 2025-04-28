"use client"

import { useState } from "react"
import { Head } from '@inertiajs/react'
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Download,
  X,
  CheckCircle,
  Eye,
  FileText,
  BarChart2,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Coffee,
  Bed,
  Printer,
  FileSpreadsheet
} from "lucide-react"

export default function Reports({ auth }) {
  const [showGenerateReport, setShowGenerateReport] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showReportDetails, setShowReportDetails] = useState(null)
  const [dateRange, setDateRange] = useState("weekly")
  
  // Form state
  const [formData, setFormData] = useState({
    reportType: "sales",
    startDate: "",
    endDate: "",
    department: "all",
    format: "pdf"
  })
  
  // Sample reports data
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Monthly Sales Report",
      type: "sales",
      department: "restaurant",
      period: "March 2025",
      generatedDate: "2025-03-15T08:30:00",
      status: "completed",
      summary: {
        totalSales: 158750.00,
        transactions: 425,
        topItems: ["Grilled Salmon", "Wine Pairing", "Chef's Special"]
      }
    },
    {
      id: 2,
      title: "Weekly Occupancy Report",
      type: "occupancy",
      department: "hotel",
      period: "Week 11, 2025",
      generatedDate: "2025-03-14T14:15:00",
      status: "completed",
      summary: {
        averageOccupancy: 85.5,
        totalBookings: 112,
        revenue: 245000.00
      }
    },
    {
      id: 3,
      title: "Inventory Status Report",
      type: "inventory",
      department: "all",
      period: "Q1 2025",
      generatedDate: "2025-03-13T10:20:00",
      status: "completed",
      summary: {
        totalItems: 856,
        lowStock: 23,
        value: 125000.00
      }
    },
    {
      id: 4,
      title: "Staff Performance Report",
      type: "staff",
      department: "all",
      period: "February 2025",
      generatedDate: "2025-03-01T09:00:00",
      status: "completed",
      summary: {
        totalStaff: 45,
        topPerformers: 5,
        averageRating: 4.2
      }
    },
    {
      id: 5,
      title: "Customer Feedback Analysis",
      type: "feedback",
      department: "all",
      period: "Q4 2024",
      generatedDate: "2025-01-01T11:30:00",
      status: "completed",
      summary: {
        totalFeedback: 320,
        averageRating: 4.5,
        topComplaints: ["WiFi", "Parking", "Room Service"]
      }
    }
  ])

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "sales":
        return <DollarSign className="h-3 w-3 text-amber-600" />
      case "occupancy":
        return <Bed className="h-3 w-3 text-amber-600" />
      case "inventory":
        return <BarChart2 className="h-3 w-3 text-amber-600" />
      case "staff":
        return <Users className="h-3 w-3 text-amber-600" />
      case "feedback":
        return <FileText className="h-3 w-3 text-amber-600" />
      default:
        return null
    }
  }

  const getDepartmentIcon = (department) => {
    switch (department) {
      case "restaurant":
        return <Coffee className="h-3 w-3 text-gray-400" />
      case "hotel":
        return <Bed className="h-3 w-3 text-gray-400" />
      case "all":
        return <FileText className="h-3 w-3 text-gray-400" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesCategory = filterCategory === "all" || report.type === filterCategory
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.period.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Reports</h2>
      }
    >
      <Head title="Reports" />

      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
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
                    onClick={() => setFilterCategory("all")}
                  >
                    All Reports
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterCategory("sales")}
                  >
                    Sales Reports
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterCategory("occupancy")}
                  >
                    Occupancy Reports
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterCategory("inventory")}
                  >
                    Inventory Reports
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterCategory("staff")}
                  >
                    Staff Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowGenerateReport(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>

        {/* Report Type Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("all")}
          >
            All Reports
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "sales" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("sales")}
          >
            Sales
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "occupancy" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("occupancy")}
          >
            Occupancy
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "inventory" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("inventory")}
          >
            Inventory
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "staff" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("staff")}
          >
            Staff
          </button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-3">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{report.title}</h3>
                    {report.type === "sales" && (
                      <div className="flex items-center gap-0.5">
                        <DollarSign className="h-3 w-3 text-amber-600" />
                        <span className="font-medium text-xs text-amber-600">
                          {report.summary.totalSales ? formatCurrency(report.summary.totalSales) : "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {getDepartmentIcon(report.department)}
                    <p className="text-xs text-gray-500 truncate capitalize">{report.department}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{report.period}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Ready</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowReportDetails(report)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Report Details</h3>
                <button onClick={() => setShowReportDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Report Title</p>
                  <p className="mt-1 text-gray-900">{showReportDetails.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="mt-1 capitalize text-gray-900">{showReportDetails.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Period</p>
                  <p className="mt-1 text-gray-900">{showReportDetails.period}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Generated Date</p>
                  <p className="mt-1 text-gray-900">{formatDate(showReportDetails.generatedDate)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {showReportDetails.type === "sales" && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Sales</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(showReportDetails.summary.totalSales)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Transactions</p>
                          <p className="text-sm font-medium text-gray-900">{showReportDetails.summary.transactions}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Top Items</p>
                        <ul className="list-disc list-inside">
                          {showReportDetails.summary.topItems.map((item, index) => (
                            <li key={index} className="text-sm text-gray-900">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  {showReportDetails.type === "occupancy" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Average Occupancy</p>
                        <p className="text-sm font-medium text-gray-900">{showReportDetails.summary.averageOccupancy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Bookings</p>
                        <p className="text-sm font-medium text-gray-900">{showReportDetails.summary.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(showReportDetails.summary.revenue)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowReportDetails(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Generate New Report</h3>
                <button onClick={() => setShowGenerateReport(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
                    <select
                      id="reportType"
                      name="reportType"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="sales">Sales Report</option>
                      <option value="occupancy">Occupancy Report</option>
                      <option value="inventory">Inventory Report</option>
                      <option value="staff">Staff Performance Report</option>
                      <option value="feedback">Customer Feedback Report</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      id="department"
                      name="department"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="all">All Departments</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        className="mr-2 text-amber-600 focus:ring-amber-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="excel"
                        className="mr-2 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Excel</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateReport(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Generate Report</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}