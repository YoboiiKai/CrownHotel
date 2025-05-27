import React from "react";
import { Check } from "lucide-react";

export default function OrderConfirmationModal({
  showOrderConfirmation,
  orderSuccess,
  roomNumber,
  clearCart,
  setShowOrderConfirmation,
  setOrderSuccess
}) {
  // Remove the null check to ensure the modal always renders
  // The visibility will be controlled by CSS based on the showOrderConfirmation prop
  
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${showOrderConfirmation ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        {!orderSuccess ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A2B] mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
            <p className="text-gray-600">Please wait while we process your order...</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-green-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-6">Your order will be delivered to Room {roomNumber} shortly.</p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  clearCart();
                  setShowOrderConfirmation(false);
                  setOrderSuccess(false);
                }}
                className="py-2 px-4 bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg text-white text-sm font-medium hover:from-[#6B4226] hover:to-[#513018]"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
