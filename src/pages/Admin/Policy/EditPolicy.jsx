// // EditPolicy.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";
// import DateInput from "../../../components/DateInput/DateInput"; // DateInput component import
// import Select from 'react-select';

// const EditPolicy = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [policy, setPolicy] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [insuranceCompanies, setInsuranceCompanies] = useState([]);
//   const [insuranceTypes, setInsuranceTypes] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [formData, setFormData] = useState({
//     policyNumber: '',
//     policyHolder: { type: '', name: '', entityId: '' },
//     insuranceCompany: '',
//     insuranceType: '',
//     coverageAmount: '',
//     premiumAmount: '',
//     premiumPaidBy: 'By Rapid',
//     startDate: '',
//     endDate: '',
//     duration: '',
//     status: 'active',
//     narration: ''
//   });

//   // Helper functions for date calculations
//   const addYearsToDate = (dateStr, years) => {
//     if (!dateStr || !years) return '';

//     try {
//       // Parse dd-mm-yyyy format
//       const [day, month, year] = dateStr.split('-').map(Number);
//       const date = new Date(year, month - 1, day);

//       // Add years
//       date.setFullYear(date.getFullYear() + years);

//       // Subtract one day
//       date.setDate(date.getDate() - 1);

//       // Format back to dd-mm-yyyy
//       return formatDateToDDMMYYYY(date);
//     } catch (error) {
//       console.error('Error adding years to date:', error);
//       return '';
//     }
//   };

//   const calculateDurationInYears = (startDateStr, endDateStr) => {
//     if (!startDateStr || !endDateStr) return '';

//     try {
//       // Parse dd-mm-yyyy format
//       const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number);
//       const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number);

//       const startDate = new Date(startYear, startMonth - 1, startDay);
//       const endDate = new Date(endYear, endMonth - 1, endDay);

//       // Calculate difference in milliseconds
//       const diffInMs = endDate - startDate;

//       // Convert to days
//       const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

//       // Add 1 day since end date is inclusive
//       const totalDays = diffInDays + 1;

//       // Calculate years with decimal for partial years
//       const years = totalDays / 365.25;

//       // Round to 1 decimal place for display
//       return Math.round(years * 10) / 10;
//     } catch (error) {
//       console.error('Error calculating duration:', error);
//       return '';
//     }
//   };

//   const formatDateToDDMMYYYY = (date) => {
//     if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // Get today's date in dd-mm-yyyy format
//   const getTodayDate = () => {
//     return formatDateToDDMMYYYY(new Date());
//   };

//   // Function to convert dd-mm-yyyy to ISO for API
//   const convertToISO = (dateStr) => {
//     if (!dateStr) return '';

//     try {
//       const [day, month, year] = dateStr.split('-').map(Number);
//       const date = new Date(year, month - 1, day);

//       // Format to YYYY-MM-DD
//       const isoDate = date.toISOString().split('T')[0];
//       return isoDate;
//     } catch (error) {
//       console.error('Error converting to ISO:', error);
//       return '';
//     }
//   };

//   // Fetch policy data
//   const fetchPolicy = async () => {
//     try {
//       setLoading(true);
//       const response = await apiHelpers.getById(apiEndpoints.policies.get, id);
//       setPolicy(response.data);
//       setFormData({
//         policyNumber: response.data.policyNumber || '',
//         policyHolder: {
//           type: response.data.policyHolder?.type || '',
//           name: response.data.policyHolder?.name || '',
//           entityId: response.data.policyHolder?.entityId || ''
//         },
//         insuranceCompany: response.data.insuranceCompany?._id || '',
//         insuranceType: response.data.insuranceType?._id || '',
//         coverageAmount: response.data.coverageAmount || '',
//         premiumAmount: response.data.premiumAmount || '',
//         premiumPaidBy: response.data.paidBy === 'by_company' ? 'By Rapid' :
//           (response.data.paidBy === 'by_hospital' ? 'By Hospital' : 'By Doctor'),
//         startDate: response.data.startDate ? formatDateToDDMMYYYY(new Date(response.data.startDate)) : getTodayDate(),
//         endDate: response.data.endDate ? formatDateToDDMMYYYY(new Date(response.data.endDate)) : '',
//         duration: response.data.duration || '', // Add duration field
//         status: response.data.status || 'active',
//         narration: response.data.narration || ''
//       });
//     } catch (error) {
//       console.error('Error fetching policy:', error);
//       alert('Failed to load policy data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch dropdown data
//   const fetchDropdownData = async () => {
//     try {
//       setLoading(true);

