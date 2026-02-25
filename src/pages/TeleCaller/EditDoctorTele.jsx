// import React, { useState, useEffect } from "react";
// import apiClient, { apiEndpoints } from "../../services/apiClient";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";

// const EditDoctorForm = () => {
//   const { id } = useParams(); // Doctor ID from URL
//   const navigate = useNavigate();

//   const [membershipType, setMembershipType] = useState("Individual");
//   const [doctors, setDoctors] = useState([{}]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     mlId: "",
//     date: new Date().toISOString().split('T')[0],

//     status: "cold",
//     followUpDate: "",
//     remarks: "",

//     doctorName: "",
//     specialty: "",
//     mobile: "",
//     whatsapp: "",
//     qualification: "",
//     email: "",

//     hospitalName: "",
//     hospitalType: "Hospital",
//     hospitalAddress: "",
//     hospitalPinCode: "",
//     numberOfBeds: "",
//     regLicenseNo: "",
//     yearOfEstablishment: "",
//     hospitalPan: "",
//     contactNo: "",
//     hospitalWhastApp: "",
//     hospitalEmail: "",
//     ownershipType: "Private",
//     medicalSuperintendentName: "",
//     adminOfficerName: "",
//     directorContactNo: "",
//     doctorType: "individual",
//   });

//   // Fetch Doctor Data on Mount
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         setLoading(true);
//         const res = await apiClient.get(`/doctors/${id}`);

//         if (!res.data.success || !res.data.data) {
//           toast.error("Doctor not found");
//           navigate('/telecaller/calling-list');
//           return;
//         }

//         const doc = res.data.data;

//         // Determine membership type
//         let type = "Individual";
//         if (doc.doctorType === "hospital") type = "Hospital";
//         else if (doc.doctorType === "hospital_individual") type = "Hospital + Individual";

//         setMembershipType(type);

//         // Fill form data
//         setFormData({
//           mlId: doc.membershipId || doc.doctorId || "",
//           date: new Date().toISOString().split('T')[0],

//           status: doc.doctorStatus || "cold",
//           followUpDate: doc.nextFollowUpDate ? new Date(doc.nextFollowUpDate).toISOString().split('T')[0] : "",
//           remarks: doc.remarks || doc.specialNotes || "",

//           doctorName: doc.fullName || "",
//           specialty: doc.specialization?.[0] || "",
//           mobile: doc.phoneNumber || "",
//           whatsapp: doc.whatsappNumber || "",
//           qualification: doc.qualification || "",
//           email: doc.email || "",

//           hospitalName: doc.hospitalName || "",
//           hospitalType: doc.hospitalDetails?.hospitalType || "Hospital",
//           hospitalAddress: doc.hospitalAddress?.address || doc.contactDetails?.currentAddress?.address || "",
//           hospitalPinCode: doc.hospitalAddress?.pinCode || "",
//           numberOfBeds: doc.hospitalDetails?.beds || "",
//           regLicenseNo: doc.licenseNumber || "",
//           yearOfEstablishment: doc.hospitalDetails?.establishmentYear || "",
//           hospitalPan: doc.personalInfo?.pan || "",
//           contactNo: doc.contactDetails?.phoneNumber || "",
//           hospitalWhastApp: doc.contactDetails?.whatsapp || "",
//           hospitalEmail: doc.contactDetails?.emailId || doc.email || "",
//           ownershipType: doc.hospitalDetails?.ownershipType || "Private",
//           medicalSuperintendentName: doc.hospitalDetails?.director?.name || "",
//           adminOfficerName: doc.hospitalDetails?.admin?.name || "",
//           directorContactNo: doc.hospitalDetails?.director?.contact || "",
//           doctorType: doc.doctorType || "individual",
//         });

//         // If hospital_individual → allow multiple doctors (future support)
//         if (doc.doctorType === "hospital_individual") {
//           setDoctors([{}, {}]); // just to show add button
//         }

//       } catch (err) {
//         toast.error("Failed to load doctor details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchDoctor();
//   }, [id, navigate]);

//   const handleChange = (e, field) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: e.target.value
//     }));
//   };

//   const handleAddDoctor = () => {
//     setDoctors([...doctors, {}]);
//   };

//   const handleUpdate = async () => {
//     setSaving(true);
//     try {
//       const updatedData = {
//         fullName: formData.doctorName,
//         email: formData.email,
//         phoneNumber: formData.mobile,
//         whatsappNumber: formData.whatsapp,
//         specialization: formData.specialty ? [formData.specialty] : [],
//         qualification: formData.qualification,
//         licenseNumber: formData.regLicenseNo,

//         hospitalName: formData.hospitalName,
//         hospitalAddress: {
//           address: formData.hospitalAddress,
//           pinCode: formData.hospitalPinCode,
//         },

//         doctorStatus: formData.status.toLowerCase(),
//         doctorType: formData.doctorType,

//         personalInfo: {
//           pan: formData.hospitalPan
//         },

//         contactDetails: {
//           phoneNumber: formData.contactNo,
//           whatsapp: formData.hospitalWhastApp,
//           emailId: formData.hospitalEmail,
//           currentAddress: {
//             address: formData.hospitalAddress,
//             pinCode: formData.hospitalPinCode,
//           }
//         },

//         hospitalDetails: {
//           hospitalType: formData.hospitalType,
//           beds: parseInt(formData.numberOfBeds) || 0,
//           establishmentYear: formData.yearOfEstablishment,
//           ownershipType: formData.ownershipType,
//           director: {
//             name: formData.medicalSuperintendentName,
//             contact: formData.directorContactNo,
//             email: formData.hospitalEmail
//           },
//           admin: {
//             name: formData.adminOfficerName,
//             contact: formData.directorContactNo,
//             email: formData.hospitalEmail
//           }
//         },

//         remarks: formData.remarks,
//         nextFollowUpDate: formData.followUpDate || undefined,
//       };

//       const res = await apiClient.patch(`/doctors/${id}`, updatedData);

//       if (res.data.success) {
//         toast.success("Doctor updated successfully!");
//         navigate('/telecaller/calling-list');
//       } else {
//         throw new Error(res.data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error("Failed to update doctor: " + (error.response?.data?.message || error.message));
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Reusable components same as Add Form
//   const renderDoctorBlock = (index) => (
//     <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Doctor Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><input type="text" placeholder="Enter Doctor Name" value={index === 0 ? formData.doctorName : ""} onChange={(e) => index === 0 && handleChange(e, 'doctorName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Enter Specialty" value={index === 0 ? formData.specialty : ""} onChange={(e) => index === 0 && handleChange(e, 'specialty')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Enter Mobile No" value={index === 0 ? formData.mobile : ""} onChange={(e) => index === 0 && handleChange(e, 'mobile')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Enter WhatsApp No" value={index === 0 ? formData.whatsapp : ""} onChange={(e) => index === 0 && handleChange(e, 'whatsapp')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Qualification" value={index === 0 ? formData.qualification : ""} onChange={(e) => index === 0 && handleChange(e, 'qualification')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="email" placeholder="Enter Email ID" value={index === 0 ? formData.email : ""} onChange={(e) => index === 0 && handleChange(e, 'email')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//       </div>
//       {index === 0 && membershipType === "Hospital + Individual" && (
//         <button onClick={handleAddDoctor} className="mt-6 px-5 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition flex items-center gap-2">
//           <span className="text-xl">+</span> Add Another Doctor
//         </button>
//       )}
//     </div>
//   );

