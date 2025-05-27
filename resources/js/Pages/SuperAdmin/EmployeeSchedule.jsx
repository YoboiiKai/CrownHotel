import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { 
    Calendar, 
    Users, 
    Plus, 
    X, 
    ChevronDown, 
    Check, 
    Clock, 
    CalendarDays,
    User,
    Download,
    Upload,
    Filter,
    Edit,
    Trash2,
    AlertCircle
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Modal Components
import AddEmployeeScheduleModal from "@/Components/SuperAdmin/AddEmployeeScheduleModal";
import UpdateEmployeeScheduleModal from "@/Components/SuperAdmin/UpdateEmployeeScheduleModal";

export default function EmployeeSchedule() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [dateRange, setDateRange] = useState({ 
        start: new Date().toISOString().split('T')[0], 
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    });
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [newSchedule, setNewSchedule] = useState({
        employee_id: '',
        department_id: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        shift_type: 'morning',
        notes: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);

    // Fetch data when component mounts or filters change
    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);
    
    useEffect(() => {
        fetchSchedules();
    }, [selectedDepartment, dateRange]);

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
            const params = {
                department_id: selectedDepartment !== 'all' ? selectedDepartment : undefined,
                start_date: dateRange.start,
                end_date: dateRange.end
            };
            
            const response = await axios.get("/api/attendance/schedules", { params });
            setSchedules(response.data.data || []);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Failed to load schedules");
        } finally {
            setIsLoadingSchedules(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/api/departments");
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to load departments");
        }
    };

    const handleFilterChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const handleDateRangeChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const handleBulkScheduleImport = () => {
        // Implement CSV import functionality
        toast.info("Bulk import feature would be implemented here");
    };

    const handleBulkScheduleExport = () => {
        // Implement CSV export functionality
        toast.info("Bulk export feature would be implemented here");
    };
    
    // Reset form function to properly initialize and reset form state
    const resetForm = () => {
        setNewSchedule({
            employee_id: '',
            department_id: '',
            date: new Date().toISOString().split('T')[0],
            start_time: '09:00',
            end_time: '17:00',
            shift_type: 'morning',
            notes: ''
        });
        setErrors({});
        setCurrentSchedule(null);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!newSchedule.employee_id) newErrors.employee_id = "Please select an employee";
        if (!newSchedule.department_id) newErrors.department_id = "Please select a department";
        if (!newSchedule.date) newErrors.date = "Please select a date";
        if (!newSchedule.start_time) newErrors.start_time = "Please select a start time";
        if (!newSchedule.end_time) newErrors.end_time = "Please select an end time";
        if (!newSchedule.shift_type) newErrors.shift_type = "Please select a shift type";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSubmitLoading(true);
        try {
            if (currentSchedule) {
                // Update existing schedule
                await axios.put(`/api/attendance/schedules/${currentSchedule.id}`, newSchedule);
                toast.success("Schedule updated successfully");
                setShowEditModal(false);
            } else {
                // Create new schedule
                await axios.post("/api/attendance/schedules", newSchedule);
                toast.success("Schedule created successfully");
                setShowAddModal(false);
            }
            
            // Reset form and refresh schedules
            resetForm();
            fetchSchedules();
        } catch (error) {
            console.error("Error saving schedule:", error);
            
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Failed to save schedule");
            }
        } finally {
            setSubmitLoading(false);
        }
    };
    
    const handleEdit = (schedule) => {
        setCurrentSchedule(schedule);
        setNewSchedule({
            employee_id: schedule.employee_id.toString(),
            department_id: schedule.department_id.toString(),
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            shift_type: schedule.shift_type,
            notes: schedule.notes || ''
        });
        setShowEditModal(true);
    };
    
    const handleDelete = (schedule) => {
        setCurrentSchedule(schedule);
        setShowDeleteModal(true);
    };
    
    const confirmDelete = async () => {
        setSubmitLoading(true);
        try {
            await axios.delete(`/api/attendance/schedules/${currentSchedule.id}`);
            toast.success("Schedule deleted successfully");
            setShowDeleteModal(false);
            fetchSchedules();
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error("Failed to delete schedule");
        } finally {
            setSubmitLoading(false);
        }
    };
    
    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    return (
        <SuperAdminLayout>
            <Head title="Attendance Schedule Management" />
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
                                        CROWN OF THE ORIENT
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    Employee <span className="text-[#DEB887]">Attendance Schedule</span>
                                </h1>
                                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                                    Create and manage employee work schedules across all departments. <span className="hidden sm:inline">Optimize staffing levels and ensure proper coverage for all hotel operations.</span>
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                                    <button 
                                        onClick={() => setShowAddModal(true)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                                    >
                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Add Schedule</span>
                                    </button>
                                    <button 
                                        onClick={handleBulkScheduleImport}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center"
                                    >
                                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Import CSV</span>
                                    </button>
                                    <button 
                                        onClick={handleBulkScheduleExport}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#DEB887] hover:bg-white/10 transition-all duration-300 flex items-center"
                                    >
                                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                                        <span className="whitespace-nowrap">Export CSV</span>
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

            {/* Filters Section */}
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#DEB887]/30 mb-6">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center mb-4">
                            <Filter className="h-5 w-5 text-[#A67C52] mr-2" />
                            <h2 className="text-lg font-semibold text-[#5D3A1F]">Filter Schedules</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                                    Department
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    value={selectedDepartment}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-[#DEB887]/30 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="start"
                                    value={dateRange.start}
                                    onChange={handleDateRangeChange}
                                    className="block w-full py-2 px-3 border border-[#DEB887]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="end"
                                    value={dateRange.end}
                                    onChange={handleDateRangeChange}
                                    className="block w-full py-2 px-3 border border-[#DEB887]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
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
                                            Department
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
                                                <div className="text-sm text-[#5D3A1F]">{schedule.department}</div>
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
                                                <button 
                                                    onClick={() => handleEdit(schedule)}
                                                    className="text-[#A67C52] hover:text-[#8B5A2B] mr-3 flex items-center"
                                                >
                                                    <Edit className="h-3.5 w-3.5 mr-1" />
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(schedule)}
                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
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
            <AddEmployeeScheduleModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    resetForm();
                }}
                onSubmit={handleSubmit}
                newSchedule={newSchedule}
                handleInputChange={handleInputChange}
                employees={employees}
                departments={departments}
                errors={errors}
                submitLoading={submitLoading}
                formRef={formRef}
            />
            
            {/* Edit Schedule Modal */}
            <UpdateEmployeeScheduleModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    resetForm();
                    // Refresh data after modal is closed, as mentioned in the memory about employee management
                    fetchSchedules();
                }}
                onSubmit={handleSubmit}
                newSchedule={newSchedule}
                handleInputChange={handleInputChange}
                employees={employees}
                departments={departments}
                errors={errors}
                submitLoading={submitLoading}
                formRef={formRef}
            />
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Schedule</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this schedule? This action cannot be undone.
                                            </p>
                                            {currentSchedule && (
                                                <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <span className="font-semibold">Employee:</span> {currentSchedule.employee_name}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <span className="font-semibold">Date:</span> {currentSchedule.date}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <span className="font-semibold">Shift:</span> {currentSchedule.shift_type}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    disabled={submitLoading}
                                    onClick={confirmDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={submitLoading}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
