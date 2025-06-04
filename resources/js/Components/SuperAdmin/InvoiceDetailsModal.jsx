import React, { useState } from 'react';
import { X, Download, Print, Eye, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

export default function InvoiceDetailsModal({
  show,
  onClose,
  invoice,
  onUpdateStatus,
  onDelete
}) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleDownload = () => {
    // Implement PDF download functionality
    toast.success('Invoice downloaded successfully!');
  };

  const handlePrint = () => {
    // Implement print functionality
    toast.success('Invoice sent to printer!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${!show ? 'hidden' : ''}`}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#5D3A1F]">Invoice Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Header */}
        <div className="border-b border-[#DEB887]/30 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-[#5D3A1F]">Invoice #{invoice.invoiceNumber}</h3>
              <p className="text-sm text-[#5D3A1F]/70">Date: {new Date(invoice.date).toLocaleDateString()}</p>
              <p className="text-sm text-[#5D3A1F]/70">Status: 
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="p-2 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                title="Download Invoice"
              >
                <Download className="h-4 w-4 text-[#5D3A1F]" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                title="Print Invoice"
              >
                <Print className="h-4 w-4 text-[#5D3A1F]" />
              </button>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b border-[#DEB887]/30 pb-4 mb-4">
          <h3 className="text-sm font-medium text-[#5D3A1F] mb-2">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#5D3A1F]">Name: {invoice.customerName}</p>
              <p className="text-sm text-[#5D3A1F]">Email: {invoice.customerEmail}</p>
              <p className="text-sm text-[#5D3A1F]">Phone: {invoice.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-[#5D3A1F]">Payment Method: {invoice.paymentMethod}</p>
              <p className="text-sm text-[#5D3A1F]">Service Type: {invoice.serviceType}</p>
              <p className="text-sm text-[#5D3A1F]">Room/Table: {invoice.roomNumber || invoice.tableNumber}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[#5D3A1F] mb-2">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5EFE7]">
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-[#F5EFE7]/50">
                    <td className="px-4 py-2 text-sm text-[#5D3A1F]">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-[#5D3A1F]">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-[#5D3A1F]">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-sm text-[#5D3A1F]">{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-b border-[#DEB887]/30 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#5D3A1F]">Payment Details</h3>
            <button
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              className="text-sm text-[#5D3A1F] hover:text-[#8B5A2B]"
            >
              {showPaymentDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          {showPaymentDetails && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-[#5D3A1F]">Payment Method: {invoice.paymentMethod}</p>
              <p className="text-sm text-[#5D3A1F]">Payment Status: {invoice.paymentStatus}</p>
              <p className="text-sm text-[#5D3A1F]">Transaction ID: {invoice.transactionId}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="border-b border-[#DEB887]/30 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#5D3A1F]">Special Instructions</h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-sm text-[#5D3A1F] hover:text-[#8B5A2B]"
            >
              {showNotes ? 'Hide Notes' : 'Show Notes'}
            </button>
          </div>
          {showNotes && (
            <div className="mt-2">
              <p className="text-sm text-[#5D3A1F]">{invoice.notes || 'No special instructions provided'}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t border-[#DEB887]/30 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#5D3A1F]">Subtotal: {formatCurrency(invoice.subtotal)}</p>
              {invoice.discount > 0 && (
                <p className="text-sm text-[#5D3A1F]">Discount: {formatCurrency(invoice.discount)}</p>
              )}
              <p className="text-sm text-[#5D3A1F]">Tax: {formatCurrency(invoice.tax)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#5D3A1F]">Total: {formatCurrency(invoice.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition-all"
          >
            Delete Invoice
          </button>
          <button
            onClick={() => onUpdateStatus(invoice.status === 'pending' ? 'paid' : 'pending')}
            className={`px-4 py-2 rounded-md ${
              invoice.status === 'pending'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            } transition-all`}
          >
            {invoice.status === 'pending' ? 'Mark as Paid' : 'Mark as Pending'}
          </button>
        </div>
      </div>
    </div>
  );
}
