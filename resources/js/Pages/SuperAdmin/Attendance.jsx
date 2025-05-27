import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { 
  Search, 
  Plus, 
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUpDown,
  Download,
  Upload,
  CalendarDays,
  ChevronDown
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAttendanceModal from '@/Components/SuperAdmin/AddAttendanceModal';
import AttendanceDetailsModal from '@/Components/SuperAdmin/AttendanceDetailsModal';

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState("timeIn");
  const [sortDirection, setSortDirection] = useState("desc");

  // Load attendance records and employees on component mount
  useEffect(() => {
    fetchAttendanceRecords();
    fetchEmployees();
  }, [filterDate, sortField, sortDirection]);

  // Fetch attendance records from API
  const fetchAttendanceRecords = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would call your actual API endpoint
      // const response = await axios.get(`/api/attendance?date=${filterDate}&sort=${sortField}&direction=${sortDirection}`);
      // For now, we'll use mock data
      const mockData = generateMockAttendanceData();
      setAttendanceRecords(mockData);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      // In a real implementation, you would call your actual API endpoint
      // const response = await axios.get('/api/employees');
      // For now, we'll use mock data
      const mockEmployees = [
        { id: 1, name: "John Doe", position: "Front Desk", department: "Hotel" },
        { id: 2, name: "Jane Smith", position: "Chef", department: "Restaurant" },
        { id: 3, name: "Michael Johnson", position: "Housekeeping", department: "Hotel" },
        { id: 4, name: "Emily Williams", position: "Waiter", department: "Restaurant" },
        { id: 5, name: "Robert Brown", position: "Maintenance", department: "Hotel" },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees. Please try again later.");
    }
  };

  // Generate mock attendance data for demonstration
  const generateMockAttendanceData = () => {
    const today = new Date(filterDate);
    const records = [];
    
    for (let i = 1; i <= 15; i++) {
      const isPresent = Math.random() > 0.2;
      const timeIn = new Date(today);
      timeIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const timeOut = new Date(today);
      timeOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const employeeId = Math.ceil(Math.random() * 5);
      const employee = {
        id: employeeId,
        name: ["John Doe", "Jane Smith", "Michael Johnson", "Emily Williams", "Robert Brown"][employeeId - 1],
        position: ["Front Desk", "Chef", "Housekeeping", "Waiter", "Maintenance"][employeeId - 1],
        department: employeeId % 2 === 0 ? "Restaurant" : "Hotel"
      };
      
      records.push({
        id: i,
        employeeId: employeeId,
        employee: employee,
        date: today.toISOString().split('T')[0],
        timeIn: isPresent ? timeIn.toISOString() : null,
        timeOut: isPresent ? timeOut.toISOString() : null,
        status: isPresent ? (Math.random() > 0.8 ? "late" : "present") : "absent",
        notes: isPresent ? 
          (Math.random() > 0.7 ? "Employee called in for " + (Math.random() > 0.5 ? "early shift" : "extended hours") : "") : 
          (Math.random() > 0.5 ? "Employee called in sick" : "No notification received")
      });
    }
    
    return records;
  };

  // Handle adding a new attendance record
  const handleAddAttendance = (newRecord) => {
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    toast.success("Attendance record added successfully!");
  };

  // Handle updating an attendance record
  const handleUpdateAttendance = (updatedRecord) => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    toast.success("Attendance record updated successfully!");
  };

  // Handle deleting an attendance record
  const handleDeleteAttendance = (id) => {
    setAttendanceRecords(attendanceRecords.filter((record) => record.id !== id));
    toast.success("Attendance record deleted successfully!");
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status color based on attendance status
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Toggle sort direction when clicking on a column header
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter attendance records based on status and search query
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesSearch =
      record.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  return (
    <SuperAdminLayout>
      <Head title="Employee Attendance" />
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
                  Employee <span className="text-[#DEB887]">Attendance Records</span>
                </h1>
                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                  Track employee attendance, manage time records, and generate reports. <span className="hidden sm:inline">Monitor punctuality and attendance patterns across all departments.</span>
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                    <span className="whitespace-nowrap">Add Attendance</span>
                  </button>
                  <button 
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
              <h2 className="text-lg font-semibold text-[#5D3A1F]">Filter Attendance Records</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-[#DEB887]/30 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-[#A67C52]" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-base border-[#DEB887]/30 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#A67C52]" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-base border-[#DEB887]/30 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Tabs - Styled as Pills */}
        <div className="flex flex-wrap gap-2 mb-6 px-4 sm:px-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterStatus === "all" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Records
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterStatus === "present" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
            onClick={() => setFilterStatus("present")}
          >
            <CheckCircle className="h-3.5 w-3.5 inline-block mr-1.5" />
            Present
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterStatus === "absent" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
            onClick={() => setFilterStatus("absent")}
          >
            <XCircle className="h-3.5 w-3.5 inline-block mr-1.5" />
            Absent
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterStatus === "late" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
            onClick={() => setFilterStatus("late")}
          >
            <Clock className="h-3.5 w-3.5 inline-block mr-1.5" />
            Late
          </button>
        </div>
        
        {/* Attendance Records Table */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="bg-white overflow-hidden shadow-md rounded-xl border border-[#DEB887]/20 mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEB887]/20">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-[#A67C52] mr-2" />
                <h2 className="text-lg font-medium text-[#5D3A1F]">Attendance Records</h2>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5EFE7] text-[#8B5A2B]">
                {filterDate}
              </span>
            </div>
            
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B5A2B]"></div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-[#F5EFE7] rounded-full mb-4">
                  <Users className="h-6 w-6 text-[#8B5A2B]" />
                </div>
                <p className="text-[#5D3A1F] font-medium">No attendance records found</p>
                <p className="text-gray-500 text-sm mt-1">Try changing your filters or select a different date</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#DEB887]/20">
                  <thead className="bg-[#F5EFE7]/50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("employee.name")}
                      >
                        <div className="flex items-center">
                          <span>Employee</span>
                          {sortField === "employee.name" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-[#A67C52]" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("timeIn")}
                      >
                        <div className="flex items-center">
                          <span>Time In</span>
                          {sortField === "timeIn" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-[#A67C52]" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("timeOut")}
                      >
                        <div className="flex items-center">
                          <span>Time Out</span>
                          {sortField === "timeOut" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-[#A67C52]" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          <span>Status</span>
                          {sortField === "status" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-[#A67C52]" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                        Notes
                      </th>
                      <th scope="col" className="relative px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#DEB887]/10">
                    {filteredRecords.map((record) => (
                      <tr 
                        key={record.id} 
                        className="hover:bg-[#F5EFE7]/30 transition-colors duration-150 cursor-pointer"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetailsModal(true);
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#F5EFE7] to-[#E5D3B3] flex items-center justify-center text-[#8B5A2B] font-semibold text-xs flex-shrink-0 border border-[#E8DCCA]">
                              {record.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-[#5D3A1F]">{record.employee.name}</div>
                              <div className="text-xs text-gray-500">{record.employee.position} • {record.employee.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {record.timeIn ? (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-[#8B5A2B] mr-1" />
                              <span className="text-sm text-gray-700">{formatTime(record.timeIn)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {record.timeOut ? (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-[#8B5A2B] mr-1" />
                              <span className="text-sm text-gray-700">{formatTime(record.timeOut)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === "present" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : record.status === "absent" ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {record.notes || "No notes"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-[#8B5A2B] hover:text-[#6B4226] transition-colors duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              setShowDetailsModal(true);
                            }}
                          >
                            View
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
      </div>
      
      {/* Add Attendance Modal */}
      <AddAttendanceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAttendance}
        employees={employees}
        date={filterDate}
      />
      
      {/* Attendance Details Modal */}
      {showDetailsModal && selectedRecord && (
        <AttendanceDetailsModal
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onUpdate={handleUpdateAttendance}
          onDelete={handleDeleteAttendance}
        />
      )}
    </SuperAdminLayout>
  );
}
