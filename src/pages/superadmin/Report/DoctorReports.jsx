// // // src/pages/DoctorReportList.jsx
// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import Table from "../../../components/mainComponents/Table";

// // const mockData = [
// //   {
// //     id: "1",
// //     date: "12.09.25",
// //     drName: "Dr. Ram Kumar D001",
// //     hospital: "City Hospital",
// //     city: "Vasai",
// //     specialty: "Dental",
// //     membership: "Hospital",
// //     enquiry: "Hot",
// //     followUps: "2 FU",
// //   },
// //   {
// //     id: "2",
// //     date: "11.09.25",
// //     drName: "Dr. Seema Patil D002",
// //     hospital: "Green Clinic",
// //     city: "Kolhapur",
// //     specialty: "Forensic",
// //     membership: "Individual + Hospital",
// //     enquiry: "Warm",
// //     followUps: "1 FU",
// //   },
// // ];

// // export default function DoctorReportList() {
// //   const navigate = useNavigate();

// //   /* -------------------------------------------------
// //      ACTIONS – View (green button) + + (green circle)
// //   ------------------------------------------------- */
// //   const actions = [
// //     {
// //       label: "View",
// //       icon: (
// //         <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded font-medium">
// //           View
// //         </span>
// //       ),
// //       showAsIcon: true,
// //       useDropdown: false,
// //       onClick: (row) => navigate(`/doctors/${row.id}`),
// //     },
// //     {
// //       label: "Add Follow‑up",
// //       icon: (
// //         <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold">
// //           +
// //         </span>
// //       ),
// //       showAsIcon: true,
// //       useDropdown: false,
// //       onClick: (row) => alert(`Add follow‑up for ${row.drName}`),
// //     },
// //     {
// //       label: "Edit",
// //       useDropdown: true,
// //       onClick: (row) => alert(`Edit ${row.drName}`),
// //     },
// //     {
// //       label: "Delete",
// //       useDropdown: true,
// //       onClick: (row) => alert(`Delete ${row.drName}`),
// //     },
// //   ];

// //   /* -------------------------------------------------
// //      ONLY THE COLUMNS YOU WANT – put them in extraColumns
// //      (the Table will ignore every key that is not listed here)
// //   ------------------------------------------------- */
// //   const extraColumns = [
// //     // {
// //     //   header: "Date",
// //     //   render: (row) => <span className="font-medium text-gray-900">{row.date}</span>,
// //     // },
// //     // {
// //     //   header: "Dr Name",
// //     //   render: (row) => (
// //     //     <span className="font-semibold text-blue-700">{row.drName}</span>
// //     //   ),
// //     // },
// //     // {
// //     //   header: "Hospital Name",
// //     //   render: (row) => <span className="text-gray-800">{row.hospital}</span>,
// //     // },
// //     // {
// //     //   header: "City",
// //     //   render: (row) => <span className="text-gray-600">{row.city}</span>,
// //     // },
// //     // {
// //     //   header: "Specialty",
// //     //   render: (row) => (
// //     //     <span className="inline-block px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
// //     //       {row.specialty}
// //     //     </span>
// //     //   ),
// //     // },
// //     // {
// //     //   header: "Type Of Membership",
// //     //   render: (row) => <span className="text-gray-700">{row.membership}</span>,
// //     // },
// //     // {
// //     //   header: "Type Of Enquires",
// //     //   render: (row) => (
// //     //     <span
// //     //       className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
// //     //         row.enquiry === "Hot"
// //     //           ? "bg-red-100 text-red-800"
// //     //           : "bg-yellow-100 text-yellow-800"
// //     //       }`}
// //     //     >
// //     //       {row.enquiry}
// //     //     </span>
// //     //   ),
// //     // },
// //     // {
// //     //   header: "Follow Ups",
// //     //   render: (row) => (
// //     //     <span className="font-medium text-gray-900">{row.followUps}</span>
// //     //   ),
// //     // },
// //   ];

