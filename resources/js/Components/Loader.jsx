import React from "react";
import { Building2 } from "lucide-react";

export default function Loader({ isLoading }) {
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900 animate-gradient-pulse"></div>
      
      {/* Subtle radial overlay */}
      <div className="absolute inset-0 bg-radial-gradient"></div>
      
      <div className="relative z-10">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-amber-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 size={40} className="text-amber-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        </div>
      </div>
    </div>
  );
}
