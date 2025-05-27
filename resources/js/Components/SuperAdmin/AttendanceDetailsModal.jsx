import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  AlignLeft,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Building,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AttendanceDetailsModal({ show, onClose, record, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: record?.id || '',
    employeeId: record?.employeeId || '',
    date: record?.date || '',
    timeIn: record?.timeIn ? new Date(record.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
    timeOut: record?.timeOut ? new Date(record.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
    status: record?.status || 'present',
    notes: record?.notes || ''
  });

  // Update form data when record changes
  useEffect(() => {
    if (record) {
      setFormData({
        id: record.id || '',
        employeeId: record.employeeId || '',
        date: record.date || '',
        timeIn: record.timeIn ? new Date(record.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
        timeOut: record.timeOut ? new Date(record.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
        status: record.status || 'present',
        notes: record.notes || ''
      });
    }
  }, [record]);

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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status color based on attendance status
  const getStatusColor = (status) => {
    const colors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-[#F5EFE7] text-[#8B5A2B]"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Handle form submission for updating record
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.status !== "absent" && (!formData.timeIn || !formData.timeOut)) {
      toast.error("Please provide both time in and time out");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would call your API to update the record
      // const response = await axios.put(`/api/attendance/${record.id}`, formData);
      
      // Create an updated attendance record
      const updatedRecord = {
        ...record,
        ...formData,
        timeIn: formData.status === "absent" ? null : formData.timeIn ? new Date(`${formData.date}T${formData.timeIn}`).toISOString() : null,
        timeOut: formData.status === "absent" ? null : formData.timeOut ? new Date(`${formData.date}T${formData.timeOut}`).toISOString() : null,
      };
      
      // Call the onUpdate callback with the updated record
      onUpdate(updatedRecord);
      
      // Exit edit mode
      setIsEditing(false);
      toast.success("Attendance record updated successfully!");
    } catch (error) {
      console.error("Error updating attendance record:", error);
      toast.error("Failed to update attendance record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle record deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this attendance record? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would call your API to delete the record
      // const response = await axios.delete(`/api/attendance/${record.id}`);
      
      // Call the onDelete callback with the record id
      onDelete(record.id);
      
      // Close the modal
      onClose();
      toast.success("Attendance record deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      toast.error("Failed to delete attendance record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input class for form fields
  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5A2B] focus:ring-[#A67C52] sm:text-sm";

  return (
    <Dialog
      open={show}
      onClose={() => !isSubmitting && onClose()}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          {/* Close Button */}
          <button
            onClick={() => !isSubmitting && onClose()}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] text-white shadow-sm">
              <User className="h-6 w-6" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {isEditing ? "Edit Attendance Record" : "Attendance Details"}
              </Dialog.Title>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing ? "Update employee attendance information" : "View employee attendance information"}
              </p>
            </div>
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Employee Information (Read-only in edit mode) */}
                <div className="bg-[#F5EFE7] p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#F5EFE7] to-[#E5D3B3] flex items-center justify-center text-[#8B5A2B] font-semibold text-sm flex-shrink-0 border border-[#E8DCCA] shadow-sm">
                      {record.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{record.employee.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {record.employee.position} • <Building className="h-3 w-3" /> {record.employee.department}
                      </div>
                    </div>
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
                  onClick={() => setIsEditing(false)}
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
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* View Details */
            <div>
              {/* Employee Information */}
              <div className="bg-[#F5EFE7] p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#F5EFE7] to-[#E5D3B3] flex items-center justify-center text-[#8B5A2B] font-semibold text-sm flex-shrink-0 border border-[#E8DCCA] shadow-sm">
                    {record.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">{record.employee.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Briefcase className="h-3.5 w-3.5 text-[#8B5A2B]" /> 
                      <span>{record.employee.position}</span>
                      <span className="mx-1">•</span>
                      <Building className="h-3.5 w-3.5 text-[#8B5A2B]" /> 
                      <span>{record.employee.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Details */}
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#8B5A2B] mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="text-base text-gray-900">{formatDate(record.date)}</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  {record.status === "present" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : record.status === "absent" ? (
                    <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  ) : (
                    <Clock className="h-5 w-5 text-[#8B5A2B] mr-3" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="text-base">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time In */}
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-[#8B5A2B] mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Time In</div>
                    <div className="text-base text-gray-900">{record.timeIn ? formatTime(record.timeIn) : "N/A"}</div>
                  </div>
                </div>

                {/* Time Out */}
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-[#8B5A2B] mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Time Out</div>
                    <div className="text-base text-gray-900">{record.timeOut ? formatTime(record.timeOut) : "N/A"}</div>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex items-start">
                  <AlignLeft className="h-5 w-5 text-[#8B5A2B] mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Notes</div>
                    <div className="text-base text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {record.notes || "No notes provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isSubmitting}
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52]"
                    disabled={isSubmitting}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] border border-transparent rounded-md shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
