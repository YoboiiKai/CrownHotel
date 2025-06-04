import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { 
  Search, 
  Plus, 
  X,  
  Edit, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle, 
  DollarSign,
  User,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  Trash,
  Filter
} from "lucide-react";
import EventDetailsModal from '@/Components/SuperAdmin/EventDetailsModal';
import AddEventModal from '@/Components/SuperAdmin/AddEventModal';
import UpdateEventModal from '@/Components/SuperAdmin/UpdateEventModal';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function EventRes() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load events from API on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/events?_t=${new Date().getTime()}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again later.");
    }
  };

  // Handle event status change
  const handleEventStatusChange = async (updatedEvent) => {
    try {
      await fetchEvents(); // Refresh the entire event list
      setShowEventDetails(false); // Close the details modal after status change
    } catch (error) {
      console.error("Error handling event status change:", error);
      toast.error("Failed to handle event status change. Please try again later.");
    }
  };

  // Handle event deletion
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      await fetchEvents(); // Ensure data is refreshed before updating UI
      toast.success("Event deleted successfully!"); 
      setShowEventDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again."); 
    }
  };
  
  const getEventTypeLabel = (type) => {
    const types = {
      wedding: "Wedding",
      corporate: "Corporate Event",
      birthday: "Birthday Party",
      conference: "Conference",
      charity: "Charity Event",
      social: "Social Gathering",
      other: "Other Event"
    };
    return types[type] || type;
  };

  // Helper function to get status label and color
  const getStatusInfo = (status) => {
    const statusInfo = {
      confirmed: { 
        label: "Confirmed", 
        color: "bg-green-500/90 text-white",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      },
      pending: { 
        label: "Pending", 
        color: "bg-amber-500/90 text-white",
        icon: <AlertCircle className="h-4 w-4 text-amber-500" />
      },
      cancelled: { 
        label: "Cancelled", 
        color: "bg-red-500/90 text-white",
        icon: <X className="h-4 w-4 text-red-500" />
      },
      completed: { 
        label: "Completed", 
        color: "bg-blue-500/90 text-white",
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />
      }
    };
    return statusInfo[status] || { 
      label: status, 
      color: "bg-gray-500/90 text-white",
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />
    };
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Filter events based on status and search query
  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      (event.client_name || event.clientName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getEventTypeLabel(event.eventType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SuperAdminLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <Head title="Event Reservations" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                <Filter className="h-4 w-4 text-[#8B5A2B]" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-[#DEB887]/30 bg-white py-2 pl-4 pr-10 text-sm text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Add Event Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 w-full lg:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>


        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Event"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                {/* Client Information */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">
                      {(event.client_name || event.clientName).split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                        {event.client_name || event.clientName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-[#8B5A2B]" />
                          <span className="text-xs text-[#8B5A2B] font-medium">{getEventTypeLabel(event.eventType)}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          event.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : event.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : event.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {event.status === "confirmed" || event.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : event.status === "cancelled" ? (
                            <X className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {getStatusInfo(event.status).label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-col gap-2">
                    {/* Event Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <Calendar className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70 truncate">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <Clock className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70">{event.start_time || event.startTime} - {event.end_time || event.endTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <MapPin className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70 truncate">{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <Users className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70">{event.guest_count || event.guestCount} Guests</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <DollarSign className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70">₱{(event.total_amount || event.totalAmount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-full"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventDetails(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setShowEventDetails(false);
                        setShowUpdateModal(true);
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

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-[#DEB887]/30 mt-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52]/20 to-[#8B5A2B]/20 shadow-sm mb-4">
              <Calendar className="h-8 w-8 text-[#8B5A2B]" />
            </div>
            <h3 className="text-xl font-bold text-[#5D3A1F] mb-2">No events found</h3>
            <p className="text-sm text-[#8B5A2B]/70 mb-5 text-center max-w-md">There are no events matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#5D3A1F]/90 to-[#8B5A2B]/90 text-white text-sm font-medium hover:shadow-md transition-all duration-200"
            >
              Clear filters
            </button>
          </div>
        )}
      
      {/* Modals */}
      <AddEventModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={fetchEvents}
        fetchEvents={fetchEvents}
      />

      {/* Only render UpdateEventModal when showUpdateModal is true */}
      {showUpdateModal && (
        <UpdateEventModal
          show={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            // Clear selected event after modal is closed
            setTimeout(() => setSelectedEvent(null), 100);
          }}
          onSubmit={() => {
            fetchEvents();
            setShowUpdateModal(false);
          }}
          event={selectedEvent}
        />
      )}

      {/* Only render EventDetailsModal when showEventDetails is true */}
      {showEventDetails && (
        <EventDetailsModal
          show={showEventDetails}
          onClose={() => {
            setShowEventDetails(false);
            // Only clear selected event if update modal is not open
            if (!showUpdateModal) {
              setTimeout(() => setSelectedEvent(null), 100);
            }
          }}
          event={selectedEvent}
          onStatusChange={(updatedEvent) => {
            handleEventStatusChange(updatedEvent);
          }}
          getStatusInfo={getStatusInfo}
        />
      )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}

export default EventRes;
