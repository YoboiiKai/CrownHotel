import React from 'react';
import { Edit, X, Users, Building2, Clock, CalendarDays, FileText } from 'lucide-react';

function UpdateEmployeeScheduleModal({
    isOpen,
    onClose,
    onSubmit,
    newSchedule,
    handleInputChange,
    employees,
    departments,
    errors,
    submitLoading,
    formRef
}) {
    if (!isOpen) return null;

    // Styling classes consistent with AddAdminModal
    const inputClasses = "w-full rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-[#6B4226]/50 shadow-sm";
    const selectClasses = "w-full rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all shadow-sm";
    const labelClasses = "block text-sm font-medium text-[#5D3A1F] mb-1.5";
    const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5A2B]";
    const errorClasses = "text-xs text-red-600 mt-1.5 font-medium";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                            <Edit className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Update Schedule</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={onSubmit} ref={formRef} className="space-y-6">
                        {/* Info Banner */}
                        <div className="p-4 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                            </div>
                            <div className="relative z-10 flex items-start gap-3">
                                <div className="rounded-full p-2 bg-[#A67C52]/20 text-[#A67C52]">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#5D3A1F]">Update Employee Schedule</h3>
                                    <p className="text-sm text-[#6B4226]/70 mt-1">
                                        Modify the existing schedule by updating the employee, department, date, or shift details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Employee Selection */}
                            <div>
                                <label htmlFor="employee_id" className={labelClasses}>Employee</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <select
                                        id="employee_id"
                                        name="employee_id"
                                        value={newSchedule.employee_id}
                                        onChange={handleInputChange}
                                        className={`${selectClasses} pl-10 ${errors.employee_id ? 'border-red-300 ring-red-100' : ''}`}
                                    >
                                        <option value="">Select an employee</option>
                                        {employees && employees.length > 0 ? employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} - {employee.position}
                                            </option>
                                        )) : null}
                                    </select>
                                    {errors.employee_id && (
                                        <p className={errorClasses}>{errors.employee_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Department Selection */}
                            <div>
                                <label htmlFor="department_id" className={labelClasses}>Department</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <select
                                        id="department_id"
                                        name="department_id"
                                        value={newSchedule.department_id}
                                        onChange={handleInputChange}
                                        className={`${selectClasses} pl-10 ${errors.department_id ? 'border-red-300 ring-red-100' : ''}`}
                                    >
                                        <option value="">Select a department</option>
                                        {departments && departments.length > 0 ? departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        )) : null}
                                    </select>
                                    {errors.department_id && (
                                        <p className={errorClasses}>{errors.department_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <label htmlFor="date" className={labelClasses}>Schedule Date</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={newSchedule.date}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} pl-10 ${errors.date ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.date && (
                                        <p className={errorClasses}>{errors.date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Shift Type Selection */}
                            <div>
                                <label htmlFor="shift_type" className={labelClasses}>Shift Type</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <select
                                        id="shift_type"
                                        name="shift_type"
                                        value={newSchedule.shift_type}
                                        onChange={handleInputChange}
                                        className={`${selectClasses} pl-10 ${errors.shift_type ? 'border-red-300 ring-red-100' : ''}`}
                                    >
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                        <option value="evening">Evening</option>
                                        <option value="night">Night</option>
                                    </select>
                                    {errors.shift_type && (
                                        <p className={errorClasses}>{errors.shift_type}</p>
                                    )}
                                </div>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label htmlFor="start_time" className={labelClasses}>Start Time</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="time"
                                        id="start_time"
                                        name="start_time"
                                        value={newSchedule.start_time}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} pl-10 ${errors.start_time ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.start_time && (
                                        <p className={errorClasses}>{errors.start_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* End Time */}
                            <div>
                                <label htmlFor="end_time" className={labelClasses}>End Time</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="time"
                                        id="end_time"
                                        name="end_time"
                                        value={newSchedule.end_time}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} pl-10 ${errors.end_time ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.end_time && (
                                        <p className={errorClasses}>{errors.end_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes (spans full width) */}
                            <div className="md:col-span-2">
                                <label htmlFor="notes" className={labelClasses}>Notes (Optional)</label>
                                <div className="relative">
                                    <div className={iconWrapperClasses}>
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows="3"
                                        value={newSchedule.notes}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="Add any additional notes or instructions here..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#DEB887]/30 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitLoading}
                                className="px-4 py-2.5 text-sm font-medium text-[#5D3A1F] bg-white border border-[#DEB887]/50 rounded-lg shadow-sm hover:bg-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-300 disabled:opacity-70"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                            >
                                {submitLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : "Update Schedule"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateEmployeeScheduleModal;