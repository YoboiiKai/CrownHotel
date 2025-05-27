import React, { useState } from "react";
import {
  X,
  Tag,
  Calendar,
  Percent,
  DollarSign,
  Info,
  CheckCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddDiscountModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage", // percentage or fixed
    value: "",
    min_purchase: "",
    max_discount: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    applicable_to: "all", // all, room, food
    status: "active"
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      type: "percentage",
      value: "",
      min_purchase: "",
      max_discount: "",
      usage_limit: "",
      start_date: "",
      end_date: "",
      applicable_to: "all",
      status: "active"
    });
    setErrors({});
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Discount name is required";
    }
    
    if (formData.type === "percentage") {
      const percentValue = parseFloat(formData.value);
      if (isNaN(percentValue) || percentValue <= 0 || percentValue > 100) {
        newErrors.value = "Percentage must be between 1 and 100";
      }
    } else {
      const fixedValue = parseFloat(formData.value);
      if (isNaN(fixedValue) || fixedValue <= 0) {
        newErrors.value = "Fixed amount must be greater than 0";
      }
    }
    
    if (formData.min_purchase && parseFloat(formData.min_purchase) < 0) {
      newErrors.min_purchase = "Minimum purchase cannot be negative";
    }
    
    if (formData.max_discount && parseFloat(formData.max_discount) <= 0) {
      newErrors.max_discount = "Maximum discount must be greater than 0";
    }
    
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    } else if (formData.start_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    
    setIsLoading(true);
    
    // Convert numeric fields to numbers
    const dataToSubmit = {
      ...formData,
      value: parseFloat(formData.value),
      min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
      max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null
    };
    
    axios.post('/api/discounts', dataToSubmit)
      .then(response => {
        toast.success("Discount created successfully");
        resetForm();
        if (onSubmit) onSubmit(response.data);
      })
      .catch(error => {
        console.error("Error creating discount:", error);
        
        if (error.response && error.response.data && error.response.data.errors) {
          // Handle validation errors from Laravel
          setErrors(error.response.data.errors);
          toast.error("Please correct the errors in the form");
        } else {
          toast.error("Failed to create discount. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn border border-[#E8DCCA]">
        {/* Elegant header with gradient background */}
        <div className="bg-gradient-to-r from-[#F5EFE7] via-[#E8DCCA] to-[#F5EFE7] border-b border-[#D8C4A9] p-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#442918] flex items-center">
              <span className="mr-2 text-[#6B4226]">✦</span> Add New Discount <span className="ml-2 text-[#6B4226]">✦</span>
            </h3>
            <button 
              onClick={onClose} 
              className="text-[#6B4226] hover:text-[#442918] transition-colors duration-200 p-1 rounded-full hover:bg-[#F5EFE7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-b from-[#F5EFE7]/30 to-white">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <Tag className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Basic Information</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                      placeholder="Summer Special"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.code ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                      placeholder="SUMMER2025"
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-3 py-2 border ${
                        errors.description ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                      placeholder="Special summer discount for all bookings"
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Discount Details */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <Percent className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Discount Details</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type*
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="percentage"
                          checked={formData.type === "percentage"}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#A67C52] focus:ring-[#A67C52]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Percentage (%)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="fixed"
                          checked={formData.type === "fixed"}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#A67C52] focus:ring-[#A67C52]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Fixed Amount (₱)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === "percentage" ? "Percentage Value*" : "Fixed Amount*"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {formData.type === "percentage" ? (
                          <Percent className="h-4 w-4 text-gray-500" />
                        ) : (
                          <span className="text-gray-500">₱</span>
                        )}
                      </div>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        min="0"
                        step={formData.type === "percentage" ? "1" : "0.01"}
                        max={formData.type === "percentage" ? "100" : ""}
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.value ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                        placeholder={formData.type === "percentage" ? "15" : "500"}
                      />
                    </div>
                    {errors.value && (
                      <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Purchase Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₱</span>
                      </div>
                      <input
                        type="number"
                        name="min_purchase"
                        value={formData.min_purchase}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.min_purchase ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                        placeholder="1000"
                      />
                    </div>
                    {errors.min_purchase && (
                      <p className="mt-1 text-sm text-red-600">{errors.min_purchase}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₱</span>
                      </div>
                      <input
                        type="number"
                        name="max_discount"
                        value={formData.max_discount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.max_discount ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                        placeholder="2000"
                      />
                    </div>
                    {errors.max_discount && (
                      <p className="mt-1 text-sm text-red-600">{errors.max_discount}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 italic">
                      Leave empty for unlimited discount amount
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Validity and Usage */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <Calendar className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Validity and Usage</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.start_date ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                    />
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.end_date ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usage_limit"
                      value={formData.usage_limit}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-3 py-2 border ${
                        errors.usage_limit ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                      placeholder="100"
                    />
                    {errors.usage_limit && (
                      <p className="mt-1 text-sm text-red-600">{errors.usage_limit}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 italic">
                      Leave empty for unlimited usage
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applicable To
                    </label>
                    <select
                      name="applicable_to"
                      value={formData.applicable_to}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                    >
                      <option value="all">All Services</option>
                      <option value="room">Room Bookings Only</option>
                      <option value="food">Food Orders Only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <Info className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Status</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#A67C52] focus:ring-[#A67C52]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#A67C52] focus:ring-[#A67C52]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-5 border-t border-[#E8DCCA] mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#A67C52] to-[#5C341F] hover:from-[#5C341F] hover:to-[#442918] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Create Discount
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
