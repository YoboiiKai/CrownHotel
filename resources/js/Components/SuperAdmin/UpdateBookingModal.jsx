import React, { useState, useRef, useEffect } from "react";
import { X, Calendar, Users, MessageSquare, Home, UserCircle, CreditCard, DollarSign, CheckCircle, PhilippinePeso, Bed, FileText, Plus, Minus, Info, Sparkles, Mail, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function UpdateBookingModal({
  booking,
  setShowUpdateBookingForm,
  updateBooking,
  getRoomTypeLabel,
  formatDate,
}) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    clientId: "",
    paymentMethod: "credit_card",
    amount: "",
    paymentStatus: "pending",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);

  // Initialize form with booking data and fetch necessary data
  useEffect(() => {
    fetchRooms();
    fetchClients();
    
    // If booking data is provided, populate the form
    if (booking) {
      // Format dates to YYYY-MM-DD for input[type="date"]
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
      };

      setFormData({
        roomNumber: booking.roomNumber || "",
        roomType: booking.roomType || "",
        checkInDate: formatDateForInput(booking.checkInDate),
        checkOutDate: formatDateForInput(booking.checkOutDate),
        adults: booking.adults || 1,
        children: booking.children || 0,
        specialRequests: booking.specialRequests || "",
        clientId: booking.clientId || "",
        paymentMethod: booking.paymentMethod || "credit_card",
        amount: booking.amount || "",
        paymentStatus: booking.paymentStatus || "pending",
      });
    }
  }, [booking]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/superadmin/rooms');
      console.log('Rooms API response:', data);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    }
  };
  
  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/clients');
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    
    // If check-in or check-out date changes, recalculate total amount
    if ((name === 'checkInDate' || name === 'checkOutDate') && formData.amount && formData.roomNumber) {
      // Only calculate if both dates are available
      const otherDateField = name === 'checkInDate' ? 'checkOutDate' : 'checkInDate';
      const otherDate = formData[otherDateField];
      
      if (value && otherDate) {
        const checkIn = new Date(name === 'checkInDate' ? value : otherDate);
        const checkOut = new Date(name === 'checkOutDate' ? value : otherDate);
        
        // Only calculate if check-out is after check-in
        if (checkOut > checkIn) {
          const diffTime = Math.abs(checkOut - checkIn);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const totalAmount = (diffDays * parseFloat(formData.amount)).toFixed(2);
          
          toast.info(`Room rate: $${formData.amount} per night | Total for ${diffDays} nights: $${totalAmount}`);
        }
      }
    }
  };
  
  const handleRoomChange = (e) => {
    const { value } = e.target;
    console.log('Selected room value:', value);
    console.log('Available rooms:', rooms);
    
    const selectedRoom = rooms.find(room => {
      const roomId = room.id?.toString() || '';
      const roomNumber = room.room_number?.toString() || room.roomNumber?.toString() || '';
      return roomNumber === value || roomId === value;
    });
    
    console.log('Selected room object:', selectedRoom);
    
    if (selectedRoom) {
      // Get the room rate - check all possible property names
      const roomRate = selectedRoom.price || selectedRoom.rate || selectedRoom.room_rate || '0';
      console.log('Room rate found:', roomRate);
      
      // Update form data with room details
      setFormData({
        ...formData,
        roomNumber: selectedRoom.room_number || selectedRoom.roomNumber || selectedRoom.id || value,
        roomType: selectedRoom.room_type || selectedRoom.roomType || 'standard',
        amount: roomRate,
      });
      
      // Calculate total amount if dates are available
      if (formData.checkInDate && formData.checkOutDate) {
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Display total amount for the stay
        const totalAmount = (diffDays * parseFloat(roomRate)).toFixed(2);
        toast.info(`Room rate: $${roomRate} per night | Total for ${diffDays} nights: $${totalAmount}`);
      } else {
        // Just display the room rate if dates aren't selected yet
        toast.info(`Room rate: $${roomRate} per night`);
      }
    } else {
      console.log('No matching room found for value:', value);
      setFormData({
        ...formData,
        roomNumber: value,
        roomType: '',
        amount: '',
      });
    }
  };
  
  const calculateTotalAmount = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.amount) {
      return 0;
    }
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (diffDays * parseFloat(formData.amount)).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
    }
    
    if (!formData.roomNumber) {
      newErrors.roomNumber = "Room number is required";
    }
    
    if (!formData.checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    }
    
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    }
    
    if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      newErrors.checkOutDate = "Check-out date must be after check-in date";
    }
    
    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required";
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Room rate must be greater than zero";
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
    } else {
      setIsSubmitting(true);
      
      try {
        // Call the parent component's update handler
        updateBooking(booking.id, formData);
        
        // Close the modal
        setShowUpdateBookingForm(false);
        
        // Show success message
        toast.success("Booking updated successfully!");
      } catch (error) {
        console.error("Error updating booking:", error);
        toast.error("Failed to update booking. Please try again.");
        setErrors({ general: "An error occurred while updating the booking" });
      } finally {
        setIsSubmitting(false);
      }
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
              <h3 className="text-lg font-bold text-gray-900">Update Booking</h3>
            </div>
            <button 
              onClick={() => setShowUpdateBookingForm(false)} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Info Banner */}
          <div className="p-4 bg-[#A67C52]/10 rounded-lg border border-[#A67C52]/30 mb-6">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Update Booking</h4>
            <p className="text-xs text-gray-500">Modify the booking details below.</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="roomNumber" className={labelClasses}>Room Number</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <Home className="h-4 w-4" />
                        </div>
                        <select 
                          id="roomNumber" 
                          name="roomNumber" 
                          value={formData.roomNumber}
                          onChange={handleRoomChange}
                          className={`${inputClasses} pl-10 ${errors.roomNumber ? 'border-red-500' : ''}`}
                          >
                            <option value="">Select a room</option>
                            {rooms && rooms.length > 0 ? (
                              rooms.map((room, index) => {
                                // Handle different property naming conventions
                                const roomId = room.id || '';
                                const roomNumber = room.room_number || room.roomNumber || roomId;
                                const roomType = room.room_type || room.roomType || 'standard';
                                const displayRoomType = roomType.charAt(0).toUpperCase() + roomType.slice(1);
                                const roomRate = room.room_rate || room.price || room.rate || '0';
                                
                                return (
                                  <option key={index} value={roomId}>
                                    Room {roomNumber} - {displayRoomType} (${roomRate}/night)
                                  </option>
                                );
                              })
                            ) : (
                              <option value="" disabled>No rooms available</option>
                            )}
                          </select>

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
                            value={formData.roomType ? (formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)) : 'Select room first'}
                            className={`${inputClasses} pl-10 bg-gray-50 ${errors.roomType ? 'border-red-500' : ''} ${!formData.roomType ? 'text-gray-400 italic' : ''}`}
                            readOnly
                            disabled
                          />
                        </div>
                        {errors.roomType && <p className={errorClasses}>{errors.roomType}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="clientId" className={labelClasses}>Client</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <select 
                          id="clientId" 
                          name="clientId" 
                          value={formData.clientId}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10 ${errors.clientId ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select a client</option>
                          {clients && clients.length > 0 ? (
                            clients.map((client, index) => (
                              <option key={index} value={client.id}>
                                {client.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No clients available</option>
                          )}
                        </select>
                        {errors.clientId && <p className={errorClasses}>{errors.clientId}</p>}
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
                        />
                        {errors.checkOutDate && <p className={errorClasses}>{errors.checkOutDate}</p>}
                      </div>
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
                      <label htmlFor="amount" className={labelClasses}>Room Rate (per night)</label>
                      <div className="relative">
                        <div className={iconWrapperClasses}>
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <input 
                          type="number" 
                          id="amount" 
                          name="amount" 
                          value={formData.amount}
                          onChange={handleChange}
                          min="0" 
                          step="0.01"
                          className={`${inputClasses} pl-10 ${errors.amount ? 'border-red-500' : ''}`} 
                          placeholder="Enter room rate" 
                        />
                        {errors.amount && <p className={errorClasses}>{errors.amount}</p>}
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
                    <div className="sm:col-span-2 md:col-span-3">
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
                          rows="3" 
                          className={`${inputClasses} pl-10 ${errors.specialRequests ? 'border-red-500' : ''}`} 
                          placeholder="Enter any special requests or notes"
                        ></textarea>
                        {errors.specialRequests && <p className={errorClasses}>{errors.specialRequests}</p>}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              {/* Booking Summary */}
              <div className="p-4 bg-[#A67C52]/10 rounded-lg border border-[#A67C52]/20">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Booking Summary</h4>
                <p className="text-xs text-gray-500 mb-4">Review your booking details before confirming.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Booking Details</h5>
                    <div className="bg-white p-3 rounded-lg border border-[#A67C52]/20">
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Home className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Room:</span>
                          </div>
                          <span>
                            {formData.roomNumber ? 
                              `Room ${formData.roomNumber}` : 
                              'Not selected'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <UserCircle className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Client:</span>
                          </div>
                          <span>
                            {formData.clientId ? 
                              clients.find(c => c.id == formData.clientId)?.name : 
                              'Not selected'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Check-in:</span>
                          </div>
                          <span>
                            {formData.checkInDate ? 
                              new Date(formData.checkInDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 
                              'Not selected'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Check-out:</span>
                          </div>
                          <span>
                            {formData.checkOutDate ? 
                              new Date(formData.checkOutDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 
                              'Not selected'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Guests:</span>
                          </div>
                          <span>{formData.adults} Adults, {formData.children} Children</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Room Rate:</span>
                          </div>
                          <span>${formData.amount} per night</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Total Amount:</span>
                          </div>
                          <span className="font-medium text-amber-700">
                            ${calculateTotalAmount() || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Payment Method:</span>
                          </div>
                          <span>
                            {formData.paymentMethod === 'credit_card' && 'Credit Card'}
                            {formData.paymentMethod === 'debit_card' && 'Debit Card'}
                            {formData.paymentMethod === 'paypal' && 'PayPal'}
                            {formData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                            {formData.paymentMethod === 'cash' && 'Cash'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="font-medium">Payment Status:</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${formData.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-[#A67C52]/20 text-[#8B5A2B]'}`}>
                            {formData.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        {formData.specialRequests && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex items-start">
                              <MessageSquare className="h-3 w-3 text-gray-400 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium block mb-1">Special Requests:</span>
                                <p className="text-gray-600">{formData.specialRequests}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowUpdateBookingForm(false)} 
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm font-medium text-sm"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white rounded-lg hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all duration-200 shadow-sm font-medium text-sm"
              >
                {isSubmitting ? "Updating..." : "Update Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
