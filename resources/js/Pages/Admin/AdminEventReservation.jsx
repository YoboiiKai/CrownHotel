import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
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

export default function AdminEventReservation() {
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
      confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", color: "bg-amber-100 text-amber-800" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      completed: { label: "Completed", color: "bg-blue-100 text-blue-800" }
    };
    return statusInfo[status] || { label: status, color: "bg-gray-100 text-gray-800" };
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
      event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <AdminLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <Head title="Event Reservations" />
      
      <div className="mx-auto max-w-7xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                <div className="p-2">
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Events
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("confirmed")}
                  >
                    Confirmed
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Event</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Events
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "confirmed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "completed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "cancelled" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("cancelled")}
          >
            Cancelled
          </button>
        </div>


        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group relative transform hover:-translate-y-1 duration-300"
            >
              {/* Card Header with Status Badge */}
              <div className="relative bg-gradient-to-r from-amber-50 to-white p-2.5 border-b border-amber-100">
                <div className="absolute top-0 right-0 h-16 w-16 bg-amber-100 rounded-full -mr-8 -mt-8 opacity-30"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-amber-800">
                      {getEventTypeLabel(event.event_type || event.eventType)}
                    </span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusInfo(event.status).color}`}>
                    {event.status === "confirmed" ? (
                      <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                    ) : (
                      <X className="h-2.5 w-2.5 mr-0.5" />
                    )}
                    {getStatusInfo(event.status).label}
                  </span>
                </div>
              </div>
              
              <div className="p-3 relative">
                {/* Delete Button */}
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-all z-10 opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Event"
                >
                  <Trash className="h-3 w-3" />
                </button>

                {/* Client Information */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-semibold text-sm flex-shrink-0 border border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">
                    {(event.client_name || event.clientName).split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                      {event.client_name || event.clientName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-xs">
                        <span className="text-xs text-amber-600 font-medium">₱{(event.total_amount || event.totalAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                        <Users className="h-3 w-3 text-gray-600" />
                        <span className="text-xs text-gray-600 font-medium">{event.guest_count || event.guestCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-1 mb-3 bg-gray-50 p-2.5 rounded border border-gray-100 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    <p className="truncate">{formatDate(event.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    <p className="">{event.start_time || event.startTime} - {event.end_time || event.endTime}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    <p className="truncate">{event.venue}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      // Ensure we're setting the complete event object with all properties
                      setSelectedEvent(event);
                      // Make sure event details modal is closed
                      setShowEventDetails(false);
                      // Set update modal to true
                      setShowUpdateModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Update</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no events matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="text-sm font-medium text-amber-600 hover:text-amber-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      
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
    </AdminLayout>
  );
}