//   const renderHospitalDetailsForIndividual = () => (
//     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><input type="text" placeholder="Enter Hospital Name" value={formData.hospitalName} onChange={(e) => handleChange(e, 'hospitalName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div>
//           <select value={formData.hospitalType} onChange={(e) => handleChange(e, 'hospitalType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none">
//             <option>Maternity Home</option>
//             <option>Clinic</option>
//             <option>Hospital</option>
//           </select>
//         </div>
//         <div><input type="text" placeholder="Enter Address" value={formData.hospitalAddress} onChange={(e) => handleChange(e, 'hospitalAddress')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="6-digit Pin Code" value={formData.hospitalPinCode} onChange={(e) => handleChange(e, 'hospitalPinCode')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//       </div>
//     </div>
//   );

//   const renderFullHospitalForm = () => (
//     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Same fields as Add Form */}
//         <div><input type="text" placeholder="Enter Hospital Name" value={formData.hospitalName} onChange={(e) => handleChange(e, 'hospitalName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><select value={formData.hospitalType} onChange={(e) => handleChange(e, 'hospitalType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"><option>Maternity Home</option><option>Clinic</option><option>Hospital</option></select></div>
//         <div><input type="text" placeholder="No. of Beds" value={formData.numberOfBeds} onChange={(e) => handleChange(e, 'numberOfBeds')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Reg / License No" value={formData.regLicenseNo} onChange={(e) => handleChange(e, 'regLicenseNo')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="YYYY" value={formData.yearOfEstablishment} onChange={(e) => handleChange(e, 'yearOfEstablishment')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Hospital PAN" value={formData.hospitalPan} onChange={(e) => handleChange(e, 'hospitalPan')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Contact No" value={formData.contactNo} onChange={(e) => handleChange(e, 'contactNo')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="WhatsApp" value={formData.hospitalWhastApp} onChange={(e) => handleChange(e, 'hospitalWhastApp')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Address" value={formData.hospitalAddress} onChange={(e) => handleChange(e, 'hospitalAddress')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="email" placeholder="Email" value={formData.hospitalEmail} onChange={(e) => handleChange(e, 'hospitalEmail')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><select value={formData.ownershipType} onChange={(e) => handleChange(e, 'ownershipType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"><option>Private</option><option>Government</option></select></div>
//         <div><input type="text" placeholder="Medical Superintendent / Director Name" value={formData.medicalSuperintendentName} onChange={(e) => handleChange(e, 'medicalSuperintendentName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Admin / Mgmt Officer Name" value={formData.adminOfficerName} onChange={(e) => handleChange(e, 'adminOfficerName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//         <div><input type="text" placeholder="Director Contact No" value={formData.directorContactNo} onChange={(e) => handleChange(e, 'directorContactNo')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return <div className="p-6 text-center">Loading doctor details...</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-lato">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Doctor</h1>

//       {/* Top Section */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div><input type="text" placeholder="MLID" value={formData.mlId} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" /></div>
//           <div><input type="date" value={formData.date} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" /></div>
//           <div><input type="text" value={membershipType} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 font-medium text-teal-700" /></div>
//         </div>
//       </div>

//       {membershipType === "Individual" && (
//         <> {doctors.map((_, i) => renderDoctorBlock(i))} {renderHospitalDetailsForIndividual()} </>
//       )}

//       {membershipType === "Hospital" && renderFullHospitalForm()}

//       {membershipType === "Hospital + Individual" && (
//         <> {doctors.map((_, i) => renderDoctorBlock(i))} {renderFullHospitalForm()} </>
//       )}

//       {/* Status & Follow-up */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Follow-up</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <select value={formData.status} onChange={(e) => handleChange(e, 'status')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none">
//               <option value="hot">Hot</option>
//               <option value="warm">Warm</option>
//               <option value="cold">Cold</option>
//               <option value="close">Close</option>
//               <option value="converted">Converted</option>
//               <option value="lost">Lost</option>
//               <option value="follow_up">Follow Up</option>
//             </select>
//           </div>
//           <div><input type="date" value={formData.followUpDate} onChange={(e) => handleChange(e, 'followUpDate')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none" /></div>
//           <div className="md:col-span-2"><textarea rows={3} placeholder="Enter remarks here..." value={formData.remarks} onChange={(e) => handleChange(e, 'remarks')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"></textarea></div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         <button onClick={handleUpdate} disabled={saving} className={`px-6 py-2 text-white font-medium rounded-md transition ${saving ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>
//           {saving ? 'Updating...' : 'Update Doctor'}
//         </button>
//         <button onClick={() => navigate('/telecaller/calling-list')} className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition">Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default EditDoctorForm;















// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../services/apiClient";
// import { toast } from "react-toastify";
// import DateInput from "../../components/DateInput/DateInput";

// const EditDoctorSalesman = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   // State structure matching salesman's AddDoctorForm
//   const [membershipType, setMembershipType] = useState("Individual");
//   const [doctors, setDoctors] = useState([{
//     doctorName: "",
//     specialty: "",
//     mobile: "",
//     whatsapp: "",
//     qualification: "",
//     email: "",
//     hospitalName: "",
//     hospitalAddress: "",
//     hospitalPinCode: "",
//     regLicenseNo: "",
//     hospitalPan: "",
//     contactNo: "",
//     hospitalWhastApp: "",
//     hospitalEmail: "",
//   }]);
  
//   const [linkSpouses, setLinkSpouses] = useState(false);
  
//   const [mainFormData, setMainFormData] = useState({
//     mlId: "",
//     date: new Date().toISOString().split('T')[0],
//     status: "cold",
//     followUpDate: "",
//     remarks: "",
//     hospitalType: "Hospital",
//     numberOfBeds: "",
//     yearOfEstablishment: "",
//     ownershipType: "Private",
//     medicalSuperintendentName: "",
//     adminOfficerName: "",
//     directorContactNo: "",
//     doctorType: "individual",
//     // Hospital fields
//     hospitalName: "",
//     hospitalAddress: "",
//     hospitalPinCode: "",
//     regLicenseNo: "",
//     hospitalPan: "",
//     contactNo: "",
//     hospitalWhastApp: "",
//     hospitalEmail: "",
//   });

//   // Store original doctor IDs for handling updates
//   const [originalDoctorIds, setOriginalDoctorIds] = useState([]);
//   const [originalDoctorData, setOriginalDoctorData] = useState([]);

//   // Fetch doctor data
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
        
//         if (response.data.success) {
//           const doctorData = response.data.data;
//           const mainDoctor = doctorData.mainDoctor || doctorData;
          
//           // Handle linked/spouse doctors
//           let doctorsList = [];
//           let doctorIds = [];
//           let doctorDataList = [];
          
//           if (doctorData.isLinked) {
//             doctorsList = [doctorData.mainDoctor, doctorData.linkedDoctor];
//             doctorIds = [
//               doctorData.mainDoctor?._id,
//               doctorData.linkedDoctor?._id
//             ];
//             doctorDataList = [doctorData.mainDoctor, doctorData.linkedDoctor];
//             setLinkSpouses(true);
//           } else {
//             doctorsList = [doctorData];
//             doctorIds = [doctorData._id];
//             doctorDataList = [doctorData];
//           }

//           setOriginalDoctorIds(doctorIds);
//           setOriginalDoctorData(doctorDataList);

//           // Determine membership type from doctorType
//           let membershipTypeValue = "Individual";
//           if (mainDoctor.doctorType === "hospital") {
//             membershipTypeValue = "Hospital";
//           } else if (mainDoctor.doctorType === "hospital_individual") {
//             membershipTypeValue = "Hospital + Individual";
//           } else {
//             membershipTypeValue = "Individual";
//           }
          
//           setMembershipType(membershipTypeValue);

//           // Map doctors data to salesman form structure
//           const mappedDoctors = doctorsList.map(doctor => ({
//             doctorName: doctor.fullName || "",
//             specialty: Array.isArray(doctor.specialization) 
//               ? doctor.specialization.join(", ") 
//               : doctor.specialization || "",
//             mobile: doctor.phoneNumber || "",
//             whatsapp: doctor.whatsappNumber || "",
//             qualification: doctor.qualification || "",
//             email: doctor.email || "",
//             hospitalName: doctor.hospitalName || "",
//             hospitalAddress: doctor.hospitalAddress?.address || "",
//             hospitalPinCode: doctor.hospitalAddress?.pinCode || "",
//             regLicenseNo: doctor.licenseNumber || "",
//             hospitalPan: doctor.hospitalDetails?.hospitalPanNumber || "",
//             contactNo: doctor.contactDetails?.phoneNumber || "",
//             hospitalWhastApp: doctor.contactDetails?.whatsapp || "",
//             hospitalEmail: doctor.contactDetails?.emailId || "",
//           }));

//           setDoctors(mappedDoctors);

//           // Set main form data
//           setMainFormData({
//             mlId: mainDoctor.membershipId || "",
//             date: mainDoctor.createdAt 
//               ? new Date(mainDoctor.createdAt).toISOString().split('T')[0]
//               : new Date().toISOString().split('T')[0],
//             status: mainDoctor.doctorStatus || "cold",
//             followUpDate: mainDoctor.followUps?.[0]?.date 
//               ? new Date(mainDoctor.followUps[0].date).toISOString().split('T')[0]
//               : "",
//             remarks: mainDoctor.remarks || "",
//             hospitalType: mainDoctor.hospitalDetails?.hospitalType || "Hospital",
//             numberOfBeds: mainDoctor.hospitalDetails?.beds || "",
//             yearOfEstablishment: mainDoctor.hospitalDetails?.establishmentYear || "",
//             ownershipType: mainDoctor.hospitalDetails?.ownershipType || "Private",
//             medicalSuperintendentName: mainDoctor.hospitalDetails?.director?.name || "",
//             adminOfficerName: mainDoctor.hospitalDetails?.admin?.name || "",
//             directorContactNo: mainDoctor.hospitalDetails?.director?.contact || "",
//             doctorType: mainDoctor.doctorType || "individual",
//             // Hospital fields
//             hospitalName: mainDoctor.hospitalName || "",
//             hospitalAddress: mainDoctor.hospitalAddress?.address || "",
//             hospitalPinCode: mainDoctor.hospitalAddress?.pinCode || "",
//             regLicenseNo: mainDoctor.licenseNumber || "",
//             hospitalPan: mainDoctor.hospitalDetails?.hospitalPanNumber || "",
//             contactNo: mainDoctor.contactDetails?.phoneNumber || "",
//             hospitalWhastApp: mainDoctor.contactDetails?.whatsapp || "",
//             hospitalEmail: mainDoctor.contactDetails?.emailId || "",
//           });

//         } else {
//           setError("Failed to fetch doctor details");
//         }
//       } catch (err) {
//         console.error("Error fetching doctor:", err);
//         setError(err.response?.data?.message || "Failed to load doctor details");
//         toast.error("Failed to load doctor details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDoctor();
//     }
//   }, [id]);

//   const handleMainFormDataChange = (e, field) => {
//     let value = e.target.value;

//     // List of fields that should NOT be uppercased
//     const excludeFromUppercase = [
//       'email', 'hospitalEmail', 'followUpDate', 'date',
//       'status', 'hospitalType', 'ownershipType', 'doctorType'
//     ];

//     if (!excludeFromUppercase.includes(field)) {
//       value = value.toUpperCase();
//     }

//     setMainFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleDoctorChange = (index, field, value) => {
//     // Apply uppercase for text fields
//     if (['doctorName', 'specialty', 'qualification', 'hospitalName', 'hospitalAddress', 'regLicenseNo', 'hospitalPan'].includes(field)) {
//       value = value.toUpperCase();
//     }

//     const updatedDoctors = [...doctors];
//     updatedDoctors[index] = {
//       ...updatedDoctors[index],
//       [field]: value
//     };
//     setDoctors(updatedDoctors);
//   };

//   const handleAddDoctor = () => {
//     setDoctors([...doctors, {
//       doctorName: "",
//       specialty: "",
//       mobile: "",
//       whatsapp: "",
//       qualification: "",
//       email: "",
//       hospitalName: "",
//       hospitalAddress: "",
//       hospitalPinCode: "",
//       regLicenseNo: "",
//       hospitalPan: "",
//       contactNo: "",
//       hospitalWhastApp: "",
//       hospitalEmail: "",
//     }]);
//   };

//   const handleRemoveDoctor = (index) => {
//     if (index > 0) {
//       const updatedDoctors = [...doctors];
//       updatedDoctors.splice(index, 1);
//       setDoctors(updatedDoctors);
      
//       if (updatedDoctors.length < 2) {
//         setLinkSpouses(false);
//       }
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       // Prepare hospital details based on membership type
//       const getHospitalDetails = () => {
//         if (membershipType === "Hospital + Individual" || membershipType === "Individual") {
//           return {
//             hospitalType: mainFormData.hospitalType || "Hospital",
//             beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
//             establishmentYear: mainFormData.yearOfEstablishment || "",
//             website: "",
//             ownershipType: mainFormData.ownershipType || "Private",
//             director: {
//               name: mainFormData.medicalSuperintendentName || "",
//               contact: mainFormData.directorContactNo || "",
//               email: ""
//             },
//             admin: {
//               name: mainFormData.adminOfficerName || "",
//               contact: "",
//               email: ""
//             },
//             departments: [],
//             hospitalPanNumber: mainFormData.hospitalPan || ""
//           };
//         }
//         return {
//           hospitalPanNumber: mainFormData.hospitalPan || ""
//         };
//       };

//       // Process each doctor like in Add form
//       const updatedDoctors = [];

//       for (let i = 0; i < doctors.length; i++) {
//         const doctor = doctors[i];

//         const doctorData = {
//           // Basic Info
//           fullName: doctor.doctorName,
//           email: doctor.email?.toLowerCase() || "",
//           phoneNumber: doctor.mobile || "",
//           whatsappNumber: doctor.whatsapp || "",

//           // Professional Info
//           specialization: doctor.specialty ? doctor.specialty.split(',').map(s => s.trim()) : [],
//           qualification: doctor.qualification || "",
//           licenseNumber: doctor.regLicenseNo || "",

//           // Hospital Info - Hospital + Individual ke liye mainFormData se lein
//           hospitalName: membershipType === "Hospital + Individual" ?
//             (mainFormData.hospitalName || doctor.hospitalName) :
//             (doctor.hospitalName || mainFormData.hospitalName || ""),

//           hospitalAddress: {
//             address: membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalAddress || doctor.hospitalAddress || "") :
//               (doctor.hospitalAddress || mainFormData.hospitalAddress || ""),
//             city: "",
//             state: "",
//             district: "",
//             taluka: "",
//             pinCode: membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalPinCode || doctor.hospitalPinCode || "") :
//               (doctor.hospitalPinCode || mainFormData.hospitalPinCode || ""),
//             country: "India"
//           },

//           // Contact Details
//           contactDetails: {
//             phoneNumber: doctor.mobile || "",
//             whatsapp: doctor.whatsapp || "",
//             emailId: doctor.email?.toLowerCase() || "",
//             currentAddress: {
//               address: "",
//               pinCode: "",
//               city: "",
//               state: "",
//               district: "",
//               taluka: "",
//               country: "India"
//             }
//           },

//           // Status
//           doctorStatus: mainFormData.status.toLowerCase(),
//           typeOfEnquiry: (function (s) {
//             const map = {
//               hot: 'hot', warm: 'hot', cold: 'cold',
//               follow_up: 'follow_up', close: 'closed',
//               converted: 'closed', lost: 'cancel'
//             };
//             return map[s] || 'cold';
//           })(mainFormData.status.toLowerCase()),
//           status: "pending",
//           doctorType: membershipType === "Hospital" ? "hospital" : 
//                      membershipType === "Hospital + Individual" ? "hospital_individual" : 
//                      "individual",

