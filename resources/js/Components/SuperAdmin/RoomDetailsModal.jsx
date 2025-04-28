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
    })
    .catch(error => {
      console.error('Error updating room status:', error);
    })
    .finally(() => {
      setIsChangingStatus(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-amber-50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">Room Details</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Room Information */}
            <div className="space-y-5">
              {/* Room Image Carousel with Status Badge */}
              <div className="relative h-64 w-full overflow-hidden rounded-lg group">
                {/* Status Badge */}
                <span className={`absolute top-2 right-2 z-10 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getStatusColor(room.status)} transition-all duration-200 hover:shadow-md`}>
                  {room.status === 'available' ? 'Available' : 'Maintenance'}
                </span>
                
                <img
                  src={images[currentImageIndex]}
                  alt={`Room ${room.roomNumber} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
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
                {/* Room Details Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                  <div className="flex items-center mb-2">
                    <Home className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                    <h5 className="text-xs font-semibold text-gray-900">Room Information</h5>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs grid grid-cols-1 gap-2">
                    {/* Room Number */}
                    <div className="flex items-center">
                      <span className="text-gray-500">Room Number:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{room.roomNumber}</span>
                    </div>
                    
                    {/* Room Type */}
                    <div className="flex items-center">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{getRoomTypeLabel(room.roomType)}</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center">
                      <span className="text-gray-500">Price:</span>
                      <span className="text-gray-700 font-medium ml-1.5">₱{room.price}/night</span>
                    </div>
                    
                    {/* Capacity */}
                    <div className="flex items-center">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="text-gray-700 font-medium ml-1.5">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Amenities Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                  <div className="flex items-center mb-2">
                    <Tag className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                    <h5 className="text-xs font-semibold text-gray-900">Amenities</h5>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
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
                              <Wifi className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Free WiFi</span>
                            </div>
                          )}
                          {amenities.tv && (
                            <div className="flex items-center">
                              <Tv className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Smart TV</span>
                            </div>
                          )}
                          {amenities.bathtub && (
                            <div className="flex items-center">
                              <Bath className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Bathtub</span>
                            </div>
                          )}
                          {amenities.minibar && (
                            <div className="flex items-center">
                              <Wine className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Mini Bar</span>
                            </div>
                          )}
                          {amenities.airCon && (
                            <div className="flex items-center">
                              <Wind className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Air Conditioning</span>
                            </div>
                          )}
                          {amenities.hairDryer && (
                            <div className="flex items-center">
                              <Shirt className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Hair Dryer</span>
                            </div>
                          )}
                          {amenities.breakfast && (
                            <div className="flex items-center">
                              <Coffee className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Complimentary Breakfast</span>
                            </div>
                          )}
                          {amenities.balcony && (
                            <div className="flex items-center">
                              <Sunrise className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Private Balcony</span>
                            </div>
                          )}
                          {amenities.toiletries && (
                            <div className="flex items-center">
                              <Bath className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Robe, Towel and Toiletries</span>
                            </div>
                          )}
                          {amenities.parking && (
                            <div className="flex items-center">
                              <Car className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                              <span className="text-gray-700">Free Parking</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Description Card */}
                {room.description && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 col-span-1 md:col-span-2">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                      <h5 className="text-xs font-semibold text-gray-900">Room Description</h5>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                      <p className="text-gray-700 italic">
                        {room.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col pt-3 border-t border-gray-100 mt-4">
            {/* Status Management */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-3">
                {room.status !== 'available' && (
                  <button 
                    onClick={() => handleStatusChange('available')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    {isChangingStatus ? 'Updating...' : 'Mark as Available'}
                  </button>
                )}
                
                {room.status !== 'maintenance' && (
                  <button 
                    onClick={() => handleStatusChange('maintenance')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isChangingStatus ? 'Updating...' : 'Set to Maintenance'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}