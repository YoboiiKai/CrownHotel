"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Users,
  User,
  Mail,
  Phone,
  X,
  Plus,
  Search,
  Briefcase,
  Edit,
  Trash,
  CheckCircle
} from "lucide-react"
import AddEmployeeModal from "@/Components/SuperAdmin/AddEmployeeModal"
import UpdateEmployeeModal from "@/Components/SuperAdmin/UpdateEmployeeModal"
import EmployeeDetailsModal from "@/Components/SuperAdmin/EmployeeDetailsModal"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

export default function Employee() {
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false)
  const [showUpdateEmployeeForm, setShowUpdateEmployeeForm] = useState(false)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState([])

  // Load employees from API on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`/api/employees?_t=${new Date().getTime()}`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees. Please try again later.");
    }
  };

  // Handle employee status change
  const handleEmployeeStatusChange = async (updatedEmployee) => {
    try {
      await fetchEmployees(); // Refresh the entire employee list
      setShowEmployeeDetails(false); // Close the details modal after status change
    } catch (error) {
      console.error("Error handling employee status change:", error);
      toast.error("Failed to handle employee status change. Please try again later.");
    }
  };

  // Handle employee deletion
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      await fetchEmployees(); // Ensure data is refreshed before updating UI
      toast.success("Employee deleted successfully!");
      setShowEmployeeDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  // Filter employees based on status and search query
  const filteredEmployees = employees.filter((employee) => {
    const matchesStatus = filterStatus === "all" || employee.status === filterStatus;
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SuperAdminLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <div className="mx-auto max-w-6xl">

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-8 mt-5">
          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200 relative z-10"
            />
          </div>
          
          <button
            onClick={() => setShowNewEmployeeForm(true)}
            className="px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className="inline-flex bg-white shadow-sm rounded-full p-1 border border-[#DEB887]/20">
              <button
                className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${filterStatus === "all" 
                  ? "bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm" 
                  : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                onClick={() => setFilterStatus("all")}
              >
                All Employees
              </button>
              
              <button
                className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${filterStatus === "active" 
                  ? "bg-gradient-to-r from-[#4CAF50]/90 to-[#4CAF50]/70 text-white shadow-sm" 
                  : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                onClick={() => setFilterStatus("active")}
              >
                Active
              </button>
              
              <button
                className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${filterStatus === "inactive" 
                  ? "bg-gradient-to-r from-[#F44336]/90 to-[#F44336]/70 text-white shadow-sm" 
                  : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                onClick={() => setFilterStatus("inactive")}
              >
                Inactive
              </button>
            </div>
            
            <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#DEB887]/30 to-transparent"></div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Employee"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    {employee.image ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-[#DEB887]/30 shadow-md">
                        <img 
                          src={`/${employee.image}`}
                          alt={employee.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                        {employee.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-[#8B5A2B]" />
                          <span className="text-xs text-[#8B5A2B] font-medium">{employee.jobtitle || "Employee"}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          employee?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {employee?.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {employee?.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <Mail className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70 truncate">{employee.email || "No email provided"}</p>
                      </div>
                    </div>
                    
                    {employee.phonenumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Phone className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70">{employee.phonenumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-full"></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setShowEmployeeDetails(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <User className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setShowUpdateEmployeeForm(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#8B5A2B] hover:bg-[#DEB887]/10 transition-all duration-300"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-[#E8DCCA] p-3 mb-4">
              <Users className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no employees matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setSearchQuery("")
              }}
              className="text-sm font-medium text-[#8B5A2B] hover:text-[#5A371F]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal
        show={showNewEmployeeForm}
        onClose={() => setShowNewEmployeeForm(false)}
        onSubmit={fetchEmployees} // Pass fetchEmployees to refresh the employee list
      />

      <UpdateEmployeeModal
        show={showUpdateEmployeeForm}
        onClose={() => setShowUpdateEmployeeForm(false)}
        onUpdateEmployee={fetchEmployees} 
        employee={selectedEmployee}
      />

      <EmployeeDetailsModal
        show={showEmployeeDetails}
        onClose={() => setShowEmployeeDetails(false)}
        employee={selectedEmployee}
        onStatusChange={(updatedEmployee) => {
          handleEmployeeStatusChange(updatedEmployee);
        }}
      />
    </SuperAdminLayout>
  )
}