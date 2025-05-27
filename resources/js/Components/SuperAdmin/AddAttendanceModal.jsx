import { useState, useEffect, Fragment } from 'react';
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
        timeIn: '',
        timeOut: '',
        [name]: value
      }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      employeeId: '',
      date: date || new Date().toISOString().split('T')[0],
      timeIn: '',
      timeOut: '',
      status: 'present',
      notes: ''
    });
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (formData.status !== "absent" && (!formData.timeIn || !formData.timeOut)) {
      toast.error("Please provide both time in and time out");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would call your API to save the record
      // const response = await axios.post('/api/attendance', formData);
      
      // Find the selected employee from the employees array
      const selectedEmployee = employees.find(emp => emp.id.toString() === formData.employeeId.toString());
      
      // Create a new attendance record
      const newRecord = {
        ...formData,
        employee: selectedEmployee,
        timeIn: formData.status === "absent" ? null : formData.timeIn ? new Date(`${formData.date}T${formData.timeIn}`).toISOString() : null,
        timeOut: formData.status === "absent" ? null : formData.timeOut ? new Date(`${formData.date}T${formData.timeOut}`).toISOString() : null,
      };
      
      // Call the onSubmit callback with the new record
      onSubmit(newRecord);
      
      // Reset the form and close the modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding attendance record:", error);
      toast.error("Failed to add attendance record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input class for form fields
  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5A2B] focus:ring-[#A67C52] sm:text-sm";

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => !isSubmitting && onClose()}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Close Button */}
          <button
            onClick={() => !isSubmitting && onClose()}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] text-white shadow-sm">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Add Attendance Record
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Record employee attendance for the selected date
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Employee Selection */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-10`}
                    required
                  >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-10`}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attendance Status
                </label>
                <div className="mt-2 flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="status-present"
                      name="status"
                      type="radio"
                      value="present"
                      checked={formData.status === "present"}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-[#8B5A2B] focus:ring-[#A67C52]"
                    />
                    <label htmlFor="status-present" className="ml-2 flex items-center text-sm text-gray-700">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      Present
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-late"
                      name="status"
                      type="radio"
                      value="late"
                      checked={formData.status === "late"}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-[#8B5A2B] focus:ring-[#A67C52]"
                    />
                    <label htmlFor="status-late" className="ml-2 flex items-center text-sm text-gray-700">
                      <Clock className="mr-1 h-4 w-4 text-[#8B5A2B]" />
                      Late
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-absent"
                      name="status"
                      type="radio"
                      value="absent"
                      checked={formData.status === "absent"}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-[#8B5A2B] focus:ring-[#A67C52]"
                    />
                    <label htmlFor="status-absent" className="ml-2 flex items-center text-sm text-gray-700">
                      <XCircle className="mr-1 h-4 w-4 text-red-500" />
                      Absent
                    </label>
                  </div>
                </div>
              </div>

              {/* Time Fields (only shown if status is not absent) */}
              {formData.status !== "absent" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Time In */}
                  <div>
                    <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700">
                      Time In
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="timeIn"
                        name="timeIn"
                        value={formData.timeIn}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10`}
                        required={formData.status !== "absent"}
                      />
                    </div>
                  </div>

                  {/* Time Out */}
                  <div>
                    <label htmlFor="timeOut" className="block text-sm font-medium text-gray-700">
                      Time Out
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="timeOut"
                        name="timeOut"
                        value={formData.timeOut}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10`}
                        required={formData.status !== "absent"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2">
                    <AlignLeft className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-10`}
                    placeholder={formData.status === "absent" ? "Reason for absence..." : "Additional notes..."}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => !isSubmitting && onClose()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] border border-transparent rounded-md shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
