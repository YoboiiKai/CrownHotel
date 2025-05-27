import { X, Calendar, Clock } from "lucide-react"

export default function PurchaseOrderDetails({ show, onClose, order }) {
  if (!show || !order) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-[#F5EFE7] text-[#8B5A2B]",
      received: "bg-green-100 text-green-800",
      delivered: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-[#8B5A2B]" />
      case "received":
        return <span className="h-3 w-3 text-green-600">✓</span>
      case "delivered":
        return <span className="h-3 w-3 text-blue-600">🚚</span>
      case "cancelled":
        return <X className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE7]">
                <Calendar className="h-5 w-5 text-[#8B5A2B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="mt-1 text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Supplier</p>
              <p className="mt-1 text-gray-900">{order.supplier}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="mt-1 capitalize text-gray-900">{order.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.unit}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Notes</p>
            <p className="mt-1 text-sm text-gray-600">{order.notes || "No notes provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="mt-1 text-gray-900">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
              <p className="mt-1 text-gray-900">{formatDate(order.expectedDeliveryDate)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {order.status === "pending" && (
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg hover:from-[#6B4226] hover:to-[#5D3A22] transition-colors"
              >
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}