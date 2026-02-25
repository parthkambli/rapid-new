// import React, { useState } from 'react';

// const AddNewDoctor = () => {
//   const [formData, setFormData] = useState({
//     doctorName: '',
//     qualification: '',
//     specialization: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     hospitalName: '',
//     hospitalAddress: '',
//     mobileNo: '',
//     email: '',
//     inquireType: 'Hot',
//     nextVisitDate: '',
//     date: '20-09-2025',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Add your submit logic here
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Add New Doctor</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Doctor Name:</label>
//           <input
//             type="text"
//             name="doctorName"
//             value={formData.doctorName}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Qualification:</label>
//           <input
//             type="text"
//             name="qualification"
//             value={formData.qualification}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Specialization:</label>
//           <input
//             type="text"
//             name="specialization"
//             value={formData.specialization}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4 flex items-center">
//           <button
//             type="button"
//             className="px-4 py-2 bg-[#216267] text-white rounded-md hover:bg-[#1a4d4f] focus:outline-none"
//           >
//             Add +
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Membership Type:</label>
//           <div className="mt-2 space-y-2">
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="membershipType"
//                 value="INDIVIDUAL MEMBERSHIP"
//                 checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP'}
//                 onChange={handleChange}
//                 className="form-radio text-blue-600 focus:ring-blue-500"
//               />
//               <span className="ml-2">INDIVIDUAL MEMBERSHIP</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="membershipType"
//                 value="INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP"
//                 checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP'}
//                 onChange={handleChange}
//                 className="form-radio text-blue-600 focus:ring-blue-500"
//               />
//               <span className="ml-2">INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="membershipType"
//                 value="HOSPITAL MEMBERSHIP"
//                 checked={formData.membershipType === 'HOSPITAL MEMBERSHIP'}
//                 onChange={handleChange}
//                 className="form-radio text-blue-600 focus:ring-blue-500"
//               />
//               <span className="ml-2">HOSPITAL MEMBERSHIP</span>
//             </label>
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Hospital Name:</label>
//           <input
//             type="text"
//             name="hospitalName"
//             value={formData.hospitalName}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Hospital Address:</label>
//           <input
//             type="text"
//             name="hospitalAddress"
//             value={formData.hospitalAddress}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Mobile No :</label>
//           <input
//             type="text"
//             name="mobileNo"
//             value={formData.mobileNo}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Email :</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Inquire Type:</label>
//           <select
//             name="inquireType"
//             value={formData.inquireType}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="Hot">Hot</option>
//             <option value="Warm">Warm</option>
//             <option value="Cold">Cold</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Next Visit Date :</label>
//           <input
//             type="text"
//             name="nextVisitDate"
//             value={formData.nextVisitDate}
//             onChange={handleChange}
//             placeholder="(Optional)"
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Date :</label>
//           <input
//             type="text"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="mt-1 p-2 w-full border rounded-md bg-[#CDFFFD69] focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddNewDoctor;

























// import React, { useState } from 'react';
// import { Calendar, ChevronDown } from 'lucide-react';

// const AddNewDoctor = () => {
//   const [formData, setFormData] = useState({
//     doctorName: '',
//     qualification: '',
//     specialization: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     hospitalName: '',
//     hospitalAddress: '',
//     mobileNo: '',
//     email: '',
//     inquireType: 'Hot',
//     nextVisitDate: '',
//     date: '20-09-2025',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 mt-10">
//       <div className="max-w-md mx-auto">
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Doctor</h2>
        
//         <div className="space-y-3">
//           {/* Doctor Name */}
//           <div>
//             <label className=" text-xs font-medium text-gray-600 mb-1">Doctor Name:</label>
//             <input
//               type="text"
//               name="doctorName"
//               value={formData.doctorName}
//               onChange={handleChange}
//               className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//             />
//           </div>

//           {/* Qualification */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Qualification:</label>
//             <input
//               type="text"
//               name="qualification"
//               value={formData.qualification}
//               onChange={handleChange}
//               className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//             />
//           </div>

//           {/* Specialization */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Specialization:</label>
//             <input
//               type="text"
//               name="specialization"
//               value={formData.specialization}
//               onChange={handleChange}
//               className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//             />
//           </div>

//           {/* Add Button */}
//           <div className="flex justify-center py-1">
//             <button
//               type="button"
//               className="px-4 py-1 text-xs bg-teal-700 text-white rounded hover:bg-teal-800 focus:outline-none"
//             >
//               Add +
//             </button>
//           </div>

//           {/* Membership Type */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-2">Membership Type:</label>
//             <div className="space-y-1">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="membershipType"
//                   value="INDIVIDUAL MEMBERSHIP"
//                   checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP'}
//                   onChange={handleChange}
//                   className="mr-2 text-teal-600"
//                 />
//                 <span className="text-xs">INDIVIDUAL MEMBERSHIP</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="membershipType"
//                   value="INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP"
//                   checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP'}
//                   onChange={handleChange}
//                   className="mr-2 text-teal-600"
//                 />
//                 <span className="text-xs">INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="membershipType"
//                   value="HOSPITAL MEMBERSHIP"
//                   checked={formData.membershipType === 'HOSPITAL MEMBERSHIP'}
//                   onChange={handleChange}
//                   className="mr-2 text-teal-600"
//                 />
//                 <span className="text-xs">HOSPITAL MEMBERSHIP</span>
//               </label>
//             </div>
//           </div>

