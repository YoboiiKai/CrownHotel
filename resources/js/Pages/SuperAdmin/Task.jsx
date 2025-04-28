import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    CheckCircle, 
    Clock, 
    AlertTriangle, 
    Calendar, 
    Search, 
    Filter, 
    Plus, 
    User, 
    ChevronDown,
    X,
    Edit,
    Trash2,
    ClipboardList,
    Flag,
    MoreHorizontal,
    Tag,
    AlignLeft
} from 'lucide-react';
import AddTaskModal from '@/Components/SuperAdmin/AddTaskModal';
import UpdateTaskModal from '@/Components/SuperAdmin/UpdateTaskModal';

export default function Task() {
    // State for task data and UI controls
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterEmployee, setFilterEmployee] = useState("all");
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    
    // State for new task form
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        employeeId: "",
        department: "",
        priority: "medium",
        dueDate: "",
        notes: ""
    });

    // State for tasks from API
    const [tasks, setTasks] = useState([]);
    
    // Fetch tasks from API
    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/tasks?_t=${new Date().getTime()}`);
            if (response.data.status === 'success') {
                setTasks(response.data.tasks);
            } else {
                toast.error("Failed to fetch tasks. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch employees from API
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/task-employees');
            if (response.data.status === 'success') {
                setEmployeeData(response.data.employees);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    
    // Load data on component mount
    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);
    
    // Mock task data for fallback
    const taskData = [
        {
            id: 1,
            title: "Clean VIP Suites",
            description: "Thoroughly clean all VIP suites on the 5th floor",
            assignedTo: "Maria Rodriguez",
            employeeId: 103,
            department: "Housekeeping",
            priority: "high",
            status: "pending",
            dueDate: "2025-03-20",
            createdAt: "2025-03-15",
            completedAt: null,
            notes: "Ensure all amenities are restocked"
        },
        {
            id: 2,
            title: "Restock Bar Inventory",
            description: "Restock all bar inventory based on the weekend forecast",
            assignedTo: "James Wilson",
            employeeId: 107,
            department: "Food & Beverage",
            priority: "medium",
            status: "completed",
            dueDate: "2025-03-16",
            createdAt: "2025-03-14",
            completedAt: "2025-03-16",
            notes: "Focus on premium spirits and wines"
        },
        {
            id: 3,
            title: "Fix Leaking Shower in Room 302",
            description: "Repair the leaking shower head in room 302",
            assignedTo: "Robert Johnson",
            employeeId: 112,
            department: "Maintenance",
            priority: "high",
            status: "pending",
            dueDate: "2025-03-17",
            createdAt: "2025-03-16",
            completedAt: null,
            notes: "Guest checking in tomorrow, must be fixed today"
        },
        {
            id: 4,
            title: "Update Restaurant Menu",
            description: "Update the digital and printed restaurant menus with new seasonal items",
            assignedTo: "Sophia Lee",
            employeeId: 118,
            department: "Food & Beverage",
            priority: "medium",
            status: "pending",
            dueDate: "2025-03-22",
            createdAt: "2025-03-15",
            completedAt: null,
            notes: "Chef has provided the new menu items"
        },
        {
            id: 5,
            title: "Train New Front Desk Staff",
            description: "Conduct training session for 3 new front desk employees",
            assignedTo: "Michael Chen",
            employeeId: 121,
            department: "Front Office",
            priority: "medium",
            status: "completed",
            dueDate: "2025-03-15",
            createdAt: "2025-03-10",
            completedAt: "2025-03-15",
            notes: "Cover check-in/out procedures and guest services"
        },
        {
            id: 6,
            title: "Prepare Conference Room for Corporate Event",
            description: "Set up Grand Ballroom for tomorrow's corporate event",
            assignedTo: "Emily Davis",
            employeeId: 125,
            department: "Events",
            priority: "high",
            status: "pending",
            dueDate: "2025-03-17",
            createdAt: "2025-03-16",
            completedAt: null,
            notes: "Seating for 100 people, A/V equipment needed"
        },
        {
            id: 7,
            title: "Audit Night Shift Reports",
            description: "Review and audit all night shift reports from the past week",
            assignedTo: "Daniel Martinez",
            employeeId: 130,
            department: "Administration",
            priority: "low",
            status: "overdue",
            dueDate: "2025-03-14",
            createdAt: "2025-03-10",
            completedAt: null,
            notes: "Focus on discrepancies in cash handling"
        },
        {
            id: 8,
            title: "Update Room Service Menu",
            description: "Update the in-room dining menu with new chef specials",
            assignedTo: "Olivia Kim",
            employeeId: 133,
            department: "Food & Beverage",
            priority: "low",
            status: "pending",
            dueDate: "2025-03-25",
            createdAt: "2025-03-16",
            completedAt: null,
            notes: "Include new breakfast options"
        }
    ];

    // State for employee data
    const [employeeData, setEmployeeData] = useState([
        { id: 103, name: "Maria Rodriguez", department: "Housekeeping" },
        { id: 107, name: "James Wilson", department: "Food & Beverage" },
        { id: 112, name: "Robert Johnson", department: "Maintenance" },
        { id: 118, name: "Sophia Lee", department: "Food & Beverage" },
        { id: 121, name: "Michael Chen", department: "Front Office" },
        { id: 125, name: "Emily Davis", department: "Events" },
        { id: 130, name: "Daniel Martinez", department: "Administration" },
        { id: 133, name: "Olivia Kim", department: "Food & Beverage" },
        { id: 142, name: "William Taylor", department: "Security" },
        { id: 145, name: "Jennifer Garcia", department: "Spa & Wellness" }
    ]);

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchTasks();
        }, 30000); // 30 seconds
        
        return () => clearInterval(intervalId);
    }, []);

    // Filter tasks based on active tab, search query, and filters
    const filteredTasks = tasks.filter(task => {
        const matchesTab = 
            activeTab === "all" || 
            (activeTab === "pending" && task.status === "pending") || 
            (activeTab === "completed" && task.status === "completed");
        
        const matchesSearch = 
            (task.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
            (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (task.employee?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
        const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
        
        const matchesEmployee = filterEmployee === "all" || (task.employee_id && task.employee_id.toString() === filterEmployee);
        
        return matchesTab && matchesSearch && matchesPriority && matchesEmployee;
    });

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };
    
    // Helper function to format time ago
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "N/A";
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
        }
        
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    };

    // Helper function to calculate days remaining or overdue
    const getDaysRemaining = (dueDate, status) => {
        if (status === "completed") return "Completed";
        
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return "Due today";
        if (diffDays === 1) return "Due tomorrow";
        return `${diffDays} days remaining`;
    };

    // Helper function to get color based on priority
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "text-red-600 bg-red-100";
            case "medium": return "text-amber-600 bg-amber-100";
            case "low": return "text-green-600 bg-green-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    // Helper function to get color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "text-green-600 bg-green-100";
            case "pending": return "text-amber-600 bg-amber-100";
            case "inprogress": return "text-blue-600 bg-blue-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    // Loading state component
    const LoadingState = () => (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tasks...</p>
        </div>
    );

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    // Handle task form submission
    const handleSubmitTask = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend
        console.log("New task:", newTask);
        
        // Reset form and close modal
        setNewTask({
            title: "",
            description: "",
            assignedTo: "",
            employeeId: "",
            department: "",
            priority: "medium",
            dueDate: "",
            notes: ""
        });
        setShowModal(false);
        fetchTasks(); // Refresh tasks after submission
    };

    // Handle task status change
    const handleStatusChange = (taskId, newStatus) => {
        axios.put(`/api/tasks/${taskId}/status`, { status: newStatus })
            .then(response => {
                if (response.data.status === 'success') {
                    toast.success(`Task marked as ${newStatus}`);
                    fetchTasks(); // Refresh tasks after status change
                } else {
                    toast.error("Failed to update task status");
                }
            })
            .catch(error => {
                console.error("Error updating task status:", error);
                toast.error("Failed to update task status");
            });
    };

    // Handle task deletion
    const handleDeleteTask = (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            axios.delete(`/api/tasks/${taskId}`)
                .then(response => {
                    if (response.data.status === 'success') {
                        toast.success("Task deleted successfully");
                        fetchTasks(); // Refresh tasks after deletion
                        if (expandedTaskId === taskId) {
                            setExpandedTaskId(null);
                        }
                    } else {
                        toast.error("Failed to delete task");
                    }
                })
                .catch(error => {
                    console.error("Error deleting task:", error);
                    toast.error("Failed to delete task");
                });
        }
    };

    // Handle task update
    const handleUpdateTask = (task) => {
        setSelectedTask(task);
        setShowUpdateModal(true);
    };
    
    // This section was removed to fix the duplicate fetchTasks declaration
    
    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <SuperAdminLayout
            header={
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Task Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Create, assign, and manage tasks for hotel staff
                    </p>
                </div>
            }
        >
            <ToastContainer position="top-right" hideProgressBar />
            <Head title="Task Management" />
                <div className="mx-auto max-w-6xl">
                    {/* Task Controls */}
                    <div className="mb-6">
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                                
                                {/* Priority Filter */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    >
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <span>Filter</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </button>
                                    {showFilterDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setFilterPriority("all");
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                >
                                                    All Priorities
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFilterPriority("high");
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                >
                                                    High
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFilterPriority("medium");
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                >
                                                    Medium
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFilterPriority("low");
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                >
                                                    Low
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Employee Filter Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                                    >
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>Employee</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </button>
                                    {showEmployeeDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setFilterEmployee("all");
                                                        setShowEmployeeDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                >
                                                    All Employees
                                                </button>
                                                {employeeData.map((employee) => (
                                                    <button
                                                        key={employee.id}
                                                        onClick={() => {
                                                            setFilterEmployee(employee.id.toString());
                                                            setShowEmployeeDropdown(false);
                                                        }}
                                                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                                                    >
                                                        {employee.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Create Task Button */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Task</span>
                            </button>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("all")}
                            >
                                All Tasks
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("pending")}
                            >
                                Pending
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "completed" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("completed")}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Task Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        {/* Total Tasks Card */}
                        <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                                            <ClipboardList className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Total Tasks</h3>
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Active</p>
                                        <p className="text-sm font-medium text-blue-600">
                                            {tasks.filter(task => task.status !== "completed").length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Tasks Card */}
                        <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Pending Tasks</h3>
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {tasks.filter(task => task.status === "pending").length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">High Priority</p>
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                                            <p className="text-sm font-medium text-red-600">
                                                {tasks.filter(task => task.status === "pending" && task.priority === "high").length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Tasks Card */}
                        <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Completed Tasks</h3>
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {tasks.filter(task => task.status === "completed").length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Completion Rate</p>
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                                            <p className="text-sm font-medium text-green-600">
                                                {tasks.length > 0 ? Math.round((tasks.filter(task => task.status === "completed").length / tasks.length) * 100) : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task List */}
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                            <div className="rounded-full bg-amber-100 p-3 mb-4">
                                <ClipboardList className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {searchQuery || filterPriority !== "all" || filterEmployee !== "all" 
                                    ? "There are no tasks matching your current filters."
                                    : "Get started by adding a new task."}
                            </p>
                            {(searchQuery || filterPriority !== "all" || filterEmployee !== "all" || activeTab !== "all") ? (
                                <button
                                    onClick={() => {
                                        setFilterPriority("all");
                                        setFilterEmployee("all");
                                        setSearchQuery("");
                                        setActiveTab("all");
                                    }}
                                    className="text-sm font-medium text-amber-600 hover:text-amber-800"
                                >
                                    Clear filters
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                                >
                                    <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Add New Task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {filteredTasks.map((task) => (
                                    <li key={task.id} className="relative">
                                        <div 
                                            className={`px-6 py-5 transition-colors duration-200 ${
                                                expandedTaskId === task.id ? 'bg-gray-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className="flex flex-col h-full justify-center space-y-1 mr-4">
                                                        {/* Priority indicator */}
                                                        <div className={`w-2.5 h-5 rounded-full ${
                                                            task.priority === 'high' ? 'bg-red-500' : 
                                                            task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                                                        }`}></div>
                                                        {/* Status indicator */}
                                                        <div className={`w-2.5 h-5 rounded-full ${
                                                            task.status === 'completed' ? 'bg-green-500' : 
                                                            task.status === 'inprogress' ? 'bg-blue-500' : 
                                                            task.status === 'pending' ? 'bg-amber-500' : 'bg-gray-500'
                                                        }`}></div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                                                            <span 
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                                                            >
                                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                            </span>
                                                            <span 
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                                                            >
                                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <User className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                                                <span className="font-medium text-gray-700 truncate">{task.employee ? task.employee.name : 'Unassigned'}</span>
                                                            </div>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <div className="flex items-center">
                                                                <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                                                <span className="truncate">{formatTimeAgo(task.created_at)}</span>
                                                            </div>
                                                            {task.completed_at && (
                                                                <>
                                                                    <span className="mx-2 text-gray-300">•</span>
                                                                    <div className="flex items-center">
                                                                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
                                                                        <span className="text-green-600">{formatTimeAgo(task.completed_at)}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <button
                                                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                                        className="p-1.5 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-50 focus:outline-none transition-colors"
                                                    >
                                                        <ChevronDown 
                                                            className={`h-5 w-5 transform transition-transform duration-200 ${
                                                                expandedTaskId === task.id ? 'rotate-180' : ''
                                                            }`} 
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Expanded Task Details */}
                                            {expandedTaskId === task.id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="md:col-span-2 space-y-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                                    <AlignLeft className="h-4 w-4 text-amber-500 mr-2" />
                                                                    Description
                                                                </h4>
                                                                <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                                                                    {task.description}
                                                                </div>
                                                            </div>
                                                            
                                                            {task.notes && (
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                                                        Notes
                                                                    </h4>
                                                                    <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                                                                        {task.notes}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                                                    Timeline
                                                                </h4>
                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-500">Created:</span>
                                                                            <span className="text-gray-700 font-medium">{formatDate(task.created_at)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-500">Updated:</span>
                                                                            <span className="text-gray-700 font-medium">{formatDate(task.updated_at)}</span>
                                                                        </div>
                                                                        {task.completed_at && (
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-500">Completed:</span>
                                                                                <span className="text-green-600 font-medium">{formatDate(task.completed_at)}</span>
                                                                            </div>
                                                                        )}
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-2">
                                                                {task.status === "pending" && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(task.id, "inprogress")}
                                                                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all"
                                                                    >
                                                                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                                                                        Start Progress
                                                                    </button>
                                                                )}
                                                                {task.status !== "completed" && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(task.id, "completed")}
                                                                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-sm transition-all"
                                                                    >
                                                                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                                                        Mark Complete
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleUpdateTask(task)}
                                                                    className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-sm transition-all"
                                                                >
                                                                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                    className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm transition-all"
                                                                >
                                                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            {/* Task Modals */}
            <AddTaskModal 
                show={showModal} 
                onClose={() => {
                    setShowModal(false);
                    fetchTasks(); // Refresh tasks after adding
                }} 
                fetchTasks={fetchTasks}
                employeeData={employeeData} 
            />
            
            <UpdateTaskModal 
                show={showUpdateModal} 
                onClose={() => {
                    setShowUpdateModal(false);
                    fetchTasks(); // Refresh tasks after updating
                }} 
                task={selectedTask}
                fetchTasks={fetchTasks}
                employeeData={employeeData}
            />
        </SuperAdminLayout>
    );
}