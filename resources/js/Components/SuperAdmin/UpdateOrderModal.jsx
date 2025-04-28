import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash, DollarSign, User, MapPin, Clock, Utensils, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UpdateOrderModal({ show, onClose, order, onUpdate }) {
  const [formData, setFormData] = useState({
    customerName: '',
    roomNumber: '',
    items: [],
    notes: '',
    status: '',
    isSeniorCitizen: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Initialize form data when order changes
  useEffect(() => {
    if (order) {
      // Parse items if it's a string (JSON)
      const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : (Array.isArray(order.items) ? order.items : []);
      
      // Ensure each item has a unique ID and proper menuItemId conversion
      const itemsWithIds = orderItems.map(item => ({
        ...item,
        id: item.id || Date.now() + Math.floor(Math.random() * 1000),
        // Convert menu_item_id to menuItemId if it exists
        menuItemId: item.menu_item_id || item.menuItemId || null
      }));
      
      setFormData({
        customerName: order.customerName || '',
        roomNumber: order.roomNumber || '',
        items: itemsWithIds,
        notes: order.notes || '',
        status: order.status || 'pending',
        isSeniorCitizen: order.isSeniorCitizen || false
      });
      
      // Calculate initial totals
      calculateTotals(itemsWithIds, order.isSeniorCitizen || false);
    }
  }, [order]);

  // Fetch menu items when modal opens
  useEffect(() => {
    if (show) {
      fetchMenuItems();
    }
  }, [show]);

  // Fetch menu items from the API
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        roomNumber: order.roomNumber || '',
        items: order.items || [],
        notes: order.notes || '',
        status: order.status || 'pending',
        isSeniorCitizen: order.isSeniorCitizen || false
      });
    }
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      const hasInvalidItem = formData.items.some(item => !item.menuItemId || item.quantity <= 0);
      if (hasInvalidItem) {
        newErrors.items = 'All items must have a menu item selected and valid quantity';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data in a format Laravel expects
    const orderData = {
      _method: 'PUT', // Laravel method spoofing
      customerName: formData.customerName,
      roomNumber: formData.roomNumber,
      status: formData.status,
      notes: formData.notes || '',
      isSeniorCitizen: formData.isSeniorCitizen ? 1 : 0,
      // Send pricing data separately
      subtotal: subtotal,
      discount: discount,
      total: total,
      // Convert items to a format Laravel can process
      items: JSON.stringify(formData.items.map(item => ({
        menu_item_id: parseInt(item.menuItemId) || 0,
        name: item.name,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0
      })))
    };
    
    // Send the data to the server
    axios.post(`/api/orders/${order.id}`, orderData)
      .then(response => {
        // Check if the response contains the updated order
        if (response.data && response.data.data) {
          // Call the onUpdate callback with the response data
          onUpdate(response.data.data);
          
          // Show success message
          toast.success('Order updated successfully!');
          
          // Close the modal
          onClose();
        } else {
          // Handle unexpected response format
          console.error('Unexpected response format:', response.data);
          toast.error('Received unexpected response format from server');
        }
      })
      .catch(error => {
        console.error('Error updating order:', error);
        
        // Show error message
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to update order. Please try again.');
        }
      })
      .finally(() => {
        // Reset submission state
        setIsSubmitting(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Recalculate totals if senior citizen status changes
    if (name === 'isSeniorCitizen') {
      calculateTotals(formData.items, checked);
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (id, field, value) => {
    // Update the items array with the new value
    const updatedItems = formData.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Recalculate totals when quantity or price changes
    calculateTotals(updatedItems, formData.isSeniorCitizen);
    
    // Clear items error if it exists
    if (errors.items) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  const handleMenuItemSelect = (menuItemId, orderItemId) => {
    // Convert menuItemId to number for consistent comparison
    const menuItemIdNum = parseInt(menuItemId, 10);
    
    const selectedMenuItem = menuItems.find(item => item.id === menuItemIdNum);
    
    if (!selectedMenuItem) return;
    
    // Check if this menu item already exists in another order item
    const existingItemIndex = formData.items.findIndex(item => 
      item.id !== orderItemId && parseInt(item.menuItemId, 10) === menuItemIdNum
    );
    
    // If the item already exists in the order
    if (existingItemIndex !== -1) {
      // Create a copy of the items array
      const updatedItems = [...formData.items];
      
      // Increment the quantity of the existing item
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      
      // Remove the current item if it's a new empty item
      const filteredItems = updatedItems.filter(item => 
        item.id !== orderItemId || (item.menuItemId && item.name)
      );
      
      // Show toast notification
      toast.info(`${selectedMenuItem.menuname || selectedMenuItem.name} already exists in your order. Quantity increased instead.`);
      
      // Update form data with the modified items
      setFormData(prev => ({
        ...prev,
        items: filteredItems
      }));
      
      // Update totals
      calculateTotals(filteredItems, formData.isSeniorCitizen);
      return;
    }
    
    // If the item doesn't exist yet, proceed with normal selection
    const updatedItems = formData.items.map(item => {
      // Only update the specific item that was changed
      if (item.id === orderItemId) {
        return { 
          ...item, 
          menuItemId: menuItemIdNum,
          name: selectedMenuItem.menuname || selectedMenuItem.name,
          price: selectedMenuItem.price
        };
      }
      // Return all other items unchanged
      return item;
    });
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    calculateTotals(updatedItems, formData.isSeniorCitizen);
  };

  const addItem = () => {
    const newItemId = Date.now();
    const newItems = [...formData.items, { id: newItemId, menuItemId: '', name: '', quantity: 1, price: 0 }];
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    
    // Recalculate totals after adding a new item
    calculateTotals(newItems, formData.isSeniorCitizen);
  };

  const incrementQuantity = (id) => {
    const updatedItems = formData.items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    
    setFormData(prev => ({
      ...prev, 
      items: updatedItems
    }));
    
    // Recalculate totals after incrementing quantity
    calculateTotals(updatedItems, formData.isSeniorCitizen);
  };

  const decrementQuantity = (id) => {
    const updatedItems = formData.items.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    
    setFormData(prev => ({
      ...prev, 
      items: updatedItems
    }));
    
    // Recalculate totals after decrementing quantity
    calculateTotals(updatedItems, formData.isSeniorCitizen);
  };

  const removeItem = (id) => {
    const updatedItems = formData.items.filter(item => item.id !== id);
    
    setFormData(prev => ({
      ...prev, 
      items: updatedItems
    }));
    
    // Recalculate totals after removing item
    calculateTotals(updatedItems, formData.isSeniorCitizen);
  };

  const calculateTotals = (items, isSeniorCitizen) => {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.quantity * (parseFloat(item.price) || 0)), 0
    );
    const discount = isSeniorCitizen ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    setSubtotal(subtotal);
    setDiscount(discount);
    setTotal(total);
  };

  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slideIn">
          {/* Header */}
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Update Order</h3>
              </div>
              <button 
                onClick={onClose}                       
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-200">Customer Information</h4>
                  
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm p-2.5"
                    />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm p-2.5"
                    />
                    {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm p-2.5"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isSeniorCitizen"
                      name="isSeniorCitizen"
                      checked={formData.isSeniorCitizen}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isSeniorCitizen" className="ml-2 block text-sm text-gray-700">
                      Senior Citizen (10% Discount)
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="4"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requests or dietary restrictions"
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm p-2.5"
                    ></textarea>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-800 mb-3">Order Summary</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-amber-800">Subtotal:</span>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-amber-600 mr-1" />
                        <span className="text-sm font-semibold text-amber-600">{subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-amber-800">Discount:</span>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-amber-600 mr-1" />
                        <span className="text-sm font-semibold text-amber-600">{discount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-amber-200">
                      <span className="text-sm font-medium text-amber-800">Total:</span>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-amber-600 mr-1" />
                        <span className="text-base font-bold text-amber-600">{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Items */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-200">Order Items</h4>
                  
                  {errors.items && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-md">
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        {errors.items}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-grow relative">
                          <select
                            value={item.menuItemId ? String(item.menuItemId) : ''}
                            onChange={(e) => handleMenuItemSelect(e.target.value, item.id)}
                            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm py-1.5 px-3 pr-10"
                          >
                            <option value="">Select a menu item</option>
                            {menuItems.map(menuItem => (
                              <option key={menuItem.id} value={String(menuItem.id)}>
                                {menuItem.menuname || menuItem.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md bg-white h-[34px]">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.id)}
                            className="px-2 py-1 text-gray-500 hover:text-amber-700 focus:outline-none"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.id)}
                            className="px-2 py-1 text-gray-500 hover:text-amber-700 focus:outline-none"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="w-24 relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            disabled
                            className="w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-sm py-1.5 pl-9 pr-3 cursor-not-allowed"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none p-1.5 bg-red-50 rounded-md"
                          disabled={formData.items.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-1.5 border border-amber-200 shadow-sm text-xs font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center items-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-sm font-medium text-white hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
