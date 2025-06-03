import { useState } from "react";
import { 
  X, 
  Tag, 
  DollarSign, 
  Users, 
  Wifi, 
  Tv, 
  Coffee, 
  Bath, 
  Trash2, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  XCircle,
  AlertTriangle,
  Home,
  Wind,
  Wine,
  Shirt,
  Sunrise,
  Car
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RoomDetailsModal({ 
  show,
  room,
  onClose,
  onStatusChange,
  getRoomTypeLabel,
  getStatusColor 
}) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

  if (!show || !room) return null;

  // Robustly handle additional images and normalization
  let additionalImages = room.additionalImages;
  if (typeof additionalImages === "string") {
    try {
      additionalImages = JSON.parse(additionalImages);
    } catch (e) {
      additionalImages = [];
    }
  }
  if (!Array.isArray(additionalImages)) {
    additionalImages = [];
  }
  const normalizeImg = img =>
    img
      ? img.startsWith("/storage") || img.startsWith("http")
        ? img
        : `/storage/${img}`
      : null;

  const mainImageUrl = normalizeImg(room.image) || "/images/placeholder-room.jpg";
  const images = [mainImageUrl, ...additionalImages.map(normalizeImg)].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleStatusChange = (newStatus) => {
    setIsChangingStatus(true);
    setError(null);
    
    // Call the API to update the status
    axios.post(`/api/superadmin/rooms/${room.id}/status`, {
      status: newStatus,
      _method: 'PUT'
    })
    .then(response => {
      // Call the onStatusChange callback with the updated room
      if (typeof onStatusChange === 'function') {
        onStatusChange({...room, status: newStatus});
      }
      toast.success(`Room status updated to ${newStatus} successfully!`);
    })
    .catch(error => {
      console.error('Error updating room status:', error);
      setError("Failed to update room status. Please try again.");
      toast.error("Failed to update room status. Please try again.");
    })
    .finally(() => {
      setIsChangingStatus(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Room Details</h3>
                <p className="text-xs text-white/80">View room information and status</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              {error}
            </div>
          )}
          
          {/* Room Profile Header */}
          <div className="p-5 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887] mr-1.5"></div>
                <span className="text-xs font-medium text-[#6B4226]">
                  ROOM {room.roomNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-[#5D3A1F] mb-1">{getRoomTypeLabel(room.roomType)}</h4>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getStatusColor(room.status)} transition-all duration-200 hover:shadow-md`}>
                  {room.status === 'available' ? 'Available' : 'Maintenance'}
                </span>
              </div>
              <p className="text-sm text-[#6B4226]/70">Room details and amenities information</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Room Information */}
            <div className="space-y-5">
              {/* Room Image Carousel */}
              <div className="relative h-64 w-full overflow-hidden rounded-lg group border border-[#DEB887]/30 shadow-sm">
                <img
                  src={images[currentImageIndex]}
                  alt={`Room ${room.roomNumber} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-2 rounded-full text-[#5D3A1F] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-2 rounded-full text-[#5D3A1F] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-sm hover:shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentImageIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Room Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                    <h4 className="text-sm font-medium text-[#5D3A1F]">Room Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Room Number */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                        <Home className="h-5 w-5 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B4226]/70 mb-1">Room Number</p>
                        <p className="text-sm font-medium text-[#5D3A1F]">{room.roomNumber}</p>
                      </div>
                    </div>
                    
                    {/* Room Type */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                        <Tag className="h-5 w-5 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B4226]/70 mb-1">Room Type</p>
                        <p className="text-sm font-medium text-[#5D3A1F]">{getRoomTypeLabel(room.roomType)}</p>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                        <DollarSign className="h-5 w-5 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B4226]/70 mb-1">Price per Night</p>
                        <p className="text-sm font-medium text-[#5D3A1F]">₱{room.price}</p>
                      </div>
                    </div>
                    
                    {/* Capacity */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                        <Users className="h-5 w-5 text-[#8B5A2B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B4226]/70 mb-1">Capacity</p>
                        <p className="text-sm font-medium text-[#5D3A1F]">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                    <h4 className="text-sm font-medium text-[#5D3A1F]">Room Amenities</h4>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm p-4 space-y-3">
                    {(() => {
                      let amenities = room.amenities;
                      if (typeof amenities === "string") {
                        try {
                          amenities = JSON.parse(amenities);
                        } catch (e) {
                          amenities = {};
                        }
                      }
                      if (!amenities || Object.keys(amenities).length === 0) {
                        return <div className="text-gray-400 text-xs italic">No amenities listed.</div>;
                      }
                      
                      return (
                        <div className="grid grid-cols-2 gap-2">
                          {amenities.wifi && (
                            <div className="flex items-center">
                              <Wifi className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Free WiFi</span>
                            </div>
                          )}
                          {amenities.tv && (
                            <div className="flex items-center">
                              <Tv className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Smart TV</span>
                            </div>
                          )}
                          {amenities.bathtub && (
                            <div className="flex items-center">
                              <Bath className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Bathtub</span>
                            </div>
                          )}
                          {amenities.minibar && (
                            <div className="flex items-center">
                              <Wine className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Mini Bar</span>
                            </div>
                          )}
                          {amenities.airCon && (
                            <div className="flex items-center">
                              <Wind className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Air Conditioning</span>
                            </div>
                          )}
                          {amenities.hairDryer && (
                            <div className="flex items-center">
                              <Shirt className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Hair Dryer</span>
                            </div>
                          )}
                          {amenities.breakfast && (
                            <div className="flex items-center">
                              <Coffee className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Complimentary Breakfast</span>
                            </div>
                          )}
                          {amenities.balcony && (
                            <div className="flex items-center">
                              <Sunrise className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Private Balcony</span>
                            </div>
                          )}
                          {amenities.toiletries && (
                            <div className="flex items-center">
                              <Bath className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Robe, Towel and Toiletries</span>
                            </div>
                          )}
                          {amenities.parking && (
                            <div className="flex items-center">
                              <Car className="h-3.5 w-3.5 text-[#8B5A2B] mr-1.5" />
                              <span className="text-[#8B5A2B]">Free Parking</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Description */}
                {room.description && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                      <h4 className="text-sm font-medium text-[#5D3A1F]">Room Description</h4>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <AlertTriangle className="h-5 w-5 text-[#8B5A2B]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6B4226]/70 mb-1">Description</p>
                          <p className="text-sm text-[#5D3A1F]">
                            {room.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Room Status Management */}
          <div className="space-y-4 pt-6 border-t border-[#DEB887]/30 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Room Status Management</h4>
            </div>
            
            <div className="flex flex-wrap gap-3">
                {room.status !== 'available' && (
                  <button 
                    onClick={() => handleStatusChange('available')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                  >
                    {isChangingStatus ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Mark as Available
                      </>
                    )}
                  </button>
                )}
                
                {room.status !== 'maintenance' && (
                  <button 
                    onClick={() => handleStatusChange('maintenance')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#F44336] to-[#C62828] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                  >
                    {isChangingStatus ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        Set to Maintenance
                      </>
                    )}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}