// //   return (
// //     <div className="max-w-[79vw] mx-auto p-6 bg-gray-50 min-h-screen">
// //       {/* Title */}
// //       <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Report</h1>

// //       {/* ---------- FILTERS ---------- */}
// //       <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
// //         {/* Row 1 */}
// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By Dr</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
// //             <option>All</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Sort by Status</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>Hot</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">To Date</label>
// //           <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200" />
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">From Date</label>
// //           <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200" />
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Sort by Membership</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>Hospital</option>
// //           </select>
// //         </div>

// //         {/* Row 2 */}
// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By City</label>
// //           <input type="text" placeholder="City" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By Employee</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>Salesmen</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By Speciality</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>Dental</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By Month</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>March</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label className="text-xs text-gray-600 w-20">Search By Year</label>
// //           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
// //             <option>2026</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* ---------- MONTHLY / YEARLY ---------- */}
// //       <div className="flex items-center justify-between mb-4">
// //         <div className="flex items-center gap-6">
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input type="radio" name="period" defaultChecked className="w-4 h-4 text-blue-600" />
// //             <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
// //               Monthly
// //             </span>
// //           </label>
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input type="radio" name="period" className="w-4 h-4 text-blue-600" />
// //             <span className="bg-gray-200 text-blue-600 px-3 py-1 rounded text-sm font-medium">
// //               Yearly
// //             </span>
// //           </label>
// //         </div>

// //         <div className="flex gap-2">
// //           <button className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 text-sm">
// //             Reset
// //           </button>
// //           <button className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
// //             View
// //           </button>
// //         </div>
// //       </div>

// //       {/* ---------- TABLE ---------- */}
// //       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //         <Table
// //           data={mockData}               // full rows (id, date, …)
// //           actions={actions}
// //           extraColumns={extraColumns}   // ONLY these columns appear
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/DoctorReportList.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";

// const mockData = [
//   {
//     id: "1",
//     date: "12.09.25",
//     drName: "Dr. Ram Kumar D001",
//     hospital: "City Hospital",
//     city: "Vasai",
//     specialty: "Dental",
//     membership: "Hospital",
//     enquiry: "Hot",
//     followUps: "2 FU",
//   },
//   {
//     id: "2",
//     date: "11.09.25",
//     drName: "Dr. Seema Patil D002",
//     hospital: "Green Clinic",
//     city: "Kolhapur",
//     specialty: "Forensic",
//     membership: "Individual + Hospital",
//     enquiry: "Warm",
//     followUps: "1 FU",
//   },
// ];

// export default function DoctorReportList() {
//   const navigate = useNavigate();

//   /* -------------------------------------------------
//      ACTIONS – View (green button) + + (green circle)
//   ------------------------------------------------- */
//   const actions = [
//     {
//       label: "View",
//       icon: (
//         <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded font-medium">
//           View
//         </span>
//       ),
//       showAsIcon: true,
//       useDropdown: false,
//       onClick: (row) => navigate(`/doctors/${row.id}`),
//     },
//     {
//       label: "Add Follow‑up",
//       icon: (
//         <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold">
//           +
//         </span>
//       ),
//       showAsIcon: true,
//       useDropdown: false,
//       onClick: (row) => alert(`Add follow‑up for ${row.drName}`),
//     },
//     {
//       label: "Edit",
//       useDropdown: true,
//       onClick: (row) => alert(`Edit ${row.drName}`),
//     },
//     {
//       label: "Delete",
//       useDropdown: true,
//       onClick: (row) => alert(`Delete ${row.drName}`),
//     },
//   ];

//   /* -------------------------------------------------
//      extraColumns me SIRF WOH COLUMNS jo data me NAHI hain
//      → data me sab keys hain → extraColumns = [] (empty)
//      → Table khud data.keys se columns banayega
//   ------------------------------------------------- */
//   const extraColumns = [];  // ← EMPTY! Kyunki sab kuch data me hai

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Title */}
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Report</h1>

//       {/* ---------- FILTERS ---------- */}
//       <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//         {/* Row 1 */}
//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By Dr</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option>All</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Sort by Status</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>Hot</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">To Date</label>
//           <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200" />
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">From Date</label>
//           <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200" />
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Sort by Membership</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>Hospital</option>
//           </select>
//         </div>

//         {/* Row 2 */}
//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By City</label>
//           <input type="text" placeholder="City" className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By Employee</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>Salesmen</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By Speciality</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>Dental</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By Month</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>March</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-xs text-gray-600 w-20">Search By Year</label>
//           <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-200">
//             <option>2026</option>
//           </select>
//         </div>
//       </div>

//       {/* ---------- MONTHLY / YEARLY ---------- */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="radio" name="period" defaultChecked className="w-4 h-4 text-blue-600" />
//             <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
//               Monthly
//             </span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="radio" name="period" className="w-4 h-4 text-blue-600" />
//             <span className="bg-gray-200 text-blue-600 px-3 py-1 rounded text-sm font-medium">
//               Yearly
//             </span>
//           </label>
//         </div>

//         <div className="flex gap-2">
//           <button className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 text-sm">
//             Reset
//           </button>
//           <button className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
//             View
//           </button>
//         </div>
//       </div>

//       {/* ---------- TABLE ---------- */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table
//           data={mockData}
//           actions={actions}
//           extraColumns={extraColumns}   // ← Empty! No duplicates
//         />
//       </div>
//     </div>
//   );
// }






// src/pages/DoctorReportList.jsx  (or wherever this component lives)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";           // Make sure this is installed
import Table from "./DoctorReport/TablesDoctorParth";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

