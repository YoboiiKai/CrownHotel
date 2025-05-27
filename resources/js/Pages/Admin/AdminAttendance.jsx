import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  Search, 
  Plus, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUpDown,
  Download,
  CalendarDays,
  Users,
  ChevronDown
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddAttendanceModal from '@/Components/Admin/AddAttendanceModal';
import AttendanceDetailsModal from '@/Components/Admin/AttendanceDetailsModal';

export default function AdminAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState("timeIn");
  const [sortDirection, setSortDirection] = useState("desc");

  // Load attendance records and employees on component mount
  useEffect(() => {
    fetchAttendanceRecords();
    fetchEmployees();
  }, [sortField, sortDirection, filterStatus]);

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
    const today = new Date();
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
          ["On time", "Slightly late", "Worked overtime", "Left early with permission"][Math.floor(Math.random() * 4)] : 
          ["Sick leave", "Personal leave", "No notice", "Approved absence"][Math.floor(Math.random() * 4)]
      });
    }
    
    // Sort the records based on the selected sort field and direction
    return records.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.employee.name.localeCompare(b.employee.name)
          : b.employee.name.localeCompare(a.employee.name);
      } else if (sortField === "timeIn") {
        if (!a.timeIn) return sortDirection === "asc" ? -1 : 1;
        if (!b.timeIn) return sortDirection === "asc" ? 1 : -1;
        return sortDirection === "asc" 
          ? new Date(a.timeIn) - new Date(b.timeIn)
          : new Date(b.timeIn) - new Date(a.timeIn);
      } else if (sortField === "timeOut") {
        if (!a.timeOut) return sortDirection === "asc" ? -1 : 1;
        if (!b.timeOut) return sortDirection === "asc" ? 1 : -1;
        return sortDirection === "asc" 
          ? new Date(a.timeOut) - new Date(b.timeOut)
          : new Date(b.timeOut) - new Date(a.timeOut);
      } else if (sortField === "status") {
        return sortDirection === "asc" 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  };

  // Handle adding a new attendance record
  const handleAddAttendance = (newRecord) => {
    // In a real implementation, you would call your API to save the record
    // For now, we'll just update the local state
    setAttendanceRecords([...attendanceRecords, { ...newRecord, id: attendanceRecords.length + 1 }]);
    toast.success("Attendance record added successfully!");
  };

  // Handle updating an attendance record
  const handleUpdateAttendance = (updatedRecord) => {
    // In a real implementation, you would call your API to update the record
    // For now, we'll just update the local state
    const updatedRecords = attendanceRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setAttendanceRecords(updatedRecords);
    toast.success("Attendance record updated successfully!");
  };

  // Handle deleting an attendance record
  const handleDeleteAttendance = (id) => {
    // In a real implementation, you would call your API to delete the record
    // For now, we'll just update the local state
    const updatedRecords = attendanceRecords.filter(record => record.id !== id);
    setAttendanceRecords(updatedRecords);
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
    const colors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-[#F5EFE7] text-[#8B5A2B]"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
      record.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <Head title="Employee Attendance" />
      
      <div className="mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] rounded-xl shadow-xl mb-8 p-6 sm:p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl">
                <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  Employee Attendance
                </h1>
                <p className="text-[#DEB887] text-sm sm:text-base">
                  Track employee attendance, manage time records, and generate reports
                </p>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-500 bg-opacity-25 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-100" />
                  </div>
                  <div>
                    <p className="text-xs text-white text-opacity-80">Present Today</p>
                    <p className="text-xl font-bold">{attendanceRecords.filter(r => r.status === 'present').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-red-500 bg-opacity-25 mr-3">
                    <XCircle className="h-5 w-5 text-red-100" />
                  </div>
                  <div>
                    <p className="text-xs text-white text-opacity-80">Absent Today</p>
                    <p className="text-xl font-bold">{attendanceRecords.filter(r => r.status === 'absent').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-[#DEB887] bg-opacity-25 mr-3">
                    <Users className="h-5 w-5 text-[#DEB887]" />
                  </div>
                  <div>
                    <p className="text-xs text-white text-opacity-80">Total Employees</p>
                    <p className="text-xl font-bold">{employees.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mt-20 -mr-20 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -mb-10 -ml-10 blur-xl"></div>
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-[#F5EFE7] p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#E8DCCA] bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
              />
            </div>
            

            

          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => alert('Download functionality would be implemented here')}
              className="flex items-center gap-2 rounded-lg border border-[#E8DCCA] bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 focus:ring-offset-2 transition-all"
            >
              <Download className="h-4 w-4 text-[#8B5A2B]" />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>
        
        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-[#E8DCCA] mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setFilterStatus("all");
              setIsLoading(true);
            }}
          >
            All Records
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "present" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setFilterStatus("present");
              setIsLoading(true);
            }}
          >
            Present
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "absent" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setFilterStatus("absent");
              setIsLoading(true);
            }}
          >
            Absent
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "late" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setFilterStatus("late");
              setIsLoading(true);
            }}
          >
            Late
          </button>
        </div>
        
        {/* Attendance Records Table */}
        <div className="bg-white rounded-lg border border-[#E8DCCA] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8DCCA]">
              <thead className="bg-[#F5EFE7]">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Employee</span>
                      {sortField === "name" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("timeIn")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Time In</span>
                      {sortField === "timeIn" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("timeOut")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Time Out</span>
                      {sortField === "timeOut" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      {sortField === "status" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8DCCA]">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                      No attendance records found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr 
                      key={record.id} 
                      className="hover:bg-[#F5EFE7]/30 cursor-pointer"
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
                            <div className="text-sm font-medium text-gray-900">{record.employee.name}</div>
                            <div className="text-xs text-gray-500">{record.employee.position} • {record.employee.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {record.timeIn ? (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-[#8B5A2B] mr-1" />
                            <span className="text-sm text-gray-900">{formatTime(record.timeIn)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {record.timeOut ? (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-[#8B5A2B] mr-1" />
                            <span className="text-sm text-gray-900">{formatTime(record.timeOut)}</span>
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
                          className="text-[#8B5A2B] hover:text-[#6B4226]"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Attendance Modal */}
      <AddAttendanceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAttendance}
        employees={employees}
        date={new Date().toISOString().split('T')[0]}
      />
      
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
    </AdminLayout>
  );
}
