import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import Select from "react-select";

const EditSalesBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingPreviousBill, setFetchingPreviousBill] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const debounceTimerRef = useRef(null);

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

  // Track if this is a new bill creation (vs editing existing bill)
  const isEditing = !!id;
  
  // Store the original status from the fetched bill
  const [originalStatus, setOriginalStatus] = useState("");
  
  // Store the original doctor ID to detect if doctor is changed
  const [originalDoctorId, setOriginalDoctorId] = useState("");
  
  // Store the original doctor name to use in payload
  const [originalDoctorName, setOriginalDoctorName] = useState("");

  // Store the original type and oldSbNo to restore when coming back to original doctor
  const [originalType, setOriginalType] = useState("");
  const [originalOldSbNo, setOriginalOldSbNo] = useState("");

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
          const doctorId = bill.client?.entityId?._id || "";

          // Determine the type based on the bill's status
          const billType = bill.status === 'renewal' || bill.type === 'renewal' ? "Renewal" : "New";

          // Map the sales bill data to form fields
          setFormData({
            sbNo: bill.billNumber || "",
            sbDate: bill.billDate ? new Date(bill.billDate).toISOString().split("T")[0] : today,
            type: billType,
            oldSbNo: bill.renewalFrom || "",
            doctorId: doctorId,
            membershipType: bill.membershipType === 'monthly' ? 'Monthly' : bill.membershipType === 'yearly' ? 'Yearly' : 'One-time',
            membershipYear: bill.items && bill.items.length > 0 ? bill.items[0].quantity?.toString() || "1" : "1",
            particular: bill.items && bill.items.length > 0 ? bill.items[0].description || "" : "",
            amount: bill.items[0].amount?.toString() || "",
            expiry: bill.dueDate ? new Date(bill.dueDate).toISOString().split("T")[0] : "",
            narration: narrationText,
            note: internalNoteText,
          });

          // Store the original status to preserve it during update
          setOriginalStatus(bill.status || "draft");
          
          // Store the original doctor ID to detect changes
          setOriginalDoctorId(doctorId);
          
          // Store the original doctor name to use in payload if doctor is not changed
          if (bill.client?.name) {
            setOriginalDoctorName(bill.client.name);
          }
          
          // Store the original type and oldSbNo to restore when coming back to original doctor
          setOriginalType(billType);
          setOriginalOldSbNo(bill.renewalFrom || "");

          // ✅ Auto-select doctor in react-select
          if (doctorId) {
            // Fetch the specific doctor to populate the select
            try {
              const doctorResponse = await apiClient.get(`${apiEndpoints.doctors.get(doctorId)}?populate=hospitalAddress,membership`);
              if (doctorResponse.data.success) {
                const doctor = doctorResponse.data.data;
                const doctorOption = {
                  value: doctor._id,
                  label: `${doctor.fullName || "No Name"}${doctor.hospitalName ? ` - ${doctor.hospitalName}` : ""}${doctor.membershipId ? ` (${doctor.membershipId})` : ""
                    }${doctor.phoneNumber ? ` 📞 ${doctor.phoneNumber}` : ""
                    }`,
                  doctorData: doctor,
                };
                setSelectedDoctor(doctorOption); // ✅ Pass formatted option, not raw doctor
                // Add to doctorOptions if not already present
                setDoctorOptions(prev => {
                  const exists = prev.find(opt => opt.value === doctor._id);
                  if (exists) return prev;
                  return [doctorOption, ...prev];
                });
              }
            } catch (error) {
              console.error("Error fetching selected doctor:", error);
            }
          }
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

  // ✅ FETCH DOCTORS - Server-side search implementation
  const fetchDoctorsBySearch = useCallback(async (searchQuery = "") => {
    try {
      setLoadingDoctors(true);
      const response = await apiClient.get(apiEndpoints.doctors.list, {
        params: {
          limit: searchQuery ? 50 : 10,
          typeOfEnquiry: "closed",
          populate: "hospitalAddress,membership",
          ...(searchQuery && searchQuery.trim() ? { search: searchQuery.trim() } : {})
        },
      });

      const doctorsData = response.data.data || [];
      setDoctors(doctorsData);

      // ✅ Convert doctors to react-select format
      const options = doctorsData.map((doctor) => ({
        value: doctor._id,
        label: `${doctor.fullName || "No Name"}${doctor.hospitalName ? ` - ${doctor.hospitalName}` : ""}${doctor.membershipId ? ` (${doctor.membershipId})` : ""
          }${doctor.phoneNumber ? ` 📞 ${doctor.phoneNumber}` : ""
          }`,
        doctorData: doctor,
      }));

      setDoctorOptions(options);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors list");
      setDoctorOptions([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // ✅ DEBOUNCED SEARCH HANDLER
  const handleDoctorSearchInputChange = useCallback((value, { action }) => {
    if (action === "input-change") {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchDoctorsBySearch(value);
      }, 500);
    }
  }, [fetchDoctorsBySearch]);

  // Initial load
  useEffect(() => {
    fetchDoctorsBySearch("");
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchDoctorsBySearch]);

  // ✅ YEAR OPTIONS for react-select (40 years)
  const yearOptions = Array.from({ length: 40 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Year${i > 0 ? 's' : ''}`,
  }));

  // ✅ MEMBERSHIP TYPE OPTIONS for react-select
  const membershipTypeOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "One-time", label: "One-time" },
  ];

  // ✅ CUSTOM STYLES FOR REACT-SELECT
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderColor: state.isFocused ? "#398C89" : "#d1d5db",
      backgroundColor: "#f9fafb",
      boxShadow: state.isFocused ? "0 0 0 1px #398C89" : "none",
      "&:hover": {
        borderColor: "#398C89",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#398C89" : state.isFocused ? "#e6f7f7" : "white",
      color: state.isSelected ? "white" : "#333",
      "&:active": {
        backgroundColor: "#2e706e",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1f2937",
    }),
  };

  // ✅ DOCTOR SELECTION HANDLER for react-select
  const handleDoctorSelect = async (selectedOption) => {
    if (!selectedOption) {
      setSelectedDoctor(null);
      setFormData(prev => ({
        ...prev,
        doctorId: "",
        oldSbNo: "",
        type: "New",
      }));
      return;
    }

    const doctorId = selectedOption.value;
    setSelectedDoctor(selectedOption.doctorData);

    // Check if doctor is actually changed (only then fetch previous bill)
    const isDoctorChanged = isEditing && doctorId !== originalDoctorId;
    
    // Check if user came back to the original doctor after changing
    const cameBackToOriginalDoctor = isEditing && doctorId === originalDoctorId;

    // When editing with same doctor OR came back to original doctor, preserve/restore the original type and oldSbNo
    if (cameBackToOriginalDoctor) {
      // Restore original values when coming back to original doctor
      setFormData(prev => ({
        ...prev,
        doctorId: doctorId,
        type: originalType,
        oldSbNo: originalOldSbNo,
      }));
      toast.info(`Restored original bill details`, { autoClose: 2000 });
      return; // Don't check previous bill
    }

    if (isDoctorChanged) {
      // Doctor changed to a different one - reset and fetch previous bill
      setFormData(prev => ({
        ...prev,
        doctorId: doctorId,
        oldSbNo: "",
        type: "New",
      }));
    } else {
      // Same doctor (first time, not changed yet)
      setFormData(prev => ({
        ...prev,
        doctorId: doctorId,
      }));
      return; // Skip checking previous bill for same doctor in edit mode
    }

    setFetchingPreviousBill(true);

    try {
      const response = await apiClient.get(apiEndpoints.salesBills.list, {
        params: {
          "client.entityId._id": doctorId,
          "client.type": "doctor",
          limit: 1,
          sort: "-createdAt",
          status: { $ne: "cancelled" },
        },
      });

      const bills = response.data?.data || [];

      if (bills.length > 0) {
        const latestBill = bills[0];
        // Make sure we're not picking the current bill as previous
        if (latestBill.billNumber !== formData.sbNo) {
          setFormData(prev => ({
            ...prev,
            doctorId: doctorId,
            oldSbNo: latestBill.billNumber || "",
            type: "Renewal",
          }));
          toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
        } else {
          // Current bill is the latest, so it's effectively a "New" type for this doctor
          setFormData(prev => ({
            ...prev,
            doctorId: doctorId,
            oldSbNo: "",
            type: "New",
          }));
          toast.info("No previous bill found (this is the latest)", { autoClose: 2000 });
        }
      } else {
        setFormData(prev => ({
          ...prev,
          doctorId: doctorId,
          oldSbNo: "",
          type: "New",
        }));
        toast.info("New Membership Bill", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Error fetching previous bill:", error);
      toast.warn("Could not check previous bill");
      setFormData(prev => ({ ...prev, doctorId: doctorId }));
    } finally {
      setFetchingPreviousBill(false);
    }
  };

  // ✅ MAIN CHANGE HANDLER for regular inputs (excluding sbNo)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "sbNo") {
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
      
      // Check if doctor is changed
      const isDoctorChanged = isEditing && formData.doctorId !== originalDoctorId;
      
      // Determine doctor name to use in payload
      let doctorName;
      if (isEditing && !isDoctorChanged) {
        // Same doctor - use original name from bill
        doctorName = originalDoctorName;
      } else {
        // Doctor changed or new bill - get from selected options
        const doctorFromList = doctors.find(d => d._id === formData.doctorId);
        const doctorData = selectedDoctor?.doctorData || doctorFromList || selectedDoctor;
        doctorName = doctorData?.fullName || doctorData?.label?.split(' - ')[0] || "Unknown Doctor";
      }

      // When editing:
      // - If doctor is same OR came back to original: preserve original status
      // - If doctor is changed: use the new type's status
      const billStatus = isEditing && !isDoctorChanged
        ? originalStatus
        : (formData.type === "Renewal" ? "renewal" : "draft");

      const payload = {
        // Don't include billNumber in edit mode since it should remain unchanged
        billDate: formData.sbDate,
        membershipType: formData.membershipType === "One-time" ? null : formData.membershipType === "Monthly" ? "monthly" : "yearly",
        dueDate: formData.expiry,
        client: {
          type: "doctor",
          name: doctorName,
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
        paymentTerms: "30_days",
        currency: "INR",
        status: billStatus,
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
            <Select
              name="doctorId"
              options={doctorOptions}
              value={selectedDoctor}
              onChange={handleDoctorSelect}
              onInputChange={handleDoctorSearchInputChange}
              isLoading={loadingDoctors}
              loadingMessage={() => "Searching doctors..."}
              placeholder={loadingDoctors ? "Loading..." : "Search & Select Doctor"}
              isSearchable={true}
              isClearable={true}
              filterOption={() => true}
              noOptionsMessage={() => "No doctors found"}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            <Select
              options={membershipTypeOptions}
              value={membershipTypeOptions.find(option => option.value === formData.membershipType)}
              onChange={(selected) =>
                setFormData(prev => ({ ...prev, membershipType: selected.value }))
              }
              isSearchable={false}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
            <Select
              options={yearOptions}
              value={yearOptions.find(option => option.value === formData.membershipYear)}
              onChange={(selected) =>
                setFormData(prev => ({ ...prev, membershipYear: selected.value }))
              }
              isSearchable={true}
              maxMenuHeight={150}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
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