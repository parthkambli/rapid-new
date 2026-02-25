// // src/pages/Admin/Advocates/EditAdvocateBill.jsx
import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const EditAdvocateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);
  
  const [advocates, setAdvocates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorCases, setDoctorCases] = useState([]);
  const [advocate, setAdvocate] = useState(null);
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
    advocates: false, 
    doctors: false, 
    cases: false,
    saving: false 
  });
  const [error, setError] = useState({ 
    bill: null, 
    advocates: null, 
    doctors: null, 
    cases: null 
  });

  // Function to fetch cases for a selected doctor
  const fetchCasesForDoctor = async (doctorId) => {
    try {
      setLoading(prev => ({ ...prev, cases: true }));
      setError(prev => ({ ...prev, cases: null }));

      // Find the doctor object to get the name
      const selectedDoctor = doctors.find(d => d._id === doctorId);
      if (!selectedDoctor) {
        console.log("Doctor not found in doctors array:", doctorId);
        setDoctorCases([]);
        return;
      }

      // Fetch cases for the selected doctor using the doctor's name
      const casesResponse = await apiClient.get(apiEndpoints.queryCases.list, {
        params: { doctorName: selectedDoctor.fullName }
      });

      if (casesResponse.data.success) {
        const fetchedCases = casesResponse.data.data || [];
        setDoctorCases(fetchedCases);

        // Auto-fill the first case's details if available
        if (fetchedCases.length > 0) {
          const firstCase = fetchedCases[0];
          setCaseNo(firstCase.caseNo || "");
          setCaseType(firstCase.caseType || "");
        } else {
          // If no cases found for the selected doctor, clear the fields
          setCaseNo("");
          setCaseType("");
        }

        // If this is initial load and we have a caseNo, auto-select it
        if (initialLoadRef.current && caseNo && fetchedCases.length > 0) {
          const foundCase = fetchedCases.find(c => c.caseNo === caseNo);
          if (!foundCase) {
            console.log("Case not found in fetched cases:", caseNo);
          }
        }
      } else {
        setDoctorCases([]);
        setCaseNo("");
        setCaseType("");
        setError(prev => ({ ...prev, cases: casesResponse.data.message || "Failed to load cases" }));
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
      setDoctorCases([]);
      setCaseNo("");
      setCaseType("");
      setError(prev => ({ ...prev, cases: err.response?.data?.message || "Error loading cases" }));
    } finally {
      setLoading(prev => ({ ...prev, cases: false }));
      initialLoadRef.current = false;
    }
  };

  // Fetch advocates and doctors for dropdowns
  const fetchFilterData = async () => {
    try {
      // Fetch advocates
      setLoading(prev => ({ ...prev, advocates: true }));
      const advocatesResponse = await apiClient.get(apiEndpoints.advocates.list, {
        params: { page: 1, limit: 1000 }
      });
      if (advocatesResponse.data.success) {
        setAdvocates(advocatesResponse.data.data || []);

        // Update advocate selection if it was in loading state
        if (advocate && advocate.label === 'Loading...') {
          const selectedAdvocate = advocatesResponse.data.data.find(a => a._id === advocate.value);
          if (selectedAdvocate) {
            setAdvocate({
              value: selectedAdvocate._id,
              label: `${selectedAdvocate.fullName} ${selectedAdvocate.barCouncilNumber ? `(${selectedAdvocate.barCouncilNumber})` : ''}`
            });
          }
        }
      } else {
        setError(prev => ({ ...prev, advocates: advocatesResponse.data.message || "Failed to load advocates" }));
      }
    } catch (err) {
      console.error("Error fetching advocates:", err);
      setError(prev => ({ ...prev, advocates: err.response?.data?.message || "Error loading advocates" }));
    } finally {
      setLoading(prev => ({ ...prev, advocates: false }));
    }

    try {
      // Fetch doctors
      setLoading(prev => ({ ...prev, doctors: true }));
      const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list, {
        params: { page: 1, limit: 1000 }
      });
      if (doctorsResponse.data.success) {
        setDoctors(doctorsResponse.data.data || []);

        // Update doctor selection if it was in loading state
        if (doctor && doctor.label === 'Loading...') {
          const selectedDoctor = doctorsResponse.data.data.find(d => d._id === doctor.value);
          if (selectedDoctor) {
            setDoctor({
              value: selectedDoctor._id,
              label: `${selectedDoctor.fullName} ${selectedDoctor.doctorId ? `(${selectedDoctor.doctorId})` : ''}`
            });
          }
        }

        // After doctors are loaded, if we have a doctor ID, fetch cases
        if (doctor && doctor.value && doctor.label !== 'Loading...') {
          fetchCasesForDoctor(doctor.value);
        }
      } else {
        setError(prev => ({ ...prev, doctors: doctorsResponse.data.message || "Failed to load doctors" }));
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(prev => ({ ...prev, doctors: err.response?.data?.message || "Error loading doctors" }));
    } finally {
      setLoading(prev => ({ ...prev, doctors: false }));
    }
  };

  // Fetch bill data and populate form
  useEffect(() => {
    const fetchBillData = async () => {
      try {
        setLoading(prev => ({ ...prev, bill: true }));
        const response = await apiClient.get(apiEndpoints.advocateBills.get(id));

        if (response.data.success) {
          const billData = response.data.data;

          // Set form values from bill data
          const advocateId = billData.advocate?._id || billData.advocate || "";
          const doctorId = billData.doctor?._id || billData.doctor || "";
          const caseNoValue = billData.caseNo || "";
          const caseTypeValue = billData.caseType || "";

          // Set react-select objects
          // Since advocates and doctors might not be loaded yet, we'll set them after they're loaded
          setCaseNo(caseNoValue);
          setCaseType(caseTypeValue);

          // Set advocate and doctor IDs temporarily, then update when data is loaded
          if (advocateId) {
            const selectedAdvocate = advocates.find(a => a._id === advocateId);
            if (selectedAdvocate) {
              setAdvocate({ value: selectedAdvocate._id, label: `${selectedAdvocate.fullName} ${selectedAdvocate.barCouncilNumber ? `(${selectedAdvocate.barCouncilNumber})` : ''}` });
            } else {
              // If advocates haven't loaded yet, we'll set it later
              setAdvocate({ value: advocateId, label: 'Loading...' });
            }
          }

          if (doctorId) {
            const selectedDoctor = doctors.find(d => d._id === doctorId);
            if (selectedDoctor) {
              setDoctor({ value: selectedDoctor._id, label: `${selectedDoctor.fullName} ${selectedDoctor.doctorId ? `(${selectedDoctor.doctorId})` : ''}` });
            } else {
              // If doctors haven't loaded yet, we'll set it later
              setDoctor({ value: doctorId, label: 'Loading...' });
            }
          }

          // Transform stages to match form structure
          const transformedStages = billData.stages.map((s, index) => ({
            id: s._id || `stage-${index}-${Date.now()}`,
            stage: s.stage || "",
            amount: s.amount || 0,
            gstPercent: s.gstPercent || 18,
            gstAmount: s.gstAmount || 0
          }));
          setStages(transformedStages);

          setOverallGst(billData.overallGst || "");
          setOtherCharges(billData.otherCharges || 0);
          setDiscount(billData.discount || 0);
          setRemark(billData.remark || "");

          // Fetch advocates and doctors for dropdowns
          await fetchFilterData();
        } else {
          setError(prev => ({ ...prev, bill: response.data.message || 'Failed to fetch bill' }));
        }
      } catch (err) {
        console.error('Error fetching bill:', err);
        setError(prev => ({
          ...prev,
          bill: err.response?.data?.message || 'Failed to fetch bill details'
        }));
      } finally {
        setLoading(prev => ({ ...prev, bill: false }));
      }
    };

    fetchBillData();
  }, [id]);

  // Effect to update selected advocate and doctor after data is loaded
  useEffect(() => {
    if (advocate && advocate.label === 'Loading...' && advocates.length > 0) {
      const selectedAdvocate = advocates.find(a => a._id === advocate.value);
      if (selectedAdvocate) {
        setAdvocate({
          value: selectedAdvocate._id,
          label: `${selectedAdvocate.fullName} ${selectedAdvocate.barCouncilNumber ? `(${selectedAdvocate.barCouncilNumber})` : ''}`
        });
      }
    }

    if (doctor && doctor.label === 'Loading...' && doctors.length > 0) {
      const selectedDoctor = doctors.find(d => d._id === doctor.value);
      if (selectedDoctor) {
        setDoctor({
          value: selectedDoctor._id,
          label: `${selectedDoctor.fullName} ${selectedDoctor.doctorId ? `(${selectedDoctor.doctorId})` : ''}`
        });
      }
    }
  }, [advocates, doctors, advocate, doctor]);

  // Handle doctor selection and fetch related cases
  const handleDoctorChange = async (selectedOption) => {
    setDoctor(selectedOption);

    // Reset case-related fields when doctor changes
    setCaseNo("");
    setCaseType("");
    setDoctorCases([]); // Clear previous cases

    // If a doctor is selected, fetch their cases
    if (selectedOption) {
      await fetchCasesForDoctor(selectedOption.value);
    }
  };


  // Rest of the code remains the same...
  // Auto calculate GST Amount per stage
  const calculateGstAmt = (amount, gstPercent) => {
    return ((amount * gstPercent) / 100).toFixed(2);
  };

  // Handle case selection and automatically set case type
  const handleCaseNoChange = (event) => {
    const selectedCaseNo = event.target.value;
    setCaseNo(selectedCaseNo);

    // Find the selected case and automatically set the case type
    const selectedCase = doctorCases.find(c => c.caseNo === selectedCaseNo);
    if (selectedCase) {
      setCaseType(selectedCase.caseType || "");
    }
  };

  // Add new stage
  const addStage = () => {
    const newStage = {
      id: Date.now(),
      stage: "",
      amount: 0,
      gstPercent: 18,
    };
    setStages([...stages, newStage]);
  };

  // Remove stage
  const removeStage = (id) => {
    if (stages.length <= 1) {
      alert("At least one stage is required");
      return;
    }
    setStages(stages.filter(s => s.id !== id));
  };

  // Update stage
  const updateStage = (id, field, value) => {
    setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Calculate Totals
  const calculateTotals = () => {
    let subtotal = 0;
    let gstTotal = 0;

    stages.forEach(s => {
      const amount = parseFloat(s.amount) || 0;
      const gstPercent = parseFloat(s.gstPercent) || 0;
      subtotal += amount;
      gstTotal += (amount * gstPercent) / 100;
    });

    // Apply Overall GST if set
    if (overallGst && parseFloat(overallGst) > 0) {
      gstTotal = (subtotal * parseFloat(overallGst)) / 100;
    }

    const other = parseFloat(otherCharges) || 0;
    const disc = parseFloat(discount) || 0;
    const finalTotal = subtotal + gstTotal + other - disc;

    return { subtotal, gstTotal, other, disc, finalTotal };
  };

  const { subtotal, gstTotal, other, disc, finalTotal } = calculateTotals();

  // Handle Update
  const handleUpdate = async () => {
    // Validate required fields
    if (!advocate) {
      alert("Please select an Advocate");
      return;
    }
    if (!doctor) {
      alert("Please select a Doctor");
      return;
    }
    if (!caseNo) {
      alert("Please select a Case No");
      return;
    }
    if (!caseType) {
      alert("Please select a Case Type");
      return;
    }

    // Validate stages - ensure all stages have required fields
    const invalidStage = stages.find(s => !s.stage || !s.stage.trim());
    if (invalidStage) {
      alert("Please fill in the stage name for all stages");
      return;
    }

    // Validate stage amounts
    const invalidAmount = stages.find(s => !s.amount || parseFloat(s.amount) <= 0);
    if (invalidAmount) {
      alert("Please enter valid amount (greater than 0) for all stages");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, saving: true }));

      // Remove the 'id' field from stages before sending to backend
      const cleanedStages = stages.map(({ id, ...rest }) => ({
        ...rest,
        amount: parseFloat(rest.amount) || 0,
        gstPercent: parseFloat(rest.gstPercent) || 0
      }));

      const billData = {
        advocate: advocate.value,
        doctor: doctor.value,
        caseNo,
        caseType,
        stages: cleanedStages,
        overallGst: overallGst ? parseFloat(overallGst) : 0,
        otherCharges: parseFloat(otherCharges) || 0,
        discount: parseFloat(discount) || 0,
        remark: remark || "",
        totals: {
          subtotal,
          gstTotal,
          other,
          disc,
          finalTotal
        }
      };

      const response = await apiClient.put(
        apiEndpoints.advocateBills.update(id),
        billData
      );

      if (response.data.success) {
        alert("Advocate Bill updated successfully!");
        navigate("/admin/advocate-bills");
      } else {
        alert(`Error: ${response.data.message || 'Failed to update advocate bill'}`);
      }
    } catch (error) {
      console.error("Error updating advocate bill:", error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while updating the advocate bill';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes? This will reload the original bill data.")) {
      window.location.reload();
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate("/admin/advocate-bills");
    }
  };

  // Loading state
  if (loading.bill) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398C89] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bill details...</p>
      </div>
    );
  }

  // Error state
  if (error.bill) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <strong>Error:</strong> {error.bill}
        </div>
        <button
          onClick={() => navigate("/admin/advocate-bills")}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Bills
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/advocate-bills")}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Back to Bills"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Advocate Bill</h1>
            <span className="text-sm text-gray-600">
              Update advocate billing with stage-wise amounts, GST & final total
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Bill ID: {id.substring(0, 8)}...
        </div>
      </div>

      {/* Top Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Advocate Name <span className="text-red-500">*</span>
          </label>
          <Select
            value={advocate}
            onChange={setAdvocate}
            options={advocates.map(adv => ({
              value: adv._id,
              label: `${adv.fullName} ${adv.barCouncilNumber ? `(${adv.barCouncilNumber})` : ''}`
            }))}
            isLoading={loading.advocates}
            isClearable
            isSearchable
            placeholder={error.advocates ? error.advocates : "Select or search advocate..."}
            className="text-sm"
            isDisabled={loading.advocates}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor Name <span className="text-red-500">*</span>
          </label>
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
            placeholder={error.doctors ? error.doctors : "Select or search doctor..."}
            className="text-sm"
            isDisabled={loading.doctors}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case No <span className="text-red-500">*</span>
          </label>
          {loading.cases ? (
            <Select
              isDisabled
              isLoading
              placeholder="Loading cases..."
              className="text-sm"
            />
          ) : error.cases ? (
            <Select
              isDisabled
              placeholder={error.cases}
              className="text-sm"
            />
          ) : doctor && doctor.value ? (
            <Select
              value={{ value: caseNo, label: caseNo }}
              onChange={(selectedOption) => {
                setCaseNo(selectedOption.value);
                // Find the selected case and automatically set the case type
                const selectedCase = doctorCases.find(c => c.caseNo === selectedOption.value);
                if (selectedCase) {
                  setCaseType(selectedCase.caseType || "");
                }
              }}
              options={doctorCases.map(caseItem => ({
                value: caseItem.caseNo,
                label: `${caseItem.caseNo} ${caseItem.id ? `(${caseItem.id})` : ''} - ${caseItem.queryType || ''}`
              }))}
              isSearchable
              placeholder="Select case..."
              className="text-sm"
            />
          ) : (
            <input
              type="text"
              value={caseNo}
              onChange={e => setCaseNo(e.target.value)}
              placeholder="Select doctor first to see cases"
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
              disabled={true}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case Type <span className="text-red-500">*</span>
          </label>
          <select
            value={caseType}
            onChange={e => setCaseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            disabled={!caseNo}
          >
            <option value="">-- Select Case Type --</option>
            <option value="Civil">Civil</option>
            <option value="Criminal">Criminal</option>
            <option value="Consumer">Consumer</option>
          </select>
        </div>
      </div>

      {/* Stage-wise Amounts */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Stage wise Amounts</h3>
          <span className="text-xs text-gray-600">
            Add multiple stages (e.g. Notice, Filing, Hearing, Judgment)
          </span>
          <button
            onClick={addStage}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
            disabled={loading.saving}
          >
            <span>+ Add Stage</span>
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-700">#</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amt (₹)</th>
                <th className="p-3 text-center text-sm font-medium text-gray-700">Remove</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s, index) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-500">{index + 1}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={s.stage}
                      onChange={e => updateStage(s.id, "stage", e.target.value)}
                      placeholder="e.g. Notice/Reply"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      disabled={loading.saving}
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
                      disabled={loading.saving}
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
                      disabled={loading.saving}
                    />
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{calculateGstAmt(s.amount, s.gstPercent)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeStage(s.id)}
                      className="text-red-600 hover:text-red-800 text-xl disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={loading.saving || stages.length <= 1}
                      title={stages.length <= 1 ? "At least one stage is required" : "Remove stage"}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stages.length === 0 && (
          <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg mt-2">
            No stages added. Click "Add Stage" to add billing stages.
          </div>
        )}

        <p className="text-xs text-gray-600 mt-2">
          <strong>Note:</strong> Enter GST at stage-level or change overall GST percent below (if you want one GST for whole bill)
        </p>
      </div>

      {/* Overall GST, Other Charges, Discount */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall GST % (optional)
          </label>
          <input
            type="number"
            value={overallGst}
            onChange={e => setOverallGst(e.target.value)}
            placeholder="18"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
            disabled={loading.saving}
          />
          <p className="text-xs text-gray-600 mt-1">
            If set (&gt;0), final totals will use this GST % applied on subtotal instead of summing stage GSTs.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Other Charges (₹)
          </label>
          <input
            type="number"
            value={otherCharges}
            onChange={e => setOtherCharges(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
            disabled={loading.saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (₹)
          </label>
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            step="0.01"
            disabled={loading.saving}
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
            ₹{other}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            -₹{disc}
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
          placeholder="Enter remarks or billing notes..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
          disabled={loading.saving}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading.saving}
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading.saving}
        >
          Reset
        </button>
        <button
          onClick={handleUpdate}
          className="px-6 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={loading.saving}
        >
          {loading.saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Updating...
            </>
          ) : (
            'Update Bill'
          )}
        </button>
      </div>

      {/* Validation Errors */}
      {!advocate && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          <strong>Note:</strong> Please select an advocate before updating.
        </div>
      )}
    </div>
  );
};

export default EditAdvocateBill;