"use client"

import { useState } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Bed,
  Users,
  Wifi,
  Tv,
  Coffee,
  Bath,
  DollarSign,
  Tag,
  Home
} from "lucide-react"

export default function Rooms() {
  // State for room management
  const [showNewRoomForm, setShowNewRoomForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showRoomDetails, setShowRoomDetails] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "standard",
    price: "",
    capacity: "2",
    status: "available",
    amenities: {
      wifi: true,
      tv: true,
      airCon: true,
      minibar: false,
      bathtub: false
    },
    description: "",
    image: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  
  // Sample room data
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: "101",
      roomType: "standard",
      price: 120,
      capacity: 2,
      status: "available",
      amenities: {
        wifi: true,
        tv: true,
        airCon: true,
        minibar: false,
        bathtub: false
      },
      description: "Comfortable standard room with city view",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 2,
      roomNumber: "201",
      roomType: "deluxe",
      price: 200,
      capacity: 2,
      status: "occupied",
      amenities: {
        wifi: true,
        tv: true,
        airCon: true,
        minibar: true,
        bathtub: true
      },
      description: "Spacious deluxe room with ocean view",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 3,
      roomNumber: "301",
      roomType: "suite",
      price: 350,
      capacity: 4,
      status: "maintenance",
      amenities: {
        wifi: true,
        tv: true,
        airCon: true,
        minibar: true,
        bathtub: true
      },
      description: "Luxurious suite with separate living area",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ])

  // Helper functions for room management
  const getRoomTypeLabel = (type) => {
    const types = {
      standard: "Standard",
      deluxe: "Deluxe",
      suite: "Suite",
      executive: "Executive Suite",
      family: "Family Room"
    }
    return types[type] || type
  }

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      occupied: "bg-blue-100 text-blue-800",
      maintenance: "bg-amber-100 text-amber-800",
      reserved: "bg-purple-100 text-purple-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }
  
  // Filter rooms based on status and search query
  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getRoomTypeLabel(room.roomType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

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
  
  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Room number validation
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required"
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    // Image URL validation
    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const newRoom = {
        id: rooms.length + 1,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        status: formData.status,
        amenities: formData.amenities,
        description: formData.description,
        image: formData.image
      }
      setRooms([...rooms, newRoom])
      setFormData({
        roomNumber: "",
        roomType: "standard",
        price: "",
        capacity: "2",
        status: "available",
        amenities: {
          wifi: true,
          tv: true,
          airCon: true,
          minibar: false,
          bathtub: false
        },
        description: "",
        image: ""
      })
      setShowNewRoomForm(false)
    }
  }
  
  // Handle room status change
  const changeRoomStatus = (id, newStatus) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, status: newStatus } : room)))
  }

  // Delete room
  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  return (
    <SuperAdminLayout>
      {/* Room Details Modal */}
      {showRoomDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Room Details</h3>
                <button onClick={() => setShowRoomDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Room Image */}
                <div className="h-64 w-full overflow-hidden rounded-lg">
                  <img
                    src={showRoomDetails.image}
                    alt={`Room ${showRoomDetails.roomNumber}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Room Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Room {showRoomDetails.roomNumber}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{getRoomTypeLabel(showRoomDetails.roomType)}</p>
                    </div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        getStatusColor(showRoomDetails.status)
                      }`}
                    >
                      {showRoomDetails.status.charAt(0).toUpperCase() + showRoomDetails.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                      <span className="text-2xl font-bold text-amber-600">{showRoomDetails.price}</span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Max {showRoomDetails.capacity} {showRoomDetails.capacity === 1 ? 'person' : 'people'}</p>
                    </div>
                  </div>
                </div>

                {/* Room Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{showRoomDetails.description}</p>
                </div>
                
                {/* Amenities */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {showRoomDetails.amenities.wifi && (
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-1.5">
                        <Wifi className="h-4 w-4 text-amber-600" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {showRoomDetails.amenities.tv && (
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-1.5">
                        <Tv className="h-4 w-4 text-amber-600" />
                        <span>TV</span>
                      </div>
                    )}
                    {showRoomDetails.amenities.airCon && (
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-1.5">
                        <span>Air Conditioning</span>
                      </div>
                    )}
                    {showRoomDetails.amenities.minibar && (
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-1.5">
                        <Coffee className="h-4 w-4 text-amber-600" />
                        <span>Minibar</span>
                      </div>
                    )}
                    {showRoomDetails.amenities.bathtub && (
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-amber-600" />
                        <span>Bathtub</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                  {showRoomDetails.status === "maintenance" ? (
                    <button
                      onClick={() => {
                        changeRoomStatus(showRoomDetails.id, "available")
                        setShowRoomDetails(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark as Available</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        changeRoomStatus(showRoomDetails.id, "maintenance")
                        setShowRoomDetails(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600 shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1 transition-all"
                    >
                      <span>Set to Maintenance</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteRoom(showRoomDetails.id)
                      setShowRoomDetails(null)
                    }}
                    className="flex items-center justify-center gap-1 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Room Form Modal */}
      {showNewRoomForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Room</h3>
                <button onClick={() => setShowNewRoomForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
      
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter room number"
                    />
                    {errors.roomNumber && <p className="text-xs text-red-600">{errors.roomNumber}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="executive">Executive Suite</option>
                      <option value="family">Family Room</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Night
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter price"
                      min="0"
                    />
                    {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <select
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6">6 People</option>
                    </select>
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
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter image URL"
                    />
                    {errors.image && <p className="text-xs text-red-600">{errors.image}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wifi"
                        checked={formData.amenities.wifi}
                        onChange={() => handleAmenityChange("wifi")}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="wifi" className="ml-2 block text-sm text-gray-700">
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="tv"
                        checked={formData.amenities.tv}
                        onChange={() => handleAmenityChange("tv")}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="tv" className="ml-2 block text-sm text-gray-700">
                        TV
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="airCon"
                        checked={formData.amenities.airCon}
                        onChange={() => handleAmenityChange("airCon")}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="airCon" className="ml-2 block text-sm text-gray-700">
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="minibar"
                        checked={formData.amenities.minibar}
                        onChange={() => handleAmenityChange("minibar")}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="minibar" className="ml-2 block text-sm text-gray-700">
                        Minibar
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bathtub"
                        checked={formData.amenities.bathtub}
                        onChange={() => handleAmenityChange("bathtub")}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="bathtub" className="ml-2 block text-sm text-gray-700">
                        Bathtub
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Enter room description"
                  ></textarea>
                  {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                </div>
      
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRoomForm(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                  >
                    Add Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
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
                    All Rooms
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("available")}
                  >
                    Available
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("occupied")}
                  >
                    Occupied
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("maintenance")}
                  >
                    Maintenance
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("reserved")}
                  >
                    Reserved
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewRoomForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Room</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Rooms
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "available" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("available")}
          >
            Available
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "occupied" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("occupied")}
          >
            Occupied
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "maintenance" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("maintenance")}
          >
            Maintenance
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "reserved" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("reserved")}
          >
            Reserved
          </button>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Room Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={room.image}
                  alt={`Room ${room.roomNumber}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                {/* Room Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">Room {room.roomNumber}</h3>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-600">{room.price}</span>
                      <span className="text-xs text-gray-500">/night</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-500">{getRoomTypeLabel(room.roomType)}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-500">Max {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                </div>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.wifi && (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <span>WiFi</span>
                    </div>
                  )}
                  {room.amenities.tv && (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 flex items-center gap-1">
                      <Tv className="h-3 w-3" />
                      <span>TV</span>
                    </div>
                  )}
                  {room.amenities.airCon && (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 flex items-center gap-1">
                      <span>AC</span>
                    </div>
                  )}
                  {room.amenities.minibar && (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 flex items-center gap-1">
                      <Coffee className="h-3 w-3" />
                      <span>Minibar</span>
                    </div>
                  )}
                  {room.amenities.bathtub && (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span>Bathtub</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowRoomDetails(room)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Bed className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Bed className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No rooms found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no rooms matching your current filters.</p>
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
    </SuperAdminLayout>
  )
}