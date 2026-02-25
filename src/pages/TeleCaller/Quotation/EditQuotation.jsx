
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedYears, setSelectedYears] = useState([]);
  const [priceMatrix, setPriceMatrix] = useState([]);

  const [formData, setFormData] = useState({
    trno: '',
    quotationDate: new Date().toISOString().split('T')[0],
    doctorId: '',
    doctorName: '',
    membershipType: 'INDIVIDUAL MEMBERSHIP',
    specialization: '',
    area: 'All India',
    narration: '',
    monthly: false,
    indemnityCover: false,
    beds: 'N/A',
  });

  // FETCH DOCTORS ONLY (NO PACKAGES NEEDED)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await apiClient.get(apiEndpoints.doctors.dropdown || '/doctors', { params: { limit: 1000 } });
        setDoctors(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Helper function to normalize names for matching
  const normalizeName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/dr\.?/gi, '')
      .replace(/[^\w\s&]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  };

  // Helper function to find doctor in dropdown
  const findDoctorInDropdown = (doctorsList, requesterName, entityId) => {
    // First try by entityId
    if (entityId) {
      const idToMatch = typeof entityId === 'object' ? entityId._id : entityId;
      const doctorById = doctorsList.find(d => d._id === idToMatch);
      if (doctorById) return doctorById;
    }

    // If no ID or not found by ID, try by name matching
    if (requesterName) {
      const normalizedRequesterName = normalizeName(requesterName);

      // Try exact match first
      const exactMatch = doctorsList.find(d =>
        normalizeName(d.fullName) === normalizedRequesterName ||
        d.fullName === requesterName
      );
      if (exactMatch) return exactMatch;

      // Try partial match
      const partialMatch = doctorsList.find(d =>
        normalizedRequesterName.includes(normalizeName(d.fullName)) ||
        normalizeName(d.fullName).includes(normalizedRequesterName)
      );
      if (partialMatch) return partialMatch;

      // Try case-insensitive contains
      const containsMatch = doctorsList.find(d =>
        requesterName.toLowerCase().includes(d.fullName.toLowerCase()) ||
        d.fullName.toLowerCase().includes(requesterName.toLowerCase())
      );
      if (containsMatch) return containsMatch;
    }

    return null;
  };

  // FETCH QUOTATION + AUTO SELECT DOCTOR
  useEffect(() => {
    if (loadingDoctors || doctors.length === 0) return;

    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(apiEndpoints.quotations.get(id));
        const q = res.data.data;

        // ✅ FIXED: Correctly derive the entity ID whether it's populated or not
        const entityIdRaw = q.requester?.entityId;
        const entityId = (entityIdRaw && typeof entityIdRaw === 'object') ? entityIdRaw._id : entityIdRaw;
        const requesterName = q.requester?.name?.trim() || '';

        // Find matching doctor from dropdown
        const matchedDoctor = findDoctorInDropdown(doctors, requesterName, entityId);

        // Update form data with quotation data
        setFormData(prev => ({
          ...prev,
          trno: q.trno || '',
          quotationDate: q.quotationDate?.split('T')[0] || new Date().toISOString().split('T')[0],
          area: q.area || 'All India',
          narration: q.requestDetails?.additionalRequirements || '',
          monthly: q.requestDetails?.paymentFrequency === 'monthly',
          indemnityCover: !!q.requestDetails?.specialConditions,
        }));

        setSelectedYears((q.requestDetails?.policyTerms || []).map(y => y.toString()));

        // If we found a matching doctor
        if (matchedDoctor) {
          const dropdownValue = `${matchedDoctor.fullName} (${matchedDoctor.doctorId})`;
          const isHospital = ['hospital', 'hospital_individual'].includes(matchedDoctor.doctorType);
          const mType = matchedDoctor.doctorType === 'hospital'
            ? 'HOSPITAL MEMBERSHIP'
            : matchedDoctor.doctorType === 'hospital_individual'
              ? 'HOSPITAL + INDIVIDUAL MEMBERSHIP'
              : 'INDIVIDUAL MEMBERSHIP';

          if (isHospital) {
            try {
              const fullRes = await apiClient.get(`/doctors/${matchedDoctor._id}`);
              const fullDoc = fullRes.data.data;
              setFormData(prev => ({
                ...prev,
                doctorId: matchedDoctor._id,
                doctorName: dropdownValue, // Use dropdown format
                membershipType: mType,
                specialization: fullDoc.hospitalDetails?.hospitalType || 'Not Specified',
                beds: fullDoc.hospitalDetails?.beds || 'Not Specified'
              }));
            } catch {
              setFormData(prev => ({
                ...prev,
                doctorId: matchedDoctor._id,
                doctorName: dropdownValue, // Use dropdown format
                membershipType: mType,
                specialization: 'Hospital',
                beds: 'Not Specified'
              }));
            }
          } else {
            setFormData(prev => ({
              ...prev,
              doctorId: matchedDoctor._id,
              doctorName: dropdownValue, // Use dropdown format
              membershipType: mType,
              specialization: matchedDoctor.specialization?.join(', ') || 'General Practitioner',
              beds: 'N/A'
            }));
          }
        } else {
          // If no doctor matched, set the requester name as is
          // But we need to format it for dropdown if possible
          if (requesterName && doctors.length > 0) {
            // Try to create a dropdown-like format
            const dropdownValue = `${requesterName} (Not in List)`;
            setFormData(prev => ({
              ...prev,
              doctorName: dropdownValue
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              doctorName: requesterName || 'Select Doctor/Hospital'
            }));
          }
        }

        // LOAD SAVED PRICE MATRIX
        const items = q.requestDetails?.items || [];
        const matrix = items.map((item, idx) => ({
          id: item._id || `saved_${idx}_${Date.now()}`,
          packageId: item.packageId || null, // ✅ CAPTURE PACKAGE ID
          indemnity: item.indemnity || 'Custom Limit',
          monthly: item.monthly || null,
          ...(q.requestDetails?.policyTerms || []).reduce((acc, y) => ({
            ...acc,
            [`y${y}`]: item[`year_${y}`] || null
          }), {})
        }));

        setPriceMatrix(matrix.length > 0 ? matrix : []);
      } catch (err) {
        console.error('Error fetching quotation:', err);
        toast.error('Failed to load quotation');
        navigate('/telecaller/quotation-list');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuotation();
  }, [id, navigate, doctors, loadingDoctors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'doctorName') {
      const selectedDoctor = doctors.find(d => `${d.fullName} (${d.doctorId})` === value);
      if (selectedDoctor) {
        const isHospital = ['hospital', 'hospital_individual'].includes(selectedDoctor.doctorType);
        const mType = selectedDoctor.doctorType === 'hospital'
          ? 'HOSPITAL MEMBERSHIP'
          : selectedDoctor.doctorType === 'hospital_individual'
            ? 'HOSPITAL + INDIVIDUAL MEMBERSHIP'
            : 'INDIVIDUAL MEMBERSHIP';

        setFormData(prev => ({
          ...prev,
          doctorId: selectedDoctor._id,
          doctorName: value,
          membershipType: mType,
          specialization: 'Loading...',
          beds: isHospital ? 'Loading...' : 'N/A'
        }));

        if (isHospital) {
          apiClient.get(`/doctors/${selectedDoctor._id}`)
            .then(res => {
              const d = res.data.data;
              setFormData(prev => ({
                ...prev,
                specialization: d.hospitalDetails?.hospitalType || 'Not Specified',
                beds: d.hospitalDetails?.beds || 'Not Specified'
              }));
            })
            .catch(() => {
              setFormData(prev => ({ ...prev, specialization: 'Hospital', beds: 'Not Specified' }));
            });
        } else {
          setFormData(prev => ({
            ...prev,
            specialization: selectedDoctor.specialization?.join(', ') || 'General Practitioner',
            beds: 'N/A'
          }));
        }
      } else {
        // If doctor not found in list (like "Not in List" option)
        setFormData(prev => ({
          ...prev,
          doctorId: '',
          doctorName: value,
          membershipType: 'INDIVIDUAL MEMBERSHIP',
          specialization: '',
          beds: 'N/A'
        }));
      }
    }
    else if (name.startsWith('year_')) {
      const year = name.split('_')[1];
      setSelectedYears(prev =>
        prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
      );
    }
    else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handlePreview = () => {
    if (!formData.doctorName || selectedYears.length === 0) {
      toast.error('Complete doctor and years');
      return;
    }
    setIsPreview(true);
  };

  const handleGeneratePDF = () => {
    if (!formData.doctorId || priceMatrix.length === 0) {
      toast.error('Complete form first');
      return;
    }

    const dataToPass = {
      membershipType: formData.membershipType,
      doctorData: { name: formData.doctorName.split(' (')[0].trim() },
      hospitalData: { name: formData.doctorName.split(' (')[0].trim(), address: formData.area || 'All India' },
      membershipData: {
        membershipType: formData.membershipType,
        specialization: formData.specialization || 'All Specializations',
        numberOfBeds: formData.beds !== 'N/A' ? formData.beds : 'Not Specified',
        priceMatrix: priceMatrix.map(row => ({
          indemnity: row.indemnity || 'Custom Limit',
          monthly: row.monthly,
          y1: row.y1,
          y5: row.y5,
        }))
      }
    };

    navigate(`/telecaller/quotation/${id}/`, { state: dataToPass });
  };

  const handleUpdate = async () => {
    if (priceMatrix.length === 0) {
      toast.error('Add at least one pricing row');
      return;
    }

    console.log('🔍 UPDATE_DATA_CHECK:', {
      doctorName: formData.doctorName,
      doctorId: formData.doctorId,
      membershipType: formData.membershipType
    });

    setSaving(true);

    // Extract doctor name properly
    let doctorName = '';

    if (formData.doctorName) {
      if (formData.doctorName.includes('(') && formData.doctorName.includes(')')) {
        doctorName = formData.doctorName.split('(')[0].trim();
      } else {
        doctorName = formData.doctorName.trim();
      }
    }

    if (!doctorName && formData.doctorId) {
      const doctor = doctors.find(d => d._id === formData.doctorId);
      if (doctor) {
        doctorName = doctor.fullName || doctor.name || '';
      }
    }

    if (!doctorName) {
      doctorName = "Doctor Name";
    }

    // ✅ FIXED: Determine requester type - Align with CreateQuotation logic
    let requesterType = 'doctor';

    if (formData.membershipType === "INDIVIDUAL MEMBERSHIP") {
      requesterType = 'doctor';
    }
    else if (formData.membershipType === "HOSPITAL MEMBERSHIP") {
      requesterType = 'hospital';
    }
    else if (formData.membershipType && (formData.membershipType.includes('HOSPITAL') && formData.membershipType.includes('INDIVIDUAL'))) {
      requesterType = 'hospital_individual';

      // Update narration if combined
      if (!formData.narration?.includes('Combined Membership')) {
        formData.narration = formData.narration ;
      }
    }

    console.log('🎯 REQUESTER_TYPE_SELECTED:', requesterType);

    // Prepare items array
    const items = priceMatrix.map(row => {
      const item = {
        packageId: row.packageId || null // ✅ INCLUDE PACKAGE ID
      };

      // Handle indemnity field
      if (row.indemnity !== null && row.indemnity !== undefined) {
        if (typeof row.indemnity === 'string') {
          item.indemnity = row.indemnity.trim();
        } else if (typeof row.indemnity === 'number') {
          item.indemnity = String(row.indemnity);
        } else {
          item.indemnity = String(row.indemnity);
        }
      } else {
        item.indemnity = 'Custom Limit';
      }

      // Add year prices
      selectedYears.forEach(y => {
        const yearKey = `y${y}`;
        const val = row[yearKey];
        if (val != null && val !== '' && !isNaN(Number(val))) {
          item[`year_${y}`] = Number(val);
        }
      });

      // Add monthly if applicable
      if (formData.monthly && row.monthly != null && row.monthly !== '' && !isNaN(Number(row.monthly))) {
        item.monthly = Number(row.monthly);
      }

      return item;
    }).filter(item => {
      const hasValue = selectedYears.some(y => item[`year_${y}`] !== undefined) ||
        (formData.monthly && item.monthly !== undefined);
      return hasValue;
    });

    const payload = {
      trno: formData.trno || undefined,
      requester: {
        type: requesterType,
        name: doctorName,
        entityId: formData.doctorId || null, // ✅ SEND NULL IF NOT FOUND RATHER THAN UNDEFINED TO BE EXPLICIT
      },
      requestDetails: {
        policyTerms: selectedYears.map(Number),
        paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
        additionalRequirements: formData.narration || '',
        specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
        numberOfBeds: formData.beds !== 'N/A' && formData.beds !== 'Not Specified' && !isNaN(Number(formData.beds)) ? Number(formData.beds) : undefined,
        items: items
      }
    };

    console.log('🚀 SENDING_PAYLOAD:', payload);

    try {
      const response = await apiClient.put(apiEndpoints.quotations.update(id), payload);
      console.log('✅ UPDATE_RESPONSE:', response.data);
      toast.success('Quotation updated successfully!');
      navigate('/telecaller/quotation-list');
    } catch (err) {
      console.error('❌ UPDATE_ERROR:', {
        error: err,
        response: err.response?.data,
        payload: payload
      });
      toast.error(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingDoctors) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-16 h-16 border-8 border-[#15BBB3] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Edit Quotation</h1>

        <form onSubmit={e => e.preventDefault()} className="space-y-8">

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">TRNO (Optional)</label>
              <input type="text" name="trno" value={formData.trno} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor / Hospital</label>
              <select
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              >
                <option value="">Select Doctor/Hospital</option>
                {doctors.map(d => (
                  <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
                    {d.fullName} ({d.doctorId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
              <input type="date" name="quotationDate" value={formData.quotationDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership Type</label>
              <input type="text" value={formData.membershipType} disabled className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization / Hospital Type</label>
              <input type="text" value={formData.specialization} disabled className="mt-1 block w-full border border-gray-300 rounded-md p-3 bg-gray-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <textarea name="narration" value={formData.narration} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-3"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Membership Years</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                <label key={y} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name={`year_${y}`} checked={selectedYears.includes(y.toString())} onChange={handleChange} className="w-5 h-5 accent-[#15BBB3] rounded" />
                  <span className="text-sm font-medium">{y} Year</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange} className="w-5 h-5 accent-[#15BBB3]" />
              <span className="font-medium">Monthly Payment</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange} className="w-5 h-5 accent-[#15BBB3]" />
              <span className="font-medium">Indemnity Cover Required</span>
            </label>
          </div>

          {/* PREVIEW + GENERATE PDF */}
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={handlePreview} className="bg-[#15BBB3] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#13a89e]">
              Preview Changes
            </button>
            <button type="button" onClick={handleGeneratePDF} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700">
              Generate PDF
            </button>
          </div>
        </form>

        {isPreview && (
          <div className="mt-12 border-t-2 border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview & Save Changes</h2>
            <PricePreviewTable
              membershipType={formData.membershipType}
              selectedYears={selectedYears}
              showMonthly={formData.monthly}
              specialization={formData.specialization}
              beds={formData.beds}
              initialMatrix={priceMatrix}
              setPriceMatrix={setPriceMatrix}
              onEdit={() => setIsPreview(false)}
              onSave={handleUpdate}
              saving={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// SIMPLE PRICE TABLE - ONLY SHOWS SAVED DATA (NO FRESH LOAD)
const PricePreviewTable = ({ membershipType, selectedYears, showMonthly, specialization, beds, initialMatrix = [], setPriceMatrix, onEdit, onSave, saving }) => {
  const [rows, setRows] = useState(initialMatrix);
  const isHospital = membershipType.includes('HOSPITAL');

  const formatNumber = (num) => (num == null || num === '') ? '' : Number(num).toLocaleString('en-IN');
  const parseNumber = (str) => str === '' ? null : Number(str.replace(/,/g, ''));

  useEffect(() => {
    if (initialMatrix.length > 0 && rows.length === 0) {
      setRows(initialMatrix);
      setPriceMatrix(initialMatrix);
    }
  }, [initialMatrix, rows.length, setPriceMatrix]);

  const updateRow = (id, field, value) => {
    console.log('✏️ PRICE_UPDATE:', { id, field, value, type: typeof value });

    let processedValue = value;

    // Ensure indemnity is always a string
    if (field === 'indemnity') {
      processedValue = String(value || '');
    }
    // For numeric fields, parse or keep as string
    else if (field === 'monthly' || field.startsWith('y')) {
      processedValue = parseNumber(value) || '';
    }

    const updated = rows.map(r =>
      r.id === id ? { ...r, [field]: processedValue } : r
    );

    console.log('🔄 UPDATED_ROW:', updated.find(r => r.id === id));

    setRows(updated);
    setPriceMatrix(updated);
  };

  const deleteRow = (id) => {
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    setPriceMatrix(updated);
  };

  const addCustomRow = () => {
    console.log('➕ ADDING_CUSTOM_ROW');
    const newRow = {
      id: 'custom_' + Date.now(),
      indemnity: 'Custom Limit',
      monthly: null,
      ...selectedYears.reduce((acc, y) => ({
        ...acc,
        [`y${y}`]: null
      }), {})
    };

    console.log('🆕 NEW_ROW:', newRow);

    setRows(prev => [...prev, newRow]);
    setPriceMatrix(prev => [...prev, newRow]);
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization / Hospital Type</th>
              {isHospital && <th className="px-4 py-3 text-left text-sm font-semibold border-r">No. of Beds</th>}
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity Limit</th>
              {showMonthly && <th className="px-4 py-3 text-left text-sm font-semibold border-r">Monthly</th>}
              {selectedYears.map(y => (
                <th key={y} className="px-4 py-3 text-left text-sm font-semibold border-r">{y} Year</th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                {i === 0 && (
                  <>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {membershipType}
                    </td>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {specialization || 'All'}
                    </td>
                    {isHospital && (
                      <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                        {beds && beds !== 'N/A' ? `${beds} Beds` : 'Not Specified'}
                      </td>
                    )}
                  </>
                )}
                <td className="px-4 py-3 border-r">
                  <input
                    type="text"
                    value={row.indemnity || ''}
                    onChange={(e) => updateRow(row.id, 'indemnity', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    placeholder="e.g. 10 Cr"
                  />
                </td>
                {showMonthly && (
                  <td className="px-4 py-3 border-r">
                    <input
                      type="text"
                      value={formatNumber(row.monthly)}
                      onChange={(e) => updateRow(row.id, 'monthly', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                )}
                {selectedYears.map(y => (
                  <td key={y} className="px-4 py-3 border-r">
                    <input
                      type="text"
                      value={formatNumber(row[`y${y}`])}
                      onChange={(e) => updateRow(row.id, `y${y}`, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800 font-bold text-xl">
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={addCustomRow} className="text-[#15BBB3] font-semibold flex items-center gap-2 hover:underline">
          <span className="text-2xl">+</span> Add Custom Row
        </button>
        <div className="flex gap-4">
          <button onClick={onEdit} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700">
            Back to Edit
          </button>
          <button onClick={onSave} disabled={saving} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Updating...' : 'Update Quotation'}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditQuotation;