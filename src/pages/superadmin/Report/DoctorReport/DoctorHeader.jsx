// // src/components/DoctorHeader.jsx
// import React from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { Printer, X } from 'lucide-react';

// const tabs = [
//   { name: "Overview", path: "" },
//   { name: "Sales Bill", path: "sales-bill" },
//   { name: "Receipts", path: "receipts" },
//   { name: "Quotations", path: "quotations" },
//   { name: "Policies", path: "policies" },
//   { name: "Inquiries / Follow-ups", path: "inquiries" },
// ];

// export default function DoctorHeader() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentTab = location.pathname.split('/').pop() || '';

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">
//             Dr. Ram Kumar <span className="font-normal text-gray-600">City Hospital • Vasai</span>
//           </h1>
//         </div>
//         <div className="flex gap-2">
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50">
//             <Printer className="h-4 w-4" /> Print
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800">
//             <X className="h-4 w-4" /> Close
//           </button>
//         </div>
//       </div>

//       <div className="border-b border-gray-200">
//         <div className="flex px-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.name}
//             //   onClick={() => navigate(`/admin/doctors/${id}/${tab.path}`)}
//             onClick={() => navigate(tab.path)}
//               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 currentTab === tab.path || (!currentTab && tab.path === "")
//                   ? 'border-blue-500 text-gray-900'
//                   : 'border-transparent text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               {tab.name}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // src/components/DoctorHeader.jsx

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { Printer, X } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// const tabs = [
//   { name: "Overview", path: "" },
//   { name: "Sales Bill", path: "sales-bill" },
//   { name: "Receipts", path: "receipts" },
//   { name: "Quotations", path: "quotations" },
//   { name: "Policies", path: "policies" },
//   { name: "Inquiries / Follow-ups", path: "inquiries" },
// ];

// export default function DoctorHeader() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Extract current tab from URL
//   const pathParts = location.pathname.split("/");
//   const currentTab = pathParts[pathParts.length - 1]; // Last segment
//   const isOverview = pathParts.length === 4; // /admin/doctors/:id → Overview

//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.get(id));
//         setDoctor(response.data.data || response.data);
//       } catch (error) {
//         console.error("Error fetching doctor data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDoctorData();
//     }
//   }, [id]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleClose = () => {
//     navigate("/superadmin/doctor-reports");
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       {/* Top Bar */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//         <div>
//           {loading ? (
//             <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
//           ) : doctor ? (
//             <h1 className="text-lg font-bold text-gray-900">
//               {doctor.fullName || "N/A"}
//               <span className="font-normal text-gray-600">
//                 • {doctor.hospitalName || doctor.clinicName || "N/A"} •{" "}
//                 {doctor.city || "N/A"}
//               </span>
//             </h1>
//           ) : (
//             <h1 className="text-lg font-bold text-gray-900">
//               Doctor Not Found
//             </h1>
//           )}
//         </div>
//         <div className="flex gap-2">
//           {/* <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50 transition"
//             >
//               <Printer className="h-4 w-4" /> Print
//             </button> */}
//           <button
//             onClick={handleClose}
//             className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800 transition"
//           >
//             <X className="h-4 w-4" /> Close
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <div className="flex px-6 space-x-1">
//           {tabs.map((tab) => {
//             const isActive =
//               (tab.path === "" && isOverview) || // Overview when no sub-path
//               currentTab === tab.path; // Other tabs

//             return (
//               <button
//                 key={tab.name}
//                 onClick={() =>
//                   navigate(`/superadmin/doctors/${id}/${tab.path}`)
//                 }
//                 className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap
//                     ${
//                       isActive
//                         ? "border-blue-600 text-blue-600 font-semibold"
//                         : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
//                     }`}
//               >
//                 {tab.name}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/DoctorHeader.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Printer, X } from "lucide-react";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";

const tabs = [
  { name: "Overview", path: "" },
  { name: "Sales Bill", path: "sales-bill" },
  { name: "Receipts", path: "receipts" },
  { name: "Quotations", path: "quotations" },
  { name: "Policies", path: "policies" },
  { name: "Inquiries / Follow-ups", path: "inquiries" },
];

export default function DoctorHeader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract current tab from URL
  const pathParts = location.pathname.split("/");
  const currentTab = pathParts[pathParts.length - 1]; // Last segment
  const isOverview = pathParts.length === 4; // /admin/doctors/:id → Overview

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.doctors.get(id));
        setDoctor(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    navigate("/superadmin/doctor-reports");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          {loading ? (
            <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
          ) : doctor ? (
            <h1 className="text-lg font-bold text-gray-900">
              {doctor.fullName || "N/A"}
              <span className="font-normal text-gray-600">
                • {doctor.hospitalName || doctor.clinicName || "N/A"} •{" "}
                {doctor.city || "N/A"}
              </span>
            </h1>
          ) : (
            <h1 className="text-lg font-bold text-gray-900">
              Doctor Not Found
            </h1>
          )}
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50 transition"
          >
            <Printer className="h-4 w-4" /> Print
          </button> */}
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800 transition"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex px-6 space-x-1">
          {tabs.map((tab) => {
            const isActive =
              (tab.path === "" && isOverview) || // Overview when no sub-path
              currentTab === tab.path; // Other tabs

            return (
              <button
                key={tab.name}
                onClick={() => navigate(`/superadmin/doctors/${id}/${tab.path}`)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "border-blue-600 text-blue-600 font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