//           // Hospital Details
//           hospitalDetails: getHospitalDetails(),

//           // Follow-ups - Only include if there's a follow-up date
//           followUps: mainFormData.followUpDate ? [{
//             date: new Date(mainFormData.followUpDate),
//             type: 'call',
//             notes: mainFormData.remarks || 'Scheduled follow-up',
//             nextFollowUpDate: new Date(mainFormData.followUpDate),
//             createdAt: new Date()
//           }] : [],

//           // Remarks
//           remarks: mainFormData.remarks || "",

//           // Membership Info
//           membershipType: membershipType
//         };

//         // IMPORTANT: Add membershipId only for main doctor (i === 0)
//         if (i === 0) {
//           doctorData.membershipId = mainFormData.mlId || undefined;
//         }

//         // For existing doctors, use UPDATE API
//         if (originalDoctorIds[i]) {
//           // Update existing doctor
//           const response = await apiClient.put(
//             apiEndpoints.doctors.updatesalesman(originalDoctorIds[i]), 
//             doctorData
//           );
          
//           if (response.data.success) {
//             updatedDoctors.push({
//               _id: originalDoctorIds[i],
//               ...response.data.data
//             });
//             toast.success(`Doctor ${i+1} updated successfully`);
//           } else {
//             throw new Error(response.data.message || `Failed to update doctor ${i+1}`);
//           }
//         } 
//         // For new doctors (like added spouse), use CREATE API
//         else if (i > 0) {
//           // IMPORTANT: Remove membershipId for new spouse doctor to avoid duplicate
//           delete doctorData.membershipId;
          
//           // Create new spouse doctor
//           const response = await apiClient.post(
//             apiEndpoints.salesman.addDoctor, 
//             doctorData
//           );
          
//           if (response.data.success) {
//             updatedDoctors.push(response.data.data);
//             toast.success(`New spouse doctor created successfully`);
//           } else {
//             throw new Error(response.data.message || "Failed to create spouse doctor");
//           }
//         }
//       }

//       // Handle spouse linking/unlinking
//       if (doctors.length === 2 && linkSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
//         const doctor1Id = updatedDoctors[0]?._id || originalDoctorIds[0];
//         const doctor2Id = updatedDoctors[1]?._id || originalDoctorIds[1];

//         if (doctor1Id && doctor2Id) {
//           try {
//             // Update both doctors with spouse linking
//             await apiClient.put(apiEndpoints.doctors.updatesalesman(doctor1Id), {
//               linkedDoctorId: doctor2Id,
//               relationshipType: 'spouse'
//             });

//             await apiClient.put(apiEndpoints.doctors.updatesalesman(doctor2Id), {
//               linkedDoctorId: doctor1Id,
//               relationshipType: 'spouse'
//             });

//             toast.success("Doctors linked as spouses successfully!");
//           } catch (spouseError) {
//             console.error("Spouse linking failed:", spouseError);
//             toast.error("Spouse linking failed. Please try again.");
//           }
//         }
//       } 
//       // Handle UNLINKING if previously linked but now checkbox unchecked
//       else if (originalDoctorIds.length > 1 && !linkSpouses) {
//         try {
//           // Unlink main doctor
//           await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[0]), {
//             linkedDoctorId: null,
//             relationshipType: null
//           });
          
//           // Unlink spouse doctor if exists
//           if (originalDoctorIds[1]) {
//             await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[1]), {
//               linkedDoctorId: null,
//               relationshipType: null
//             });
//           }
          
//           toast.info("Doctors unlinked successfully!");
//         } catch (unlinkError) {
//           console.error("Unlinking failed:", unlinkError);
//           toast.info("Doctors updated! (Unlinking failed)");
//         }
//       }

//       // If user removed spouse doctor from UI
//       if (originalDoctorIds.length > 1 && doctors.length === 1) {
//         try {
//           // Unlink main doctor
//           await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[0]), {
//             linkedDoctorId: null,
//             relationshipType: null
//           });
          
//           // Optionally, you can delete the removed spouse doctor
//           // Uncomment if you want to delete removed spouse
//           /*
//           await apiClient.delete(apiEndpoints.doctors.delete(originalDoctorIds[1]));
//           toast.info("Spouse doctor removed and unlinked");
//           */
          
//           toast.info("Spouse doctor unlinked successfully");
//         } catch (removeError) {
//           console.error("Error removing spouse:", removeError);
//         }
//       }

//       toast.success("Doctor details updated successfully!");
      
//       // Navigate based on user type
//       if (window.location.pathname.includes('/sales/')) {
//         navigate('/sales/all-doctors');
//       } else {
//         navigate(`/view-doctor/${id}`);
//       }

//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      
//       // Handle duplicate membershipId error specifically
//       if (errorMessage.includes('duplicate key') && errorMessage.includes('membershipId')) {
//         toast.error("Membership ID already exists. Please use a different one for spouse doctor.");
//       } else {
//         toast.error("Error updating doctor: " + errorMessage);
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================= RENDER FUNCTIONS =================

//   // Reusable Doctor Block
//   const renderDoctorBlock = (index) => (
//     <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200 relative">
//       {index > 0 && (
//         <button
//           onClick={() => handleRemoveDoctor(index)}
//           className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
//         >
//           ×
//         </button>
//       )}
      
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">
//           {doctors.length > 1 ? `Doctor ${index + 1} Details` : 'Doctor Details'}
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
//           <input
//             type="text"
//             placeholder="Enter Doctor Name"
//             value={doctors[index]?.doctorName || ""}
//             onChange={(e) => handleDoctorChange(index, 'doctorName', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
//           <input
//             type="text"
//             placeholder="Enter Specialty"
//             value={doctors[index]?.specialty || ""}
//             onChange={(e) => handleDoctorChange(index, 'specialty', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
//           <input
//             type="tel"
//             placeholder="Enter Mobile No"
//             value={doctors[index]?.mobile || ""}
//             onChange={(e) => {
//               if (e.target.value.length <= 10) {
//                 handleDoctorChange(index, "mobile", e.target.value);
//               }
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
//           <input
//             type="tel"
//             placeholder="Enter WhatsApp No"
//             value={doctors[index]?.whatsapp || ""}
//             onChange={(e) => {
//               if (e.target.value.length <= 10) {
//                 handleDoctorChange(index, "whatsapp", e.target.value);
//               }
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
//           <input
//             type="text"
//             placeholder="Qualification"
//             value={doctors[index]?.qualification || ""}
//             onChange={(e) => handleDoctorChange(index, 'qualification', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
//           <input
//             type="email"
//             placeholder="Email"
//             value={doctors[index]?.email || ""}
//             onChange={(e) => handleDoctorChange(index, 'email', e.target.value.toLowerCase())}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none lowercase"
//           />
//         </div>
       
//       </div>

//       {/* Hospital Details for Individual membership type - ONLY for Individual type */}
//       {membershipType === "Individual" && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Hospital/Clinic Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Hospital Name"
//                 value={doctors[index]?.hospitalName || ""}
//                 onChange={(e) => handleDoctorChange(index, 'hospitalName', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
//               <input
//                 type="text"
//                 placeholder="Enter Hospital Address"
//                 value={doctors[index]?.hospitalAddress || ""}
//                 onChange={(e) => handleDoctorChange(index, 'hospitalAddress', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
//               <input
//                 type="text"
//                 placeholder="6-digit Pin Code"
//                 value={doctors[index]?.hospitalPinCode || ""}
//                 onChange={(e) => {
//                   if (e.target.value.length <= 6) {
//                     handleDoctorChange(index, "hospitalPinCode", e.target.value);
//                   }
//                 }}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Button to add spouse doctor */}
//       {index === 0 && (membershipType === "Individual" || membershipType === "Hospital + Individual") && doctors.length < 2 && (
//         <button
//           onClick={handleAddDoctor}
//           className="mt-6 px-5 py-2 font-medium rounded-md hover:transition flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
//         >
//           <span className="text-xl">+</span> Add Spouse Doctor
//         </button>
//       )}
//     </div>
//   );

