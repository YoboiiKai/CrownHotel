import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
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
    Tag
} from 'lucide-react';

export default function Task() {
    // State for task data and UI controls
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
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

    // Mock task data
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

    // Mock employee data
    const employeeData = [
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
    ];

    // Fetch data effect
    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    // Filter tasks based on active tab, search query, and filters
    const filteredTasks = taskData.filter(task => {
        const matchesTab = 
            activeTab === "all" || 
            (activeTab === "pending" && task.status === "pending") || 
            (activeTab === "completed" && task.status === "completed") ||
            (activeTab === "overdue" && task.status === "overdue");
        
        const matchesSearch = 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
        
        const matchesEmployee = filterEmployee === "all" || task.employeeId.toString() === filterEmployee;
        
        return matchesTab && matchesSearch && matchesPriority && matchesEmployee;
    });

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
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
            case "pending": return "text-blue-600 bg-blue-100";
            case "overdue": return "text-red-600 bg-red-100";
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
    };

    // Handle task status change
    const handleStatusChange = (taskId, newStatus) => {
        // In a real app, you would update this in your backend
        console.log(`Task ${taskId} status changed to ${newStatus}`);
    };

    // Handle task deletion
    const handleDeleteTask = (taskId) => {
        // In a real app, you would delete this from your backend
        console.log(`Task ${taskId} deleted`);
    };

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
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "overdue" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("overdue")}
                            >
                                Overdue
                            </button>
                        </div>
                    </div>

                    {/* Task Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Tasks Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <ClipboardList className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Total Tasks</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">{taskData.length}</p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Active</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {taskData.filter(task => task.status !== "completed").length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Tasks Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Pending Tasks</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {taskData.filter(task => task.status === "pending").length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">High Priority</p>
                                        <p className="text-sm font-medium text-red-600">
                                            {taskData.filter(task => task.status === "pending" && task.priority === "high").length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Tasks Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Completed Tasks</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {taskData.filter(task => task.status === "completed").length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Completion Rate</p>
                                        <p className="text-sm font-medium text-green-600">
                                            {Math.round((taskData.filter(task => task.status === "completed").length / taskData.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overdue Tasks Card */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900">Overdue Tasks</h3>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {taskData.filter(task => task.status === "overdue").length}
                                    </p>
                                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Needs Attention</p>
                                        <p className="text-sm font-medium text-red-600">
                                            {taskData.filter(task => task.status === "overdue" && task.priority === "high").length} high priority
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task List */}
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                <ClipboardList className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="mt-3 text-lg font-medium text-gray-900">No tasks found</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {searchQuery ? "Try adjusting your search or filters" : "Get started by adding a new task"}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                >
                                    <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                    Add New Task
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {filteredTasks.map((task) => (
                                    <li key={task.id} className="relative">
                                        <div 
                                            className={`px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150 ${
                                                expandedTaskId === task.id ? 'bg-gray-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                                        <div>
                                                            <div className="flex items-center">
                                                                <p className="font-medium text-gray-900 truncate">{task.title}</p>
                                                                <span 
                                                                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                                                                >
                                                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                                </span>
                                                                <span 
                                                                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                                                                >
                                                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 flex items-center">
                                                                <p className="text-sm text-gray-500 truncate">
                                                                    <span className="font-medium text-gray-700">
                                                                        <User className="inline-block h-3.5 w-3.5 mr-1" />
                                                                        {task.assignedTo}
                                                                    </span>
                                                                    <span className="ml-2 text-gray-400">•</span>
                                                                    <span className="ml-2">
                                                                        <Tag className="inline-block h-3.5 w-3.5 mr-1" />
                                                                        {task.department}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        <span>{formatDate(task.dueDate)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                                            className="ml-2 p-1 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-50 focus:outline-none"
                                                        >
                                                            <ChevronDown 
                                                                className={`h-5 w-5 transform transition-transform duration-200 ${
                                                                    expandedTaskId === task.id ? 'rotate-180' : ''
                                                                }`} 
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Expanded Task Details */}
                                            {expandedTaskId === task.id && (
                                                <div className="mt-4 border-t border-gray-100 pt-4 pb-2 text-sm">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="col-span-2">
                                                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                                            <p className="text-gray-700 mb-4">{task.description}</p>
                                                            
                                                            {task.notes && (
                                                                <>
                                                                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                                                    <p className="text-gray-700 mb-4">{task.notes}</p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Created:</span>
                                                                    <span className="text-gray-700">{formatDate(task.createdAt)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Due:</span>
                                                                    <span className="text-gray-700">{formatDate(task.dueDate)}</span>
                                                                </div>
                                                                {task.completedAt && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">Completed:</span>
                                                                        <span className="text-gray-700">{formatDate(task.completedAt)}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500">Status:</span>
                                                                    <span className={`font-medium ${
                                                                        task.status === 'completed' ? 'text-green-600' : 
                                                                        task.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                                                                    }`}>
                                                                        {getDaysRemaining(task.dueDate, task.status)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                {task.status !== "completed" && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(task.id, "completed")}
                                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100"
                                                                    >
                                                                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                                                        Mark Complete
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                >
                                                                    <Edit className="mr-1 h-3.5 w-3.5" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                                                                >
                                                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
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
            {/* Task Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Plus className="h-6 w-6 text-amber-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Task</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Fill in the details below to create a new task for hotel staff.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <form onSubmit={handleSubmitTask}>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            {/* Task Title */}
                                            <div className="sm:col-span-6">
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                    Task Title <span className="text-red-500">*</span>
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        required
                                                        value={newTask.title}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Task Description */}
                                            <div className="sm:col-span-6">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                    Description <span className="text-red-500">*</span>
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={3}
                                                        required
                                                        value={newTask.description}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Assigned Employee */}
                                            <div className="sm:col-span-3">
                                                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                                                    Assigned To <span className="text-red-500">*</span>
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="employeeId"
                                                        name="employeeId"
                                                        required
                                                        value={newTask.employeeId}
                                                        onChange={(e) => {
                                                            const selectedEmployee = employeeData.find(emp => emp.id.toString() === e.target.value);
                                                            setNewTask(prev => ({
                                                                ...prev,
                                                                employeeId: e.target.value,
                                                                assignedTo: selectedEmployee ? selectedEmployee.name : "",
                                                                department: selectedEmployee ? selectedEmployee.department : ""
                                                            }));
                                                        }}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    >
                                                        <option value="">Select an employee</option>
                                                        {employeeData.map((employee) => (
                                                            <option key={employee.id} value={employee.id}>
                                                                {employee.name} - {employee.department}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Department (Auto-filled) */}
                                            <div className="sm:col-span-3">
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                                    Department
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        id="department"
                                                        value={newTask.department}
                                                        readOnly
                                                        className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Priority */}
                                            <div className="sm:col-span-3">
                                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                                    Priority <span className="text-red-500">*</span>
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="priority"
                                                        name="priority"
                                                        required
                                                        value={newTask.priority}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Due Date */}
                                            <div className="sm:col-span-3">
                                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                                    Due Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="dueDate"
                                                        id="dueDate"
                                                        required
                                                        value={newTask.dueDate}
                                                        onChange={handleInputChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div className="sm:col-span-6">
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Additional Notes
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={2}
                                                        value={newTask.notes}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                            >
                                                Create Task
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}