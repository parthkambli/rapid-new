// import React from 'react';
// import { Calendar, Check, Printer, X } from 'lucide-react';

// export default function DoctorDetailPage() {
//   const [activeTab, setActiveTab] = React.useState('Overview');

//   const tabs = [
//     "Overview",
//     "Sales Bill",
//     "Receipts",
//     "Quotations",
//     "Policies",
//     "Inquiries / Follow-ups"
//   ];

//   return (
//     <div className="min-h-screen  p-6">
//       <h1 className='text-2xl mb-2'>Doctor Report</h1>

//       {/* Filter Section */}
//     <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//         {/* Row 1 */}
//         <div className="grid grid-cols-5 gap-3 mb-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By Dr</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>All</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Sort by Status</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>Hot</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Sort by Date</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="To Date"
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1 opacity-0">.</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="From Date"
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Sort by Membership</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>Hospital</option>
//             </select>
//           </div>
//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-5 gap-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By City</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By Employee</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>Salesmen</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By Speciality</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>Dental</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By Month</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>March</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search By Year</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
//               <option>2026</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Monthly/Yearly Toggle + Buttons */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-4">
//           <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded text-sm font-medium">
//             <input type="radio" name="period" defaultChecked className="w-4 h-4" />
//             <span>Monthly</span>
//           </button>
//           <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
//             <input type="radio" name="period" className="w-4 h-4" />
//             <span>Yearly</span>
//           </button>
//         </div>
//         <div className="flex gap-2">
//           <button className="px-6 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50">
//             Reset
//           </button>
//           <button className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800">
//             View
//           </button>
//         </div>
//       </div>

//       {/* Doctor Card */}
//       <div className="bg-white rounded-lg shadow-sm">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//           <div>
//             <h1 className="text-lg font-bold text-gray-900">
//               Dr. Ram Kumar <span className="font-normal text-gray-600">City Hospital • Vasai</span>
//             </h1>
//           </div>
//           <div className="flex gap-2">
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50">
//               Print
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800">
//               Close
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex px-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-blue-500 text-gray-900'
//                     : 'border-transparent text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="px-6 py-6">
//           {/* Doctor Details */}
//           <div className="flex gap-12 mb-6">
//             <div>
//               <div className="text-sm text-gray-600">Doctor ID</div>
//               <div className="text-sm text-gray-900">D001</div>
//             </div>
//             <div>
//               <div className="text-sm text-gray-600">Specialty</div>
//               <div className="text-sm text-gray-900">Dental</div>
//             </div>
//             <div>
//               <div className="text-sm text-gray-600">Membership</div>
//               <div className="text-sm text-gray-900">Hospital</div>
//             </div>
//           </div>

//           {/* Recent Notes and Quick Summary */}
//           <div className="grid grid-cols-2 gap-8">
//             {/* Recent Notes */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Notes</h3>
//               <div className="bg-gray-50 p-4 rounded space-y-4">
//                 <div>
//                   <div className="text-sm text-gray-900">
//                     2025-09-12 10:20 — Telecaller
//                   </div>
//                   <div className="text-sm text-gray-900">
//                     Called — interested
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-900">
//                     2025-09-15 11:00 — Salesman
//                   </div>
//                   <div className="text-sm text-gray-900">
//                     Follow-up meeting scheduled
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Summary */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Summary</h3>
//               <div className="bg-[#E8EFEF] p-4 rounded space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-900">Total Sales</span>
//                   <span className="text-gray-900">17000</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-900">Total Receipts</span>
//                   <span className="text-gray-900">17000</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-900">Quotations</span>
//                   <span className="text-gray-900">2</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-900">Policies</span>
//                   <span className="text-gray-900">1</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/DoctorDetailPage.jsx
// import React from 'react';
// import FiltersSection from './FiltersSection';
// import DoctorHeader from './DoctorHeader';
// import { Check } from 'lucide-react';
// import { Outlet } from 'react-router-dom'; // ← Import

// export default function DoctorDetailPage() {
//   return (
//     <div className="min-h-screen p-6">
//       <h1 className='text-2xl mb-2'>Doctor Report</h1>

//       <FiltersSection />

//       {/* Monthly/Yearly + Buttons */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-4">
//           <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded text-sm font-medium">
//             <input type="radio" name="period" defaultChecked className="w-4 h-4" />
//             <span>Monthly</span>
//           </button>
//           <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
//             <input type="radio" name="period" className="w-4 h-4" />
//             <span>Yearly</span>
//           </button>
//         </div>
//         <div className="flex gap-2">
//           <button className="px-6 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50">
//             Reset
//           </button>
//           <button className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800">
//             View
//           </button>
//         </div>
//       </div>

//       <DoctorHeader />

//       {/* Content */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//         <div className="flex gap-12 mb-6">
//           <div>
//             <div className="text-sm text-gray-600">Doctor ID</div>
//             <div className="text-sm text-gray-900">D001</div>
//           </div>
//           <div>
//             <div className="text-sm text-gray-600">Specialty</div>
//             <div className="text-sm text-gray-900">Dental</div>
//           </div>
//           <div>
//             <div className="text-sm text-gray-600">Membership</div>
//             <div className="text-sm text-gray-900">Hospital</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-8">
//           {/* Recent Notes */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Notes</h3>
//             <div className="bg-gray-50 p-4 rounded space-y-4">
//               <div>
//                 <div className="text-sm text-gray-900 flex items-center gap-2">
//                   <Check className="h-4 w-4 text-green-600" />
//                   2025-09-12 10:20 — Telecaller
//                 </div>
//                 <div className="text-sm text-gray-600 ml-6">Called — interested</div>
//               </div>
//               <div>
//                 <div className="text-sm text-gray-900 flex items-center gap-2">
//                   <Check className="h-4 w-4 text-green-600" />
//                   2025-09-15 11:00 — Salesman
//                 </div>
//                 <div className="text-sm text-gray-600 ml-6">Follow-up meeting scheduled</div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Summary */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Summary</h3>
//             <div className="bg-[#E8EFEF] p-4 rounded space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-900">Total Sales</span>
//                 <span className="text-gray-900">17000</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-900">Total Receipts</span>
//                 <span className="text-gray-900">17000</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-900">Quotations</span>
//                 <span className="text-gray-900">2</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-900">Policies</span>
//                 <span className="text-gray-900">1</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// src/pages/DoctorDetailPage.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import DoctorHeader from "./DoctorHeader"; // adjust path if different

export default function DoctorDetailPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-2">Doctor Report</h1>

      <DoctorHeader />

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
