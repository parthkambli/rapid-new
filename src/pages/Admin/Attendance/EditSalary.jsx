import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const EditSalary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        basicSalary: 0,
        houseRentAllowance: 0,
        conveyanceAllowance: 0,
        medicalAllowance: 0,
        ltaAllowance: 0,
        specialAllowance: 0,
        performanceBonus: 0,
        incentives: 0,
        overtime: 0,
        providentFund: 0,
        professionalTax: 0,
        incomeTax: 0,
        loanDeductions: 0,
        otherDeductions: 0,
        withdrawFrom: "",
        debitTo: "",
        balance: 0,
        paymentStatus: "pending",
        notes: "",
        advanceSalary: []
    });

    const [employeeInfo, setEmployeeInfo] = useState({
        name: "",
        employeeId: "",
        month: "",
        year: ""
    });

    useEffect(() => {
        fetchSalaryData();
    }, [id]);

    const fetchSalaryData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`${apiEndpoints.salaries.list}/${id}`);

            if (response.data.success) {
                const salary = response.data.data;

                // Set employee info
                setEmployeeInfo({
                    name: salary.employee?.fullName || "N/A",
                    employeeId: salary.employee?.employeeId || "N/A",
                    month: salary.month,
                    year: salary.year
                });

                // Set form data
                setFormData({
                    basicSalary: salary.basicSalary || 0,
                    houseRentAllowance: salary.houseRentAllowance || 0,
                    conveyanceAllowance: salary.conveyanceAllowance || 0,
                    medicalAllowance: salary.medicalAllowance || 0,
                    ltaAllowance: salary.ltaAllowance || 0,
                    specialAllowance: salary.specialAllowance || 0,
                    performanceBonus: salary.performanceBonus || 0,
                    incentives: salary.incentives || 0,
                    overtime: salary.overtime || 0,
                    providentFund: salary.providentFund || 0,
                    professionalTax: salary.professionalTax || 0,
                    incomeTax: salary.incomeTax || 0,
                    loanDeductions: salary.loanDeductions || 0,
                    otherDeductions: salary.otherDeductions || 0,
                    withdrawFrom: salary.withdrawFrom || "",
                    debitTo: salary.debitTo || "",
                    balance: salary.balance || 0,
                    paymentStatus: salary.paymentStatus || "pending",
                    notes: salary.notes || "",
                    advanceSalary: salary.advanceSalary || []
                });
            }
        } catch (error) {
            console.error("Error fetching salary data:", error);
            toast.error("Failed to fetch salary details");
            navigate("/admin/salary-management");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'paymentStatus' || name === 'withdrawFrom' || name === 'debitTo' || name === 'notes'
                ? value
                : parseFloat(value) || 0
        }));
    };

    const handleAddAdvanceSalary = () => {
        setFormData(prev => ({
            ...prev,
            advanceSalary: [
                ...prev.advanceSalary,
                { date: new Date().toISOString().split('T')[0], amount: 0, description: "" }
            ]
        }));
    };

    const handleRemoveAdvanceSalary = (index) => {
        setFormData(prev => ({
            ...prev,
            advanceSalary: prev.advanceSalary.filter((_, i) => i !== index)
        }));
    };

    const handleAdvanceSalaryChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            advanceSalary: prev.advanceSalary.map((adv, i) =>
                i === index
                    ? { ...adv, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
                    : adv
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const payload = {
                basicSalary: formData.basicSalary,
                allowances: {
                    houseRentAllowance: formData.houseRentAllowance,
                    conveyanceAllowance: formData.conveyanceAllowance,
                    medicalAllowance: formData.medicalAllowance,
                    ltaAllowance: formData.ltaAllowance,
                    specialAllowance: formData.specialAllowance,
                    performanceBonus: formData.performanceBonus,
                    incentives: formData.incentives
                },
                deductions: {
                    providentFund: formData.providentFund,
                    professionalTax: formData.professionalTax,
                    incomeTax: formData.incomeTax,
                    loanDeductions: formData.loanDeductions,
                    otherDeductions: formData.otherDeductions
                },
                overtime: { amount: formData.overtime },
                withdrawFrom: formData.withdrawFrom,
                debitTo: formData.debitTo,
                balance: formData.balance,
                paymentStatus: formData.paymentStatus,
                notes: formData.notes,
                advanceSalary: formData.advanceSalary
            };

            const response = await apiClient.put(`${apiEndpoints.salaries.list}/${id}`, payload);

            if (response.data.success) {
                toast.success("Salary updated successfully");
                navigate(`/admin/employee/salary/view/${id}`);
            } else {
                toast.error(response.data.message || "Failed to update salary");
            }
        } catch (error) {
            console.error("Error updating salary:", error);
            toast.error(error.response?.data?.message || "Failed to update salary");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/employee/salary/view/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B504E]"></div>
            </div>
        );
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h2 className="text-2xl font-bold mb-6 text-[#1B504E]">
                Edit Salary Record
            </h2>

            {/* Employee Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="font-semibold">Employee Name:</span> {employeeInfo.name}
                    </div>
                    <div>
                        <span className="font-semibold">Employee ID:</span> {employeeInfo.employeeId}
                    </div>
                    <div>
                        <span className="font-semibold">Period:</span> {monthNames[employeeInfo.month - 1]} {employeeInfo.year}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Salary */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Basic Salary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Basic Salary (₹)</label>
                            <input
                                type="number"
                                name="basicSalary"
                                value={formData.basicSalary}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Allowances */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Allowances</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">House Rent Allowance (₹)</label>
                            <input
                                type="number"
                                name="houseRentAllowance"
                                value={formData.houseRentAllowance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Conveyance Allowance (₹)</label>
                            <input
                                type="number"
                                name="conveyanceAllowance"
                                value={formData.conveyanceAllowance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Medical Allowance (₹)</label>
                            <input
                                type="number"
                                name="medicalAllowance"
                                value={formData.medicalAllowance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">LTA (₹)</label>
                            <input
                                type="number"
                                name="ltaAllowance"
                                value={formData.ltaAllowance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Special Allowance (₹)</label>
                            <input
                                type="number"
                                name="specialAllowance"
                                value={formData.specialAllowance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Performance Bonus (₹)</label>
                            <input
                                type="number"
                                name="performanceBonus"
                                value={formData.performanceBonus}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Incentives (₹)</label>
                            <input
                                type="number"
                                name="incentives"
                                value={formData.incentives}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                    </div>
                </div>

                {/* Deductions */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Deductions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Provident Fund (₹)</label>
                            <input
                                type="number"
                                name="providentFund"
                                value={formData.providentFund}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Professional Tax (₹)</label>
                            <input
                                type="number"
                                name="professionalTax"
                                value={formData.professionalTax}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Income Tax (₹)</label>
                            <input
                                type="number"
                                name="incomeTax"
                                value={formData.incomeTax}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Loan Deductions (₹)</label>
                            <input
                                type="number"
                                name="loanDeductions"
                                value={formData.loanDeductions}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Other Deductions (₹)</label>
                            <input
                                type="number"
                                name="otherDeductions"
                                value={formData.otherDeductions}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                    </div>
                </div>

                {/* Overtime */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Overtime</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Overtime Amount (₹)</label>
                            <input
                                type="number"
                                name="overtime"
                                value={formData.overtime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                    </div>
                </div>

                {/* Advance Salary */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[#1B504E]">Advance Salary</h3>
                        <button
                            type="button"
                            onClick={handleAddAdvanceSalary}
                            className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641]"
                        >
                            + Add Entry
                        </button>
                    </div>
                    {formData.advanceSalary.length === 0 ? (
                        <p className="text-gray-500 text-sm">No advance salary entries</p>
                    ) : (
                        <div className="space-y-3">
                            {formData.advanceSalary.map((adv, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={adv.date ? new Date(adv.date).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleAdvanceSalaryChange(index, 'date', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={adv.amount}
                                            onChange={(e) => handleAdvanceSalaryChange(index, 'amount', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={adv.description || ''}
                                            onChange={(e) => handleAdvanceSalaryChange(index, 'description', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAdvanceSalary(index)}
                                            className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Withdraw From</label>
                            <input
                                type="text"
                                name="withdrawFrom"
                                value={formData.withdrawFrom}
                                onChange={handleInputChange}
                                placeholder="Bank name"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Debit To</label>
                            <input
                                type="text"
                                name="debitTo"
                                value={formData.debitTo}
                                onChange={handleInputChange}
                                placeholder="Bank name"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Balance (₹)</label>
                            <input
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Payment Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            >
                                <option value="pending">Pending</option>
                                <option value="processed">Processed</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-[#1B504E]">Notes</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Additional Remarks</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1B504E]"
                            placeholder="Enter any additional notes or remarks..."
                        ></textarea>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641] disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditSalary;
