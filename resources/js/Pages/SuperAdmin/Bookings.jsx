"use client"

import { useState, useEffect } from "react";
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
  PhilippinePeso,
  Trash,
  X,
  CheckCircle
} from "lucide-react";
import BookingDetailsModal from "@/Components/SuperAdmin/BookingDetailsModal";
import UpdateBookingModal from "@/Components/SuperAdmin/UpdateBookingModal";
import AddBookingModal from "@/Components/SuperAdmin/AddBookingModal";
import BookingCalendarModal from "@/Components/SuperAdmin/BookingCalendarModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBookingDetails, setShowBookingDetails] = useState(null);
  const [showAddBookingForm, setShowAddBookingForm] = useState(false);
  const [showUpdateBookingForm, setShowUpdateBookingForm] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Load bookings from API on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      // Add cache-busting parameter to prevent caching
      const response = await axios.get(`/api/bookings?_t=${new Date().getTime()}`);
      console.log('API Response:', response.data); // Debug: Log the API response
      
      // Check if we have data from the API
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Process the data to match our expected format with robust null checks
        const processedBookings = response.data.map(booking => {
          // Calculate nights from check-in and check-out dates with null checks
          const checkInDate = booking.check_in_date ? new Date(booking.check_in_date) : new Date();
          const checkOutDate = booking.check_out_date ? new Date(booking.check_out_date) : new Date();
          const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
          
          // Format the booking data to match our UI expectations
          return {
            id: booking.id || 0,
            bookingNumber: booking.booking_reference || `BK-${booking.id || 0}`,
            guestName: booking.client?.name || 'Guest',
            email: booking.client?.email || '',
            phone: booking.client?.phonenumber || '',
            roomNumber: booking.roomNumber || booking.room_number || '',
            roomType: booking.roomType || booking.room_type || 'standard',
            checkInDate: booking.check_in_date || '',
            checkOutDate: booking.check_out_date || '',
            nights: nights,
            adults: booking.adults || 1,
            children: booking.children || 0,
            totalAmount: booking.total_amount || 0,
            paymentStatus: booking.payment_status || 'pending',
            bookingStatus: booking.status || 'pending',
            specialRequests: booking.special_requests || '',
            createdAt: booking.created_at || '',
            extraBeds: booking.extra_beds || 0,
            extraBedRate: booking.extra_bed_rate || 0,
            clientId: booking.client_id || 0,
            image: booking.image || ''
          };
        });
        
        console.log('Processed Bookings:', processedBookings); // Debug: Log the processed bookings
        setBookings(processedBookings);
      } else {
        // If no data is returned from the API
        console.log('No data from API');
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings. Please try again later.");
      
      // Set empty bookings array in case of error
      setBookings([]);
    } finally {
      // Loading state removed
    }
  };

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

  // Update booking status with API integration
  const updateBookingStatus = async (updatedBooking) => {
    try {
      // The modal will pass the updated booking data
      const status = updatedBooking?.status || 'updated';
      
      // Refresh bookings data
      await fetchBookings();
      
      // Show success message in the main page
      toast.success(`Booking status changed to ${status}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status. Please try again.");
    }
  };

  // Cancel booking with API integration
  const cancelBooking = async () => {
    try {
      // Refresh bookings data after the modal handles the cancellation
      await fetchBookings();
      
      // Show success message in the main page
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  // Delete booking with API integration
  const deleteBooking = async () => {
    try {
      // Refresh bookings data after the modal handles the deletion
      await fetchBookings();
      
      // Show success message in the main page
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    }
  };

  // Update booking with API integration
  const updateBooking = async (id, updatedData) => {
    try {
      // API call to update booking
      await axios.put(`/api/bookings/${id}`, updatedData);
      
      // Refresh bookings data
      await fetchBookings();
      
      // Show success message
      toast.success("Booking updated successfully");
      
      // Close update form
      setShowUpdateBookingForm(false);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };



  // Handle add booking submission - this is already handled by the AddBookingModal component
  // which makes the API call directly. We just need to refresh the data after submission.
  const handleAddBookingSubmit = async (bookingData) => {
    try {
      // Refresh bookings data to include the new booking
      await fetchBookings();
      
      // Show success message
      toast.success("Booking created successfully");
      
      // Close the add booking form
      setShowAddBookingForm(false);
    } catch (error) {
      console.error("Error refreshing bookings after add:", error);
    }
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} newestOnTop />
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings Management</h1>

        {/* Booking Details Modal */}
        {showBookingDetails && (
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
        )}

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
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
              >
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                  <div className="p-2">
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("all");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      All Bookings
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("pending");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      Pending
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("confirmed");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      Confirmed
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("checked_in");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      Checked In
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("checked_out");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      Checked Out
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                      onClick={() => {
                        setStatusFilter("cancelled");
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCalendarModal(true)}
              className="flex items-center gap-2 rounded-lg bg-white border border-[#A67C52] px-4 py-2 text-sm font-medium text-[#8B5A2B] shadow-sm hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/50 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
            >
              <Calendar className="h-4 w-4" />
              <span>View Calendar</span>
            </button>
            <button
              onClick={() => setShowAddBookingForm(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Booking</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            onClick={() => handleStatusFilterChange("all")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "all"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => handleStatusFilterChange("pending")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "pending"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilterChange("confirmed")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "confirmed"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusFilterChange("checked_in")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "checked_in"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Checked In
          </button>
          <button
            onClick={() => handleStatusFilterChange("checked_out")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "checked_out"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Checked Out
          </button>
          <button
            onClick={() => handleStatusFilterChange("cancelled")}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              statusFilter === "cancelled"
                ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <X className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500 mb-4">There are no bookings matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="text-[#8B5A2B] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Bookings Grid */
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
                        <PhilippinePeso className="h-4 w-4 text-[#8B5A2B]" />
                        <span className="font-medium text-[#8B5A2B]">{booking.totalAmount}</span>
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
                      className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowUpdateBookingForm(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#A67C52]/30 bg-[#A67C52]/10 px-3 py-2 text-xs font-medium text-[#6B4226] hover:bg-[#A67C52]/20 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Calendar Modal */}
      {showCalendarModal && (
        <BookingCalendarModal
          show={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          onBookingSelected={(booking) => {
            setShowCalendarModal(false);
            setShowBookingDetails(booking);
          }}
        />
      )}
    </SuperAdminLayout>
  );
}