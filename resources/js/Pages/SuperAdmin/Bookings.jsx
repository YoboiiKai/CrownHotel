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
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  MessageSquare
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
      <ToastContainer position="top-right" hideProgressBar />
      <div className="mx-auto max-w-6xl">

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

        {/* Combined Action Bar with Search, Filter, and Add Button */}
        <div className="bg-white rounded-xl shadow-md border border-[#DEB887]/30 p-4 mb-8 mt-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full lg:flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              />
            </div>
            
            {/* Status Filter Tabs */}
            <div className="flex items-center justify-center w-full lg:w-auto">
              <div className="inline-flex bg-[#F5EFE7]/50 rounded-lg p-1 border border-[#DEB887]/20">
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${statusFilter === "all" 
                    ? "bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${statusFilter === "pending" 
                    ? "bg-gradient-to-r from-[#F59E0B]/90 to-[#F59E0B]/70 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${statusFilter === "confirmed" 
                    ? "bg-gradient-to-r from-[#4CAF50]/90 to-[#4CAF50]/70 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setStatusFilter("confirmed")}
                >
                  Confirmed
                </button>
                
                {/* Additional Status Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${statusFilter === "checked_in" || statusFilter === "checked_out" || statusFilter === "cancelled" 
                      ? "bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm" 
                      : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  >
                    <div className="flex items-center gap-1">
                      <span>More</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </button>
                  
                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[#DEB887]/30 bg-white shadow-lg z-10">
                      <div className="p-1">
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left text-xs sm:text-sm transition-all duration-200 ${statusFilter === "checked_in" 
                            ? "bg-gradient-to-r from-[#3B82F6]/90 to-[#3B82F6]/70 text-white" 
                            : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                          onClick={() => {
                            setStatusFilter("checked_in");
                            setIsFilterDropdownOpen(false);
                          }}
                        >
                          Checked In
                        </button>
                        
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left text-xs sm:text-sm transition-all duration-200 ${statusFilter === "checked_out" 
                            ? "bg-gradient-to-r from-[#6366F1]/90 to-[#6366F1]/70 text-white" 
                            : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                          onClick={() => {
                            setStatusFilter("checked_out");
                            setIsFilterDropdownOpen(false);
                          }}
                        >
                          Checked Out
                        </button>
                        
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left text-xs sm:text-sm transition-all duration-200 ${statusFilter === "cancelled" 
                            ? "bg-gradient-to-r from-[#EF4444]/90 to-[#EF4444]/70 text-white" 
                            : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
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
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowAddBookingForm(true)}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md w-full lg:w-auto flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Booking</span>
              </button>
            </div>
          </div>
        </div>



        {/* Page Title and Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#5D3A1F] mb-1">Bookings Management</h1>
            <p className="text-sm text-[#8B5A2B]/70">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
        </div>
        
        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-[#DEB887]/30">
            <div className="rounded-full bg-[#F5EFE7] p-4 mb-4">
              <Calendar className="h-8 w-8 text-[#8B5A2B]" />
            </div>
            <h3 className="text-xl font-semibold text-[#5D3A1F] mb-2">No bookings found</h3>
            <p className="text-sm text-[#8B5A2B]/70 mb-6 text-center max-w-md">
              There are no bookings matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-[#DEB887]/50 bg-[#F5EFE7]/50 text-[#8B5A2B] hover:bg-[#F5EFE7] shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Bookings Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                {/* Booking Number Badge */}
                <div className="absolute top-3 left-3 z-10 bg-[#8B5A2B]/10 px-2 py-0.5 rounded-full text-xs font-medium text-[#8B5A2B] flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>#{booking.bookingNumber}</span>
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 z-10 bg-[#8B5A2B]/10 px-2 py-0.5 rounded-full text-xs font-medium text-[#8B5A2B] flex items-center">
                  <PhilippinePeso className="h-3 w-3 mr-1" />
                  <span>{booking.totalAmount}</span>
                </div>
                

                
                <div className="p-3">
                  {/* Guest Info */}
                  <div className="flex items-center mb-3 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">
                        {booking.guestName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                          {booking.guestName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {booking.bookingStatus === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {booking.bookingStatus === "checked_in" && <LogIn className="h-3 w-3 mr-1" />}
                            {booking.bookingStatus === "checked_out" && <LogOut className="h-3 w-3 mr-1" />}
                            {booking.bookingStatus === "cancelled" && <X className="h-3 w-3 mr-1" />}
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1).replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex flex-col gap-2">
                      {/* Date Range */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Calendar className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <div className="text-xs text-[#6B4226]/70">
                            <span>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                            <span className="text-xs text-[#8B5A2B]/60 ml-1">({booking.nights} {booking.nights === 1 ? "night" : "nights"})</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Room Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Bed className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70">
                            Room {booking.roomNumber} ({getRoomTypeLabel(booking.roomType)})
                          </p>
                        </div>
                      </div>
                      
                      {/* Guests Count */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Users className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70">
                            {booking.adults} {booking.adults === 1 ? "Adult" : "Adults"}
                            {booking.children > 0 &&
                              `, ${booking.children} ${booking.children === 1 ? "Child" : "Children"}`}
                          </p>
                        </div>
                      </div>
                      
                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                              <MessageSquare className="h-3.5 w-3.5 text-[#8B5A2B]" />
                            </div>
                            <p className="text-xs text-[#6B4226]/70 truncate max-w-[180px]">
                              {booking.specialRequests}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-full"></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowUpdateBookingForm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#8B5A2B] hover:bg-[#DEB887]/10 transition-all duration-300"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Update</span>
                      </button>
                    </div>
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