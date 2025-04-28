import React, { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Calendar,
  Tag,
  DollarSign,
  Bed,
  Users,
  Eye,
  Edit,
} from "lucide-react";
import BookingDetailsModal from "@/Components/SuperAdmin/BookingDetailsModal";
import UpdateBookingModal from "@/Components/SuperAdmin/UpdateBookingModal";
import AddBookingModal from "@/Components/SuperAdmin/AddBookingModal";

export default function Bookings() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBookingDetails, setShowBookingDetails] = useState(null);
  const [showAddBookingForm, setShowAddBookingForm] = useState(false);
  const [showUpdateBookingForm, setShowUpdateBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.guestName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.bookingNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.phone || '').includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking) => {
    setShowBookingDetails(booking);
  };

  const handleUpdateBooking = (booking) => {
    setSelectedBooking(booking);
    setShowUpdateBookingForm(true);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, bookingStatus: status } : booking
      )
    );
    setShowBookingDetails(null);
  };

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

  const deleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      setBookings(bookings.filter((booking) => booking.id !== id));
      setShowBookingDetails(null);
    }
  };

  const updateBooking = (id, updatedData) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updatedData } : booking
      )
    );
  };

  const handleAddBookingSubmit = (formData) => {
    const newBooking = {
      id: bookings.length + 1,
      bookingNumber: `BK-2025-${String(bookings.length + 1).padStart(3, "0")}`,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      nights: calculateNights(formData.checkInDate, formData.checkOutDate),
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      totalAmount: "$" + (Math.floor(Math.random() * 500) + 100),
      bookingStatus: "pending",
      paymentStatus: "pending",
      specialRequests: formData.specialRequests,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBookings([...bookings, newBooking]);
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "checked_in":
        return "bg-blue-100 text-blue-800";
      case "checked_out":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partially_paid":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomTypeLabel = (type) => {
    switch (type) {
      case "standard":
        return "Standard";
      case "deluxe":
        return "Deluxe";
      case "suite":
        return "Suite";
      case "family":
        return "Family";
      default:
        return type;
    }
  };

  return (
    <SuperAdminLayout>
        <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings Management</h1>

            {/* Booking Details Modal */}
            <BookingDetailsModal
              showBookingDetails={showBookingDetails}
              setShowBookingDetails={setShowBookingDetails}
              updateBookingStatus={updateBookingStatus}
              cancelBooking={cancelBooking}
              deleteBooking={deleteBooking}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getPaymentStatusColor={getPaymentStatusColor}
              getRoomTypeLabel={getRoomTypeLabel}
            />

            {/* Update Booking Modal */}
            {showUpdateBookingForm && (
              <UpdateBookingModal
                booking={selectedBooking}
                setShowUpdateBookingForm={setShowUpdateBookingForm}
                updateBooking={updateBooking}
                getRoomTypeLabel={getRoomTypeLabel}
                formatDate={formatDate}
              />
            )}

            {/* Add Booking Modal */}
            {showAddBookingForm && (
              <AddBookingModal
                setShowAddBookingForm={setShowAddBookingForm}
                handleAddBookingSubmit={handleAddBookingSubmit}
              />
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
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "all"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => handleStatusFilterChange("pending")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "pending"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusFilterChange("confirmed")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "confirmed"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => handleStatusFilterChange("checked_in")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "checked_in"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Checked In
                </button>
                <button
                  onClick={() => handleStatusFilterChange("checked_out")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "checked_out"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Checked Out
                </button>
                <button
                  onClick={() => handleStatusFilterChange("cancelled")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    statusFilter === "cancelled"
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Cancelled
                </button>
              </div>

              {/* Bookings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.bookingStatus
                            )}`}
                          >
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1).replace("_", " ")}
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
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2 mt-auto border-t border-gray-100">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowUpdateBookingForm(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </SuperAdminLayout>
  );
}