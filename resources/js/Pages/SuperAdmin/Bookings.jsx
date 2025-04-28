import React, { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Search,
  Filter,
  Calendar,
  Bed,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  Trash,
  Users,
  DollarSign,
  Plus,
  Tag,  
  Eye
} from "lucide-react";

export default function Bookings() {
  // State for bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingNumber: "BK-2025-001",
      guestName: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      roomNumber: "101",
      roomType: "deluxe",
      checkInDate: "2025-03-20",
      checkOutDate: "2025-03-25",
      nights: 5,
      adults: 2,
      children: 1,
      totalAmount: 750,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      specialRequests: "Late check-in, around 10 PM. Extra pillows please.",
      createdAt: "2025-03-10",
    },
    {
      id: 2,
      bookingNumber: "BK-2025-002",
      guestName: "Maria Garcia",
      email: "maria.g@example.com",
      phone: "+1 (555) 987-6543",
      roomNumber: "205",
      roomType: "standard",
      checkInDate: "2025-03-18",
      checkOutDate: "2025-03-21",
      nights: 3,
      adults: 1,
      children: 0,
      totalAmount: 300,
      paymentStatus: "pending",
      bookingStatus: "pending",
      specialRequests: "",
      createdAt: "2025-03-11",
    },
    {
      id: 3,
      bookingNumber: "BK-2025-003",
      guestName: "David Johnson",
      email: "david.j@example.com",
      phone: "+1 (555) 456-7890",
      roomNumber: "310",
      roomType: "suite",
      checkInDate: "2025-03-15",
      checkOutDate: "2025-03-18",
      nights: 3,
      adults: 2,
      children: 2,
      totalAmount: 900,
      paymentStatus: "paid",
      bookingStatus: "checked_in",
      specialRequests: "High floor with city view if possible.",
      createdAt: "2025-03-12",
    },
    {
      id: 4,
      bookingNumber: "BK-2025-004",
      guestName: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 789-0123",
      roomNumber: "402",
      roomType: "family",
      checkInDate: "2025-03-22",
      checkOutDate: "2025-03-26",
      nights: 4,
      adults: 2,
      children: 3,
      totalAmount: 1200,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      specialRequests: "Need a baby crib and children's amenities.",
      createdAt: "2025-03-13",
    },
    {
      id: 5,
      bookingNumber: "BK-2025-005",
      guestName: "Robert Chen",
      email: "robert.c@example.com",
      phone: "+1 (555) 234-5678",
      roomNumber: "118",
      roomType: "executive",
      checkInDate: "2025-03-17",
      checkOutDate: "2025-03-19",
      nights: 2,
      adults: 1,
      children: 0,
      totalAmount: 580,
      paymentStatus: "paid",
      bookingStatus: "completed",
      specialRequests: "Early check-in around 11 AM if possible.",
      createdAt: "2025-03-10",
    },
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBookingDetails, setShowBookingDetails] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showAddBookingForm, setShowAddBookingForm] = useState(false);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Function to toggle card expansion
  const toggleCardExpansion = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Function to show booking details
  const handleViewDetails = (booking) => {
    setShowBookingDetails(booking);
  };

  // Function to update booking status
  const updateBookingStatus = (id, status) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, bookingStatus: status } : booking
      )
    );
    setShowBookingDetails(null);
  };

  // Function to cancel booking
  const cancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, bookingStatus: "cancelled" } : booking
        )
      );
      setShowBookingDetails(null);
    }
  };

  // Function to delete booking
  const deleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      setBookings(bookings.filter((booking) => booking.id !== id));
      setShowBookingDetails(null);
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "checked_in":
        return "bg-blue-100 text-blue-800";
      case "checked_out":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get room type label
  const getRoomTypeLabel = (type) => {
    switch (type) {
      case "standard":
        return "Standard Room";
      case "deluxe":
        return "Deluxe Room";
      case "suite":
        return "Suite";
      case "executive":
        return "Executive Suite";
      case "family":
        return "Family Room";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: bookings.length + 1,
      bookingNumber: `BK-${new Date().getFullYear()}-${bookings.length + 1}`,
      guestName: e.target.guestName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      roomNumber: e.target.roomNumber.value,
      roomType: "standard",
      checkInDate: e.target.checkInDate.value,
      checkOutDate: e.target.checkOutDate.value,
      nights: Math.round((new Date(e.target.checkOutDate.value) - new Date(e.target.checkInDate.value)) / (1000 * 3600 * 24)),
      adults: parseInt(e.target.adults.value),
      children: parseInt(e.target.children.value),
      totalAmount: 0,
      paymentStatus: "pending",
      bookingStatus: "pending",
      specialRequests: e.target.specialRequests.value,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings([...bookings, newBooking]);
    setShowAddBookingForm(false);
  };

  return (
    <SuperAdminLayout>
      {/* Booking Details Modal */}
      {showBookingDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button onClick={() => setShowBookingDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Booking Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">#{showBookingDetails.bookingNumber}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Created on {formatDate(showBookingDetails.createdAt)}</p>
                    </div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        showBookingDetails.bookingStatus
                      )}`}
                    >
                      {showBookingDetails.bookingStatus.charAt(0).toUpperCase() + showBookingDetails.bookingStatus.slice(1).replace("_", " ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                      <span className="text-2xl font-bold text-amber-600">{showBookingDetails.totalAmount}</span>
                    </div>
                    <div
                      className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        showBookingDetails.paymentStatus
                      )}`}
                    >
                      {showBookingDetails.paymentStatus.charAt(0).toUpperCase() + showBookingDetails.paymentStatus.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Guest Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium">{showBookingDetails.guestName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{showBookingDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{showBookingDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Guests</p>
                        <p className="text-sm font-medium">
                          {showBookingDetails.adults} {showBookingDetails.adults === 1 ? "Adult" : "Adults"}
                          {showBookingDetails.children > 0 &&
                            `, ${showBookingDetails.children} ${showBookingDetails.children === 1 ? "Child" : "Children"}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Booking Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Room</p>
                        <p className="text-sm font-medium">
                          Room {showBookingDetails.roomNumber} ({getRoomTypeLabel(showBookingDetails.roomType)})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-in Date</p>
                        <p className="text-sm font-medium">{formatDate(showBookingDetails.checkInDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-out Date</p>
                        <p className="text-sm font-medium">{formatDate(showBookingDetails.checkOutDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Length of Stay</p>
                        <p className="text-sm font-medium">{showBookingDetails.nights} {showBookingDetails.nights === 1 ? "Night" : "Nights"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {showBookingDetails.specialRequests && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{showBookingDetails.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                  {showBookingDetails.bookingStatus === "pending" && (
                    <button
                      onClick={() => updateBookingStatus(showBookingDetails.id, "confirmed")}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm Booking</span>
                    </button>
                  )}
                  {(showBookingDetails.bookingStatus === "confirmed" || showBookingDetails.bookingStatus === "pending") && (
                    <button
                      onClick={() => cancelBooking(showBookingDetails.id)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                  {showBookingDetails.bookingStatus === "confirmed" && (
                    <button
                      onClick={() => updateBookingStatus(showBookingDetails.id, "checked_in")}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Check In</span>
                    </button>
                  )}
                  {showBookingDetails.bookingStatus === "checked_in" && (
                    <button
                      onClick={() => updateBookingStatus(showBookingDetails.id, "checked_out")}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Check Out</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(showBookingDetails.id)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 transition-all"
                  >
                    <Trash className="h-4 w-4 text-gray-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddBookingForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Booking</h3>
                <button onClick={() => setShowAddBookingForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                    <input type="text" id="guestName" name="guestName" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter guest name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" name="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter email" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <select id="roomNumber" name="roomNumber" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200">
                      <option value="">Select a room</option>
                      {/* Map through available rooms here to create options */}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <input type="date" id="checkInDate" name="checkInDate" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                  </div>
                  <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <input type="date" id="checkOutDate" name="checkOutDate" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                  </div>
                  <div>
                    <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">Number of Adults</label>
                    <input type="number" id="adults" name="adults" min="1" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter number of adults" />
                  </div>
                  <div>
                    <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
                    <input type="number" id="children" name="children" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter number of children" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea id="specialRequests" name="specialRequests" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter any special requests"></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => setShowAddBookingForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg">Add Booking</button>
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
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowAddBookingForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Booking</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            onClick={() => handleStatusFilterChange("all")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => handleStatusFilterChange("pending")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilterChange("confirmed")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "confirmed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusFilterChange("checked_in")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "checked_in" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Checked In
          </button>
          <button
            onClick={() => handleStatusFilterChange("checked_out")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "checked_out" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Checked Out
          </button>
          <button
            onClick={() => handleStatusFilterChange("cancelled")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${statusFilter === "cancelled" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredBookings.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500">No bookings found matching your criteria.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1).replace("_", " ")}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-600">{booking.totalAmount}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {booking.guestName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span>#{booking.bookingNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </span>
                    <span className="text-xs text-gray-500">({booking.nights} {booking.nights === 1 ? "night" : "nights"})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Bed className="h-3 w-3 text-gray-400" />
                    <span>
                      Room {booking.roomNumber} ({getRoomTypeLabel(booking.roomType)})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span>
                      {booking.adults} {booking.adults === 1 ? "Adult" : "Adults"}
                      {booking.children > 0 &&
                        `, ${booking.children} ${booking.children === 1 ? "Child" : "Children"}`}
                    </span>
                  </div>
                  
                  {booking.specialRequests && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">Special requests: </span>
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}