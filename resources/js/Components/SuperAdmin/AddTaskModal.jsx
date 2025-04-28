import { useState, useRef, useEffect } from "react"
import { X, User, AlignLeft, Flag, Clock } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AddTaskModal({ show, onClose, fetchTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    employeeId: "",
    priority: "medium",
    notes: ""
  })
  
  const [employeeData, setEmployeeData] = useState([])

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const priorityDropdownRef = useRef(null)
  const employeeDropdownRef = useRef(null)

  // Fetch employees when component mounts
  useEffect(() => {
    if (show) {
      fetchEmployees()
    }
  }, [show])

  // Fetch employees from the backend
  const fetchEmployees = () => {
    axios.get('/api/task-employees')
      .then(response => {
        if (response.data.status === 'success') {
          setEmployeeData(response.data.employees)
        }
      })
      .catch(error => {
        console.error("Error fetching employees:", error)
        toast.error("Failed to load employees. Please try again.")
      })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) {
        setShowPriorityDropdown(false)
      }
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setShowEmployeeDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!show) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.employeeId) {
      newErrors.employeeId = "Assigned employee is required"
    }
    if (!formData.priority) {
      newErrors.priority = "Priority is required"
    }
    return newErrors
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      employeeId: "",
      priority: "medium",
      notes: ""
    })
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setIsSubmitting(true)
      
      // Create FormData object
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("employee_id", formData.employeeId)
      formDataToSend.append("priority", formData.priority)
      formDataToSend.append("notes", formData.notes)
      
      // Submit form to backend using axios
      axios.post('/api/tasks', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(response => {
          toast.success("Task created successfully!");
          const data = response.data
          resetForm()
          onClose(() => {
            if (fetchTasks) {
              fetchTasks()
            }
          })
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
            toast.error("Please fix the errors in the form.")
          } else {
            console.error("Error creating task:", error)
            setErrors({ general: "An error occurred while creating the task" })
            toast.error("An error occurred while creating the task.")
          }
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Task Information</h4>
              <p className="text-xs text-gray-500">Create a new task for hotel staff with the following details.</p>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Task Title */}
                <div>
                  <label htmlFor="title" className={labelClasses}>Task Title</label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Flag className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="Enter task title"
                    />
                    {errors.title && <p className={errorClasses}>{errors.title}</p>}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className={labelClasses}>Priority</label>
                  <div className="relative" ref={priorityDropdownRef}>
                    <div className={iconWrapperClasses}>
                      <Flag className="h-4 w-4" />
                    </div>
                    <div 
                      className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                      <span className={formData.priority ? "text-gray-700" : "text-gray-400"}>
                        {formData.priority ? 
                          formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1) : 
                          "Select"}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {showPriorityDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="py-1">
                          {[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" }
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                formData.priority === option.value 
                                  ? "bg-amber-50 text-amber-600"
                                  : "text-gray-700"
                              }`}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  priority: option.value
                                });
                                setShowPriorityDropdown(false);
                                if (errors.priority) {
                                  setErrors({
                                    ...errors,
                                    priority: ""
                                  });
                                }
                              }}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.priority && <p className={errorClasses}>{errors.priority}</p>}
                  </div>
                </div>

                {/* Assigned To */}
                <div>
                  <label htmlFor="employeeId" className={labelClasses}>Assign To</label>
                  <div className="relative" ref={employeeDropdownRef}>
                    <div className={iconWrapperClasses}>
                      <User className="h-4 w-4" />
                    </div>
                    <div 
                      className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                      onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                    >
                      <span className={formData.employeeId ? "text-gray-700" : "text-gray-400"}>
                        {formData.assignedTo || "Select an employee"}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {showEmployeeDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="py-1">
                          {employeeData && employeeData.map((employee) => (
                            <div
                              key={employee.id}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                formData.employeeId === employee.id.toString() 
                                  ? "bg-amber-50 text-amber-600"
                                  : "text-gray-700"
                              }`}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  employeeId: employee.id.toString(),
                                  assignedTo: employee.name
                                })
                                setShowEmployeeDropdown(false)
                                if (errors.employeeId) {
                                  setErrors({
                                    ...errors,
                                    employeeId: ""
                                  })
                                }
                              }}
                            >
                              {employee.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.employeeId && <p className={errorClasses}>{errors.employeeId}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className={labelClasses}>Additional Notes</label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <AlignLeft className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="Any additional information"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClasses}>Description</label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 text-gray-400">
                      <AlignLeft className="h-4 w-4" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="Enter task description"
                    />
                    {errors.description && <p className={errorClasses}>{errors.description}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}