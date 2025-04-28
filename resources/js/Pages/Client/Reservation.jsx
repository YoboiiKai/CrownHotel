import React, { useState, useEffect } from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import {
  Calendar,
  Users,
  Check,
  X,
  Info,
  DollarSign,
  Bed,
} from "lucide-react";

export default function Reservation() {
  // State for reservation form
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  
  // State for UI controls
  const [showRoomDetails, setShowRoomDetails] = useState(null);
  const [filterRoomType, setFilterRoomType] = useState("all");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  
  // Room types data
  const [roomTypes, setRoomTypes] = useState([
    {
      id: 1,
      name: "Deluxe King Room",
      description: "Spacious room with king-sized bed, luxury bathroom, and city view",
      price: 199.99,
      capacity: 2,
      amenities: ["King Bed", "Free WiFi", "Flat-screen TV", "Mini Bar", "Room Service"],
      size: "40 m²",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 2,
      name: "Premium Twin Room",
      description: "Comfortable room with two twin beds, modern amenities, and garden view",
      price: 159.99,
      capacity: 2,
      amenities: ["Twin Beds", "Free WiFi", "Flat-screen TV", "Coffee Maker", "Safe"],
      size: "35 m²",
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 3,
      name: "Executive Suite",
      description: "Luxurious suite with separate living area, premium amenities, and panoramic views",
      price: 299.99,
      capacity: 3,
      amenities: ["King Bed", "Separate Living Area", "Jacuzzi", "Free WiFi", "Minibar", "Room Service"],
      size: "65 m²",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 4,
      name: "Family Room",
      description: "Spacious room designed for families with children, featuring multiple beds and family-friendly amenities",
      price: 249.99,
      capacity: 4,
      amenities: ["Queen Bed", "Bunk Beds", "Free WiFi", "Flat-screen TV", "Game Console", "Mini Fridge"],
      size: "55 m²",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 5,
      name: "Honeymoon Suite",
      description: "Romantic suite with king-sized bed, private balcony, and special amenities for couples",
      price: 349.99,
      capacity: 2,
      amenities: ["King Bed", "Private Balcony", "Jacuzzi", "Champagne Service", "Breakfast in Bed", "Spa Access"],
      size: "70 m²",
      image: "https://images.unsplash.com/photo-1602002418082-dd4a8f7a3aca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 6,
      name: "Standard Queen Room",
      description: "Comfortable and affordable room with a queen-sized bed and essential amenities",
      price: 129.99,
      capacity: 2,
      amenities: ["Queen Bed", "Free WiFi", "Flat-screen TV", "Work Desk", "Coffee Maker"],
      size: "30 m²",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ]);
  
  // Filter room types based on capacity and filter selection
  const filteredRoomTypes = roomTypes.filter((room) => {
    const matchesCapacity = (adults + children) <= room.capacity;
    const matchesFilter = filterRoomType === "all" || 
      (filterRoomType === "standard" && room.price < 150) ||
      (filterRoomType === "deluxe" && room.price >= 150 && room.price < 250) ||
      (filterRoomType === "suite" && room.price >= 250);
    
    return matchesCapacity && matchesFilter;
  });
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !roomType) return 0;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const selectedRoom = roomTypes.find(room => room.id === parseInt(roomType));
    if (!selectedRoom) return 0;
    
    return (selectedRoom.price * nights).toFixed(2);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!checkInDate || !checkOutDate || !roomType || !name || !email || !phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Check if check-out date is after check-in date
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return;
    }
    
    // Show confirmation modal
    setShowConfirmation(true);
    
    // Simulate API call
    setTimeout(() => {
      setReservationSuccess(true);
    }, 1500);
  };
  
  // Reset form
  const resetForm = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setRoomType("");
    setSpecialRequests("");
    setName("");
    setEmail("");
    setPhone("");
    setPaymentMethod("credit_card");
    setShowConfirmation(false);
    setReservationSuccess(false);
  };

  return (
    <ClientLayout>
      {/* Room Details Modal */}
      {showRoomDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={showRoomDetails.image}
                alt={showRoomDetails.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setShowRoomDetails(null)}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white">{showRoomDetails.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white">
                    {showRoomDetails.capacity} {showRoomDetails.capacity > 1 ? 'Guests' : 'Guest'}
                  </span>
                  <span className="px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white">
                    {showRoomDetails.size}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">{showRoomDetails.price}</span>
                  <span className="text-gray-500 text-sm">/night</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{showRoomDetails.description}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {showRoomDetails.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => {
                    setRoomType(showRoomDetails.id.toString());
                    setShowRoomDetails(null);
                    document.getElementById('guest-info').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <Bed className="h-4 w-4" />
                  <span>Select This Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            {!reservationSuccess ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Reservation</h3>
                <p className="text-gray-600">Please wait while we confirm your booking...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-green-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
                <p className="text-gray-600 mb-6">Your booking has been successfully confirmed. A confirmation email has been sent to {email}.</p>
                <div className="flex justify-center">
                  <button
                    onClick={resetForm}
                    className="py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-amber-900"
                  >
                    Return to Reservations
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div className="mx-auto max-w-6xl">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Pickers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  >
                    {[0, 1, 2, 3].map(num => (
                      <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={() => document.getElementById('available-rooms').scrollIntoView({ behavior: 'smooth' })}
                className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
              >
                Search Availability
              </button>
            </div>
          </div>
        </div>

        {/* Room Type Tabs */}
        <div id="available-rooms" className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterRoomType === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterRoomType("all")}
          >
            All Rooms
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterRoomType === "standard" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterRoomType("standard")}
          >
            Standard Rooms
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterRoomType === "deluxe" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterRoomType("deluxe")}
          >
            Deluxe Rooms
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterRoomType === "suite" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterRoomType("suite")}
          >
            Suites
          </button>
        </div>
        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filteredRoomTypes.map((room) => (
            <div
              key={room.id}
              className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Room Image */}
              <div 
                className="relative h-48 w-full overflow-hidden cursor-pointer"
                onClick={() => setShowRoomDetails(room)}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {/* Room Info */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 
                      className="text-sm font-semibold text-gray-900 truncate cursor-pointer hover:text-amber-600"
                      onClick={() => setShowRoomDetails(room)}
                    >
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-amber-600" />
                      <span className="font-medium text-amber-600 text-sm">{room.price}</span>
                      <span className="text-xs text-gray-500">/night</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{room.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowRoomDetails(room)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                  >
                    <Info className="h-3 w-3" />
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setRoomType(room.id.toString());
                      document.getElementById('guest-info').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Bed className="h-3 w-3" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Information Form */}
        <div id="guest-info" className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Any special requests or requirements?"
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Selected Room Summary */}
            {roomType && (
              <div className="bg-amber-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Room:</span> {roomTypes.find(r => r.id === parseInt(roomType))?.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Check-in:</span> {checkInDate ? new Date(checkInDate).toLocaleDateString() : 'Not selected'}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Check-out:</span> {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Guests:</span> {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Price per night:</span> ${roomTypes.find(r => r.id === parseInt(roomType))?.price}
                    </p>
                    <p className="text-lg font-bold text-amber-600 mt-2">
                      Total: ${calculateTotalPrice()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!checkInDate || !checkOutDate || !roomType || !name || !email || !phone}
                className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-6 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}