//       // Fetch insurance companies
//       const companiesResponse = await apiHelpers.getList(apiEndpoints.insuranceCompanies.list);
//       console.log('Insurance companies received:', companiesResponse.data);
//       setInsuranceCompanies(companiesResponse.data);

//       // Fetch insurance types
//       const typesResponse = await apiHelpers.getList(apiEndpoints.insuranceTypes.list);
//       console.log('Insurance types received:', typesResponse.data);
//       setInsuranceTypes(typesResponse.data);

//       // Fetch all doctors with pagination and filter for closed typeOfEnquiry
//       try {
//         const doctorsResponse = await apiHelpers.getList(apiEndpoints.doctors.forpolicy, { page: 1, limit: 1000 });
//         console.log('Doctors received:', doctorsResponse.data);
//         const closedDoctors = doctorsResponse.data.filter(doctor =>
//           doctor.typeOfEnquiry === 'closed' ||
//           doctor.doctorType === 'hospital' ||
//           doctor.doctorType === 'hospital_individual'
//         );
//         setDoctors(closedDoctors);
//       } catch (error) {
//         console.warn('Doctors API not available:', error);
//       }

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);

//       // Map frontend fields to backend expected format
//       const payload = {
//         ...formData,
//         policyHolder: {
//           type: formData.policyHolder.type,
//           name: formData.policyHolder.name,
//           entityId: formData.policyHolder.entityId
//         },
//         coverageAmount: parseFloat(formData.coverageAmount) || 0,
//         premiumAmount: parseFloat(formData.premiumAmount) || 0,
//         duration: parseFloat(formData.duration) || 0, // Add duration field
//         startDate: convertToISO(formData.startDate),
//         endDate: convertToISO(formData.endDate),
//         paidBy: formData.premiumPaidBy === 'By Rapid' ? 'by_company' :
//           (formData.premiumPaidBy === 'By Hospital' ? 'by_hospital' : 'by_doctor')
//       };

//       // Remove the frontend-only field
//       delete payload.premiumPaidBy;

//       await apiHelpers.update(apiEndpoints.policies.update, id, payload);
//       alert('Policy updated successfully!');
//       navigate('/admin/policy');
//     } catch (error) {
//       console.error('Error updating policy:', error);
//       alert('Failed to update policy');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle input changes
//   const handleChange = (field, value) => {
//     setFormData(prev => {
//       const newData = { ...prev };

//       if (field === 'policyHolder') {
//         // Handle policyHolder object separately
//         newData.policyHolder = { ...prev.policyHolder, ...value };
//       } else {
//         newData[field] = value;
//       }

//       // Special handling for date-related fields
//       if (field === 'startDate' || field === 'endDate' || field === 'duration') {
//         const newValue = value || '';

//         if (field === 'startDate') {
//           newData.startDate = newValue;

//           // If both start date and duration exist, calculate end date
//           if (newValue && newData.duration) {
//             const endDate = addYearsToDate(newValue, parseFloat(newData.duration));
//             newData.endDate = endDate;
//           }
//           // If both start date and end date exist, recalculate duration
//           else if (newValue && newData.endDate) {
//             const duration = calculateDurationInYears(newValue, newData.endDate);
//             newData.duration = duration.toString();
//           }
//         }
//         else if (field === 'endDate') {
//           newData.endDate = newValue;

//           // If both start date and end date exist, calculate duration
//           if (newData.startDate && newValue) {
//             const duration = calculateDurationInYears(newData.startDate, newValue);
//             newData.duration = duration.toString();
//           }
//           // Clear duration if end date is cleared
//           else if (!newValue) {
//             newData.duration = '';
//           }
//         }
//         else if (field === 'duration') {
//           newData.duration = newValue;

//           // If both start date and duration exist, calculate end date
//           if (newData.startDate && newValue && !isNaN(parseFloat(newValue))) {
//             const endDate = addYearsToDate(newData.startDate, parseFloat(newValue));
//             newData.endDate = endDate;
//           }
//           // Clear end date if duration is cleared
//           else if (!newValue) {
//             newData.endDate = '';
//           }
//         }
//       }
//       else if (field === 'insuranceCompany') {
//         newData[field] = value;
//         // Reset insurance type when company changes
//         newData.insuranceType = '';
//       }

