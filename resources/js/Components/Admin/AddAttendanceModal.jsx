import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  AlignLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddAttendanceModal({ show, onClose, onSubmit, employees, date }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: date || new Date().toISOString().split('T')[0],
    timeIn: '',
    timeOut: '',
    status: 'present',
    notes: ''
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (show) {
      setFormData({
        employeeId: '',
        date: date || new Date().toISOString().split('T')[0],
        timeIn: '',
        timeOut: '',
        status: 'present',
        notes: ''
      });
    }
  }, [show, date]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    // If status is changed to absent, clear time fields
    if (name === "status" && value === "absent") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        timeIn: '',
        timeOut: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }
    
    if (formData.status === "present" && (!formData.timeIn || !formData.timeOut)) {
      toast.error("Please enter both time in and time out for present employees");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real implementation, you would call your API to save the record
    // For now, we'll just simulate an API call
    setTimeout(() => {
      // Find the employee object from the ID
      const employee = employees.find(emp => emp.id.toString() === formData.employeeId.toString());
      
      // Create the record with employee details
      const newRecord = {
        ...formData,
        id: Math.floor(Math.random() * 1000), // Generate a random ID
        employee: employee,
        timeIn: formData.timeIn ? new Date(`${formData.date}T${formData.timeIn}`).toISOString() : null,
        timeOut: formData.timeOut ? new Date(`${formData.date}T${formData.timeOut}`).toISOString() : null,
      };
      
      // Call the onSubmit callback with the new record
      onSubmit(newRecord);
      
      // Reset form and close modal
      setFormData({
        employeeId: '',
        date: date || new Date().toISOString().split('T')[0],
        timeIn: '',
        timeOut: '',
        status: 'present',
        notes: ''
      });
      
      setIsSubmitting(false);
      onClose();
      
      toast.success("Attendance record added successfully!");
    }, 1000);
  };

  if (!show) return null;

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
      onClose={onClose}
      open={show}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]">
                <User className="h-5 w-5 text-white" />
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Add Attendance Record
              </Dialog.Title>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Employee Selection */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 px-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="present"
                      checked={formData.status === "present"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-[#8B5A2B] focus:ring-[#A67C52]/20"
                    />
                    <span className="ml-2 text-sm text-gray-700">Present</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="absent"
                      checked={formData.status === "absent"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-red-600 focus:ring-red-500/20"
                    />
                    <span className="ml-2 text-sm text-gray-700">Absent</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="late"
                      checked={formData.status === "late"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-[#8B5A2B] focus:ring-[#A67C52]/20"
                    />
                    <span className="ml-2 text-sm text-gray-700">Late</span>
                  </label>
                </div>
              </div>

              {/* Time In and Time Out (only if status is present or late) */}
              {formData.status !== "absent" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700 mb-1">
                      Time In
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <input
                        type="time"
                        id="timeIn"
                        name="timeIn"
                        value={formData.timeIn}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                        required={formData.status !== "absent"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="timeOut" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Out
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-[#8B5A2B]" />
                      </div>
                      <input
                        type="time"
                        id="timeOut"
                        name="timeOut"
                        value={formData.timeOut}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                        required={formData.status !== "absent"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes here..."
                    className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 focus:ring-offset-2 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}