

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';
import DateInput from '../../../components/DateInput/DateInput';
import LocationInput from '../../../components/LocationInput';

// Helper function to format date as dd-mm-yyyy
// const formatDateToDDMMYYYY = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// Helper function to convert dd-mm-yyyy to yyyy-mm-dd for input
const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
};

// ================= IMAGE PREVIEW MODAL =================
const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
  if (!isOpen || !preview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Document Preview: {preview.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-auto max-h-[70vh]">
          {preview.type?.startsWith('image/') ? (
            <div className="flex flex-col items-center">
              <img
                src={preview.url}
                alt={preview.name || 'Preview'}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  File: {preview.name}
                </p>
                <p className="text-xs text-gray-500">
                  Type: {preview.type} | Size: {(preview.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : preview.type?.includes('pdf') ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-red-100 rounded-lg mb-4">
                <span className="text-4xl text-red-600">📄</span>
              </div>
              <p className="text-lg font-medium text-gray-700">PDF Document</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <span className="mr-2">📂</span>
                Open PDF in New Tab
              </a>
            </div>
          ) : preview.type?.includes('word') || preview.type?.includes('document') ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                <span className="text-4xl text-blue-600">📝</span>
              </div>
              <p className="text-lg font-medium text-gray-700">Word Document</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span className="mr-2">📂</span>
                Open Document
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                <span className="text-4xl text-gray-600">📎</span>
              </div>
              <p className="text-lg font-medium text-gray-700">Document Preview</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <span className="mr-2">📂</span>
                Open File
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          {/* <button
            onClick={() => window.open(preview.url, '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Open in New Tab
          </button> */}
          <p></p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= FILE UPLOAD COMPONENT =================
const FileUpload = ({ label, onFileSelect, fileName: propFileName, preview, onPreviewClick }) => {
  const displayName = propFileName
    ? (typeof propFileName === 'string' ? propFileName.split('/').pop() : propFileName?.name || 'Uploaded')
    : 'No file chosen';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect?.(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <label className="block cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx"
        />
        <div className={`border rounded-lg px-4 py-2 text-sm flex justify-between items-center transition ${propFileName ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}>
          <span className={propFileName ? 'text-green-700 font-medium' : 'text-gray-600'}>
            {propFileName ? 'Change File' : 'Choose File'}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[140px]">{displayName}</span>
        </div>
      </label>

      {/* PREVIEW */}
      {preview?.url && (
        <div
          className="mt-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => onPreviewClick?.(preview)}
        >
          {preview.type?.startsWith('image/') ? (
            <div className="flex items-center gap-3">
              <img src={preview.url} alt="preview" className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{preview.name}</p>
                <p className="text-xs text-gray-500">Click to view full preview</p>
              </div>
            </div>
          ) : preview.type?.includes('pdf') ? (
            <div className="flex items-center gap-3">
              <div className="text-4xl text-red-600">📄</div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{preview.name}</p>
                <p className="text-xs text-gray-500">Click to view full preview</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-4xl text-blue-600">📝</div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{preview.name}</p>
                <p className="text-xs text-gray-500">Click to view full preview</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// testing




// Helper function to uppercase text fields (exclude email, website, numbers)
const toProperUpperCase = (data) => {
  const textKeys = [
    'name', 'fullName', 'hospitalName', 'qualification', 'speciality',
    'regNo', 'regYear', 'experience', 'licenseNumber',
    'address', 'hospitalAddress', 'city', 'hospitalCity',
    'state', 'hospitalState', 'district', 'hospitalDistrict',
    'taluka', 'hospitalTaluka', 'country', 'hospitalCountry',
    'remarks', 'director', 'admin', 'typeOther',
    'hospitalType', 'ownershipType'
  ];

  textKeys.forEach(key => {
    if (data[key] && typeof data[key] === 'string') {
      data[key] = data[key].trim().toUpperCase();
    }
  });

  // Nested objects
  if (data.hospitalAddress && typeof data.hospitalAddress === 'object') {
    Object.keys(data.hospitalAddress).forEach(k => {
      if (typeof data.hospitalAddress[k] === 'string') {
        data.hospitalAddress[k] = data.hospitalAddress[k].trim().toUpperCase();
      }
    });
  }

  if (data.contactDetails?.currentAddress && typeof data.contactDetails.currentAddress === 'object') {
    Object.keys(data.contactDetails.currentAddress).forEach(k => {
      if (typeof data.contactDetails.currentAddress[k] === 'string') {
        data.contactDetails.currentAddress[k] = data.contactDetails.currentAddress[k].trim().toUpperCase();
      }
    });
  }

  // Specialization array/string
  if (data.speciality) {
    if (typeof data.speciality === 'string') {
      data.speciality = data.speciality.trim().toUpperCase();
    } else if (Array.isArray(data.speciality)) {
      data.speciality = data.speciality.map(s => s.trim().toUpperCase());
    }
  }

  // Website lowercase
  if (data.website) {
    data.website = data.website.trim().toLowerCase();
  }

  // Notes uppercase (follow up message)
  if (data.notes) {
    data.notes = data.notes.trim().toUpperCase();
  }

  return data;
};



const AddMembershipForm = () => {
  const [membershipType, setMembershipType] = useState('Hospital');
  const [doctors, setDoctors] = useState([{}]);
  const [hospitals, setHospitals] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [linkAsSpouses, setLinkAsSpouses] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([{}]);
  const [filePreviews, setFilePreviews] = useState([{}]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  // Form state for top-level fields
  const [membershipId, setMembershipId] = useState('');
  // Auto-set current date in dd-mm-yyyy format
  const [membershipDate, setMembershipDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  });
  const [leadStatus, setLeadStatus] = useState('cold');
  const [salesStatus, setSalesStatus] = useState('cold');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [remarks, setRemarks] = useState('');

  // State for same as above checkbox for hospital details
  const [sameAsAboveHospital, setSameAsAboveHospital] = useState({});

  // ================= PREVIEW HANDLERS =================
  const handlePreviewClick = (preview) => {
    setCurrentPreview(preview);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPreview(null);
  };

  const handleDoctorChange = (index, field, value) => {
    const updated = [...doctors];
    updated[index] = { ...updated[index], [field]: value };
    setDoctors(updated);
  };

  const handleHospitalChange = (index, field, value) => {
    const updated = [...hospitals];
    updated[index] = { ...updated[index], [field]: value };
    setHospitals(updated);

    // Only update doctors if membershipType is Individual
    if (index === 0 && membershipType === 'Individual') {
      const updatedDoctors = [...doctors];
      let hasChanges = false;

      updatedDoctors.forEach((doctor, docIndex) => {
        if (sameAsAboveHospital[docIndex]) {
          // Update hospital fields in doctor
          if (field === 'name') {
            updatedDoctors[docIndex].hospitalName = value;
          } else if (field === 'address') {
            updatedDoctors[docIndex].hospitalAddress = value;
          } else if (field === 'pin') {
            updatedDoctors[docIndex].hospitalPin = value;
          } else if (field === 'city') {
            updatedDoctors[docIndex].hospitalCity = value;
          } else if (field === 'state') {
            updatedDoctors[docIndex].hospitalState = value;
          } else if (field === 'district') {
            updatedDoctors[docIndex].hospitalDistrict = value;
          } else if (field === 'taluka') {
            updatedDoctors[docIndex].hospitalTaluka = value;
          } else if (field === 'country') {
            updatedDoctors[docIndex].hospitalCountry = value;
          }
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setDoctors(updatedDoctors);
      }
    }
  };

  // Handle same as above checkbox
  const handleSameAsAboveChange = (doctorIndex, checked) => {
    // Only set state if membershipType is Individual
    if (membershipType !== 'Individual') return;

    setSameAsAboveHospital(prev => ({
      ...prev,
      [doctorIndex]: checked
    }));

    if (checked && membershipType === 'Individual') {
      // Copy data from Doctor 1 to other doctors
      const doctor1Data = doctors[0];
      const updatedDoctors = [...doctors];

      if (doctor1Data && doctor1Data.hospitalName) {
        updatedDoctors[doctorIndex] = {
          ...updatedDoctors[doctorIndex],
          hospitalName: doctor1Data.hospitalName || '',
          hospitalAddress: doctor1Data.hospitalAddress || '',
          hospitalPin: doctor1Data.hospitalPin || '',
          hospitalCity: doctor1Data.hospitalCity || '',
          hospitalState: doctor1Data.hospitalState || '',
          hospitalDistrict: doctor1Data.hospitalDistrict || '',
          hospitalTaluka: doctor1Data.hospitalTaluka || '',
          hospitalCountry: doctor1Data.hospitalCountry || 'India'
        };
        setDoctors(updatedDoctors);
      }
    }
  };

  const addDoctor = () => {
    setDoctors([...doctors, {}]);
    setUploadedFiles([...uploadedFiles, {}]);
    setFilePreviews([...filePreviews, {}]);
  };

  const addHospital = () => setHospitals([...hospitals, {}]);

  const removeDoctor = (index) => {
    setDoctors(doctors.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    setFilePreviews(filePreviews.filter((_, i) => i !== index));

    // Remove from sameAsAboveHospital state
    const updatedSameAsAbove = { ...sameAsAboveHospital };
    delete updatedSameAsAbove[index];
    setSameAsAboveHospital(updatedSameAsAbove);
  };

  const removeHospital = (index) => setHospitals(hospitals.filter((_, i) => i !== index));

  // Transform doctor data function remains the same
  const transformDoctorData = (doctorData, doctorIndex = 0) => {
    const doctorFiles = uploadedFiles[doctorIndex] || {};



    toProperUpperCase(doctorData);

    return {
      membershipId: membershipId || undefined,
      doctorId: undefined,
      fullName: doctorData.name || '',
      dateOfBirth: doctorData.dob ? new Date(doctorData.dob) : undefined,
      email: doctorData.email ? doctorData.email.toLowerCase() : '',
      phoneNumber: doctorData.mobile || '',
      whatsappNumber: doctorData.wa || '',
      specialization: doctorData.speciality ? [doctorData.speciality] : [],
      qualification: doctorData.qualification || '',
      licenseNumber: doctorData.regNo || '',
      registrationYear: doctorData.regYear || '',
      experience: doctorData.experience || '',
      aadharNumber: doctorData.aadhar || '',
      panNumber: doctorData.pan || '',
      hospitalName: doctorData.hospitalName || '',
      hospitalAddress: {
        address: doctorData.hospitalAddress || '',
        city: doctorData.hospitalCity || '',
        state: doctorData.hospitalState || '',
        district: doctorData.hospitalDistrict || '',
        taluka: doctorData.hospitalTaluka || '',
        pinCode: doctorData.hospitalPin || '',
        country: doctorData.hospitalCountry || 'India'
      },
      contactDetails: {
        phoneNumber: doctorData.mobile || '',
        whatsapp: doctorData.wa || '',
        emailId: doctorData.email ? doctorData.email.toLowerCase() : '',
        currentAddress: {
          address: doctorData.address || '',
          pinCode: doctorData.pin || '',
          city: doctorData.city || '',
          state: doctorData.state || '',
          district: doctorData.district || '',
          taluka: doctorData.taluka || '',
          country: doctorData.country || 'India'
        }
      },
      typeOfEnquiry: leadStatus,
      doctorStatus: salesStatus,
      doctorType: 'individual',
      membershipType: membershipType,
      status: 'pending',
      remarks: remarks || '',
      followUps: followUpDate || followUpMessage ? [{
        date: followUpDate ? new Date(followUpDate) : new Date(),
        type: 'call',
        notes: followUpMessage || '',
        nextFollowUpDate: followUpDate ? new Date(followUpDate) : undefined,
        createdAt: new Date()
      }] : [],
      documents: {
        aadhar: doctorFiles.aadhar || '',
        pan: doctorFiles.pan || '',
        medicalRegistration: doctorFiles.medicalReg || '',
        additionalQualification: doctorFiles.qualification || '',
        visitingCard: doctorFiles.visitingCard || '',
        bankDetails: doctorFiles.bankDetails || '',
        license: doctorFiles.medicalReg || '',
        qualificationDoc: doctorFiles.pan || '',
        otherDocs: Object.values(doctorFiles).filter(path => path && typeof path === 'string' &&
          !['aadhar', 'pan', 'medicalReg', 'qualification', 'visitingCard', 'bankDetails'].includes(path.split('/').pop().split('.')[0]))
      }
    };
  };

  const handleFileUpload = async (file, fileType, doctorIndex = 0) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreviews(prev => {
        const updated = [...prev];
        if (!updated[doctorIndex]) updated[doctorIndex] = {};
        updated[doctorIndex] = {
          ...updated[doctorIndex],
          [fileType]: {
            url: e.target.result,
            name: file.name,
            type: file.type,
            size: file.size
          }
        };
        return updated;
      });
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    const fieldNameMap = {
      aadhar: 'aadharCard',
      pan: 'panCard',
      medicalReg: 'medicalRegistration',
      qualification: 'additionalQualification',
      visitingCard: 'visitingCard',
      bankDetails: 'bankDetails',
      hospitalPan: 'hospitalPanDocument',
      registrationCert: 'registrationCertificate',
      hospitalGst: 'hospitalGstDocument',
      ownerAadhaar: 'ownerAadhaarCard',
      ownerPan: 'ownerPanCard'
    };

    const backendFieldName = fieldNameMap[fileType] || fileType;
    formData.append(backendFieldName, file);

    try {
      const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadedFiles(prev => {
          const updated = [...prev];
          while (updated.length <= doctorIndex) {
            updated.push({});
          }
          updated[doctorIndex] = {
            ...updated[doctorIndex],
            [fileType]: response.data.data[backendFieldName] || file.name
          };
          return updated;
        });
        toast.success(`${fileType} uploaded successfully for Doctor ${doctorIndex + 1}`);
      }
    } catch (error) {
      toast.error(`Failed to upload ${fileType}`);
      console.error('File upload error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let transformedData;

      if (membershipType === 'Individual' && doctors.length > 0) {
        const doctorsToCreate = [];

        for (let i = 0; i < doctors.length; i++) {
          const doctorData = doctors[i];

          toProperUpperCase(doctorData);

          if (!doctorData.name || !doctorData.mobile) {
            toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
            setLoading(false);
            return;
          }
          doctorsToCreate.push(transformDoctorData(doctorData, i));
        }

        const createdDoctors = [];
        try {
          for (const doctorData of doctorsToCreate) {
            const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
            if (response.data.success) {
              createdDoctors.push({
                doctorId: response.data.data._id,
                data: response.data.data
              });
            } else {
              throw new Error(response.data.message || 'Failed to create doctor');
            }
          }

          if (linkAsSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual") && createdDoctors.length === 2) {
            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[0].doctorId),
              {
                linkedDoctorId: createdDoctors[1].doctorId,
                relationshipType: 'spouse'
              }
            );

            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[1].doctorId),
              {
                linkedDoctorId: createdDoctors[0].doctorId,
                relationshipType: 'spouse'
              }
            );
          }

          // Automatically accept all created doctors to create user accounts
          let acceptSuccessCount = 0;
          for (const createdDoctor of createdDoctors) {
            try {
              const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(createdDoctor.doctorId), {});
              if (acceptResponse.data.success) {
                acceptSuccessCount++;
              } else {
                console.error(`Failed to accept doctor ${createdDoctor.doctorId}:`, acceptResponse.data.message);
              }
            } catch (acceptError) {
              console.error(`Error accepting doctor ${createdDoctor.doctorId}:`, acceptError);
            }
          }

          if (acceptSuccessCount === createdDoctors.length) {
            toast.success(`Individual membership created and accepted successfully with ${doctorsToCreate.length} doctor(s)! User accounts created.`);
          } else if (acceptSuccessCount > 0) {
            toast.warning(`Individual membership created with ${doctorsToCreate.length} doctor(s), ${acceptSuccessCount} accepted successfully. Some user accounts may not be created.`);
          } else {
            toast.warning(`Individual membership created with ${doctorsToCreate.length} doctor(s), but acceptance failed. User accounts not created.`);
          }

          // Reset form
          setDoctors([{}]);
          setUploadedFiles([{}]);
          setFilePreviews([{}]);
          setLinkAsSpouses(false);
          setMembershipId('');
          // Reset date to current date
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const year = today.getFullYear();
          setMembershipDate(`${day}-${month}-${year}`);
          setLeadStatus('cold');
          setSalesStatus('cold');
          setFollowUpDate('');
          setFollowUpMessage('');
          setRemarks('');
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error creating doctors:', error);
          toast.error(error.response?.data?.message || error.message || 'Failed to create some doctors');
          setLoading(false);
          return;
        }
      }
      else if (membershipType === 'Hospital' && hospitals.length > 0) {
        const hospitalData = hospitals[0];


        toProperUpperCase(hospitalData);

        if (!hospitalData.name || !hospitalData.contact) {
          toast.error('Please fill in required fields: Hospital Name and Contact Number');
          setLoading(false);
          return;
        }

        const hospitalFiles = uploadedFiles[0] || {};

        transformedData = {
          membershipId: membershipId || undefined,
          membershipDate: membershipDate ? new Date(formatDateToYYYYMMDD(membershipDate)) : undefined,
          doctorId: undefined,
          fullName: hospitalData.name,
          email: hospitalData.email ? hospitalData.email.toLowerCase() : '',
          phoneNumber: hospitalData.contact,
          whatsappNumber: hospitalData.whatsapp,
          hospitalName: hospitalData.name,
          hospitalAddress: {
            address: hospitalData.address,
            city: hospitalData.city,
            state: hospitalData.state,
            district: hospitalData.district,
            taluka: hospitalData.taluka,
            pinCode: hospitalData.pin,
            country: hospitalData.country || 'India'
          },
          hospitalDetails: {
            hospitalType: hospitalData.type === 'Other' ? hospitalData.typeOther || 'Other' : hospitalData.type || '',
            beds: hospitalData.beds ? parseInt(hospitalData.beds) : undefined,
            establishmentYear: hospitalData.year || '',
            website: hospitalData.website ? hospitalData.website.toLowerCase() : '',
            ownershipType: hospitalData.ownershipType || '',
            director: {
              name: hospitalData.director || '',
              contact: hospitalData.directorContact || '',
              email: hospitalData.directorEmail ? hospitalData.directorEmail.toLowerCase() : ''
            },
            admin: {
              name: hospitalData.admin || '',
              contact: hospitalData.adminContact || '',
              email: hospitalData.adminEmail ? hospitalData.adminEmail.toLowerCase() : ''
            },
            departments: [
              ...(hospitalData.departments || []).filter(dept => dept !== 'Other'),
              ...(hospitalData.departmentsOther ? hospitalData.departmentsOther.split(',').map(dept => dept.trim()).filter(dept => dept) : [])
            ]
          },
          licenseNumber: hospitalData.license || '',
          qualification: hospitalData.pan || '',
          remarks: remarks || '',
          typeOfEnquiry: leadStatus,
          doctorStatus: salesStatus,
          doctorType: 'hospital',
          membershipType: membershipType,
          status: 'pending',
          followUps: followUpDate || followUpMessage ? [{
            date: followUpDate ? new Date(followUpDate) : new Date(),
            type: 'call',
            notes: followUpMessage || '',
            nextFollowUpDate: followUpDate ? new Date(followUpDate) : undefined,
            createdAt: new Date()
          }] : [],
          documents: {
            hospitalPanDocument: hospitalFiles.hospitalPan || '',
            registrationCertificate: hospitalFiles.registrationCert || '',
            hospitalGstDocument: hospitalFiles.hospitalGst || '',
            ownerPanCard: hospitalFiles.ownerPan || '',
            ownerAadhaarCard: hospitalFiles.ownerAadhaar || '',
            license: hospitalFiles.registrationCert || '',
            qualificationDoc: hospitalFiles.hospitalGst || '',
            otherDocs: Object.values(hospitalFiles).filter(path => path && typeof path === 'string' &&
              !['hospitalPan', 'registrationCert', 'hospitalGst', 'ownerPan', 'ownerAadhaar'].includes(path.split('/').pop().split('.')[0]))
          }
        };
      }
      // For hospital + individual
      else if (membershipType === 'Hospital + Individual') {
        // Validate that we have both hospital and doctor data
        if (hospitals.length === 0 || doctors.length === 0) {
          toast.error('Please fill in both Hospital and Doctor details');
          setLoading(false);
          return;
        }

        const hospitalData = hospitals[0];


        toProperUpperCase(hospitalData);


        // Validate hospital data
        if (!hospitalData.name || !hospitalData.contact) {
          toast.error('Please fill in required fields: Hospital Name and Contact');
          setLoading(false);
          return;
        }

        // Create separate doctor records for each doctor in the hospital
        const doctorsToCreate = [];

        for (let i = 0; i < doctors.length; i++) {
          const doctorData = doctors[i];


          toProperUpperCase(doctorData);


          // Validate each doctor has required fields
          if (!doctorData.name || !doctorData.mobile) {
            toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
            setLoading(false);
            return;
          }

          // Create individual doctor record
          const doctorRecord = {
            membershipId: membershipId || undefined,
            membershipDate: membershipDate ? new Date(membershipDate) : undefined,
            fullName: doctorData.name,
            dateOfBirth: doctorData.dob ? new Date(doctorData.dob) : undefined,
            email: doctorData.email || '',
            phoneNumber: doctorData.mobile || '',
            whatsappNumber: doctorData.wa || '',
            specialization: doctorData.speciality ? [doctorData.speciality] : [],
            qualification: doctorData.qualification || '',
            experience: doctorData.experience || '',
            licenseNumber: doctorData.regNo || '',
            registrationYear: doctorData.regYear || '',
            aadharNumber: doctorData.aadhar || '',
            panNumber: doctorData.pan || '',
            hospitalName: hospitalData.name,
            hospitalAddress: {
              address: hospitalData.address || '',
              city: hospitalData.city || '',
              state: hospitalData.state || '',
              district: hospitalData.district || '',
              taluka: hospitalData.taluka || '',
              pinCode: hospitalData.pin || '',
              country: hospitalData.country || 'India'
            },
            hospitalDetails: {
              hospitalType: hospitalData.type === 'Other' ? hospitalData.typeOther || 'Other' : hospitalData.type || '',
              beds: hospitalData.beds ? parseInt(hospitalData.beds) : undefined,
              establishmentYear: hospitalData.year || '',
              website: hospitalData.website || '',
              ownershipType: hospitalData.ownershipType || '',
              hospitalPanNumber: hospitalData.pan || '',  // Hospital PAN number
              licenseNumber: hospitalData.license || '', // Hospital license number
              director: {
                name: hospitalData.director || '',
                contact: hospitalData.directorContact || '',
                email: hospitalData.directorEmail || ''
              },
              admin: {
                name: hospitalData.admin || '',
                contact: hospitalData.adminContact || '',
                email: hospitalData.adminEmail || ''
              },
              departments: [
                ...(hospitalData.departments || []).filter(dept => dept !== 'Other'),
                ...(hospitalData.departmentsOther ? hospitalData.departmentsOther.split(',').map(dept => dept.trim()).filter(dept => dept) : [])
              ]
            },
            contactDetails: {
              phoneNumber: doctorData.mobile || '',
              whatsapp: doctorData.wa || '',
              emailId: doctorData.email || '',
              currentAddress: {
                address: doctorData.address || '',
                pinCode: doctorData.pin || '',
                city: doctorData.city || '',
                state: doctorData.state || '',
                district: doctorData.district || '',
                taluka: doctorData.taluka || '',
                country: doctorData.country || 'India'
              }
            },
            typeOfEnquiry: leadStatus,
            doctorStatus: salesStatus,
            doctorType: 'hospital_individual',
            membershipType: membershipType,
            status: 'pending',
            remarks: remarks || '',
            followUps: followUpDate || followUpMessage ? [{
              date: followUpDate ? new Date(followUpDate) : new Date(),
              type: 'call',
              notes: followUpMessage || '',
              nextFollowUpDate: followUpDate ? new Date(followUpDate) : undefined,
              createdAt: new Date()
            }] : [],
            documents: {
              aadhar: uploadedFiles[i]?.aadhar || '',
              pan: uploadedFiles[i]?.pan || '',
              medicalRegistration: uploadedFiles[i]?.medicalReg || '',
              additionalQualification: uploadedFiles[i]?.qualification || '',
              visitingCard: uploadedFiles[i]?.visitingCard || '',
              bankDetails: uploadedFiles[i]?.bankDetails || '',
              hospitalPanDocument: uploadedFiles[i]?.hospitalPan || uploadedFiles[i]?.registrationCert || '',
              registrationCertificate: uploadedFiles[i]?.registrationCert || '',
              hospitalGstDocument: uploadedFiles[i]?.hospitalGst || uploadedFiles[i]?.qualification || '',
              ownerPanCard: uploadedFiles[i]?.ownerPan || '',
              ownerAadhaarCard: uploadedFiles[i]?.ownerAadhaar || '',
              license: uploadedFiles[i]?.medicalReg || uploadedFiles[i]?.registrationCert || '',
              qualificationDoc: uploadedFiles[i]?.qualification || uploadedFiles[i]?.hospitalGst || '',
              otherDocs: Object.values(uploadedFiles[i] || {}).filter(path => path && typeof path === 'string' &&
                !['aadhar', 'pan', 'medicalReg', 'qualification', 'visitingCard', 'bankDetails', 'hospitalPan', 'registrationCert', 'hospitalGst', 'ownerPan', 'ownerAadhaar'].includes(path.split('/').pop().split('.')[0]))
            }
          };

          doctorsToCreate.push(doctorRecord);
        }

        // Create all doctors sequentially to handle any validation errors
        try {
          const createdDoctors = [];  // Store actual created doctor objects to get IDs for linking
          const failedDoctors = [];

          for (let i = 0; i < doctorsToCreate.length; i++) {
            try {
              const doctorData = doctorsToCreate[i];

              if (!doctorData || !doctorData.fullName) {
                throw new Error(`Invalid data for Doctor ${i + 1}`);
              }

              const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
              if (response.data.success) {
                createdDoctors.push({
                  index: i + 1,
                  doctorId: response.data.data._id,
                  data: response.data.data
                });
              }
            } catch (error) {
              console.error(`Error creating Doctor ${i + 1}:`, error);
              failedDoctors.push(i + 1);
            }
          }

          // Now handle spouse linking if needed for Hospital + Individual
          if (linkAsSpouses && membershipType === "Hospital + Individual" && createdDoctors.length === 2) {
            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[0].doctorId),
              {
                linkedDoctorId: createdDoctors[1].doctorId,
                relationshipType: 'spouse'
              }
            );

            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[1].doctorId),
              {
                linkedDoctorId: createdDoctors[0].doctorId,
                relationshipType: 'spouse'
              }
            );
          }

          // Automatically accept all created doctors to create user accounts
          let acceptSuccessCount = 0;
          for (const createdDoctor of createdDoctors) {
            try {
              const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(createdDoctor.doctorId), {});
              if (acceptResponse.data.success) {
                acceptSuccessCount++;
              } else {
                console.error(`Failed to accept doctor ${createdDoctor.doctorId}:`, acceptResponse.data.message);
              }
            } catch (acceptError) {
              console.error(`Error accepting doctor ${createdDoctor.doctorId}:`, acceptError);
            }
          }

          if (failedDoctors.length > 0) {
            toast.warning(`Created ${createdDoctors.length} doctor(s) successfully, but ${failedDoctors.length} failed (Doctor ${failedDoctors.join(', ')})`);
          } else if (acceptSuccessCount === createdDoctors.length) {
            toast.success(`Hospital + Individual membership created and accepted successfully with ${createdDoctors.length} doctor(s)! User accounts created.`);
          } else if (acceptSuccessCount > 0) {
            toast.warning(`Hospital + Individual membership created with ${createdDoctors.length} doctor(s), ${acceptSuccessCount} accepted successfully. Some user accounts may not be created.`);
          } else {
            toast.warning(`Hospital + Individual membership created with ${createdDoctors.length} doctor(s), but acceptance failed. User accounts not created.`);
          }

          // Reset form only if all doctors were created successfully
          if (failedDoctors.length === 0) {
            setHospitals([{}]);
            setDoctors([{}]);
            setMembershipId('');
            setMembershipDate('');
            setLeadStatus('cold');
            setSalesStatus('cold');
            setFollowUpDate('');
            setFollowUpMessage('');
            setRemarks('');
            setUploadedFiles([{}]);
          }
        } catch (error) {
          console.error('Error creating doctors:', error);
          toast.error(error.response?.data?.message || 'Failed to create doctors');
          setLoading(false);
          return;
        }

        // Important: Return here to prevent falling through to the Hospital-only code below
        setLoading(false);
        return;
      }
      else {
        toast.error('Please select a membership type and fill required fields');
        setLoading(false);
        return;
      }

      const response = await apiClient.post(apiEndpoints.doctors.create, transformedData);

      if (response.data.success) {
        // Automatically accept the doctor to create user account
        try {
          const doctorId = response.data.data._id;
          const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(doctorId), {});
          if (acceptResponse.data.success) {
            if (membershipType === 'Individual') {
              toast.success('Doctor created and accepted successfully! User account created.');
            } else if (membershipType === 'Hospital') {
              toast.success('Hospital membership created and accepted successfully! User account created.');
            }
          } else {
            // Accept failed, but doctor was created
            if (membershipType === 'Individual') {
              toast.warning('Doctor created but acceptance failed. User account not created.');
            } else if (membershipType === 'Hospital') {
              toast.warning('Hospital membership created but acceptance failed. User account not created.');
            }
          }
        } catch (acceptError) {
          console.error('Error accepting doctor:', acceptError);
          // Still reset form but show warning
          if (membershipType === 'Individual') {
            toast.warning('Doctor created but acceptance failed. User account not created.');
          } else if (membershipType === 'Hospital') {
            toast.warning('Hospital membership created but acceptance failed. User account not created.');
          }
        }

        // Reset form
        setMembershipId('');
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        setMembershipDate(`${day}-${month}-${year}`);
        setLeadStatus('cold');
        setSalesStatus('cold');
        setFollowUpDate('');
        setFollowUpMessage('');
        setRemarks('');
        setUploadedFiles([{}]);
        setFilePreviews([{}]);
      }

    } catch (error) {
      console.error('Error creating membership:', error);
      toast.error(error.response?.data?.message || 'Failed to create membership');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleGiveQuote = async () => {
    setLoading(true);
    try {
      let transformedData;

      if (membershipType === 'Individual' && doctors.length > 0) {
        const doctorsToCreate = [];

        for (let i = 0; i < doctors.length; i++) {
          const doctorData = doctors[i];

          toProperUpperCase(doctorData);

          if (!doctorData.name || !doctorData.mobile) {
            toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
            setLoading(false);
            return;
          }
          doctorsToCreate.push(transformDoctorData(doctorData, i));
        }

        const createdDoctors = [];
        try {
          for (const doctorData of doctorsToCreate) {
            const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
            if (response.data.success) {
              createdDoctors.push({
                doctorId: response.data.data._id,
                data: response.data.data
              });
            } else {
              throw new Error(response.data.message || 'Failed to create doctor');
            }
          }

          if (linkAsSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual") && createdDoctors.length === 2) {
            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[0].doctorId),
              {
                linkedDoctorId: createdDoctors[1].doctorId,
                relationshipType: 'spouse'
              }
            );

            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[1].doctorId),
              {
                linkedDoctorId: createdDoctors[0].doctorId,
                relationshipType: 'spouse'
              }
            );
          }

          // Automatically accept all created doctors to create user accounts
          let acceptSuccessCount = 0;
          for (const createdDoctor of createdDoctors) {
            try {
              const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(createdDoctor.doctorId), {});
              if (acceptResponse.data.success) {
                acceptSuccessCount++;
              } else {
                console.error(`Failed to accept doctor ${createdDoctor.doctorId}:`, acceptResponse.data.message);
              }
            } catch (acceptError) {
              console.error(`Error accepting doctor ${createdDoctor.doctorId}:`, acceptError);
            }
          }

          if (acceptSuccessCount === createdDoctors.length) {
            toast.success(`Individual membership created and accepted successfully with ${doctorsToCreate.length} doctor(s)! User accounts created.`);
          } else if (acceptSuccessCount > 0) {
            toast.warning(`Individual membership created with ${doctorsToCreate.length} doctor(s), ${acceptSuccessCount} accepted successfully. Some user accounts may not be created.`);
          } else {
            toast.warning(`Individual membership created with ${doctorsToCreate.length} doctor(s), but acceptance failed. User accounts not created.`);
          }

          // Navigate to quotation creation page with the first doctor's ID
          if (createdDoctors.length > 0) {
            navigate(`/admin/create-quotation?doctorId=${createdDoctors[0].doctorId}`);
          }

          // Reset form
          setDoctors([{}]);
          setUploadedFiles([{}]);
          setFilePreviews([{}]);
          setLinkAsSpouses(false);
          setMembershipId('');
          // Reset date to current date
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const year = today.getFullYear();
          setMembershipDate(`${day}-${month}-${year}`);
          setLeadStatus('cold');
          setSalesStatus('cold');
          setFollowUpDate('');
          setFollowUpMessage('');
          setRemarks('');
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error creating doctors:', error);
          toast.error(error.response?.data?.message || error.message || 'Failed to create some doctors');
          setLoading(false);
          return;
        }
      }
      else if (membershipType === 'Hospital' && hospitals.length > 0) {
        const hospitalData = hospitals[0];


        toProperUpperCase(hospitalData);

        if (!hospitalData.name || !hospitalData.contact) {
          toast.error('Please fill in required fields: Hospital Name and Contact Number');
          setLoading(false);
          return;
        }

        const hospitalFiles = uploadedFiles[0] || {};

        transformedData = {
          membershipId: membershipId || undefined,
          membershipDate: membershipDate ? new Date(formatDateToYYYYMMDD(membershipDate)) : undefined,
          doctorId: undefined,
          fullName: hospitalData.name,
          email: hospitalData.email ? hospitalData.email.toLowerCase() : '',
          phoneNumber: hospitalData.contact,
          whatsappNumber: hospitalData.whatsapp,
          hospitalName: hospitalData.name,
          hospitalAddress: {
            address: hospitalData.address,
            city: hospitalData.city,
            state: hospitalData.state,
            district: hospitalData.district,
            taluka: hospitalData.taluka,
            pinCode: hospitalData.pin,
            country: hospitalData.country || 'India'
          },
          hospitalDetails: {
            hospitalType: hospitalData.type === 'Other' ? hospitalData.typeOther || 'Other' : hospitalData.type || '',
            beds: hospitalData.beds ? parseInt(hospitalData.beds) : undefined,
            establishmentYear: hospitalData.year || '',
            website: hospitalData.website ? hospitalData.website.toLowerCase() : '',
            ownershipType: hospitalData.ownershipType || '',
            director: {
              name: hospitalData.director || '',
              contact: hospitalData.directorContact || '',
              email: hospitalData.directorEmail ? hospitalData.directorEmail.toLowerCase() : ''
            },
            admin: {
              name: hospitalData.admin || '',
              contact: hospitalData.adminContact || '',
              email: hospitalData.adminEmail ? hospitalData.adminEmail.toLowerCase() : ''
            },
            departments: [
              ...(hospitalData.departments || []).filter(dept => dept !== 'Other'),
              ...(hospitalData.departmentsOther ? hospitalData.departmentsOther.split(',').map(dept => dept.trim()).filter(dept => dept) : [])
            ]
          },
          licenseNumber: hospitalData.license || '',
          qualification: hospitalData.pan || '',
          remarks: remarks || '',
          typeOfEnquiry: leadStatus,
          doctorStatus: salesStatus,
          doctorType: 'hospital',
          membershipType: membershipType,
          status: 'pending',
          followUps: followUpDate || followUpMessage ? [{
            date: followUpDate ? new Date(followUpDate) : new Date(),
            type: 'call',
            notes: followUpMessage || '',
            nextFollowUpDate: followUpDate ? new Date(followUpDate) : undefined,
            createdAt: new Date()
          }] : [],
          documents: {
            hospitalPanDocument: hospitalFiles.hospitalPan || '',
            registrationCertificate: hospitalFiles.registrationCert || '',
            hospitalGstDocument: hospitalFiles.hospitalGst || '',
            ownerPanCard: hospitalFiles.ownerPan || '',
            ownerAadhaarCard: hospitalFiles.ownerAadhaar || '',
            license: hospitalFiles.registrationCert || '',
            qualificationDoc: hospitalFiles.hospitalGst || '',
            otherDocs: Object.values(hospitalFiles).filter(path => path && typeof path === 'string' &&
              !['hospitalPan', 'registrationCert', 'hospitalGst', 'ownerPan', 'ownerAadhaar'].includes(path.split('/').pop().split('.')[0]))
          }
        };
      }
      // For hospital + individual
      else if (membershipType === 'Hospital + Individual') {
        // Validate that we have both hospital and doctor data
        if (hospitals.length === 0 || doctors.length === 0) {
          toast.error('Please fill in both Hospital and Doctor details');
          setLoading(false);
          return;
        }

        const hospitalData = hospitals[0];


        toProperUpperCase(hospitalData);


        // Validate hospital data
        if (!hospitalData.name || !hospitalData.contact) {
          toast.error('Please fill in required fields: Hospital Name and Contact');
          setLoading(false);
          return;
        }

        // Create separate doctor records for each doctor in the hospital
        const doctorsToCreate = [];

        for (let i = 0; i < doctors.length; i++) {
          const doctorData = doctors[i];


          toProperUpperCase(doctorData);


          // Validate each doctor has required fields
          if (!doctorData.name || !doctorData.mobile) {
            toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
            setLoading(false);
            return;
          }

          // Create individual doctor record
          const doctorRecord = {
            membershipId: membershipId || undefined,
            membershipDate: membershipDate ? new Date(membershipDate) : undefined,
            fullName: doctorData.name,
            dateOfBirth: doctorData.dob ? new Date(doctorData.dob) : undefined,
            email: doctorData.email || '',
            phoneNumber: doctorData.mobile || '',
            whatsappNumber: doctorData.wa || '',
            specialization: doctorData.speciality ? [doctorData.speciality] : [],
            qualification: doctorData.qualification || '',
            experience: doctorData.experience || '',
            licenseNumber: doctorData.regNo || '',
            registrationYear: doctorData.regYear || '',
            aadharNumber: doctorData.aadhar || '',
            panNumber: doctorData.pan || '',
            hospitalName: hospitalData.name,
            hospitalAddress: {
              address: hospitalData.address || '',
              city: hospitalData.city || '',
              state: hospitalData.state || '',
              district: hospitalData.district || '',
              taluka: hospitalData.taluka || '',
              pinCode: hospitalData.pin || '',
              country: hospitalData.country || 'India'
            },
            hospitalDetails: {
              hospitalType: hospitalData.type === 'Other' ? hospitalData.typeOther || 'Other' : hospitalData.type || '',
              beds: hospitalData.beds ? parseInt(hospitalData.beds) : undefined,
              establishmentYear: hospitalData.year || '',
              website: hospitalData.website || '',
              ownershipType: hospitalData.ownershipType || '',
              hospitalPanNumber: hospitalData.pan || '',  // Hospital PAN number
              licenseNumber: hospitalData.license || '', // Hospital license number
              director: {
                name: hospitalData.director || '',
                contact: hospitalData.directorContact || '',
                email: hospitalData.directorEmail || ''
              },
              admin: {
                name: hospitalData.admin || '',
                contact: hospitalData.adminContact || '',
                email: hospitalData.adminEmail || ''
              },
              departments: [
                ...(hospitalData.departments || []).filter(dept => dept !== 'Other'),
                ...(hospitalData.departmentsOther ? hospitalData.departmentsOther.split(',').map(dept => dept.trim()).filter(dept => dept) : [])
              ]
            },
            contactDetails: {
              phoneNumber: doctorData.mobile || '',
              whatsapp: doctorData.wa || '',
              emailId: doctorData.email || '',
              currentAddress: {
                address: doctorData.address || '',
                pinCode: doctorData.pin || '',
                city: doctorData.city || '',
                state: doctorData.state || '',
                district: doctorData.district || '',
                taluka: doctorData.taluka || '',
                country: doctorData.country || 'India'
              }
            },
            typeOfEnquiry: leadStatus,
            doctorStatus: salesStatus,
            doctorType: 'hospital_individual',
            membershipType: membershipType,
            status: 'pending',
            remarks: remarks || '',
            followUps: followUpDate || followUpMessage ? [{
              date: followUpDate ? new Date(followUpDate) : new Date(),
              type: 'call',
              notes: followUpMessage || '',
              nextFollowUpDate: followUpDate ? new Date(followUpDate) : undefined,
              createdAt: new Date()
            }] : [],
            documents: {
              aadhar: uploadedFiles[i]?.aadhar || '',
              pan: uploadedFiles[i]?.pan || '',
              medicalRegistration: uploadedFiles[i]?.medicalReg || '',
              additionalQualification: uploadedFiles[i]?.qualification || '',
              visitingCard: uploadedFiles[i]?.visitingCard || '',
              bankDetails: uploadedFiles[i]?.bankDetails || '',
              hospitalPanDocument: uploadedFiles[i]?.hospitalPan || uploadedFiles[i]?.registrationCert || '',
              registrationCertificate: uploadedFiles[i]?.registrationCert || '',
              hospitalGstDocument: uploadedFiles[i]?.hospitalGst || uploadedFiles[i]?.qualification || '',
              ownerPanCard: uploadedFiles[i]?.ownerPan || '',
              ownerAadhaarCard: uploadedFiles[i]?.ownerAadhaar || '',
              license: uploadedFiles[i]?.medicalReg || uploadedFiles[i]?.registrationCert || '',
              qualificationDoc: uploadedFiles[i]?.qualification || uploadedFiles[i]?.hospitalGst || '',
              otherDocs: Object.values(uploadedFiles[i] || {}).filter(path => path && typeof path === 'string' &&
                !['aadhar', 'pan', 'medicalReg', 'qualification', 'visitingCard', 'bankDetails', 'hospitalPan', 'registrationCert', 'hospitalGst', 'ownerPan', 'ownerAadhaar'].includes(path.split('/').pop().split('.')[0]))
            }
          };

          doctorsToCreate.push(doctorRecord);
        }

        // Create all doctors sequentially to handle any validation errors
        try {
          const createdDoctors = [];  // Store actual created doctor objects to get IDs for linking
          const failedDoctors = [];

          for (let i = 0; i < doctorsToCreate.length; i++) {
            try {
              const doctorData = doctorsToCreate[i];

              if (!doctorData || !doctorData.fullName) {
                throw new Error(`Invalid data for Doctor ${i + 1}`);
              }

              const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
              if (response.data.success) {
                createdDoctors.push({
                  index: i + 1,
                  doctorId: response.data.data._id,
                  data: response.data.data
                });
              }
            } catch (error) {
              console.error(`Error creating Doctor ${i + 1}:`, error);
              failedDoctors.push(i + 1);
            }
          }

          // Now handle spouse linking if needed for Hospital + Individual
          if (linkAsSpouses && membershipType === "Hospital + Individual" && createdDoctors.length === 2) {
            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[0].doctorId),
              {
                linkedDoctorId: createdDoctors[1].doctorId,
                relationshipType: 'spouse'
              }
            );

            await apiClient.put(
              apiEndpoints.doctors.update(createdDoctors[1].doctorId),
              {
                linkedDoctorId: createdDoctors[0].doctorId,
                relationshipType: 'spouse'
              }
            );
          }

          // Automatically accept all created doctors to create user accounts
          let acceptSuccessCount = 0;
          for (const createdDoctor of createdDoctors) {
            try {
              const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(createdDoctor.doctorId), {});
              if (acceptResponse.data.success) {
                acceptSuccessCount++;
              } else {
                console.error(`Failed to accept doctor ${createdDoctor.doctorId}:`, acceptResponse.data.message);
              }
            } catch (acceptError) {
              console.error(`Error accepting doctor ${createdDoctor.doctorId}:`, acceptError);
            }
          }

          if (failedDoctors.length > 0) {
            toast.warning(`Created ${createdDoctors.length} doctor(s) successfully, but ${failedDoctors.length} failed (Doctor ${failedDoctors.join(', ')})`);
          } else if (acceptSuccessCount === createdDoctors.length) {
            toast.success(`Hospital + Individual membership created and accepted successfully with ${createdDoctors.length} doctor(s)! User accounts created.`);
          } else if (acceptSuccessCount > 0) {
            toast.warning(`Hospital + Individual membership created with ${createdDoctors.length} doctor(s), ${acceptSuccessCount} accepted successfully. Some user accounts may not be created.`);
          } else {
            toast.warning(`Hospital + Individual membership created with ${createdDoctors.length} doctor(s), but acceptance failed. User accounts not created.`);
          }

          // Navigate to quotation creation page with the first doctor's ID
          if (createdDoctors.length > 0) {
            navigate(`/admin/create-quotation?doctorId=${createdDoctors[0].doctorId}`);
          }

          // Reset form only if all doctors were created successfully
          if (failedDoctors.length === 0) {
            setHospitals([{}]);
            setDoctors([{}]);
            setMembershipId('');
            setMembershipDate('');
            setLeadStatus('cold');
            setSalesStatus('cold');
            setFollowUpDate('');
            setFollowUpMessage('');
            setRemarks('');
            setUploadedFiles([{}]);
          }
        } catch (error) {
          console.error('Error creating doctors:', error);
          toast.error(error.response?.data?.message || 'Failed to create doctors');
          setLoading(false);
          return;
        }

        // Important: Return here to prevent falling through to the Hospital-only code below
        setLoading(false);
        return;
      }
      else {
        toast.error('Please select a membership type and fill required fields');
        setLoading(false);
        return;
      }

      const response = await apiClient.post(apiEndpoints.doctors.create, transformedData);

      if (response.data.success) {
        // Automatically accept the doctor to create user account
        try {
          const doctorId = response.data.data._id;
          const acceptResponse = await apiClient.put(apiEndpoints.doctors.accept(doctorId), {});
          if (acceptResponse.data.success) {
            if (membershipType === 'Individual') {
              toast.success('Doctor created and accepted successfully! User account created.');
            } else if (membershipType === 'Hospital') {
              toast.success('Hospital membership created and accepted successfully! User account created.');
            }
          } else {
            // Accept failed, but doctor was created
            if (membershipType === 'Individual') {
              toast.warning('Doctor created but acceptance failed. User account not created.');
            } else if (membershipType === 'Hospital') {
              toast.warning('Hospital membership created but acceptance failed. User account not created.');
            }
          }

          // Navigate to quotation creation page with the doctor's ID
          navigate(`/admin/create-quotation?doctorId=${doctorId}`);
        } catch (acceptError) {
          console.error('Error accepting doctor:', acceptError);
          // Still navigate to quotation page but show warning
          toast.warning('Doctor created but acceptance failed. User account not created.');
          navigate(`/admin/create-quotation?doctorId=${response.data.data._id}`);
        }

        // Reset form
        setMembershipId('');
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        setMembershipDate(`${day}-${month}-${year}`);
        setLeadStatus('cold');
        setSalesStatus('cold');
        setFollowUpDate('');
        setFollowUpMessage('');
        setRemarks('');
        setUploadedFiles([{}]);
        setFilePreviews([{}]);
      }

    } catch (error) {
      console.error('Error creating membership:', error);
      toast.error(error.response?.data?.message || 'Failed to create membership');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDoctors([{}]);
    setHospitals([{}]);
    setUploadedFiles([{}]);
    setFilePreviews([{}]);
    setMembershipId('');
    // Reset to current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setMembershipDate(`${day}-${month}-${year}`);
    setLeadStatus('cold');
    setSalesStatus('cold');
    setFollowUpDate('');
    setFollowUpMessage('');
    setRemarks('');
    setSameAsAboveHospital({});
    toast.info('Form cleared');
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Membership Form</h1>

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="M.ID (Optional - Auto-generated if left empty)"
              placeholder="Enter Membership ID or leave empty for auto-generation"
              value={membershipId}
              onChange={setMembershipId}
            />
            <DateInput
              label="Date"
              value={membershipDate}
              onChange={setMembershipDate}
              returnFormat='yyyy-mm-dd'
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
              >
                <option value="Hospital">Hospital Membership</option>
                <option value="Individual">Individual Membership</option>
                <option value="Hospital + Individual">Individual + Hopsital Membership</option>
              </select>
            </div>
          </div>

          {/* ================= HOSPITAL FORM ================= */}
          {(membershipType === 'Hospital' || membershipType === 'Hospital + Individual') && (
            <>
              <h2 className="text-xl font-semibold text-[#15BBB3] mt-8 mb-4">Hospital Membership Details</h2>
              {hospitals.map((hospital, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 mb-8 relative bg-gray-50">
                  {hospitals.length > 1 && (
                    <button
                      onClick={() => removeHospital(idx)}
                      className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                  <HospitalFormFields
                    data={hospital}
                    onChange={(f, v) => handleHospitalChange(idx, f, v)}
                  />

                  {/* ================= HOSPITAL DOCUMENTS ================= */}
                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <h3 className="text-lg font-semibold text-[#15BBB3] mb-4">Hospital Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUpload
                        label="Hospital PAN Document"
                        onFileSelect={(file) => handleFileUpload(file, 'hospitalPan', 0)}
                        fileName={uploadedFiles[0]?.hospitalPan}
                        preview={filePreviews[0]?.hospitalPan}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Registration Certificate"
                        onFileSelect={(file) => handleFileUpload(file, 'registrationCert', 0)}
                        fileName={uploadedFiles[0]?.registrationCert}
                        preview={filePreviews[0]?.registrationCert}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Hospital GST Document"
                        onFileSelect={(file) => handleFileUpload(file, 'hospitalGst', 0)}
                        fileName={uploadedFiles[0]?.hospitalGst}
                        preview={filePreviews[0]?.hospitalGst}
                        onPreviewClick={handlePreviewClick}
                      />
                      {membershipType === 'Hospital' && (
                        <>
                          <FileUpload
                            label="Owner Aadhaar Card"
                            onFileSelect={(file) => handleFileUpload(file, 'ownerAadhaar', 0)}
                            fileName={uploadedFiles[0]?.ownerAadhaar}
                            preview={filePreviews[0]?.ownerAadhaar}
                            onPreviewClick={handlePreviewClick}
                          />
                          <FileUpload
                            label="Owner PAN Card"
                            onFileSelect={(file) => handleFileUpload(file, 'ownerPan', 0)}
                            fileName={uploadedFiles[0]?.ownerPan}
                            preview={filePreviews[0]?.ownerPan}
                            onPreviewClick={handlePreviewClick}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ================= INDIVIDUAL FORM ================= */}
          {(membershipType === 'Individual' || membershipType === 'Hospital + Individual') && (
            <>
              <h2 className="text-xl font-semibold text-[#15BBB3] mt-8 mb-4">Doctor Details</h2>
              {doctors.map((doctor, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 mb-8 relative bg-gray-50">
                  {doctors.length > 1 && (
                    <button
                      onClick={() => removeDoctor(idx)}
                      className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Doctor {idx + 1}</h3>
                  </div>

                  <DoctorFormFields
                    data={doctor}
                    onChange={(f, v) => handleDoctorChange(idx, f, v)}
                    membershipType={membershipType}
                    doctor1Data={idx > 0 ? doctors[0] : null}
                    sameAsAbove={sameAsAboveHospital[idx] || false}
                    onSameAsAboveChange={(checked) => handleSameAsAboveChange(idx, checked)}
                  />

                  {/* ================= UPLOAD DOCUMENTS FOR THIS DOCTOR ================= */}
                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <h3 className="text-lg font-semibold text-[#15BBB3] mb-4">Upload Documents for Doctor {idx + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUpload
                        label="Aadhar"
                        onFileSelect={(file) => handleFileUpload(file, 'aadhar', idx)}
                        fileName={uploadedFiles[idx]?.aadhar}
                        preview={filePreviews[idx]?.aadhar}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="PAN"
                        onFileSelect={(file) => handleFileUpload(file, 'pan', idx)}
                        fileName={uploadedFiles[idx]?.pan}
                        preview={filePreviews[idx]?.pan}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Medical Reg."
                        onFileSelect={(file) => handleFileUpload(file, 'medicalReg', idx)}
                        fileName={uploadedFiles[idx]?.medicalReg}
                        preview={filePreviews[idx]?.medicalReg}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Additional Qualification"
                        onFileSelect={(file) => handleFileUpload(file, 'qualification', idx)}
                        fileName={uploadedFiles[idx]?.qualification}
                        preview={filePreviews[idx]?.qualification}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Visiting Card"
                        onFileSelect={(file) => handleFileUpload(file, 'visitingCard', idx)}
                        fileName={uploadedFiles[idx]?.visitingCard}
                        preview={filePreviews[idx]?.visitingCard}
                        onPreviewClick={handlePreviewClick}
                      />
                      <FileUpload
                        label="Bank Details"
                        onFileSelect={(file) => handleFileUpload(file, 'bankDetails', idx)}
                        fileName={uploadedFiles[idx]?.bankDetails}
                        preview={filePreviews[idx]?.bankDetails}
                        onPreviewClick={handlePreviewClick}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addDoctor}
                className="bg-[#15BBB3] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#13a89e] transition"
              >
                <span className="text-xl">+</span> Add Another Doctor
              </button>
              {(membershipType === "Individual" || membershipType === "Hospital + Individual") && doctors.length === 2 && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="linkAsSpousesSuperadmin"
                      checked={linkAsSpouses}
                      onChange={(e) => setLinkAsSpouses(e.target.checked)}
                      className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="linkAsSpousesSuperadmin" className="ml-3 block text-sm text-gray-700 flex-1">
                      <span className="font-medium">Link these doctors as spouses</span> - Combine names on bills (e.g., "Raju & Sunita")
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= STATUS & FOLLOW-UP ================= */}
          <h2 className="text-xl font-semibold text-[#15BBB3] mt-10 mb-4">Status & Follow-up</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="follow_up">Follow Up</option>
                <option value="hot">Hot (Priority)</option>
                <option value="closed">Closed (Converted)</option>
                <option value="cancel">Cancel (Membership Expired)</option>
                <option value="cold">Cold (Not Interested)</option>
              </select>
            </div>

            <DateInput
              label="Follow-up Date"
              value={followUpDate}
              onChange={setFollowUpDate}
              returnFormat='yyyy-mm-dd'
            />
            <Input
              label="Follow-up Message"
              placeholder="Enter follow-up message"
              value={followUpMessage}
              onChange={setFollowUpMessage}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Narration / Remarks</label>
            <textarea
              rows="4"
              placeholder="Enter remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3]"
            />
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleGiveQuote}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Give Quote'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ImagePreviewModal
        isOpen={modalOpen}
        onClose={closeModal}
        preview={currentPreview}
      />
    </>
  );
};

// ================= DOCTOR FORM FIELDS =================
const DoctorFormFields = ({ data, onChange, membershipType, doctor1Data, sameAsAbove, onSameAsAboveChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Name of Doctor" value={data.name} onChange={(v) => onChange('name', v)} />
        <DateInput label="Date of Birth" returnFormat='yyyy-mm-dd' value={data.dob} onChange={(v) => onChange('dob', v)} />
        <Input label="Qualification" value={data.qualification} onChange={(v) => onChange('qualification', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Speciality" value={data.speciality} onChange={(v) => onChange('speciality', v)} />
        <Input label="Registered Number" value={data.regNo} onChange={(v) => onChange('regNo', v)} />
        <Input label="Reg. Year" value={data.regYear} onChange={(v) => onChange('regYear', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InputNum label="Mobile No" value={data.mobile} onChange={(v) => onChange('mobile', v)} maxLength={10} />
        <InputNum label="WA No" value={data.wa} onChange={(v) => onChange('wa', v)} maxLength={10} />
        <EmailInput label="Email ID" value={data.email} onChange={(v) => onChange('email', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InputNum label="Aadhar No" value={data.aadhar} onChange={(v) => onChange('aadhar', v)} maxLength={12} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PAN No
          </label>
          <input
            type="text"
            value={data.pan || ''}
            onChange={(e) => {
              let val = e.target.value.toUpperCase();
              val = val.replace(/[^A-Z0-9]/g, ''); // Space aur special char remove
              if (val.length > 10) val = val.slice(0, 10);
              onChange('pan', val);
            }}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm uppercase focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3] outline-none"
          />
          {data.pan && data.pan.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan) && (
            <p className="text-xs text-red-600 mt-1">Invalid PAN format</p>
          )}
          {data.pan && data.pan.length < 10 && data.pan.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">PAN must be 10 characters</p>
          )}
          <p className="text-xs text-gray-500 mt-1 text-right">
            {data.pan?.length || 0}/10
          </p>
        </div>
        {/* <InputNum label="PAN No" value={data.pan} onChange={(v) => onChange('pan', v)} maxLength={10} allowAlpha={true} /> */}
        <Input label="Residential Address" value={data.address} onChange={(v) => onChange('address', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputNum label="Pin Code" value={data.pin} onChange={(v) => onChange('pin', v)} maxLength={6} />
        <LocationInput label="City" value={data.city} onChange={(v) => onChange('city', v)} type="city" />
        <LocationInput label="Taluka" value={data.taluka} onChange={(v) => onChange('taluka', v)} type="taluka" />
        <LocationInput label="District" value={data.district} onChange={(v) => onChange('district', v)} type="district" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <LocationInput label="State" value={data.state} onChange={(v) => onChange('state', v)} type="state" />
        <Input label="Country" value={data.country || 'India'} onChange={(v) => onChange('country', v)} />
      </div>

      {/* Hospital Details for Individual - हमेशा दिखाओ */}
      {membershipType === 'Individual' && (
        <>
          <h3 className="text-lg font-semibold text-[#15BBB3] mt-8 mb-4">Hospital Details</h3>

          {/* Same as above checkbox - सिर्फ Additional doctors के लिए (Doctor 2, 3, ...) */}
          {doctor1Data && doctor1Data.hospitalName && (
            <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsAbove}
                  onChange={(e) => onSameAsAboveChange(e.target.checked)}
                  className="mr-2 w-4 h-4 accent-blue-600 rounded"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Same as Doctor 1's hospital details (Autofill)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Will copy hospital details from Doctor 1
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Name of Hospital/Clinic"
              value={data.hospitalName}
              onChange={(v) => onChange('hospitalName', v)}
            />
            <Input
              label="Hospital Address"
              value={data.hospitalAddress}
              onChange={(v) => onChange('hospitalAddress', v)}
            />
            <InputNum
              label="Pin Code"
              value={data.hospitalPin}
              onChange={(v) => onChange('hospitalPin', v)}
              maxLength={6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Country"
              value={data.hospitalCountry || 'India'}
              onChange={(v) => onChange('hospitalCountry', v)}
            />
            <LocationInput
              label="State"
              value={data.hospitalState}
              onChange={(v) => onChange('hospitalState', v)}
              type="state"
            />
            <LocationInput
              label="District"
              value={data.hospitalDistrict}
              onChange={(v) => onChange('hospitalDistrict', v)}
              type="district"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="Taluka"
              value={data.hospitalTaluka}
              onChange={(v) => onChange('hospitalTaluka', v)}
              type="taluka"
            />
            <LocationInput
              label="City"
              value={data.hospitalCity}
              onChange={(v) => onChange('hospitalCity', v)}
              type="city"
            />
          </div>
        </>
      )}
    </>
  );
};

// ================= HOSPITAL FORM FIELDS =================
const HospitalFormFields = ({ data, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Hospital Name" value={data.name} onChange={(v) => onChange('name', v)} />
        <div>
          <Select
            label="Type of Hospital"
            options={['General Hospital', 'Maternity Home', 'Multispeciality Hospital', 'Super-Speciality Hospital', 'Surgical Hospital', 'Diagnostic Center', , 'Dental Care', 'Other']}
            // options={['Maternity Home', 'Multi-Speciality','Diagnostic Center' , 'Super Speciality Hospital' ,'Dental Case', 'Other']}
            value={data.type}
            onChange={(v) => onChange('type', v)}
          />
          {data.type === 'Other' && (
            <Input
              label=""
              placeholder="Please specify hospital type"
              value={data.typeOther || ''}
              onChange={(v) => onChange('typeOther', v)}
              className="mt-2"
            />
          )}
        </div>
        <InputNum label="No. of Beds" placeholder='20' value={data.beds} onChange={(v) => onChange('beds', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Regi / License No" value={data.licenseNumber} onChange={(v) => onChange('licenseNumber', v)} />
        <InputNum label="Year of Establishment" placeholder='2003' value={data.year} onChange={(v) => onChange('year', v)} />


        <Input
          label="Hospital PAN"
          value={data.pan || ''}
          placeholder="ABCDE1234F"
          maxLength={10}
          onChange={(val) => {
            let v = val.toUpperCase();
            v = v.replace(/[^A-Z0-9]/g, ''); // space & special chars remove
            if (v.length > 10) v = v.slice(0, 10);
            onChange('pan', v);
          }}
        />

        {/* <Input label="Hospital PAN" value={data.pan} onChange={(v) => onChange('pan', v)} /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Input label="Address" value={data.address} onChange={(v) => onChange('address', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputNum label="Pin Code" value={data.pin} maxLength={6} placeholder='Enter 6 digit pincode' onChange={(v) => onChange('pin', v)} />
        <LocationInput label="City" value={data.city} onChange={(v) => onChange('city', v)} type="city" />
        <LocationInput label="Taluka" value={data.taluka} onChange={(v) => onChange('taluka', v)} type="taluka" />
        <LocationInput label="District" value={data.district} onChange={(v) => onChange('district', v)} type="district" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <LocationInput label="State" value={data.state} onChange={(v) => onChange('state', v)} type="state" />
        <Input label="Country" value={data.country || 'India'} onChange={(v) => onChange('country', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputNum label="Contact No" maxLength={10} value={data.contact} onChange={(v) => onChange('contact', v)} />
        <InputNum label="WhatsApp" maxLength={10} value={data.whatsapp} onChange={(v) => onChange('whatsapp', v)} />
        <EmailInput label="Email" value={data.email} onChange={(v) => onChange('email', v)} />
        <WebsiteInput label="Website" value={data.website} onChange={(v) => onChange('website', v)} />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Ownership / Admin</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select
          label="Ownership Type"
          options={['Private', 'Government', 'Trust', 'Corporate']}
          value={data.ownershipType}
          onChange={(v) => onChange('ownershipType', v)}
        />
        <Input label="Medical Superintendent / Director Name" value={data.director} onChange={(v) => onChange('director', v)} />
        <InputNum label="Director Contact No" value={data.directorContact} onChange={(v) => onChange('directorContact', v)} maxLength={10} />
        <EmailInput label="Email" value={data.directorEmail} onChange={(v) => onChange('directorEmail', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input label="Admin / Mgmt Officer Name" value={data.admin} onChange={(v) => onChange('admin', v)} />
        <InputNum label="Contact No" maxLength={10} value={data.adminContact} onChange={(v) => onChange('adminContact', v)} />
        <EmailInput label="Email" value={data.adminEmail} onChange={(v) => onChange('adminEmail', v)} />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Departments Available</h3>
      <div className="flex flex-wrap gap-4 mb-6">
        {['Surgery', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Dental', 'Radiology', 'Pathology', 'ICU', 'NICU', 'Other'].map(dept => (
          <label key={dept} className="flex items-center">
            <input
              type="checkbox"
              checked={data.departments?.includes(dept) || false}
              onChange={(e) => {
                const currentDepts = data.departments || [];
                if (e.target.checked) {
                  onChange('departments', [...currentDepts, dept]);
                } else {
                  onChange('departments', currentDepts.filter(d => d !== dept));
                }
              }}
              className="mr-2 w-4 h-4 accent-[#15BBB3] rounded"
            />
            <span className="text-sm">{dept}</span>
          </label>
        ))}
      </div>
      {data.departments?.includes('Other') && (
        <div className="mb-6">
          <Input
            label="Other Departments (comma separated)"
            placeholder="e.g., Cardiology, Neurology, Dermatology"
            value={data.departmentsOther || ''}
            onChange={(v) => onChange('departmentsOther', v)}
          />
        </div>
      )}
    </>
  );
};

// ================= HELPER COMPONENTS =================
const Input = ({ label, value, onChange, placeholder, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="mt-1 uppercase block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3]"
    />
  </div>
);

const InputNum = ({
  label,
  value = '',
  onChange,
  placeholder = '',
  maxLength,
  allowAlpha = false,
  className = '',
}) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (!allowAlpha) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    if (maxLength && inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    onChange?.(inputValue);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        inputMode={allowAlpha ? "text" : "numeric"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                   focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]
                   outline-none transition
                   [appearance:textfield]
                   [&::-webkit-outer-spin-button]:hidden
                   [&::-webkit-inner-spin-button]:hidden`}
      />
      {maxLength && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
  );
};

const EmailInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="email"
      value={value || ''}
      onChange={(e) => {
        const val = e.target.value.toLowerCase();
        onChange?.(val);
      }}
      placeholder={placeholder || "example@email.com"}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase"
    />
  </div>
);

const WebsiteInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => {
        const val = e.target.value.toLowerCase();
        onChange?.(val);
      }}
      placeholder={placeholder || "www.example.com"}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase"
    />
  </div>
);

// const DateInput = ({ label, value, onChange }) => {
//   const handleChange = (e) => {
//     const inputValue = e.target.value;

//     // Convert from yyyy-mm-dd to dd-mm-yyyy for display
//     if (inputValue) {
//       const parts = inputValue.split('-');
//       if (parts.length === 3) {
//         const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
//         onChange?.(formattedDate);
//       } else {
//         onChange?.(inputValue);
//       }
//     } else {
//       onChange?.('');
//     }
//   };

//   // Convert dd-mm-yyyy to yyyy-mm-dd for input
//   const formatForInput = (dateStr) => {
//     if (!dateStr) return '';
//     const parts = dateStr.split('-');
//     if (parts.length === 3 && parts[2].length === 4) {
//       return `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }
//     return dateStr;
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <input
//         type="date"
//         value={formatForInput(value) || ''}
//         onChange={handleChange}
//         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//       />
//       {value && (
//         <p className="text-xs text-gray-500 mt-1">
//           Format: dd-mm-yyyy (Current: {value})
//         </p>
//       )}
//     </div>
//   );
// };

const Select = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
    >
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default AddMembershipForm;