//       return newData;
//     });
//   };

//   // Format options for React Select
//   const formatDoctorOptions = (doctorsList) => {
//     return doctorsList.map(doctor => ({
//       value: doctor._id,
//       label: `${doctor.fullName || doctor.hospitalName} - ${doctor.employeeId || doctor.membershipId || 'No ID'}`,
//       ...doctor
//     }));
//   };

//   const formatHospitalOptions = (hospitalsList) => {
//     return hospitalsList.map(hospital => ({
//       value: hospital._id,
//       label: `${hospital.hospitalName || hospital.fullName}${hospital.membershipId ? ` - ${hospital.membershipId}` : ''}`,
//       ...hospital
//     }));
//   };

//   // Filter hospitals from doctors list - include both hospital and hospital_individual types
//   const filterHospitals = () => {
//     return doctors.filter(doctor =>
//       doctor.doctorType === 'hospital' ||
//       doctor.doctorType === 'hospital_individual' ||
//       doctor.membershipType === 'Hospital'
//     );
//   };

//   useEffect(() => {
//     fetchPolicy();
//     fetchDropdownData();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           <p className="mt-2 text-gray-600">Loading policy data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!policy) {
//     return (
//       <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//         <div className="text-center py-8 text-gray-500">
//           <p>Policy not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Policy</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.policyNumber}
//               onChange={(e) => handleChange('policyNumber', e.target.value)}
//               disabled={saving}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Policy Holder Type</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.policyHolder.type}
//               onChange={(e) => handleChange('policyHolder', { ...formData.policyHolder, type: e.target.value })}
//               disabled={saving}
//             >
//               <option value="">Select Type</option>
//               <option value="doctor">Doctor</option>
//               <option value="hospital">Hospital</option>
//               <option value="individual">Individual</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Policy Holder</label>
//             {formData.policyHolder.type === 'hospital' ? (
//               <Select
//                 options={formatHospitalOptions(filterHospitals())}
//                 value={formatHospitalOptions(filterHospitals()).find(option => option.value === formData.policyHolder.entityId)}
//                 onChange={(selectedOption) => {
//                   handleChange('policyHolder', {
//                     ...formData.policyHolder,
//                     entityId: selectedOption?.value || '',
//                     name: selectedOption?.label || ''
//                   });
//                 }}
//                 placeholder="Select Hospital"
//                 isDisabled={saving}
//                 isClearable
//               />
//             ) : (
//               <Select
//                 options={formatDoctorOptions(doctors)}
//                 value={formatDoctorOptions(doctors).find(option => option.value === formData.policyHolder.entityId)}
//                 onChange={(selectedOption) => {
//                   handleChange('policyHolder', {
//                     ...formData.policyHolder,
//                     entityId: selectedOption?.value || '',
//                     name: selectedOption?.label || ''
//                   });
//                 }}
//                 placeholder="Select Doctor"
//                 isDisabled={saving}
//                 isClearable
//               />
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.insuranceCompany}
//               onChange={(e) => handleChange('insuranceCompany', e.target.value)}
//               disabled={saving}
//             >
//               <option value="">Select Company</option>
//               {insuranceCompanies.map(company => (
//                 <option key={company._id} value={company._id}>
//                   {company.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.insuranceType}
//               onChange={(e) => handleChange('insuranceType', e.target.value)}
//               disabled={saving}
//             >
//               <option value="">Select Type</option>
//               {insuranceTypes
//                 .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
//                 .map(type => (
//                   <option key={type._id} value={type._id}>
//                     {type.name}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
//             <input
//               type="number"
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.coverageAmount}
//               onChange={(e) => handleChange('coverageAmount', e.target.value)}
//               disabled={saving}
//               placeholder="500000"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
//             <input
//               type="number"
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.premiumAmount}
//               onChange={(e) => handleChange('premiumAmount', e.target.value)}
//               disabled={saving}
//               placeholder="1200"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.premiumPaidBy}
//               onChange={(e) => handleChange('premiumPaidBy', e.target.value)}
//               disabled={saving}
//             >
//               <option value="By Rapid">By Rapid</option>
//               <option value="By Doctor">By Doctor</option>
//               <option value="By Hospital">By Hospital</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <DateInput
//               value={formData.startDate}
//               onChange={(value) => handleChange('startDate', value)}
//               placeholder="dd-mm-yyyy"
//               returnFormat="dd-mm-yyyy"
//               disabled={saving}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <DateInput
//               value={formData.endDate}
//               onChange={(value) => handleChange('endDate', value)}
//               placeholder="dd-mm-yyyy"
//               returnFormat="dd-mm-yyyy"
//               minDate={formData.startDate}
//               disabled={saving}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
//             <input
//               type="number"
//               step="0.5"
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.duration}
//               onChange={(e) => handleChange('duration', e.target.value)}
//               disabled={saving}
//               placeholder="1, 2, 3, etc."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               value={formData.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//               disabled={saving}
//             >
//               <option value="active">Active</option>
//               <option value="expired">Expired</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
//             <input
//               type="file"
//               className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               disabled={saving}
//             />
//             <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
//           <textarea
//             className="w-full p-2 border border-gray-300 rounded-md bg-white"
//             rows={3}
//             value={formData.narration}
//             onChange={(e) => handleChange('narration', e.target.value)}
//             disabled={saving}
//           />
//         </div>

