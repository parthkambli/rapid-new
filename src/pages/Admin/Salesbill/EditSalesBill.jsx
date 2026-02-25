import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const EditSalesBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingPreviousBill, setFetchingPreviousBill] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    sbNo: "",
    sbDate: today,
    type: "New",
    oldSbNo: "",
    doctorId: "",
    membershipType: "Monthly",
    membershipYear: "1",
    particular: "",
    amount: "",
    expiry: "",
    narration: "",
    note: "",
  });

  // Fetch the sales bill data for editing
  useEffect(() => {
    const fetchSalesBill = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.salesBills.get(id));
        
        if (response.data.success) {
          const bill = response.data.data;
          const notesParts = bill.notes ? bill.notes.split(" - ") : [];
const narrationText = notesParts[0]?.trim() || bill.notes || "";
const internalNoteText = notesParts.length > 1 
  ? notesParts.slice(1).join(" - ").trim() 
  : "";
          // Map the sales bill data to form fields
          setFormData({
            sbNo: bill.billNumber || "",
            sbDate: bill.billDate ? new Date(bill.billDate).toISOString().split("T")[0] : today,
            type: bill.status === 'renewal' ? "Renewal" : "New",
            oldSbNo: bill.renewalFrom || "",
            // doctorId: bill.client?.entityId || "",
         doctorId: bill.client?.entityId?._id || "",
            membershipType: bill.membershipType === 'monthly' ? 'Monthly' : bill.membershipType === 'yearly' ? 'Yearly' : 'One-time',
            membershipYear: bill.items && bill.items.length > 0 ? bill.items[0].quantity?.toString() || "1" : "1",
            particular: bill.items && bill.items.length > 0 ? bill.items[0].description || "" : "",
            // amount: bill.totalAmount?.toString() || "",
            amount: bill.items[0].amount?.toString() || "",
            expiry: bill.dueDate ? new Date(bill.dueDate).toISOString().split("T")[0] : "",
           narration: narrationText,
  note: internalNoteText,  // Ab sirf real internal note aayega
          });
        } else {
          toast.error("Failed to fetch sales bill data");
          navigate("/admin/salesbill/list");
        }
      } catch (error) {
        console.error("Error fetching sales bill:", error);
        toast.error(error.response?.data?.message || "Error fetching sales bill");
        navigate("/admin/salesbill/list");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (id) {
      fetchSalesBill();
    }
  }, [id, navigate, today]);

  // Fetch only closed enquiry doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await apiClient.get(apiEndpoints.doctors.list, {
          params: { limit: 1000, typeOfEnquiry: "closed" },
        });
        setDoctors(response.data.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors list");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Main Change Handler (excluding sbNo which should remain disabled)
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "doctorId") {
      if (!value) {
        setFormData(prev => ({
          ...prev,
          doctorId: "",
          oldSbNo: "",
          type: "New",
        }));
        return;
      }

      // Reset first
      setFormData(prev => ({
        ...prev,
        doctorId: value,
        oldSbNo: "",
        type: "New",
      }));

      setFetchingPreviousBill(true);

      try {
        // Correct query to fetch only this doctor's previous bills
        const response = await apiClient.get(apiEndpoints.salesBills.list, {
          params: {
            "client.entityId._id": value,
            "client.type": "doctor",       // Extra safety
            limit: 1,
            sort: "-createdAt",
            status: { $ne: "cancelled" },  // Ignore cancelled bills
          },
        });

        const bills = response.data?.data || [];

        if (bills.length > 0) {
          const latestBill = bills[0];
          setFormData(prev => ({
            ...prev,
            doctorId: value,
            oldSbNo: latestBill.billNumber || "",
            type: "Renewal", // Auto set to Renewal
          }));
          toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
        } else {
          setFormData(prev => ({
            ...prev,
            doctorId: value,
            oldSbNo: "",
            type: "New",
          }));
          toast.info("New Membership Bill", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Error fetching previous bill:", error);
        toast.warn("Could not check previous bill");
        setFormData(prev => ({ ...prev, doctorId: value })); // Still keep doctor
      } finally {
        setFetchingPreviousBill(false);
      }
    } else if (name !== "sbNo") { // Prevent changing sbNo
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add this function inside your component
  const calculateExpiryDate = () => {
    const startDate = new Date(formData.sbDate);
    const years = parseInt(formData.membershipYear) || 1;

    // Add exact 'years' to the date
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + years);

    // Subtract 1 day → so it becomes "1 day before" the anniversary
    expiryDate.setDate(expiryDate.getDate() - 1);

    // Format as YYYY-MM-DD for input[type="date"]
    const formatted = expiryDate.toISOString().split("T")[0];

    // Auto update expiry field
    setFormData(prev => ({ ...prev, expiry: formatted }));
  };

  // Call this whenever sbDate or membershipYear changes
  useEffect(() => {
    if (!initialLoad && formData.sbDate && formData.membershipYear) {
      calculateExpiryDate();
    }
  }, [formData.sbDate, formData.membershipYear, initialLoad]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Please select a Doctor");
    if (!formData.expiry) return toast.error("Please select Expiry date");
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      return toast.error("Please enter valid Amount");

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const years = parseInt(formData.membershipYear, 10) || 1;
      const selectedDoctor = doctors.find(d => d._id === formData.doctorId);

      const payload = {
        // Don't include billNumber in edit mode since it should remain unchanged
        billDate: formData.sbDate,
        membershipType: formData.membershipType === "One-time" ? null : formData.membershipType === "Monthly" ? "monthly" : "yearly",
        dueDate: formData.expiry,
        client: {
          type: "doctor",
          name: selectedDoctor?.fullName || "Unknown Doctor",
          entityId: formData.doctorId,
        },
        type: formData.type.toLowerCase(),                    // "new" | "renewal"
        renewalFrom: formData.type === "Renewal" ? formData.oldSbNo : null,
        items: [
          {
            serviceType: "consultation",
            description:
              formData.particular ||
              `${formData.membershipType} Membership - ${years} Year(s)`,
            quantity: years,
            unitPrice: amount,
            discount: 0,
            taxRate: 0,
            amount: amount,
          },
        ],
        // subTotal: amount,
        // totalAmount: amount,
        // outstandingAmount: amount,
        paymentTerms: "30_days",
        currency: "INR",
        status: formData.type === "Renewal" ? "renewal" : "draft",
        notes: [formData.narration, formData.note].filter(Boolean).join(" - "),
      };

      const response = await apiClient.put(apiEndpoints.salesBills.update(id), payload);

      if (response.data.success) {
        toast.success(`Sales Bill ${formData.type === "Renewal" ? "Renewed" : "Updated"} Successfully!`);
        navigate("/admin/salesbill/list");
      } else {
        toast.error(response.data.message || "Failed to update bill");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Error updating sales bill");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/salesbill/list");

  if (loading && initialLoad) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398C89]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Sales Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SB No</label>
            <input
              type="text"
              name="sbNo"
              value={formData.sbNo}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              placeholder="Auto-generated"
              disabled // Bill number should be disabled in edit mode
            />
            <p className="text-xs text-gray-500 mt-1">Bill number cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SB Date</label>
            <input
              type="date"
              name="sbDate"
              value={formData.sbDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={formData.type}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 font-medium text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Old SB No</label>
            <input
              type="text"
              value={formData.oldSbNo}
              readOnly
              className={`mt-1 p-2 w-full border rounded-md font-medium ${
                formData.oldSbNo
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
              placeholder={formData.oldSbNo ? "" : "None"}
            />
            {fetchingPreviousBill && (
              <p className="text-xs text-blue-600 mt-1">Checking previous bill...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            >
              <option value="">{loadingDoctors ? "Loading..." : "Select Doctor"}</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Membership Type</label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="One-time">One-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years</label>
            <select
              name="membershipYear"
              value={formData.membershipYear}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Particular (Optional)</label>
            <input
              type="text"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              placeholder="Custom description (if any)"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="0.00"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date *
              <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
            </label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              min={today}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-blue-50 font-medium"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Based on {formData.membershipYear} year(s) from {formData.sbDate}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <input
              type="text"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              placeholder="Payment remarks"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Internal Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            placeholder="Any internal notes (not visible to doctor)"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Update Bill"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSalesBill;