

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';
import Select from 'react-select';

const CreateQuotation = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);
  const [priceMatrix, setPriceMatrix] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

  const navigate = useNavigate();
  const location = useLocation();
  const doctorIdFromAddDoctor = location?.state?.doctorId;

  // React Select ke liye doctors options format
  const doctorOptions = useMemo(() => {
    return doctors.map(doctor => ({
      value: doctor._id,
      label: `${doctor.fullName} (${doctor.doctorId})`,
      doctorType: doctor.doctorType,
      specialization: doctor.specialization,
      rawData: doctor
    }));
  }, [doctors]);

  // Fetch Doctors Dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await apiClient.get(apiEndpoints.doctors.myDoctorss, { params: { limit: 1000 } });
        setDoctors(response.data.data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors list');
        try {
          const response = await apiClient.get('/doctors', { params: { limit: 1000 } });
          setDoctors(response.data.data || []);
        } catch (fallbackError) {
          console.error('Fallback failed:', fallbackError);
        }
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Auto-select doctor if coming from add doctor page
  useEffect(() => {
    if (doctorIdFromAddDoctor && doctors.length > 0) {
      const doctorToSelect = doctors.find(doctor => doctor._id === doctorIdFromAddDoctor);
      if (doctorToSelect) {
        const selectedOption = {
          value: doctorToSelect._id,
          label: `${doctorToSelect.fullName} (${doctorToSelect.doctorId})`,
          doctorType: doctorToSelect.doctorType,
          specialization: doctorToSelect.specialization,
          rawData: doctorToSelect
        };
        handleDoctorSelect(selectedOption);
      }
    }
  }, [doctorIdFromAddDoctor, doctors]);

  // Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiClient.get('/service-packages/list');
        setPackages(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load packages');
      }
    };
    fetchPackages();
  }, []);

  const handleDoctorSelect = (selectedOption) => {
    setSelectedDoctor(selectedOption);
    
    if (!selectedOption) {
      setFormData(prev => ({
        ...prev,
        doctorId: '',
        doctorName: '',
        membershipType: 'INDIVIDUAL MEMBERSHIP',
        specialization: '',
        beds: 'N/A'
      }));
      setMembershipTypeLocked(false);
      return;
    }

    const doctor = selectedOption.rawData;
    
    // Determine membership type
    const isHospitalType = ['hospital', 'hospital_individual'].includes(doctor.doctorType);
    const membershipType = doctor.doctorType === 'hospital'
      ? 'HOSPITAL MEMBERSHIP'
      : doctor.doctorType === 'hospital_individual'
        ? 'HOSPITAL + INDIVIDUAL MEMBERSHIP'
        : 'INDIVIDUAL MEMBERSHIP';

    // Set basic info immediately
    setFormData(prev => ({
      ...prev,
      doctorId: doctor._id,
      doctorName: selectedOption.label,
      membershipType,
      specialization: isHospitalType ? 'Loading...' : (doctor.specialization?.join(', ') || 'General Practitioner'),
      beds: isHospitalType ? 'Loading...' : 'N/A'
    }));
    setMembershipTypeLocked(true);

    // Fetch full doctor details for hospitalType & beds
    if (isHospitalType) {
      apiClient.get(`/doctors/${doctor._id}`)
        .then(response => {
          const doctorDetails = response.data.data;

          const hospitalType = doctorDetails.hospitalDetails?.hospitalType || 'Not Specified';
          const bedsCount = doctorDetails.hospitalDetails?.beds || 'Not Specified';

          setFormData(prev => ({
            ...prev,
            specialization: hospitalType,
            beds: bedsCount
          }));
        })
        .catch(err => {
          console.error("Failed to load hospital details:", err);
          toast.warn("Hospital details not available");
          setFormData(prev => ({
            ...prev,
            specialization: 'Hospital (Details Unavailable)',
            beds: 'Not Specified'
          }));
        });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('year_')) {
      const year = name.split('_')[1];
      setSelectedYears(prev =>
        prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
      );
    }
    else {
      if (name === 'membershipType' && membershipTypeLocked) {
        toast.info('Membership type is auto-selected');
        return;
      }
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handlePreview = () => {
    if (!formData.doctorName) {
      toast.error('Please select a doctor');
      return;
    }
    if (selectedYears.length === 0) {
      toast.error('Select at least one year');
      return;
    }
    setIsPreview(true);
  };

  const handleEdit = () => setIsPreview(false);

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
        numberOfBeds: formData.beds !== 'N/A' && formData.beds !== 'Loading...' ? formData.beds : 'Not Specified',
        priceMatrix: priceMatrix.filter(r => !r.disabled).map(row => ({
          indemnity: typeof row.indemnity === 'string' ? row.indemnity : String(row.indemnity || 'Custom Limit'),
          monthly: row.monthly,
          y1: row.y1,
          y5: row.y5,
        }))
      }
    };

    navigate('/admin/quotation/pdf-preview', { state: dataToPass });
  };

  const handleSave = async () => {
    // ✅ VALIDATION
    if (!formData.doctorId || !formData.doctorName) {
      toast.error('Please select a doctor before saving');
      return;
    }
    
    console.log("🔍 BEFORE SAVE CHECK:", {
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      membershipType: formData.membershipType
    });

    if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0]?.disabled) {
      toast.error('No pricing data to save');
      return;
    }

    // ✅ FIXED: Backend-compatible requester types
    // Backend sirf "doctor" ya "hospital" accept karta hai
    let requesterType = 'hospital'; // default
    
    if (formData.membershipType === "INDIVIDUAL MEMBERSHIP") {
      requesterType = 'doctor';
    } 
    else if (formData.membershipType === "HOSPITAL MEMBERSHIP") {
      requesterType = 'hospital';
    }
    else if (formData.membershipType === "HOSPITAL + INDIVIDUAL MEMBERSHIP" || formData.membershipType === "INDIVIDUAL + HOSPITAL MEMBERSHIP") {
      // ✅ BACKEND FIX: Use "hospital" for combined (since backend doesn't accept "combined")
      requesterType = 'hospital';
      
      // ✅ ADD A NOTE IN NARRATION
      formData.narration = formData.narration ;
      
      console.log("🏥 Hospital+Individual detected, using 'hospital' as requester type");
    }

    console.log("🎯 FINAL REQUESTER TYPE:", requesterType);

    // ✅ FIXED: Properly handle indemnity field - handle both string and number values
    const requestDetails = {
      policyTerms: selectedYears.map(Number),
      paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
      additionalRequirements: formData.narration,
      specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
      numberOfBeds: formData.beds !== 'N/A' && formData.beds !== 'Loading...' && !isNaN(Number(formData.beds)) ? Number(formData.beds) : undefined,
      items: priceMatrix
        .filter(row => !row.disabled)
        .map(row => {
          // ✅ FIXED: Properly handle indemnity field
          let indemnityValue = 'Custom';
          if (row.indemnity !== null && row.indemnity !== undefined) {
            if (typeof row.indemnity === 'string') {
              indemnityValue = row.indemnity.trim();
            } else if (typeof row.indemnity === 'number') {
              indemnityValue = String(row.indemnity);
            } else {
              indemnityValue = String(row.indemnity);
            }
          }
          
          const item = { 
            indemnity: indemnityValue || 'Custom',
            packageId: row.packageId || null
          };
          
          selectedYears.forEach(y => {
            const val = row[`y${y}`];
            if (val != null && val !== '' && !isNaN(Number(val))) {
              item[`year_${y}`] = Number(val);
            }
          });
          
          if (formData.monthly && row.monthly != null && row.monthly !== '' && !isNaN(Number(row.monthly))) {
            item.monthly = Number(row.monthly);
          }
          
          return item;
        })
        .filter(item => {
          // Check if item has at least one year value or monthly value
          const hasYearValue = selectedYears.some(y => item[`year_${y}`] !== undefined);
          const hasMonthlyValue = formData.monthly ? item.monthly !== undefined : true;
          return hasYearValue || hasMonthlyValue;
        })
    };

    // ✅ Extract doctor name
    let doctorDisplayName = formData.doctorName;
    if (doctorDisplayName.includes(' (')) {
      doctorDisplayName = doctorDisplayName.split(' (')[0].trim();
    }

    const quotationData = {
      requester: {
        type: requesterType, // ✅ Now only "doctor" or "hospital"
        name: doctorDisplayName,
        entityId: formData.doctorId,
        contactPerson: doctorDisplayName
      },
      requestDetails,
      status: 'responses_pending',
      priority: 'medium',
      ...(formData.trno && { trno: formData.trno }),
      
      // ✅ ADD CUSTOM FIELD FOR FRONTEND TO IDENTIFY COMBINED
      metadata: {
        isCombinedMembership: formData.membershipType.includes("HOSPITAL + INDIVIDUAL") || formData.membershipType.includes("INDIVIDUAL + HOSPITAL"),
        originalMembershipType: formData.membershipType,
        area: formData.area,
        specialization: formData.specialization,
        quotationDate: formData.quotationDate
      }
    };

    console.log("📤 QUOTATION PAYLOAD:", {
      type: quotationData.requester.type,
      entityId: quotationData.requester.entityId,
      isCombined: quotationData.metadata?.isCombinedMembership,
      items: quotationData.requestDetails.items
    });

    try {
      const response = await apiClient.post(apiEndpoints.quotations.create, quotationData);
      
      if (response.data.success) {
        console.log("✅ QUOTATION CREATED:", response.data.data);
        toast.success('Quotation created successfully!');
        navigate('/sales/quotation-list');
      }
    } catch (error) {
      console.error("❌ ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to save quotation');
    }
  };

  return (
    <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Quotation</h1>

        <form onSubmit={e => e.preventDefault()} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TRNO <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input 
                type="text" 
                name="trno" 
                value={formData.trno} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                placeholder="Auto-generated" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor / Hospital Name</label>
              <Select
                options={doctorOptions}
                value={selectedDoctor}
                onChange={handleDoctorSelect}
                isLoading={loadingDoctors}
                isClearable={true}
                isSearchable={true}
                placeholder={loadingDoctors ? "Loading doctors..." : "Search or select doctor/hospital"}
                className="mt-1"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '2px 8px',
                    minHeight: '42px'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                formatOptionLabel={(option) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500">
                      {option.doctorType === 'hospital' ? 'Hospital' : 
                       option.specialization?.join(', ') || 'General Practitioner'}
                    </span>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input 
                type="text" 
                name="area" 
                value={formData.area} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
              <input 
                type="date" 
                name="quotationDate" 
                value={formData.quotationDate} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membership Type {membershipTypeLocked && <span className="ml-2 text-xs text-green-600">(Auto)</span>}
              </label>
              <select 
                name="membershipType" 
                value={formData.membershipType} 
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md p-2 ${membershipTypeLocked ? 'bg-green-50 border-green-300 cursor-not-allowed' : 'border-gray-300'}`}
                disabled={membershipTypeLocked}
              >
                <option value="">Select</option>
                <option value="HOSPITAL MEMBERSHIP">Hospital Membership</option>
                <option value="INDIVIDUAL MEMBERSHIP">Individual Membership</option>
                <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">Hospital + Individual</option>
                <option value="INDIVIDUAL + HOSPITAL MEMBERSHIP">Individual + Hospital</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization / Hospital Type</label>
              <input 
                type="text" 
                value={formData.specialization} 
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <input 
              type="text" 
              name="narration" 
              value={formData.narration} 
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                <label key={year} className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={`year_${year}`} 
                    checked={selectedYears.includes(year.toString())}
                    onChange={handleChange} 
                    className="mr-2 w-5 h-5 accent-[#15BBB3] rounded" 
                  />
                  <span className="text-sm">{year} Year</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="monthly" 
                checked={formData.monthly} 
                onChange={handleChange}
                className="mr-2 w-5 h-5 accent-[#15BBB3]" 
              />
              <span className="text-sm">Monthly Payment</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="indemnityCover" 
                checked={formData.indemnityCover} 
                onChange={handleChange}
                className="mr-2 w-5 h-5 accent-[#15BBB3]" 
              />
              <span className="text-sm">Indemnity Cover</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              type="button" 
              onClick={handlePreview}
              className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]"
            >
              Preview
            </button>
            <button 
              type="button" 
              onClick={handleGeneratePDF}
              className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]"
            >
              Generate PDF
            </button>
          </div>
        </form>

        {isPreview && (
          <div className="mt-10 border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
            <PricePreviewTable
              membershipType={formData.membershipType}
              selectedYears={selectedYears}
              showMonthly={formData.monthly}
              packages={packages}
              specialization={formData.specialization}
              beds={formData.beds}
              setPriceMatrix={setPriceMatrix}
              onEdit={handleEdit}
              onSave={handleSave}
              indemnityCover={formData.indemnityCover}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const PricePreviewTable = ({
  membershipType, selectedYears, showMonthly, packages, specialization, beds, setPriceMatrix, onEdit, onSave, indemnityCover
}) => {
  const [rows, setRows] = useState([]);
  const isHospital = membershipType.includes('HOSPITAL');

  const formatNumber = (num) => (num == null || num === '') ? '' : Number(num).toLocaleString('en-IN');
  const parseNumber = (str) => str === '' ? null : Number(str.replace(/,/g, ''));

  useEffect(() => {
    if (!packages.length || selectedYears.length === 0) {
      setRows([]);
      setPriceMatrix([]);
      return;
    }

    const newRows = [];

    packages.forEach(pkg => {
      const typeMatch = pkg.detail?.toLowerCase() === 'doctors' ||
                        membershipType.toLowerCase().includes(pkg.detail?.toLowerCase()) ||
                        pkg.detail?.toLowerCase().includes('all');

      if (!typeMatch) return;

      // Monthly filter सिर्फ़ तब लगाओ जब Monthly ON है और Indemnity Cover OFF है
      if (showMonthly && !indemnityCover) {
        const monthlyValue = pkg.monthlyamount || pkg.monthlyAmount;
        const hasValidMonthly = monthlyValue != null && 
                                monthlyValue !== '' && 
                                monthlyValue !== 'N/A' && 
                                !isNaN(parseFloat(monthlyValue));

        if (!hasValidMonthly) {
          return; // row skip
        }
      }

      // बाकी कोड same रहेगा...
      const row = {
        id: pkg._id + '_' + Date.now(),
        indemnity: pkg.indemnity || 'Not Specified',
        packageId: pkg._id
      };

      const monthlyValue = pkg.monthlyamount || pkg.monthlyAmount;
      if (monthlyValue && monthlyValue !== 'N/A' && !isNaN(parseFloat(monthlyValue))) {
        row.monthly = parseFloat(monthlyValue);
      }

      if (pkg.yearlyCharges && Array.isArray(pkg.yearlyCharges)) {
        selectedYears.forEach(y => {
          const yearNum = parseInt(y);
          const chargeObj = pkg.yearlyCharges.find(yc => yc.year === yearNum);
          if (chargeObj?.charge != null) {
            row[`y${y}`] = chargeObj.charge;
          }
        });
      }

      const hasValue = selectedYears.some(y => row[`y${y}`] != null) ||
                      (showMonthly && row.monthly != null);

      if (hasValue) {
        newRows.push(row);
      }
    });

    if (newRows.length === 0) {
      const message = showMonthly && !indemnityCover
        ? 'No package with a monthly payment option was found.'
        : 'No package found for the selected criteria.';
      
      newRows.push({
        id: 'no-data',
        indemnity: message,
        disabled: true
      });
    }

    setRows(newRows);
    setPriceMatrix(newRows.filter(r => !r.disabled));
  }, [packages, membershipType, selectedYears, showMonthly, indemnityCover, setPriceMatrix]);

  const updateRow = (id, field, value) => {
    const updated = rows.map(row => {
      if (row.id === id) {
        if (field === 'indemnity') {
          return { ...row, [field]: value }; // Keep string as is for indemnity
        } else {
          return { ...row, [field]: parseNumber(value) || '' };
        }
      }
      return row;
    });
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const deleteRow = (id) => {
    const updated = rows.filter(row => row.id !== id);
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const addCustomRow = () => {
    const newRow = {
      id: 'custom_' + Date.now(),
      indemnity: 'Custom Limit',
      isCustom: true,
      monthly: null,
      ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: null }), {})
    };
    setRows([...rows.filter(r => !r.disabled), newRow]);
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
              <th className="px-4 py-3 text-left text-sm font-semibold w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={`${i % 2 === 1 ? 'bg-gray-50' : ''} ${row.disabled ? 'opacity-60' : ''}`}>
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
                        {beds === 'Loading...' ? 'Loading...' : beds && beds !== 'N/A' ? `${beds} Beds` : 'Not Specified'}
                      </td>
                    )}
                  </>
                )}
                <td className="px-4 py-3 border-r">
                  {row.disabled ? (
                    <span className="text-red-600">{row.indemnity}</span>
                  ) : (
                    <input
                      type="text"
                      value={row.indemnity || ''}
                      onChange={(e) => updateRow(row.id, 'indemnity', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                      placeholder="e.g. 10 Cr"
                    />
                  )}
                </td>

                {showMonthly && (
                  <td className="px-4 py-3 border-r">
                    <input
                      type="text"
                      disabled={row.disabled}
                      value={formatNumber(row.monthly)}
                      onChange={(e) => updateRow(row.id, 'monthly', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                )}

                {selectedYears.map(y => (
                  <td key={`y${y}`} className="px-4 py-3 border-r">
                    <input
                      type="text"
                      disabled={row.disabled}
                      value={formatNumber(row[`y${y}`])}
                      onChange={(e) => updateRow(row.id, `y${y}`, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                ))}

                <td className="px-4 py-3 text-center">
                  {!row.disabled && (
                    <button 
                      onClick={() => deleteRow(row.id)} 
                      className="text-red-600 hover:text-red-800 font-bold text-xl p-1"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={addCustomRow} 
          className="text-[#15BBB3] font-medium hover:underline flex items-center gap-2"
          type="button"
        >
          <span className="text-xl">+</span> Add Custom Indemnity Limit
        </button>

        <div className="flex gap-3">
          <button 
            onClick={onEdit} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            type="button"
          >
            Edit Form
          </button>
          <button
            onClick={onSave}
            disabled={rows.length === 0 || rows.every(r => r.disabled)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Save Quotation
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateQuotation;