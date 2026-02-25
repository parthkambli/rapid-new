import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// ================= MAIN COMPONENT =================
const ViewDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array to hold multiple doctors (Main + Spouse/Linked)
  const [doctors, setDoctors] = useState([]);

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
          setDoctors(docs);
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
                {doctor.membershipDate ? formatDate(doctor.membershipDate) : (doctor.createdAt ? formatDate(doctor.createdAt) : "N/A")}
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
              <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.typeOfEnquiry || "N/A"}
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
                <label className="block text-sm font-medium text-gray-700">Reg No</label>
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
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.aadhar.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      Aadhar: {doctor.documents.aadhar.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.documents?.pan && (
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.pan.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      PAN: {doctor.documents.pan.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.documents?.medicalRegistration && (
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.medicalRegistration.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left"
                    >
                      Medical Registration: {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 &&
                    doctor.documents.otherDocs.map((doc, idx) => (
                      <a
                        key={idx}
                        href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doc.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
                      </a>
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
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.aadhar.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
                    >
                      Aadhar: {doctor.linkedDoctor.documents.aadhar.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.linkedDoctor.documents?.pan && (
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.pan.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
                    >
                      PAN: {doctor.linkedDoctor.documents.pan.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.linkedDoctor.documents?.medicalRegistration && (
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.medicalRegistration.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left"
                    >
                      Medical Registration: {doctor.linkedDoctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                    </a>
                  )}
                  {doctor.linkedDoctor.documents?.otherDocs && doctor.linkedDoctor.documents.otherDocs.length > 0 &&
                    doctor.linkedDoctor.documents.otherDocs.map((doc, idx) => (
                      <a
                        key={idx}
                        href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doc.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
                      </a>
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
              <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.typeOfEnquiry || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Status</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.doctorStatus || "N/A"}
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
                        <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
                        <p className="font-medium text-sm">FullName: <strong>{followUp.createdBy?.fullName || "N/A"}</strong> </p>
                        <p className="font-medium text-sm">Role: <strong> {followUp.createdBy?.role || "N/A"}</strong></p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {formatDate(followUp.date)} | Type: {followUp.type || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created at: {formatDate(followUp.createdAt)}
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
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.aadhar.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.aadhar.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.pan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.pan.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.pan.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.medicalRegistration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Registration
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.medicalRegistration.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.additionalQualification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Qualification
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.additionalQualification.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.additionalQualification.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.visitingCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visiting Card
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.visitingCard.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.visitingCard.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.bankDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Details
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.bankDetails.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.bankDetails.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {/* Legacy individual document */}
                {doctor.documents?.license && !doctor.documents.medicalRegistration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License/Registration
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.license.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.license.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.qualificationDoc && !doctor.documents.pan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification Document
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.qualificationDoc.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
                      </span>
                    </a>
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
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.hospitalPanDocument.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.hospitalPanDocument.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.registrationCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Certificate
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.registrationCertificate.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.registrationCertificate.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.hospitalGstDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital GST Document
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.hospitalGstDocument.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.hospitalGstDocument.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.ownerPanCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner PAN Card
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.ownerPanCard.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.ownerPanCard.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.ownerAadhaarCard && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Aadhaar Card
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.ownerAadhaarCard.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.ownerAadhaarCard.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {/* Legacy hospital document */}
                {doctor.documents?.license && !doctor.documents.medicalRegistration && !doctor.documents.registrationCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License/Registration
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.license.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.license.split("/").pop() || "View Document"}
                      </span>
                    </a>
                  </div>
                )}
                {doctor.documents?.qualificationDoc && !doctor.documents.pan && !doctor.documents.hospitalGstDocument && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification Document
                    </label>
                    <a
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doctor.documents.qualificationDoc.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
                    >
                      <span className="truncate block">
                        {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
                      </span>
                    </a>
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
                    <a
                      key={idx}
                      href={`${process.env.REACT_APP_API_URI || 'http://localhost:3000'}/uploads/${doc.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left block"
                    >
                      <span className="truncate block text-sm">
                        {doc.split("/").pop() || `Document ${idx + 1}`}
                      </span>
                    </a>
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

export default ViewDoctor;