//         <div className="flex justify-start space-x-3 mt-6">
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/admin/policy')}
//             disabled={saving}
//             className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default EditPolicy;





















// EditPolicy.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";
import DateInput from "../../../components/DateInput/DateInput";
import Select from 'react-select';

const EditPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);


  const [existingDocuments, setExistingDocuments] = useState({
    policyDocument: '',
    proposalForm: '',
    otherDocuments: []
  });


  const [files, setFiles] = useState({
    policyDocument: null,
    proposalForm: null,
    otherDocuments: []
  });



  const [formData, setFormData] = useState({
    policyNumber: '',
    policyHolder: { type: '', name: '', entityId: '' },
    insuranceCompany: '',
    insuranceType: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: '',
    endDate: '',
    duration: '',
    status: 'active',
    narration: ''
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

      // Subtract one day
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
      // Create date at noon to avoid timezone issues
      const date = new Date(year, month - 1, day, 12, 0, 0, 0);

      // Format to YYYY-MM-DD
      const isoDate = date.toISOString().split('T')[0];
      return isoDate;
    } catch (error) {
      console.error('Error converting to ISO:', error);
      return '';
    }
  };

  // Helper to format backend file paths to correct URLs
  const formatBackendPath = (path) => {
    if (!path) return '';
    // Fix Windows paths and absolute paths
    const cleanPath = path.toString().replace(/\\/g, '/');

    // Find where 'uploads/' starts
    const uploadsIndex = cleanPath.indexOf('uploads/');

    if (uploadsIndex !== -1) {
      // Extract part starting from 'uploads/'
      const relativePath = cleanPath.substring(uploadsIndex);

      // Get base URL (remove /api if it exists in the env var)
      const apiBase = import.meta.env.VITE_API_URI || 'http://localhost:3000';
      const baseUrl = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api

      return `${baseUrl}/${relativePath}`;
    }

    // Fallback for paths that might not contain 'uploads/' (shouldn't handle normally but just in case)
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URI || 'http://localhost:3000'}/${path}`;
  };

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.getById(apiEndpoints.policies.get, id);
      setPolicy(response.data);

      // Handle the case where policyHolder.entityId might be an object with populated data
      let entityIdValue = '';
      let entityName = response.data.policyHolder?.name || '';

      if (response.data.policyHolder?.entityId) {
        if (typeof response.data.policyHolder.entityId === 'object' && response.data.policyHolder.entityId._id) {
          entityIdValue = response.data.policyHolder.entityId._id;
          // For hospital type, use hospitalName if available, otherwise fullName
          if (response.data.policyHolder.type === 'hospital') {
            entityName = response.data.policyHolder.entityId.hospitalName ||
              response.data.policyHolder.entityId.fullName ||
              entityName;
          } else {
            // For doctor/individual type, use fullName if available, otherwise hospitalName
            entityName = response.data.policyHolder.entityId.fullName ||
              response.data.policyHolder.entityId.hospitalName ||
              entityName;
          }
        } else if (typeof response.data.policyHolder.entityId === 'string') {
          entityIdValue = response.data.policyHolder.entityId;
        }
      }

      // Calculate duration if not present but start and end dates are available
      let calculatedDuration = response.data.duration || '';
      if (!calculatedDuration && response.data.startDate && response.data.endDate) {
        const startDate = new Date(response.data.startDate);
        const endDate = new Date(response.data.endDate);
        const diffInMs = endDate - startDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const totalDays = diffInDays + 1; // Add 1 day since end date is inclusive
        const years = totalDays / 365.25;
        calculatedDuration = Math.round(years * 10) / 10; // Round to 1 decimal place
      }

      setFormData({
        policyNumber: response.data.policyNumber || '',
        policyHolder: {
          type: response.data.policyHolder?.type || '',
          name: entityName,
          entityId: entityIdValue
        },
        insuranceCompany: response.data.insuranceCompany?._id || '',
        insuranceType: response.data.insuranceType?._id || '',
        coverageAmount: response.data.coverageAmount || '',
        premiumAmount: response.data.premiumAmount || '',
        premiumPaidBy: response.data.paidBy === 'by_company' ? 'By Rapid' :
          (response.data.paidBy === 'by_hospital' ? 'By Hospital' : 'By Doctor'),
        // startDate: response.data.startDate ? formatDateToDDMMYYYY(new Date(response.data.startDate)) : getTodayDate(),
        // endDate: response.data.endDate ? formatDateToDDMMYYYY(new Date(response.data.endDate)) : '',



        startDate: response.data.startDate
          ? (() => {
            const [y, m, d] = response.data.startDate.split('T')[0].split('-').map(Number);
            const date = new Date(y, m - 1, d);
            return formatDateToDDMMYYYY(date);
          })()
          : getTodayDate(),

        endDate: response.data.endDate
          ? (() => {
            const [y, m, d] = response.data.endDate.split('T')[0].split('-').map(Number);
            const date = new Date(y, m - 1, d);
            return formatDateToDDMMYYYY(date);
          })()
          : '',

        duration: calculatedDuration,
        status: response.data.status || 'active',
        narration: response.data.narration || ''
      });




      setExistingDocuments({
        policyDocument: response.data.documents?.policyDocument
          ? formatBackendPath(response.data.documents.policyDocument)
          : '',
        proposalForm: response.data.documents?.proposalForm
          ? formatBackendPath(response.data.documents.proposalForm)
          : '',
        otherDocuments: response.data.documents?.otherDocuments?.map(path =>
          formatBackendPath(path)
        ) || []
      });



    } catch (error) {
      console.error('Error fetching policy:', error);
      alert('Failed to load policy data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      setLoading(true);

      // Fetch insurance companies
      const companiesResponse = await apiHelpers.getList(apiEndpoints.insuranceCompanies.list);
      console.log('Insurance companies received:', companiesResponse.data);
      setInsuranceCompanies(companiesResponse.data);

      // Fetch insurance types
      const typesResponse = await apiHelpers.getList(apiEndpoints.insuranceTypes.list);
      console.log('Insurance types received:', typesResponse.data);
      setInsuranceTypes(typesResponse.data);

      // Fetch all doctors with pagination and filter for closed typeOfEnquiry
      try {
        const doctorsResponse = await apiHelpers.getList(apiEndpoints.doctors.forpolicy, { page: 1, limit: 20000 });
        console.log('Doctors received:', doctorsResponse.data);
        const closedDoctors = doctorsResponse.data.filter(doctor =>
          doctor.typeOfEnquiry === 'closed' ||
          doctor.doctorType === 'hospital' ||
          doctor.doctorType === 'hospital_individual'
        );
        setDoctors(closedDoctors);
      } catch (error) {
        console.warn('Doctors API not available:', error);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       setSaving(true);

  //       // Map frontend fields to backend expected format
  //       // const payload = {
  //       //   ...formData,
  //       //   policyHolder: {
  //       //     type: formData.policyHolder.type,
  //       //     name: formData.policyHolder.name,
  //       //     entityId: formData.policyHolder.entityId
  //       //   },
  //       //   coverageAmount: parseFloat(formData.coverageAmount) || 0,
  //       //   premiumAmount: parseFloat(formData.premiumAmount) || 0,
  //       //   duration: parseFloat(formData.duration) || 0,
  //       //   startDate: convertToISO(formData.startDate),
  //       //   endDate: convertToISO(formData.endDate),
  //       //   paidBy: formData.premiumPaidBy === 'By Rapid' ? 'by_company' :
  //       //     (formData.premiumPaidBy === 'By Hospital' ? 'by_hospital' : 'by_doctor'),
  //       //     status: formData.status,
  //       // narration: formData.narration
  //       // };



  // const payload = {
  //       policyNumber: formData.policyNumber,
  //       policyHolder: {
  //         type: formData.policyHolder.type || '',      // ← Ensure string
  //         name: formData.policyHolder.name || '',      // ← Ensure string
  //         entityId: formData.policyHolder.entityId || ''
  //       },
  //       insuranceCompany: formData.insuranceCompany,
  //       insuranceType: formData.insuranceType,
  //       coverageAmount: parseFloat(formData.coverageAmount) || 0,
  //       premiumAmount: parseFloat(formData.premiumAmount) || 0,
  //       duration: parseFloat(formData.duration) || 0,
  //       startDate: convertToISO(formData.startDate),
  //       endDate: formData.endDate ? convertToISO(formData.endDate) : null,
  //       paidBy: formData.premiumPaidBy === 'By Rapid' ? 'by_company' :
  //         (formData.premiumPaidBy === 'By Hospital' ? 'by_hospital' : 'by_doctor'),
  //       status: formData.status,
  //       narration: formData.narration || ''
  //     };



  //     //   // Remove the frontend-only field
  //     //   delete payload.premiumPaidBy;

  //     //   await apiHelpers.update(apiEndpoints.policies.update, id, payload);
  //     //   alert('Policy updated successfully!');
  //     //   navigate('/admin/policy');
  //     // } catch (error) {
  //     //   console.error('Error updating policy:', error);
  //     //   alert('Failed to update policy');
  //     // } finally {
  //     //   setSaving(false);
  //     // }



  // // Agar koi file hai to updateWithDocuments use karo
  //     if (files.policyDocument || files.proposalForm || files.otherDocuments.length > 0) {
  //       await apiHelpers.updateWithDocuments(
  //         apiEndpoints.policies.update,
  //         id,
  //         payload,
  //         files
  //       );
  //     } else {
  //       // Nahi to normal update
  //       await apiHelpers.update(apiEndpoints.policies.update, id, payload);
  //     }

  //     alert('Policy updated successfully!');
  //     navigate('/admin/policy');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Failed: ' + (error.response?.data?.message || error.message));
  //   } finally {
  //     setSaving(false);
  //   }

  //   };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // === Flat fields (direct req.body mein jayenge) ===
      formDataToSend.append('policyNumber', formData.policyNumber || '');
      formDataToSend.append('insuranceCompany', formData.insuranceCompany || '');
      formDataToSend.append('insuranceType', formData.insuranceType || '');
      formDataToSend.append('coverageAmount', parseFloat(formData.coverageAmount) || 0);
      formDataToSend.append('premiumAmount', parseFloat(formData.premiumAmount) || 0);
      formDataToSend.append('duration', parseFloat(formData.duration) || 0);
      formDataToSend.append('startDate', convertToISO(formData.startDate));
      if (formData.endDate) {
        formDataToSend.append('endDate', convertToISO(formData.endDate));
      }
      formDataToSend.append('paidBy', formData.premiumPaidBy === 'By Rapid' ? 'by_company' :
        (formData.premiumPaidBy === 'By Hospital' ? 'by_hospital' : 'by_doctor'));
      formDataToSend.append('status', formData.status);
      if (formData.narration) {
        formDataToSend.append('narration', formData.narration);
      }

      // === policyHolder nested object - multer compatible way ===
      formDataToSend.append('policyHolder[type]', formData.policyHolder.type || '');
      formDataToSend.append('policyHolder[name]', formData.policyHolder.name || '');
      formDataToSend.append('policyHolder[entityId]', formData.policyHolder.entityId || '');

      // === Files append (only if new file selected) ===
      // Log files for debugging
      console.log('Files to upload:', files);

      // Check if files exist and are valid before appending
      if (files.policyDocument && files.policyDocument instanceof File) {
        console.log('Appending policyDocument:', files.policyDocument.name, 'Size:', files.policyDocument.size, 'Type:', files.policyDocument.type);
        formDataToSend.append('policyDocument', files.policyDocument, files.policyDocument.name);
      } else {
        console.log('No policyDocument to upload or not a valid file');
      }

      if (files.proposalForm && files.proposalForm instanceof File) {
        console.log('Appending proposalForm:', files.proposalForm.name, 'Size:', files.proposalForm.size, 'Type:', files.proposalForm.type);
        formDataToSend.append('proposalForm', files.proposalForm, files.proposalForm.name);
      } else {
        console.log('No proposalForm to upload or not a valid file');
      }

      if (files.otherDocuments && Array.isArray(files.otherDocuments) && files.otherDocuments.length > 0) {
        console.log('Appending otherDocuments:', files.otherDocuments.length);
        files.otherDocuments.forEach((file, index) => {
          if (file instanceof File) {
            console.log(`Appending otherDocument[${index}]:`, file.name, 'Size:', file.size, 'Type:', file.type);
            formDataToSend.append('otherDocuments', file, file.name);
          } else {
            console.log(`otherDocument[${index}] is not a valid file`);
          }
        });
      } else {
        console.log('No otherDocuments to upload or not a valid array');
      }

      // Log form data entries for debugging
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `[File: ${value.name}, Size: ${value.size}, Type: ${value.type}]`);
        } else {
          console.log(key, value);
        }
      }

      // === MOST IMPORTANT: Content-Type header mat set karo! Let browser auto-set it ===
      const response = await apiClient.put(apiEndpoints.policies.update(id), formDataToSend, {
        headers: {
          'Content-Type': undefined,
        }
      });

      console.log('Update response:', response);

      alert('Policy updated successfully!');
      navigate('/admin/policy');

    } catch (error) {
      console.error('Update failed:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error config:', error.config);
      alert('Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };




  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };

      if (field === 'policyHolder') {
        newData.policyHolder = { ...prev.policyHolder, ...value };
      } else {
        newData[field] = value;
      }

      // Special handling for date-related fields
      if (field === 'startDate' || field === 'endDate' || field === 'duration') {
        const newValue = value || '';

        if (field === 'startDate') {
          newData.startDate = newValue;

          if (newValue && newData.duration) {
            const endDate = addYearsToDate(newValue, parseFloat(newData.duration));
            newData.endDate = endDate;
          }
          else if (newValue && newData.endDate) {
            const duration = calculateDurationInYears(newValue, newData.endDate);
            newData.duration = duration.toString();
          }
        }
        else if (field === 'endDate') {
          newData.endDate = newValue;

          if (newData.startDate && newValue) {
            const duration = calculateDurationInYears(newData.startDate, newValue);
            newData.duration = duration.toString();
          }
          else if (!newValue) {
            newData.duration = '';
          }
        }
        else if (field === 'duration') {
          newData.duration = newValue;

          if (newData.startDate && newValue && !isNaN(parseFloat(newValue))) {
            const endDate = addYearsToDate(newData.startDate, parseFloat(newValue));
            newData.endDate = endDate;
          }
          else if (!newValue) {
            newData.endDate = '';
          }
        }
      }
      else if (field === 'insuranceCompany') {
        newData[field] = value;
        newData.insuranceType = '';
      }

      return newData;
    });
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

  // Filter hospitals from doctors list
  const filterHospitals = () => {
    return doctors.filter(doctor =>
      doctor.doctorType === 'hospital' ||
      doctor.doctorType === 'hospital_individual' ||
      doctor.membershipType === 'Hospital'
    );
  };

  // Memoized options - YE FIX ADD KIYA HAI
  const doctorOptions = useMemo(() => formatDoctorOptions(doctors), [doctors]);

  const hospitalOptions = useMemo(() => formatHospitalOptions(filterHospitals()), [doctors]);

  useEffect(() => {
    fetchPolicy();
    fetchDropdownData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading policy data...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="text-center py-8 text-gray-500">
          <p>Policy not found</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Policy</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.policyNumber}
              onChange={(e) => handleChange('policyNumber', e.target.value)}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Holder Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.policyHolder.type}
              onChange={(e) => handleChange('policyHolder', { ...formData.policyHolder, type: e.target.value })}
              disabled={saving}
            >
              <option value="">Select Type</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Holder</label>
            {formData.policyHolder.type === 'hospital' ? (
              <Select
                options={hospitalOptions}
                value={hospitalOptions.find(option => option.value === formData.policyHolder.entityId) || null}
                onChange={(selectedOption) => {
                  handleChange('policyHolder', {
                    ...formData.policyHolder,
                    entityId: selectedOption?.value || '',
                    name: selectedOption?.label || ''
                  });
                }}
                placeholder="Select Hospital"
                isDisabled={saving}
                isClearable
                isLoading={loading}
              />
            ) : (
              <Select
                options={doctorOptions}
                value={doctorOptions.find(option => option.value === formData.policyHolder.entityId) || null}
                onChange={(selectedOption) => {
                  handleChange('policyHolder', {
                    ...formData.policyHolder,
                    entityId: selectedOption?.value || '',
                    name: selectedOption?.label || ''
                  });
                }}
                placeholder="Select Doctor"
                isDisabled={saving}
                isClearable
                isLoading={loading}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.insuranceCompany}
              onChange={(e) => handleChange('insuranceCompany', e.target.value)}
              disabled={saving}
            >
              <option value="">Select Company</option>
              {insuranceCompanies.map(company => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.insuranceType}
              onChange={(e) => handleChange('insuranceType', e.target.value)}
              disabled={saving}
            >
              <option value="">Select Type</option>
              {insuranceTypes
                .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
                .map(type => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.coverageAmount}
              onChange={(e) => handleChange('coverageAmount', e.target.value)}
              disabled={saving}
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.premiumAmount}
              onChange={(e) => handleChange('premiumAmount', e.target.value)}
              disabled={saving}
              placeholder="1200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.premiumPaidBy}
              onChange={(e) => handleChange('premiumPaidBy', e.target.value)}
              disabled={saving}
            >
              <option value="By Rapid">By Rapid</option>
              <option value="By Doctor">By Doctor</option>
              <option value="By Hospital">By Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DateInput
              value={formData.startDate}
              onChange={(value) => handleChange('startDate', value)}
              placeholder="dd-mm-yyyy"
              returnFormat="dd-mm-yyyy"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DateInput
              value={formData.endDate}
              onChange={(value) => handleChange('endDate', value)}
              placeholder="dd-mm-yyyy"
              returnFormat="dd-mm-yyyy"
              minDate={formData.startDate}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
            <input
              type="number"
              step="0.5"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              disabled={saving}
              placeholder="1, 2, 3, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={saving}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
          </div> */}




          {/* Policy Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Document</label>

            {/* Existing Document Preview */}
            {existingDocuments.policyDocument && !files.policyDocument && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-800 mb-2">Current Document:</p>
                <a
                  href={existingDocuments.policyDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  📄 View / Download Current Policy Document
                </a>
                {existingDocuments.policyDocument.endsWith('.jpg') ||
                  existingDocuments.policyDocument.endsWith('.jpeg') ||
                  existingDocuments.policyDocument.endsWith('.png') ? (
                  <img
                    src={existingDocuments.policyDocument}
                    alt="Current Policy Document"
                    className="mt-3 max-w-md max-h-96 border rounded shadow"
                  />
                ) : null}
              </div>
            )}

            {/* New Upload */}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                setFiles(prev => ({ ...prev, policyDocument: file || null }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={saving}
            />

            {files.policyDocument && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✓ New file selected: {files.policyDocument.name} (will replace current)
              </p>
            )}
          </div>

          {/* Proposal Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Form</label>

            {existingDocuments.proposalForm && !files.proposalForm && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-800 mb-2">Current Proposal Form:</p>
                <a
                  href={existingDocuments.proposalForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  📄 View / Download Current Proposal Form
                </a>
              </div>
            )}

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                setFiles(prev => ({ ...prev, proposalForm: file || null }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={saving}
            />

            {files.proposalForm && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✓ New file selected: {files.proposalForm.name}
              </p>
            )}
          </div>

          {/* Other Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Documents (Multiple)</label>

            {existingDocuments.otherDocuments.length > 0 && files.otherDocuments.length === 0 && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Current Other Documents ({existingDocuments.otherDocuments.length}):
                </p>
                <div className="space-y-1">
                  {existingDocuments.otherDocuments.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm"
                    >
                      📎 Document {idx + 1} - View / Download
                    </a>
                  ))}
                </div>
              </div>
            )}

            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                setFiles(prev => ({ ...prev, otherDocuments: newFiles }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={saving}
            />

            {files.otherDocuments.length > 0 && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✓ {files.otherDocuments.length} new file(s) selected (will be added)
              </p>
            )}
          </div>





        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            rows={3}
            value={formData.narration}
            onChange={(e) => handleChange('narration', e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="flex justify-start space-x-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/policy')}
            disabled={saving}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPolicy;