import React, { useState, useEffect } from 'react';
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
  Phone
} from "lucide-react";

export default function EventRes() {
  // Sample data for event reservations
  const [events, setEvents] = useState([
    {
      id: 1,
      clientName: "John & Sarah Smith",
      eventType: "wedding",
      date: "2025-04-15",
      startTime: "14:00",
      endTime: "22:00",
      venue: "Grand Ballroom",
      guestCount: 150,
      status: "confirmed",
      contactNumber: "+1 (555) 123-4567",
      email: "john.smith@example.com",
      specialRequests: "Floral arrangements in white and gold. Champagne toast at 7 PM.",
      packageType: "Premium",
      totalAmount: 8500,
      depositPaid: true,
      depositAmount: 2000,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      clientName: "Tech Innovations Inc.",
      eventType: "corporate",
      date: "2025-03-28",
      startTime: "09:00",
      endTime: "17:00",
      venue: "Conference Hall A",
      guestCount: 75,
      status: "pending",
      contactNumber: "+1 (555) 987-6543",
      email: "events@techinnovations.com",
      specialRequests: "Projector setup, high-speed internet, and catering for lunch.",
      packageType: "Standard",
      totalAmount: 3200,
      depositPaid: true,
      depositAmount: 1000,
      image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      clientName: "Emily Johnson",
      eventType: "birthday",
      date: "2025-05-10",
      startTime: "18:00",
      endTime: "23:00",
      venue: "Terrace Garden",
      guestCount: 50,
      status: "confirmed",
      contactNumber: "+1 (555) 234-5678",
      email: "emily.johnson@example.com",
      specialRequests: "Birthday cake with '30th Birthday' inscription. Cocktail bar setup.",
      packageType: "Standard",
      totalAmount: 2800,
      depositPaid: true,
      depositAmount: 800,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 4,
      clientName: "Global Partners LLC",
      eventType: "conference",
      date: "2025-06-22",
      startTime: "08:00",
      endTime: "18:00",
      venue: "Grand Ballroom",
      guestCount: 200,
      status: "confirmed",
      contactNumber: "+1 (555) 876-5432",
      email: "events@globalpartners.com",
      specialRequests: "Multiple breakout rooms, AV equipment, and international cuisine options.",
      packageType: "Premium",
      totalAmount: 9200,
      depositPaid: true,
      depositAmount: 3000,
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80"
    },
    {
      id: 5,
      clientName: "Michael & David Thompson",
      eventType: "wedding",
      date: "2025-07-08",
      startTime: "16:00",
      endTime: "23:00",
      venue: "Lakeside Pavilion",
      guestCount: 120,
      status: "pending",
      contactNumber: "+1 (555) 345-6789",
      email: "michael.thompson@example.com",
      specialRequests: "Outdoor ceremony setup with contingency plan for rain. Vegan menu options.",
      packageType: "Premium",
      totalAmount: 7800,
      depositPaid: false,
      depositAmount: 2000,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd67caa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
    },
    {
      id: 6,
      clientName: "Community Health Foundation",
      eventType: "charity",
      date: "2025-05-30",
      startTime: "18:30",
      endTime: "22:30",
      venue: "Conference Hall B",
      guestCount: 100,
      status: "confirmed",
      contactNumber: "+1 (555) 456-7890",
      email: "events@communityhealthfoundation.org",
      specialRequests: "Podium for speeches, silent auction setup, and vegetarian menu options.",
      packageType: "Standard",
      totalAmount: 4500,
      depositPaid: true,
      depositAmount: 1500,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ]);

  // State for UI controls
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterEventType, setFilterEventType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    clientName: "",
    eventType: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    guestCount: "",
    status: "pending",
    contactNumber: "",
    email: "",
    specialRequests: "",
    packageType: "",
    totalAmount: "",
    depositPaid: false,
    depositAmount: "",
    image: ""
  });

  // Helper function to get event type label
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, { ...formData, id: events.length + 1 }]);
    setFormData({
      clientName: "",
      eventType: "",
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
      guestCount: "",
      status: "pending",
      contactNumber: "",
      email: "",
      specialRequests: "",
      packageType: "",
      totalAmount: "",
      depositPaid: false,
      depositAmount: "",
      image: ""
    });
    setShowAddModal(false);
  };

  // Filter events based on type, status, and search query
  const filteredEvents = events.filter((event) => {
    const matchesEventType = filterEventType === "all" || event.eventType === filterEventType;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesSearch =
      event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getEventTypeLabel(event.eventType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesEventType && matchesStatus && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SuperAdminLayout>
      <Head title="Event Reservations" />
      
      <div className="mx-auto max-w-6xl">
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
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Event</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("all")}
          >
            All Events
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "wedding" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("wedding")}
          >
            Weddings
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "corporate" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("corporate")}
          >
            Corporate
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "birthday" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("birthday")}
          >
            Birthdays
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "anniversary" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("anniversary")}
          >
            Anniversaries
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterEventType === "other" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterEventType("other")}
          >
            Other
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex overflow-x-auto mb-6">
          <button
            className={`px-3 py-1.5 mr-2 text-xs font-medium rounded-full ${filterStatus === "all" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Status
          </button>
          <button
            className={`px-3 py-1.5 mr-2 text-xs font-medium rounded-full ${filterStatus === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`px-3 py-1.5 mr-2 text-xs font-medium rounded-full ${filterStatus === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1.5 mr-2 text-xs font-medium rounded-full ${filterStatus === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`px-3 py-1.5 mr-2 text-xs font-medium rounded-full ${filterStatus === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Event Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
              onClick={() => setShowEventDetails(event)}
            >
              {/* Event Image */}
              <div className="relative h-36 w-full overflow-hidden">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"} 
                  alt={`${event.eventType} event`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {getEventTypeLabel(event.eventType)}
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                {/* Event Info */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{event.clientName}</h3>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-amber-600" />
                      <span className="font-medium text-amber-600 text-sm">${event.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                    <span className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full ${getStatusInfo(event.status).color}`}>
                      {getStatusInfo(event.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{event.venue} • {event.guestCount} guests</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={() => setShowEventDetails(event)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Calendar className="h-3 w-3" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter to find what you're looking for, or add a new event.
            </p>
          </div>
        )}
      </div>
      
      {/* Add New Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 relative">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Event</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Client Information */}
                  <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Client Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Client Name *
                      </label>
                      <input 
                        type="text" 
                        id="clientName" 
                        name="clientName" 
                        value={formData.clientName} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Event Type *
                      </label>
                      <select 
                        id="eventType" 
                        name="eventType" 
                        value={formData.eventType} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="conference">Conference</option>
                        <option value="charity">Charity Event</option>
                        <option value="social">Social Gathering</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Contact Number *
                      </label>
                      <input 
                        type="text" 
                        id="contactNumber" 
                        name="contactNumber" 
                        value={formData.contactNumber} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email *
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    {/* Event Details */}
                    <div className="col-span-2 mt-4">
                      <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Event Details</h4>
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Event Date *
                      </label>
                      <input 
                        type="date" 
                        id="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Start Time *
                        </label>
                        <input 
                          type="time" 
                          id="startTime" 
                          name="startTime" 
                          value={formData.startTime} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1.5">
                          End Time *
                        </label>
                        <input 
                          type="time" 
                          id="endTime" 
                          name="endTime" 
                          value={formData.endTime} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Venue *
                      </label>
                      <select 
                        id="venue" 
                        name="venue" 
                        value={formData.venue} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      >
                        <option value="">Select venue</option>
                        <option value="Grand Ballroom">Grand Ballroom</option>
                        <option value="Conference Hall A">Conference Hall A</option>
                        <option value="Conference Hall B">Conference Hall B</option>
                        <option value="Terrace Garden">Terrace Garden</option>
                        <option value="Lakeside Pavilion">Lakeside Pavilion</option>
                        <option value="Executive Lounge">Executive Lounge</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Number of Guests *
                      </label>
                      <input 
                        type="number" 
                        id="guestCount" 
                        name="guestCount" 
                        min="1" 
                        value={formData.guestCount} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Special Requests
                      </label>
                      <textarea 
                        id="specialRequests" 
                        name="specialRequests" 
                        value={formData.specialRequests} 
                        onChange={handleInputChange} 
                        rows="3" 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      ></textarea>
                    </div>
                    
                    {/* Package and Payment */}
                    <div className="col-span-2 mt-4">
                      <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Package and Payment</h4>
                    </div>
                    
                    <div>
                      <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Package Type *
                      </label>
                      <select 
                        id="packageType" 
                        name="packageType" 
                        value={formData.packageType} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      >
                        <option value="">Select package</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Total Amount ($) *
                      </label>
                      <input 
                        type="number" 
                        id="totalAmount" 
                        name="totalAmount" 
                        min="0" 
                        step="0.01" 
                        value={formData.totalAmount} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Deposit Amount ($) *
                      </label>
                      <input 
                        type="number" 
                        id="depositAmount" 
                        name="depositAmount" 
                        min="0" 
                        step="0.01" 
                        value={formData.depositAmount} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="depositPaid" 
                        name="depositPaid" 
                        checked={formData.depositPaid} 
                        onChange={handleInputChange} 
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="depositPaid" className="ml-2 block text-sm text-gray-700 font-medium">
                        Deposit Paid
                      </label>
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Image URL
                      </label>
                      <input 
                        type="text" 
                        id="image" 
                        name="image" 
                        value={formData.image} 
                        onChange={handleInputChange} 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                  </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 relative">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
              <button 
                onClick={() => setShowEventDetails(null)} 
                className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Event Image */}
                <div className="md:col-span-1 flex flex-col space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={showEventDetails.image || 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnQlMjB2ZW51ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'} 
                      alt={showEventDetails.eventType} 
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                    />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      showEventDetails.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      showEventDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      showEventDetails.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {showEventDetails.status === 'confirmed' ? 'Confirmed' : 
                       showEventDetails.status === 'pending' ? 'Pending' : 
                       showEventDetails.status === 'cancelled' ? 'Cancelled' : 'Unknown'}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-col space-y-2 mt-4">
                    <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          // Handle edit functionality
                          setShowEventDetails(null);
                          // Additional edit logic here
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-amber-300 rounded-md bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          // Handle cancel functionality
                          setShowEventDetails(null);
                          // Additional cancel logic here
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Event Information */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{showEventDetails.eventType}</h4>
                    <p className="text-sm text-gray-600">Organized by <span className="font-medium">{showEventDetails.clientName}</span></p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Event Details</h5>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.startTime} - {showEventDetails.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.venue}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.guestCount} guests</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Contact Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.clientName}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-sm text-gray-700">{showEventDetails.contactNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                      <h5 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Payment Details</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Package</p>
                          <p className="text-sm font-medium text-gray-900">{showEventDetails.packageType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-sm font-medium text-gray-900">${showEventDetails.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deposit Amount</p>
                          <p className="text-sm font-medium text-gray-900">${showEventDetails.depositAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deposit Status</p>
                          <p className={`text-sm font-medium ${showEventDetails.depositPaid ? 'text-green-600' : 'text-red-600'}`}>
                            {showEventDetails.depositPaid ? 'Paid' : 'Not Paid'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Special Requests</h5>
                    <p className="text-sm text-gray-700">
                      {showEventDetails.specialRequests || 'No special requests provided.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setShowEventDetails(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </SuperAdminLayout>
  );
}