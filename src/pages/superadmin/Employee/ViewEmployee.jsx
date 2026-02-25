import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

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

const getDocumentUrl = (filePath) => {
  if (!filePath) return null;
  try {
    const baseUrl = getApiBaseUrl();

    // Convert server path to URL
    // Server stores: C:\Users\User\OneDrive\Desktop\rapid-main\rapid-apis\uploads\aadhar-cards\file.png
    // Should map to: http://localhost:3000/uploads/aadhar-cards/file.png
    if (filePath.includes("uploads\\")) {
      // Extract the path after 'uploads\'
      const uploadsIndex = filePath.indexOf("uploads\\");
      if (uploadsIndex !== -1) {
        const relativePath = filePath.substring(uploadsIndex).replace(/\\/g, '/');
        return `${baseUrl}/${relativePath}`;
      }
    }
    // If already a relative path starting with /uploads
    if (filePath.startsWith("/uploads")) {
      return `${baseUrl}${filePath}`;
    }
    return filePath;
  } catch (error) {
    console.error("Error generating document URL:", error);
    return null;
  }
};

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await apiClient.get(apiEndpoints.employees.get(id));
        setEmployee(res.data.data);
      } catch (error) {
        alert("Failed to load employee");
        navigate("/admin/employee-list");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!employee) return <div className="text-center p-8">Employee not found</div>;

  const { personalInfo, contactDetails, familyDetails, jobDetails, salaryDetails, bankDetails, educationExperience, documents } = employee;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">View Employee</h2>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-black">Personal Information :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-black">Full Name :</label>
              <input disabled value={employee.fullName || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-black">Gender :</label>
              <div className="flex gap-4 ml-0 sm:ml-2">
                <label className="flex items-center text-sm text-black">
                  <input type="radio" checked={personalInfo?.gender === "male"} disabled className="mr-2" /> Male
                </label>
                <label className="flex items-center text-sm text-black">
                  <input type="radio" checked={personalInfo?.gender === "female"} disabled className="mr-2" /> Female
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-[#000000]">Aadhar Card Number:</label>
              <input disabled value={personalInfo?.aadharCardNumber || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-[#000000]">PAN:</label>
              <input disabled value={personalInfo?.pan || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Employment Contact Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-4 sm:mb-0 text-[#000000]">Phone Number :</label>
              <input disabled value={employee.phoneNumber || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">WhatsApp :</label>
              <input disabled value={contactDetails?.whatsapp || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Email ID :</label>
              <input disabled value={employee.email || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Current Address:</label>
              <input disabled value={contactDetails?.currentAddress?.address || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
              <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
              <input disabled value={contactDetails?.currentAddress?.pinCode || ""} className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
              <input disabled value={contactDetails?.currentAddress?.city || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
              <input disabled value={contactDetails?.currentAddress?.district || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
              <input disabled value={contactDetails?.currentAddress?.state || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
              <input disabled value={contactDetails?.currentAddress?.country || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Permanent Address:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Address:</label>
            <input disabled value={contactDetails?.permanentAddress?.address || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">Pin Code:</label>
            <input disabled value={contactDetails?.permanentAddress?.pinCode || ""} className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md bg-gray-100" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City:</label>
            <input disabled value={contactDetails?.permanentAddress?.city || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
            <input disabled value={contactDetails?.permanentAddress?.district || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
            <input disabled value={contactDetails?.permanentAddress?.state || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
            <input disabled value={contactDetails?.permanentAddress?.country || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Family Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Family Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Full Name :</label>
              <input disabled value={familyDetails?.fullName || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Relation With Employee:</label>
              <input disabled value={familyDetails?.relationWithEmployee || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-8 sm:mb-0 text-[#000000]">Phone No :</label>
              <input disabled value={familyDetails?.phoneNumber || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Email:</label>
              <input disabled value={familyDetails?.email || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Address:</label>
              <input disabled value={familyDetails?.address?.address || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">Pin Code:</label>
              <input disabled value={familyDetails?.address?.pinCode || ""} className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City:</label>
              <input disabled value={familyDetails?.address?.city || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
              <input disabled value={familyDetails?.address?.district || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
              <input disabled value={familyDetails?.address?.state || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
              <input disabled value={familyDetails?.address?.country || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Job Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Date Of Joining :</label>
              <input disabled value={formatDate(jobDetails?.dateOfJoining)} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">Role:</label>
              <input disabled value={employee.role || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Designation:</label>
              <input disabled value={jobDetails?.designation || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Employee Type:</label>
              <input disabled value={jobDetails?.employeeType || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Reporting Manager :</label>
              <input disabled value={jobDetails?.reportingManager || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Work Location:</label>
              <input disabled value={jobDetails?.workLocation || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Salary Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Basic Salary :</label>
              <input disabled value={salaryDetails?.basicSalary || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Travelling Allowance :</label>
              <input disabled value={salaryDetails?.travellingAllowance || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Daily Allowance :</label>
              <input disabled value={salaryDetails?.dailyAllowance || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Mobile Expenses :</label>
              <input disabled value={salaryDetails?.mobileExpenses || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Total Salary :</label>
              <input disabled value={salaryDetails?.totalSalary || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Incentive Details :</label>
              <input disabled value={salaryDetails?.incentiveDetails || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Bank Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="sm:w-เดือน text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Name As Per Bank Record :</label>
              <input disabled value={bankDetails?.nameAsPerBankRecord || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Bank Name :</label>
              <input disabled value={bankDetails?.bankName || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Branch :</label>
              <input disabled value={bankDetails?.branch || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-28 text-sm mb-1 sm:mb-0 text-[#000000]">Account Number :</label>
              <input disabled value={bankDetails?.accountNumber || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">IFSC :</label>
              <input disabled value={bankDetails?.ifsc || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Education & Experience */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Education & Experience :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Qualification :</label>
              <input disabled value={educationExperience?.qualification || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Experience :</label>
              <input disabled value={educationExperience?.experience || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Skills :</label>
              <input disabled value={educationExperience?.skills?.join(", ") || ""} className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Documents :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-4">
            {[
              { key: "aadharCard", label: "Aadhar Card :" },
              { key: "panCard", label: "PAN Card :" },
              { key: "drivingLicense", label: "Driving License :" },
              { key: "addressProof", label: "Address Proof :" },
              { key: "fitnessCertificate", label: "Fitness Certificate :" },
              { key: "educationDocument", label: "Education Document :" },
              { key: "experienceLetter", label: "Experience Letter :" },
            ].map((doc) => (
              <div key={doc.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="w-full sm:w-36 text-sm mb-1 sm:mb-0 text-[#000000]">{doc.label}</label>
                {documents?.[doc.key] ? (
                  <a href={getDocumentUrl(documents[doc.key])} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Preview
                  </a>
                ) : (
                  <span className="text-gray-500">No File</span>
                )}
              </div>
            ))}

            {/* PA Policy */}
            {documents?.paPolicy?.file && (
              <div className="border-t pt-4">
                <label className="w-full sm:w-36 text-sm font-medium text-[#000000]">PA Policy :</label>
                <div className="mt-2 space-y-2">
                  <a href={getDocumentUrl(documents.paPolicy.file)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                    Preview
                  </a>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div><strong>Policy Number:</strong> {documents.paPolicy.policyNumber}</div>
                    <div><strong>Start Date:</strong> {formatDate(documents.paPolicy.startDate)}</div>
                    <div><strong>End Date:</strong> {formatDate(documents.paPolicy.endDate)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Policy */}
            {documents?.healthPolicy?.file && (
              <div className="border-t pt-4">
                <label className="w-full sm:w-36 text-sm font-medium text-[#000000]">Health Policy :</label>
                <div className="mt-2 space-y-2">
                  <a href={getDocumentUrl(documents.healthPolicy.file)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                    Preview
                  </a>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div><strong>Policy Number:</strong> {documents.healthPolicy.policyNumber}</div>
                    <div><strong>Start Date:</strong> {formatDate(documents.healthPolicy.startDate)}</div>
                    <div><strong>End Date:</strong> {formatDate(documents.healthPolicy.endDate)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewEmployee;