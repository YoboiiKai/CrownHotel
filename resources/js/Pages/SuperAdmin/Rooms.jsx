"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Eye } from "lucide-react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
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
    Filter,
    Clock,
} from "lucide-react";
import RoomDetailsModal from "@/Components/SuperAdmin/RoomDetailsModal";
import AddRoomsModal from "@/Components/SuperAdmin/AddRoomsModal";
import UpdateRoomsModal from "@/Components/SuperAdmin/UpdateRoomsModal";

export default function Rooms() {
    const [showNewRoomForm, setShowNewRoomForm] = useState(false);
    const [showUpdateRoomForm, setShowUpdateRoomForm] = useState(false);
    const [showRoomDetails, setShowRoomDetails] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showUpdateRoom, setShowUpdateRoom] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
        <SuperAdminLayout>
            <ToastContainer position="top-right" hideProgressBar />
            <div className="mx-auto max-w-6xl">
                {/* Combined Action Bar with Search, Filter, and Add Button */}
                <div className="bg-white rounded-xl shadow-md border border-[#DEB887]/30 p-4 mb-8 mt-5">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative w-full lg:flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
                            />
                        </div>
                        
                        {/* Filter Dropdown */}
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <div className="relative w-full lg:w-auto">
                                <button
                                    className="flex w-full lg:w-auto items-center justify-between gap-2 rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#5D3A1F] shadow-sm hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-[#8B5A2B]" />
                                        <span>
                                            {filterStatus === "all" && "All Rooms"}
                                            {filterStatus === "available" && "Available"}
                                            {filterStatus === "occupied" && "Occupied"}
                                            {filterStatus === "maintenance" && "Maintenance"}
                                            {filterStatus === "reserved" && "Reserved"}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-[#8B5A2B]" />
                                </button>

                                {showFilterDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#DEB887]/30 bg-white py-1 shadow-lg z-10">
                                        <button
                                            className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === "all" ? "bg-[#F5EFE7] text-[#8B5A2B] font-medium" : "text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
                                            onClick={() => {
                                                setFilterStatus("all");
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            All Rooms
                                        </button>
                                        <button
                                            className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === "available" ? "bg-[#F5EFE7] text-[#8B5A2B] font-medium" : "text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
                                            onClick={() => {
                                                setFilterStatus("available");
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            Available
                                        </button>
                                        <button
                                            className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === "occupied" ? "bg-[#F5EFE7] text-[#8B5A2B] font-medium" : "text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
                                            onClick={() => {
                                                setFilterStatus("occupied");
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            Occupied
                                        </button>
                                        <button
                                            className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === "maintenance" ? "bg-[#F5EFE7] text-[#8B5A2B] font-medium" : "text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
                                            onClick={() => {
                                                setFilterStatus("maintenance");
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            Maintenance
                                        </button>
                                        <button
                                            className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === "reserved" ? "bg-[#F5EFE7] text-[#8B5A2B] font-medium" : "text-[#5D3A1F] hover:bg-[#F5EFE7]/50"}`}
                                            onClick={() => {
                                                setFilterStatus("reserved");
                                                setShowFilterDropdown(false);
                                            }}
                                        >
                                            Reserved
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Add Room Button */}
                            <button
                                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
                                onClick={() => setShowNewRoomForm(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Room</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-xl border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Room Image */}
                            <div className="relative h-48 bg-gradient-to-r from-[#F5EFE7] to-white">
                                <div className="w-full h-full bg-gradient-to-r from-[#F5EFE7] to-white flex items-center justify-center">
                                    {room.image ? (
                                        <img
                                            src={`/storage/${room.image}`}
                                            alt={`Room ${room.roomNumber}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Bed className="h-12 w-12 text-[#8B5A2B]/30 mx-auto mb-2" />
                                            <p className="text-sm text-[#8B5A2B]/50">Room Image</p>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${getStatusColor(room.status)}`}
                                    >
                                        {room.status === "available" && (
                                            <CheckCircle className="h-3 w-3" />
                                        )}
                                        {room.status === "occupied" && (
                                            <Users className="h-3 w-3" />
                                        )}
                                        {room.status === "maintenance" && (
                                            <X className="h-3 w-3" />
                                        )}
                                        {room.status === "reserved" && (
                                            <Clock className="h-3 w-3" />
                                        )}
                                        {room.status.charAt(0).toUpperCase() +
                                            room.status.slice(1)}
                                    </span>
                                </div>
                                
                                {/* Price Badge */}
                                <div className="absolute bottom-3 left-3 z-10">
                                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[#8B5A2B] text-xs font-medium shadow-sm border border-[#DEB887]/20">
                                        <DollarSign className="h-3 w-3" />
                                        <span>{room.price}/night</span>
                                    </div>
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-base font-semibold text-[#5D3A1F]">
                                            Room {room.roomNumber}
                                        </h3>
                                        <p className="text-sm text-[#8B5A2B]">
                                            {getRoomTypeLabel(room.roomType)}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {room.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {room.amenities?.includes("wifi") && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                                            <Wifi className="h-3 w-3" />
                                            WiFi
                                        </span>
                                    )}
                                    {room.amenities?.includes("tv") && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-100">
                                            <Tv className="h-3 w-3" />
                                            TV
                                        </span>
                                    )}
                                    {room.amenities?.includes("coffee") && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5EFE7] px-2 py-0.5 text-xs font-medium text-[#8B5A2B] border border-[#DEB887]/30">
                                            <Coffee className="h-3 w-3" />
                                            Coffee
                                        </span>
                                    )}
                                    {room.amenities?.includes("bath") && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                                            <Bath className="h-3 w-3" />
                                            Bath
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mt-3 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-full"></div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setShowRoomDetails(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <Eye className="h-3 w-3" />
                                        <span>View</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUpdateRoom(room);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#8B5A2B] hover:bg-[#DEB887]/10 transition-all duration-300"
                                    >
                                        <Edit className="h-3 w-3" />
                                        <span>Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRooms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-[#DEB887]/30 mt-8">
                        <div className="rounded-full bg-[#E8DCCA] p-3 mb-4">
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
                            className="text-sm font-medium text-[#8B5A2B] hover:text-[#5A371F]"
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
        </SuperAdminLayout>
    );
}
