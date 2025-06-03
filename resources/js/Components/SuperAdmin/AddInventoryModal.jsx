import { useState, useRef } from "react";
import {
    Package,
    Barcode,
    Tag,
    Hash,
    DollarSign,
    MapPin,
    Building,
    FileText,
    X,
    Upload,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddInventoryModal({ show, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        itemName: "",
        itemCode: "",
        category: "food",
        quantity: "",
        unit: "pcs",
        minStockLevel: "",
        price: "",
        supplier: "",
        location: "kitchen",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!show) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item name is required";
        }
        if (!formData.itemCode.trim()) {
            newErrors.itemCode = "Item code is required";
        }
        if (!formData.quantity) {
            newErrors.quantity = "Quantity is required";
        }
        if (!formData.minStockLevel) {
            newErrors.minStockLevel = "Minimum stock level is required";
        }
        if (!formData.price) {
            newErrors.price = "Price is required";
        }
        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            itemName: "",
            itemCode: "",
            category: "food",
            quantity: "",
            unit: "pcs",
            minStockLevel: "",
            price: "",
            supplier: "",
            location: "kitchen",
            description: "",
        });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);

            // Create FormData object for file upload
            const formDataToSend = new FormData();
            formDataToSend.append("itemName", formData.itemName);
            formDataToSend.append("itemCode", formData.itemCode);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("quantity", formData.quantity);
            formDataToSend.append("unit", formData.unit);
            formDataToSend.append("minStockLevel", formData.minStockLevel);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("supplier", formData.supplier || "");
            formDataToSend.append("location", formData.location);
            formDataToSend.append("description", formData.description || "");

            // Add image if selected
            if (fileInputRef.current && fileInputRef.current.files[0]) {
                formDataToSend.append("image", fileInputRef.current.files[0]);
            }

            // Submit form to backend using axios
            axios
                .post("/api/inventory", formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    toast.success("Inventory item created successfully!");
                    const data = response.data;
                    resetForm();
                    // Call onSubmit after the form is reset to ensure the parent component gets the latest data
                    if (onSubmit) {
                        onSubmit(data);
                    }
                    onClose();
                })
                .catch((error) => {
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.errors
                    ) {
                        setErrors(error.response.data.errors);
                        toast.error("Please fix the errors in the form.");
                    } else {
                        console.error("Error creating inventory item:", error);
                        setErrors({
                            general:
                                "An error occurred while creating the inventory item",
                        });
                        toast.error(
                            "Failed to create inventory item. Please try again."
                        );
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const inputClasses =
        "w-full rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-[#6B4226]/50 shadow-sm";
    const labelClasses = "block text-sm font-medium text-[#5D3A1F] mb-1.5";
    const iconWrapperClasses =
        "absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5A2B]";
    const errorClasses = "text-xs text-red-600 mt-1.5 font-medium";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Add New Inventory Item
                                </h3>
                                <p className="text-xs text-white/80">
                                    Add a new inventory item with the following
                                    details
                                </p>
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Info Banner */}
                        <div className="p-4 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887] mr-1.5"></div>
                                    <span className="text-xs font-medium text-[#6B4226]">
                                        INVENTORY DETAILS
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-[#5D3A1F] mb-1">
                                    Inventory Item Information
                                </h4>
                                <p className="text-xs text-[#6B4226]/70">
                                    Add a new inventory item with the following
                                    details.
                                </p>
                            </div>
                        </div>

                        {errors.general && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shadow-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Two-column layout for desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left column - Image Upload */}
                            <div className="lg:col-span-1">
                                <div className="flex flex-col items-center p-5 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-md">
                                    <div className="w-32 h-32 mb-4 rounded-full border-2 border-[#DEB887]/50 flex items-center justify-center overflow-hidden bg-white shadow-md group relative">
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Item Preview" 
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10">
                                                <Package className="h-16 w-16 text-[#8B5A2B]/70" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                                                <Upload className="h-5 w-5 text-[#5D3A1F]" />
                                            </div>
                                        </div>
                                    </div>
                                    <label 
                                        htmlFor="image-upload" 
                                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-4 py-2 text-sm font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all cursor-pointer w-full justify-center mt-2 shadow-md"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Upload Photo
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                    />
                                    <p className="mt-3 text-xs text-[#6B4226]/70 text-center">Upload an item photo (optional)</p>

                                    {errors.image && (
                                        <p className={errorClasses}>{errors.image}</p>
                                    )}
                                </div>
                            </div>

                            {/* Right column - Form Fields */}
                            <div className="lg:col-span-2 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="itemName"
                                            className={labelClasses}
                                        >
                                            Item Name*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="itemName"
                                                name="itemName"
                                                value={formData.itemName}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item name"
                                            />
                                            {errors.itemName && (
                                                <p className={errorClasses}>
                                                    {errors.itemName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="itemCode"
                                            className={labelClasses}
                                        >
                                            Item Code*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Barcode className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="itemCode"
                                                name="itemCode"
                                                value={formData.itemCode}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item code"
                                            />
                                            {errors.itemCode && (
                                                <p className={errorClasses}>
                                                    {errors.itemCode}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className={labelClasses}
                                        >
                                            Category*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a category
                                                </option>
                                                <option value="food">
                                                    Food & Beverage
                                                </option>
                                                <option value="housekeeping">
                                                    Housekeeping
                                                </option>
                                                <option value="equipment">
                                                    Equipment
                                                </option>
                                                <option value="amenities">
                                                    Guest Amenities
                                                </option>
                                                <option value="maintenance">
                                                    Maintenance
                                                </option>
                                                <option value="office">
                                                    Office Supplies
                                                </option>
                                            </select>
                                            {errors.category && (
                                                <p className={errorClasses}>
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="quantity"
                                            className={labelClasses}
                                        >
                                            Quantity*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter quantity"
                                            />
                                            {errors.quantity && (
                                                <p className={errorClasses}>
                                                    {errors.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="unit"
                                            className={labelClasses}
                                        >
                                            Unit*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="unit"
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a unit
                                                </option>
                                                <option value="pcs">
                                                    Pieces
                                                </option>
                                                <option value="kg">
                                                    Kilograms
                                                </option>
                                                <option value="g">Grams</option>
                                                <option value="l">
                                                    Liters
                                                </option>
                                                <option value="ml">
                                                    Milliliters
                                                </option>
                                                <option value="boxes">
                                                    Boxes
                                                </option>
                                                <option value="rolls">
                                                    Rolls
                                                </option>
                                                <option value="bottles">
                                                    Bottles
                                                </option>
                                                <option value="packs">
                                                    Packs
                                                </option>
                                            </select>
                                            {errors.unit && (
                                                <p className={errorClasses}>
                                                    {errors.unit}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="minStockLevel"
                                            className={labelClasses}
                                        >
                                            Minimum Stock Level*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="minStockLevel"
                                                name="minStockLevel"
                                                min="0"
                                                value={formData.minStockLevel}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter minimum stock level"
                                            />
                                            {errors.minStockLevel && (
                                                <p className={errorClasses}>
                                                    {errors.minStockLevel}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className={labelClasses}
                                        >
                                            Price*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter price"
                                            />
                                            {errors.price && (
                                                <p className={errorClasses}>
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className={labelClasses}
                                        >
                                            Storage Location
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a location
                                                </option>
                                                <option value="kitchen">
                                                    Kitchen
                                                </option>
                                                <option value="restaurant">
                                                    Restaurant
                                                </option>
                                                <option value="bar">Bar</option>
                                                <option value="storage">
                                                    Main Storage
                                                </option>
                                                <option value="housekeeping">
                                                    Housekeeping Storage
                                                </option>
                                                <option value="maintenance">
                                                    Maintenance Room
                                                </option>
                                                <option value="office">
                                                    Office
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="supplier"
                                            className={labelClasses}
                                        >
                                            Supplier
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Building className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="supplier"
                                                name="supplier"
                                                value={formData.supplier}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a supplier
                                                </option>
                                                <option value="Global Foods Inc.">
                                                    Global Foods Inc.
                                                </option>
                                                <option value="Premier Linens">
                                                    Premier Linens
                                                </option>
                                                <option value="Hotel Essentials Co.">
                                                    Hotel Essentials Co.
                                                </option>
                                                <option value="Luxury Amenities Ltd.">
                                                    Luxury Amenities Ltd.
                                                </option>
                                                <option value="Kitchen Supply Pro">
                                                    Kitchen Supply Pro
                                                </option>
                                                <option value="Office Solutions">
                                                    Office Solutions
                                                </option>
                                                <option value="Maintenance Masters">
                                                    Maintenance Masters
                                                </option>
                                                <option value="Cleaning Supplies Direct">
                                                    Cleaning Supplies Direct
                                                </option>
                                                <option value="Beverage Distributors">
                                                    Beverage Distributors
                                                </option>
                                                <option value="Equipment Specialists">
                                                    Equipment Specialists
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className={labelClasses}
                                        >
                                            Description
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item description"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#DEB887]/30 mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </span>
                                ) : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
