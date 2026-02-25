
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import LocationInput from "../../../components/LocationInput";

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

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    personal: { fullName: "", gender: "", aadhar: "", pan: "" },
    contact: {
      phone: "", whatsapp: "", email: "",
      currentAddress: "", currentPin: "", currentCity: "", currentDistrict: "", currentState: "", currentCountry: "India",
      permanentAddress: "", permanentPin: "", permanentCity: "", permanentDistrict: "", permanentState: "", permanentCountry: "India",
      sameAsAbove: false
    },
    family: {
      fullName: "", relation: "", phone: "", email: "",
      address: "", pin: "", city: "", district: "", state: "", country: "India",
      sameAsAbove: false
    },
    job: { doj: "", role: "", designation: "", empType: "", manager: "", workLocation: "", department: "" },
    bank: { name: "", bankName: "", branch: "", account: "", ifsc: "" },
    salary: { basicSalary: "", travellingAllowance: "", dailyAllowance: "", mobileExpenses: "", totalSalary: "", incentiveDetails: "" },
    education: { qualification: "", experience: "", skills: "" },
    documents: {
      aadhar: null, pan: null, drivingLicense: null, addressProof: null, fitness: null,
      paPolicy: { file: null, policyNumber: "", startDate: "", endDate: "" },
      healthPolicy: { file: null, policyNumber: "", startDate: "", endDate: "" },
      eduDoc: null, expLetter: null
    },
  });

  const fileRefs = {
    aadhar: useRef(null),
    pan: useRef(null),
    drivingLicense: useRef(null),
    addressProof: useRef(null),
    fitness: useRef(null),
    paPolicy: useRef(null),
    healthPolicy: useRef(null),
    eduDoc: useRef(null),
    expLetter: useRef(null),
  };

  // FETCH EMPLOYEE
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await apiClient.get(apiEndpoints.employees.get(id));
        const emp = res.data.data;

        // Format date for input field (YYYY-MM-DD)
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return ""; // Invalid date
          return date.toISOString().split("T")[0];
        };

        setFormData({
          personal: {
            fullName: emp.fullName || "",
            gender: emp.personalInfo?.gender?.toUpperCase() || "",
            aadhar: emp.personalInfo?.aadharCardNumber || "",
            pan: emp.personalInfo?.pan || "",
          },
          contact: {
            phone: emp.phoneNumber || "",
            whatsapp: emp.contactDetails?.whatsapp || "",
            email: emp.email || "",
            currentAddress: emp.contactDetails?.currentAddress?.address || "",
            currentPin: emp.contactDetails?.currentAddress?.pinCode || "",
            currentCity: emp.contactDetails?.currentAddress?.city || "",
            currentDistrict: emp.contactDetails?.currentAddress?.district || "",
            currentState: emp.contactDetails?.currentAddress?.state || "",
            currentCountry: emp.contactDetails?.currentAddress?.country || "India",
            permanentAddress: emp.contactDetails?.permanentAddress?.address || "",
            permanentPin: emp.contactDetails?.permanentAddress?.pinCode || "",
            permanentCity: emp.contactDetails?.permanentAddress?.city || "",
            permanentDistrict: emp.contactDetails?.permanentAddress?.district || "",
            permanentState: emp.contactDetails?.permanentAddress?.state || "",
            permanentCountry: emp.contactDetails?.permanentAddress?.country || "India",
            sameAsAbove: emp.contactDetails?.permanentAddress?.sameAsCurrent || false,
          },
          family: {
            fullName: emp.familyDetails?.fullName || "",
            relation: emp.familyDetails?.relationWithEmployee || "",
            phone: emp.familyDetails?.phoneNumber || "",
            email: emp.familyDetails?.email || "",
            address: emp.familyDetails?.address?.address || "",
            pin: emp.familyDetails?.address?.pinCode || "",
            city: emp.familyDetails?.address?.city || "",
            district: emp.familyDetails?.address?.district || "",
            state: emp.familyDetails?.address?.state || "",
            country: emp.familyDetails?.address?.country || "India",
            sameAsAbove: emp.familyDetails?.address?.sameAsCurrent || false,
          },
          job: {
            doj: formatDate(emp.joiningDate),
            role: emp.role || "",
            designation: emp.jobDetails?.designation || "",
            empType: emp.jobDetails?.employeeType || "",
            manager: emp.jobDetails?.reportingManager || "",
            workLocation: emp.jobDetails?.workLocation || "",
            department: emp.jobDetails?.department || "",
          },
          bank: {
            name: emp.bankDetails?.nameAsPerBankRecord || "",
            bankName: emp.bankDetails?.bankName || "",
            branch: emp.bankDetails?.branch || "",
            account: emp.bankDetails?.accountNumber || "",
            ifsc: emp.bankDetails?.ifsc || "",
          },
          salary: {
            basicSalary: emp.salaryDetails?.basicSalary || "",
            travellingAllowance: emp.salaryDetails?.travellingAllowance || "",
            dailyAllowance: emp.salaryDetails?.dailyAllowance || "",
            mobileExpenses: emp.salaryDetails?.mobileExpenses || "",
            totalSalary: emp.salaryDetails?.totalSalary || "",
            incentiveDetails: emp.salaryDetails?.incentiveDetails || "",
          },
          education: {
            qualification: emp.educationExperience?.qualification || "",
            experience: emp.educationExperience?.experience || "",
            skills: Array.isArray(emp.educationExperience?.skills) ? emp.educationExperience.skills.join(", ") : emp.educationExperience?.skills || "",
          },
          documents: {
            aadhar: emp.documents?.aadharCard || null,
            pan: emp.documents?.panCard || null,
            drivingLicense: emp.documents?.drivingLicense || null,
            addressProof: emp.documents?.addressProof || null,
            fitness: emp.documents?.fitnessCertificate || null,
            paPolicy: {
              file: emp.documents?.paPolicy?.file || null,
              policyNumber: emp.documents?.paPolicy?.policyNumber || "",
              startDate: formatDate(emp.documents?.paPolicy?.startDate),
              endDate: formatDate(emp.documents?.paPolicy?.endDate),
            },
            healthPolicy: {
              file: emp.documents?.healthPolicy?.file || null,
              policyNumber: emp.documents?.healthPolicy?.policyNumber || "",
              startDate: formatDate(emp.documents?.healthPolicy?.startDate),
              endDate: formatDate(emp.documents?.healthPolicy?.endDate),
            },
            eduDoc: emp.documents?.educationDocument || null,
            expLetter: emp.documents?.experienceLetter || null,
          },
        });
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to load employee: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const [section, field, subField] = name.split(".");

    if (type === "file") {
      if (section === "documents" && (field === "paPolicy" || field === "healthPolicy")) {
        setFormData(prev => ({
          ...prev,
          documents: { 
            ...prev.documents, 
            [field]: { 
              ...prev.documents[field], 
              file: files[0],
              // Reset policy details when new file is uploaded
              ...(files[0] ? {} : {
                policyNumber: prev.documents[field].policyNumber,
                startDate: prev.documents[field].startDate,
                endDate: prev.documents[field].endDate
              })
            }
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, documents: { ...prev.documents, [field]: files[0] } }));
      }
      return;
    }

    let finalValue = type === "checkbox" ? checked : value;

    // Handle the "Same as Above" checkbox functionality
    if (name === "contact.sameAsAbove") {
      setFormData(prev => {
        const newFormData = { ...prev };
        if (checked) {
          // Copy current address to permanent address when checkbox is checked
          newFormData.contact = {
            ...prev.contact,
            permanentAddress: prev.contact.currentAddress,
            permanentPin: prev.contact.currentPin,
            permanentCity: prev.contact.currentCity,
            permanentDistrict: prev.contact.currentDistrict,
            permanentState: prev.contact.currentState,
            permanentCountry: prev.contact.currentCountry,
            sameAsAbove: true
          };
        } else {
          // Reset permanent address fields when checkbox is unchecked
          newFormData.contact = {
            ...prev.contact,
            sameAsAbove: false
          };
        }
        return newFormData;
      });
      return; // Exit early to prevent default behavior
    }

    // Handle the family "Same as Above" checkbox functionality
    if (name === "family.sameAsAbove") {
      setFormData(prev => {
        const newFormData = { ...prev };
        if (checked) {
          // Copy current address to family address when checkbox is checked
          newFormData.family = {
            ...prev.family,
            address: prev.contact.currentAddress,
            pin: prev.contact.currentPin,
            city: prev.contact.currentCity,
            district: prev.contact.currentDistrict,
            state: prev.contact.currentState,
            country: prev.contact.currentCountry,
            sameAsAbove: true
          };
        } else {
          // Reset family address fields when checkbox is unchecked
          newFormData.family = {
            ...prev.family,
            sameAsAbove: false
          };
        }
        return newFormData;
      });
      return; // Exit early to prevent default behavior
    }

    // Force uppercase for specific fields
    if (type !== "select-one" && type !== "radio" && type !== "date" && type !== "number" && !name.includes(".email")) {
      const fieldsToUppercase = [
        "personal.fullName", "personal.aadhar", "personal.pan", 
        "contact.currentAddress", "contact.permanentAddress", 
        "family.address", "family.fullName", "family.relation",
        "job.designation", "job.manager", "job.workLocation",
        "salary.incentiveDetails",
        "bank.name", "bank.bankName", "bank.branch",
        "education.qualification", "education.experience", "education.skills"
      ];
      if (fieldsToUppercase.some(field => name.includes(field))) {
        finalValue = value.toUpperCase();
      } else {
        finalValue = value;
      }
    } else {
      finalValue = value;
    }

    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: { ...prev[section][field], [subField]: finalValue } }
      }));
    } else {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
    }
  };

  // Handle location input change
  const handleLocationChange = (type, value, section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields before submission
    const requiredFields = [
      { field: formData.personal.fullName, message: "Full Name is required" },
      { field: formData.personal.gender, message: "Gender is required" },
      { field: formData.personal.aadhar, message: "Aadhar Card Number is required" },
      { field: formData.personal.pan, message: "PAN is required" },
      { field: formData.contact.phone, message: "Phone Number is required" },
      { field: formData.contact.email, message: "Email is required" },
      { field: formData.contact.currentAddress, message: "Current Address is required" },
      { field: formData.contact.currentPin, message: "Current Pin Code is required" },
      { field: formData.contact.currentCity, message: "Current City is required" },
      { field: formData.contact.currentDistrict, message: "Current District is required" },
      { field: formData.contact.currentState, message: "Current State is required" },
      { field: formData.job.doj, message: "Date of Joining is required" },
      { field: formData.job.role, message: "Role is required" },
      { field: formData.job.designation, message: "Designation is required" },
      { field: formData.job.empType, message: "Employee Type is required" },
      { field: formData.job.manager, message: "Reporting Manager is required" },
      { field: formData.job.workLocation, message: "Work Location is required" },
      { field: formData.bank.name, message: "Name as per Bank Record is required" },
      { field: formData.bank.bankName, message: "Bank Name is required" },
      { field: formData.bank.branch, message: "Branch is required" },
      { field: formData.bank.account, message: "Account Number is required" },
      { field: formData.bank.ifsc, message: "IFSC Code is required" }
    ];

    for (const { field, message } of requiredFields) {
      if (!field || field.trim() === "") {
        setError(message);
        return;
      }
    }

    // Validate permanent address if not same as above
    if (!formData.contact.sameAsAbove) {
      if (!formData.contact.permanentDistrict) {
        setError("Please select a district for permanent address");
        return;
      }
    }

    // Validate family address if not same as above
    if (!formData.family.sameAsAbove && formData.family.fullName) {
      if (!formData.family.district) {
        setError("Please select a district for family address");
        return;
      }
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      
      // Prepare payload object
      const payload = {
        fullName: formData.personal.fullName,
        phoneNumber: formData.contact.phone,
        email: formData.contact.email,
        role: formData.job.role,
        department: formData.job.department,
        joiningDate: formData.job.doj,
        status: "active",

        personalInfo: {
          gender: formData.personal.gender.toLowerCase(),
          aadharCardNumber: formData.personal.aadhar,
          pan: formData.personal.pan,
        },

        contactDetails: {
          phoneNumber: formData.contact.phone,
          whatsapp: formData.contact.whatsapp,
          emailId: formData.contact.email,
          currentAddress: {
            address: formData.contact.currentAddress,
            pinCode: formData.contact.currentPin,
            city: formData.contact.currentCity,
            district: formData.contact.currentDistrict,
            state: formData.contact.currentState,
            country: formData.contact.currentCountry,
          },
          permanentAddress: {
            address: formData.contact.sameAsAbove ? formData.contact.currentAddress : formData.contact.permanentAddress,
            pinCode: formData.contact.sameAsAbove ? formData.contact.currentPin : formData.contact.permanentPin,
            city: formData.contact.sameAsAbove ? formData.contact.currentCity : formData.contact.permanentCity,
            district: formData.contact.sameAsAbove ? formData.contact.currentDistrict : formData.contact.permanentDistrict,
            state: formData.contact.sameAsAbove ? formData.contact.currentState : formData.contact.permanentState,
            country: formData.contact.sameAsAbove ? formData.contact.currentCountry : formData.contact.permanentCountry,
            sameAsCurrent: formData.contact.sameAsAbove,
          },
        },

        familyDetails: {
          fullName: formData.family.fullName,
          relationWithEmployee: formData.family.relation,
          phoneNumber: formData.family.phone,
          email: formData.family.email,
          address: {
            address: formData.family.sameAsAbove ? formData.contact.currentAddress : formData.family.address,
            pinCode: formData.family.sameAsAbove ? formData.contact.currentPin : formData.family.pin,
            city: formData.family.sameAsAbove ? formData.contact.currentCity : formData.family.city,
            district: formData.family.sameAsAbove ? formData.contact.currentDistrict : formData.family.district,
            state: formData.family.sameAsAbove ? formData.contact.currentState : formData.family.state,
            country: formData.family.sameAsAbove ? formData.contact.currentCountry : formData.family.country,
            sameAsCurrent: formData.family.sameAsAbove,
          },
        },

        jobDetails: {
          dateOfJoining: formData.job.doj,
          department: formData.job.department,
          designation: formData.job.designation,
          employeeType: formData.job.empType,
          reportingManager: formData.job.manager,
          workLocation: formData.job.workLocation,
        },

        salaryDetails: {
          basicSalary: Number(formData.salary.basicSalary) || 0,
          travellingAllowance: Number(formData.salary.travellingAllowance) || 0,
          dailyAllowance: Number(formData.salary.dailyAllowance) || 0,
          mobileExpenses: Number(formData.salary.mobileExpenses) || 0,
          totalSalary: Number(formData.salary.totalSalary) || 0,
          incentiveDetails: formData.salary.incentiveDetails,
        },

        bankDetails: {
          nameAsPerBankRecord: formData.bank.name,
          bankName: formData.bank.bankName,
          branch: formData.bank.branch,
          accountNumber: formData.bank.account,
          ifsc: formData.bank.ifsc,
        },

        educationExperience: {
          qualification: formData.education.qualification,
          experience: formData.education.experience,
          skills: formData.education.skills.split(",").map(s => s.trim()).filter(Boolean),
        },
      };

      // Append JSON data
      formDataToSend.append("data", JSON.stringify(payload));

      // Append new files
      const fileMap = {
        aadhar: "aadharCard",
        pan: "panCard",
        drivingLicense: "drivingLicense",
        addressProof: "addressProof",
        fitness: "fitnessCertificate",
        eduDoc: "educationDocument",
        expLetter: "experienceLetter",
      };

      Object.keys(fileMap).forEach(key => {
        if (formData.documents[key] && formData.documents[key] instanceof File) {
          formDataToSend.append(fileMap[key], formData.documents[key]);
        }
      });

      // Append policy files and metadata
      if (formData.documents.paPolicy.file && formData.documents.paPolicy.file instanceof File) {
        formDataToSend.append("paPolicy", formData.documents.paPolicy.file);
        if (formData.documents.paPolicy.policyNumber) {
          formDataToSend.append("paPolicyNumber", formData.documents.paPolicy.policyNumber);
        }
        if (formData.documents.paPolicy.startDate) {
          formDataToSend.append("paPolicyStartDate", formData.documents.paPolicy.startDate);
        }
        if (formData.documents.paPolicy.endDate) {
          formDataToSend.append("paPolicyEndDate", formData.documents.paPolicy.endDate);
        }
      }

      if (formData.documents.healthPolicy.file && formData.documents.healthPolicy.file instanceof File) {
        formDataToSend.append("healthPolicy", formData.documents.healthPolicy.file);
        if (formData.documents.healthPolicy.policyNumber) {
          formDataToSend.append("healthPolicyNumber", formData.documents.healthPolicy.policyNumber);
        }
        if (formData.documents.healthPolicy.startDate) {
          formDataToSend.append("healthPolicyStartDate", formData.documents.healthPolicy.startDate);
        }
        if (formData.documents.healthPolicy.endDate) {
          formDataToSend.append("healthPolicyEndDate", formData.documents.healthPolicy.endDate);
        }
      }

      // Send update request
      const response = await apiClient.put(apiEndpoints.employees.update(id), formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate("/admin/employee-list"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || err.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">Edit Employee</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* PERSONAL INFORMATION */}
        <h3 className="text-lg font-semibold mb-4 text-black">Personal Information :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-black">Full Name :</label>
              <input 
                name="personal.fullName" 
                value={formData.personal.fullName} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-black">Gender :</label>
              <div className="flex gap-4 ml-0 sm:ml-2">
                <label className="flex items-center text-sm text-black">
                  <input 
                    type="radio" 
                    name="personal.gender" 
                    value="Male" 
                    checked={formData.personal.gender === "MALE"} 
                    onChange={handleChange} 
                    className="mr-2 text-teal-600" 
                    required 
                  /> Male
                </label>
                <label className="flex items-center text-sm text-black">
                  <input 
                    type="radio" 
                    name="personal.gender" 
                    value="Female" 
                    checked={formData.personal.gender === "FEMALE"} 
                    onChange={handleChange} 
                    className="mr-2 text-teal-600" 
                    required 
                  /> Female
                </label>
                <label className="flex items-center text-sm text-black">
                  <input 
                    type="radio" 
                    name="personal.gender" 
                    value="Other" 
                    checked={formData.personal.gender === "OTHER"} 
                    onChange={handleChange} 
                    className="mr-2 text-teal-600" 
                    required 
                  /> Other
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-black">Aadhar Card Number:</label>
              <input 
                name="personal.aadhar" 
                value={formData.personal.aadhar} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-black">PAN:</label>
              <input 
                name="personal.pan" 
                value={formData.personal.pan} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Employment Contact Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-4 sm:mb-0 text-black">Phone Number :</label>
              <input 
                name="contact.phone" 
                value={formData.contact.phone} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-black">WhatsApp :</label>
              <input 
                name="contact.whatsapp" 
                value={formData.contact.whatsapp} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Email ID :</label>
              <input 
                name="contact.email" 
                value={formData.contact.email} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Current Address:</label>
              <input 
                name="contact.currentAddress" 
                value={formData.contact.currentAddress} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
              <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-black">Pin code:</label>
              <input 
                name="contact.currentPin" 
                value={formData.contact.currentPin} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">City :</label>
              <LocationInput
                type="city"
                value={formData.contact.currentCity}
                onChange={(value) => handleLocationChange("city", value, "contact", "currentCity")}
                placeholder="Select or type city"
                className="w-full"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">District:</label>
              <LocationInput
                type="district"
                value={formData.contact.currentDistrict}
                onChange={(value) => handleLocationChange("district", value, "contact", "currentDistrict")}
                placeholder="Select or type district"
                className="w-full"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">State:</label>
              <LocationInput
                type="state"
                value={formData.contact.currentState}
                onChange={(value) => handleLocationChange("state", value, "contact", "currentState")}
                placeholder="Select or type state"
                className="w-full"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Country:</label>
              <select 
                name="contact.currentCountry" 
                value={formData.contact.currentCountry} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required
              >
                <option value="India">India</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2 mt-4 pt-4 border-t">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Permanent Address:</label>
              <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-black">
                <input 
                  type="checkbox" 
                  name="contact.sameAsAbove" 
                  checked={formData.contact.sameAsAbove} 
                  onChange={handleChange} 
                  className="mr-2 text-teal-600" 
                /> Same as above
              </label>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Permanent Address:</label>
              <input 
                name="contact.permanentAddress" 
                value={formData.contact.permanentAddress} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.contact.sameAsAbove}
              />
              <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-black">Pin code:</label>
              <input 
                name="contact.permanentPin" 
                value={formData.contact.permanentPin} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.contact.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">City :</label>
              <LocationInput
                type="city"
                value={formData.contact.permanentCity}
                onChange={(value) => handleLocationChange("city", value, "contact", "permanentCity")}
                placeholder="Select or type city"
                className="w-full"
                disabled={formData.contact.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">District:</label>
              <LocationInput
                type="district"
                value={formData.contact.permanentDistrict}
                onChange={(value) => handleLocationChange("district", value, "contact", "permanentDistrict")}
                placeholder="Select or type district"
                className="w-full"
                disabled={formData.contact.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">State:</label>
              <LocationInput
                type="state"
                value={formData.contact.permanentState}
                onChange={(value) => handleLocationChange("state", value, "contact", "permanentState")}
                placeholder="Select or type state"
                className="w-full"
                disabled={formData.contact.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Country:</label>
              <select 
                name="contact.permanentCountry" 
                value={formData.contact.permanentCountry} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.contact.sameAsAbove}
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>
        </div>

        {/* FAMILY DETAILS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Family Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Full Name :</label>
              <input 
                name="family.fullName" 
                value={formData.family.fullName} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Relation With Employee:</label>
              <input 
                name="family.relation" 
                value={formData.family.relation} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-8 sm:mb-0 text-black">Phone No :</label>
              <input 
                name="family.phone" 
                value={formData.family.phone} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Email:</label>
              <input 
                name="family.email" 
                value={formData.family.email} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2 mt-4 pt-4 border-t">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Address:</label>
              <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-black">
                <input 
                  type="checkbox" 
                  name="family.sameAsAbove" 
                  checked={formData.family.sameAsAbove} 
                  onChange={handleChange} 
                  className="mr-2 text-teal-600" 
                /> Same as above
              </label>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Address:</label>
              <input 
                name="family.address" 
                value={formData.family.address} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.family.sameAsAbove}
              />
              <label className="w-full sm:w-20 text-sm ml-0 sm:ml-8 mt-2 sm:mt-0 mb-1 sm:mb-0 text-black">Pin code:</label>
              <input 
                name="family.pin" 
                value={formData.family.pin} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.family.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">City :</label>
              <LocationInput
                type="city"
                value={formData.family.city}
                onChange={(value) => handleLocationChange("city", value, "family", "city")}
                placeholder="Select or type city"
                className="w-full"
                disabled={formData.family.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">District:</label>
              <LocationInput
                type="district"
                value={formData.family.district}
                onChange={(value) => handleLocationChange("district", value, "family", "district")}
                placeholder="Select or type district"
                className="w-full"
                disabled={formData.family.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">State:</label>
              <LocationInput
                type="state"
                value={formData.family.state}
                onChange={(value) => handleLocationChange("state", value, "family", "state")}
                placeholder="Select or type state"
                className="w-full"
                disabled={formData.family.sameAsAbove}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Country:</label>
              <select 
                name="family.country" 
                value={formData.family.country} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                disabled={formData.family.sameAsAbove}
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>
        </div>

        {/* JOB DETAILS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Job Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-black">Date Of Joining :</label>
              <input 
                type="date" 
                name="job.doj" 
                value={formData.job.doj} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-black">Role:</label>
              <select 
                name="job.role" 
                value={formData.job.role} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required
              >
                <option value="">Select Role</option>
                <option value="salesman">Salesman</option>
                <option value="telecaller">Telecaller</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="super_admin">Super Admin</option>
                <option value="advocate">Advocate</option>
                <option value="doctor">Doctor</option>
                <option value="expert">Expert</option>
                <option value="salesperson">Salesperson</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Department:</label>
              <input 
                name="job.department" 
                value={formData.job.department} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Designation:</label>
              <input 
                name="job.designation" 
                value={formData.job.designation} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Employee Type:</label>
              <select 
                name="job.empType" 
                value={formData.job.empType} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required
              >
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship / Trainee">Internship / Trainee</option>
                <option value="Commision Based">Commision Based</option>
                <option value="Consultant / Advisor">Consultant / Advisor</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Reporting Manager :</label>
              <input 
                name="job.manager" 
                value={formData.job.manager} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Work Location:</label>
              <input 
                name="job.workLocation" 
                value={formData.job.workLocation} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
          </div>
        </div>

        {/* SALARY DETAILS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Salary Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-black">Basic Salary :</label>
              <input 
                type="number" 
                name="salary.basicSalary" 
                value={formData.salary.basicSalary} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Travelling Allowance :</label>
              <input 
                type="number" 
                name="salary.travellingAllowance" 
                value={formData.salary.travellingAllowance} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Daily Allowance :</label>
              <input 
                type="number" 
                name="salary.dailyAllowance" 
                value={formData.salary.dailyAllowance} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Mobile Expenses :</label>
              <input 
                type="number" 
                name="salary.mobileExpenses" 
                value={formData.salary.mobileExpenses} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Total Salary :</label>
              <input 
                type="number" 
                name="salary.totalSalary" 
                value={formData.salary.totalSalary} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Incentive Details :</label>
              <input 
                name="salary.incentiveDetails" 
                value={formData.salary.incentiveDetails} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
          </div>
        </div>

        {/* BANK DETAILS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Bank Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="sm:w-42 text-sm mb-1 md:mr-2 sm:mb-0 text-black">Name As Per Bank Record :</label>
              <input 
                name="bank.name" 
                value={formData.bank.name} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Bank Name :</label>
              <input 
                name="bank.bankName" 
                value={formData.bank.bankName} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-black">Branch :</label>
              <input 
                name="bank.branch" 
                value={formData.bank.branch} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-28 text-sm mb-1 sm:mb-0 text-black">Account Number :</label>
              <input 
                name="bank.account" 
                value={formData.bank.account} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-black">IFSC :</label>
              <select 
                name="bank.ifsc" 
                value={formData.bank.ifsc} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                required
              >
                <option value="">Select IFSC</option>
                <option value="SBIN0000123">SBIN0000123</option>
                <option value="HDFC0000456">HDFC0000456</option>
                <option value="ICIC0000123">ICIC0000123</option>
                <option value="AXIS0000123">AXIS0000123</option>
                <option value="UBIN0000123">UBIN0000123</option>
              </select>
            </div>
          </div>
        </div>

        {/* EDUCATION & EXPERIENCE */}
        <h3 className="text-lg font-semibold mb-4 text-black">Education & Experience :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Qualification :</label>
              <input 
                name="education.qualification" 
                value={formData.education.qualification} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Experience :</label>
              <input 
                name="education.experience" 
                value={formData.education.experience} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-black">Skills :</label>
              <input 
                name="education.skills" 
                value={formData.education.skills} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500" 
                placeholder="Enter skills separated by commas"
              />
            </div>
          </div>
        </div>

        {/* UPLOAD DOCUMENTS */}
        <h3 className="text-lg font-semibold mb-4 text-black">Upload Documents (Leave blank to keep existing):</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-6">
            {[
              { key: "aadhar", label: "Aadhar Card :" },
              { key: "pan", label: "PAN Card :" },
              { key: "drivingLicense", label: "Driving License :" },
              { key: "addressProof", label: "Address Proof :" },
              { key: "fitness", label: "Fitness Certificate :" },
              { key: "paPolicy", label: "PA Policy :" },
              { key: "healthPolicy", label: "Health Policy :" },
              { key: "eduDoc", label: "Education Document :" },
              { key: "expLetter", label: "Experience Letter :" }
            ].map(doc => (
              <div key={doc.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="w-full sm:w-36 text-sm mb-1 sm:mb-0 text-black">{doc.label}</label>
                <button 
                  type="button" 
                  onClick={() => fileRefs[doc.key].current?.click()} 
                  className="border border-gray-300 bg-gray-100 px-4 py-2 text-sm rounded-md hover:bg-gray-200 w-full sm:w-auto transition-colors"
                >
                  Choose File
                </button>
                <input ref={fileRefs[doc.key]} type="file" name={`documents.${doc.key}`} onChange={handleChange} className="hidden" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-black truncate max-w-[150px]">
                    {(() => {
                      const file = formData.documents[doc.key];
                      if (doc.key === "paPolicy" || doc.key === "healthPolicy") {
                        if (file?.file instanceof File) {
                          return file.file.name;
                        } else if (file?.file && typeof file.file === 'string') {
                          return file.file.split('\\').pop().split('/').pop();
                        }
                        return "No existing file";
                      }
                      if (file instanceof File) {
                        return file.name;
                      } else if (file && typeof file === 'string') {
                        return file.split('\\').pop().split('/').pop();
                      }
                      return "No existing file";
                    })()}
                  </span>

                  {/* Preview button for existing documents */}
                  {(() => {
                    const file = formData.documents[doc.key];
                    let filePath = null;

                    if (doc.key === "paPolicy" || doc.key === "healthPolicy") {
                      if (typeof file?.file === 'string') {
                        filePath = file.file;
                      }
                    } else if (typeof file === 'string') {
                      filePath = file;
                    }

                    if (filePath) {
                      return (
                        <a
                          href={getDocumentUrl(filePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Preview
                        </a>
                      );
                    }
                    return null;
                  })()}
                </div>

                {(doc.key === "paPolicy" || doc.key === "healthPolicy") && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    {formData.documents[doc.key]?.file instanceof File && (
                      <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Policy Number:</label>
                          <input 
                            name={`documents.${doc.key}.policyNumber`} 
                            value={formData.documents[doc.key].policyNumber} 
                            onChange={handleChange} 
                            placeholder="Policy Number" 
                            className="border p-2 text-sm rounded-md flex-1" 
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">Start Date:</label>
                          <input 
                            type="date" 
                            name={`documents.${doc.key}.startDate`} 
                            value={formData.documents[doc.key].startDate} 
                            onChange={handleChange} 
                            className="border p-2 text-sm rounded-md flex-1" 
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-black">End Date:</label>
                          <input 
                            type="date" 
                            name={`documents.${doc.key}.endDate`} 
                            value={formData.documents[doc.key].endDate} 
                            onChange={handleChange} 
                            className="border p-2 text-sm rounded-md flex-1" 
                          />
                        </div>
                      </>
                    )}
                    {/* Show a note when no new file is being uploaded for health/PA policy */}
                    {!(formData.documents[doc.key]?.file instanceof File) && formData.documents[doc.key]?.policyNumber && (
                      <div className="text-sm text-gray-500 mt-1">
                        Existing: {formData.documents[doc.key].policyNumber} | 
                        Start: {formData.documents[doc.key].startDate} | 
                        End: {formData.documents[doc.key].endDate}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button 
            type="submit" 
            disabled={saving} 
            className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto transition-colors"
          >
            {saving ? "Updating..." : "Update Employee"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700 w-full sm:w-auto transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;