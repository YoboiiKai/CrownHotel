import { useState, useEffect } from "react";
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
  Car,
  Star,
  Info,
  Bed,
  MapPin,
  Check,
  Sparkles,
  Heart
} from "lucide-react";

export default function ClientRoomDetailsModal({
  selectedRoom,
  setSelectedRoom,
  setShowBookingForm,
  isOpen,
  onClose
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!isOpen || !selectedRoom) return null;
  
  // Robustly handle additional images and normalization
  let additionalImages = selectedRoom.additionalImages || selectedRoom.images;
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

  const mainImageUrl = normalizeImg(selectedRoom.image) || "/images/placeholder-room.jpg";
  const images = [mainImageUrl, ...additionalImages.map(normalizeImg)].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl overflow-hidden border-2 border-[#E8DCCA] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        style={{
          boxShadow: '0 10px 25px -5px rgba(121, 85, 72, 0.1), 0 8px 10px -6px rgba(121, 85, 72, 0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #faf8f5)'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5EFE7] to-[#E8DCCA] px-6 py-5 border-b-2 border-[#E8DCCA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5A2B] to-[#6B4226] shadow-lg">
                <Home className="h-6 w-6 text-white drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#6B4226] tracking-wide">{selectedRoom.roomType.charAt(0).toUpperCase() + selectedRoom.roomType.slice(1)} Suite</h3>
                <div className="flex items-center">
                  <p className="text-sm text-[#8B5A2B] font-medium">Room {selectedRoom.roomNumber}</p>
                  {selectedRoom.status && (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${selectedRoom.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedRoom.status.charAt(0).toUpperCase() + selectedRoom.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-white/80 rounded-full p-2 hover:bg-white shadow-sm"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button 
                onClick={() => {
                  setSelectedRoom && setSelectedRoom(null);
                  onClose && onClose();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white/80 rounded-full p-2 hover:bg-white shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Room Information */}
            <div className="space-y-5">
              {/* Room Image Carousel */}
              <div className="relative h-80 w-full overflow-hidden rounded-xl group shadow-lg border-2 border-[#E8DCCA]">
                {/* Price Badge */}
                <span className="absolute top-3 right-3 z-10 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] text-white">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {selectedRoom.price}/night
                </span>
                
                <img
                  src={images[currentImageIndex]}
                  alt={`Room ${selectedRoom.roomNumber} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={previousImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#8B5A2B] opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#8B5A2B] opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full ${
                        currentImageIndex === index ? "w-6 bg-[#A67C52]" : "w-2 bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Rating Badge */}
                {selectedRoom.rating && (
                  <div className="absolute bottom-3 left-3 flex items-center bg-white/80 rounded-full px-3 py-1.5 shadow-md">
                    <Star className="mr-1.5 h-4 w-4 fill-[#A67C52] text-[#8B5A2B]" />
                    <span className="text-sm font-bold text-[#6B4226]">{selectedRoom.rating}</span>
                    {selectedRoom.reviews && (
                      <span className="ml-1 text-xs font-medium text-[#8B5A2B]">({selectedRoom.reviews} reviews)</span>
                    )}
                  </div>
                )}
                
                {/* Luxury Badge */}
                <div className="absolute top-3 left-3 flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                  <Sparkles className="mr-1.5 h-4 w-4 text-[#E8DCCA]" />
                  <span className="text-xs font-bold text-white">Luxury</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Room Details Card */}
                <div className="bg-gradient-to-b from-white to-[#F5EFE7] rounded-xl border-2 border-[#E8DCCA] shadow-md p-4">
                  <div className="flex items-center mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-2">
                      <Home className="h-4 w-4 text-white" />
                    </div>
                    <h5 className="text-sm font-bold text-[#6B4226] tracking-wide">Room Information</h5>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#E8DCCA] text-sm grid grid-cols-1 gap-3 shadow-inner">
                    {/* Room Number */}
                    <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                      <div className="w-1/3 text-[#6B4226] font-medium">Room Number:</div>
                      <div className="w-2/3 text-[#8B5A2B] font-bold">{selectedRoom.roomNumber}</div>
                    </div>
                    
                    {/* Room Type */}
                    <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                      <div className="w-1/3 text-[#6B4226] font-medium">Type:</div>
                      <div className="w-2/3 text-[#8B5A2B] font-bold flex items-center">
                        {selectedRoom.roomType.charAt(0).toUpperCase() + selectedRoom.roomType.slice(1)}
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#E8DCCA] text-[#6B4226]">
                          Premium
                        </span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                      <div className="w-1/3 text-[#6B4226] font-medium">Price:</div>
                      <div className="w-2/3 text-[#8B5A2B] font-bold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-[#A67C52]" />
                        {selectedRoom.price}/night
                      </div>
                    </div>
                    
                    {/* Capacity */}
                    <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                      <div className="w-1/3 text-[#6B4226] font-medium">Capacity:</div>
                      <div className="w-2/3 text-[#8B5A2B] font-bold flex items-center">
                        <Users className="h-4 w-4 mr-1 text-[#A67C52]" />
                        {selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'Person' : 'People'}
                      </div>
                    </div>
                    
                    {/* Size */}
                    {selectedRoom.size && (
                      <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                        <div className="w-1/3 text-[#6B4226] font-medium">Size:</div>
                        <div className="w-2/3 text-[#8B5A2B] font-bold">
                          {selectedRoom.size} m²
                        </div>
                      </div>
                    )}
                    
                    {/* Beds */}
                    <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                      <div className="w-1/3 text-[#6B4226] font-medium">Beds:</div>
                      <div className="w-2/3 text-[#8B5A2B] font-bold flex items-center">
                        <Bed className="h-4 w-4 mr-1 text-[#A67C52]" />
                        {selectedRoom.beds || `${selectedRoom.capacity} Bed${selectedRoom.capacity !== 1 ? 's' : ''}`}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Amenities Card */}
                <div className="bg-gradient-to-b from-white to-[#F5EFE7] rounded-xl border-2 border-[#E8DCCA] shadow-md p-4">
                  <div className="flex items-center mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-2">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h5 className="text-sm font-bold text-[#6B4226] tracking-wide">Luxury Amenities</h5>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#E8DCCA] text-sm shadow-inner">
                    {(() => {
                      let amenities = selectedRoom.amenities;
                      if (typeof amenities === "string") {
                        try {
                          amenities = JSON.parse(amenities);
                        } catch (e) {
                          amenities = {};
                        }
                      }
                      if (!amenities || (typeof amenities === 'object' && Object.keys(amenities).length === 0) || 
                          (Array.isArray(amenities) && amenities.length === 0)) {
                        return <div className="text-[#8B5A2B] text-sm italic flex items-center justify-center p-4">No amenities listed for this luxury suite.</div>;
                      }
                      
                      // If amenities is an array
                      if (Array.isArray(amenities)) {
                        return (
                          <div className="grid grid-cols-2 gap-3">
                            {amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8DCCA] mr-2">
                                  <Check className="h-3.5 w-3.5 text-[#8B5A2B]" />
                                </div>
                                <span className="text-[#8B5A2B] font-medium">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      
                      // If amenities is an object
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {amenities.wifi && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Wifi className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">High-Speed WiFi</span>
                            </div>
                          )}
                          {amenities.tv && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Tv className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Smart TV</span>
                            </div>
                          )}
                          {amenities.bathtub && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Bath className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Luxury Bathtub</span>
                            </div>
                          )}
                          {amenities.minibar && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Wine className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Premium Mini Bar</span>
                            </div>
                          )}
                          {amenities.airCon && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Wind className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Climate Control</span>
                            </div>
                          )}
                          {amenities.hairDryer && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Shirt className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Hair Dryer</span>
                            </div>
                          )}
                          {amenities.breakfast && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Coffee className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Gourmet Breakfast</span>
                            </div>
                          )}
                          {amenities.balcony && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Sunrise className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Private Balcony</span>
                            </div>
                          )}
                          {amenities.toiletries && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Bath className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Premium Toiletries</span>
                            </div>
                          )}
                          {amenities.parking && (
                            <div className="flex items-center p-2 hover:bg-[#F5EFE7] rounded-md transition-colors duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                                <Car className="h-4 w-4 text-[#8B5A2B]" />
                              </div>
                              <span className="text-[#8B5A2B] font-medium">Valet Parking</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Description Card */}
                {selectedRoom.description && (
                  <div className="bg-gradient-to-b from-white to-[#F5EFE7] rounded-xl border-2 border-[#E8DCCA] shadow-md p-4 col-span-1 md:col-span-2">
                    <div className="flex items-center mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md mr-2">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <h5 className="text-sm font-bold text-[#6B4226] tracking-wide">Experience Luxury</h5>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#E8DCCA] text-sm shadow-inner">
                      <p className="text-[#6B4226] leading-relaxed">
                        {selectedRoom.description || 'No description provided.'}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-center">
                        <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCCA] to-transparent w-full"></div>
                        <div className="mx-4 text-[#A67C52]">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCCA] to-transparent w-full"></div>
                      </div>
                      
                      <p className="mt-4 text-center text-[#8B5A2B] font-medium italic">
                        "Experience unparalleled comfort and elegance in our carefully designed accommodations."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="pt-4 border-t-2 border-[#E8DCCA] mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8DCCA] mr-3">
                  <MapPin className="h-5 w-5 text-[#8B5A2B]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B4226]">Hotel Luxury Resort</p>
                  <p className="text-xs text-[#8B5A2B]">Prime location with stunning views</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowBookingForm && setShowBookingForm(true);
                  setSelectedRoom && setSelectedRoom(null);
                  onClose && onClose();
                }}
                className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] hover:from-[#8B5A2B] hover:to-[#6B4226] text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Book Now
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#A67C52] text-[#A67C52] mx-0.5" />
                ))}
              </div>
              <p className="text-xs text-[#8B5A2B] italic">"Our luxury rooms are designed for your ultimate comfort and relaxation."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}