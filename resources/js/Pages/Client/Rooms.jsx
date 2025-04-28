"use client"

import { useState, useEffect } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
import { Head } from "@inertiajs/react"
import {
  Search,
  Filter,
  ChevronDown,
  Bed,
  Users,
  Bath,
  Wifi,
  Coffee,
  Utensils,
  Tv,
  Wind,
  DollarSign,
  Calendar,
  X,
  Check,
  Star,
  MapPin,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
  Info,
  Sparkles,
  AlertCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  ClipboardCheck
} from "lucide-react"
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify"
export default function Rooms() {
  // Filter and search state
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [capacity, setCapacity] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  // Room details and booking state
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingDates, setBookingDates] = useState({
    checkIn: "",
    checkOut: ""
  })
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    specialRequests: ""
  })
  const [bookingErrors, setBookingErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Room data state
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [maxPrice, setMaxPrice] = useState(1000)

  // Fetch rooms data when component mounts
  useEffect(() => {
    fetchRooms()
  }, [])

  // Fetch rooms data from the API
  const fetchRooms = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/rooms?_t=${new Date().getTime()}`)
      if (response.data) {
        setRooms(response.data)
        
        // Extract unique room types for filter dropdown
        const types = [...new Set(response.data.map(room => room.roomType))]
        setRoomTypes(types.map(type => type.charAt(0).toUpperCase() + type.slice(1)))
        
        // Find the maximum price for the price range filter
        const highestPrice = Math.max(...response.data.map(room => room.price))
        setMaxPrice(Math.ceil(highestPrice / 100) * 100) // Round up to nearest hundred
        setPriceRange([0, Math.ceil(highestPrice / 100) * 100])
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setError("Failed to load rooms. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter rooms based on search and filter criteria
  const filteredRooms = rooms.filter(room => {
    // Filter by room type
    if (filterType !== "all" && room.roomType.toLowerCase() !== filterType.toLowerCase()) {
      return false
    }
    
    // Filter by search query
    if (searchQuery && !room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !room.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    // Filter by price range
    if (room.price < priceRange[0] || room.price > priceRange[1]) {
      return false
    }
    
    // Filter by capacity
    if (room.capacity < capacity) {
      return false
    }
    
    // Filter by availability
    if (room.status !== 'available') {
      return false
    }
    
    return true
  })

  // Handle booking form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = {}
    if (!bookingDates.checkIn) errors.checkIn = "Check-in date is required"
    if (!bookingDates.checkOut) errors.checkOut = "Check-out date is required"
    if (!guestInfo.name.trim()) errors.name = "Name is required"
    if (!guestInfo.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) errors.email = "Email is invalid"
    if (!guestInfo.phone.trim()) errors.phone = "Phone number is required"
    
    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors)
      return
    }
    
    // Set loading state
    setIsSubmitting(true)
    
    // Prepare form data
    const formData = new FormData()
    formData.append("roomId", selectedRoom.id)
    formData.append("checkInDate", bookingDates.checkIn)
    formData.append("checkOutDate", bookingDates.checkOut)
    formData.append("guestName", guestInfo.name)
    formData.append("email", guestInfo.email)
    formData.append("phone", guestInfo.phone)
    formData.append("guests", guestInfo.guests)
    formData.append("specialRequests", guestInfo.specialRequests)
    
    // Submit booking to the server
    axios.post('/api/bookings', formData)
      .then(response => {
        toast.success("Booking confirmed successfully!")
        
        // Reset form
        setBookingDates({ checkIn: "", checkOut: "" })
        setGuestInfo({
          name: "",
          email: "",
          phone: "",
          guests: 1,
          specialRequests: ""
        })
        setBookingErrors({})
        setShowBookingForm(false)
        setSelectedRoom(null)
        
        // Refresh rooms data to update availability
        fetchRooms()
      })
      .catch(error => {
        console.error("Booking error:", error)
        
        if (error.response && error.response.data && error.response.data.errors) {
          setBookingErrors(error.response.data.errors)
        } else {
          toast.error("Failed to complete booking. Please try again.")
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <ClientLayout>
      <Head title="Rooms & Suites" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 shadow-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Luxury Hotel Room" 
              className="h-64 w-full object-cover object-center sm:h-80"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl">Rooms & Suites</h1>
              <p className="max-w-2xl text-lg text-white/90 drop-shadow">Experience unparalleled luxury and comfort in our meticulously designed accommodations</p>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Search by room type or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Room Type Filter */}
            <div className="relative">
              <button
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500 sm:w-48"
                onClick={() => document.getElementById("type-dropdown").classList.toggle("hidden")}
              >
                <div className="flex items-center">
                  <Bed className="mr-2 h-4 w-4 text-amber-500" />
                  <span>
                    {filterType === "all"
                      ? "All Room Types"
                      : filterType}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div
                id="type-dropdown"
                className="absolute z-10 mt-1 hidden w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-amber-50"
                      onClick={() => {
                        setFilterType("all")
                        document.getElementById("type-dropdown").classList.add("hidden")
                      }}
                    >
                      All Room Types
                    </button>
                  </li>
                  {roomTypes.map((type, index) => (
                    <li key={index}>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-amber-50"
                        onClick={() => {
                          setFilterType(type)
                          document.getElementById("type-dropdown").classList.add("hidden")
                        }}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Advanced Filters Button */}
            <button
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 hover:bg-amber-50 focus:border-amber-500 focus:ring-amber-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4 text-amber-500" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-8 rounded-xl bg-white p-5 shadow-lg">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Price Range */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Price Range</label>
                <div className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">$0</span>
                    <span className="text-xs text-gray-500">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step={Math.ceil(maxPrice / 20)}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                    style={{
                      background: `linear-gradient(to right, #d97706 0%, #d97706 ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="mt-2 text-center">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      Up to ${priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Guests Capacity */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Guests</label>
                <div className="flex items-center">
                  <button
                    className="rounded-l-lg border border-gray-300 bg-gray-50 p-3 hover:bg-amber-50"
                    onClick={() => capacity > 1 && setCapacity(capacity - 1)}
                  >
                    <Minus className="h-4 w-4 text-amber-500" />
                  </button>
                  <div className="flex w-16 items-center justify-center border-y border-gray-300 bg-white py-3">
                    <Users className="mr-1 h-4 w-4 text-amber-500" />
                    <span>{capacity}</span>
                  </div>
                  <button
                    className="rounded-r-lg border border-gray-300 bg-gray-50 p-3 hover:bg-amber-50"
                    onClick={() => setCapacity(capacity + 1)}
                  >
                    <Plus className="h-4 w-4 text-amber-500" />
                  </button>
                </div>
              </div>
              
              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-amber-50 hover:text-amber-700"
                  onClick={() => {
                    setFilterType("all")
                    setSearchQuery("")
                    setPriceRange([0, maxPrice])
                    setCapacity(1)
                  }}
                >
                  <RefreshCw className="mr-2 inline h-4 w-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Room Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-xl bg-white shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-lg">
              <div className="mb-4 rounded-full bg-red-50 p-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900">Error Loading Rooms</h3>
              <p className="mb-6 max-w-md text-gray-500">{error}</p>
              <button
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700"
                onClick={fetchRooms}
              >
                <RefreshCw className="mr-2 inline h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredRooms.length > 0 ? (
            // Room cards
            filteredRooms.map((room) => (
              <div key={room.id} className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
                {/* Room Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image ? `/storage/${room.image}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"}
                    alt={room.roomType}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white drop-shadow-sm">{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</h3>
                      {room.rating && (
                        <div className="flex items-center rounded-full bg-amber-500 px-2.5 py-1">
                          <Star className="mr-1 h-3.5 w-3.5 fill-white text-white" />
                          <span className="text-xs font-medium text-white">{room.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-700 shadow-md">
                      ${room.price}/night
                    </span>
                  </div>
                </div>
                
                {/* Room Details */}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-amber-500" />
                      <span>Room {room.roomNumber}</span>
                    </div>
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">{room.description}</p>
                  
                  {/* Room Features */}
                  <div className="mb-5 grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Bed className="mr-1.5 h-4 w-4 text-amber-500" />
                      <span>{room.beds || `${room.capacity} Bed${room.capacity !== 1 ? 's' : ''}`}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1.5 h-4 w-4 text-amber-500" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-1.5 h-4 w-4 text-amber-500" />
                      <span>Private bathroom</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="mr-1.5 h-4 w-4 text-amber-500" />
                      <span>Free Wi-Fi</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setSelectedRoom(room)}
                    >
                      View Details
                    </button>
                    <button
                      className="rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700"
                      onClick={() => {
                        setSelectedRoom(room)
                        setShowBookingForm(true)
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-lg">
              <div className="mb-4 rounded-full bg-amber-50 p-4">
                <Bed className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900">No rooms found</h3>
              <p className="mb-6 max-w-md text-gray-500">
                Try adjusting your filters or search criteria to find available rooms.
              </p>
              <button
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50"
                onClick={() => {
                  setFilterType("all")
                  setSearchQuery("")
                  setPriceRange([0, maxPrice])
                  setCapacity(1)
                }}
              >
                <RefreshCw className="mr-2 inline h-4 w-4" />
                Reset All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Room Details Modal */}
        {selectedRoom && !showBookingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 p-5 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-gray-900">{selectedRoom.roomType.charAt(0).toUpperCase() + selectedRoom.roomType.slice(1)} - Room {selectedRoom.roomNumber}</h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Room Images */}
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div className="relative sm:col-span-4 h-64 sm:h-80 overflow-hidden rounded-xl">
                    <img
                      src={selectedRoom.image ? `/storage/${selectedRoom.image}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"}
                      alt={selectedRoom.roomType}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-amber-500 text-amber-500" />
                            <span className="font-medium text-white">{selectedRoom.rating}</span>
                            <span className="ml-1 text-sm text-white/80">({selectedRoom.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-amber-700">
                          ${selectedRoom.price}/night
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedRoom.images && selectedRoom.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-20 overflow-hidden rounded-lg">
                      <img
                        src={`/storage/${image}`}
                        alt={`${selectedRoom.roomType} - Image ${index + 2}`}
                        className="h-full w-full object-cover transition-all hover:opacity-90"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Room Overview */}
                <div className="mb-8">
                  <h4 className="mb-3 text-lg font-medium text-gray-900 flex items-center">
                    <Info className="mr-2 h-5 w-5 text-amber-500" />
                    Overview
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedRoom.description}</p>
                </div>
                
                {/* Room Features */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h4 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                      <Bed className="mr-2 h-5 w-5 text-amber-500" />
                      Room Details
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                          <Users className="h-4 w-4 text-amber-600" />
                        </div>
                        <span>Capacity: {selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'guest' : 'guests'}</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                          <Bed className="h-4 w-4 text-amber-600" />
                        </div>
                        <span>Beds: {selectedRoom.beds || `${selectedRoom.capacity} Bed${selectedRoom.capacity !== 1 ? 's' : ''}`}</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                          <Bath className="h-4 w-4 text-amber-600" />
                        </div>
                        <span>Bathroom: Private bathroom</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                          <MapPin className="h-4 w-4 text-amber-600" />
                        </div>
                        <span>Size: {selectedRoom.size} m²</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h4 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                      Amenities
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {selectedRoom.amenities ? (
                        typeof selectedRoom.amenities === 'string' ? (
                          // Try to parse JSON string
                          (() => {
                            try {
                              const parsedAmenities = JSON.parse(selectedRoom.amenities);
                              return Array.isArray(parsedAmenities) ? 
                                parsedAmenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                                      <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{amenity}</span>
                                  </div>
                                )) : (
                                  <div className="flex items-center col-span-2">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                                      <Info className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <span className="text-gray-700">Amenities information available</span>
                                  </div>
                                );
                            } catch (e) {
                              // If JSON parsing fails, display the string as a single amenity
                              return (
                                <div className="flex items-center">
                                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                                    <Check className="h-4 w-4 text-green-600" />
                                  </div>
                                  <span className="text-gray-700">{selectedRoom.amenities}</span>
                                </div>
                              );
                            }
                          })()
                        ) : Array.isArray(selectedRoom.amenities) ? (
                          // Handle array format
                          selectedRoom.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center">
                              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          ))
                        ) : (
                          // Handle object or other formats
                          <div className="flex items-center col-span-2">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                              <Info className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="text-gray-700">Amenities information available</span>
                          </div>
                        )
                      ) : (
                        // Handle null or undefined
                        <div className="flex items-center col-span-2">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                            <Info className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="text-gray-700">No amenities information available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Booking Form Modal */}
        {selectedRoom && showBookingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 p-5 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-gray-900">Book {selectedRoom.roomType.charAt(0).toUpperCase() + selectedRoom.roomType.slice(1)} - Room {selectedRoom.roomNumber}</h3>
                <button
                  onClick={() => {
                    setShowBookingForm(false)
                    setSelectedRoom(null)
                    setBookingErrors({})
                  }}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-3">
                  {/* Room Summary */}
                  <div className="md:col-span-1">
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 shadow-sm">
                      <h4 className="mb-4 text-lg font-medium text-amber-900 flex items-center">
                        <Bed className="mr-2 h-5 w-5 text-amber-600" />
                        Room Summary
                      </h4>
                      
                      <div className="mb-4 overflow-hidden rounded-lg shadow-sm">
                        <img
                          src={selectedRoom.image ? `/storage/${selectedRoom.image}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"}
                          alt={selectedRoom.roomType}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-lg font-medium text-amber-900">{selectedRoom.roomType.charAt(0).toUpperCase() + selectedRoom.roomType.slice(1)}</h5>
                        <div className="flex items-center text-sm text-amber-700">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          <span>Room {selectedRoom.roomNumber}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4 space-y-2 text-sm">
                        <div className="flex items-center text-amber-700">
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/50">
                            <Users className="h-3.5 w-3.5 text-amber-700" />
                          </div>
                          <span>Up to {selectedRoom.capacity} guests</span>
                        </div>
                        <div className="flex items-center text-amber-700">
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/50">
                            <Bed className="h-3.5 w-3.5 text-amber-700" />
                          </div>
                          <span>{selectedRoom.beds || `${selectedRoom.capacity} Bed${selectedRoom.capacity !== 1 ? 's' : ''}`}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-amber-200 pt-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-amber-700">Price per night</span>
                          <span className="font-medium text-amber-900">${selectedRoom.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Form */}
                  <div className="md:col-span-2">
                    <form onSubmit={handleBookingSubmit}>
                      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Check-in Date */}
                        <div>
                          <label htmlFor="check-in" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Check-in Date *
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Calendar className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="date"
                              id="check-in"
                              className={`block w-full rounded-lg border ${
                                bookingErrors.checkIn ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                              } p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500`}
                              min={new Date().toISOString().split('T')[0]}
                              value={bookingDates.checkIn}
                              onChange={(e) => {
                                setBookingDates({ ...bookingDates, checkIn: e.target.value })
                                if (bookingErrors.checkIn) {
                                  const { checkIn, ...rest } = bookingErrors
                                  setBookingErrors(rest)
                                }
                              }}
                            />
                          </div>
                          {bookingErrors.checkIn && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                              <AlertCircle className="mr-1 h-3.5 w-3.5" />
                              {bookingErrors.checkIn}
                            </p>
                          )}
                        </div>
                        
                        {/* Check-out Date */}
                        <div>
                          <label htmlFor="check-out" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Check-out Date *
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Calendar className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="date"
                              id="check-out"
                              className={`block w-full rounded-lg border ${
                                bookingErrors.checkOut ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                              } p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500`}
                              min={
                                bookingDates.checkIn
                                  ? new Date(new Date(bookingDates.checkIn).getTime() + 86400000)
                                      .toISOString()
                                      .split('T')[0]
                                  : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]
                              }
                              value={bookingDates.checkOut}
                              onChange={(e) => {
                                setBookingDates({ ...bookingDates, checkOut: e.target.value })
                                if (bookingErrors.checkOut) {
                                  const { checkOut, ...rest } = bookingErrors
                                  setBookingErrors(rest)
                                }
                              }}
                            />
                          </div>
                          {bookingErrors.checkOut && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                              <AlertCircle className="mr-1 h-3.5 w-3.5" />
                              {bookingErrors.checkOut}
                            </p>
                          )}
                        </div>
                        
                        {/* Guest Name */}
                        <div>
                          <label htmlFor="guest-name" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Full Name *
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <User className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="text"
                              id="guest-name"
                              className={`block w-full rounded-lg border ${
                                bookingErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                              } p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500`}
                              placeholder="John Doe"
                              value={guestInfo.name}
                              onChange={(e) => {
                                setGuestInfo({ ...guestInfo, name: e.target.value })
                                if (bookingErrors.name) {
                                  const { name, ...rest } = bookingErrors
                                  setBookingErrors(rest)
                                }
                              }}
                            />
                          </div>
                          {bookingErrors.name && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                              <AlertCircle className="mr-1 h-3.5 w-3.5" />
                              {bookingErrors.name}
                            </p>
                          )}
                        </div>
                        
                        {/* Guest Email */}
                        <div>
                          <label htmlFor="guest-email" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Mail className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="email"
                              id="guest-email"
                              className={`block w-full rounded-lg border ${
                                bookingErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                              } p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500`}
                              placeholder="john.doe@example.com"
                              value={guestInfo.email}
                              onChange={(e) => {
                                setGuestInfo({ ...guestInfo, email: e.target.value })
                                if (bookingErrors.email) {
                                  const { email, ...rest } = bookingErrors
                                  setBookingErrors(rest)
                                }
                              }}
                            />
                          </div>
                          {bookingErrors.email && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                              <AlertCircle className="mr-1 h-3.5 w-3.5" />
                              {bookingErrors.email}
                            </p>
                          )}
                        </div>
                        
                        {/* Guest Phone */}
                        <div>
                          <label htmlFor="guest-phone" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Phone className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="tel"
                              id="guest-phone"
                              className={`block w-full rounded-lg border ${
                                bookingErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                              } p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500`}
                              placeholder="+1 (555) 123-4567"
                              value={guestInfo.phone}
                              onChange={(e) => {
                                setGuestInfo({ ...guestInfo, phone: e.target.value })
                                if (bookingErrors.phone) {
                                  const { phone, ...rest } = bookingErrors
                                  setBookingErrors(rest)
                                }
                              }}
                            />
                          </div>
                          {bookingErrors.phone && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                              <AlertCircle className="mr-1 h-3.5 w-3.5" />
                              {bookingErrors.phone}
                            </p>
                          )}
                        </div>
                        
                        {/* Number of Guests */}
                        <div>
                          <label htmlFor="guest-count" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Number of Guests
                          </label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="rounded-l-lg border border-gray-300 bg-gray-50 p-3 transition-colors hover:bg-amber-50"
                              onClick={() => guestInfo.guests > 1 && setGuestInfo({ ...guestInfo, guests: guestInfo.guests - 1 })}
                            >
                              <Minus className="h-4 w-4 text-amber-500" />
                            </button>
                            <div className="flex w-16 items-center justify-center border-y border-gray-300 bg-white py-3">
                              <Users className="mr-1 h-4 w-4 text-amber-500" />
                              <span>{guestInfo.guests}</span>
                            </div>
                            <button
                              type="button"
                              className="rounded-r-lg border border-gray-300 bg-gray-50 p-3 transition-colors hover:bg-amber-50"
                              onClick={() => 
                                guestInfo.guests < selectedRoom.capacity && 
                                setGuestInfo({ ...guestInfo, guests: guestInfo.guests + 1 })
                              }
                            >
                              <Plus className="h-4 w-4 text-amber-500" />
                            </button>
                          </div>
                          <p className="mt-1.5 text-xs text-gray-500">
                            Maximum capacity: {selectedRoom.capacity} guests
                          </p>
                        </div>
                        
                        {/* Special Requests */}
                        <div className="sm:col-span-2">
                          <label htmlFor="special-requests" className="mb-1.5 block text-sm font-medium text-gray-900">
                            Special Requests
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-3">
                              <MessageSquare className="h-4 w-4 text-amber-500" />
                            </div>
                            <textarea
                              id="special-requests"
                              rows="3"
                              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                              placeholder="Any special requests or preferences..."
                              value={guestInfo.specialRequests}
                              onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Summary */}
                      {bookingDates.checkIn && bookingDates.checkOut && (
                        <div className="mb-6 rounded-xl bg-gray-50 p-5 shadow-sm">
                          <h4 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                            <ClipboardCheck className="mr-2 h-5 w-5 text-amber-500" />
                            Booking Summary
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Check-in</span>
                              <span className="font-medium text-gray-900">
                                {new Date(bookingDates.checkIn).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Check-out</span>
                              <span className="font-medium text-gray-900">
                                {new Date(bookingDates.checkOut).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Length of stay</span>
                              <span className="font-medium text-gray-900">
                                {(new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) / (1000 * 60 * 60 * 24)} {((new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) / (1000 * 60 * 60 * 24)) === 1 ? 'night' : 'nights'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                              <span className="text-gray-600">Room rate</span>
                              <span className="font-medium text-gray-900">${selectedRoom.price} / night</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Total</span>
                              <span className="text-xl font-bold text-amber-600">${selectedRoom.price * ((new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowBookingForm(false)
                            setSelectedRoom(null)
                            setBookingErrors({})
                          }}
                          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700"
                        >
                          Complete Booking
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}