//   const renderFullHospitalForm = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
//             <input
//               type="text"
//               placeholder="Enter Hospital Name"
//               value={mainFormData.hospitalName || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalName')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
//             <select
//               value={mainFormData.hospitalType}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalType')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             >
//               <option value="Maternity Home">Maternity Home</option>
//               <option value="Clinic">Clinic</option>
//               <option value="Hospital">Hospital</option>
//               <option value="General Hospital">General Hospital</option>
//               <option value="Multispeciality Hospital">Multispeciality Hospital</option>
//               <option value="Super-Speciality Hospital">Super-Speciality Hospital</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
//             <input
//               type="text"
//               placeholder="No. of Beds"
//               value={mainFormData.numberOfBeds || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'numberOfBeds')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
//             <input
//               type="tel"
//               placeholder="Contact No"
//               value={mainFormData.contactNo || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "contactNo");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
//             <input
//               type="tel"
//               placeholder="WhatsApp"
//               value={mainFormData.hospitalWhastApp || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "hospitalWhastApp");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <input
//               type="text"
//               placeholder="Address"
//               value={mainFormData.hospitalAddress || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalAddress')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
//             <input
//               type="text"
//               placeholder="6-digit Pin Code"
//               value={mainFormData.hospitalPinCode || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 6) {
//                   handleMainFormDataChange(e, "hospitalPinCode");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               placeholder="Email"
//               value={mainFormData.hospitalEmail || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalEmail')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
//             <input
//               type="text"
//               placeholder="Admin / Mgmt Officer Name"
//               value={mainFormData.adminOfficerName || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'adminOfficerName')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Admin Contact No</label>
//             <input
//               type="tel"
//               placeholder="Admin Contact No"
//               value={mainFormData.directorContactNo || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "directorContactNo");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
//             <input
//               type="text"
//               placeholder="Year of Establishment"
//               value={mainFormData.yearOfEstablishment || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'yearOfEstablishment')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div> */}
//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Hospital PAN</label>
//             <input
//               type="text"
//               placeholder="Hospital PAN"
//               value={mainFormData.hospitalPan || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalPan')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
//             />
//           </div> */}
//         </div>
//       </div>
//     );
//   };

//   // ================= MAIN RENDER =================

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading doctor details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-lato">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Edit Doctor</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate(`/view-doctor/${id}`)}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
//           >
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </div>

//       {/* Basic Information Card */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">MLID</label>
//             <input
//               type="text"
//               placeholder="Enter Membership ID"
//               value={mainFormData.mlId}
//               onChange={(e) => handleMainFormDataChange(e, 'mlId')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <DateInput
//             label="Date"
//             value={mainFormData.date}
//             onChange={(v) => setMainFormData(prev => ({ ...prev, date: v }))}
//             returnFormat='yyyy-mm-dd'
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type of Membership</label>
//             <select
//               value={membershipType}
//               onChange={(e) => {
//                 const newType = e.target.value;
//                 setMembershipType(newType);
                
//                 // Update doctorType in mainFormData
//                 const doctorTypeMap = {
//                   "Individual": "individual",
//                   "Hospital": "hospital",
//                   "Hospital + Individual": "hospital_individual"
//                 };
                
//                 setMainFormData(prev => ({ 
//                   ...prev, 
//                   doctorType: doctorTypeMap[newType] || "individual" 
//                 }));
                
//                 // Reset spouse linking if needed
//                 if (newType === "Hospital") {
//                   setLinkSpouses(false);
//                   // If switching to Hospital, we might need to adjust doctors array
//                   if (doctors.length > 1) {
//                     setDoctors([doctors[0]]);
//                   }
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-teal-700 font-medium"
//             >
//               <option value="Individual">Individual</option>
//               <option value="Hospital">Hospital</option>
//               <option value="Hospital + Individual">Hospital + Individual</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Conditional Rendering Based on Membership Type */}
//       {membershipType === "Individual" && (
//         <>
//           {doctors.map((_, i) => renderDoctorBlock(i))}
//         </>
//       )}

//       {membershipType === "Hospital" && (
//         <>
//           {renderFullHospitalForm()}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center">
//               <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <span className="text-sm text-yellow-700">
//                 Hospital type membership - Doctor details are managed within hospital information
//               </span>
//             </div>
//           </div>
//         </>
//       )}

//       {membershipType === "Hospital + Individual" && (
//         <>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-blue-800">Hospital + Individual Membership</h3>
//                 <div className="mt-2 text-sm text-blue-700">
//                   <p>• Fill hospital details below - they will be shared with all doctors</p>
//                   <p>• Add individual doctor details above</p>
//                   <p>• Hospital information will be automatically applied to all doctors</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {doctors.map((_, i) => renderDoctorBlock(i))}
//           {renderFullHospitalForm()}
//         </>
//       )}

//       {/* Spouse Linking Checkbox */}
//       {(membershipType === "Individual" || membershipType === "Hospital + Individual") && doctors.length === 2 && (
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
//           <div className="flex items-start">
//             <input
//               type="checkbox"
//               id="linkSpouses"
//               checked={linkSpouses}
//               onChange={(e) => setLinkSpouses(e.target.checked)}
//               className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
//             />
//             <label htmlFor="linkSpouses" className="ml-3 block text-sm text-gray-700 flex-1">
//               <span className="font-medium">Link these doctors as spouses</span> - Combine names on bills (e.g., "Raju & Sunita")
//             </label>
//           </div>
//         </div>
//       )}

//       {/* Status & Follow-up Card */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Follow-up</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={mainFormData.status}
//               onChange={(e) => handleMainFormDataChange(e, 'status')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             >
//               <option value="hot">Hot</option>
//               <option value="warm">Warm</option>
//               <option value="cold">Cold</option>
//               <option value="close">Close</option>
//               <option value="converted">Converted</option>
//               <option value="lost">Lost</option>
//               <option value="follow_up">Follow Up</option>
//             </select>
//           </div>
//           <DateInput
//             label="Follow-up Date"
//             value={mainFormData.followUpDate}
//             onChange={(v) => setMainFormData(prev => ({ ...prev, followUpDate: v }))}
//             returnFormat='yyyy-mm-dd'
//           />
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
//             <textarea
//               rows={3}
//               placeholder="Enter remarks here..."
//               value={mainFormData.remarks}
//               onChange={(e) => handleMainFormDataChange(e, 'remarks')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"
//             ></textarea>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => navigate(`/view-doctor/${id}`)}
//           className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className={`px-6 py-2 text-white font-medium rounded-md transition ${saving ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
//         >
//           {saving ? 'Saving...' : 'Save Changes'}
//         </button>
//         <button
//           onClick={() => navigate(`/sales/add/quotation?doctorId=${id}`)}
//           className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
//         >
//           Give Quote
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditDoctorSalesman;





import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../services/apiClient";
import { toast } from "react-toastify";
import DateInput from "../../components/DateInput/DateInput";

