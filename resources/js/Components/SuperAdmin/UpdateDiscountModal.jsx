import { useState, useEffect } from "react";
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

export default function UpdateDiscountModal({ discount, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
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
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with discount data when component mounts or discount prop changes
  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        code: discount.code || "",
        description: discount.description || "",
        type: discount.type || "percentage",
        value: discount.value || "",
        min_purchase: discount.min_purchase || "",
        max_discount: discount.max_discount || "",
        usage_limit: discount.usage_limit || "",
        start_date: discount.start_date ? discount.start_date.split('T')[0] : "",
        end_date: discount.end_date ? discount.end_date.split('T')[0] : "",
        applicable_to: discount.applicable_to || "all",
        status: discount.status || "active"
      });
    }
  }, [discount]);

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
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      _method: 'PUT' // For Laravel to handle as PUT request
    };
    
    axios.post(`/api/discounts/${discount.id}`, dataToSubmit)
      .then(response => {
        toast.success("Discount updated successfully");
        if (onUpdate) onUpdate(response.data);
        onClose();
      })
      .catch(error => {
        console.error("Error updating discount:", error);
        
        if (error.response && error.response.data && error.response.data.errors) {
          // Handle validation errors from Laravel
          setErrors(error.response.data.errors);
          toast.error("Please correct the errors in the form");
        } else {
          toast.error("Failed to update discount. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!discount) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn border border-[#E8DCCA]">
        {/* Elegant header with gradient background */}
        <div className="bg-gradient-to-r from-[#F5EFE7] via-[#E8DCCA] to-[#F5EFE7] border-b border-[#D8C4A9] p-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#442918] flex items-center">
              <span className="mr-2 text-[#6B4226]">✦</span> Update Discount <span className="ml-2 text-[#6B4226]">✦</span>
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
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === 'percentage' ? 'Discount Percentage*' : 'Fixed Amount*'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {formData.type === 'percentage' ? (
                          <Percent className="h-4 w-4 text-gray-400" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        className={`pl-10 w-full px-3 py-2 border ${
                          errors.value ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]`}
                        placeholder={formData.type === 'percentage' ? '10' : '50'}
                        step={formData.type === 'percentage' ? '0.01' : '0.01'}
                        min="0"
                        max={formData.type === 'percentage' ? '100' : ''}
                      />
                    </div>
                    {errors.value && (
                      <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Purchase
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="min_purchase"
                        value={formData.min_purchase}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors.min_purchase && (
                      <p className="mt-1 text-sm text-red-600">{errors.min_purchase}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="max_discount"
                        value={formData.max_discount}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        placeholder="No limit"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors.max_discount && (
                      <p className="mt-1 text-sm text-red-600">{errors.max_discount}</p>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      placeholder="No limit"
                      min="1"
                    />
                    {errors.usage_limit && (
                      <p className="mt-1 text-sm text-red-600">{errors.usage_limit}</p>
                    )}
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
                      <option value="room">Rooms Only</option>
                      <option value="food">Food & Beverages Only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Validity Period */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <Calendar className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Validity Period</span>
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
                      min={new Date().toISOString().split('T')[0]}
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
                      min={formData.start_date || new Date().toISOString().split('T')[0]}
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#6B4226] mr-2" />
                  <span>Status</span>
                  <div className="h-px flex-grow bg-gradient-to-r from-[#D8C4A9] to-transparent ml-3"></div>
                </h4>
                
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#6B4226] focus:ring-[#6B4226] border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#6B4226] focus:ring-[#6B4226] border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] transition-colors duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B4226] text-white rounded-lg hover:bg-[#5A3720] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] transition-colors duration-200 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Discount
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
