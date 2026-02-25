import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

// Get API base URL for document serving (remove /api suffix)
const getApiBaseUrl = () => {
  try {
    // Try to get from environment variable (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return apiUrl.replace('/api', '');
    }
  } catch (e) {
    // Fallback if import.meta is not available
  }
  // Default fallback
  return 'http://localhost:3000';
};

const ViewDoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    qualification: '',
    experience: '',
    licenseNumber: '',
    registrationYear: '',
    aadharNumber: '',
    panNumber: '',
    specialization: [],
    hospitalName: '',
    membershipDate: '',
    membershipType: '',
    typeOfEnquiry: '',
    doctorStatus: '',
    status: '',
    remarks: '',
    hospitalAddress: {
      address: '',
      city: '',
      state: '',
      district: '',
      taluka: '',
      pinCode: '',
      country: 'India'
    },
    hospitalDetails: {
      hospitalType: '',
      beds: '',
      establishmentYear: '',
      website: '',
      ownershipType: 'Private',
      director: { name: '', contact: '', email: '' },
      admin: { name: '', contact: '', email: '' },
      departments: []
    },
    contactDetails: {
      phoneNumber: '',
      whatsapp: '',
      emailId: '',
      currentAddress: {
        address: '',
        city: '',
        state: '',
        district: '',
        taluka: '',
        pinCode: '',
        country: 'India'
      }
    },
    documents: {
      // Individual Documents
      aadhar: '',
      pan: '',
      medicalRegistration: '',
      additionalQualification: '',
      visitingCard: '',
      bankDetails: '',
      // Hospital Documents
      hospitalPanDocument: '',
      registrationCertificate: '',
      hospitalGstDocument: '',
      ownerPanCard: '',
      ownerAadhaarCard: '',
      // Legacy fields
      license: '',
      qualificationDoc: '',
      otherDocs: []
    }
  });

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState({
    // Individual Documents
    aadhar: null,
    pan: null,
    medicalRegistration: null,
    additionalQualification: null,
    visitingCard: null,
    bankDetails: null,
    // Hospital Documents
    hospitalPanDocument: null,
    registrationCertificate: null,
    hospitalGstDocument: null,
    ownerPanCard: null,
    ownerAadhaarCard: null,
    // Legacy fields
    license: null,
    qualificationDoc: null,
    otherDocs: []
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
        if (response.data.success) {
          const doctorData = response.data.data;
          // If the doctor is linked with a spouse, use mainDoctor data
          // Otherwise, use the original data structure
          const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
          setDoctor(processedDoctorData);

          // If in edit mode, populate form data
          if (isEditMode) {
            setFormData({
              fullName: processedDoctorData.fullName || '',
              dateOfBirth: processedDoctorData.dateOfBirth ? new Date(processedDoctorData.dateOfBirth).toISOString().split('T')[0] : '',
              email: processedDoctorData.email || '',
              phoneNumber: processedDoctorData.phoneNumber || '',
              whatsappNumber: processedDoctorData.whatsappNumber || '',
              qualification: processedDoctorData.qualification || '',
              experience: processedDoctorData.experience || '',
              licenseNumber: processedDoctorData.licenseNumber || '',
              registrationYear: processedDoctorData.registrationYear || '',
              aadharNumber: processedDoctorData.aadharNumber || '',
              panNumber: processedDoctorData.panNumber || '',
              specialization: processedDoctorData.specialization || [],
              hospitalName: processedDoctorData.hospitalName || '',
              membershipDate: processedDoctorData.membershipDate ? new Date(processedDoctorData.membershipDate).toISOString().split('T')[0] : '',
              membershipType: processedDoctorData.membershipType || '',
              typeOfEnquiry: processedDoctorData.typeOfEnquiry || '',
              doctorStatus: processedDoctorData.doctorStatus || '',
              status: processedDoctorData.status || '',
              remarks: processedDoctorData.remarks || '',
              hospitalAddress: processedDoctorData.hospitalAddress || {
                address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
              },
              hospitalDetails: processedDoctorData.hospitalDetails || {
                hospitalType: '', beds: '', establishmentYear: '', website: '', ownershipType: 'Private',
                director: { name: '', contact: '', email: '' },
                admin: { name: '', contact: '', email: '' },
                departments: []
              },
              contactDetails: processedDoctorData.contactDetails || {
                phoneNumber: '', whatsapp: '', emailId: '',
                currentAddress: { address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India' }
              },
              documents: {
                // Individual Documents
                aadhar: processedDoctorData.documents?.aadhar || '',
                pan: processedDoctorData.documents?.pan || '',
                medicalRegistration: processedDoctorData.documents?.medicalRegistration || '',
                additionalQualification: processedDoctorData.documents?.additionalQualification || '',
                visitingCard: processedDoctorData.documents?.visitingCard || '',
                bankDetails: processedDoctorData.documents?.bankDetails || '',
                // Hospital Documents
                hospitalPanDocument: processedDoctorData.documents?.hospitalPanDocument || '',
                registrationCertificate: processedDoctorData.documents?.registrationCertificate || '',
                hospitalGstDocument: processedDoctorData.documents?.hospitalGstDocument || '',
                ownerPanCard: processedDoctorData.documents?.ownerPanCard || '',
                ownerAadhaarCard: processedDoctorData.documents?.ownerAadhaarCard || '',
                // Legacy fields for backward compatibility
                license: processedDoctorData.documents?.license || '',
                qualificationDoc: processedDoctorData.documents?.qualificationDoc || '',
                otherDocs: processedDoctorData.documents?.otherDocs || []
              }
            });
          }
        } else {
          setError("Failed to fetch doctor details");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError(err.response?.data?.message || "Failed to load doctor details");
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id, isEditMode]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDocumentUrl = (filePath) => {
    if (!filePath) return null;
    try {
      const baseUrl = getApiBaseUrl();

      // Handle both old absolute paths and new relative paths
      // For old absolute paths that include system paths like "C:/" or "/home/"
      if (filePath.includes("uploads/")) {
        // Extract the path after 'uploads/'
        let relativePath = filePath;
        if (filePath.includes("uploads/")) {
          const uploadsIndex = filePath.lastIndexOf("uploads/");
          relativePath = filePath.substring(uploadsIndex);
        }
        return `${baseUrl}/${relativePath}`;
      }
      // If already a relative path starting with /uploads
      if (filePath.startsWith("/uploads")) {
        return `${baseUrl}${filePath}`;
      }
      // If it's already a complete URL
      if (filePath.startsWith("http")) {
        return filePath;
      }
      return filePath;
    } catch (error) {
      console.error("Error generating document URL:", error);
      return null;
    }
  };

  // Function to get document name based on field key
  const getDocumentDisplayName = (fieldKey) => {
    const docNameMap = {
      // Individual Documents
      aadhar: 'Aadhar',
      pan: 'PAN',
      medicalRegistration: 'Medical Registration',
      additionalQualification: 'Additional Qualification',
      visitingCard: 'Visiting Card',
      bankDetails: 'Bank Details',
      // Hospital Documents
      hospitalPanDocument: 'Hospital PAN Document',
      registrationCertificate: 'Registration Certificate',
      hospitalGstDocument: 'Hospital GST Document',
      ownerPanCard: 'Owner PAN Card',
      ownerAadhaarCard: 'Owner Aadhaar Card',
      // Legacy fields
      license: 'License/Registration',
      qualificationDoc: 'Qualification Document'
    };
    return docNameMap[fieldKey] || fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleDocumentClick = (filePath) => {
    try {
      const url = getDocumentUrl(filePath);
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Unable to open document. Invalid file path.");
      }
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Error opening document. Please try again.");
    }
  };

  // Form update handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });
  };

  // File upload handler
  const handleFileUpload = async (file, fileType) => {
    if (!file) return;

    const formData = new FormData();
    const fieldNameMap = {
      aadhar: 'aadharCard',
      pan: 'panCard',
      medicalRegistration: 'medicalRegistration',
      additionalQualification: 'additionalQualification',
      visitingCard: 'visitingCard',
      bankDetails: 'bankDetails',
      hospitalPanDocument: 'hospitalPanDocument',
      registrationCertificate: 'registrationCertificate',
      hospitalGstDocument: 'hospitalGstDocument',
      ownerPanCard: 'ownerPanCard',
      ownerAadhaarCard: 'ownerAadhaarCard',
      license: 'medicalRegistration', // maps to medicalRegistration for individual or registrationCertificate for hospital
      qualificationDoc: 'additionalQualification' // maps to pan for individual or hospitalGst for hospital
    };

    // For 'otherDocs', we need special handling
    if (fileType === 'otherDocs') {
      // For otherDocs, we just append with the same name
      formData.append('otherDocs', file);
    } else {
      const backendFieldName = fieldNameMap[fileType] || fileType;
      formData.append(backendFieldName, file);
    }

    try {
      const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        if (fileType === 'otherDocs') {
          // For otherDocs, we need to append to the existing array
          const otherDocPath = response.data.data.otherDocs ? response.data.data.otherDocs[0] : response.data.data[Object.keys(response.data.data)[0]];

          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              otherDocs: [...(prev.documents.otherDocs || []), otherDocPath]
            }
          }));

          // Update uploaded files state for otherDocs
          setUploadedFiles(prev => ({
            ...prev,
            otherDocs: [...(prev.otherDocs || []), file]
          }));
        } else {
          const backendFieldName = fieldNameMap[fileType] || fileType;
          const filePath = response.data.data[backendFieldName];

          // Update form data with new file path
          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [fileType]: filePath
            }
          }));

          // Update uploaded files state
          setUploadedFiles(prev => ({
            ...prev,
            [fileType]: file
          }));
        }

        toast.success(`${fileType === 'otherDocs' ? 'Document' : fileType} uploaded successfully`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${fileType === 'otherDocs' ? 'document' : fileType}`);
    }
  };

  // Save/Update handler
  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare update data
      const updateData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        membershipDate: formData.membershipDate ? new Date(formData.membershipDate) : undefined,
        // Ensure arrays are properly formatted
        specialization: Array.isArray(formData.specialization) ? formData.specialization : [],
        documents: {
          // Individual Documents
          aadhar: formData.documents.aadhar || doctor?.documents?.aadhar || '',
          pan: formData.documents.pan || doctor?.documents?.pan || '',
          medicalRegistration: formData.documents.medicalRegistration || doctor?.documents?.medicalRegistration || '',
          additionalQualification: formData.documents.additionalQualification || doctor?.documents?.additionalQualification || '',
          visitingCard: formData.documents.visitingCard || doctor?.documents?.visitingCard || '',
          bankDetails: formData.documents.bankDetails || doctor?.documents?.bankDetails || '',
          // Hospital Documents
          hospitalPanDocument: formData.documents.hospitalPanDocument || doctor?.documents?.hospitalPanDocument || '',
          registrationCertificate: formData.documents.registrationCertificate || doctor?.documents?.registrationCertificate || '',
          hospitalGstDocument: formData.documents.hospitalGstDocument || doctor?.documents?.hospitalGstDocument || '',
          ownerPanCard: formData.documents.ownerPanCard || doctor?.documents?.ownerPanCard || '',
          ownerAadhaarCard: formData.documents.ownerAadhaarCard || doctor?.documents?.ownerAadhaarCard || '',
          // Legacy fields for backward compatibility
          license: formData.documents.license || doctor?.documents?.license || '',
          qualificationDoc: formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc || '',
          otherDocs: Array.isArray(formData.documents.otherDocs)
            ? formData.documents.otherDocs
            : (doctor?.documents?.otherDocs || [])
        }
      };

      await apiClient.put(apiEndpoints.doctors.update(id), updateData);

      toast.success("Doctor updated successfully");

      // Refresh doctor data
      const response = await apiClient.get(apiEndpoints.doctors.get(id));
      if (response.data.success) {
        setDoctor(response.data.data);
      }

      // Exit edit mode
      navigate(`/view-doctor/${id}`);
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading doctor details...</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "Doctor not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isHospital = doctor.doctorType === "hospital";
  const isIndividual = doctor.doctorType === "individual";
  const isHospitalIndividual = doctor.doctorType === "hospital_individual";

  // Helper component for form inputs
  const FormInput = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
      />
    </div>
  );

  const FormSelect = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const FileUploadInput = ({ label, fileType, currentFile, onFileSelect }) => {
    const fileName = currentFile ? (typeof currentFile === 'string' ? currentFile.split('/').pop() : currentFile.name) : '';
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                handleFileUpload(file, fileType);
              }
            }}
            accept="image/*,.pdf,.doc,.docx"
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
          />
          {fileName && (
            <span className="text-xs text-gray-500 truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
        {currentFile && typeof currentFile === 'string' && (
          <button
            type="button"
            onClick={() => handleDocumentClick(currentFile)}
            className="mt-1 text-xs text-blue-600 hover:underline"
          >
            View current file
          </button>
        )}
      </div>
    );
  };

  // Render edit form
  if (isEditMode) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Doctor Details</h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/view-doctor/${id}`)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Membership ID</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.membershipId || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.doctorId || "N/A"}
                </div>
              </div>
              <FormInput
                label="Membership Date"
                type="date"
                value={formData.membershipDate}
                onChange={(v) => handleInputChange('membershipDate', v)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.membershipType || doctor.membershipType || "N/A"}
                </div>
              </div>
              <FormSelect
                label="Status"
                value={formData.status}
                onChange={(v) => handleInputChange('status', v)}
                options={['pending', 'accepted', 'rejected', 'active', 'inactive']}
              />
              <FormSelect
                label="Lead Status"
                value={formData.typeOfEnquiry}
                onChange={(v) => handleInputChange('typeOfEnquiry', v)}
                options={['cold', 'warm', 'hot', 'follow_up', 'closed']}
              />
              <FormSelect
                label="Sales Status"
                value={formData.doctorStatus}
                onChange={(v) => handleInputChange('doctorStatus', v)}
                options={['cold', 'warm', 'hot', 'follow_up', 'close']}
              />
            </div>
          </div>

          {/* Doctor Information (for Individual/Hospital+Individual) */}
          {(isIndividual || isHospitalIndividual) && (
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(v) => handleInputChange('fullName', v)}
                />
                <FormInput
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(v) => handleInputChange('dateOfBirth', v)}
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleInputChange('email', v)}
                />
                <FormInput
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(v) => handleInputChange('phoneNumber', v)}
                />
                <FormInput
                  label="WhatsApp Number"
                  value={formData.whatsappNumber}
                  onChange={(v) => handleInputChange('whatsappNumber', v)}
                />
                <FormInput
                  label="Qualification"
                  value={formData.qualification}
                  onChange={(v) => handleInputChange('qualification', v)}
                />
                <FormInput
                  label="Experience"
                  value={formData.experience}
                  onChange={(v) => handleInputChange('experience', v)}
                />
                <FormInput
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={(v) => handleInputChange('licenseNumber', v)}
                />
                <FormInput
                  label="Registration Year"
                  value={formData.registrationYear}
                  onChange={(v) => handleInputChange('registrationYear', v)}
                />
                <FormInput
                  label="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={(v) => handleInputChange('aadharNumber', v)}
                />
                <FormInput
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(v) => handleInputChange('panNumber', v)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={Array.isArray(formData.specialization) ? formData.specialization.join(', ') : formData.specialization || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const specialties = value.split(',').map(s => s.trim()).filter(s => s);
                      handleInputChange('specialization', specialties);
                    }}
                    placeholder="Comma separated"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hospital Information */}
          {(isHospital || isHospitalIndividual) && (
            <>
              <div className="border-b pb-6 mb-6">
                <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Hospital Name"
                    value={formData.hospitalName}
                    onChange={(v) => handleInputChange('hospitalName', v)}
                  />
                  {formData.hospitalDetails && (
                    <>
                      <FormSelect
                        label="Hospital Type"
                        value={formData.hospitalDetails.hospitalType}
                        onChange={(v) => handleInputChange('hospitalDetails.hospitalType', v)}
                        options={['Multi-Speciality', 'Maternity Home', 'Diagnostic Center', 'Super Speciality Hospital', 'Dental Case', 'Other']}
                      />
                      <FormInput
                        label="No. of Beds"
                        type="number"
                        value={formData.hospitalDetails.beds}
                        onChange={(v) => handleInputChange('hospitalDetails.beds', v)}
                      />
                      <FormInput
                        label="Year of Establishment"
                        value={formData.hospitalDetails.establishmentYear}
                        onChange={(v) => handleInputChange('hospitalDetails.establishmentYear', v)}
                      />
                      <FormInput
                        label="Website"
                        value={formData.hospitalDetails.website}
                        onChange={(v) => handleInputChange('hospitalDetails.website', v)}
                      />
                      <FormSelect
                        label="Ownership Type"
                        value={formData.hospitalDetails.ownershipType}
                        onChange={(v) => handleInputChange('hospitalDetails.ownershipType', v)}
                        options={['Private', 'Government', 'Trust', 'Corporate']}
                      />
                      <FormInput
                        label="Director Name"
                        value={formData.hospitalDetails.director?.name || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.director.name', v)}
                      />
                      <FormInput
                        label="Director Contact"
                        value={formData.hospitalDetails.director?.contact || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.director.contact', v)}
                      />
                      <FormInput
                        label="Director Email"
                        type="email"
                        value={formData.hospitalDetails.director?.email || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.director.email', v)}
                      />
                      <FormInput
                        label="Admin Name"
                        value={formData.hospitalDetails.admin?.name || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.admin.name', v)}
                      />
                      <FormInput
                        label="Admin Contact"
                        value={formData.hospitalDetails.admin?.contact || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.admin.contact', v)}
                      />
                      <FormInput
                        label="Admin Email"
                        type="email"
                        value={formData.hospitalDetails.admin?.email || ''}
                        onChange={(v) => handleInputChange('hospitalDetails.admin.email', v)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Hospital Address */}
              {formData.hospitalAddress && (
                <div className="border-b pb-6 mb-6">
                  <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <FormInput
                        label="Address"
                        value={formData.hospitalAddress.address}
                        onChange={(v) => handleInputChange('hospitalAddress.address', v)}
                      />
                    </div>
                    <FormInput
                      label="Pin Code"
                      value={formData.hospitalAddress.pinCode}
                      onChange={(v) => handleInputChange('hospitalAddress.pinCode', v)}
                    />
                    <FormInput
                      label="City"
                      value={formData.hospitalAddress.city}
                      onChange={(v) => handleInputChange('hospitalAddress.city', v)}
                    />
                    <FormInput
                      label="Taluka"
                      value={formData.hospitalAddress.taluka}
                      onChange={(v) => handleInputChange('hospitalAddress.taluka', v)}
                    />
                    <FormInput
                      label="District"
                      value={formData.hospitalAddress.district}
                      onChange={(v) => handleInputChange('hospitalAddress.district', v)}
                    />
                    <FormInput
                      label="State"
                      value={formData.hospitalAddress.state}
                      onChange={(v) => handleInputChange('hospitalAddress.state', v)}
                    />
                    <FormInput
                      label="Country"
                      value={formData.hospitalAddress.country}
                      onChange={(v) => handleInputChange('hospitalAddress.country', v)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Contact Information */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Phone Number"
                value={formData.phoneNumber || formData.contactDetails?.phoneNumber || ''}
                onChange={(v) => {
                  handleInputChange('phoneNumber', v);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.phoneNumber', v);
                  }
                }}
              />
              <FormInput
                label="WhatsApp Number"
                value={formData.whatsappNumber || formData.contactDetails?.whatsapp || ''}
                onChange={(v) => {
                  handleInputChange('whatsappNumber', v);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.whatsapp', v);
                  }
                }}
              />
              <FormInput
                label="Email"
                type="email"
                value={formData.email || formData.contactDetails?.emailId || ''}
                onChange={(v) => {
                  handleInputChange('email', v);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.emailId', v);
                  }
                }}
              />
            </div>
          </div>

          {/* Residential Address (for Individual/Hospital+Individual) */}
          {(isIndividual || isHospitalIndividual) && formData.contactDetails?.currentAddress && (
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-3">
                  <FormInput
                    label="Address"
                    value={formData.contactDetails.currentAddress.address}
                    onChange={(v) => handleInputChange('contactDetails.currentAddress.address', v)}
                  />
                </div>
                <FormInput
                  label="Pin Code"
                  value={formData.contactDetails.currentAddress.pinCode}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.pinCode', v)}
                />
                <FormInput
                  label="City"
                  value={formData.contactDetails.currentAddress.city}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.city', v)}
                />
                <FormInput
                  label="Taluka"
                  value={formData.contactDetails.currentAddress.taluka}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.taluka', v)}
                />
                <FormInput
                  label="District"
                  value={formData.contactDetails.currentAddress.district}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.district', v)}
                />
                <FormInput
                  label="State"
                  value={formData.contactDetails.currentAddress.state}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.state', v)}
                />
                <FormInput
                  label="Country"
                  value={formData.contactDetails.currentAddress.country}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.country', v)}
                />
              </div>
            </div>
          )}

          {/* Remarks */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
              placeholder="Enter remarks..."
            />
          </div>

          {/* Documents */}
          <div className="pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Documents</h2>

            {(isIndividual || isHospitalIndividual) && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadInput
                    label="Aadhar"
                    fileType="aadhar"
                    currentFile={formData.documents.aadhar || doctor?.documents?.aadhar}
                    onFileSelect={(file) => handleFileUpload(file, 'aadhar')}
                  />
                  <FileUploadInput
                    label="PAN"
                    fileType="pan"
                    currentFile={formData.documents.pan || doctor?.documents?.pan}
                    onFileSelect={(file) => handleFileUpload(file, 'pan')}
                  />
                  <FileUploadInput
                    label="Medical Registration"
                    fileType="medicalRegistration"
                    currentFile={formData.documents.medicalRegistration || doctor?.documents?.medicalRegistration}
                    onFileSelect={(file) => handleFileUpload(file, 'medicalRegistration')}
                  />
                  <FileUploadInput
                    label="Additional Qualification"
                    fileType="additionalQualification"
                    currentFile={formData.documents.additionalQualification || doctor?.documents?.additionalQualification}
                    onFileSelect={(file) => handleFileUpload(file, 'additionalQualification')}
                  />
                  <FileUploadInput
                    label="Visiting Card"
                    fileType="visitingCard"
                    currentFile={formData.documents.visitingCard || doctor?.documents?.visitingCard}
                    onFileSelect={(file) => handleFileUpload(file, 'visitingCard')}
                  />
                  <FileUploadInput
                    label="Bank Details"
                    fileType="bankDetails"
                    currentFile={formData.documents.bankDetails || doctor?.documents?.bankDetails}
                    onFileSelect={(file) => handleFileUpload(file, 'bankDetails')}
                  />
                  {/* Legacy documents */}
                  <FileUploadInput
                    label="License/Registration"
                    fileType="license"
                    currentFile={formData.documents.license || doctor?.documents?.license}
                    onFileSelect={(file) => handleFileUpload(file, 'license')}
                  />
                  <FileUploadInput
                    label="Qualification Document"
                    fileType="qualificationDoc"
                    currentFile={formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc}
                    onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
                  />
                </div>
              </div>
            )}

            {(isHospital || isHospitalIndividual) && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadInput
                    label="Hospital PAN Document"
                    fileType="hospitalPanDocument"
                    currentFile={formData.documents.hospitalPanDocument || doctor?.documents?.hospitalPanDocument}
                    onFileSelect={(file) => handleFileUpload(file, 'hospitalPanDocument')}
                  />
                  <FileUploadInput
                    label="Registration Certificate"
                    fileType="registrationCertificate"
                    currentFile={formData.documents.registrationCertificate || doctor?.documents?.registrationCertificate}
                    onFileSelect={(file) => handleFileUpload(file, 'registrationCertificate')}
                  />
                  <FileUploadInput
                    label="Hospital GST Document"
                    fileType="hospitalGstDocument"
                    currentFile={formData.documents.hospitalGstDocument || doctor?.documents?.hospitalGstDocument}
                    onFileSelect={(file) => handleFileUpload(file, 'hospitalGstDocument')}
                  />
                  <FileUploadInput
                    label="Owner PAN Card"
                    fileType="ownerPanCard"
                    currentFile={formData.documents.ownerPanCard || doctor?.documents?.ownerPanCard}
                    onFileSelect={(file) => handleFileUpload(file, 'ownerPanCard')}
                  />
                  <FileUploadInput
                    label="Owner Aadhaar Card"
                    fileType="ownerAadhaarCard"
                    currentFile={formData.documents.ownerAadhaarCard || doctor?.documents?.ownerAadhaarCard}
                    onFileSelect={(file) => handleFileUpload(file, 'ownerAadhaarCard')}
                  />
                  {/* Legacy documents */}
                  <FileUploadInput
                    label="License/Registration"
                    fileType="license"
                    currentFile={formData.documents.license || doctor?.documents?.license}
                    onFileSelect={(file) => handleFileUpload(file, 'license')}
                  />
                  <FileUploadInput
                    label="Qualification Document"
                    fileType="qualificationDoc"
                    currentFile={formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc}
                    onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
                  />
                </div>
              </div>
            )}

            {/* Other documents - shown for all types - only show documents not already displayed in specific fields */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
              <div className="space-y-2">
                {doctor?.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
                  <>
                    {doctor.documents.otherDocs
                      .filter(doc => {
                        // Filter out documents that are already shown in specific fields
                        const allSpecificDocs = [
                          doctor.documents.hospitalPanDocument,
                          doctor.documents.registrationCertificate,
                          doctor.documents.hospitalGstDocument,
                          doctor.documents.ownerPanCard,
                          doctor.documents.ownerAadhaarCard,
                          doctor.documents.license,
                          doctor.documents.qualificationDoc,
                          doctor.documents.aadhar,
                          doctor.documents.pan,
                          doctor.documents.medicalRegistration,
                          doctor.documents.additionalQualification,
                          doctor.documents.visitingCard,
                          doctor.documents.bankDetails
                        ].filter(path => path); // Remove null/undefined values

                        // Return true only if this document is not in the specific docs
                        return !allSpecificDocs.includes(doc);
                      })
                      .map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleDocumentClick(doc)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Remove document from the otherDocs array
                                setFormData(prev => ({
                                  ...prev,
                                  documents: {
                                    ...prev.documents,
                                    otherDocs: prev.documents.otherDocs.filter((_, i) => i !== idx)
                                  }
                                }));
                                // Update uploaded files state
                                setUploadedFiles(prev => ({
                                  ...prev,
                                  otherDocs: prev.otherDocs ? prev.otherDocs.filter((_, i) => i !== idx) : []
                                }));
                              }}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                  </>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Document</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, 'otherDocs');
                        }
                      }}
                      accept="image/*,.pdf,.doc,.docx"
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={() => navigate(`/view-doctor/${id}`)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render view mode (existing code)
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">View Doctor Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        {/* Basic Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership ID</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.membershipId || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.doctorId || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership Date</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.membershipDate ? formatDate(doctor.membershipDate) : "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.membershipType || doctor.doctorType || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.status || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Date</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.createdAt ? formatDate(doctor.createdAt) : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor/Individual Information */}
        {(isIndividual || isHospitalIndividual) && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.fullName || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.dateOfBirth ? formatDate(doctor.dateOfBirth) : "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.qualification || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.specialization && doctor.specialization.length > 0
                    ? doctor.specialization.join(", ")
                    : "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.licenseNumber || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Year</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.registrationYear || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.aadharNumber || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.panNumber || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.experience || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spouse Information - Show only if the doctor is linked as a spouse */}
        {doctor.isLinked && doctor.relationshipType === 'spouse' && doctor.linkedDoctor && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Spouse Doctors Information</h2>

            {/* Doctor 1 Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                Doctor 1 Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.fullName || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.doctorId || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration No</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.licenseNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.email || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.phoneNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.qualification || "N/A"}
                  </div>
                </div>
              </div>

              {/* Doctor 1 Documents */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 1 Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {doctor.documents?.aadhar && (
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.aadhar)}
                      className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left text-sm"
                    >
                      Aadhar: {doctor.documents.aadhar.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.documents?.pan && (
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.pan)}
                      className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left text-sm"
                    >
                      PAN: {doctor.documents.pan.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.documents?.medicalRegistration && (
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.medicalRegistration)}
                      className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left text-sm"
                    >
                      Medical Registration: {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 &&
                    doctor.documents.otherDocs.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDocumentClick(doc)}
                        className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left text-sm"
                      >
                        Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Doctor 2 Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                Doctor 2 Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.fullName || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.doctorId || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration No</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.licenseNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.email || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.phoneNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor.qualification || "N/A"}
                  </div>
                </div>
              </div>

              {/* Doctor 2 Documents */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 2 Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {doctor.linkedDoctor.documents?.aadhar && (
                    <button
                      onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.aadhar)}
                      className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left text-sm"
                    >
                      Aadhar: {doctor.linkedDoctor.documents.aadhar.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.linkedDoctor.documents?.pan && (
                    <button
                      onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.pan)}
                      className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left text-sm"
                    >
                      PAN: {doctor.linkedDoctor.documents.pan.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.linkedDoctor.documents?.medicalRegistration && (
                    <button
                      onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.medicalRegistration)}
                      className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left text-sm"
                    >
                      Medical Registration: {doctor.linkedDoctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                    </button>
                  )}
                  {doctor.linkedDoctor.documents?.otherDocs && doctor.linkedDoctor.documents.otherDocs.length > 0 &&
                    doctor.linkedDoctor.documents.otherDocs.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDocumentClick(doc)}
                        className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left text-sm"
                      >
                        Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Relationship Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-3">Relationship Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
                  <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
                    {doctor.relationshipType || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Linked Doctor ID</label>
                  <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
                    {doctor.linkedDoctor._id || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Information */}
        {(isHospital || isHospitalIndividual) && doctor.hospitalName && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalName || "N/A"}
                </div>
              </div>
              {doctor.hospitalDetails && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.hospitalType || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">No. of Beds</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.beds || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.establishmentYear || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.website || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.ownershipType || "N/A"}
                    </div>
                  </div>
                </>
              )}
              {doctor.hospitalDetails?.director && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Director Name</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.director.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Director Contact</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.director.contact || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Director Email</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.director.email || "N/A"}
                    </div>
                  </div>
                </>
              )}
              {doctor.hospitalDetails?.admin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Name</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.admin.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Contact</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.admin.contact || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                      {doctor.hospitalDetails.admin.email || "N/A"}
                    </div>
                  </div>
                </>
              )}
              {doctor.hospitalDetails?.departments && doctor.hospitalDetails.departments.length > 0 && (
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <div className="flex flex-wrap gap-2">
                    {doctor.hospitalDetails.departments.map((dept, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hospital Address */}
        {(isHospital || isHospitalIndividual) && doctor.hospitalAddress && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.address || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.pinCode || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.city || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Taluka</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.taluka || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.district || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.state || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.hospitalAddress.country || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.phoneNumber || doctor.contactDetails?.phoneNumber || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.whatsappNumber || doctor.contactDetails?.whatsapp || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.email || doctor.contactDetails?.emailId || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Residential Address (for Individual/Hospital+Individual) */}
        {(isIndividual || isHospitalIndividual) && doctor.contactDetails?.currentAddress && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.address || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.pinCode || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.city || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Taluka</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.taluka || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.district || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.state || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {doctor.contactDetails.currentAddress.country || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status & Follow-up */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Status & Follow-up</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Status</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.typeOfEnquiry || "N/A"}
              </div>
            </div>
            {doctor.followUps && doctor.followUps.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Follow-up Date</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formatDate(doctor.followUps[doctor.followUps.length - 1].date)}
                </div>
              </div>
            )}
          </div>
          {doctor.followUps && doctor.followUps.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up History</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {doctor.followUps.map((followUp, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{followUp.notes || "No notes"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {formatDate(followUp.date)} | Type: {followUp.type || "N/A"}
                        </p>
                        {followUp.nextFollowUpDate && (
                          <p className="text-xs text-gray-500">
                            Next Follow-up: {formatDate(followUp.nextFollowUpDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Remarks */}
        {doctor.remarks && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700">
              {doctor.remarks}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="pb-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#15BBB3]">Documents</h2>
            {doctor.documents && (
              <span className="text-sm text-gray-500">
                {[
                  doctor.documents.aadhar ? 1 : 0,
                  doctor.documents.pan ? 1 : 0,
                  doctor.documents.medicalRegistration ? 1 : 0,
                  doctor.documents.additionalQualification ? 1 : 0,
                  doctor.documents.visitingCard ? 1 : 0,
                  doctor.documents.bankDetails ? 1 : 0,
                  doctor.documents.hospitalPanDocument ? 1 : 0,
                  doctor.documents.registrationCertificate ? 1 : 0,
                  doctor.documents.hospitalGstDocument ? 1 : 0,
                  doctor.documents.ownerPanCard ? 1 : 0,
                  doctor.documents.ownerAadhaarCard ? 1 : 0,
                  doctor.documents.otherDocs?.length || 0
                ].reduce((a, b) => a + b, 0)} document(s)
              </span>
            )}
          </div>

          {(isIndividual || isHospitalIndividual) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.documents?.aadhar && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.aadhar)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.aadhar.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.pan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.pan)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.pan.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.medicalRegistration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Registration
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.medicalRegistration)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.additionalQualification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Qualification
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.additionalQualification)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.additionalQualification.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.visitingCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visiting Card
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.visitingCard)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.visitingCard.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.bankDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Details
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.bankDetails)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.bankDetails.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {/* Legacy individual document */}
                {doctor.documents?.license && !doctor.documents.medicalRegistration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License/Registration
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.license)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.license.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.qualificationDoc && !doctor.documents.pan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification Document
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.qualificationDoc)}
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {(isHospital || isHospitalIndividual) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.documents?.hospitalPanDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital PAN Document
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.hospitalPanDocument)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.hospitalPanDocument.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.registrationCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Certificate
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.registrationCertificate)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.registrationCertificate.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.hospitalGstDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital GST Document
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.hospitalGstDocument)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.hospitalGstDocument.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.ownerPanCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner PAN Card
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.ownerPanCard)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.ownerPanCard.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.ownerAadhaarCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Aadhaar Card
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.ownerAadhaarCard)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.ownerAadhaarCard.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {/* Legacy hospital document */}
                {doctor.documents?.license && !doctor.documents.medicalRegistration && !doctor.documents.registrationCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License/Registration
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.license)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.license.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
                {doctor.documents?.qualificationDoc && !doctor.documents.pan && !doctor.documents.hospitalGstDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification Document
                    </label>
                    <button
                      onClick={() => handleDocumentClick(doctor.documents.qualificationDoc)}
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      <span className="truncate block">
                        {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other documents - shown for all types - only show documents not already displayed in specific fields */}
          {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {doctor.documents.otherDocs
                  .filter(doc => {
                    // Filter out documents that are already shown in specific fields
                    const allSpecificDocs = [
                      doctor.documents.hospitalPanDocument,
                      doctor.documents.registrationCertificate,
                      doctor.documents.hospitalGstDocument,
                      doctor.documents.ownerPanCard,
                      doctor.documents.ownerAadhaarCard,
                      doctor.documents.license,
                      doctor.documents.qualificationDoc,
                      doctor.documents.aadhar,
                      doctor.documents.pan,
                      doctor.documents.medicalRegistration,
                      doctor.documents.additionalQualification,
                      doctor.documents.visitingCard,
                      doctor.documents.bankDetails
                    ].filter(path => path); // Remove null/undefined values

                    // Return true only if this document is not in the specific docs
                    return !allSpecificDocs.includes(doc);
                  })
                  .map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDocumentClick(doc)}
                      className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <span className="truncate block text-sm">
                        {doc.split("/").pop() || `Document ${idx + 1}`}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {(!doctor.documents ||
            (!doctor.documents.aadhar &&
              !doctor.documents.pan &&
              !doctor.documents.medicalRegistration &&
              !doctor.documents.additionalQualification &&
              !doctor.documents.visitingCard &&
              !doctor.documents.bankDetails &&
              !doctor.documents.hospitalPanDocument &&
              !doctor.documents.registrationCertificate &&
              !doctor.documents.hospitalGstDocument &&
              !doctor.documents.ownerPanCard &&
              !doctor.documents.ownerAadhaarCard &&
              !doctor.documents.otherDocs || doctor.documents.otherDocs.length === 0)) && (
              <div className="text-center text-gray-500 py-4">
                No documents uploaded
              </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctorForm;
