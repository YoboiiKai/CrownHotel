import { X, Tag, Percent, Calendar, Clock, CheckCircle, XCircle, Info } from "lucide-react";
import { format, parseISO } from 'date-fns';

export default function DiscountDetailsModal({ discount, onClose }) {
  if (!discount) return null;

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === '') return 'No limit';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  // Get applicable to label
  const getApplicableToLabel = (type) => {
    switch (type) {
      case 'all':
        return 'All Services';
      case 'room':
        return 'Rooms Only';
      case 'food':
        return 'Food & Beverages Only';
      default:
        return type;
    }
  };

  // Check if discount is expired
  const isExpired = discount.end_date && new Date(discount.end_date) < new Date();
  const status = isExpired ? 'expired' : discount.status;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn border border-[#E8DCCA]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5EFE7] via-[#E8DCCA] to-[#F5EFE7] border-b border-[#D8C4A9] p-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#442918] flex items-center">
              <Tag className="h-5 w-5 text-[#6B4226] mr-2" />
              <span>Discount Details</span>
            </h3>
            <button 
              onClick={onClose} 
              className="text-[#6B4226] hover:text-[#442918] transition-colors duration-200 p-1 rounded-full hover:bg-[#F5EFE7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className={getStatusBadge(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {isExpired && (
                <span className="ml-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  Expired
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{discount.code}</span>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 bg-gradient-to-b from-[#F5EFE7]/30 to-white">
          <div className="space-y-6">
            {/* Discount Summary */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-[#442918] mb-2">{discount.name}</h4>
              <p className="text-gray-600 mb-4">{discount.description || 'No description provided.'}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-[#6B4226]">
                  {discount.type === 'percentage' 
                    ? `${parseFloat(discount.value).toFixed(0)}%` 
                    : formatCurrency(discount.value)}
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>{getApplicableToLabel(discount.applicable_to)}</div>
                  {discount.usage_limit && (
                    <div>Limited to {discount.usage_limit} uses</div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="text-sm text-gray-500">
                  {discount.min_purchase ? (
                    <div>Minimum purchase: {formatCurrency(discount.min_purchase)}</div>
                  ) : (
                    <div>No minimum purchase required</div>
                  )}
                  {discount.max_discount && discount.type === 'percentage' && (
                    <div>Maximum discount: {formatCurrency(discount.max_discount)}</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Validity Period */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-base font-semibold text-[#442918] mb-3 flex items-center">
                <Calendar className="h-5 w-5 text-[#6B4226] mr-2" />
                <span>Validity Period</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Start Date</div>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{formatDate(discount.start_date)}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">End Date</div>
                  <div className={`flex items-center mt-1 ${isExpired ? 'text-red-600' : ''}`}>
                    <Calendar className={`h-4 w-4 mr-2 ${isExpired ? 'text-red-600' : 'text-gray-400'}`} />
                    <span>{formatDate(discount.end_date)}</span>
                    {isExpired && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {discount.usage_count > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium">Used {discount.usage_count} time{discount.usage_count !== 1 ? 's' : ''}</span>
                    {discount.usage_limit && (
                      <span className="text-gray-500"> of {discount.usage_limit} max</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-[#6B4226] h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (discount.usage_count / (discount.usage_limit || discount.usage_count)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Terms & Conditions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Terms & Conditions</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cannot be combined with other offers or promotions</li>
                      <li>Valid for new bookings only</li>
                      <li>Subject to availability</li>
                      {discount.min_purchase && (
                        <li>Minimum purchase of {formatCurrency(discount.min_purchase)} required</li>
                      )}
                      <li>Management reserves the right to modify or cancel this offer at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#6B4226] text-white rounded-lg hover:bg-[#5A3720] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226] transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
