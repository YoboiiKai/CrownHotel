import React, { useState, useRef, useEffect } from "react";
import { X, Calendar, Users, MessageSquare, Home, UserCircle, CreditCard, DollarSign, CheckCircle, PhilippinePeso, Bed, FileText, Plus, Minus, Info, Sparkles, Mail } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddBookingModal({
  setShowAddBookingForm,
  handleAddBookingSubmit,
  availableRooms = [],
  clientId = null, // Add clientId prop for the logged-in user
}) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    extraBeds: 0,
    extraBedRate: 0,
    specialRequests: "",
    clientId: "",
    paymentMethod: "credit_card", // Default payment method
    amount: "",
    paymentStatus: "pending", // Default payment status
    termsAccepted: false, // Terms and conditions acceptance
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showExtraBedNotice, setShowExtraBedNotice] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const clientDropdownRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Room initialization and form pre-population
  useEffect(() => {
    // If rooms are provided as props, use them
    if (availableRooms && availableRooms.length > 0) {
      setRooms(availableRooms);
      
      // If there's exactly one room (from the Rooms component), pre-populate the form
      if (availableRooms.length === 1) {
        const selectedRoom = availableRooms[0];
        setFormData(prev => ({
          ...prev,
          roomNumber: selectedRoom.roomNumber,
          roomType: selectedRoom.roomType,
          amount: selectedRoom.price || "",
          extraBedRate: selectedRoom.extraBedRate || 500
        }));
      }
    } else {
      // Otherwise fetch from API
      fetchRooms();
    }
    
    // Fetch clients and set the logged-in client if clientId is provided
    fetchClients();
    
    // If clientId is provided (logged-in user), set it in the form
    if (clientId) {
      setFormData(prev => ({
        ...prev,
        clientId: clientId
      }));
      
      // Fetch the client's details to display the name
      fetchClientDetails(clientId);
    }
    
    // Check initial occupancy to set extra bed notice visibility
    const totalOccupants = parseInt(formData.adults || 1) + parseInt(formData.children || 0);
    setShowExtraBedNotice(totalOccupants > 4);
  }, [availableRooms, clientId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to check if a room is available for the selected dates
  const isRoomAvailable = (room, checkInDate, checkOutDate) => {
    if (!room || !room.bookings || !checkInDate || !checkOutDate) {
      return true; // If we don't have complete information, assume it's available
    }
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Check if any booking overlaps with the selected dates
    const hasOverlap = room.bookings.some(booking => {
      const bookingCheckIn = new Date(booking.check_in_date);
      const bookingCheckOut = new Date(booking.check_out_date);
      
      // Check for overlap
      return (
        (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) || // Check-in date falls within a booking
        (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) || // Check-out date falls within a booking
        (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut) // Selected dates completely encompass a booking
      );
    });
    
    return !hasOverlap;
  };
  
  // Function to fetch rooms with their bookings
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/superadmin/rooms/with-bookings');
      
      // Filter for available rooms
      const availableRooms = data.filter(room => room.status === 'available');
      
      // Update state with available rooms
      setRooms(availableRooms);
      
      // Show message if no rooms available
      if (availableRooms.length === 0) {
        toast.info("No available rooms found");
      }
    } catch (error) {
      toast.error("Could not load rooms");
      setRooms([]);
    }
  };
  
  // Simple function to fetch clients
  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/clients');
      // Filter for active clients if needed
      const activeClients = data.filter(client => client.status === 'active' || !client.status);
      setClients(activeClients);
      setFilteredClients(activeClients);
      
      if (activeClients.length === 0) {
        toast.info("No active clients found");
      }
    } catch (error) {
      toast.error("Could not load clients");
      setClients([]);
      setFilteredClients([]);
    }
  };
  
  // Function to fetch client details by ID
  const fetchClientDetails = async (id) => {
    try {
      const { data } = await axios.get(`/api/clients/${id}`);
      if (data) {
        // Set the client search field to display the client's name
        setClientSearch(data.name || 'Current User');
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      // Set a default name if we can't fetch the details
      setClientSearch('Current User');
    }
  };
  
  // Function to handle client search
  const handleClientSearch = (e) => {
    const searchTerm = e.target.value;
    setClientSearch(searchTerm);
    
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };
  
  // Function to select a client from the dropdown
  const selectClient = (client) => {
    setFormData({
      ...formData,
      clientId: client.id
    });
    setClientSearch(client.name);
    setShowClientDropdown(false);
    
    // Clear error when user selects a client
    if (errors.clientId) {
      setErrors({
        ...errors,
        clientId: "",
      });
    }
  };

  // Update room type and calculate amount when room number changes
  const handleRoomChange = (e) => {
    const { value } = e.target;
    
    // Find the selected room object
    const selectedRoom = rooms.find(room => room.roomNumber === value);
    
    setFormData(prev => ({
      ...prev,
      roomNumber: value,
      roomType: selectedRoom ? selectedRoom.roomType : "",
      amount: selectedRoom ? selectedRoom.price || "" : "", // Set amount based on room price if available
      extraBedRate: selectedRoom ? selectedRoom.extraBedRate || 500 : 500, // Default extra bed rate or from room data
    }));
    
    // Clear error when user starts typing
    if (errors.roomNumber) {
      setErrors({
        ...errors,
        roomNumber: "",
      });
    }
  };
  
  // Calculate total amount based on stay duration, room price, and extra beds
  const calculateTotalAmount = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.amount) return "";
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    // Calculate the difference in days
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate room cost
    const roomCost = daysDiff * parseFloat(formData.amount);
    
    // Calculate extra bed cost
    const extraBedCost = formData.extraBeds > 0 ? 
      (formData.extraBeds * parseFloat(formData.extraBedRate) * daysDiff) : 0;
    
    // Return the total amount
    return roomCost + extraBedCost;
  };
  
  // Handle extra beds increment/decrement
  const handleExtraBeds = (action) => {
    setFormData(prev => {
      const currentBeds = prev.extraBeds || 0;
      let newBeds = currentBeds;
      
      if (action === 'increment' && currentBeds < 3) { // Maximum 3 extra beds
        newBeds = currentBeds + 1;
      } else if (action === 'decrement' && currentBeds > 0) {
        newBeds = currentBeds - 1;
      }
      
      return {
        ...prev,
        extraBeds: newBeds
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create updated form data
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    // Handle occupancy logic
    if (name === 'adults' || name === 'children') {
      const totalOccupants = name === 'adults' 
        ? parseInt(value) + parseInt(formData.children || 0)
        : parseInt(formData.adults || 1) + parseInt(value);
      
      // If the combined total of adults and children exceeds 4, automatically add 1 extra bed
      if (totalOccupants > 4) {
        // Automatically add 1 extra bed if not already added
        if (formData.extraBeds < 1) {
          updatedFormData.extraBeds = 1;
          toast.info('Added 1 extra bed for additional guests (occupancy > 4).');
        }
        // Show the extra bed notice
        setShowExtraBedNotice(true);
      } else {
        // If occupancy is 4 or less, automatically remove the extra bed
        // But only if it was automatically added (we'll assume it was if extraBeds is exactly 1)
        if (formData.extraBeds === 1) {
          updatedFormData.extraBeds = 0;
          toast.info('Removed extra bed as occupancy no longer exceeds 4 people.');
        }
        // Hide the extra bed notice
        setShowExtraBedNotice(false);
      }
    }
    
    // Update form data
    setFormData(updatedFormData);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for proper date comparison
    
    // Room validation
    if (!formData.roomNumber) {
      newErrors.roomNumber = "Please select a room";
    }
    
    if (!formData.roomType) {
      newErrors.roomType = "Room type is required";
    }
    
    // Check if the room is available for the selected dates
    if (formData.roomNumber && formData.checkInDate && formData.checkOutDate) {
      const selectedRoom = rooms.find(room => room.roomNumber === formData.roomNumber);
      if (selectedRoom && !isRoomAvailable(selectedRoom, formData.checkInDate, formData.checkOutDate)) {
        newErrors.availability = "This room is not available for the selected dates. Please choose different dates or a different room.";
      }
    }
    
    // Client validation
    if (!formData.clientId) {
      newErrors.clientId = "Please select a client";
    }
    
    // Date validations
    if (!formData.checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    } else {
      const checkInDate = new Date(formData.checkInDate);
      if (checkInDate < today) {
        newErrors.checkInDate = "Check-in date cannot be in the past";
      }
    }
    
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    } else if (formData.checkInDate) {
      const checkInDate = new Date(formData.checkInDate);
      const checkOutDate = new Date(formData.checkOutDate);
      
      if (checkOutDate <= checkInDate) {
        newErrors.checkOutDate = "Check-out date must be after check-in date";
      }
      
      // Calculate stay duration
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff > 30) {
        newErrors.checkOutDate = "Maximum stay duration is 30 days";
      }
    }
    
    // Guest count validations
    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required";
    }
    
    if (formData.children === undefined || formData.children < 0) {
      newErrors.children = "Children count cannot be negative";
    }
    
    // Extra beds validation
    if (formData.extraBeds === undefined || formData.extraBeds < 0) {
      newErrors.extraBeds = "Extra beds cannot be negative";
    } else if (formData.extraBeds > 3) {
      newErrors.extraBeds = "Maximum 3 extra beds allowed";
    }
    
    if (!formData.extraBedRate || formData.extraBedRate < 0) {
      newErrors.extraBedRate = "Extra bed rate must be a positive number";
    }
    
    // Payment validations
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    
    // Calculate and validate total amount
    const totalAmount = calculateTotalAmount();
    if (!totalAmount || totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be calculated and be a positive number";
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    
    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Payment status is required";
    }
    
    // Check if extra beds are needed based on occupancy
    const totalOccupants = parseInt(formData.adults || 1) + parseInt(formData.children || 0);
    
    // Only require extra bed if total occupants exceeds 4
    if (totalOccupants > 4) {
      if (formData.extraBeds < 1) {
        newErrors.extraBeds = `1 extra bed required when total guests exceeds 4 people`;
      }
    }
    
    // Maximum occupancy validation
    const maxOccupantsPerRoom = 4; // Standard max occupancy per room
    const maxOccupantsWithExtraBeds = maxOccupantsPerRoom + (formData.extraBeds * 1); // Each extra bed adds 1 person
    
    if (totalOccupants > maxOccupantsWithExtraBeds) {
      newErrors.occupancy = `Maximum occupancy exceeded. Maximum is ${maxOccupantsWithExtraBeds} people with ${formData.extraBeds} extra bed(s).`;
    }
    
    // Terms and conditions
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    
    return newErrors;
  };



  const resetForm = () => {
    setFormData({
      roomNumber: "",
      roomType: "",
      checkInDate: "",
      checkOutDate: "",
      adults: 1,
      children: 0,
      extraBeds: 0,
      extraBedRate: 0,
      specialRequests: "",
      clientId: "",
      amount: "",
      paymentMethod: "credit_card",
      termsAccepted: false,
      paymentStatus: "pending"
    });
    setClientSearch("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors({});
    setShowExtraBedNotice(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.");
    } else {
      setIsSubmitting(true);
      
      // Calculate total amount
      const totalAmount = calculateTotalAmount();
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      // We keep the API request field names as snake_case
      // The controller will map these to the camelCase column names
      formDataToSend.append("room_number", formData.roomNumber);
      formDataToSend.append("room_type", formData.roomType);
      formDataToSend.append("check_in_date", formData.checkInDate);
      formDataToSend.append("check_out_date", formData.checkOutDate);
      formDataToSend.append("adults", formData.adults);
      formDataToSend.append("children", formData.children);
      formDataToSend.append("extra_beds", formData.extraBeds);
      formDataToSend.append("extra_bed_rate", formData.extraBedRate);
      formDataToSend.append("special_requests", formData.specialRequests || "");
      formDataToSend.append("client_id", formData.clientId);
      formDataToSend.append("payment_method", formData.paymentMethod);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("total_amount", totalAmount.toString());
      formDataToSend.append("payment_status", formData.paymentStatus || "pending");
      formDataToSend.append("terms_accepted", formData.termsAccepted ? 1 : 0);
      
      // Generate a unique booking reference
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const bookingReference = `BK-${timestamp}-${randomNum}`;
      formDataToSend.append("booking_reference", bookingReference);
      
      // Set status to pending by default
      formDataToSend.append("status", "pending");
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0]);
      }
      
      // Submit form to backend using axios
      axios.post('/api/bookings', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(response => {
        toast.success("Booking created successfully!", {
          hideProgressBar: true,
          autoClose: 3000,
          closeButton: true,
        });
        const data = response.data;
        resetForm();
        
        // Call the parent component's handler if provided
        if (handleAddBookingSubmit) {
          handleAddBookingSubmit(data);
        }
        
        // Close the modal
        setShowAddBookingForm(false);
      })
      .catch(error => {
        console.error("Error adding booking:", error);
        
        // Enhanced error logging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server response data:", error.response.data);
          console.error("Server response status:", error.response.status);
          console.error("Server response headers:", error.response.headers);
          
          if (error.response.data && error.response.data.message) {
            toast.error(`Server error: ${error.response.data.message}`, {
              hideProgressBar: true,
              autoClose: 3000,
              closeButton: true,
            });
            setErrors({ general: error.response.data.message });
          } else if (error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors);
            toast.error("Please fix the errors in the form.", {
              hideProgressBar: true,
              autoClose: 3000,
              closeButton: true,
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          toast.error("No response received from server", {
            hideProgressBar: true,
            autoClose: 3000,
            closeButton: true,
          });
          setErrors({ general: "No response received from server" });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          toast.error(`Error: ${error.message}`, {
            hideProgressBar: true,
            autoClose: 3000,
            closeButton: true,
          });
          setErrors({ general: error.message });
        }
        
        // Fallback error message
        if (!error.response || !error.response.data) {
          toast.error("An error occurred while adding the booking");
          setErrors(prev => ({ ...prev, general: "An error occurred while adding the booking" }));
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  // Styling classes
  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-[#A67C52]/10 border-b border-[#A67C52]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-md shadow-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add New Booking</h3>
            </div>
            <button 
              onClick={() => setShowAddBookingForm(false)} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        

        
        <div className="p-6">
          {/* Info Banner */}
          <div className="p-4 bg-[#A67C52]/10 rounded-lg border border-[#A67C52]/30 mb-6">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Booking Information</h4>
            <p className="text-xs text-gray-500">Create a new booking with the following details.</p>
          </div>
          
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-4 border-b pb-2">Room Selection & Stay Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="roomNumber" className={labelClasses}>Room Number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Bed className="h-4 w-4" />
                        </div>
                        <input 
                          type="text" 
                          id="roomNumber" 
                          name="roomNumber"
                          value={formData.roomNumber ? `Room ${formData.roomNumber}` : ''}
                          onChange={handleRoomChange}
                          className={`${inputClasses} pl-10 ${errors.roomNumber ? 'border-red-500' : ''}`}
                          placeholder="Enter room number"
                        />

                        {errors.roomNumber && <p className={errorClasses}>{errors.roomNumber}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="roomType" className={labelClasses}>Room Type</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="flex w-full">
                          <input 
                            type="text" 
                            id="roomType" 
                            name="roomType"
                            value={formData.roomType ? (formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)) : 'Standard'}
                            className={`${inputClasses} pl-10 bg-gray-50 ${errors.roomType ? 'border-red-500' : ''}`}
                            readOnly
                            disabled
                          />
                        </div>
                        {errors.roomType && <p className={errorClasses}>{errors.roomType}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="roomPrice" className={labelClasses}>Room Price</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        {availableRooms.length === 1 ? (
                          // Display room price as text field when a specific room is selected
                          <div className="flex w-full">
                            <input 
                              type="text" 
                              id="roomPrice" 
                              value={`₱${formData.amount}/night`}
                              className={`${inputClasses} pl-10 bg-gray-50 ${errors.amount ? 'border-red-500' : ''}`}
                              disabled
                            />
                          </div>
                        ) : (
                          // Use input field when no specific room is selected
                          <div className="flex w-full">
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₱</div>
                            <input 
                              type="number" 
                              id="amount" 
                              name="amount" 
                              value={formData.amount}
                              onChange={handleChange}
                              min="0" 
                              step="0.01"
                              className={`${inputClasses} pl-14 ${errors.amount ? 'border-red-500' : ''}`} 
                              placeholder="Enter room price per night" 
                            />
                          </div>
                        )}
                        {errors.amount && <p className={errorClasses}>{errors.amount}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="extraBeds" className={labelClasses}>Extra Beds</label>
                      <div className="relative">
                        <div className="flex items-center h-[45px] w-full gap-2">
                          <button 
                            type="button" 
                            onClick={() => handleExtraBeds('decrement')}
                            className="h-full px-3 bg-[#A67C52]/10 text-[#8B5A2B] hover:bg-[#A67C52]/20 border border-gray-200 rounded-lg flex items-center justify-center"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                          <input
                            type="text"
                            className={`${inputClasses} flex-1 text-center font-medium`}
                            value={formData.extraBeds}
                            readOnly
                          />
                          <button 
                            type="button" 
                            onClick={() => handleExtraBeds('increment')}
                            className="h-full px-3 bg-[#A67C52]/10 text-[#8B5A2B] hover:bg-[#A67C52]/20 border border-gray-200 rounded-lg flex items-center justify-center"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        {showExtraBedNotice && (
                          <div className="w-full flex items-center mt-1.5 bg-[#A67C52]/10 p-2 rounded-md border border-[#A67C52]/20">
                            <Info className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5 flex-shrink-0" />
                            <p className="text-xs text-[#8B5A2B] font-medium">
                              Extra bed automatically added because total guests exceeds 4
                            </p>
                          </div>
                        )}
                        {errors.extraBeds && <p className={errorClasses}>{errors.extraBeds}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="clientSearch" className={labelClasses}>Client</label>
                      <div className="relative" ref={clientDropdownRef}>
                        <div className={iconWrapperClasses}>
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <div className="flex w-full">
                          <input 
                            type="text" 
                            id="clientSearch" 
                            value={clientSearch}
                            className={`${inputClasses} pl-10 bg-gray-50 ${errors.clientId ? 'border-red-500' : ''}`}
                            readOnly
                            disabled
                          />
                        </div>
                        <input type="hidden" name="clientId" value={formData.clientId} />
                        {errors.clientId && <p className={errorClasses}>{errors.clientId}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className={labelClasses}>Email</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email || ''}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.email ? 'border-red-500' : ''}`} 
                          placeholder="Enter email address" 
                        />
                        {errors.email && <p className={errorClasses}>{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="checkInDate" className={labelClasses}>Check-in Date</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <input 
                          type="date" 
                          id="checkInDate" 
                          name="checkInDate" 
                          value={formData.checkInDate}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.checkInDate ? 'border-red-500' : ''}`} 
                        />
                        {errors.checkInDate && <p className={errorClasses}>{errors.checkInDate}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="checkOutDate" className={labelClasses}>Check-out Date</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <input 
                          type="date" 
                          id="checkOutDate" 
                          name="checkOutDate" 
                          value={formData.checkOutDate}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.checkOutDate ? 'border-red-500' : ''}`} 
                          min={formData.checkInDate || undefined}
                        />
                        {errors.checkOutDate && <p className={errorClasses}>{errors.checkOutDate}</p>}
                      </div>
                      {/* Room Availability Error */}
                      {errors.availability && (
                        <div className="mb-4 rounded-md bg-red-50 p-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <X className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-red-800">{errors.availability}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="adults" className={labelClasses}>Number of Adults</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <Users className="h-4 w-4" />
                        </div>
                        <input 
                          type="number" 
                          id="adults" 
                          name="adults" 
                          value={formData.adults}
                          onChange={handleChange}
                          min="1" 
                          className={`${inputClasses} pl-10 ${errors.adults ? 'border-red-500' : ''}`} 
                          placeholder="Enter number of adults" 
                        />
                        {errors.adults && <p className={errorClasses}>{errors.adults}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="children" className={labelClasses}>Number of Children</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <Users className="h-4 w-4" />
                        </div>
                        <input 
                          type="number" 
                          id="children" 
                          name="children" 
                          value={formData.children}
                          onChange={handleChange}
                          min="0" 
                          className={`${inputClasses} pl-10 ${errors.children ? 'border-red-500' : ''}`} 
                          placeholder="Enter number of children" 
                        />
                        {errors.children && <p className={errorClasses}>{errors.children}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="paymentMethod" className={labelClasses}>Payment Method</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <select 
                          id="paymentMethod" 
                          name="paymentMethod" 
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.paymentMethod ? 'border-red-500' : ''}`}
                        >
                          <option value="credit_card">Credit Card</option>
                          <option value="debit_card">Debit Card</option>
                          <option value="paypal">PayPal</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cash">Cash</option>
                        </select>
                        {errors.paymentMethod && <p className={errorClasses}>{errors.paymentMethod}</p>}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="specialRequests" className={labelClasses}>Special Requests</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <textarea 
                          id="specialRequests" 
                          name="specialRequests" 
                          value={formData.specialRequests}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.specialRequests ? 'border-red-500' : ''}`} 
                          placeholder="Enter any special requests"
                          rows="3"
                        ></textarea>
                        {errors.specialRequests && <p className={errorClasses}>{errors.specialRequests}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Summary */}
              <div className="p-6 bg-gradient-to-br from-[#8B5A2B]/5 to-[#A67C52]/10 rounded-xl border border-[#8B5A2B]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] rounded-md shadow-sm">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#8B5A2B]">Booking Summary</h4>
                    <p className="text-xs text-gray-500">Review your reservation details before confirming</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  <div className="bg-white p-5 rounded-lg border border-[#8B5A2B]/10 shadow-sm">
                    <h5 className="text-sm font-medium text-[#8B5A2B] mb-4 pb-2 border-b border-[#A67C52]/10">Stay Information</h5>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <Home className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Room</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formData.roomNumber ? 
                            `Room ${formData.roomNumber}` : 
                            <span className="text-gray-400 italic">Not selected</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <UserCircle className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Guest</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formData.clientId ? 
                            clients.find(c => c.id == formData.clientId)?.name : 
                            <span className="text-gray-400 italic">Not selected</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <Calendar className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Check-in</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formData.checkInDate ? 
                            new Date(formData.checkInDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            <span className="text-gray-400 italic">Not selected</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <Calendar className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Check-out</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formData.checkOutDate ? 
                            new Date(formData.checkOutDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            <span className="text-gray-400 italic">Not selected</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <Users className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Guests</span>
                        </div>
                        <span className="font-medium text-gray-900">{formData.adults} Adults, {formData.children} Children</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-[#8B5A2B]/10 shadow-sm">
                    <h5 className="text-sm font-medium text-[#8B5A2B] mb-4 pb-2 border-b border-[#A67C52]/10">Payment Details</h5>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <PhilippinePeso className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Room Rate</span>
                        </div>
                        <span className="font-medium text-gray-900">₱{formData.amount} per night</span>
                      </div>
                      {formData.extraBeds > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                              <Bed className="h-4 w-4 text-[#8B5A2B]" />
                            </div>
                            <span className="font-medium text-gray-700">Extra Beds</span>
                          </div>
                          <span className="font-medium text-gray-900">₱{formData.extraBeds * formData.extraBedRate} ({formData.extraBeds} × ₱{formData.extraBedRate})</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#A67C52]/10">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <PhilippinePeso className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Total Amount</span>
                        </div>
                        <span className="font-semibold text-lg text-[#8B5A2B]">
                          ₱{calculateTotalAmount() || '0.00'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#A67C52]/10">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <CreditCard className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Payment Method</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formData.paymentMethod === 'credit_card' && 'Credit Card'}
                          {formData.paymentMethod === 'debit_card' && 'Debit Card'}
                          {formData.paymentMethod === 'paypal' && 'PayPal'}
                          {formData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                          {formData.paymentMethod === 'cash' && 'Cash'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3">
                            <CheckCircle className="h-4 w-4 text-[#8B5A2B]" />
                          </div>
                          <span className="font-medium text-gray-700">Payment Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-[#8B5A2B]/10 text-[#8B5A2B]'}`}>
                          {formData.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {formData.specialRequests && (
                  <div className="bg-white p-4 rounded-lg border border-[#8B5A2B]/10 shadow-sm">
                    <div className="flex items-start">
                      <div className="p-1.5 bg-[#8B5A2B]/5 rounded-md mr-3 mt-0.5">
                        <MessageSquare className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-[#8B5A2B] block mb-2">Special Requests</span>
                        <p className="text-gray-700 text-sm bg-[#8B5A2B]/5 p-3 rounded-md">{formData.specialRequests}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="mt-6 p-4 bg-gradient-to-br from-[#8B5A2B]/5 to-[#A67C52]/10 rounded-xl border border-[#8B5A2B]/20 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    className="h-4 w-4 text-[#8B5A2B] border-gray-300 rounded focus:ring-[#A67C52]/20"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                    I agree to the <button 
                      type="button" 
                      onClick={() => setShowTermsModal(true)}
                      className="text-[#8B5A2B] font-medium hover:underline"
                    >Terms and Conditions</button> and <button 
                      type="button" 
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-[#8B5A2B] font-medium hover:underline"
                    >Privacy Policy</button>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">By confirming this booking, you agree to our hotel policies, including cancellation policy, check-in/check-out times, and payment terms.</p>
                  {errors.termsAccepted && <p className={errorClasses}>{errors.termsAccepted}</p>}
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions Modal */}
            {showTermsModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                  <div className="bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-md">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Terms and Conditions</h3>
                    </div>
                    <button 
                      onClick={() => setShowTermsModal(false)} 
                      className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="prose prose-sm max-w-none">
                      <h4 className="text-[#8B5A2B] font-medium">1. Booking and Reservation</h4>
                      <p className="text-sm text-gray-700 mb-4">All reservations are subject to availability and confirmation by the hotel. A valid credit card is required to secure your booking. The hotel reserves the right to pre-authorize your credit card prior to arrival.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">2. Check-in and Check-out</h4>
                      <p className="text-sm text-gray-700 mb-4">Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability and additional charges.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">3. Cancellation Policy</h4>
                      <p className="text-sm text-gray-700 mb-4">Cancellations made less than 24 hours before the scheduled check-in time will incur a charge equivalent to one night's stay. No-shows will be charged the full amount of the reservation.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">4. Payment</h4>
                      <p className="text-sm text-gray-700 mb-4">Full payment is required at check-in. We accept major credit cards, debit cards, and cash. All rates are quoted in Philippine Pesos and include applicable taxes and service charges.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">5. Room Occupancy</h4>
                      <p className="text-sm text-gray-700 mb-4">Standard room occupancy is for a maximum of 2 adults and 2 children under 12 years old. Extra beds are available at an additional cost of ₱500 per night. Extra beds are automatically added when total guests exceeds 4 people.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">6. Hotel Policies</h4>
                      <ul className="text-sm text-gray-700 mb-4 list-disc pl-5 space-y-1">
                        <li>No smoking in rooms (₱5,000 cleaning fee for violations)</li>
                        <li>Pets are not allowed (service animals excepted)</li>
                        <li>Damage to hotel property will be charged to the guest's account</li>
                        <li>The hotel is not responsible for any loss or damage to personal belongings</li>
                        <li>Quiet hours are from 10:00 PM to 7:00 AM</li>
                      </ul>
                      
                      <h4 className="text-[#8B5A2B] font-medium">7. Modifications and Amendments</h4>
                      <p className="text-sm text-gray-700 mb-4">The hotel reserves the right to modify or amend these terms and conditions at any time. Any changes will be effective immediately upon posting on our website.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button 
                      onClick={() => setShowTermsModal(false)}
                      className="px-4 py-2 bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                  <div className="bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-md">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
                    </div>
                    <button 
                      onClick={() => setShowPrivacyModal(false)} 
                      className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="prose prose-sm max-w-none">
                      <h4 className="text-[#8B5A2B] font-medium">1. Information We Collect</h4>
                      <p className="text-sm text-gray-700 mb-4">We collect personal information such as your name, contact details, payment information, and stay preferences when you make a reservation. We may also collect information about your stay, including dates, room preferences, and special requests.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">2. How We Use Your Information</h4>
                      <p className="text-sm text-gray-700 mb-4">We use your personal information to process your reservation, provide you with the services you request, and communicate with you about your stay. We may also use your information to improve our services, send you promotional offers, and comply with legal obligations.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">3. Information Sharing</h4>
                      <p className="text-sm text-gray-700 mb-4">We may share your information with third-party service providers who help us process payments, manage reservations, and provide other services. We do not sell or rent your personal information to third parties for marketing purposes.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">4. Data Security</h4>
                      <p className="text-sm text-gray-700 mb-4">We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">5. Your Rights</h4>
                      <p className="text-sm text-gray-700 mb-4">You have the right to access, correct, or delete your personal information. You may also object to or restrict the processing of your personal information. To exercise these rights, please contact us using the information provided below.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">6. Cookies and Tracking Technologies</h4>
                      <p className="text-sm text-gray-700 mb-4">We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">7. Changes to This Privacy Policy</h4>
                      <p className="text-sm text-gray-700 mb-4">We may update this Privacy Policy from time to time. Any changes will be effective immediately upon posting on our website. We encourage you to review this Privacy Policy periodically.</p>
                      
                      <h4 className="text-[#8B5A2B] font-medium">8. Contact Us</h4>
                      <p className="text-sm text-gray-700 mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@luxuryhotel.com or call us at +63 2 8888 8888.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button 
                      onClick={() => setShowPrivacyModal(false)}
                      className="px-4 py-2 bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowAddBookingForm(false)} 
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm font-medium text-sm"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting || !formData.termsAccepted}
                className={`px-4 py-2.5 text-white rounded-lg transition-all duration-200 shadow-sm font-medium text-sm ${formData.termsAccepted ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#6B4226]' : 'bg-gray-400 cursor-not-allowed'}`}
                title={!formData.termsAccepted ? "You must accept the terms and conditions to proceed" : ""}
              >
                {isSubmitting ? "Creating..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}