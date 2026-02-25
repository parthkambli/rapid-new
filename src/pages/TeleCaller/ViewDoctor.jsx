
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../services/apiClient";
import { toast } from "react-toastify";
import DateInput from "../../components/DateInput/DateInput";
import LocationInput from "../../components/LocationInput";

// ================= MAIN COMPONENT =================
const ViewDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Array to hold multiple doctors (Main + Spouse/Linked)
  const [doctors, setDoctors] = useState([]);
  
  // Form state for viewing
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
      licenseNumber: '',
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
          const processedDoctorData = doctorData.isLinked ? 
            { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : 
            doctorData;
          
          setDoctor(processedDoctorData);
          
          // Fetch and set all linked doctors
          const docs = doctorData.isLinked
            ? [doctorData.mainDoctor, doctorData.linkedDoctor]
            : [doctorData];
          
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
            doctorType: processedDoctorData.doctorType || 'individual',
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

  // Helper function to get document name for a specific doctor
  const getDoctorDocumentName = (index, docType) => {
    if (index === 0) {
      return formData.documents[docType] || doctors[index]?.documents?.[docType] || '';
    } else {
      return doctors[index]?.documents?.[docType] || '';
    }
  };

  // Helper function to get file preview URL
  // const getDocumentUrl = (fileName) => {
  //   if (!fileName) return null;
  //   if (fileName.startsWith('http')) return fileName;
  //   return `${'http://localhost:3000'}/uploads/${fileName.split('/').pop()}`;
  // };


  const getDocumentUrl = (fileName) => {
  if (!fileName) return '#';

  // uploads ke baad ka path nikaalo
  const index = fileName.toLowerCase().indexOf('uploads');
  if (index === -1) return '#';

  const relativePath = fileName
    .substring(index)
    .replace(/\\/g, '/'); // Windows → URL

  return `http://localhost:3000/${relativePath}`;
};

  // Function to download document
  const downloadDocument = (fileName, docType) => {
    const url = getDocumentUrl(fileName);
    if (url) {
      window.open(url, '_blank');
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

  // Determine doctor types based on formData.doctorType
  const isHospital = formData.doctorType === "hospital";
  const isIndividual = formData.doctorType === "individual";
  const isHospitalIndividual = formData.doctorType === "hospital_individual";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/telecaller/doctor-list')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/telecaller/edit-doctor/${id}`)}
              className="bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e]"
            >
              Edit Doctor
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
            <div>
              {/* <label className="block text-sm font-medium text-gray-700">Membership Date</label> */}
              {/* <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {formData.membershipDate ? new Date(formData.membershipDate).toLocaleDateString() : "N/A"}
              </div> */}

               <DateInput
                            label="Membership Date"
                            value={formData.membershipDate}
                            onChange={(v) => handleInputChange('membershipDate', v)}
                            returnFormat='yyyy-mm-dd'
                          disabled
                          />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {formData.doctorType ? formData.doctorType.replace('_', ' ').toUpperCase() : "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.status || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.typeOfEnquiry || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information (Repeated for each linked doctor) */}
        {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
          <div key={index} className="border-b pb-6 mb-6 bg-gray-50/50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">
              {doctors.length > 1 ? `Doctor ${index + 1} Information` : 'Doctor Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.fullName || 'N/A'}
                </div>
              </div>
              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.dateOfBirth ? new Date(doc.dateOfBirth).toLocaleDateString() : 'N/A'}
                </div> */}
                 <DateInput
                                label="Date of Birth"
                                returnFormat='yyyy-mm-dd'
                                value={doc.dateOfBirth ? (typeof doc.dateOfBirth === 'string' ? doc.dateOfBirth.split('T')[0] : new Date(doc.dateOfBirth).toISOString().split('T')[0]) : ''}
                           disabled
                                onChange={(v) => handleDoctorInputChange(index, 'dateOfBirth', v)}
                              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.qualification || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Number</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.licenseNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg. Year</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.registrationYear || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.phoneNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.whatsappNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.email || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.aadharNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.panNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.address || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.district || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.country || 'N/A'}
                </div>
              </div>
            </div>

            {/* Hospital Details for Individual - Always show (doctorType === 'individual') */}
            {isIndividual && (
              <>
                <h3 className="text-lg font-semibold text-[#15BBB3] mt-8 mb-4">Hospital Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name of Hospital/Clinic</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.address || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.pinCode || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.country || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.state || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.district || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.taluka || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.city || 'N/A'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Hospital Information (ONLY for Hospital / Hospital + Individual types) */}
        {(isHospital || isHospitalIndividual) && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalName || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.hospitalType || 'N/A'}
                </div>
              </div>
              {formData.hospitalDetails.hospitalType === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Type (Other)</label>
                  <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    {formData.hospitalDetails.typeOther || 'N/A'}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.beds || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regi / License No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.licenseNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.establishmentYear || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital PAN</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.hospitalPanNumber || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.address || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.district || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.country || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.phoneNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.whatsapp || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.emailId || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.website || 'N/A'}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Ownership / Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.ownershipType || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Superintendent / Director Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Director Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.contact || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.email || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.contact || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.email || 'N/A'}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Departments Available</h3>
            <div className="flex flex-wrap gap-4">
              {formData.hospitalDetails.departments && formData.hospitalDetails.departments.length > 0 ? (
                formData.hospitalDetails.departments.map(dept => (
                  <span key={dept} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {dept}
                  </span>
                ))
              ) : (
                <div className="text-gray-500">No departments specified</div>
              )}
            </div>
            {formData.hospitalDetails.departments?.includes('Other') && formData.hospitalDetails.departmentsOther && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Departments</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.departmentsOther}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.phoneNumber || formData.contactDetails?.phoneNumber || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.whatsappNumber || formData.contactDetails?.whatsapp || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.email || formData.contactDetails?.emailId || 'N/A'}
              </div>
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
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.address || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.district || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.country || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Follow-up Information</h2>
          {/* Follow-up History */}
          {formData.followUps && formData.followUps.length > 0 ? (
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
          ) : (
            <div className="text-gray-500 mb-6">No follow-up history</div>
          )}
        </div>

        {/* Spouse Linking Status */}
        {(isIndividual || isHospitalIndividual) && doctors.length === 2 && (
          <div className="border-b pb-6 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className={`h-4 w-4 rounded mt-1 ${formData.linkAsSpouses ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
              <label className="ml-3 block text-sm text-gray-700 flex-1">
                <span className="font-medium">
                  {formData.linkAsSpouses ? 'Linked as spouses' : 'Not linked as spouses'}
                </span>
                {formData.linkAsSpouses && ' - Names will appear together on bills (e.g., "Raju & Sunita")'}
              </label>
            </div>
          </div>
        )}

        {/* Remarks */}
        {formData.remarks && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
            <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {formData.remarks}
            </div>
          </div>
        )}

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
                {['aadhar', 'pan', 'medicalRegistration', 'additionalQualification', 'visitingCard', 'bankDetails'].map(docType => {
                  const fileName = getDoctorDocumentName(index, docType);
                  return (
                    <DocumentView
                      key={docType}
                      label={docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      fileName={fileName}
                      onViewClick={() => fileName && downloadDocument(fileName, docType)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          
          {(isHospital || isHospitalIndividual) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'hospitalPanDocument', label: 'Hospital PAN Document' },
                  { key: 'registrationCertificate', label: 'Registration Certificate' },
                  { key: 'hospitalGstDocument', label: 'Hospital GST Document' },
                  { key: 'ownerPanCard', label: 'Owner PAN Card' },
                  { key: 'ownerAadhaarCard', label: 'Owner Aadhaar Card' },
                  { key: 'license', label: 'License/Registration' },
                  { key: 'qualificationDoc', label: 'Qualification Document' }
                ].map(doc => (
                  <DocumentView
                    key={doc.key}
                    label={doc.label}
                    fileName={formData.documents[doc.key]}
                    onViewClick={() => formData.documents[doc.key] && downloadDocument(formData.documents[doc.key], doc.key)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Other documents */}
          {formData.documents?.otherDocs && formData.documents.otherDocs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
              <div className="space-y-2">
                {formData.documents.otherDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => downloadDocument(doc, 'other')}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={() => navigate(`/doctors`)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/edit-doctor/${id}`)}
            className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e]"
          >
            Edit Doctor
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        preview={currentPreview} 
      />
    </div>
  );
};

// ================= DOCUMENT VIEW COMPONENT =================
const DocumentView = ({ label, fileName, onViewClick }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={`border rounded-lg px-4 py-2 text-sm flex justify-between items-center ${
        fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
      }`}>
        <span className={fileName ? 'text-green-700 font-medium' : 'text-gray-600'}>
          {fileName ? 'Uploaded' : 'Not Uploaded'}
        </span>
        {fileName && (
          <button
            onClick={onViewClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Document
          </button>
        )}
      </div>
      {fileName && (
        <div className="text-xs text-gray-500 truncate">
          File: {fileName.split('/').pop()}
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

export default ViewDoctor;



