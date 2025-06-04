import React, { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Plus, Search, Filter, Download, Print, Clock, Calendar, Eye, DollarSign } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom styles for the scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #8B5A2B;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6B4226;
  }
`;

export default function Billing() {
  // State for invoices
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  });
  
  // State for invoice details modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  
  // State for filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  
  // State for invoice generation
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [],
    notes: "",
    paymentMethod: "cash",
    status: "pending"
  });

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/invoices', {
        params: {
          start_date: filterDateRange.start.toISOString().split('T')[0],
          end_date: filterDateRange.end.toISOString().split('T')[0],
          status: filterStatus,
          payment_method: filterPaymentMethod,
          search: searchQuery
        }
      });
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle invoice status update
  const updateInvoiceStatus = async (invoiceId, status) => {
    try {
      await axios.put(`/api/invoices/${invoiceId}/status`, { status });
      toast.success("Invoice status updated successfully!");
      fetchInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status. Please try again.");
    }
  };

  // Handle invoice deletion
  const deleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    
    try {
      await axios.delete(`/api/invoices/${invoiceId}`);
      toast.success("Invoice deleted successfully!");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  // Handle invoice generation
  const generateInvoice = async () => {
    try {
      await axios.post('/api/invoices', newInvoice);
      toast.success("Invoice generated successfully!");
      setNewInvoice({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        items: [],
        notes: "",
        paymentMethod: "cash",
        status: "pending"
      });
      fetchInvoices();
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    }
  };

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toString().includes(searchQuery) ||
      invoice.totalAmount.toString().includes(searchQuery);
    
    const matchesDate = 
      new Date(invoice.date) >= filterDateRange.start &&
      new Date(invoice.date) <= filterDateRange.end;
    
    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    fetchInvoices();
  }, [filterDateRange, filterStatus, filterPaymentMethod, searchQuery]);

  return (
    <SuperAdminLayout>
      {/* Apply custom scrollbar styles */}
      <style>{scrollbarStyles}</style>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />

      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#5D3A1F]">Billing & Invoices</h1>
          <button
            onClick={() => setShowInvoiceDetails(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-[#5D3A1F] mb-2">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterDateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setFilterDateRange(prev => ({
                    ...prev,
                    start: new Date(e.target.value)
                  }))}
                  className="flex-1 rounded-md border border-[#DEB887]/30 px-3 py-2 text-sm text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20"
                />
                <input
                  type="date"
                  value={filterDateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setFilterDateRange(prev => ({
                    ...prev,
                    end: new Date(e.target.value)
                  }))}
                  className="flex-1 rounded-md border border-[#DEB887]/30 px-3 py-2 text-sm text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#5D3A1F] mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-[#DEB887]/30 px-3 py-2 text-sm text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-[#5D3A1F] mb-2">Payment Method</label>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full rounded-md border border-[#DEB887]/30 px-3 py-2 text-sm text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20"
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
            />
          </div>
          <button
            onClick={fetchInvoices}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filter Results
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5EFE7]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEB887]/20">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[#F5EFE7]/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A1F]">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A1F]">{invoice.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A1F]">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A1F]">₱{invoice.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A1F]">{invoice.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceDetails(true);
                          }}
                          className="p-1.5 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-[#5D3A1F]" />
                        </button>
                        <button
                          onClick={() => updateInvoiceStatus(invoice.id, invoice.status === 'pending' ? 'paid' : 'pending')}
                          className="p-1.5 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                          title="Toggle Status"
                        >
                          {invoice.status === 'pending' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="p-1.5 rounded-md bg-[#F5EFE7]/50 hover:bg-[#F5EFE7]/70 transition-all"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
            {/* Modal content will be added in the next iteration */}
            <button
              onClick={() => setShowInvoiceDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
