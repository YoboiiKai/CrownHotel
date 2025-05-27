import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  AlignLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AttendanceDetailsModal({ show, onClose, record }) {
  if (!show || !record) return null;

  // Format date and time
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  const formatTime = (timeString) => {
    try {
      return format(parseISO(timeString), 'h:mm a');
    } catch (error) {
      return timeString || 'N/A';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (record.status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  // Get status text with color
  const getStatusText = () => {
    switch (record.status) {
      case 'present':
        return <span className="text-green-600 font-medium">Present</span>;
      case 'absent':
        return <span className="text-red-600 font-medium">Absent</span>;
      case 'late':
        return <span className="text-amber-600 font-medium">Late</span>;
      default:
        return <span className="text-gray-600">Unknown</span>;
    }
  };

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]">
                <User className="h-5 w-5 text-white" />
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Attendance Details
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

          <div className="bg-[#F5EFE7] rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] flex items-center justify-center text-white font-medium text-lg">
                {record.employee?.name ? record.employee.name.charAt(0) : 'E'}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">{record.employee?.name || 'Employee'}</h4>
                <p className="text-sm text-gray-500">{record.employee?.position || 'Staff'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center p-3 rounded-lg border border-[#E8DCCA]">
              <div className="mr-3">{getStatusIcon()}</div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{getStatusText()}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center p-3 rounded-lg border border-[#E8DCCA]">
              <div className="mr-3">
                <Calendar className="h-5 w-5 text-[#8B5A2B]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(record.date)}</p>
              </div>
            </div>

            {/* Time In and Time Out */}
            {record.status !== 'absent' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 rounded-lg border border-[#E8DCCA]">
                  <div className="mr-3">
                    <Clock className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time In</p>
                    <p className="font-medium">{formatTime(record.timeIn)}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg border border-[#E8DCCA]">
                  <div className="mr-3">
                    <Clock className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Out</p>
                    <p className="font-medium">{formatTime(record.timeOut)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {record.notes && (
              <div className="p-3 rounded-lg border border-[#E8DCCA]">
                <div className="flex items-center mb-2">
                  <AlignLeft className="h-5 w-5 text-[#8B5A2B] mr-2" />
                  <p className="text-sm text-gray-500">Notes</p>
                </div>
                <p className="text-sm text-gray-700">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