const EditDoctorSalesman = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // State structure matching salesman's AddDoctorForm
  const [membershipType, setMembershipType] = useState("Individual");
  const [doctors, setDoctors] = useState([{
    doctorName: "",
    specialty: "",
    mobile: "",
    whatsapp: "",
    qualification: "",
    email: "",
    hospitalName: "",
    hospitalAddress: "",
    hospitalPinCode: "",
    regLicenseNo: "",
    hospitalPan: "",
    contactNo: "",
    hospitalWhastApp: "",
    hospitalEmail: "",
  }]);
  
  const [linkSpouses, setLinkSpouses] = useState(false);
  
  const [mainFormData, setMainFormData] = useState({
    mlId: "",
    date: new Date().toISOString().split('T')[0],
    status: "cold",
    followUpDate: "",
    remarks: "",
    hospitalType: "Hospital",
    numberOfBeds: "",
    yearOfEstablishment: "",
    ownershipType: "Private",
    medicalSuperintendentName: "",
    adminOfficerName: "",
    directorContactNo: "",
    doctorType: "individual",
    // Hospital fields
    hospitalName: "",
    hospitalAddress: "",
    hospitalPinCode: "",
    regLicenseNo: "",
    hospitalPan: "",
    contactNo: "",
    hospitalWhastApp: "",
    hospitalEmail: "",
  });

  // Store original doctor IDs for handling updates
  const [originalDoctorIds, setOriginalDoctorIds] = useState([]);
  const [originalDoctorData, setOriginalDoctorData] = useState([]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
        
        if (response.data.success) {
          const doctorData = response.data.data;
          const mainDoctor = doctorData.mainDoctor || doctorData;
          
          // Handle linked/spouse doctors
          let doctorsList = [];
          let doctorIds = [];
          let doctorDataList = [];
          
          if (doctorData.isLinked) {
            doctorsList = [doctorData.mainDoctor, doctorData.linkedDoctor];
            doctorIds = [
              doctorData.mainDoctor?._id,
              doctorData.linkedDoctor?._id
            ];
            doctorDataList = [doctorData.mainDoctor, doctorData.linkedDoctor];
            setLinkSpouses(true);
          } else {
            doctorsList = [doctorData];
            doctorIds = [doctorData._id];
            doctorDataList = [doctorData];
          }

          setOriginalDoctorIds(doctorIds);
          setOriginalDoctorData(doctorDataList);

          // Determine membership type from doctorType
          let membershipTypeValue = "Individual";
          if (mainDoctor.doctorType === "hospital") {
            membershipTypeValue = "Hospital";
          } else if (mainDoctor.doctorType === "hospital_individual") {
            membershipTypeValue = "Hospital + Individual";
          } else {
            membershipTypeValue = "Individual";
          }
          
          setMembershipType(membershipTypeValue);

          // Map doctors data to salesman form structure
          const mappedDoctors = doctorsList.map(doctor => ({
            doctorName: doctor.fullName || "",
            specialty: Array.isArray(doctor.specialization) 
              ? doctor.specialization.join(", ") 
              : doctor.specialization || "",
            mobile: doctor.phoneNumber || "",
            whatsapp: doctor.whatsappNumber || "",
            qualification: doctor.qualification || "",
            email: doctor.email || "",
            hospitalName: doctor.hospitalName || "",
            hospitalAddress: doctor.hospitalAddress?.address || "",
            hospitalPinCode: doctor.hospitalAddress?.pinCode || "",
            regLicenseNo: doctor.licenseNumber || "",
            hospitalPan: doctor.hospitalDetails?.hospitalPanNumber || "",
            contactNo: doctor.contactDetails?.phoneNumber || "",
            hospitalWhastApp: doctor.contactDetails?.whatsapp || "",
            hospitalEmail: doctor.contactDetails?.emailId || "",
          }));

          setDoctors(mappedDoctors);

          // Set main form data
          setMainFormData({
            mlId: mainDoctor.membershipId || "",
            date: mainDoctor.createdAt 
              ? new Date(mainDoctor.createdAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            status: mainDoctor.doctorStatus || "cold",
            followUpDate: mainDoctor.followUps?.[0]?.date 
              ? new Date(mainDoctor.followUps[0].date).toISOString().split('T')[0]
              : "",
            remarks: mainDoctor.remarks || "",
            hospitalType: mainDoctor.hospitalDetails?.hospitalType || "Hospital",
            numberOfBeds: mainDoctor.hospitalDetails?.beds || "",
            yearOfEstablishment: mainDoctor.hospitalDetails?.establishmentYear || "",
            ownershipType: mainDoctor.hospitalDetails?.ownershipType || "Private",
            medicalSuperintendentName: mainDoctor.hospitalDetails?.director?.name || "",
            adminOfficerName: mainDoctor.hospitalDetails?.admin?.name || "",
            directorContactNo: mainDoctor.hospitalDetails?.director?.contact || "",
            doctorType: mainDoctor.doctorType || "individual",
            // Hospital fields
            hospitalName: mainDoctor.hospitalName || "",
            hospitalAddress: mainDoctor.hospitalAddress?.address || "",
            hospitalPinCode: mainDoctor.hospitalAddress?.pinCode || "",
            regLicenseNo: mainDoctor.licenseNumber || "",
            hospitalPan: mainDoctor.hospitalDetails?.hospitalPanNumber || "",
            contactNo: mainDoctor.contactDetails?.phoneNumber || "",
            hospitalWhastApp: mainDoctor.contactDetails?.whatsapp || "",
            hospitalEmail: mainDoctor.contactDetails?.emailId || "",
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

  const handleMainFormDataChange = (e, field) => {
    let value = e.target.value;

    // List of fields that should NOT be uppercased
    const excludeFromUppercase = [
      'email', 'hospitalEmail', 'followUpDate', 'date',
      'status', 'hospitalType', 'ownershipType', 'doctorType'
    ];

    if (!excludeFromUppercase.includes(field)) {
      value = value.toUpperCase();
    }

    setMainFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDoctorChange = (index, field, value) => {
    // Apply uppercase for text fields
    if (['doctorName', 'specialty', 'qualification', 'hospitalName', 'hospitalAddress', 'regLicenseNo', 'hospitalPan'].includes(field)) {
      value = value.toUpperCase();
    }

    const updatedDoctors = [...doctors];
    updatedDoctors[index] = {
      ...updatedDoctors[index],
      [field]: value
    };
    setDoctors(updatedDoctors);
  };

  const handleAddDoctor = () => {
    setDoctors([...doctors, {
      doctorName: "",
      specialty: "",
      mobile: "",
      whatsapp: "",
      qualification: "",
      email: "",
      hospitalName: "",
      hospitalAddress: "",
      hospitalPinCode: "",
      regLicenseNo: "",
      hospitalPan: "",
      contactNo: "",
      hospitalWhastApp: "",
      hospitalEmail: "",
    }]);
  };

  const handleRemoveDoctor = (index) => {
    if (index > 0) {
      const updatedDoctors = [...doctors];
      updatedDoctors.splice(index, 1);
      setDoctors(updatedDoctors);
      
      if (updatedDoctors.length < 2) {
        setLinkSpouses(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare hospital details based on membership type
      const getHospitalDetails = () => {
        if (membershipType === "Hospital + Individual" || membershipType === "Individual") {
          return {
            hospitalType: mainFormData.hospitalType || "Hospital",
            beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
            establishmentYear: mainFormData.yearOfEstablishment || "",
            website: "",
            ownershipType: mainFormData.ownershipType || "Private",
            director: {
              name: mainFormData.medicalSuperintendentName || "",
              contact: mainFormData.directorContactNo || "",
              email: ""
            },
            admin: {
              name: mainFormData.adminOfficerName || "",
              contact: "",
              email: ""
            },
            departments: [],
            hospitalPanNumber: mainFormData.hospitalPan || ""
          };
        }
        return {
          hospitalPanNumber: mainFormData.hospitalPan || ""
        };
      };

      // Process each doctor like in Add form
      const updatedDoctors = [];

      for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];

        const doctorData = {
          // Basic Info
          fullName: doctor.doctorName,
          email: doctor.email?.toLowerCase() || "",
          phoneNumber: doctor.mobile || "",
          whatsappNumber: doctor.whatsapp || "",

          // Professional Info
          specialization: doctor.specialty ? doctor.specialty.split(',').map(s => s.trim()) : [],
          qualification: doctor.qualification || "",
          licenseNumber: doctor.regLicenseNo || "",

          // Hospital Info - Hospital + Individual ke liye mainFormData se lein
          hospitalName: membershipType === "Hospital + Individual" ?
            (mainFormData.hospitalName || doctor.hospitalName) :
            (doctor.hospitalName || mainFormData.hospitalName || ""),

          hospitalAddress: {
            address: membershipType === "Hospital + Individual" ?
              (mainFormData.hospitalAddress || doctor.hospitalAddress || "") :
              (doctor.hospitalAddress || mainFormData.hospitalAddress || ""),
            city: "",
            state: "",
            district: "",
            taluka: "",
            pinCode: membershipType === "Hospital + Individual" ?
              (mainFormData.hospitalPinCode || doctor.hospitalPinCode || "") :
              (doctor.hospitalPinCode || mainFormData.hospitalPinCode || ""),
            country: "India"
          },

          // Contact Details
          contactDetails: {
            phoneNumber: doctor.mobile || "",
            whatsapp: doctor.whatsapp || "",
            emailId: doctor.email?.toLowerCase() || "",
            currentAddress: {
              address: "",
              pinCode: "",
              city: "",
              state: "",
              district: "",
              taluka: "",
              country: "India"
            }
          },

          // Status
          doctorStatus: mainFormData.status.toLowerCase(),
          typeOfEnquiry: (function (s) {
            const map = {
              hot: 'hot', warm: 'hot', cold: 'cold',
              follow_up: 'follow_up', close: 'closed',
              converted: 'closed', lost: 'cancel'
            };
            return map[s] || 'cold';
          })(mainFormData.status.toLowerCase()),
          status: "pending",
          doctorType: membershipType === "Hospital" ? "hospital" : 
                     membershipType === "Hospital + Individual" ? "hospital_individual" : 
                     "individual",

          // Hospital Details
          hospitalDetails: getHospitalDetails(),

          // Follow-ups - Only include if there's a follow-up date
          followUps: mainFormData.followUpDate ? [{
            date: new Date(mainFormData.followUpDate),
            type: 'call',
            notes: mainFormData.remarks || 'Scheduled follow-up',
            nextFollowUpDate: new Date(mainFormData.followUpDate),
            createdAt: new Date()
          }] : [],

          // Remarks
          remarks: mainFormData.remarks || "",

          // Membership Info
          membershipType: membershipType
        };

        // IMPORTANT: Add membershipId only for main doctor (i === 0)
        if (i === 0) {
          doctorData.membershipId = mainFormData.mlId || undefined;
        }

        // For existing doctors, use UPDATE API
        if (originalDoctorIds[i]) {
          // Update existing doctor
          const response = await apiClient.put(
            apiEndpoints.doctors.updatesalesman(originalDoctorIds[i]), 
            doctorData
          );
          
          if (response.data.success) {
            updatedDoctors.push({
              _id: originalDoctorIds[i],
              ...response.data.data
            });
            toast.success(`Doctor ${i+1} updated successfully`);
          } else {
            throw new Error(response.data.message || `Failed to update doctor ${i+1}`);
          }
        } 
        // For new doctors (like added spouse), use CREATE API
        else if (i > 0) {
          // IMPORTANT: Remove membershipId for new spouse doctor to avoid duplicate
          delete doctorData.membershipId;
          
          // Create new spouse doctor
          const response = await apiClient.post(
            apiEndpoints.salesman.addDoctor, 
            doctorData
          );
          
          if (response.data.success) {
            updatedDoctors.push(response.data.data);
            toast.success(`New spouse doctor created successfully`);
          } else {
            throw new Error(response.data.message || "Failed to create spouse doctor");
          }
        }
      }

      // Handle spouse linking/unlinking
      if (doctors.length === 2 && linkSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
        const doctor1Id = updatedDoctors[0]?._id || originalDoctorIds[0];
        const doctor2Id = updatedDoctors[1]?._id || originalDoctorIds[1];

        if (doctor1Id && doctor2Id) {
          try {
            // Update both doctors with spouse linking
            await apiClient.put(apiEndpoints.doctors.updatesalesman(doctor1Id), {
              linkedDoctorId: doctor2Id,
              relationshipType: 'spouse'
            });

            await apiClient.put(apiEndpoints.doctors.updatesalesman(doctor2Id), {
              linkedDoctorId: doctor1Id,
              relationshipType: 'spouse'
            });

            toast.success("Doctors linked as spouses successfully!");
          } catch (spouseError) {
            console.error("Spouse linking failed:", spouseError);
            toast.error("Spouse linking failed. Please try again.");
          }
        }
      } 
      // Handle UNLINKING if previously linked but now checkbox unchecked
      else if (originalDoctorIds.length > 1 && !linkSpouses) {
        try {
          // Unlink main doctor
          await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[0]), {
            linkedDoctorId: null,
            relationshipType: null
          });
          
          // Unlink spouse doctor if exists
          if (originalDoctorIds[1]) {
            await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[1]), {
              linkedDoctorId: null,
              relationshipType: null
            });
          }
          
          toast.info("Doctors unlinked successfully!");
        } catch (unlinkError) {
          console.error("Unlinking failed:", unlinkError);
          toast.info("Doctors updated! (Unlinking failed)");
        }
      }

      // If user removed spouse doctor from UI
      if (originalDoctorIds.length > 1 && doctors.length === 1) {
        try {
          // Unlink main doctor
          await apiClient.put(apiEndpoints.doctors.updatesalesman(originalDoctorIds[0]), {
            linkedDoctorId: null,
            relationshipType: null
          });
          
          // Optionally, you can delete the removed spouse doctor
          // Uncomment if you want to delete removed spouse
          /*
          await apiClient.delete(apiEndpoints.doctors.delete(originalDoctorIds[1]));
          toast.info("Spouse doctor removed and unlinked");
          */
          
          toast.info("Spouse doctor unlinked successfully");
        } catch (removeError) {
          console.error("Error removing spouse:", removeError);
        }
      }

      toast.success("Doctor details updated successfully!");
      
      // Navigate based on user type
      if (window.location.pathname.includes('/telecaller/')) {
        navigate('/telecaller/doctor-list');
      } else {
        navigate(`/view-doctor/${id}`);
      }

    } catch (error) {
      console.error("Error updating doctor:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      
      // Handle duplicate membershipId error specifically
      if (errorMessage.includes('duplicate key') && errorMessage.includes('membershipId')) {
        toast.error("Membership ID already exists. Please use a different one for spouse doctor.");
      } else {
        toast.error("Error updating doctor: " + errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  // ================= RENDER FUNCTIONS =================

  // Reusable Doctor Block
  const renderDoctorBlock = (index) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200 relative">
      {index > 0 && (
        <button
          onClick={() => handleRemoveDoctor(index)}
          className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
        >
          ×
        </button>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {doctors.length > 1 ? `Doctor ${index + 1} Details` : 'Doctor Details'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
          <input
            type="text"
            placeholder="Enter Doctor Name"
            value={doctors[index]?.doctorName || ""}
            onChange={(e) => handleDoctorChange(index, 'doctorName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
          <input
            type="text"
            placeholder="Enter Specialty"
            value={doctors[index]?.specialty || ""}
            onChange={(e) => handleDoctorChange(index, 'specialty', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
          <input
            type="tel"
            placeholder="Enter Mobile No"
            value={doctors[index]?.mobile || ""}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                handleDoctorChange(index, "mobile", e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
          <input
            type="tel"
            placeholder="Enter WhatsApp No"
            value={doctors[index]?.whatsapp || ""}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                handleDoctorChange(index, "whatsapp", e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
          <input
            type="text"
            placeholder="Qualification"
            value={doctors[index]?.qualification || ""}
            onChange={(e) => handleDoctorChange(index, 'qualification', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
          <input
            type="email"
            placeholder="Email"
            value={doctors[index]?.email || ""}
            onChange={(e) => handleDoctorChange(index, 'email', e.target.value.toLowerCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none lowercase"
          />
        </div>
       
      </div>

      {/* Hospital Details for Individual membership type - ONLY for Individual type */}
      {membershipType === "Individual" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4">Hospital/Clinic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                placeholder="Enter Hospital Name"
                value={doctors[index]?.hospitalName || ""}
                onChange={(e) => handleDoctorChange(index, 'hospitalName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
              <input
                type="text"
                placeholder="Enter Hospital Address"
                value={doctors[index]?.hospitalAddress || ""}
                onChange={(e) => handleDoctorChange(index, 'hospitalAddress', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
              <input
                type="text"
                placeholder="6-digit Pin Code"
                value={doctors[index]?.hospitalPinCode || ""}
                onChange={(e) => {
                  if (e.target.value.length <= 6) {
                    handleDoctorChange(index, "hospitalPinCode", e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Button to add spouse doctor */}
      {index === 0 && (membershipType === "Individual" || membershipType === "Hospital + Individual") && doctors.length < 2 && (
        <button
          onClick={handleAddDoctor}
          className="mt-6 px-5 py-2 font-medium rounded-md hover:transition flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
        >
          <span className="text-xl">+</span> Add Spouse Doctor
        </button>
      )}
    </div>
  );

  const renderFullHospitalForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input
              type="text"
              placeholder="Enter Hospital Name"
              value={mainFormData.hospitalName || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
            <select
              value={mainFormData.hospitalType}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="Maternity Home">Maternity Home</option>
              <option value="Clinic">Clinic</option>
              <option value="Hospital">Hospital</option>
              <option value="General Hospital">General Hospital</option>
              <option value="Multispeciality Hospital">Multispeciality Hospital</option>
              <option value="Super-Speciality Hospital">Super-Speciality Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
            <input
              type="text"
              placeholder="No. of Beds"
              value={mainFormData.numberOfBeds || ""}
              onChange={(e) => handleMainFormDataChange(e, 'numberOfBeds')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
            <input
              type="tel"
              placeholder="Contact No"
              value={mainFormData.contactNo || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "contactNo");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="tel"
              placeholder="WhatsApp"
              value={mainFormData.hospitalWhastApp || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "hospitalWhastApp");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              placeholder="Address"
              value={mainFormData.hospitalAddress || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalAddress')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
            <input
              type="text"
              placeholder="6-digit Pin Code"
              value={mainFormData.hospitalPinCode || ""}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  handleMainFormDataChange(e, "hospitalPinCode");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={mainFormData.hospitalEmail || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalEmail')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
            <input
              type="text"
              placeholder="Admin / Mgmt Officer Name"
              value={mainFormData.adminOfficerName || ""}
              onChange={(e) => handleMainFormDataChange(e, 'adminOfficerName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Contact No</label>
            <input
              type="tel"
              placeholder="Admin Contact No"
              value={mainFormData.directorContactNo || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "directorContactNo");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
            <input
              type="text"
              placeholder="Year of Establishment"
              value={mainFormData.yearOfEstablishment || ""}
              onChange={(e) => handleMainFormDataChange(e, 'yearOfEstablishment')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital PAN</label>
            <input
              type="text"
              placeholder="Hospital PAN"
              value={mainFormData.hospitalPan || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalPan')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none uppercase"
            />
          </div> */}
        </div>
      </div>
    );
  };

  // ================= MAIN RENDER =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading doctor details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-lato">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Doctor</h1>
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
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MLID</label>
            <input
              type="text"
              placeholder="Enter Membership ID"
              value={mainFormData.mlId}
              onChange={(e) => handleMainFormDataChange(e, 'mlId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <DateInput
            label="Date"
            value={mainFormData.date}
            onChange={(v) => setMainFormData(prev => ({ ...prev, date: v }))}
            returnFormat='yyyy-mm-dd'
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Membership</label>
            <select
              value={membershipType}
              onChange={(e) => {
                const newType = e.target.value;
                setMembershipType(newType);
                
                // Update doctorType in mainFormData
                const doctorTypeMap = {
                  "Individual": "individual",
                  "Hospital": "hospital",
                  "Hospital + Individual": "hospital_individual"
                };
                
                setMainFormData(prev => ({ 
                  ...prev, 
                  doctorType: doctorTypeMap[newType] || "individual" 
                }));
                
                // Reset spouse linking if needed
                if (newType === "Hospital") {
                  setLinkSpouses(false);
                  // If switching to Hospital, we might need to adjust doctors array
                  if (doctors.length > 1) {
                    setDoctors([doctors[0]]);
                  }
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-teal-700 font-medium"
            >
              <option value="Individual">Individual</option>
              <option value="Hospital">Hospital</option>
              <option value="Hospital + Individual">Hospital + Individual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Based on Membership Type */}
      {membershipType === "Individual" && (
        <>
          {doctors.map((_, i) => renderDoctorBlock(i))}
        </>
      )}

      {membershipType === "Hospital" && (
        <>
          {renderFullHospitalForm()}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-700">
                Hospital type membership - Doctor details are managed within hospital information
              </span>
            </div>
          </div>
        </>
      )}

      {membershipType === "Hospital + Individual" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Hospital + Individual Membership</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>• Fill hospital details below - they will be shared with all doctors</p>
                  <p>• Add individual doctor details above</p>
                  <p>• Hospital information will be automatically applied to all doctors</p>
                </div>
              </div>
            </div>
          </div>
          {doctors.map((_, i) => renderDoctorBlock(i))}
          {renderFullHospitalForm()}
        </>
      )}

      {/* Spouse Linking Checkbox */}
      {(membershipType === "Individual" || membershipType === "Hospital + Individual") && doctors.length === 2 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="linkSpouses"
              checked={linkSpouses}
              onChange={(e) => setLinkSpouses(e.target.checked)}
              className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="linkSpouses" className="ml-3 block text-sm text-gray-700 flex-1">
              <span className="font-medium">Link these doctors as spouses</span> - Combine names on bills (e.g., "Raju & Sunita")
            </label>
          </div>
        </div>
      )}

      {/* Status & Follow-up Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Follow-up</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={mainFormData.status}
              onChange={(e) => handleMainFormDataChange(e, 'status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="close">Close</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
              <option value="follow_up">Follow Up</option>
            </select>
          </div>
          <DateInput
            label="Follow-up Date"
            value={mainFormData.followUpDate}
            onChange={(v) => setMainFormData(prev => ({ ...prev, followUpDate: v }))}
            returnFormat='yyyy-mm-dd'
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
            <textarea
              rows={3}
              placeholder="Enter remarks here..."
              value={mainFormData.remarks}
              onChange={(e) => handleMainFormDataChange(e, 'remarks')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(`/view-doctor/${id}`)}
          className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 text-white font-medium rounded-md transition ${saving ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={() => navigate("/telecaller/add/quotation", {
            state: {
              doctorId: id,
              from: "edit-doctor"
            }
          })}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Give Quote
        </button>
      </div>
    </div>
  );
};

export default EditDoctorSalesman;