import { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  Check,
  X,
  ArrowUpDown,
} from "lucide-react";
import AddAdminModal from "@/Components/SuperAdmin/AddAdminModal";
import UpdateAdminModal from "@/Components/SuperAdmin/UpdateAdminModal";
import AdminDetailsModal from "@/Components/SuperAdmin/AdminDetailsModal";
import axios from "axios";

export default function Admin() {
  const { admins: initialAdmins } = usePage().props;
  const [admins, setAdmins] = useState(initialAdmins || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  // Load admins from API on component mount
  useEffect(() => {
    if (!initialAdmins) {
      fetchAdmins();
    }
  }, [initialAdmins]);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(route('admin.index'));
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort admins based on sort field and direction
  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open add modal
  const openAddModal = () => {
    setShowAddModal(true);
  };

  // Close add modal
  const closeAddModal = () => {
    setShowAddModal(false);
    reset();
  };

  // Handle add admin form submission
  const handleAddAdmin = (formData) => {
    axios.post(route('admin.store'), formData)
      .then(response => {
        // Refresh the admin list
        fetchAdmins();
        closeAddModal();
      })
      .catch(error => {
        console.error("Error adding admin:", error);
      });
  };

  // Open update modal
  const openUpdateModal = (admin) => {
    setSelectedAdmin(admin);
    setShowUpdateModal(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedAdmin(null);
  };

  // Handle update admin form submission
  const handleUpdateAdmin = (formData) => {
    axios.put(route('admin.update', selectedAdmin.id), formData)
      .then(response => {
        // Refresh the admin list
        fetchAdmins();
        closeUpdateModal();
      })
      .catch(error => {
        console.error("Error updating admin:", error);
      });
  };

  // Open details modal
  const openDetailsModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAdmin(null);
  };

  // Handle activate admin
  const handleActivateAdmin = (id) => {
    axios.put(route('admin.updateStatus', id), { status: 'active' })
      .then(response => {
        // Refresh the admin list
        fetchAdmins();
      })
      .catch(error => {
        console.error("Error activating admin:", error);
      });
  };

  // Handle deactivate admin
  const handleDeactivateAdmin = (id) => {
    axios.put(route('admin.updateStatus', id), { status: 'inactive' })
      .then(response => {
        // Refresh the admin list
        fetchAdmins();
      })
      .catch(error => {
        console.error("Error deactivating admin:", error);
      });
  };

  // Handle delete admin
  const handleDeleteAdmin = (id) => {
    setIsDeleting(true);
    setDeleteId(id);

    axios.delete(route('admin.destroy', id))
      .then(response => {
        // Refresh the admin list
        fetchAdmins();
        setIsDeleting(false);
        setDeleteId(null);
      })
      .catch(error => {
        console.error("Error deleting admin:", error);
        setIsDeleting(false);
        setDeleteId(null);
      });
  };

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-sm text-gray-500">
            Manage hotel administrators and their access
          </p>
        </div>
      }
    >
      <Head title="Admin Management" />

      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                  placeholder="Search administrators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-lg text-sm font-medium shadow-sm hover:from-amber-600 hover:to-amber-800 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add New Admin
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAdmins.length > 0 ? (
                  sortedAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                            {admin.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.status === "active" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {admin.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetailsModal(admin)}
                            className="text-gray-600 hover:text-amber-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openUpdateModal(admin)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit Admin"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className={`text-gray-600 hover:text-red-600 transition-colors ${
                              isDeleting && deleteId === admin.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={isDeleting && deleteId === admin.id}
                            title="Delete Admin"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm
                        ? "No administrators found matching your search."
                        : "No administrators found. Add one to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        show={showAddModal}
        onClose={closeAddModal}
        onSubmit={handleAddAdmin}
      />

      {/* Update Admin Modal */}
      {selectedAdmin && (
        <UpdateAdminModal
          show={showUpdateModal}
          onClose={closeUpdateModal}
          admin={selectedAdmin}
          onSubmit={handleUpdateAdmin}
        />
      )}

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <AdminDetailsModal
          show={showDetailsModal}
          onClose={closeDetailsModal}
          admin={selectedAdmin}
          onActivate={handleActivateAdmin}
          onDeactivate={handleDeactivateAdmin}
        />
      )}
    </SuperAdminLayout>
  );
}