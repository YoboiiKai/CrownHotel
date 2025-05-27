import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
    Calendar, 
    Users, 
    Plus, 
    X, 
    ChevronDown, 
    Check, 
    Clock, 
    CalendarDays,
    User 
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminAttendanceSchedule() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

    // Fetch employees when component mounts
    useEffect(() => {
        fetchEmployees();
        fetchSchedules();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("/api/employees");
            setEmployees(response.data.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employees");
        }
    };

    const fetchSchedules = async () => {
        setIsLoadingSchedules(true);
        try {
            const response = await axios.get("/api/attendance/schedules");
            setSchedules(response.data.data || []);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Failed to load schedules");
        } finally {
            setIsLoadingSchedules(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Attendance Schedule" />
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Hero Section */}
            <div className="relative z-10 p-4 sm:p-6">
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="w-full md:w-auto">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                                    <span className="text-xs font-medium text-[#DEB887]">
                                        STAFF MANAGEMENT
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Employee <span className="text-[#DEB887]">Attendance Schedule</span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Create and manage employee work schedules. <span className="hidden sm:inline">Efficiently organize shifts and ensure proper staffing levels for hotel operations.</span>
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button 
                                        onClick={() => setShowAddModal(true)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                                    >
                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Add Schedule</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
                </div>
            </div>

            {/* Schedule Table Section */}
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#DEB887]/30">
                    <div className="p-4 sm:p-6 border-b border-[#DEB887]/30">
                        <div className="flex items-center">
                            <CalendarDays className="h-5 w-5 text-[#A67C52] mr-2" />
                            <h2 className="text-lg font-semibold text-[#5D3A1F]">Employee Schedules</h2>
                        </div>
                    </div>
                    
                    {isLoadingSchedules ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A67C52]"></div>
                            <p className="mt-2 text-[#6B4226]">Loading schedules...</p>
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-[#F5EFE7] flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-[#A67C52]" />
                            </div>
                            <h3 className="text-lg font-medium text-[#5D3A1F] mb-1">No Schedules Found</h3>
                            <p className="text-sm text-[#6B4226]/70 max-w-md mx-auto">
                                There are no employee schedules created yet. Click the "Add Schedule" button to create your first schedule.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#DEB887]/30">
                                <thead className="bg-[#F5EFE7]">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Shift
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Hours
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#DEB887]/30">
                                    {schedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-[#F5EFE7]/50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#A67C52]/10 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-[#A67C52]" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-[#5D3A1F]">{schedule.employee_name}</div>
                                                        <div className="text-xs text-[#6B4226]/70">{schedule.position}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-[#5D3A1F]">{schedule.date}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-[#5D3A1F]">{schedule.shift_type}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-[#5D3A1F]">{schedule.start_time} - {schedule.end_time}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    schedule.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : schedule.status === 'pending' 
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {schedule.status === 'completed' ? (
                                                        <Check className="mr-1 h-3 w-3" />
                                                    ) : schedule.status === 'pending' ? (
                                                        <Clock className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <X className="mr-1 h-3 w-3" />
                                                    )}
                                                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-[#A67C52] hover:text-[#8B5A2B] mr-3">
                                                    Edit
                                                </button>
                                                <button className="text-red-500 hover:text-red-700">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Schedule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] sm:mx-0 sm:h-10 sm:w-10">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Schedule</h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
                                                    Employee
                                                </label>
                                                <select
                                                    id="employee"
                                                    name="employee"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                                                >
                                                    <option value="">Select an employee</option>
                                                    {employees.map((employee) => (
                                                        <option key={employee.id} value={employee.id}>
                                                            {employee.name} - {employee.position}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    className="mt-1 focus:ring-[#A67C52] focus:border-[#A67C52] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                                        Start Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        name="startTime"
                                                        id="startTime"
                                                        className="mt-1 focus:ring-[#A67C52] focus:border-[#A67C52] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                                        End Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        name="endTime"
                                                        id="endTime"
                                                        className="mt-1 focus:ring-[#A67C52] focus:border-[#A67C52] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="shiftType" className="block text-sm font-medium text-gray-700">
                                                    Shift Type
                                                </label>
                                                <select
                                                    id="shiftType"
                                                    name="shiftType"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                                                >
                                                    <option value="morning">Morning</option>
                                                    <option value="afternoon">Afternoon</option>
                                                    <option value="evening">Evening</option>
                                                    <option value="night">Night</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Notes (Optional)
                                                </label>
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows="3"
                                                    className="mt-1 focus:ring-[#A67C52] focus:border-[#A67C52] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="Add any additional notes here..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-base font-medium text-white hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Schedule
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
