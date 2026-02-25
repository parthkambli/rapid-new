// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const RevisitForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // === Form State ===
//   const [mId, setMId] = useState("M-2025-0917-001");
//   const [date, setDate] = useState("17-09-2025");
//   const [membershipType, setMembershipType] = useState("Individual + Hospital");

//   const [doctorName, setDoctorName] = useState("Dr. Amit Sharma");
//   const [specialty, setSpecialty] = useState("Cardiology");
//   const [qualification, setQualification] = useState("MD (Medicine), DM (Cardio)");
//   const [mobile, setMobile] = useState("9876543210");
//   const [email, setEmail] = useState("dr.amit@metrohospital.in");

//   const [hospitalName, setHospitalName] = useState("Metro Heart & Multi-Specialty Hospital");
//   const [hospitalType, setHospitalType] = useState("Multi-Specialty");
//   const [pinCode, setPinCode] = useState("411045");
//   const [address, setAddress] = useState("Plot 12, River Road, Kalyani Nagar, Pune, Maharashtra");
//   const [regNo, setRegNo] = useState("MH/CLN/2021/00887");
//   const [yearOfEstablishment, setYearOfEstablishment] = useState("2012");

//   const [status, setStatus] = useState("Warm");
//   const [followUpDate, setFollowUpDate] = useState("21-09-2025");
//   const [narration, setNarration] = useState("Sent quotation on 17/09/2025. Asked to share last year policy & payment preference.");

//   // === Follow-up Rows ===
//   const [followUps, setFollowUps] = useState([
//     {
//       id: 1,
//       date: "10-09-2025",
//       status: "Pending",
//       note: "First call done. Interested in renewal.",
//     },
//     {
//       id: 2,
//       date: "15-09-2025",
//       status: "Completed",
//       note: "Quotation mailed. Waiting for confirmation.",
//     },
//   ]);

//   const addFollowUpRow = () => {
//     setFollowUps([
//       ...followUps,
//       {
//         id: Date.now(),
//         date: "",
//         status: "Pending",
//         note: "",
//       },
//     ]);
//   };

//   const removeFollowUp = (id) => {
//     setFollowUps(followUps.filter((f) => f.id !== id));
//   };

//   const updateFollowUp = (id, field, value) => {
//     setFollowUps(
//       followUps.map((f) => (f.id === id ? { ...f, [field]: value } : f))
//     );
//   };

//   const handleSave = () => {
//     alert("Revisit data saved!");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleGiveQuote = () => {
//     alert("Quote generated!");
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-6">
//         {/* Header */}
//         <h1 className="text-2xl font-bold text-gray-800">Revisited Update</h1>