//           {/* Hospital Name */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Hospital Name:</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="hospitalName"
//                 value={formData.hospitalName}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//               />
//               <button
//                 type="button"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Hospital Address */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Hospital Address:</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="hospitalAddress"
//                 value={formData.hospitalAddress}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//               />
//               <button
//                 type="button"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Mobile No */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Mobile No :</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="mobileNo"
//                 value={formData.mobileNo}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//               />
//               <button
//                 type="button"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Email :</label>
//             <div className="relative">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//               />
//               <button
//                 type="button"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Inquire Type */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Inquire Type:</label>
//             <div className="relative">
//               <select
//                 name="inquireType"
//                 value={formData.inquireType}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400 appearance-none"
//               >
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//               <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Next Visit Date */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Next Visit Date :</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="nextVisitDate"
//                 value={formData.nextVisitDate}
//                 onChange={handleChange}
//                 placeholder="(Optional)"
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400 placeholder-gray-400"
//               />
//               <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
//             </div>
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Date :</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
//               />
//               <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="pt-4">
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               className="w-full py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewDoctor;




















import React, { useState } from 'react';
import { Calendar, ChevronDown, Edit } from 'lucide-react';

const EditRevisit = () => {
  const [formData, setFormData] = useState({
    doctorName: '',
    qualification: '',
    specialization: '',
    membershipType: 'INDIVIDUAL MEMBERSHIP',
    hospitalName: '',
    hospitalAddress: '',
    mobileNo: '',
    email: '',
    inquireType: 'Hot',
    nextVisitDate: '',
    date: '20-09-2025',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen p-4  pb-8 ">
       <h2 className="text-lg font-semibold mb-4 text-gray-800">Revisit Doctor</h2>
      <div className="max-w-lg mx-auto">
       
        
        <div className="space-y-3">
          {/* Doctor Name */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Doctor Name:</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="flex-1 h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Qualification */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="flex-1 h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Specialization */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="flex-1 h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Add Button */}
          <div className="flex justify-center py-1">
            <button
              type="button"
              className="px-4 py-1 text-xs bg-teal-700 text-white rounded hover:bg-teal-800 focus:outline-none"
            >
              Add +
            </button>
          </div>

          {/* Membership Type */}
          {/* <div >
            <label className="block text-xs font-medium text-gray-600 mb-2">Membership Type:</label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="membershipType"
                  value="INDIVIDUAL MEMBERSHIP"
                  checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP'}
                  onChange={handleChange}
                  className="mr-2 text-teal-600"
                />
                <span className="text-xs">INDIVIDUAL MEMBERSHIP</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="membershipType"
                  value="INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP"
                  checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP'}
                  onChange={handleChange}
                  className="mr-2 text-teal-600"
                />
                <span className="text-xs">INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="membershipType"
                  value="HOSPITAL MEMBERSHIP"
                  checked={formData.membershipType === 'HOSPITAL MEMBERSHIP'}
                  onChange={handleChange}
                  className="mr-2 text-teal-600"
                />
                <span className="text-xs">HOSPITAL MEMBERSHIP</span>
              </label>
            </div>
          </div> */}




    <div className="flex  space-x-2">
  <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Membership Type:</label>
  <div className="flex-1">
    <label className="flex items-center mb-2 border border-gray-200 rounded bg-cyan-50 py-2 pl-1">
      <input
        type="radio"
        name="membershipType"
        value="INDIVIDUAL MEMBERSHIP"
        checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP'}
        onChange={handleChange}
        className="mr-2 text-teal-600 focus:ring-teal-500"
      />
      <span className="text-xs">INDIVIDUAL MEMBERSHIP</span>
    </label>
    <label className="flex items-center mb-2 border border-gray-200 rounded bg-cyan-50 py-2 pl-1">
      <input
        type="radio"
        name="membershipType"
        value="INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP"
        checked={formData.membershipType === 'INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP'}
        onChange={handleChange}
        className="mr-2 text-teal-600 focus:ring-teal-500"
      />
      <span className="text-xs">INDIVIDUAL MEMBERSHIP + HOSPITAL MEMBERSHIP</span>
    </label>
    <label className="flex items-center border border-gray-200 rounded bg-cyan-50 py-2 pl-1">
      <input
        type="radio"
        name="membershipType"
        value="HOSPITAL MEMBERSHIP"
        checked={formData.membershipType === 'HOSPITAL MEMBERSHIP'}
        onChange={handleChange}
        className="mr-2 text-teal-600 focus:ring-teal-500"
      />
      <span className="text-xs">HOSPITAL MEMBERSHIP</span>
    </label>
  </div>
</div>

          {/* Hospital Name */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Hospital Name:</label>
            <div className="relative flex-1">
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Hospital Address */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Hospital Address:</label>
            <div className="relative flex-1">
              <input
                type="text"
                name="hospitalAddress"
                value={formData.hospitalAddress}
                onChange={handleChange}
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Mobile No */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Mobile No :</label>
            <div className="relative flex-1">
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Email :</label>
            <div className="relative flex-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Inquire Type */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Inquire Type:</label>
            <div className="relative flex-1">
              <select
                name="inquireType"
                value={formData.inquireType}
                onChange={handleChange}
                className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400 appearance-none"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Next Visit Date */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Next Visit Date :</label>
            <div className="relative flex-1">
              <input
                type="text"
                name="nextVisitDate"
                value={formData.nextVisitDate}
                onChange={handleChange}
                placeholder="(Optional)"
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400 placeholder-gray-400"
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">Date :</label>
            <div className="relative flex-1">
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full h-8 px-2 pr-8 text-sm border border-gray-200 rounded bg-cyan-50 focus:outline-none focus:border-cyan-400"
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRevisit;