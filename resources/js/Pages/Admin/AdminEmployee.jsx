"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
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

export default function AdminEmployee() {
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
    <AdminLayout>
      <Head title="Employees" />
      <ToastContainer position="top-right" hideProgressBar />
      <div className="mx-auto max-w-6xl">

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#E8DCCA] transition-all"
              />
            </div>
            
          </div>
          <button
            onClick={() => setShowNewEmployeeForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Employees
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "active" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "inactive" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("inactive")}
          >
            Inactive
          </button>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group relative transform hover:-translate-y-1 duration-300"
            >
              <button
                onClick={() => deleteEmployee(employee.id)}
                className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all z-10 opacity-80 hover:opacity-100"
                title="Delete Employee"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
              <div className="p-5">
                {/* Employee Header with Image and Status */}
                <div className="flex items-center gap-4 mb-4">
                  {employee.image ? (
                    <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#E8DCCA] group-hover:border-[#D2B48C] transition-all shadow-sm">
                      <img 
                        src={`/${employee.image}`}
                        alt={employee.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#F5EFE7] to-[#E8DCCA] flex items-center justify-center text-[#6B4226] font-semibold text-lg flex-shrink-0 border-2 border-[#E8DCCA] group-hover:border-[#D2B48C] transition-all shadow-sm">
                      {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-[#6B4226] transition-colors">
                        {employee.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-[#F5EFE7] px-2 py-0.5 rounded-md">
                        <Briefcase className="h-3 w-3 text-[#8B5A2B]" />
                        <span className="text-xs text-[#8B5A2B] font-medium">{employee.jobtitle || "STAFF"}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center ${
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

                {/* Contact Information */}
                <div className="space-y-1.5 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-[#A67C52] flex-shrink-0" />
                    <p className="text-sm truncate">{employee.email || "No email provided"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-[#A67C52] flex-shrink-0" />
                    <p className="text-sm">{employee.phonenumber || "No phone number"}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee)
                      setShowEmployeeDetails(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-3 py-2.5 text-xs font-medium text-white shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee)
                      setShowUpdateEmployeeForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#D2B48C] bg-[#F5EFE7] px-3 py-2.5 text-xs font-medium text-[#6B4226] hover:bg-[#E8DCCA] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Update Employee</span>
                  </button>
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
    </AdminLayout>
  )
}