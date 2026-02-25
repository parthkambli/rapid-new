

// AddPolicy.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";
import DateInput from "../../../components/DateInput/DateInput"; // DateInput component import
import Select from 'react-select';

const AddPolicy = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState({
    doctor: true,
    hospital: false,
  });

  // Helper functions for date calculations
  const addYearsToDate = (dateStr, years) => {
    if (!dateStr || !years) return '';

    try {
      // Parse dd-mm-yyyy format
      const [day, month, year] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      // Add years
      date.setFullYear(date.getFullYear() + years);

      // Subtract one day for business logic (expiry one day before)
      date.setDate(date.getDate() - 1);

      // Format back to dd-mm-yyyy
      return formatDateToDDMMYYYY(date);
    } catch (error) {
      console.error('Error adding years to date:', error);
      return '';
    }
  };

  const calculateDurationInYears = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return '';

    try {
      // Parse dd-mm-yyyy format
      const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number);
      const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number);

      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      // Calculate difference in milliseconds
      const diffInMs = endDate - startDate;

      // Convert to days
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // Add 1 day since end date is inclusive
      const totalDays = diffInDays + 1;

      // Calculate years with decimal for partial years
      const years = totalDays / 365.25;

      // Round to 1 decimal place for display
      return Math.round(years * 10) / 10;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return '';
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Get today's date in dd-mm-yyyy format
  const getTodayDate = () => {
    return formatDateToDDMMYYYY(new Date());
  };

  // Function to convert dd-mm-yyyy to ISO for API
  const convertToISO = (dateStr) => {
    if (!dateStr) return '';

    try {
      const [day, month, year] = dateStr.split('-').map(Number);
      // Create date at local timezone at midnight to avoid timezone shifts
      const date = new Date(year, month - 1, day, 0, 0, 0, 0);

      // Format to YYYY-MM-DD without timezone conversion issues
      const isoDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
      return isoDate;
    } catch (error) {
      console.error('Error converting to ISO:', error);
      return '';
    }
  };

  // Initial states with today's date
  const [doctorForms, setDoctorForms] = useState([{
    policyHolder: { type: 'doctor' },
    insuranceCompany: '',
    insuranceType: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: getTodayDate(), // Default to current date
    endDate: '',
    duration: '',
    narration: '',
    selectedOption: null,        // Selection for dropdown
    files: {                     // ← YE NAYA ADD KAR
      policyDocument: null,
      proposalForm: null,
      otherDocuments: []
    }
  }]);
  const [hospitalForms, setHospitalForms] = useState([{
    policyHolder: { type: 'hospital' },
    insuranceCompany: '',
    insuranceType: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: getTodayDate(), // Default to current date
    endDate: '',
    duration: '',
    narration: '',
    selectedOption: null,        // Selection for dropdown
    files: {                     // ← YE NAYA ADD KAR
      policyDocument: null,
      proposalForm: null,
      otherDocuments: []
    }
  }]);

  // API data states
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [allInsuranceTypes, setAllInsuranceTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [doctorSearchLoading, setDoctorSearchLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Update form data with date calculations and hospital_individual logic
  const updateFormData = (type, index, field, value) => {
    console.log(`Updating form field: ${field} with value:`, value);

    const setter = type === 'doctor' ? setDoctorForms : setHospitalForms;
    const forms = type === 'doctor' ? doctorForms : hospitalForms;

    let updatedForms = [...forms];
    let updatedForm = { ...updatedForms[index] };

    // Special handling for date-related fields
    if (field === 'startDate' || field === 'endDate' || field === 'duration') {
      const newValue = value || '';

      if (field === 'startDate') {
        updatedForm.startDate = newValue;

        // If both start date and duration exist, calculate end date
        if (newValue && updatedForm.duration) {
          const endDate = addYearsToDate(newValue, parseFloat(updatedForm.duration));
          updatedForm.endDate = endDate;
        }
        // If both start date and end date exist, recalculate duration
        else if (newValue && updatedForm.endDate) {
          const duration = calculateDurationInYears(newValue, updatedForm.endDate);
          updatedForm.duration = duration.toString();
        }
      }
      else if (field === 'endDate') {
        updatedForm.endDate = newValue;

        // If both start date and end date exist, calculate duration
        if (updatedForm.startDate && newValue) {
          const duration = calculateDurationInYears(updatedForm.startDate, newValue);
          updatedForm.duration = duration.toString();
        }
        // Clear duration if end date is cleared
        else if (!newValue) {
          updatedForm.duration = '';
        }
      }
      else if (field === 'duration') {
        updatedForm.duration = newValue;

        // If both start date and duration exist, calculate end date
        if (updatedForm.startDate && newValue && !isNaN(parseFloat(newValue))) {
          const endDate = addYearsToDate(updatedForm.startDate, parseFloat(newValue));
          updatedForm.endDate = endDate;
        }
        // Clear end date if duration is cleared
        else if (!newValue) {
          updatedForm.endDate = '';
        }
      }
    }
    else if (field === 'insuranceCompany') {
      updatedForm[field] = value;
      // Reset insurance type when company changes
      updatedForm.insuranceType = '';
    }
    // Special handling for policyHolder field to handle hospital_individual type and spouse relationships
    // Special handling for policyHolder field to handle hospital_individual type and spouse relationships
    else if (field === 'policyHolder') {
      updatedForm[field] = value;
    }
    else {
      updatedForm[field] = value;
    }

    updatedForms[index] = updatedForm;
    setter(updatedForms);
  };

  // Fetch data from APIs
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch insurance companies
      const companiesResponse = await apiHelpers.getList(apiEndpoints.insuranceCompanies.list);
      console.log('Insurance companies received:', companiesResponse.data);
      setInsuranceCompanies(companiesResponse.data);

      // Fetch insurance types
      const typesResponse = await apiHelpers.getList(apiEndpoints.insuranceTypes.list);
      console.log('Insurance types received:', typesResponse.data);
      setAllInsuranceTypes(typesResponse.data);

      // Fetch initial doctors (small batch) - search will load more
      try {
        const doctorsResponse = await apiHelpers.getList(apiEndpoints.doctors.forpolicy, { page: 1, limit: 100 });
        const fetchedDoctors = doctorsResponse.data || [];
        setDoctors(fetchedDoctors);
        setDoctorOptions(fetchedDoctors.map(d => ({
          value: d._id,
          label: `${d.fullName || d.hospitalName} - ${d.employeeId || d.membershipId || 'No ID'}`,
          ...d
        })));
      } catch (error) {
        console.warn('Doctors API not available:', error);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit policy
  const submitPolicy = async (policyData) => {
    try {
      console.log('Sending policy data to API:', policyData);
      const response = await apiHelpers.create(apiEndpoints.policies.create, policyData);
      console.log('Policy creation response:', response);
      return response;
    } catch (error) {
      console.error('Error creating policy:', error);
      console.error('Error response:', error.response?.data);
      console.error('Policy data that failed:', policyData);
      throw error;
    }
  };









  // original

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);

  //   try {
  //     const allPolicies = [];

  //     // DOCTOR FORMS SE SIRF 1 POLICY PER FORM
  //     doctorForms.forEach((form) => {
  //       if (form.insuranceCompany && form.insuranceType && form.policyHolder?.entityId) {
  //         allPolicies.push({
  //           policyNumber: form.policyNumber || '',
  //           policyHolder: {
  //             type: 'doctor',
  //             name: form.policyHolder.name,
  //             entityId: form.policyHolder.entityId,
  //           },
  //           insuranceCompany: form.insuranceCompany,
  //           insuranceType: form.insuranceType,
  //           coverageAmount: parseFloat(form.coverageAmount) || 0,
  //           premiumAmount: parseFloat(form.premiumAmount) || 0,
  //           premiumFrequency: 'yearly',
  //           startDate: convertToISO(form.startDate),
  //           // endDate: convertToISO(form.endDate),
  //          // Doctor loop mein
  // endDate: form.endDate && form.endDate.length >= 8
  //   ? convertToISO(form.endDate)
  //   : convertToISO(addYearsToDate(form.startDate || getTodayDate(), parseFloat(form.duration) || 1)),
  //           duration: parseFloat(form.duration) || 0,
  //           paidBy: form.premiumPaidBy === 'By Rapid' ? 'by_company' : 'by_doctor',
  //           status: 'active',
  //           renewalStatus: 'not_due',
  //           narration: form.narration,
  //           totalPremiumPaid: 0,
  //         });
  //       }
  //     });

  //     // HOSPITAL FORMS SE SIRF 1 POLICY PER FORM
  //     hospitalForms.forEach((form) => {
  //       if (form.insuranceCompany && form.insuranceType && form.policyHolder?.entityId) {
  //         allPolicies.push({
  //           policyNumber: form.policyNumber || '',
  //           policyHolder: {
  //             type: 'hospital',
  //             name: form.policyHolder.name,
  //             entityId: form.policyHolder.entityId,
  //           },
  //           insuranceCompany: form.insuranceCompany,
  //           insuranceType: form.insuranceType,
  //           coverageAmount: parseFloat(form.coverageAmount) || 0,
  //           premiumAmount: parseFloat(form.premiumAmount) || 0,
  //           premiumFrequency: 'yearly',
  //           startDate: convertToISO(form.startDate),
  //          // Doctor loop mein
  // endDate: form.endDate && form.endDate.length >= 8
  //   ? convertToISO(form.endDate)
  //   : convertToISO(addYearsToDate(form.startDate || getTodayDate(), parseFloat(form.duration) || 1)),
  //           // endDate: convertToISO(form.endDate),
  //           duration: parseFloat(form.duration) || 0,
  //           paidBy: form.premiumPaidBy === 'By Rapid' ? 'by_company' : 'by_hospital',
  //           status: 'active',
  //           renewalStatus: 'not_due',
  //           narration: form.narration,
  //           totalPremiumPaid: 0,
  //         });
  //       }
  //     });

  //     if (allPolicies.length === 0) {
  //       alert('Koi valid form nahi bhara!');
  //       setSubmitting(false);
  //       return;
  //     }

  //     // Sab policies ek saath create karo
  //     const results = await Promise.allSettled(
  //       allPolicies.map((policy) => submitPolicy(policy))
  //     );

  //     const successful = results.filter((r) => r.status === 'fulfilled').length;
  //     alert(`${successful} policies successfully create ho gayi!`);
  //     navigate('/admin/policy');
  //   } catch (error) {
  //     alert('Error: ' + error.message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };




  // new



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Collect all valid forms
      const allForms = [];

      doctorForms.forEach((form, idx) => {
        if (form.insuranceCompany && form.insuranceType && form.policyHolder?.entityId) {
          allForms.push({ ...form, _type: 'doctor', _index: allForms.length });
        }
      });

      hospitalForms.forEach((form, idx) => {
        if (form.insuranceCompany && form.insuranceType && form.policyHolder?.entityId) {
          allForms.push({ ...form, _type: 'hospital', _index: allForms.length });
        }
      });

      if (allForms.length === 0) {
        alert('Koi valid policy nahi bhari!');
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add policies as JSON string (backend expect karta hai policiesData ya direct array)
      formData.append('policiesData', JSON.stringify(
        allForms.map(form => ({
          policyNumber: form.policyNumber || '',
          policyHolder: {
            type: form.policyHolder.type,
            name: form.policyHolder.name,
            entityId: form.policyHolder.entityId,
          },
          insuranceCompany: form.insuranceCompany,
          insuranceType: form.insuranceType,
          coverageAmount: parseFloat(form.coverageAmount) || 0,
          premiumAmount: parseFloat(form.premiumAmount) || 0,
          premiumFrequency: 'yearly',
          startDate: convertToISO(form.startDate),
          endDate: form.endDate && form.endDate.length >= 8
            ? convertToISO(form.endDate)
            : convertToISO(addYearsToDate(form.startDate || getTodayDate(), parseFloat(form.duration) || 1)),
          duration: parseFloat(form.duration) || 0,
          paidBy: form.premiumPaidBy === 'By Rapid' ? 'by_company' : (form.policyHolder.type === 'hospital' ? 'by_hospital' : 'by_doctor'),
          status: 'active',
          renewalStatus: 'not_due',
          narration: form.narration,
          totalPremiumPaid: 0,
        }))
      ));

      // Add files with proper indexing
      allForms.forEach((form, originalIndex) => {
        const files = form.files || {};

        if (files.policyDocument) {
          formData.append('policyDocument', files.policyDocument);
        }
        if (files.proposalForm) {
          formData.append('proposalForm', files.proposalForm);
        }
        if (files.otherDocuments && files.otherDocuments.length > 0) {
          files.otherDocuments.forEach(file => {
            formData.append('otherDocuments', file);
          });
        }
      });

      // Send with axios/apiClient
      const response = await apiClient.post(apiEndpoints.policies.create, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(`${response.data.count || allForms.length} policies successfully created!`);
      navigate('/admin/policy');

    } catch (error) {
      console.error('Submit error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };



  const toggleType = (type) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const addDoctorForm = () => setDoctorForms([...doctorForms, {
    policyHolder: { type: 'doctor' },
    insuranceCompany: '',
    insuranceType: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: getTodayDate(),
    endDate: '',
    duration: '',
    narration: '',
    selectedOption: null
  }]);

  const addHospitalForm = () => setHospitalForms([...hospitalForms, {
    policyHolder: { type: 'hospital' },
    insuranceCompany: '',
    insuranceType: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: getTodayDate(),
    endDate: '',
    duration: '',
    narration: '',
    selectedOption: null
  }]);

  const removeForm = (type, index) => {
    if (type === "doctor") {
      setDoctorForms(doctorForms.filter((_, i) => i !== index));
    } else {
      setHospitalForms(hospitalForms.filter((_, i) => i !== index));
    }
  };

  // Format options for React Select
  const formatDoctorOptions = (doctorsList) => {
    return doctorsList.map(doctor => ({
      value: doctor._id,
      label: `${doctor.fullName || doctor.hospitalName} - ${doctor.employeeId || doctor.membershipId || 'No ID'}`,
      ...doctor
    }));
  };

  const formatHospitalOptions = (hospitalsList) => {
    return hospitalsList.map(hospital => ({
      value: hospital._id,
      label: `${hospital.hospitalName || hospital.fullName}${hospital.membershipId ? ` - ${hospital.membershipId}` : ''}`,
      ...hospital
    }));
  };

  // Filter hospitals from doctors list - include both hospital and hospital_individual types
  const filterHospitals = () => {
    return doctors.filter(doctor =>
      doctor.doctorType === 'hospital' ||
      doctor.doctorType === 'hospital_individual' ||
      doctor.membershipType === 'Hospital'
    );
  };

  // Debounced server-side doctor search
  const fetchDoctorsBySearch = useCallback(async (searchQuery) => {
    try {
      setDoctorSearchLoading(true);
      const response = await apiHelpers.getList(apiEndpoints.doctors.forpolicy, {
        page: 1,
        limit: 50,
        ...(searchQuery && searchQuery.trim() ? { search: searchQuery.trim() } : {})
      });
      const fetchedDoctors = response.data || [];
      setDoctors(fetchedDoctors);
      setDoctorOptions(fetchedDoctors.map(d => ({
        value: d._id,
        label: `${d.fullName || d.hospitalName} - ${d.employeeId || d.membershipId || 'No ID'}`,
        ...d
      })));
    } catch (err) {
      console.error('Error searching doctors:', err);
    } finally {
      setDoctorSearchLoading(false);
    }
  }, []);

  const handleDoctorSearchChange = useCallback((value, { action }) => {
    if (action === 'set-value' || action === 'input-blur' || action === 'menu-close') return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => fetchDoctorsBySearch(value), 300);
  }, [fetchDoctorsBySearch]);

  useEffect(() => {
    fetchData();
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, []);

  // Determine if only hospital checkbox is selected
  const isOnlyHospitalSelected = selectedTypes.hospital && !selectedTypes.doctor;

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-3 rounded-md ${notification.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
            <div className="flex items-center">
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Policy Details</h2>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4 mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        )}

        {/* Checkbox Buttons */}
        <div className="flex items-center space-x-6 mb-8">
          <label
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg cursor-pointer transition-all ${selectedTypes.doctor
              ? "bg-[#1B504E] text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <input
              type="checkbox"
              checked={selectedTypes.doctor}
              onChange={() => toggleType("doctor")}
              className="w-5 h-5 text-blue-600 rounded focus:ring-0"
            />
            <span className="font-medium">Doctor</span>
          </label>

          <label
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg cursor-pointer transition-all ${selectedTypes.hospital
              ? "bg-[#1B504E] text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <input
              type="checkbox"
              checked={selectedTypes.hospital}
              onChange={() => toggleType("hospital")}
              className="w-5 h-5 text-blue-600 rounded focus:ring-0"
            />
            <span className="font-medium">Hospital</span>
          </label>
        </div>

        {/* Doctor Forms */}
        {selectedTypes.doctor && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Insurance Policy</h3>
            {doctorForms.map((formData, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 mb-6 relative bg-gray-50">
                {doctorForms.length > 1 && (
                  <button
                    onClick={() => removeForm("doctor", index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <Select
                      value={formData.selectedOption}
                      onChange={async (selectedOption) => {
                        updateFormData('doctor', index, 'selectedOption', selectedOption || null);
                        if (selectedOption) {
                          // 1. Logic for Auto-generation on First Doctor Selection
                          if (index === 0) {
                            const doc = selectedOption; // Has all props spread
                            const isHospitalIndividual = doc.doctorType === 'hospital_individual';
                            const hasSpouse = doc.linkedDoctorId && doc.relationshipType === 'spouse';

                            if (isHospitalIndividual || hasSpouse) {
                              let newDoctorForms = [];
                              let newHospitalForms = [];

                              // Helper
                              const createForm = (docType, id, name, opt = null, narrationSuffix = '') => ({
                                policyHolder: { type: docType, entityId: id, name: name },
                                insuranceCompany: formData.insuranceCompany || '',
                                insuranceType: formData.insuranceType || '',
                                policyNumber: '',
                                coverageAmount: formData.coverageAmount || '',
                                premiumAmount: '',
                                premiumPaidBy: 'By Rapid',
                                startDate: formData.startDate || getTodayDate(),
                                endDate: formData.endDate || '',
                                duration: formData.duration || '',
                                selectedOption: opt,
                                narration: narrationSuffix
                                  ? (formData.narration ? `${formData.narration} (${narrationSuffix})` : narrationSuffix)
                                  : (formData.narration || ''),
                                files: { policyDocument: null, proposalForm: null, otherDocuments: [] }
                              });

                              // Add Selected Doc
                              newDoctorForms.push(createForm('doctor', doc._id, doc.fullName || doc.hospitalName, selectedOption, ''));

                              // Add Spouse if needed
                              if (hasSpouse) {
                                let linkedSpouse = doctors.find(d => d._id === doc.linkedDoctorId);

                                // NEW: If spouse is not in current search results, fetch them from server
                                if (!linkedSpouse) {
                                  try {
                                    const spouseRes = await apiHelpers.getById(apiEndpoints.doctors.get, doc.linkedDoctorId);
                                    linkedSpouse = spouseRes.data || spouseRes;
                                  } catch (err) {
                                    console.error('Error fetching spouse for auto-gen:', err);
                                  }
                                }

                                if (linkedSpouse) {
                                  const spouseOpt = {
                                    value: linkedSpouse._id,
                                    label: `${linkedSpouse.fullName || linkedSpouse.hospitalName} - ${linkedSpouse.employeeId || linkedSpouse.membershipId || 'No ID'}`,
                                    ...linkedSpouse
                                  };
                                  newDoctorForms.push(createForm('doctor', linkedSpouse._id, linkedSpouse.fullName || linkedSpouse.hospitalName, spouseOpt, 'Spouse Policy'));
                                }
                              }

                              // Add Hospital if needed
                              if (isHospitalIndividual) {
                                newHospitalForms.push(createForm('hospital', doc._id, doc.hospitalName || doc.fullName, selectedOption, 'Hospital Policy'));
                                setSelectedTypes({ doctor: true, hospital: true });
                              }
                              else {
                                setSelectedTypes({ doctor: true, hospital: false });
                                newHospitalForms = [];
                              }

                              setDoctorForms(newDoctorForms);
                              setHospitalForms(newHospitalForms);

                              const msg = isHospitalIndividual
                                ? (hasSpouse ? "Auto-generated: Doctor, Spouse & Hospital Forms" : "Auto-generated: Doctor & Hospital Forms")
                                : "Auto-generated: Doctor & Spouse Forms";
                              setNotification({ show: true, message: msg, type: 'info' });
                              setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
                              return;
                            }
                          }

                          // Standard Update if no special logic triggered
                          updateFormData('doctor', index, 'policyHolder', {
                            ...formData.policyHolder,
                            entityId: selectedOption.value,
                            name: selectedOption.label.split(' - ')[0]
                          });
                        } else {
                          // Clear Selection
                          updateFormData('doctor', index, 'policyHolder', {
                            ...formData.policyHolder,
                            entityId: '',
                            name: ''
                          });
                        }
                      }}
                      onInputChange={handleDoctorSearchChange}
                      options={doctorOptions}
                      isLoading={doctorSearchLoading}
                      loadingMessage={() => "Searching..."}
                      filterOption={() => true}
                      placeholder="Search & Select Doctor"
                      isClearable
                      isSearchable
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.insuranceCompany || ''}
                      onChange={(e) => updateFormData('doctor', index, 'insuranceCompany', e.target.value)}
                      disabled={insuranceCompanies.length === 0}
                    >
                      <option key="select-company" value="">Select Company</option>
                      {insuranceCompanies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.companyName || company.name}
                        </option>
                      ))}
                    </select>
                    {insuranceCompanies.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">Loading insurance companies...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.insuranceType || ''}
                      onChange={(e) => updateFormData('doctor', index, 'insuranceType', e.target.value)}
                    >
                      <option key="select-type" value="">Select Type</option>
                      {allInsuranceTypes
                        .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
                        .map(type => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy No</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.policyNumber || ''}
                      onChange={(e) => updateFormData('doctor', index, 'policyNumber', e.target.value)}
                      placeholder="Enter Policy Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.coverageAmount || ''}
                      onChange={(e) => updateFormData('doctor', index, 'coverageAmount', e.target.value)}
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.premiumPaidBy || 'By Rapid'}
                      onChange={(e) => updateFormData('doctor', index, 'premiumPaidBy', e.target.value)}
                    >
                      <option value="By Rapid">By Rapid</option>
                      <option value="By Doctor">By Doctor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.premiumAmount || ''}
                      onChange={(e) => updateFormData('doctor', index, 'premiumAmount', e.target.value)}
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DateInput
                      value={formData.startDate}
                      onChange={(value) => updateFormData('doctor', index, 'startDate', value)}
                      placeholder="dd-mm-yyyy"
                      returnFormat="dd-mm-yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DateInput
                      value={formData.endDate}
                      onChange={(value) => updateFormData('doctor', index, 'endDate', value)}
                      placeholder="dd-mm-yyyy"
                      returnFormat="dd-mm-yyyy"
                      minDate={formData.startDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.duration || ''}
                      onChange={(e) => updateFormData('doctor', index, 'duration', e.target.value)}
                      placeholder="1, 2 , 3 , 4 , etc. "
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
                    <input type="file" className="w-full p-2 border border-gray-300 rounded-md bg-white" />
                    <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
                  </div> */}



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Document</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        updateFormData('doctor', index, 'files', {
                          ...formData.files,
                          policyDocument: file || null
                        });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    />
                    {formData.files?.policyDocument && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.files.policyDocument.name}</p>
                    )}
                  </div>
                  {/*
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Form</label>
  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => {
      const file = e.target.files[0];
      updateFormData('doctor', index, 'files', {
        ...formData.files,
        proposalForm: file || null
      });
    }}
    className="w-full p-2 border border-gray-300 rounded-md bg-white"
  />
  {formData.files?.proposalForm && (
    <p className="text-xs text-green-600 mt-1">✓ {formData.files.proposalForm.name}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Other Documents (Multiple)</label>
  <input
    type="file"
    multiple
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => {
      const files = Array.from(e.target.files);
      updateFormData('doctor', index, 'files', {
        ...formData.files,
        otherDocuments: files
      });
    }}
    className="w-full p-2 border border-gray-300 rounded-md bg-white"
  />
  {formData.files?.otherDocuments?.length > 0 && (
    <div className="text-xs text-green-600 mt-1">
      ✓ {formData.files.otherDocuments.length} file(s) selected
    </div>
  )}
</div> */}

                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    rows={3}
                    value={formData.narration || ''}
                    onChange={(e) => updateFormData('doctor', index, 'narration', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addDoctorForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + Add Another Doctor Policy
            </button>
          </div>
        )}

        {/* Hospital Forms */}
        {selectedTypes.hospital && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hospital Insurance Policy</h3>
            {hospitalForms.map((formData, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 mb-6 relative bg-gray-50">
                {hospitalForms.length > 1 && (
                  <button
                    onClick={() => removeForm("hospital", index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                    {isOnlyHospitalSelected ? (
                      <Select
                        value={formData.selectedOption}
                        onChange={(selectedOption) => {
                          updateFormData('hospital', index, 'selectedOption', selectedOption || null);
                          if (selectedOption) {
                            updateFormData('hospital', index, 'policyHolder', {
                              ...formData.policyHolder,
                              entityId: selectedOption.value,
                              name: selectedOption.label.split(' - ')[0]
                            });
                          } else {
                            updateFormData('hospital', index, 'policyHolder', {
                              ...formData.policyHolder,
                              entityId: '',
                              name: ''
                            });
                          }
                        }}
                        onInputChange={handleDoctorSearchChange}
                        options={formatHospitalOptions(filterHospitals())}
                        isLoading={doctorSearchLoading}
                        loadingMessage={() => "Searching..."}
                        filterOption={() => true}
                        placeholder="Search & Select Hospital"
                        isClearable
                        isSearchable
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        value={formData.policyHolder?.name || ''}
                        onChange={(e) => updateFormData('hospital', index, 'policyHolder', {
                          ...formData.policyHolder,
                          name: e.target.value,
                          entityId: null
                        })}
                        placeholder="Enter Hospital Name"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.insuranceCompany || ''}
                      onChange={(e) => updateFormData('hospital', index, 'insuranceCompany', e.target.value)}
                      disabled={insuranceCompanies.length === 0}
                    >
                      <option key="select-company-hospital" value="">Select Company</option>
                      {insuranceCompanies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.companyName || company.name}
                        </option>
                      ))}
                    </select>
                    {insuranceCompanies.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">Loading insurance companies...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.insuranceType || ''}
                      onChange={(e) => updateFormData('hospital', index, 'insuranceType', e.target.value)}
                    >
                      <option key="select-type-hospital" value="">Select Type</option>
                      {allInsuranceTypes
                        .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
                        .map(type => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy No</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.policyNumber || ''}
                      onChange={(e) => updateFormData('hospital', index, 'policyNumber', e.target.value)}
                      placeholder="Enter Policy Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.coverageAmount || ''}
                      onChange={(e) => updateFormData('hospital', index, 'coverageAmount', e.target.value)}
                      placeholder="1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.premiumPaidBy || 'By Rapid'}
                      onChange={(e) => updateFormData('hospital', index, 'premiumPaidBy', e.target.value)}
                    >
                      <option value="By Rapid">By Rapid</option>
                      <option value="By Hospital">By Hospital</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.premiumAmount || ''}
                      onChange={(e) => updateFormData('hospital', index, 'premiumAmount', e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DateInput
                      value={formData.startDate}
                      onChange={(value) => updateFormData('hospital', index, 'startDate', value)}
                      placeholder="dd-mm-yyyy"
                      returnFormat="dd-mm-yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DateInput
                      value={formData.endDate}
                      onChange={(value) => updateFormData('hospital', index, 'endDate', value)}
                      placeholder="dd-mm-yyyy"
                      returnFormat="dd-mm-yyyy"
                      minDate={formData.startDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={formData.duration || ''}
                      onChange={(e) => updateFormData('hospital', index, 'duration', e.target.value)}
                      placeholder="1, 2, 3, 4 etc."
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
                    <input type="file" className="w-full p-2 border border-gray-300 rounded-md bg-white" />
                    <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
                  </div> */}



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Document</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        updateFormData('hospital', index, 'files', {
                          ...formData.files,
                          policyDocument: file || null
                        });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    />
                    {formData.files?.policyDocument && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.files.policyDocument.name}</p>
                    )}
                  </div>

                  {/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Form</label>
  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => {
      const file = e.target.files[0];
      updateFormData('hospital', index, 'files', {
        ...formData.files,
        proposalForm: file || null
      });
    }}
    className="w-full p-2 border border-gray-300 rounded-md bg-white"
  />
  {formData.files?.proposalForm && (
    <p className="text-xs text-green-600 mt-1">✓ {formData.files.proposalForm.name}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Other Documents (Multiple)</label>
  <input
    type="file"
    multiple
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => {
      const files = Array.from(e.target.files);
      updateFormData('hospital', index, 'files', {
        ...formData.files,
        otherDocuments: files
      });
    }}
    className="w-full p-2 border border-gray-300 rounded-md bg-white"
  />
  {formData.files?.otherDocuments?.length > 0 && (
    <div className="text-xs text-green-600 mt-1">
      ✓ {formData.files.otherDocuments.length} file(s) selected
    </div>
  )}
</div> */}

                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    rows={3}
                    value={formData.narration || ''}
                    onChange={(e) => updateFormData('hospital', index, 'narration', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHospitalForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + Add Another Hospital Policy
            </button>
          </div>
        )}

        {/* Save / Cancel */}
        <div className="flex justify-start space-x-3 mt-6">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/policy')}
            disabled={submitting}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPolicy;




