//         {/* Membership & Header */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold text-teal-700 mb-3">Membership & Header</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">M.I.D</label>
//               <input
//                 type="text"
//                 value={mId}
//                 onChange={(e) => setMId(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
//               <input
//                 type="text"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Type of Membership</label>
//               <select
//                 value={membershipType}
//                 onChange={(e) => setMembershipType(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               >
//                 <option>Individual + Hospital</option>
//                 <option>Individual</option>
//                 <option>Hospital</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Doctor Details */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold text-teal-700 mb-3">Doctor Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Name of Doctor</label>
//               <input
//                 type="text"
//                 value={doctorName}
//                 onChange={(e) => setDoctorName(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Specialty</label>
//               <input
//                 type="text"
//                 value={specialty}
//                 onChange={(e) => setSpecialty(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Qualification</label>
//               <input
//                 type="text"
//                 value={qualification}
//                 onChange={(e) => setQualification(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Mobile No</label>
//               <input
//                 type="text"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Email ID</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Hospital Details */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold text-teal-700 mb-3">Hospital Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Hospital Name</label>
//               <input
//                 type="text"
//                 value={hospitalName}
//                 onChange={(e) => setHospitalName(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Type of Hospital</label>
//               <input
//                 type="text"
//                 value={hospitalType}
//                 onChange={(e) => setHospitalType(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Pin Code</label>
//               <input
//                 type="text"
//                 value={pinCode}
//                 onChange={(e) => setPinCode(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div className="md:col-span-3">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
//               <textarea
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 rows={2}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Reg / License No</label>
//               <input
//                 type="text"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Year of Establishment</label>
//               <input
//                 type="text"
//                 value={yearOfEstablishment}
//                 onChange={(e) => setYearOfEstablishment(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Status & Follow-up */}
//         <div className="border-b pb-4">
//           <h2 className="text-lg font-semibold text-teal-700 mb-3">Status & Follow-up</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               >
//                 <option>Warm</option>
//                 <option>Hot</option>
//                 <option>Cold</option>
//                 <option>Closed</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Follow-up Date</label>
//               <input
//                 type="text"
//                 value={followUpDate}
//                 onChange={(e) => setFollowUpDate(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Narration / Remarks</label>
//               <textarea
//                 value={narration}
//                 onChange={(e) => setNarration(e.target.value)}
//                 rows={2}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Revisited Follow-ups Table */}
//         <div>
//           <h2 className="text-lg font-semibold text-teal-700 mb-3">Revisited Follow-ups</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300">Date</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300">Status</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300">Note</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-300"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {followUps.map((f) => (
//                   <tr key={f.id} className="border-b">
//                     <td className="px-4 py-2 border border-gray-300">
//                       <input
//                         type="text"
//                         value={f.date}
//                         onChange={(e) => updateFollowUp(f.id, "date", e.target.value)}
//                         className="w-full p-1 border border-gray-300 rounded"
//                         placeholder="dd-mm-yyyy"
//                       />
//                     </td>
//                     <td className="px-4 py-2 border border-gray-300">
//                       <select
//                         value={f.status}
//                         onChange={(e) => updateFollowUp(f.id, "status", e.target.value)}
//                         className="w-full p-1 border border-gray-300 rounded"
//                       >
//                         <option>Pending</option>
//                         <option>Completed</option>
//                         <option>In Progress</option>
//                       </select>
//                     </td>
//                     <td className="px-4 py-2 border border-gray-300">
//                       <input
//                         type="text"
//                         value={f.note}
//                         onChange={(e) => updateFollowUp(f.id, "note", e.target.value)}
//                         className="w-full p-1 border border-gray-300 rounded"
//                         placeholder="Enter note"
//                       />
//                     </td>
//                     <td className="px-4 py-2 border border-gray-300 text-center">
//                       <button
//                         onClick={() => removeFollowUp(f.id)}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Add Row */}
//           <button
//             onClick={addFollowUpRow}
//             className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-2"
//           >
//             + Add Follow-up Row
//           </button>
//           <p className="text-xs text-gray-500 mt-1">Add any number of revisited follow-ups (date + status + note).</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <button
//             onClick={handleSave}
//             className="bg-teal-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-teal-700"
//           >
//             Save
//           </button>
//           <button
//             onClick={handlePrint}
//             className="bg-gray-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-700"
//           >
//             Print
//           </button>
//           <button
//             onClick={handleGiveQuote}
//             className="bg-orange-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-orange-700"
//           >
//             Give Quote
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RevisitForm;




















import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react"; // npm install lucide-react

const RevisitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // === Static Data (Read-only) ===
  const [mId] = useState("M-2025-0917-001");
  const [date] = useState("17-09-2025");
  const [membershipType] = useState("Individual + Hospital");

  const [doctorName] = useState("Dr. Amit Sharma");
  const [specialty] = useState("Cardiology");
  const [qualification] = useState("MD (Medicine), DM (Cardio)");
  const [mobile] = useState("9876543210");
  const [waNo] = useState("9876543210");
  const [email] = useState("dr.amit@metrohospital.in");

  const [hospitalName] = useState("Metro Heart & Multi-Specialty Hospital");
  const [hospitalType] = useState("Multi-Specialty");
  const [pinCode] = useState("411045");
  const [address] = useState("Plot 12, River Road, Kalyani Nagar, Pune, Maharashtra");
  const [regNo] = useState("MH/CLN/2021/00887");
  const [yearOfEstablishment] = useState("2012");

  const [status] = useState("Warm");
  const [followUpDate] = useState("22-09-2025");
  const [narration] = useState("Sent quotation on 17/09/2025. Asked to share last year policy & payment preference.");

  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      date: "10-09-2025",
      status: "Pending",
      note: "First call done. Interested in renewal.",
    },
    {
      id: 2,
      date: "15-09-2025",
      status: "Completed",
      note: "Quotation mailed. Waiting for confirmation.",
    },
  ]);

  const addFollowUpRow = () => {
    setFollowUps([
      ...followUps,
      { id: Date.now(), date: "", status: "Pending", note: "" },
    ]);
  };

  const removeFollowUp = (id) => {
    setFollowUps(followUps.filter((f) => f.id !== id));
  };

  const updateFollowUp = (id, field, value) => {
    setFollowUps(followUps.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  return (
    <div className="p-6 border rounded-xl min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Revisited Update</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Membership & Header */}
          <div>
            <h2 className="text-lg font-extrabold text-teal-700 mb-4">Membership & Header</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">M.I.D</label>
                <input
                  type="text"
                  value={mId}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Date</label>
                <div className="flex">
                  <input
                    type="text"
                    value={date}
                    readOnly
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-md bg-gray-50 text-sm text-gray-700 focus:outline-none"
                  />
                  <button className="px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Type of Membership</label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none">
                  <option>Individual + Hospital</option>
                  <option>Individual</option>
                  <option>Hospital</option>
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          <div>
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Doctor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Name of Doctor</label>
                <input
                  type="text"
                  value={doctorName}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Mobile No</label>
                <input
                  type="text"
                  value={mobile}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">WA No</label>
                <input
                  type="text"
                  value={waNo}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Email ID</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Hospital Details */}
          <div>
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Hospital Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Type of Hospital</label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                  <option>Multi-Specialty</option>
                  <option>Single-Specialty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={pinCode}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-teal-900 mb-1">Address</label>
                <textarea
                  value={address}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Regi / License No</label>
                <input
                  type="text"
                  value={regNo}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Year of Establishment</label>
                <input
                  type="text"
                  value={yearOfEstablishment}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Status & Follow-up */}
          <div>
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Status & Follow-up</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Status</label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                  <option>Warm</option>
                  <option>Hot</option>
                  <option>Cold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Follow-up Date</label>
                <div className="flex">
                  <input
                    type="text"
                    value={followUpDate}
                    readOnly
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-md bg-gray-50 text-sm text-gray-700"
                  />
                  <button className="px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-teal-900 mb-1">Narration / Remarks</label>
                <textarea
                  value={narration}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Revisited Follow-ups */}
          <div>
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Revisited Follow-ups</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-extrabold text-teal-900 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-extrabold text-teal-900 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-extrabold text-teal-900 uppercase tracking-wider">Note</th>
                    <th className="px-4 py-3 text-center text-xs font-extrabold text-teal-900 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {followUps.map((f) => (
                    <tr key={f.id} className="border-b border-gray-300">
                      <td className="px-4 py-2">
                        <div className="flex">
                          <input
                            type="text"
                            value={f.date}
                            onChange={(e) => updateFollowUp(f.id, "date", e.target.value)}
                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-l-md text-sm"
                            placeholder="dd-mm-yyyy"
                          />
                          <button className="px-2 py-1.5 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50">
                            <Calendar className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={f.status}
                          onChange={(e) => updateFollowUp(f.id, "status", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        >
                          <option>Pending</option>
                          <option>Completed</option>
                          <option>In Progress</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={f.note}
                          onChange={(e) => updateFollowUp(f.id, "note", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                          placeholder="Enter note"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeFollowUp(f.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row */}
            <button
              onClick={addFollowUpRow}
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
            >
              + Add Follow-up Row
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Add any number of revisited follow-ups (date + status + note).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
            <button className="bg-teal-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-teal-700">
              Save
            </button>
            <button className="bg-gray-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-700">
              Print
            </button>
            <button className="bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-orange-700">
              Give Quote
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisitForm;