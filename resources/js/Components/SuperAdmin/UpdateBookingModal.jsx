import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Calendar, Users, MessageSquare, Home, DollarSign } from "lucide-react";

export default function UpdateBookingModal({
  booking,
  setShowUpdateBookingForm,
  updateBooking,
  getRoomTypeLabel,
  formatDate,
}) {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    roomNumber: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    totalAmount: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName || "",
        email: booking.email || "",
        phone: booking.phone || "",
        roomNumber: booking.roomNumber || "",
        roomType: booking.roomType || "",
        checkInDate: booking.checkInDate || "",
        checkOutDate: booking.checkOutDate || "",
        adults: booking.adults || 1,
        children: booking.children || 0,
        specialRequests: booking.specialRequests || "",
        totalAmount: booking.totalAmount || 0,
      });
    }
  }, [booking]);

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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) {
      newErrors.guestName = "Guest name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
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
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than zero";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
      try {
        updateBooking(booking.id, formData);
        setShowUpdateBookingForm(false);
      } catch (error) {
        console.error("Error updating booking:", error);
        setErrors({ general: "An error occurred while updating the booking" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!booking) return null;

  // Styling classes
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputClasses = "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all";
  const errorClasses = "text-red-500 text-xs mt-1";
  const iconWrapperClasses = "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header - keeping the gradient header */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
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
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Info Banner */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Booking Information</h4>
              <p className="text-xs text-gray-500">Update the booking with the following details.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guestName" className={labelClasses}>Guest Name</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <User className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    id="guestName" 
                    name="guestName" 
                    value={formData.guestName}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter guest name" 
                  />
                  {errors.guestName && <p className={errorClasses}>{errors.guestName}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter email" 
                  />
                  {errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter phone number" 
                  />
                  {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="roomNumber" className={labelClasses}>Room Number</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <Home className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    id="roomNumber" 
                    name="roomNumber" 
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter room number" 
                  />
                  {errors.roomNumber && <p className={errorClasses}>{errors.roomNumber}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="roomType" className={labelClasses}>Room Type</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <Home className="h-4 w-4" />
                  </div>
                  <select 
                    id="roomType" 
                    name="roomType" 
                    value={formData.roomType}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10`}
                  >
                    <option value="">Select room type</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                  </select>
                  {errors.roomType && <p className={errorClasses}>{errors.roomType}</p>}
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
                    className={`${inputClasses} pl-10`} 
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
                    className={`${inputClasses} pl-10`} 
                  />
                  {errors.checkOutDate && <p className={errorClasses}>{errors.checkOutDate}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="totalAmount" className={labelClasses}>Total Amount</label>
                <div className="relative">
                  <div className={iconWrapperClasses}>
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pl-1 text-gray-500">
                    <span>₱</span>
                  </div>
                  <input 
                    type="number" 
                    id="totalAmount" 
                    name="totalAmount" 
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className={`${inputClasses} pl-14`} 
                    placeholder="Enter total amount" 
                  />
                  {errors.totalAmount && <p className={errorClasses}>{errors.totalAmount}</p>}
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
                    className={`${inputClasses} pl-10`} 
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
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter number of children" 
                  />
                  {errors.children && <p className={errorClasses}>{errors.children}</p>}
                </div>
              </div>
              <div className="col-span-2">
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
                    className={`${inputClasses} pl-10`} 
                    placeholder="Enter any special requests"
                    rows="3"
                  ></textarea>
                  {errors.specialRequests && <p className={errorClasses}>{errors.specialRequests}</p>}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowUpdateBookingForm(false)} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all duration-200 shadow-sm"
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