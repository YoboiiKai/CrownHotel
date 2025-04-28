"use client"

import { useState } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import { Users, User, Mail, Phone, Building, X, Plus, Search, Filter, ChevronDown, Eye, EyeOff } from "lucide-react"

export default function Client() {
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showClientDetails, setShowClientDetails] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  
  // Sample client data
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      clientType: "corporate",
      status: "active",
      totalStays: 5,
      totalSpent: 1000,
      lastStay: "2022-01-01T00:00:00.000Z",
      createdAt: "2021-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      company: "",
      clientType: "individual",
      status: "active",
      totalStays: 3,
      totalSpent: 500,
      lastStay: "2022-02-01T00:00:00.000Z",
      createdAt: "2021-02-01T00:00:00.000Z"
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1 (555) 456-7890",
      company: "Global Enterprises",
      clientType: "corporate",
      status: "inactive",
      totalStays: 2,
      totalSpent: 200,
      lastStay: "2022-03-01T00:00:00.000Z",
      createdAt: "2021-03-01T00:00:00.000Z"
    }
  ])
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    clientType: "individual",
    status: "active",
    password: "",
    confirmPassword: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    
    // Company validation for corporate clients
    if (formData.clientType === "corporate" && !formData.company.trim()) {
      newErrors.company = "Company name is required for corporate clients"
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    
    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const newClient = {
        id: clients.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        clientType: formData.clientType,
        status: formData.status,
        createdAt: new Date().toISOString(),
        lastStay: null,
        totalStays: 0,
        totalSpent: 0
      }
      setClients([...clients, newClient])
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        clientType: "individual",
        status: "active",
        password: "",
        confirmPassword: ""
      })
      setShowNewClientForm(false)
    }
  }
  
  // Filter clients based on status and search query
  const filteredClients = clients.filter((client) => {
    const matchesStatus = filterStatus === "all" || client.status === filterStatus
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })
  
  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }
  
  // Handle client activation
  const activateClient = (id) => {
    setClients(clients.map((client) => (client.id === id ? { ...client, status: "active" } : client)))
  }
  
  // Handle client deactivation
  const deactivateClient = (id) => {
    setClients(clients.map((client) => (client.id === id ? { ...client, status: "inactive" } : client)))
  }
  
  // Delete client
  const deleteClient = (id) => {
    setClients(clients.filter((client) => client.id !== id))
  }
  
  return (
    <SuperAdminLayout>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              >
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Client</span>
          </button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Clients
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

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-5">
                {/* Client Name and Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg">
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </div>
                </div>

                {/* Client Type Badge */}
                <div className="mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.clientType === "corporate" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {client.clientType === "corporate" ? "Corporate" : "Individual"}
                  </span>
                  {client.company && (
                    <span className="ml-2 text-sm text-gray-600">
                      {client.company}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowClientDetails(client)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <User className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no clients matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setSearchQuery("")
              }}
              className="rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* New Client Form Modal */}
        {showNewClientForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
                  <button onClick={() => setShowNewClientForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Client Type Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="clientType"
                          value="individual"
                          checked={formData.clientType === "individual"}
                          onChange={handleInputChange}
                          className="form-radio h-4 w-4 text-amber-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">Individual</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="clientType"
                          value="corporate"
                          checked={formData.clientType === "corporate"}
                          onChange={handleInputChange}
                          className="form-radio h-4 w-4 text-amber-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">Corporate</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter full name"
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company {formData.clientType === "corporate" && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter company name"
                      />
                      {errors.company && <p className="text-xs text-red-600 mt-1">{errors.company}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter address"
                      />
                      {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter city"
                      />
                      {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter country"
                      />
                      {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewClientForm(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                    >
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Client Details Modal */}
        {showClientDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Client Details</h3>
                  <button onClick={() => setShowClientDetails(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Client Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                    {showClientDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{showClientDetails.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-amber-500" />
                      <p className="text-sm text-gray-600">{showClientDetails.email}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-amber-500" />
                      <p className="text-sm text-gray-600">{showClientDetails.phone}</p>
                    </div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        showClientDetails.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {showClientDetails.status.charAt(0).toUpperCase() + showClientDetails.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Client Type */}
                <div className="mb-6">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    showClientDetails.clientType === "corporate" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {showClientDetails.clientType === "corporate" ? "Corporate Client" : "Individual Client"}
                  </div>
                  {showClientDetails.company && (
                    <div className="mt-2 flex items-center gap-2">
                      <Building className="h-4 w-4 text-amber-500" />
                      <p className="text-sm text-gray-700">{showClientDetails.company}</p>
                    </div>
                  )}
                </div>

                {/* Client Details */}
                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-amber-800 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Address</label>
                      <p className="text-sm text-gray-700">{showClientDetails.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">City</label>
                      <p className="text-sm text-gray-700">{showClientDetails.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Country</label>
                      <p className="text-sm text-gray-700">{showClientDetails.country || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-700 mb-1">Postal Code</label>
                      <p className="text-sm text-gray-700">{showClientDetails.postalCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Stay History */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Stay History</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Total Stays</div>
                      <div className="text-lg font-semibold text-amber-700">{showClientDetails.totalStays || 0}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Total Spent</div>
                      <div className="text-lg font-semibold text-amber-700">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(showClientDetails.totalSpent || 0)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Last Stay</div>
                      <div className="text-sm font-medium text-gray-700">
                        {showClientDetails.lastStay ? formatDate(showClientDetails.lastStay) : 'No stays yet'}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Client Since</div>
                      <div className="text-sm font-medium text-gray-700">
                        {showClientDetails.createdAt ? formatDate(showClientDetails.createdAt) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  {showClientDetails.status === "inactive" ? (
                    <button
                      type="button"
                      onClick={() => {
                        activateClient(showClientDetails.id)
                        setShowClientDetails({...showClientDetails, status: "active"})
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Activate Client
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        deactivateClient(showClientDetails.id)
                        setShowClientDetails({...showClientDetails, status: "inactive"})
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Deactivate Client
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
                        deleteClient(showClientDetails.id)
                        setShowClientDetails(null)
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}