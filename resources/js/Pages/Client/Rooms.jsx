"use client"

import { useState, useEffect } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
import { Head, usePage } from "@inertiajs/react"
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
import AddClientBookingModal from "@/Components/SuperAdmin/AddClientBookingModal"
import ClientRoomDetailsModal from "@/Components/SuperAdmin/ClientRoomDetailsModal"
export default function Rooms() {
  // Get the authenticated user from the page props
  const { auth } = usePage().props;
  // Filter and search state
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [capacity, setCapacity] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [dateFilters, setDateFilters] = useState({
    checkIn: "",
    checkOut: ""
  })
  
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
      const response = await axios.get(`/api/client/rooms?_t=${new Date().getTime()}`)
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
    
    // No longer filtering by room status or date availability - showing all rooms regardless of availability
    
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
    axios.post('/api/client/bookings', formData)
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
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative mb-20 overflow-hidden rounded-xl">
          {/* Background image with parallax effect */}
          <div className="absolute inset-0 h-[110%] w-full">
            <img 
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Luxury Hotel Suite" 
              className="h-full w-full object-cover object-center"
              style={{ transform: 'translateY(-5%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
          </div>
          
          {/* Hero content */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <div className="mb-3 inline-block rounded-full bg-[#A67C52]/20 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium tracking-wide text-[#A67C52]">LUXURY ACCOMMODATIONS</span>
              </div>
              <h1 className="mb-3 font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Exquisite <span className="italic text-[#A67C52]">Rooms</span> & <span className="italic text-[#A67C52]">Suites</span>
              </h1>
              <p className="mb-4 max-w-2xl text-sm text-white/80">
                Immerse yourself in luxury and comfort in our meticulously designed accommodations.
              </p>
            </div>
          </div>
          
          {/* Curved bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }}></div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="relative z-20 mx-auto -mt-28 mb-12 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-white p-1 shadow-2xl">
            <div className="flex flex-col gap-1 md:flex-row">
              {/* Search */}
              <div className="relative flex-1 p-3">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                  <Search className="h-5 w-5 text-[#8B5A2B]" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-xl border-0 bg-gray-50 p-4 pl-14 text-base text-gray-900 outline-none ring-0 transition-all duration-300 placeholder:text-gray-400 focus:bg-[#A67C52]/5 focus:outline-none focus:ring-0"
                  placeholder="Search by room type or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Check-in Date Filter */}
              <div className="relative p-3 md:w-48">
                <div className="group relative">
                  <div className="flex w-full items-center justify-between rounded-xl bg-gray-50 p-4 text-base text-gray-900 transition-all duration-300 hover:bg-[#A67C52]/5">
                    <div className="flex items-center w-full">
                      <Calendar className="mr-3 h-5 w-5 text-[#8B5A2B]" />
                      <input 
                        type="date" 
                        className="w-full bg-transparent border-none outline-none p-0 text-gray-900"
                        placeholder="Check-in"
                        value={dateFilters.checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDateFilters({...dateFilters, checkIn: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Check-out Date Filter */}
              <div className="relative p-3 md:w-48">
                <div className="group relative">
                  <div className="flex w-full items-center justify-between rounded-xl bg-gray-50 p-4 text-base text-gray-900 transition-all duration-300 hover:bg-[#A67C52]/5">
                    <div className="flex items-center w-full">
                      <Calendar className="mr-3 h-5 w-5 text-[#8B5A2B]" />
                      <input 
                        type="date" 
                        className="w-full bg-transparent border-none outline-none p-0 text-gray-900"
                        placeholder="Check-out"
                        value={dateFilters.checkOut}
                        min={dateFilters.checkIn || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDateFilters({...dateFilters, checkOut: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              
              

            </div>
          </div>
        </div>
        

        
        {/* Room Heading */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-serif text-3xl font-bold text-[#5D3A1F] md:text-4xl">Our Exquisite Accommodations</h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]"></div>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover the perfect blend of comfort and elegance in our thoughtfully designed rooms and suites
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="group overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 animate-pulse">
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-300 to-transparent"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <div className="h-10 bg-gray-200 rounded-full w-28"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-28"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-xl">
              <div className="mb-6 rounded-full bg-red-50 p-6">
                <AlertCircle className="h-14 w-14 text-red-500" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900">Error Loading Rooms</h3>
              <p className="mb-8 max-w-md text-gray-500">{error}</p>
              <button
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-[#8B5A2B] hover:to-[#6B4226]"
                onClick={fetchRooms}
              >
                <span className="relative z-10 flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-[#6B4226] transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
          ) : filteredRooms.length > 0 ? (
            // Room cards
            filteredRooms.map((room) => (
              <div key={room.id} className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Room Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={room.image ? `/storage/${room.image}` : "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
                    alt={room.roomType}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
                  
                  {/* Price tag */}
                  <div className="absolute right-2 top-2">
                    <div className="overflow-hidden rounded-full bg-white/90 shadow-sm">
                      <div className="bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 px-2 py-1">
                        <span className="block text-center text-[10px] font-medium uppercase tracking-wide text-[#8B5A2B]">From</span>
                        <span className="block text-center text-sm font-bold text-[#6B4226]">${room.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Room Type Badge */}
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full bg-[#A67C52]/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                      {room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
                    </span>
                  </div>
                  
                  {/* Room Status Badge */}
                  <div className="absolute left-2 bottom-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm flex items-center ${room.status === 'available' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                      {room.status === 'available' ? (
                        <>
                          <Check className="h-3 w-3 mr-0.5" /> Available
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-0.5" /> Occupied
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Room Details */}
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#5D3A1F]">{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</h3>
                    {room.rating && (
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(Math.floor(room.rating))].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#A67C52] text-[#A67C52]" />
                          ))}
                        </div>
                        <span className="ml-1 text-[10px] font-medium text-gray-500">{room.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-1 flex items-center text-xs text-gray-500">
                    <MapPin className="mr-1 h-3 w-3 text-[#8B5A2B]" />
                    <span>Room {room.roomNumber}</span>
                  </div>
                  
                  <p className="mb-2 text-xs text-gray-600 line-clamp-1">{room.description}</p>
                  
                  {/* Room Features */}
                  <div className="mb-3 grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                        <Bed className="h-2.5 w-2.5 text-[#8B5A2B]" />
                      </div>
                      <span>{room.beds || `${room.capacity} Bed${room.capacity !== 1 ? 's' : ''}`}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#A67C52]/10">
                        <Users className="h-2.5 w-2.5 text-[#8B5A2B]" />
                      </div>
                      <span>{room.capacity} guest{room.capacity !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 rounded-full border border-[#A67C52]/30 bg-white px-2 py-1.5 text-xs font-medium text-[#8B5A2B] transition-all duration-300 hover:bg-[#A67C52]/10 hover:border-[#A67C52]/50"
                      onClick={() => setSelectedRoom(room)}
                    >
                      Details
                    </button>
                    <button
                      className="flex-1 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-2 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-300 hover:from-[#8B5A2B] hover:to-[#6B4226]"
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
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-xl">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#A67C52]/10">
                <Bed className="h-10 w-10 text-[#8B5A2B]" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-[#5D3A1F]">No Rooms Found</h3>
              <p className="mb-8 max-w-md text-gray-600">
                We couldn't find any rooms matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                className="group relative overflow-hidden rounded-full border border-[#A67C52]/30 bg-white px-8 py-3 text-sm font-semibold text-[#8B5A2B] transition-all duration-300 hover:bg-[#A67C52]/10 hover:border-[#A67C52]/50"
                onClick={() => {
                  setFilterType("all")
                  setSearchQuery("")
                  setPriceRange([0, maxPrice])
                  setCapacity(1)
                }}
              >
                <span className="relative z-10 flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Reset All Filters
                </span>
              </button>
            </div>
          )}
        </div>
        

        
        {/* Room Details Modal */}
        {selectedRoom && !showBookingForm && (
          <ClientRoomDetailsModal
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            setShowBookingForm={setShowBookingForm}
            isOpen={!showBookingForm}
            onClose={() => setSelectedRoom(null)}
          />
        )}
        
        {/* Booking Form Modal */}
        {selectedRoom && showBookingForm && (
          <AddClientBookingModal
            setShowAddBookingForm={(show) => {
              // When modal is closed (show=false), also clear the selected room
              if (!show) {
                setSelectedRoom(null)
              }
              setShowBookingForm(show)
            }}
            handleAddBookingSubmit={() => {
              // Refresh rooms data to update availability
              fetchRooms()
              // Clear selected room and close modal
              setSelectedRoom(null)
              setShowBookingForm(false)
            }}
            availableRooms={[selectedRoom]}
            clientId={auth.user.id}
          />
        )}
      </div>
    </ClientLayout>
  )
}