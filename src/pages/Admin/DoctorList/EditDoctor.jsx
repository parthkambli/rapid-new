import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import DateInput from "../../../components/DateInput/DateInput";
import LocationInput from "../../../components/LocationInput";

// Helper function to uppercase text fields (exclude email, website, numbers)
const toProperUpperCase = (data) => {
  const textKeys = [
    'name', 'fullName', 'hospitalName', 'qualification', 'specialization',
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

  // Handle nested objects for addresses if they exist
  if (data.hospitalAddress && typeof data.hospitalAddress === 'object') {
    Object.keys(data.hospitalAddress).forEach(k => {
      if (data.hospitalAddress[k] && typeof data.hospitalAddress[k] === 'string') {
        data.hospitalAddress[k] = data.hospitalAddress[k].trim().toUpperCase();
      }
    });
  }

  if (data.contactDetails?.currentAddress && typeof data.contactDetails.currentAddress === 'object') {
    Object.keys(data.contactDetails.currentAddress).forEach(k => {
      if (data.contactDetails.currentAddress[k] && typeof data.contactDetails.currentAddress[k] === 'string') {
        data.contactDetails.currentAddress[k] = data.contactDetails.currentAddress[k].trim().toUpperCase();
      }
    });
  }

  // Specialization array/string
  if (data.specialization) {
    if (typeof data.specialization === 'string') {
      data.specialization = data.specialization.trim().toUpperCase();
    } else if (Array.isArray(data.specialization)) {
      data.specialization = data.specialization.map(s => s.trim().toUpperCase());
    }
  }

  // Website lowercase
  if (data.website) {
    data.website = data.website.trim().toLowerCase();
  }
  // Email lowercase
  if (data.email) {
    data.email = data.email.trim().toLowerCase();
  }

  // Notes uppercase (follow up message)
  if (data.notes) {
    data.notes = data.notes.trim().toUpperCase();
  }

  return data;
};

// ================= MAIN COMPONENT =================
const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Array to hold multiple doctors (Main + Spouse/Linked)
  const [doctors, setDoctors] = useState([]);

  // To track spouse removed from UI for unlinking on save
  const [unlinkedSpouseId, setUnlinkedSpouseId] = useState(null);

  // State for same as above checkbox for hospital details
  const [sameAsAboveHospital, setSameAsAboveHospital] = useState({});

  // Arrays to hold documents for each doctor
  const [uploadedFiles, setUploadedFiles] = useState([{}]);
  const [filePreviews, setFilePreviews] = useState([{}]);

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
      license: '', // Legacy field for backward compatibility
      licenseNumber: '', // Add the hospital license number field
      director: { name: '', contact: '', email: '' },
      admin: { name: '', contact: '', email: '' },
      departments: [],
      departmentsOther: ''
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
    },
    followUps: [],
    newFollowUpDate: '',
    newFollowUpMessage: '',
    linkAsSpouses: false
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

          // Fetch and set all linked doctors
          const docs = doctorData.isLinked
            ? [doctorData.mainDoctor, doctorData.linkedDoctor]
            : [doctorData];

          // --- NEW FIX: Enforce spouse hospital details sync on initial load ---
          if (docs.length > 1) {
            const mainDoctor = docs[0];
            const spouseDoctor = docs[1];

            // Ensure spouse's hospital details are a mirror of the main doctor's
            if (spouseDoctor) {
              spouseDoctor.hospitalName = mainDoctor.hospitalName || '';
              // Create a copy of the address object
              spouseDoctor.hospitalAddress = mainDoctor.hospitalAddress ? { ...mainDoctor.hospitalAddress } : { address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India' };
            }
          }

          setDoctors(docs);

          // Populate form data
          const membershipDateValue = processedDoctorData.membershipDate
            ? new Date(processedDoctorData.membershipDate).toISOString().split('T')[0]
            : processedDoctorData.createdAt
              ? new Date(processedDoctorData.createdAt).toISOString().split('T')[0]
              : '';

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
            membershipDate: membershipDateValue,
            membershipType: processedDoctorData.membershipType || '',
            typeOfEnquiry: processedDoctorData.typeOfEnquiry || '',
            doctorStatus: processedDoctorData.doctorStatus || '',
            status: processedDoctorData.status || '',
            remarks: processedDoctorData.remarks || '',
            doctorType: processedDoctorData.doctorType || 'individual', // Load the current doctor type
            hospitalName: processedDoctorData.hospitalName || '',
            hospitalAddress: processedDoctorData.hospitalAddress || {
              address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
            },
            hospitalDetails: processedDoctorData.hospitalDetails || {
              hospitalType: '', beds: '', establishmentYear: '', website: '', ownershipType: 'Private',
              director: { name: '', contact: '', email: '' },
              admin: { name: '', contact: '', email: '' },
              departments: [],
              departmentsOther: ''
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
            },
            followUps: processedDoctorData.followUps || [],
            newFollowUpDate: '',
            newFollowUpMessage: '',
            linkAsSpouses: processedDoctorData.isLinked && processedDoctorData.relationshipType === 'spouse'
          });
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
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const keys = field.split('.');

      // If changing doctor type, clear hospital-specific fields when switching to individual
      // BUT preserve the basic hospital info fields: Name of Hospital/Clinic, Hospital Address, Pin Code, Country, State, District, Taluka, City
      let updatedPrev = {...prev};
      if (field === 'doctorType' && value === 'individual') {
        // Clear only the specific hospital fields that should not exist for individual doctors
        // Preserve: hospitalName, hospitalAddress (address, city, state, district, taluka, pinCode, country)
        updatedPrev = {
          ...prev,
          // Keep hospitalName as is
          // Keep hospitalAddress as is (address, city, state, district, taluka, pinCode, country)
          hospitalDetails: {
            hospitalType: '',
            beds: '',
            establishmentYear: '',
            website: '',
            ownershipType: 'Private', // Reset to default
            director: { name: '', contact: '', email: '' },
            admin: { name: '', contact: '', email: '' },
            departments: [],
            departmentsOther: ''
          },
          // Clear hospital contact fields (Contact No, WhatsApp, Email)
          contactDetails: {
            ...prev.contactDetails,
            phoneNumber: '',
            whatsapp: '',
            emailId: ''
          },
          // Clear hospital documents
          documents: {
            ...prev.documents,
            hospitalPanDocument: '',
            registrationCertificate: '',
            hospitalGstDocument: '',
            ownerPanCard: '',
            ownerAadhaarCard: '',
            license: '', // Maps to registrationCertificate for hospital
            qualificationDoc: '' // Maps to hospitalGst for hospital
          }
        };
      }

      if (keys.length === 1) {
        // If changing doctor type, also update all doctors in the array
        if (field === 'doctorType') {
          setDoctors(prevDocs => {
            return prevDocs.map(doc => ({
              ...doc,
              doctorType: value
            }));
          });
        }
        return { ...updatedPrev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...updatedPrev,
          [keys[0]]: {
            ...updatedPrev[keys[0]],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...updatedPrev,
          [keys[0]]: {
            ...updatedPrev[keys[0]],
            [keys[1]]: {
              ...updatedPrev[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return updatedPrev;
    });
  };

  const handleDoctorInputChange = (index, field, value) => {
    setDoctors(prev => {
      const newDoctors = [...prev];

      // --- Update the doctor that was directly edited ---
      const keys = field.split('.');
      let targetDoctor = { ...newDoctors[index] };
      newDoctors[index] = targetDoctor;

      let current = targetDoctor;
      for (let i = 0; i < keys.length - 1; i++) {
        // Ensure nested objects exist before assigning to them
        current[keys[i]] = { ...(current[keys[i]] || {}) };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      // --- NEW: Sync to spouse if Doctor 1's hospital info changed ---
      if (index === 0 && newDoctors.length > 1 && field.startsWith('hospital')) {
          let spouseDoctor = { ...newDoctors[1] };
          newDoctors[1] = spouseDoctor;

          // Re-apply the same update logic to the spouse
          let currentSpouse = spouseDoctor;
          for (let i = 0; i < keys.length - 1; i++) {
            // Ensure nested objects exist
            currentSpouse[keys[i]] = { ...(currentSpouse[keys[i]] || {}) };
            currentSpouse = currentSpouse[keys[i]];
          }
          currentSpouse[keys[keys.length - 1]] = value;
      }

      // --- NEW: Sync doctor type and hospital details for both doctors ---
      if (field === 'doctorType' && newDoctors.length > 1) {
        // Update the doctor type for both doctors to ensure consistency
        newDoctors[0].doctorType = value;
        newDoctors[1].doctorType = value;

        // If the type is hospital_individual, copy all hospital details from first doctor to spouse doctor
        if (value === 'hospital_individual') {
          const mainDoctor = newDoctors[0];
          const spouseDoctor = { ...newDoctors[1] };

          // Copy hospital name and address
          spouseDoctor.hospitalName = mainDoctor.hospitalName || '';
          spouseDoctor.hospitalAddress = { ...mainDoctor.hospitalAddress } || {
            address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
          };

          // Copy contact details
          spouseDoctor.contactDetails = {
            ...spouseDoctor.contactDetails,
            phoneNumber: mainDoctor.contactDetails?.phoneNumber || '',
            whatsapp: mainDoctor.contactDetails?.whatsapp || '',
            emailId: mainDoctor.contactDetails?.emailId || ''
          };

          // Copy hospital details
          spouseDoctor.hospitalDetails = {
            ...mainDoctor.hospitalDetails
          };

          newDoctors[1] = spouseDoctor;
        }
      }

      return newDoctors;
    });

    // If it's the first doctor, also update top-level formData for compatibility
    if (index === 0) {
      handleInputChange(field, value);
    }
  };

  const handleAddDoctor = () => {
    if (doctors.length < 2) {
      // Initialize spouse doctor with main doctor's data as defaults, but with empty fields
      const mainDoctor = doctors[0] || formData;
      setDoctors(prev => [...prev, {
        // Copy basic info from main doctor but leave as empty initially
        fullName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        whatsappNumber: '',
        qualification: '',
        licenseNumber: '',
        registrationYear: '',
        aadharNumber: '',
        panNumber: '',
        specialization: [],
        // Copy hospital info from main doctor to ensure consistency
        hospitalName: mainDoctor.hospitalName || '',
        hospitalAddress: { ...mainDoctor.hospitalAddress } || {
          address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
        },
        // Copy contact details structure
        contactDetails: {
          ...mainDoctor.contactDetails,
          currentAddress: { ...mainDoctor.contactDetails?.currentAddress } || {
            address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
          }
        },
        // Initialize documents
        documents: {
          aadhar: '',
          pan: '',
          medicalRegistration: '',
          additionalQualification: '',
          visitingCard: '',
          bankDetails: '',
          otherDocs: []
        },
        // Copy other relevant fields from main doctor
        experience: mainDoctor.experience || '',
        typeOfEnquiry: mainDoctor.typeOfEnquiry || '',
        doctorStatus: mainDoctor.doctorStatus || '',
        status: mainDoctor.status || '',
        remarks: mainDoctor.remarks || '',
        followUps: []
      }]);

      // Automatically check the "Link as spouses" checkbox when adding a spouse doctor
      setFormData(prev => ({ ...prev, linkAsSpouses: true }));
    }
  };

  const handleRemoveDoctor = (index) => {
    if (index > 0) { // Only allow removing additional doctors (not the first one)
      const doctorToRemove = doctors[index];
      if (doctorToRemove?._id) {
        setUnlinkedSpouseId(doctorToRemove._id);
      }

      const updatedDoctors = [...doctors];
      updatedDoctors.splice(index, 1);
      setDoctors(updatedDoctors);

      // Also set linkAsSpouses to false to ensure UI consistency
      setFormData(prev => ({ ...prev, linkAsSpouses: false }));

      // Remove from sameAsAboveHospital state
      const updatedSameAsAbove = { ...sameAsAboveHospital };
      delete updatedSameAsAbove[index];
      setSameAsAboveHospital(updatedSameAsAbove);
    }
  };

  // Add new follow-up
  const handleAddNewFollowUp = async () => {
    if (!formData.newFollowUpDate && !formData.newFollowUpMessage) {
      toast.error("Please enter follow-up date or message");
      return;
    }

    try {
      // Get user information from the authentication context
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      const newFollowUpData = {
        date: formData.newFollowUpDate ? new Date(formData.newFollowUpDate) : new Date(),
        type: 'call',
        notes: formData.newFollowUpMessage || '',
        nextFollowUpDate: formData.newFollowUpDate ? new Date(formData.newFollowUpDate) : undefined,
      };

      // Call the backend API to add the follow-up properly with populated createdBy
      const response = await apiClient.post(apiEndpoints.doctors.followup(id), newFollowUpData);

      if (response.data.success) {
        // Update the local state with the newly created follow-up that has proper populated data
        setFormData(prev => ({
          ...prev,
          followUps: [...prev.followUps, response.data.data.followUps[response.data.data.followUps.length - 1]], // Add the latest follow-up
          newFollowUpDate: '',
          newFollowUpMessage: ''
        }));
        
        toast.success("Follow-up added successfully");
      } else {
        throw new Error(response.data.message || "Failed to add follow-up");
      }
    } catch (error) {
      console.error("Error adding follow-up:", error);
      toast.error(error.response?.data?.message || "Failed to add follow-up");
    }
  };

  // Helper function to get document name for a specific doctor
  const getDoctorDocumentName = (index, docType) => {
    if (index === 0) {
      // For the first doctor, use the main formData documents
      return formData.documents[docType] || doctors[index]?.documents?.[docType] || '';
    } else {
      // For additional doctors, use their specific documents
      return doctors[index]?.documents?.[docType] || '';
    }
  };

  // Helper function to get file preview for a specific doctor
  const getFilePreview = (index, docType) => {
    const previewKey = index === 0 ? docType : `${index}_${docType}`;
    return filePreviews[previewKey];
  };

  // Helper function to handle file upload for a specific doctor
  const handleDoctorFileUpload = async (index, file, docType) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    const previewKey = index === 0 ? docType : `${index}_${docType}`;
    reader.onload = (e) => {
      setFilePreviews(prev => ({
        ...prev,
        [previewKey]: {
          url: e.target.result,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }));
    };
    reader.readAsDataURL(file);

    const formDataUpload = new FormData();
    const fieldNameMap = {
      aadhar: 'aadharCard',
      pan: 'panCard',
      medicalRegistration: 'medicalRegistration',
      additionalQualification: 'additionalQualification',
      visitingCard: 'visitingCard',
      bankDetails: 'bankDetails',
      license: 'medicalRegistration',
      qualificationDoc: 'additionalQualification'
    };

    const backendFieldName = fieldNameMap[docType] || docType;
    formDataUpload.append(backendFieldName, file);

    try {
      const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const filePath = response.data.data[backendFieldName];

        // Update the specific doctor's document
        setDoctors(prev => {
          const newDoctors = [...prev];
          if (!newDoctors[index]) newDoctors[index] = {};
          if (!newDoctors[index].documents) newDoctors[index].documents = {};
          newDoctors[index].documents[docType] = filePath;
          return newDoctors;
        });

        // Also update the main formData if this is the first doctor
        if (index === 0) {
          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [docType]: filePath
            }
          }));
        }

        toast.success(`Doctor ${index + 1} ${docType} uploaded successfully`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${docType} for Doctor ${index + 1}`);
    }
  };

  // Helper function to handle file upload for shared documents
  const handleFileUpload = async (file, docType) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreviews(prev => ({
        ...prev,
        [docType]: {
          url: e.target.result,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }));
    };
    reader.readAsDataURL(file);

    const formDataUpload = new FormData();
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
      license: 'registrationCertificate', // Map to registrationCertificate field on backend
      qualificationDoc: 'hospitalGstDocument' // Map to hospitalGst field on backend
    };

    const backendFieldName = fieldNameMap[docType] || docType;
    formDataUpload.append(backendFieldName, file);

    try {
      const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const filePath = response.data.data[backendFieldName];

        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: filePath
          }
        }));

        toast.success(`${docType} uploaded successfully`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${docType}`);
    }
  };

  // State for preview modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  // Preview handlers
  const handlePreviewClick = (preview) => {
    setCurrentPreview(preview);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPreview(null);
  };

  // Save/Update handler
  const handleSave = async () => {
    try {
      setSaving(true);

      // --- REVISED: Handle unlinking if a spouse was removed from the UI ---
      if (unlinkedSpouseId) {
        const mainDoctorId = doctors[0]?._id;
        if (mainDoctorId) {
          // Prepare update data for the main doctor, including any edits made
          let mainDoctorUpdateData = { ...formData, ...doctors[0] };
          mainDoctorUpdateData.dateOfBirth = doctors[0].dateOfBirth ? new Date(doctors[0].dateOfBirth) : undefined;
          mainDoctorUpdateData.membershipDate = formData.membershipDate ? new Date(formData.membershipDate) : undefined;
          mainDoctorUpdateData.specialization = Array.isArray(doctors[0].specialization) ? doctors[0].specialization : [];

          toProperUpperCase(mainDoctorUpdateData); // Apply formatting

          mainDoctorUpdateData.documents = {
            ...formData.documents,
            ...doctors[0].documents,
            otherDocs: Array.isArray(formData.documents.otherDocs) ? formData.documents.otherDocs : []
          };

          // Promise to update the main doctor's info AND unlink them
          const updateMainDoctorPromise = apiClient.put(apiEndpoints.doctors.update(mainDoctorId), {
            ...mainDoctorUpdateData,
            linkedDoctorId: null,
            relationshipType: null,
          });

          // Promise to unlink the spouse
          const unlinkSpousePromise = apiClient.put(apiEndpoints.doctors.update(unlinkedSpouseId), {
            linkedDoctorId: null,
            relationshipType: null,
          });

          // Run both updates in parallel
          await Promise.all([updateMainDoctorPromise, unlinkSpousePromise]);

          toast.success("Doctor updated and spouse has been unlinked successfully.");
          setUnlinkedSpouseId(null); // Reset state

          // Refresh data and navigate away (logic copied from original end of function)
          const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
          if (response.data.success) {
            const doctorData = response.data.data;
            const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
            setDoctor(processedDoctorData);
            setDoctors(doctorData.isLinked ? [doctorData.mainDoctor, doctorData.linkedDoctor] : [doctorData]);
            setFormData(prev => ({
                ...prev,
                linkAsSpouses: processedDoctorData.isLinked && processedDoctorData.relationshipType === 'spouse'
            }));
          }
          navigate(`/view-doctor/${id}`);
          return; // IMPORTANT: Stop execution to prevent original logic from running
        }
      }

      // --- Original logic proceeds if no spouse was removed via 'x' button ---
      const mainDoctor = doctors[0];
      const spouseDoctor = doctors[1]; // Will be undefined if only one doctor

      // --- Prepare Main Doctor Data ---
      let mainDoctorUpdateData = { ...mainDoctor, ...formData };
      mainDoctorUpdateData.dateOfBirth = mainDoctor.dateOfBirth ? new Date(mainDoctor.dateOfBirth) : undefined;
      mainDoctorUpdateData.membershipDate = formData.membershipDate ? new Date(formData.membershipDate) : undefined;
      mainDoctorUpdateData.specialization = Array.isArray(mainDoctor.specialization) ? mainDoctor.specialization : [];
      mainDoctorUpdateData.typeOfEnquiry = formData.typeOfEnquiry; // Ensure enquiry status from main form is used
      mainDoctorUpdateData.doctorStatus = formData.doctorStatus; // Ensure doctor status from main form is used
      mainDoctorUpdateData.status = formData.status; // Ensure workflow status from main form is used
      mainDoctorUpdateData.doctorType = formData.doctorType; // Ensure doctor type from form is used

      // Ensure followUps are properly included in the update data
      mainDoctorUpdateData.followUps = formData.followUps || [];

      // Apply consistent formatting
      toProperUpperCase(mainDoctorUpdateData);

      // For hospital type, exclude aadharNumber and panNumber to prevent duplicate key errors
      if (mainDoctorUpdateData.doctorType === 'hospital') {
        delete mainDoctorUpdateData.aadharNumber;
        // Remove panNumber if it's empty to prevent duplicate key error
        if (!mainDoctorUpdateData.panNumber || mainDoctorUpdateData.panNumber.trim() === '') {
          delete mainDoctorUpdateData.panNumber;
        }
        // Also check for hospital-specific PAN number
        if (mainDoctorUpdateData.hospitalDetails && 
            (!mainDoctorUpdateData.hospitalDetails.hospitalPanNumber || 
             mainDoctorUpdateData.hospitalDetails.hospitalPanNumber.trim() === '')) {
          delete mainDoctorUpdateData.hospitalDetails.hospitalPanNumber;
        }
      }

      // Deep merge for documents - ensure formData.documents (new uploads) take precedence
      mainDoctorUpdateData.documents = {
        ...mainDoctor.documents, // Original docs for main doctor
        ...formData.documents, // Shared hospital docs (if any) - these should override originals
        // Ensure otherDocs is an array
        otherDocs: Array.isArray(formData.documents.otherDocs) ? formData.documents.otherDocs : []
      };

      // --- Scenario 1: Unlinking (if previously linked and now checkbox is unchecked) ---
      // This happens if mainDoctor was linked and now linkAsSpouses is false
      if (mainDoctor.linkedDoctorId && mainDoctor.relationshipType === 'spouse' && !formData.linkAsSpouses) {
        // Unlink main doctor
        await apiClient.put(apiEndpoints.doctors.update(mainDoctor._id), {
          linkedDoctorId: null,
          relationshipType: null
        });
        // Unlink spouse doctor if its ID is known
        if (mainDoctor.linkedDoctorId) {
          await apiClient.put(apiEndpoints.doctors.update(mainDoctor.linkedDoctorId), {
            linkedDoctorId: null,
            relationshipType: null
          });
        }
        toast.info("Spouse unlinked successfully!");
        // After unlinking, treat as single doctor update
        await apiClient.put(apiEndpoints.doctors.update(mainDoctor._id), mainDoctorUpdateData);
        toast.success("Doctor details updated successfully");
      }
      // --- Scenario 2: Single doctor update (no spouse involved or after unlinking) ---
      else if (doctors.length === 1 || !formData.linkAsSpouses) {
        await apiClient.put(apiEndpoints.doctors.update(mainDoctor._id), mainDoctorUpdateData);
        toast.success("Doctor details updated successfully");
      }
      // --- Scenario 3: Two doctors, and spouse linking is checked ---
      else if (doctors.length === 2 && formData.linkAsSpouses) {
        // --- Prepare Spouse Doctor Data ---
        // Start with only the spouse's own data from the form. DO NOT blindly merge formData.
        let spouseDoctorData = { ...spouseDoctor };

        // Selectively inherit only necessary, non-conflicting fields from the main doctor's form
        spouseDoctorData.dateOfBirth = spouseDoctor.dateOfBirth ? new Date(spouseDoctor.dateOfBirth) : undefined;
        spouseDoctorData.membershipDate = formData.membershipDate ? new Date(formData.membershipDate) : undefined;
        spouseDoctorData.specialization = Array.isArray(spouseDoctor.specialization) ? spouseDoctor.specialization : [];
        spouseDoctorData.typeOfEnquiry = formData.typeOfEnquiry;
        spouseDoctorData.doctorStatus = formData.doctorStatus;
        spouseDoctorData.status = formData.status;
        spouseDoctorData.doctorType = mainDoctor.doctorType; // Ensure doctor type is consistent

        // Apply consistent formatting
        toProperUpperCase(spouseDoctorData);

        // Merge documents: start with spouse's own, then add shared hospital documents from main form
        spouseDoctorData.documents = {
          ...spouseDoctor.documents, // Spouse's individual documents
          // Shared hospital documents from main form
          hospitalPanDocument: formData.documents.hospitalPanDocument,
          registrationCertificate: formData.documents.registrationCertificate,
          hospitalGstDocument: formData.documents.hospitalGstDocument,
          ownerPanCard: formData.documents.ownerPanCard,
          ownerAadhaarCard: formData.documents.ownerAadhaarCard,
          license: formData.documents.license, // Legacy mapping
          qualificationDoc: formData.documents.qualificationDoc, // Legacy mapping
          otherDocs: Array.isArray(spouseDoctor.documents?.otherDocs) ? spouseDoctor.documents.otherDocs : []
        };

        // --- If the spouse is new (no _id) ---
        if (!spouseDoctor._id) {
          // Add linking information to spouse doctor data to indicate this is a spouse being created for the main doctor
          spouseDoctorData.linkedDoctorId = mainDoctor._id;
          spouseDoctorData.relationshipType = 'spouse';

          // 3a. Create the new spouse doctor
          const createResponse = await apiClient.post(apiEndpoints.doctors.create, spouseDoctorData);
          const createdSpouse = createResponse.data.data;
          toast.success("New spouse doctor created successfully!");

          // 3b. Update main doctor (including its data and linking to new spouse)
          await apiClient.put(apiEndpoints.doctors.update(mainDoctor._id), {
            ...mainDoctorUpdateData, // Include other updates for main doctor
            linkedDoctorId: createdSpouse._id,
            relationshipType: 'spouse'
          });

          // 3c. Update new spouse doctor (linking to main doctor)
          await apiClient.put(apiEndpoints.doctors.update(createdSpouse._id), {
            linkedDoctorId: mainDoctor._id,
            relationshipType: 'spouse'
          });
          toast.success("Doctors linked as spouses!");
        }
        // --- If both main and spouse doctors already exist (updating and linking) ---
        else {
          // 3a. Update main doctor with its data and linking to spouse
          await apiClient.put(apiEndpoints.doctors.update(mainDoctor._id), {
            ...mainDoctorUpdateData,
            linkedDoctorId: spouseDoctor._id,
            relationshipType: 'spouse'
          });
          // 3b. Update spouse doctor with its data and linking to main
          await apiClient.put(apiEndpoints.doctors.update(spouseDoctor._id), {
            ...spouseDoctorData,
            linkedDoctorId: mainDoctor._id,
            relationshipType: 'spouse'
          });
          toast.success("Doctors updated and linked as spouses!");
        }
      }

      // Refresh doctor data
      const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
      if (response.data.success) {
        const doctorData = response.data.data;
        const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
        setDoctor(processedDoctorData);
        setDoctors(doctorData.isLinked ? [doctorData.mainDoctor, doctorData.linkedDoctor] : [doctorData]);
        setFormData(prev => ({ // Update formData to reflect new linked status/ids
            ...prev,
            linkAsSpouses: processedDoctorData.isLinked && processedDoctorData.relationshipType === 'spouse'
        }));
      }

      // Navigate back to view
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

  // Determine doctor types based on formData.doctorType (which can be changed in the form) rather than original doctor.doctorType
  const isHospital = formData.doctorType === "hospital";
  const isIndividual = formData.doctorType === "individual";
  const isHospitalIndividual = formData.doctorType === "hospital_individual";

  // Check if doctor has hospital data regardless of type
  const hasHospitalData = doctor.hospitalName ||
                         doctor.hospitalAddress?.address ||
                         doctor.hospitalDetails?.hospitalType ||
                         doctor.hospitalDetails?.beds ||
                         doctor.hospitalDetails?.establishmentYear ||
                         doctor.documents?.hospitalPanDocument ||
                         doctor.documents?.registrationCertificate ||
                         doctor.documents?.hospitalGstDocument ||
                         doctor.documents?.ownerPanCard ||
                         doctor.documents?.ownerAadhaarCard;

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
            <DateInput
              label="Membership Date"
              value={formData.membershipDate}
              onChange={(v) => handleInputChange('membershipDate', v)}
              returnFormat='yyyy-mm-dd'
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
              {doctor.doctorType === 'hospital' ? (
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.doctorType || doctor.doctorType || "N/A"}
                </div>
              ) : (
                <select
                  value={formData.doctorType}
                  onChange={(v) => handleInputChange('doctorType', v.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
                >
                  <option value="individual">Individual</option>
                  <option value="hospital_individual">Hospital + Individual</option>
                </select>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(v) => handleInputChange('status', v.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
                <select
                  value={formData.typeOfEnquiry}
                  onChange={(v) => handleInputChange('typeOfEnquiry', v.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
                >
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information (Repeated for each linked doctor) */}
        {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
          <div key={index} className="border-b pb-6 mb-6 bg-gray-50/50 p-4 rounded-lg relative">
            {index > 0 && (
              <button
                onClick={() => handleRemoveDoctor(index)}
                className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
              >
                ×
              </button>
            )}
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">
              {doctors.length > 1 ? `Doctor ${index + 1} Information` : 'Doctor Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
                <input
                  type="text"
                  value={doc.fullName || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'fullName', e.target.value.toUpperCase())}
                  className="w-full uppercase p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <DateInput
                label="Date of Birth"
                returnFormat='yyyy-mm-dd'
                value={doc.dateOfBirth ? (typeof doc.dateOfBirth === 'string' ? doc.dateOfBirth.split('T')[0] : new Date(doc.dateOfBirth).toISOString().split('T')[0]) : ''}
                onChange={(v) => handleDoctorInputChange(index, 'dateOfBirth', v)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={doc.qualification || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'qualification', e.target.value.toUpperCase())}
                  className="w-full uppercase p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <input
                  type="text"
                  value={Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const specialties = value.split(',').map(s => s.trim()).filter(s => s);
                    handleDoctorInputChange(index, 'specialization', specialties);
                  }}
                  className="w-full uppercase p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Number</label>
                <input
                  type="text"
                  value={doc.licenseNumber || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'licenseNumber', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg. Year</label>
                <input
                  type="text"
                  value={doc.registrationYear || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'registrationYear', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                <input
                  type="text"
                  value={doc.phoneNumber || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'phoneNumber', e.target.value)}
                  maxLength={10}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
                <input
                  type="text"
                  value={doc.whatsappNumber || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'whatsappNumber', e.target.value)}
                  maxLength={10}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={doc.email || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'email', e.target.value.toLowerCase())}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                <input
                  type="text"
                  value={doc.aadharNumber || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'aadharNumber', e.target.value)}
                  maxLength={12}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                <input
                  type="text"
                  value={doc.panNumber || ''}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase();
                    val = val.replace(/[^A-Z0-9]/g, ''); // Space aur special char remove
                    if (val.length > 10) val = val.slice(0, 10);
                    handleDoctorInputChange(index, 'panNumber', val);
                  }}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="w-full uppercase p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3] outline-none"
                />
                {doc.panNumber && doc.panNumber.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(doc.panNumber) && (
                  <p className="text-xs text-red-600 mt-1">Invalid PAN format</p>
                )}
                {doc.panNumber && doc.panNumber.length < 10 && doc.panNumber.length > 0 && (
                  <p className="text-xs text-orange-600 mt-1">PAN must be 10 characters</p>
                )}
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {doc.panNumber?.length || 0}/10
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={doc.contactDetails?.currentAddress?.address || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'contactDetails.currentAddress.address', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={doc.contactDetails?.currentAddress?.pinCode || ''}
                  onChange={(e) => handleDoctorInputChange(index, 'contactDetails.currentAddress.pinCode', e.target.value)}
                  maxLength={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <LocationInput
                label="City"
                value={doc.contactDetails?.currentAddress?.city || ''}
                onChange={(v) => handleDoctorInputChange(index, 'contactDetails.currentAddress.city', v)}
                type="city"
              />
              <LocationInput
                label="Taluka"
                value={doc.contactDetails?.currentAddress?.taluka || ''}
                onChange={(v) => handleDoctorInputChange(index, 'contactDetails.currentAddress.taluka', v)}
                type="taluka"
              />
              <LocationInput
                label="District"
                value={doc.contactDetails?.currentAddress?.district || ''}
                onChange={(v) => handleDoctorInputChange(index, 'contactDetails.currentAddress.district', v)}
                type="district"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationInput
                label="State"
                value={doc.contactDetails?.currentAddress?.state || ''}
                onChange={(v) => handleDoctorInputChange(index, 'contactDetails.currentAddress.state', v)}
                type="state"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={doc.contactDetails?.currentAddress?.country || 'India'}
                  onChange={(v) => handleDoctorInputChange(index, 'contactDetails.currentAddress.country', v)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>

            {/* Hospital Details for Individual - Always show (doctorType === 'individual') */}
            {isIndividual && (
              <>
                <h3 className="text-lg font-semibold text-[#15BBB3] mt-8 mb-4">Hospital Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name of Hospital/Clinic</label>
                    <input
                      type="text"
                      value={doc.hospitalName || ''}
                      onChange={(e) => handleDoctorInputChange(index, 'hospitalName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                      disabled={index > 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
                    <input
                      type="text"
                      value={doc.hospitalAddress?.address || ''}
                      onChange={(e) => handleDoctorInputChange(index, 'hospitalAddress.address', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                      disabled={index > 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                    <input
                      type="text"
                      value={doc.hospitalAddress?.pinCode || ''}
                      onChange={(e) => handleDoctorInputChange(index, 'hospitalAddress.pinCode', e.target.value)}
                      maxLength={6}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                      disabled={index > 0}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={doc.hospitalAddress?.country || 'India'}
                      onChange={(e) => handleDoctorInputChange(index, 'hospitalAddress.country', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                      disabled={index > 0}
                    />
                  </div>
                  <LocationInput
                    label="State"
                    value={doc.hospitalAddress?.state || ''}
                    onChange={(v) => handleDoctorInputChange(index, 'hospitalAddress.state', v)}
                    type="state"
                    disabled={index > 0}
                  />
                  <LocationInput
                    label="District"
                    value={doc.hospitalAddress?.district || ''}
                    onChange={(v) => handleDoctorInputChange(index, 'hospitalAddress.district', v)}
                    type="district"
                    disabled={index > 0}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LocationInput
                    label="Taluka"
                    value={doc.hospitalAddress?.taluka || ''}
                    onChange={(v) => handleDoctorInputChange(index, 'hospitalAddress.taluka', v)}
                    type="taluka"
                    disabled={index > 0}
                  />
                  <LocationInput
                    label="City"
                    value={doc.hospitalAddress?.city || ''}
                    onChange={(v) => handleDoctorInputChange(index, 'hospitalAddress.city', v)}
                    type="city"
                    disabled={index > 0}
                  />
                </div>
              </>
            )}

            {/* Button to add a new spouse doctor */}
            {index === 0 && (isIndividual || isHospitalIndividual) && doctors.length < 2 && (
              <button
                onClick={handleAddDoctor}
                className="mt-6 bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e] flex items-center gap-2"
              >
                <span>+</span> Add Spouse Doctor
              </button>
            )}
          </div>
        ))}

        {/* Hospital Information (ONLY for Hospital / Hospital + Individual types)
            Individual doctors ke liye hospital details upar Doctor Information section
            ke andar already aa rahe hain (same as Add page), isliye yahan nahi dikhayenge */}
        {(isHospital || isHospitalIndividual) && (
          <>
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(v) => handleInputChange('hospitalName', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
                  <select
                    value={formData.hospitalDetails.hospitalType}
                    onChange={(v) => handleInputChange('hospitalDetails.hospitalType', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="General Hospital">General Hospital</option>
                    <option value="Maternity Home">Maternity Home</option>
                    <option value="Multispeciality Hospital">Multispeciality Hospital</option>
                    <option value="Super-Speciality Hospital">Super-Speciality Hospital</option>
                    <option value="Surgical Hospital">Surgical Hospital</option>
                    <option value="Diagnostic Center">Diagnostic Center</option>
                    <option value="Dental Care">Dental Care</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {formData.hospitalDetails.hospitalType === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Please specify hospital type</label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.typeOther || ''}
                      onChange={(v) => handleInputChange('hospitalDetails.typeOther', v.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.beds}
                    onChange={(v) => handleInputChange('hospitalDetails.beds', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regi / License No</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.licenseNumber || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.licenseNumber', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.establishmentYear}
                    onChange={(v) => handleInputChange('hospitalDetails.establishmentYear', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital PAN</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.hospitalPanNumber || ''}
                    onChange={(v) => {
                      let val = v.target.value.toUpperCase();
                      val = val.replace(/[^A-Z0-9]/g, ''); // Space aur special char remove
                      if (val.length > 10) val = val.slice(0, 10);
                      handleInputChange('hospitalDetails.hospitalPanNumber', val);
                    }}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className="w-full uppercase p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.hospitalAddress.address}
                    onChange={(v) => handleInputChange('hospitalAddress.address', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    value={formData.hospitalAddress.pinCode}
                    onChange={(v) => handleInputChange('hospitalAddress.pinCode', v.target.value)}
                    maxLength={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <LocationInput
                  label="City"
                  value={formData.hospitalAddress.city}
                  onChange={(v) => handleInputChange('hospitalAddress.city', v)}
                  type="city"
                />
                <LocationInput
                  label="Taluka"
                  value={formData.hospitalAddress.taluka}
                  onChange={(v) => handleInputChange('hospitalAddress.taluka', v)}
                  type="taluka"
                />
                <LocationInput
                  label="District"
                  value={formData.hospitalAddress.district}
                  onChange={(v) => handleInputChange('hospitalAddress.district', v)}
                  type="district"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationInput
                  label="State"
                  value={formData.hospitalAddress.state}
                  onChange={(v) => handleInputChange('hospitalAddress.state', v)}
                  type="state"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.hospitalAddress.country || 'India'}
                    onChange={(v) => handleInputChange('hospitalAddress.country', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                  <input
                    type="text"
                    value={formData.contactDetails.phoneNumber || ''}
                    onChange={(v) => handleInputChange('contactDetails.phoneNumber', v.target.value)}
                    maxLength={10}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.contactDetails.whatsapp || ''}
                    onChange={(v) => handleInputChange('contactDetails.whatsapp', v.target.value)}
                    maxLength={10}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contactDetails.emailId || ''}
                    onChange={(v) => handleInputChange('contactDetails.emailId', v.target.value.toLowerCase())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.website || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.website', v.target.value.toLowerCase())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Ownership / Admin</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
                  <select
                    value={formData.hospitalDetails.ownershipType}
                    onChange={(v) => handleInputChange('hospitalDetails.ownershipType', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  >
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="Trust">Trust</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Superintendent / Director Name</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.director?.name || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.director.name', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director Contact No</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.director?.contact || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.director.contact', v.target.value)}
                    maxLength={10}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.hospitalDetails.director?.email || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.director.email', v.target.value.toLowerCase())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.admin?.name || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.admin.name', v.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.admin?.contact || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.admin.contact', v.target.value)}
                    maxLength={10}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.hospitalDetails.admin?.email || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.admin.email', v.target.value.toLowerCase())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Departments Available</h3>
              <div className="flex flex-wrap gap-4">
                {['Surgery', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Dental', 'Radiology', 'Pathology', 'ICU', 'NICU', 'Other'].map(dept => (
                  <label key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hospitalDetails.departments?.includes(dept) || false}
                      onChange={(e) => {
                        const currentDepts = formData.hospitalDetails.departments || [];
                        if (e.target.checked) {
                          handleInputChange('hospitalDetails.departments', [...currentDepts, dept]);
                        } else {
                          handleInputChange('hospitalDetails.departments', currentDepts.filter(d => d !== dept));
                        }
                      }}
                      className="mr-2 w-4 h-4 accent-[#15BBB3] rounded"
                    />
                    <span className="text-sm">{dept}</span>
                  </label>
                ))}
              </div>
              {formData.hospitalDetails.departments?.includes('Other') && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Departments (comma separated)</label>
                  <input
                    type="text"
                    value={formData.hospitalDetails.departmentsOther || ''}
                    onChange={(v) => handleInputChange('hospitalDetails.departmentsOther', v.target.value)}
                    placeholder="e.g., Cardiology, Neurology, Dermatology"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Contact Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phoneNumber || formData.contactDetails?.phoneNumber || ''}
                onChange={(v) => {
                  handleInputChange('phoneNumber', v.target.value);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.phoneNumber', v.target.value);
                  }
                }}
                maxLength={10}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsappNumber || formData.contactDetails?.whatsapp || ''}
                onChange={(v) => {
                  handleInputChange('whatsappNumber', v.target.value);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.whatsapp', v.target.value);
                  }
                }}
                maxLength={10}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || formData.contactDetails?.emailId || ''}
                onChange={(v) => {
                  handleInputChange('email', v.target.value);
                  if (formData.contactDetails) {
                    handleInputChange('contactDetails.emailId', v.target.value);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Residential Address (for Individual/Hospital+Individual) */}
        {(isIndividual || isHospitalIndividual) && formData.contactDetails?.currentAddress && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.address}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.address', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.pinCode}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.pinCode', v.target.value)}
                  maxLength={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.city}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.city', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.taluka}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.taluka', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.district}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.district', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.state}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.state', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.contactDetails.currentAddress.country}
                  onChange={(v) => handleInputChange('contactDetails.currentAddress.country', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Follow-up Information</h2>

          {/* Follow-up History */}
          {formData.followUps && formData.followUps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Follow-up History</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.followUps.map((followUp, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {new Date(followUp.date).toLocaleDateString()} | Type: {followUp.type || "N/A"}
                        </p>
                        {followUp.nextFollowUpDate && (
                          <p className="text-xs text-gray-500">
                            Next Follow-up: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Follow-up */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Follow-up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput
                label="Follow-up Date"
                value={formData.newFollowUpDate}
                onChange={(v) => handleInputChange('newFollowUpDate', v)}
                returnFormat='yyyy-mm-dd'
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Message</label>
                <input
                  type="text"
                  placeholder="Enter follow-up message"
                  value={formData.newFollowUpMessage}
                  onChange={(v) => handleInputChange('newFollowUpMessage', v.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddNewFollowUp}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Follow-up
            </button>
          </div>
        </div>

        {/* Spouse Linking Checkbox */}
        {(isIndividual || isHospitalIndividual) && doctors.length === 2 && (
          <div className="border-b pb-6 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="linkAsSpouses"
                checked={formData.linkAsSpouses}
                onChange={(e) => handleInputChange('linkAsSpouses', e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="linkAsSpouses" className="ml-3 block text-sm text-gray-700 flex-1">
                <span className="font-medium">Link these doctors as spouses</span> - Combine names on bills (e.g., "Raju & Sunita")
              </label>
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none resize-none"
            placeholder="Enter remarks..."
          />
        </div>

        {/* Documents Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Documents</h2>

          {/* Individual Documents (Repeated for each linked doctor) */}
          {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
            <div key={index} className="mb-8 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600 mb-4 border-b border-blue-100 pb-2">
                {doctors.length > 1 ? `Doctor ${index + 1} Individual Documents` : 'Individual Documents'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Aadhar"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'aadhar')}
                  fileName={getDoctorDocumentName(index, 'aadhar')}
                  preview={getFilePreview(index, 'aadhar')}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="PAN Card"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'pan')}
                  fileName={getDoctorDocumentName(index, 'pan')}
                  preview={getFilePreview(index, 'pan')}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Medical Registration"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'medicalRegistration')}
                  fileName={getDoctorDocumentName(index, 'medicalRegistration')}
                  preview={getFilePreview(index, 'medicalRegistration')}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Additional Qualification"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'additionalQualification')}
                  fileName={getDoctorDocumentName(index, 'additionalQualification')}
                  preview={getFilePreview(index, 'additionalQualification')}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Visiting Card"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'visitingCard')}
                  fileName={getDoctorDocumentName(index, 'visitingCard')}
                  preview={getFilePreview(index, 'visitingCard')}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Bank Details"
                  onFileSelect={(file) => handleDoctorFileUpload(index, file, 'bankDetails')}
                  fileName={getDoctorDocumentName(index, 'bankDetails')}
                  preview={getFilePreview(index, 'bankDetails')}
                  onPreviewClick={handlePreviewClick}
                />
              </div>
            </div>
          ))}

          {(isHospital || isHospitalIndividual) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Hospital PAN Document"
                  onFileSelect={(file) => handleFileUpload(file, 'hospitalPanDocument')}
                  fileName={formData.documents.hospitalPanDocument}
                  preview={filePreviews.hospitalPanDocument}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Registration Certificate"
                  onFileSelect={(file) => handleFileUpload(file, 'registrationCertificate')}
                  fileName={formData.documents.registrationCertificate}
                  preview={filePreviews.registrationCertificate}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Hospital GST Document"
                  onFileSelect={(file) => handleFileUpload(file, 'hospitalGstDocument')}
                  fileName={formData.documents.hospitalGstDocument}
                  preview={filePreviews.hospitalGstDocument}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Owner PAN Card"
                  onFileSelect={(file) => handleFileUpload(file, 'ownerPanCard')}
                  fileName={formData.documents.ownerPanCard}
                  preview={filePreviews.ownerPanCard}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Owner Aadhaar Card"
                  onFileSelect={(file) => handleFileUpload(file, 'ownerAadhaarCard')}
                  fileName={formData.documents.ownerAadhaarCard}
                  preview={filePreviews.ownerAadhaarCard}
                  onPreviewClick={handlePreviewClick}
                />
                {/* Legacy documents */}
                <FileUpload
                  label="License/Registration"
                  onFileSelect={(file) => handleFileUpload(file, 'license')}
                  fileName={formData.documents.license}
                  preview={filePreviews.license}
                  onPreviewClick={handlePreviewClick}
                />
                <FileUpload
                  label="Qualification Document"
                  onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
                  fileName={formData.documents.qualificationDoc}
                  preview={filePreviews.qualificationDoc}
                  onPreviewClick={handlePreviewClick}
                />
              </div>
            </div>
          )}

          {/* Other documents */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
            <div className="space-y-2">
              {formData.documents?.otherDocs && formData.documents.otherDocs.length > 0 && (
                <>
                  {formData.documents.otherDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => window.open(`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doc.split('/').pop()}`, '_blank')}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              documents: {
                                ...prev.documents,
                                otherDocs: prev.documents.otherDocs.filter((_, i) => i !== idx)
                              }
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
                <FileUpload
                  label="Upload New Document"
                  onFileSelect={(file) => handleFileUpload(file, 'otherDocs')}
                  fileName={null}
                  preview={filePreviews.otherDocs}
                  onPreviewClick={handlePreviewClick}
                />
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

export default EditDoctor;