export default function DoctorReportList() {
  const [doctorData, setDoctorData] = useState([]);
  const [fullFilteredData, setFullFilteredData] = useState([]);

  const [allDoctors, setAllDoctors] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [allCities, setAllCities] = useState([]);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    doctorName: "",
    dateFrom: "",
    dateTo: "",
    leadStatus: "",
    city: "",
    specialty: "",
    membership: "",
    employeeName: "",
    period: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    doctorName: "",
    dateFrom: "",
    dateTo: "",
    leadStatus: "",
    city: "",
    specialty: "",
    membership: "",
    employeeName: "",
    period: "all",
  });

  const navigate = useNavigate();

  const handleRowClick = (row) => {
    navigate(`/superadmin/doctors/${row._id || row.id}`);
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.doctors.list, {
        params: { limit: 1000 },
      });

      const doctors = response.data.data || [];
      setAllDoctors(doctors);

      // Employees (already good)
      const employeeMap = new Map();
      doctors.forEach((doc) => {
        if (doc.createdBy?._id) {
          employeeMap.set(doc.createdBy._id, doc.createdBy);
        }
      });
      setAllEmployees(
        Array.from(employeeMap.values()).sort((a, b) =>
          (a.fullName || "").localeCompare(b.fullName || ""),
        ),
      );

      // specialties
      const specialtySet = new Set();
      doctors.forEach((doc) => {
        if (Array.isArray(doc.specialization)) {
          doc.specialization.forEach((spec) => {
            if (spec?.trim()) specialtySet.add(spec.trim());
          });
        }
      });
      setAllSpecialties(Array.from(specialtySet).sort());

      // cities
      const citySet = new Set();
      doctors.forEach((doc) => {
        const c1 = doc.contactDetails?.currentAddress?.city?.trim();
        const c2 = doc.hospitalAddress?.city?.trim();
        if (c1) citySet.add(c1);
        if (c2) citySet.add(c2);
      });
      setAllCities(Array.from(citySet).sort());
    } catch (error) {
      console.error("Error fetching base data:", error);
      toast.error("Failed to load filter options");
    }
  };

  // ────────────────────────────────────────────────
  //   fetchDoctorReports, useEffect, handlers remain the same
  // ────────────────────────────────────────────────

  const fetchDoctorReports = async () => {
    setLoading(true);
    try {
      const f = appliedFilters;

      const hasFilter =
        f.doctorName.trim() ||
        f.dateFrom ||
        f.dateTo ||
        f.city.trim() ||
        f.specialty.trim() ||
        f.employeeName.trim() ||
        f.leadStatus ||
        f.membership ||
        f.period !== "all";

      let params = {};

      if (hasFilter) {
        params.limit = 0;
      } else {
        params.limit = 500;
      }

      if (f.dateFrom) params.dateFrom = f.dateFrom;
      if (f.dateTo) params.dateTo = f.dateTo;
      if (f.city.trim()) params.city = f.city.trim();
      if (f.leadStatus) params.typeOfEnquiry = f.leadStatus;
      if (f.membership) params.membershipType = f.membership;

      const response = await apiClient.get(apiEndpoints.doctors.list, { params });
      let data = response.data.data || [];

      // Client-side filters
      if (f.doctorName.trim()) {
        const search = f.doctorName.trim().toLowerCase();
        data = data.filter((doc) =>
          (doc.fullName || "").toLowerCase().includes(search),
        );
      }

      if (f.employeeName.trim()) {
        const search = f.employeeName.trim().toLowerCase();
        data = data.filter((doc) =>
          (doc.createdBy?.fullName || "").toLowerCase().includes(search),
        );
      }

      if (f.specialty.trim()) {
        const search = f.specialty.trim().toLowerCase();
        data = data.filter(
          (doc) =>
            Array.isArray(doc.specialization) &&
            doc.specialization.some((s) => (s || "").toLowerCase().includes(search)),
        );
      }

      if (f.city.trim()) {
        const searchCity = f.city.trim().toLowerCase();
        data = data.filter((doc) =>
          getDoctorCity(doc).toLowerCase().includes(searchCity),
        );
      }

      if (f.dateFrom || f.dateTo) {
        const from = f.dateFrom ? new Date(f.dateFrom) : null;
        const to = f.dateTo ? new Date(f.dateTo) : null;
        if (to) to.setHours(23, 59, 59, 999);
        data = data.filter((doc) => {
          if (!doc.createdAt) return false;
          const d = new Date(doc.createdAt);
          return (!from || d >= from) && (!to || d <= to);
        });
      }

      if (f.membership) {
        const targetType = f.membership.toLowerCase();
        data = data.filter(
          (doc) => doc.doctorType?.toLowerCase() === targetType,
        );
      }

      if (f.period === "monthly") {
        data = data.filter((doc) =>
          doc.salesBills?.some(
            (bill) => bill?.billId?.membershipType?.toLowerCase() === "monthly",
          ),
        );
      } else if (f.period === "yearly") {
        data = data.filter((doc) =>
          doc.salesBills?.some(
            (bill) => bill?.billId?.membershipType?.toLowerCase() === "yearly",
          ),
        );
      }

      setFullFilteredData(data);
      setDoctorData(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load doctors");
      setDoctorData([]);
      setFullFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  useEffect(() => {
    fetchDoctorReports();
  }, [appliedFilters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewClick = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const empty = {
      doctorName: "",
      dateFrom: "",
      dateTo: "",
      leadStatus: "",
      city: "",
      specialty: "",
      membership: "",
      employeeName: "",
      period: "all",
    };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const getDoctorCity = (doc) => {
    return (
      doc.contactDetails?.currentAddress?.city?.trim() ||
      doc.hospitalAddress?.city?.trim() ||
      ""
    );
  };

  // ────────────────────────────────────────────────
  //   Prepare options for all react-select fields
  // ────────────────────────────────────────────────

  const doctorOptions = allDoctors
    .map((doc) => ({
      value: doc.fullName || "",
      label: doc.fullName || "Unnamed Doctor",
    }))
    .filter((opt) => opt.value.trim() !== "")
    .sort((a, b) => a.label.localeCompare(b.label));

  const specialtyOptions = allSpecialties.map((spec) => ({
    value: spec,
    label: spec,
  }));

  // ← NEW: Employee options
  const employeeOptions = allEmployees
    .map((emp) => ({
      value: emp.fullName || "",
      label: emp.fullName || "Unnamed Employee",
    }))
    .filter((opt) => opt.value.trim() !== "")
    .sort((a, b) => a.label.localeCompare(b.label));

  // ────────────────────────────────────────────────
  //   Table data transformation (unchanged)
  // ────────────────────────────────────────────────

  const tableData = doctorData.map((row) => ({
    _id: row._id,
    date: row.createdAt
      ? new Date(row.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, ".")
      : "—",
    drName: row.fullName || "—",
    hospitalName: row.hospitalName || "—",
    city: getDoctorCity(row) || "—",
    speciality: Array.isArray(row.specialization)
      ? row.specialization.join(", ")
      : "—",
    typeOfMembership:
      row.doctorType === "hospital"
        ? "Hospital"
        : row.doctorType === "individual"
          ? "Individual"
          : row.doctorType === "hospital_individual"
            ? "Hospital + Individual"
            : "—",
    typeOfEnquiry: row.typeOfEnquiry || "—",
    followUps: row.followUps?.length ? `${row.followUps.length} FU` : "—",
    original: row,
  }));

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Report</h1>

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Search By Dr */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Search By Dr</label>
            <Select
              isClearable
              isSearchable
              placeholder="Type doctor name..."
              value={
                filters.doctorName
                  ? { value: filters.doctorName, label: filters.doctorName }
                  : null
              }
              options={doctorOptions}
              onChange={(option) =>
                handleFilterChange("doctorName", option ? option.value : "")
              }
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                  borderColor: "#d1d5db",
                }),
              }}
            />
          </div>

          {/* Lead Status */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Lead Status</label>
            <select
              value={filters.leadStatus}
              onChange={(e) => handleFilterChange("leadStatus", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-10"
            >
              <option value="">All Leads</option>
              <option value="follow_up">Follow Up</option>
              <option value="hot">Hot (Priority)</option>
              <option value="closed">Closed (Converted)</option>
              <option value="cancel">Cancel (Membership Expired)</option>
              <option value="cold">Cold (Not Interested)</option>
            </select>
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-10"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-10"
            />
          </div>

          {/* Membership Type */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Membership Type</label>
            <select
              value={filters.membership}
              onChange={(e) => handleFilterChange("membership", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-10"
            >
              <option value="">All</option>
              <option value="hospital">Hospital</option>
              <option value="individual">Individual</option>
              <option value="hospital_individual">Hospital + Individual</option>
            </select>
          </div>

          {/* Search By Speciality */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Search By Speciality</label>
            <Select
              isClearable
              isSearchable
              placeholder="Type or select speciality..."
              value={
                filters.specialty
                  ? { value: filters.specialty, label: filters.specialty }
                  : null
              }
              options={specialtyOptions}
              onChange={(option) =>
                handleFilterChange("specialty", option ? option.value : "")
              }
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                  borderColor: "#d1d5db",
                }),
              }}
            />
          </div>

          {/* Search By City */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Search By City</label>
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-10"
            />
          </div>

          {/* ─── Search By Employee ─── now using react-select ─── */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Search By Employee</label>
            <Select
              isClearable
              isSearchable
              placeholder="Type employee name..."
              value={
                filters.employeeName
                  ? { value: filters.employeeName, label: filters.employeeName }
                  : null
              }
              options={employeeOptions}
              onChange={(option) =>
                handleFilterChange("employeeName", option ? option.value : "")
              }
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                  borderColor: "#d1d5db",
                }),
              }}
            />
          </div>

        </div>
      </div>

      {/* Period + Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="period"
              checked={filters.period === "all"}
              onChange={() => handleFilterChange("period", "all")}
            />
            All
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="period"
              checked={filters.period === "monthly"}
              onChange={() => handleFilterChange("period", "monthly")}
            />
            Monthly
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="period"
              checked={filters.period === "yearly"}
              onChange={() => handleFilterChange("period", "yearly")}
            />
            Yearly
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleViewClick}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 text-sm font-medium"
          >
            {loading ? "Loading..." : "View"}
          </button>
        </div>
      </div>

      {/* Table area */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          data={tableData}
          onRowClick={(transformedRow) => handleRowClick(transformedRow.original)}
          pagination={true}
          defaultPageSize={10}
          showSrNo={true}
        />

        {loading && (
          <div className="p-8 text-center text-gray-500">Loading doctors...</div>
        )}

        {!loading && tableData.length === 0 && (
          <div className="p-12 text-center text-gray-500 italic">
            No doctors found. Try adjusting filters and click View.
          </div>
        )}
      </div>
    </div>
  );
}



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table from "./DoctorReport/TablesDoctorParth";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// export default function DoctorReportList() {
//   const [doctorData, setDoctorData] = useState([]); // ← data for current page (what Table shows)
//   const [fullFilteredData, setFullFilteredData] = useState([]); // ← all records after client-side filtering

//   const [allDoctors, setAllDoctors] = useState([]);
//   const [allEmployees, setAllEmployees] = useState([]);
//   const [allSpecialties, setAllSpecialties] = useState([]);
//   const [allCities, setAllCities] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     doctorName: "",
//     dateFrom: "",
//     dateTo: "",
//     leadStatus: "",
//     city: "",
//     specialty: "",
//     membership: "",
//     employeeName: "",
//     period: "all",
//   });

//   const [appliedFilters, setAppliedFilters] = useState({
//     doctorName: "",
//     dateFrom: "",
//     dateTo: "",
//     leadStatus: "",
//     city: "",
//     specialty: "",
//     membership: "",
//     employeeName: "",
//     period: "all",
//   });

//   const navigate = useNavigate();

//   const handleRowClick = (row) => {
//     navigate(`/admin/doctors/${row._id || row.id}`);
//   };

//   const fetchAllDoctors = async () => {
//     try {
//       const response = await apiClient.get(apiEndpoints.doctors.list, {
//         params: { limit: 1000 },
//       });

//       const doctors = response.data.data || [];
//       setAllDoctors(doctors);

//       // employees
//       const employeeMap = new Map();
//       doctors.forEach((doc) => {
//         if (doc.createdBy?._id) {
//           employeeMap.set(doc.createdBy._id, doc.createdBy);
//         }
//       });
//       setAllEmployees(
//         Array.from(employeeMap.values()).sort((a, b) =>
//           (a.fullName || "").localeCompare(b.fullName || ""),
//         ),
//       );

//       // specialties
//       const specialtySet = new Set();
//       doctors.forEach((doc) => {
//         if (Array.isArray(doc.specialization)) {
//           doc.specialization.forEach((spec) => {
//             if (spec?.trim()) specialtySet.add(spec.trim());
//           });
//         }
//       });
//       setAllSpecialties(Array.from(specialtySet).sort());

//       // cities
//       const citySet = new Set();
//       doctors.forEach((doc) => {
//         const c1 = doc.contactDetails?.currentAddress?.city?.trim();
//         const c2 = doc.hospitalAddress?.city?.trim();
//         if (c1) citySet.add(c1);
//         if (c2) citySet.add(c2);
//       });
//       setAllCities(Array.from(citySet).sort());
//     } catch (error) {
//       console.error("Error fetching base data:", error);
//       toast.error("Failed to load filter options");
//     }
//   };

//   const fetchDoctorReports = async () => {
//     setLoading(true);
//     try {
//       const f = appliedFilters;

//       const hasFilter =
//         f.doctorName.trim() ||
//         f.dateFrom ||
//         f.dateTo ||
//         f.city.trim() ||
//         f.specialty.trim() ||
//         f.employeeName.trim() ||
//         f.leadStatus ||
//         f.membership ||
//         f.period !== "all";

//       let params = {};

//       if (hasFilter) {
//         // When filters are used → try to get everything (client will paginate)
//         params.limit = 0;
//       } else {
//         // No filters → let backend paginate (but we will still let Table paginate)
//         // You can also change to limit: 500 or similar if you prefer
//         params.limit = 500; // ← safer than unlimited when no filters
//       }

//       if (f.dateFrom) params.dateFrom = f.dateFrom;
//       if (f.dateTo) params.dateTo = f.dateTo;
//       if (f.city.trim()) params.city = f.city.trim();
//       if (f.leadStatus) params.typeOfEnquiry = f.leadStatus;
//       if (f.membership) params.membershipType = f.membership;

//       console.log("[FETCH] params:", params);

//       const response = await apiClient.get(apiEndpoints.doctors.list, {
//         params,
//       });
//       let data = response.data.data || [];

//       console.log("[FETCH] Raw count:", data.length);

//       // Client-side filters (always applied on top)
//       if (f.doctorName.trim()) {
//         const search = f.doctorName.trim().toLowerCase();
//         data = data.filter((doc) =>
//           (doc.fullName || "").toLowerCase().includes(search),
//         );
//       }

//       if (f.employeeName.trim()) {
//         const search = f.employeeName.trim().toLowerCase();
//         data = data.filter((doc) =>
//           (doc.createdBy?.fullName || "").toLowerCase().includes(search),
//         );
//       }

//       if (f.specialty.trim()) {
//         const search = f.specialty.trim().toLowerCase();
//         data = data.filter(
//           (doc) =>
//             Array.isArray(doc.specialization) &&
//             doc.specialization.some((s) =>
//               (s || "").toLowerCase().includes(search),
//             ),
//         );
//       }

//       if (f.city.trim()) {
//         const searchCity = f.city.trim().toLowerCase();
//         data = data.filter((doc) =>
//           getDoctorCity(doc).toLowerCase().includes(searchCity),
//         );
//       }

//       if (f.dateFrom || f.dateTo) {
//         const from = f.dateFrom ? new Date(f.dateFrom) : null;
//         const to = f.dateTo ? new Date(f.dateTo) : null;
//         if (to) to.setHours(23, 59, 59, 999);
//         data = data.filter((doc) => {
//           if (!doc.createdAt) return false;
//           const d = new Date(doc.createdAt);
//           return (!from || d >= from) && (!to || d <= to);
//         });
//       }

//       if (f.membership) {
//         const targetType = f.membership.toLowerCase();
//         data = data.filter(
//           (doc) => doc.doctorType?.toLowerCase() === targetType,
//         );
//       }

//       if (f.period === "monthly") {
//         data = data.filter((doc) =>
//           doc.salesBills?.some(
//             (bill) => bill?.billId?.membershipType?.toLowerCase() === "monthly",
//           ),
//         );
//       } else if (f.period === "yearly") {
//         data = data.filter((doc) =>
//           doc.salesBills?.some(
//             (bill) => bill?.billId?.membershipType?.toLowerCase() === "yearly",
//           ),
//         );
//       }

//       console.log("[FILTER] Final filtered count:", data.length);

//       // Always store the full filtered result
//       setFullFilteredData(data);

//       // Table component will handle slicing → we just give it the full current dataset
//       setDoctorData(data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast.error("Failed to load doctors");
//       setDoctorData([]);
//       setFullFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllDoctors();
//   }, []);

//   useEffect(() => {
//     fetchDoctorReports();
//   }, [appliedFilters]); // ← removed page dependency

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleViewClick = () => {
//     setAppliedFilters({ ...filters });
//     // No need to reset page — Table handles it internally
//   };

//   const handleReset = () => {
//     const empty = {
//       doctorName: "",
//       dateFrom: "",
//       dateTo: "",
//       leadStatus: "",
//       city: "",
//       specialty: "",
//       membership: "",
//       employeeName: "",
//       period: "all",
//     };
//     setFilters(empty);
//     setAppliedFilters(empty);
//     // Table will reset to page 1 automatically when data changes
//   };

//   const getDoctorCity = (doc) => {
//     return (
//       doc.contactDetails?.currentAddress?.city?.trim() ||
//       doc.hospitalAddress?.city?.trim() ||
//       ""
//     );
//   };

//   const tableData = doctorData.map((row) => ({
//     _id: row._id,
//     date: row.createdAt
//       ? new Date(row.createdAt)
//           .toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "2-digit",
//           })
//           .replace(/\//g, ".")
//       : "—",
//     drName: row.fullName || "—",
//     hospitalName: row.hospitalName || "—",
//     city: getDoctorCity(row) || "—",
//     speciality: Array.isArray(row.specialization)
//       ? row.specialization.join(", ")
//       : "—",
//     typeOfMembership:
//       row.doctorType === "hospital"
//         ? "Hospital"
//         : row.doctorType === "individual"
//           ? "Individual"
//           : row.doctorType === "hospital_individual"
//             ? "Hospital + Individual"
//             : "—",
//     typeOfEnquiry: row.typeOfEnquiry || "—",
//     followUps: row.followUps?.length ? `${row.followUps.length} FU` : "—",
//     original: row,
//   }));

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Report</h1>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">Search By Dr</label>
//             <input
//               type="text"
//               placeholder="Doctor name..."
//               value={filters.doctorName}
//               onChange={(e) => handleFilterChange("doctorName", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">Lead Status</label>
//             <select
//               value={filters.leadStatus}
//               onChange={(e) => handleFilterChange("leadStatus", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All Leads</option>
//               <option value="follow_up">Follow Up</option>
//               <option value="hot">Hot (Priority)</option>
//               <option value="closed">Closed (Converted)</option>
//               <option value="cancel">Cancel (Membership Expired)</option>
//               <option value="cold">Cold (Not Interested)</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">From Date</label>
//             <input
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">To Date</label>
//             <input
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) => handleFilterChange("dateTo", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">
//               Membership Type
//             </label>
//             <select
//               value={filters.membership}
//               onChange={(e) => handleFilterChange("membership", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               <option value="hospital">Hospital</option>
//               <option value="individual">Individual</option>
//               <option value="hospital_individual">Hospital + Individual</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">Search By City</label>
//             <input
//               type="text"
//               placeholder="City"
//               value={filters.city}
//               onChange={(e) => handleFilterChange("city", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">
//               Search By Employee
//             </label>
//             <input
//               type="text"
//               placeholder="Employee name..."
//               value={filters.employeeName}
//               onChange={(e) =>
//                 handleFilterChange("employeeName", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">
//               Search By Speciality
//             </label>
//             <input
//               type="text"
//               placeholder="Speciality"
//               value={filters.specialty}
//               onChange={(e) => handleFilterChange("specialty", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Period + Buttons */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex gap-6">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="period"
//               checked={filters.period === "all"}
//               onChange={() => handleFilterChange("period", "all")}
//             />
//             All
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="period"
//               checked={filters.period === "monthly"}
//               onChange={() => handleFilterChange("period", "monthly")}
//             />
//             Monthly
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="period"
//               checked={filters.period === "yearly"}
//               onChange={() => handleFilterChange("period", "yearly")}
//             />
//             Yearly
//           </label>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleReset}
//             className="px-5 py-2 border rounded hover:bg-gray-50"
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleViewClick}
//             disabled={loading}
//             className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
//           >
//             {loading ? "Loading..." : "View"}
//           </button>
//         </div>
//       </div>

//       {/* Table area */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table
//           data={tableData}
//           onRowClick={(transformedRow) =>
//             handleRowClick(transformedRow.original)
//           }
//           pagination={true}
//           defaultPageSize={10}
//           showSrNo={true} // ← nice to have row numbers
//         />

//         {loading && (
//           <div className="p-8 text-center text-gray-500">Loading...</div>
//         )}

//         {!loading && tableData.length === 0 && (
//           <div className="p-12 text-center text-gray-500 italic">
//             No doctors found. Try adjusting filters and click View.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
