"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Eye } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    ChevronDown,
    Plus,
    Edit,
    Trash,
    X,
    CheckCircle,
    Bed,
    Users,
    Wifi,
    Tv,
    Coffee,
    Bath,
    Tag,
    Home,
    DollarSign,
} from "lucide-react";
import RoomDetailsModal from "@/Components/SuperAdmin/RoomDetailsModal";
import AddRoomsModal from "@/Components/SuperAdmin/AddRoomsModal";
import UpdateRoomsModal from "@/Components/SuperAdmin/UpdateRoomsModal";

export default function AdminRooms() {
    const [showNewRoomForm, setShowNewRoomForm] = useState(false);
    const [showUpdateRoomForm, setShowUpdateRoomForm] = useState(false);
    const [showRoomDetails, setShowRoomDetails] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showUpdateRoom, setShowUpdateRoom] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [rooms, setRooms] = useState([]);

    // Load rooms from API on component mount
    useEffect(() => {
        fetchRooms();
    }, []);

    // Fetch rooms from API
    const fetchRooms = async () => {
        try {
            const response = await axios.get(
                `/api/superadmin/rooms?_t=${new Date().getTime()}`
            );
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Failed to fetch rooms. Please try again later.");
        }
    };

    // Handle room status change
    const handleRoomStatusChange = async (updatedRoom) => {
        try {
            await fetchRooms();
            setShowRoomDetails(false);
        } catch (error) {
            console.error("Error handling room status change:", error);
            toast.error(
                "Failed to handle room status change. Please try again later."
            );
        }
    };

    // Handle room deletion
    const deleteRoom = async (id) => {
        try {
            await axios.delete(`/api/superadmin/rooms/${id}`);
            await fetchRooms();
            toast.success("Room deleted successfully!");
            setShowRoomDetails(false);
        } catch (error) {
            console.error("Error deleting room:", error);
            toast.error("Failed to delete room. Please try again.");
        }
    };

    // Filter rooms based on status and search query
    const filteredRooms = rooms.filter((room) => {
        const matchesStatus =
            filterStatus === "all" || room.status === filterStatus;
        const matchesSearch =
            room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Helper functions for room management
    const getRoomTypeLabel = (type) => {
        const types = {
            standard: "Standard",
            deluxe: "Deluxe",
            suite: "Suite",
            executive: "Executive Suite",
            family: "Family Room",
        };
        return types[type] || type;
    };

    const getStatusColor = (status) => {
        const colors = {
            available: "bg-green-100 text-green-800",
            occupied: "bg-blue-100 text-blue-800",
            maintenance: "bg-[#F5EFE7] text-[#8B5A2B]",
            reserved: "bg-purple-100 text-purple-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    // Add new room
    const addRoom = async (formData) => {
        try {
            await axios.post("/api/superadmin/rooms", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchRooms(); // Refresh the room list
            toast.success("Room added successfully!");
            setShowNewRoomForm(false); // Close the form after successful addition
        } catch (error) {
            console.error("Error adding room:", error);
            toast.error("Failed to add room. Please try again.");
        }
    };

    // Update room
    const updateRoom = async (formData) => {
        try {
            const roomId = formData.get("id") || selectedRoom.id;

            // Add method spoofing for PUT request
            formData.append("_method", "PUT");

            await axios.post(`/api/superadmin/rooms/${roomId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchRooms(); // Refresh the room list
            toast.success("Room updated successfully!");
            setShowUpdateRoomForm(false); // Close the form after successful update
        } catch (error) {
            console.error("Error updating room:", error);
            toast.error("Failed to update room. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" hideProgressBar />
            <div className="mx-auto max-w-6xl">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#E8DCCA] transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewRoomForm(true)}
                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Room</span>
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            filterStatus === "all"
                                ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setFilterStatus("all")}
                    >
                        All Rooms
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            filterStatus === "available"
                                ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setFilterStatus("available")}
                    >
                        Available
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            filterStatus === "occupied"
                                ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setFilterStatus("occupied")}
                    >
                        Occupied
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            filterStatus === "maintenance"
                                ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setFilterStatus("maintenance")}
                    >
                        Maintenance
                    </button>
                </div>

                {/* Room Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="group">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group relative transform hover:-translate-y-1 duration-300">
                                {/* Card Header */}
                                <div className="relative bg-gradient-to-r from-[#F5EFE7] to-white p-2.5 border-b border-[#E8DCCA]">
                                    <div className="absolute top-0 right-0 h-16 w-16 bg-amber-100 rounded-full -mr-8 -mt-8 opacity-30"></div>
                                    
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="p-1 bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] rounded-md shadow-sm">
                                                <Home className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-xs font-medium text-[#6B4226]">
                                                Room {room.roomNumber}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm("Are you sure you want to delete this room?")) {
                                                    deleteRoom(room.id);
                                                }
                                            }}
                                            className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-all opacity-80 hover:opacity-100 shadow-sm"
                                            title="Delete Room"
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Room Image */}
                                <div className="relative h-32 w-full overflow-hidden">
                                    <img
                                        src={
                                            room.image
                                                ? `/storage/${room.image}`
                                                : "/images/placeholder-room.jpg"
                                        }
                                        alt={`${
                                            room.roomNumber
                                        } - ${getRoomTypeLabel(room.roomType)}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusColor(room.status)} shadow-sm`}>
                                            {room.status === "available" ? (
                                                <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                                            ) : room.status === "occupied" ? (
                                                <Users className="h-2.5 w-2.5 mr-0.5" />
                                            ) : room.status === "maintenance" ? (
                                                <Bed className="h-2.5 w-2.5 mr-0.5" />
                                            ) : null}
                                            {room.status.charAt(0).toUpperCase() +
                                                room.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 relative">
                                    {/* Room Information */}
                                    <div className="mb-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm overflow-hidden">
                                        {/* Room Type Header */}
                                        <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-white">
                                            <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#8B5A2B] transition-colors">
                                                {getRoomTypeLabel(room.roomType)}
                                            </h3>
                                        </div>
                                        
                                        {/* Price and Capacity */}
                                        <div className="p-2 flex items-center justify-between">
                                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-800 text-xs font-medium shadow-sm">
                                                <span className="font-medium">₱{room.price}</span>
                                                <span className="text-gray-800 text-xs">/night</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-800 text-xs font-medium shadow-sm">
                                                <Users className="h-3 w-3 text-gray-800" />
                                                <span>
                                                    {room.capacity} {room.capacity === 1 ? 'Pax' : 'Pax'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setShowRoomDetails(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-1 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
                                        >
                                            <Eye className="h-3 w-3" />
                                            <span>View</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowUpdateRoom(room);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 rounded-md border border-[#E8DCCA] bg-[#F5EFE7] px-2 py-1.5 text-xs font-medium text-[#8B5A2B] hover:bg-[#E8DCCA] focus:outline-none focus:ring-1 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
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

                {filteredRooms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-[#F5EFE7] p-3 mb-4">
                            <Bed className="h-6 w-6 text-[#8B5A2B]" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No rooms found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            There are no rooms matching your current filters.
                        </p>
                        <button
                            onClick={() => {
                                setFilterStatus("all");
                                setSearchQuery("");
                            }}
                            className="text-sm font-medium text-[#8B5A2B] hover:text-[#5A3921]"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Add Room Modal */}
            <AddRoomsModal
                show={showNewRoomForm}
                onClose={() => setShowNewRoomForm(false)}
                onAddRoom={addRoom}
            />

            {/* Update Room Modal */}
            <UpdateRoomsModal
                show={!!showUpdateRoom}
                onClose={() => setShowUpdateRoom(null)}
                room={showUpdateRoom}
                onUpdateRoom={updateRoom}
            />

            {/* Room Details Modal */}
            <RoomDetailsModal
                show={showRoomDetails}
                onClose={() => setShowRoomDetails(false)}
                room={selectedRoom}
                onStatusChange={handleRoomStatusChange}
                getRoomTypeLabel={getRoomTypeLabel}
                getStatusColor={getStatusColor}
            />
        </AdminLayout>
    );
}
