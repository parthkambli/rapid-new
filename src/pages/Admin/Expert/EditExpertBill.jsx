// src/pages/Admin/Experts/EditExpertBill.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from 'react-select';
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const EditExpertBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);

  const [experts, setExperts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorCases, setDoctorCases] = useState([]);
  const [expert, setExpert] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [caseNo, setCaseNo] = useState("");
  const [caseType, setCaseType] = useState("");
  const [stages, setStages] = useState([]);
  const [overallGst, setOverallGst] = useState("");
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState({
    bill: true,
    experts: false,
    doctors: false,
    cases: false,
    saving: false
  });
  const [error, setError] = useState({
    bill: null,
    experts: null,
    doctors: null,
    cases: null
  });

  // Function to fetch cases for the selected expert
  const fetchCasesForExpert = async (expertId) => {
    if (!expertId) return; // Don't fetch if no expert is selected

    setLoading(prev => ({ ...prev, cases: true }));
    setError(prev => ({ ...prev, cases: null }));

    try {
      // Fetch query cases assigned to the selected expert
      const response = await apiClient.get('/query-cases', {
        params: { assignedExpert: expertId } // Filter by assigned expert
      });

      if (response.data.success) {
        const cases = response.data.data || [];

        // If there are cases, auto-populate the first case's doctor, caseNo, and caseType
        if (cases.length > 0) {
          const firstCase = cases[0];

          // Auto-populate caseNo and caseType from the case
          setCaseNo(firstCase.caseNo || "");
          setCaseType(firstCase.caseType || "");

          // Find and set the doctor from doctorsList
          const doctorInCase = doctors.find(d =>
            firstCase.doctorName && d.fullName &&
            firstCase.doctorName.includes(d.fullName)
          );

          if (doctorInCase) {
            setDoctor({
              value: doctorInCase._id,
              label: `${doctorInCase.fullName} ${doctorInCase.doctorId ? `(${doctorInCase.doctorId})` : ''}`
            });
          } else {
            // If doctor not found in the list, set it manually (for cases where doctor name format doesn't match exactly)
            setDoctor({
              value: firstCase.doctorId || "",
              label: firstCase.doctorName || ""
            });
          }
        } else {
          // If no cases found, clear the fields
          setCaseNo("");
          setCaseType("");
          setDoctor(null);
        }
      } else {
        // If API returns success: false, clear the fields
        setCaseNo("");
        setCaseType("");
        setDoctor(null);
        setError(prev => ({ ...prev, cases: response.data.message || "Failed to load cases" }));
      }
    } catch (error) {
      console.error("Error fetching cases for expert:", error);
      // Even if there's an error, clear the case fields
      setCaseNo("");
      setCaseType("");
      setDoctor(null);
      setError(prev => ({ ...prev, cases: error.response?.data?.message || "Error loading cases" }));
    } finally {
      setLoading(prev => ({ ...prev, cases: false }));
    }
  };

  const fetchCasesForDoctor = async (doctorId) => {
    if (!doctorId) return;

    setLoading(prev => ({ ...prev, cases: true }));
    setError(prev => ({ ...prev, cases: null }));

    try {
      const selectedDoctor = doctors.find(d => d._id === doctorId);
      if (!selectedDoctor) {
        setDoctorCases([]);
        return;
      }

      // Fetch cases for the selected doctor using the doctor's name
      const response = await apiClient.get('/query-cases', {
        params: { doctorName: selectedDoctor.fullName }
      });

      if (response.data.success) {
        const cases = response.data.data || [];
        setDoctorCases(cases);

        // Auto-populate the first case if available
        if (cases.length > 0) {
          const firstCase = cases[0];
          setCaseNo(firstCase.caseNo || "");
          setCaseType(firstCase.caseType || "");
        } else {
          setCaseNo("");
          setCaseType("");
        }
      } else {
        setDoctorCases([]);
        setCaseNo("");
        setCaseType("");
        setError(prev => ({ ...prev, cases: response.data.message || "Failed to load cases" }));
      }
    } catch (err) {
      console.error("Error fetching cases for doctor:", err);
      setDoctorCases([]);
      setCaseNo("");
      setCaseType("");
      setError(prev => ({ ...prev, cases: err.response?.data?.message || "Error loading cases" }));
    } finally {
      setLoading(prev => ({ ...prev, cases: false }));
    }
  };

  const fetchFilterData = async () => {
    try {
      // Fetch experts
      setLoading(prev => ({ ...prev, experts: true }));
      const expRes = await apiClient.get(apiEndpoints.experts.list, {
        params: { page: 1, limit: 1000 }
      });
      if (expRes.data.success) {
        setExperts(expRes.data.data || []);
      } else {
        setError(prev => ({ ...prev, experts: expRes.data.message || "Failed to load experts" }));
      }
    } catch (err) {
      console.error("Error fetching experts:", err);
      setError(prev => ({
        ...prev,
        experts: err.response?.data?.message || err.message || "Error loading experts"
      }));
    } finally {
      setLoading(prev => ({ ...prev, experts: false }));
    }

    try {
      // Fetch doctors
      setLoading(prev => ({ ...prev, doctors: true }));
      const docRes = await apiClient.get(apiEndpoints.doctors.list, {
        params: { page: 1, limit: 1000 } // Fetch all doctors
      });
      if (docRes.data.success) {
        setDoctors(docRes.data.data || []);
      } else {
        setError(prev => ({ ...prev, doctors: docRes.data.message || "Failed to load doctors" }));
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(prev => ({
        ...prev,
        doctors: err.response?.data?.message || err.message || "Error loading doctors"
      }));
    } finally {
      setLoading(prev => ({ ...prev, doctors: false }));
    }
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(prev => ({ ...prev, bill: true }));
        const res = await apiClient.get(`${apiEndpoints.expertBills.get}/${id}`);

        if (res.data.success) {
          const bill = res.data.data;

          // Set React Select values
          const selectedExpert = experts.find(exp => exp._id === (bill.expert?._id || bill.expert));
          if (selectedExpert) {
            setExpert({
              value: selectedExpert._id,
              label: selectedExpert.fullName || selectedExpert.name
            });
          } else if (bill.expert?._id || bill.expert) {
            // If expert not found in the list, set it manually (might happen if expert was deleted)
            setExpert({
              value: bill.expert._id || bill.expert,
              label: bill.expert.fullName || bill.expert.name || "Unknown Expert"
            });
          }

          const selectedDoctor = doctors.find(doc => doc._id === (bill.doctor?._id || bill.doctor));
          if (selectedDoctor) {
            setDoctor({
              value: selectedDoctor._id,
              label: `${selectedDoctor.fullName} ${selectedDoctor.doctorId ? `(${selectedDoctor.doctorId})` : ''}`
            });
          } else if (bill.doctor?._id || bill.doctor) {
            // If doctor not found in the list, set it manually (might happen if doctor was deleted)
            setDoctor({
              value: bill.doctor._id || bill.doctor,
              label: bill.doctor.fullName || bill.doctor.name || "Unknown Doctor"
            });
          }

          setCaseNo(bill.caseNo || "");
          setCaseType(bill.caseType || "");
          setStages(bill.stages?.map((s, i) => ({
            id: s._id || Date.now() + i,
            stage: s.stage,
            amount: s.amount,
            gstPercent: s.gstPercent || 18,
          })) || []);
          setOverallGst(bill.overallGst || "");
          setOtherCharges(bill.otherCharges || 0);
          setDiscount(bill.discount || 0);
          setRemark(bill.remark || "");
        } else {
          throw new Error(res.data.message || 'Failed to fetch bill');
        }
      } catch (err) {
        console.error("Error fetching bill:", err);
        setError(prev => ({
          ...prev,
          bill: err.response?.data?.message || err.message || 'Failed to fetch bill'
        }));
      } finally {
        setLoading(prev => ({ ...prev, bill: false }));
      }
    };

    // Fetch filter data first, then fetch bill
    fetchFilterData().then(() => {
      fetchBill();
    });
  }, [id]);

  // Handle expert change - fetch cases when expert is selected
  const handleExpertChange = async (selectedOption) => {
    setExpert(selectedOption);

    // If an expert is selected, fetch their cases
    if (selectedOption) {
      await fetchCasesForExpert(selectedOption.value);
    } else {
      // If expert is cleared, clear the case fields and doctor
      setCaseNo("");
      setCaseType("");
      setDoctor(null);
      setDoctorCases([]);
    }
  };

  // Handle doctor change - fetch cases when doctor is selected
  const handleDoctorChange = async (selectedOption) => {
    setDoctor(selectedOption);

    // Reset case-related fields when doctor changes
    setCaseNo("");
    setCaseType("");
    setDoctorCases([]);

    // If a doctor is selected, fetch their cases
    if (selectedOption) {
      await fetchCasesForDoctor(selectedOption.value);
    }
  };

  const handleCaseNoChange = (selectedOption) => {
    if (selectedOption) {
      setCaseNo(selectedOption.value);
      const found = doctorCases.find(c => c.caseNo === selectedOption.value);
      if (found) setCaseType(found.caseType || "");
    } else {
      setCaseNo("");
      setCaseType("");
    }
  };

  const calculateGstAmt = (amount, gstPercent) => ((amount * gstPercent) / 100).toFixed(2);

  const addStage = () => setStages([...stages, { id: Date.now(), stage: "", amount: 0, gstPercent: 18 }]);

  const removeStage = (id) => {
    if (stages.length <= 1) return alert("At least one stage is required");
    setStages(stages.filter(s => s.id !== id));
  };

  const updateStage = (id, field, value) => {
    setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateTotals = () => {
    let subtotal = 0, gstTotal = 0;
    stages.forEach(s => {
      const amt = parseFloat(s.amount) || 0;
      const gstP = parseFloat(s.gstPercent) || 0;
      subtotal += amt;
      gstTotal += (amt * gstP) / 100;
    });
    if (overallGst && parseFloat(overallGst) > 0) gstTotal = (subtotal * parseFloat(overallGst)) / 100;
    const other = parseFloat(otherCharges) || 0;
    const disc = parseFloat(discount) || 0;
    return { subtotal, gstTotal, other, disc, finalTotal: subtotal + gstTotal + other - disc };
  };

  const { subtotal, gstTotal, other, disc, finalTotal } = calculateTotals();

  const handleUpdate = async () => {
    if (!expert?.value || !doctor?.value || !caseNo || !caseType) return alert("Please fill all required fields");
    const invalidStage = stages.find(s => !s.stage.trim() || parseFloat(s.amount) <= 0);
    if (invalidStage) return alert("Please fill valid stage name and amount");

    try {
      setLoading(prev => ({ ...prev, saving: true }));
      const cleanedStages = stages.map(({ id, ...rest }) => ({
        ...rest,
        amount: parseFloat(rest.amount) || 0,
        gstPercent: parseFloat(rest.gstPercent) || 18
      }));

      const data = {
        expert: expert.value,
        doctor: doctor.value,
        caseNo,
        caseType,
        stages: cleanedStages,
        overallGst: overallGst ? parseFloat(overallGst) : 0,
        otherCharges: parseFloat(otherCharges) || 0,
        discount: parseFloat(discount) || 0,
        remark,
        totals: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          gstTotal: parseFloat(gstTotal.toFixed(2)),
          other: parseFloat(other),
          disc: parseFloat(discount),
          finalTotal: parseFloat(finalTotal.toFixed(2))
        }
      };

      const response = await apiClient.put(`${apiEndpoints.expertBills.update}/${id}`, data);

      if (response.data.success) {
        alert("Expert Bill updated successfully!");
        navigate("/admin/expert-bills");
      } else {
        alert(response.data.message || "Error updating bill");
      }
    } catch (err) {
      console.error("Error updating bill:", err);
      alert(err.response?.data?.message || err.message || "Error updating bill");
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleCancel = () => {
    if (confirm("Cancel editing? Unsaved changes will be lost.")) navigate("/admin/expert-bills");
  };

  if (loading.bill) return <div className="max-w-7xl mx-auto p-6 text-center">Loading bill details...</div>;
  if (error.bill) return <div className="max-w-7xl mx-auto p-6"><div className="bg-red-100 p-4 rounded border border-red-400">{error.bill}</div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/expert-bills")} className="p-2 rounded-full hover:bg-gray-100">←</button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Expert Bill</h1>
            <span className="text-sm text-gray-600">Update expert billing with stage-wise amounts, GST & final total</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expert Name</label>
          <Select
            value={expert}
            onChange={handleExpertChange}
            options={experts.map(exp => ({
              value: exp._id,
              label: exp.fullName || exp.name
            }))}
            isLoading={loading.experts}
            isClearable
            isSearchable
            placeholder={error.experts || "Select or search expert..."}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
          <Select
            value={doctor}
            onChange={handleDoctorChange}
            options={doctors.map(doc => ({
              value: doc._id,
              label: `${doc.fullName} ${doc.doctorId ? `(${doc.doctorId})` : ''}`
            }))}
            isLoading={loading.doctors}
            isClearable
            isSearchable
            placeholder={error.doctors || "Select or search doctor..."}
            className="text-sm"
            isDisabled={loading.doctors}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Case No</label>
          <Select
            value={caseNo ? { value: caseNo, label: caseNo } : null}
            onChange={handleCaseNoChange}
            options={doctorCases.map(caseItem => ({
              value: caseItem.caseNo,
              label: `${caseItem.caseNo} - ${caseItem.id} (${caseItem.queryType})`
            }))}
            isSearchable
            placeholder="Select case..."
            className="text-sm"
            isDisabled={!doctor || loading.cases}
            isLoading={loading.cases}
          />
          {error.cases && !loading.cases && (
            <p className="text-red-500 text-xs mt-1">{error.cases}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
          <select
            value={caseType}
            onChange={e => setCaseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            disabled={!caseNo}
          >
            <option value="">-- Select Case Type --</option>
            <option value="Medicolegal">Medicolegal</option>
            <option value="Insurance Dispute">Insurance Dispute</option>
            <option value="Consent Issue">Consent Issue</option>
            <option value="Consumer Dispute">Consumer Dispute</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Stage-wise Amounts */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Stage wise Amounts</h3>
          <button
            onClick={addStage}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
          >
            Add Stage
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amt (₹)</th>
                <th className="p-3 text-center text-sm font-medium text-gray-700">Remove</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s) => (
                <tr key={s.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <input
                      type="text"
                      value={s.stage}
                      onChange={e => updateStage(s.id, "stage", e.target.value)}
                      placeholder="e.g. Notice/Reply"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.amount}
                      onChange={e => updateStage(s.id, "amount", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.gstPercent}
                      onChange={e => updateStage(s.id, "gstPercent", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{calculateGstAmt(s.amount, s.gstPercent)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeStage(s.id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                      disabled={stages.length <= 1}
                    >
                      {stages.length > 1 ? '×' : '-'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall GST, Other Charges, Discount */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overall GST % (optional)</label>
          <input
            type="number"
            value={overallGst}
            onChange={e => setOverallGst(e.target.value)}
            placeholder="18"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">If set, applies to entire bill instead of individual stages</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges (₹)</label>
          <input
            type="number"
            value={otherCharges}
            onChange={e => setOtherCharges(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtotal</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{subtotal.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Total</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{gstTotal.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Charges</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{other.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            -₹{disc.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Final Total</label>
          <div className="p-2 bg-[#398C89] text-white rounded-md text-right font-bold text-lg">
            ₹{finalTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Remark */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
        <textarea
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder="Enter remarks..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading.saving}
          className="px-6 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
        >
          {loading.saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : "Update Bill"}
        </button>
      </div>
    </div>
  );
};

export default EditExpertBill;