


// src/pages/Admin/ServicePackageList/CreateServicePackage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const CreateServicePackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    duration: "Yearly",
    year: "",
    amount: "",
    indemnity: "",
    details: "",
    monthlyAmount: "",
    enableMonthly: false,
  });
  const [yearlyCharges, setYearlyCharges] = useState([]);
  const [showYearlyCharges, setShowYearlyCharges] = useState(false);
  const [loading, setLoading] = useState(false);

  const isYearly = formData.duration === "Yearly";

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setFormData({ ...formData, year: selectedYear });

    if (selectedYear) {
      const yearNumber = parseInt(selectedYear);
      if (yearNumber > 1) {
        setShowYearlyCharges(true);
        const charges = [];
        for (let i = 1; i <= yearNumber; i++) {
          charges.push({ year: i, charge: "", description: `Year ${i} Charge` });
        }
        setYearlyCharges(charges);
      } else {
        setShowYearlyCharges(false);
        setYearlyCharges([]);
      }
    } else {
      setShowYearlyCharges(false);
      setYearlyCharges([]);
    }
  };

  const handleYearlyChargeChange = (index, value) => {
    const updated = [...yearlyCharges];
    updated[index].charge = value;
    setYearlyCharges(updated);
  };

  const handleYearlyDescriptionChange = (index, value) => {
    const updated = [...yearlyCharges];
    updated[index].description = value;
    setYearlyCharges(updated);
  };

  const calculateTotalFromYearlyCharges = () => {
    return yearlyCharges.reduce((total, charge) => total + (parseFloat(charge.charge) || 0), 0);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error("Package name is required!");
      return;
    }
    if (!formData.indemnity?.trim()) {
      toast.error("Indemnity cover is required!");
      return;
    }

    let yearlyAmount = 0;
    let monthlyAmt = 0;

    if (isYearly) {
      if (!formData.year) {
        toast.error("Please select validity year!");
        return;
      }
      yearlyAmount = showYearlyCharges
        ? calculateTotalFromYearlyCharges()
        : (parseFloat(formData.amount.replace(/[^\d.]/g, "")) || 0);

      if (yearlyAmount <= 0) {
        toast.error("Please enter a valid yearly amount!");
        return;
      }

      if (formData.enableMonthly) {
        monthlyAmt = parseFloat(formData.monthlyAmount.replace(/[^\d.]/g, "")) || 0;
        if (monthlyAmt <= 0) {
          toast.error("Please enter a valid monthly amount!");
          return;
        }
      }
    } else {
      monthlyAmt = parseFloat(formData.monthlyAmount.replace(/[^\d.]/g, "")) || 0;
      if (monthlyAmt <= 0) {
        toast.error("Please enter monthly amount for monthly package!");
        return;
      }
    }

    setLoading(true);
    try {
      const indemnityNum = parseFloat(formData.indemnity.replace(/[^\d.]/g, "")) || 0;

      const packageData = {
        name: formData.name.trim(),
        indemnity: indemnityNum.toString(),
        details: formData.details || "",
        isMonthly: !isYearly, // Backend knows if it's monthly or yearly
      };

      if (monthlyAmt > 0) {
        packageData.monthlyAmount = monthlyAmt.toString();
      }

      if (isYearly) {
        // Send the year in the format expected by backend: "X Year"
        packageData.year = formData.year; // This is already in the format like "1 Year", "2 Year", etc.
        packageData.amount = yearlyAmount.toString();

        if (showYearlyCharges && yearlyCharges.length > 0) {
          packageData.yearlyCharges = yearlyCharges.map((yc) => ({
            year: yc.year,
            charge: parseFloat(yc.charge || 0).toString(),
            description: yc.description || `Year ${yc.year} Charge`,
          }));
        }
      }

      console.log("Sending Payload:", packageData);

      const response = await apiClient.post(apiEndpoints.servicePackages.createForm, packageData);

      if (response.data.success) {
        toast.success("Service Package Created Successfully!");
        navigate("/admin/service-package-list");
      } else {
        toast.error(response.data.message || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error(error.response?.data?.message || "Error creating package");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel creating package?")) {
      navigate("/admin/service-package-list");
    }
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Create Service Package</h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Name & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter Package Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
            <select
              value={formData.duration}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  duration: val,
                  year: "",
                  amount: "",
                  monthlyAmount: "",
                  enableMonthly: false,
                });
                setShowYearlyCharges(false);
                setYearlyCharges([]);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
            >
              <option value="Yearly">Yearly (Upfront Payment)</option>
              <option value="Monthly">Monthly (Recurring)</option>
            </select>
          </div>
        </div>

        {/* Yearly Fields */}
        {isYearly && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={handleYearChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="">-- Select Year --</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={`${n} Year`}>{n} Year</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (₹) <span className="text-red-500">*</span>
                </label>
                {!showYearlyCharges ? (
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., 12000"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                  />
                ) : (
                  <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                    Calculated: ₹{calculateTotalFromYearlyCharges().toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>

            {showYearlyCharges && (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Year-wise Charges</h3>
                {yearlyCharges.map((yc, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs mb-1">Year {yc.year} Amount</label>
                      <input
                        type="text"
                        value={yc.charge}
                        onChange={(e) => handleYearlyChargeChange(i, e.target.value)}
                        placeholder="Amount"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Description</label>
                      <input
                        type="text"
                        value={yc.description}
                        onChange={(e) => handleYearlyDescriptionChange(i, e.target.value)}
                        placeholder="Optional"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Checkbox for monthly option alongside yearly package */}
            <div className="border-t pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.enableMonthly}
                  onChange={(e) => setFormData({ ...formData, enableMonthly: e.target.checked })}
                  className="w-5 h-5 text-[#398C89] rounded focus:ring-[#398C89]"
                />
                <span className="font-medium text-gray-800">Also offer Monthly Payment Option</span>
              </label>

              {formData.enableMonthly && (
                <div className="mt-4 ml-8 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Amount (₹ per month)
                  </label>
                  <input
                    type="text"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
                    placeholder="e.g., 999"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monthly payment option for this indemnity cover</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Monthly Package */}
        {!isYearly && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Monthly Recurring Package</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Amount (₹ per month) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.monthlyAmount}
                onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
                placeholder="e.g., 999"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#398C89]"
              />
              <p className="text-sm text-gray-600 mt-2">
                Estimated yearly cost: ₹{((parseFloat(formData.monthlyAmount.replace(/[^\d.]/g, "")) || 0) * 12).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indemnity Cover (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.indemnity}
            onChange={(e) => setFormData({ ...formData, indemnity: e.target.value })}
            placeholder="e.g., 1000000"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#398C89]"
          />
          <p className="text-xs text-gray-500 mt-1">Coverage amount for insurance package</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            rows={4}
            placeholder="Package description..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[#398C89]"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button onClick={handleCancel} disabled={loading} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] disabled:opacity-50">
            {loading ? "Saving..." : "Save Package"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePackage;