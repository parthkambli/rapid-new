// // src/pages/DoctorMonthlyReportPage.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import Table from "../../../components/mainComponents/Table";

// const monthNames = [
//   "",
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// export default function DoctorMonthlyReportPage() {
//   const [selectedMonth, setSelectedMonth] = useState("All");
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDobReport = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await apiClient.get(apiEndpoints.reports.dobReport);

//         if (!response.data?.success) {
//           throw new Error(response.data?.message || "API error");
//         }

//         const allDoctors = response.data.data || [];

//         const doctorsWithBirthday = allDoctors.filter(
//           (doc) =>
//             doc.birthMonth != null &&
//             Number.isInteger(doc.birthMonth) &&
//             doc.birthMonth >= 1 &&
//             doc.birthMonth <= 12,
//         );

//         setDoctors(doctorsWithBirthday);
//       } catch (err) {
//         console.error("Error fetching DOB report:", err);
//         setError(err.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDobReport();
//   }, []);

//   const grouped = useMemo(() => {
//     return doctors.reduce((acc, doc) => {
//       const m = doc.birthMonth;
//       if (!acc[m]) acc[m] = [];
//       acc[m].push({
//         id: doc.doctorId || doc._id || "—",
//         name: (doc.fullName || "—").trim().replace(/\s+/g, " "),
//         dob: doc.DOB ? new Date(doc.DOB).toISOString().split("T")[0] : "—",
//         age: doc.Age ?? "—",
//         specialty: Array.isArray(doc.speciality)
//           ? doc.speciality.filter(Boolean).join(", ")
//           : "—",
//         phone: doc.phone || "—",
//       });
//       return acc;
//     }, {});
//   }, [doctors]);

//   const monthsWithData = useMemo(
//     () =>
//       Object.keys(grouped)
//         .map(Number)
//         .sort((a, b) => a - b),
//     [grouped],
//   );

//   const monthsToShow =
//     selectedMonth === "All"
//       ? monthsWithData
//       : [monthNames.indexOf(selectedMonth)].filter((m) => m > 0);

//   const columns = [
//     { header: "ID", render: (r) => r.id },
//     { header: "Name", render: (r) => r.name },
//     { header: "DOB", render: (r) => r.dob },
//     { header: "Age", render: (r) => r.age },
//     { header: "Specialty", render: (r) => r.specialty },
//     { header: "Phone", render: (r) => r.phone },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center text-gray-600">
//         Loading birthday data...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-6">
//         <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
//         <div className="p-5 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">
//         Doctor Monthly Birthday Report
//       </h1>

//       {/* Month Filter */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Filter by Month
//         </label>
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//         >
//           <option value="All">All Months</option>
//           {monthNames.slice(1).map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>
//       </div>

//       {monthsToShow.length === 0 ? (
//         <div className="bg-white p-10 rounded-lg shadow-sm text-center text-gray-500 text-lg">
//           No birthdays recorded{" "}
//           {selectedMonth !== "All" ? `in ${selectedMonth}` : "yet"}
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {monthsToShow.map((monthNum) => {
//             const monthDoctors = grouped[monthNum] || [];
//             const total = monthDoctors.length;

//             if (total === 0) return null;

//             return (
//               <div
//                 key={monthNum}
//                 className="bg-white rounded-lg shadow-sm overflow-hidden"
//               >
//                 {/* Month Header */}
//                 <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     {monthNames[monthNum]} — {total} doctor
//                     {total !== 1 ? "s" : ""} celebrating birthday
//                   </h2>
//                   <span className="text-sm text-gray-500">Birthdays</span>
//                 </div>

//                 {/* Remove horizontal scroll */}
//                 <div className="w-full overflow-x-hidden">
//                   <Table
//                     data={monthDoctors}
//                     columns={columns}
//                     pagination={true}
//                     defaultPageSize={10}
//                     showSrNo={false}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/DoctorMonthlyReportPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import Table from "../../../components/mainComponents/Table";

const monthNames = [
  "",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DoctorMonthlyReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDobReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get(apiEndpoints.reports.dobReport);

        if (!response.data?.success) {
          throw new Error(response.data?.message || "API error");
        }

        const allDoctors = response.data.data || [];

        const doctorsWithBirthday = allDoctors.filter(
          (doc) =>
            doc.birthMonth != null &&
            Number.isInteger(doc.birthMonth) &&
            doc.birthMonth >= 1 &&
            doc.birthMonth <= 12 &&
            doc.DOB // also ensure DOB exists
        );

        setDoctors(doctorsWithBirthday);
      } catch (err) {
        console.error("Error fetching DOB report:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchDobReport();
  }, []);

  // ────────────────────────────────────────────────
  // Sort doctors by full DOB (ascending) inside each month
  // ────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const groups = doctors.reduce((acc, doc) => {
      const m = doc.birthMonth;
      if (!acc[m]) acc[m] = [];

      acc[m].push({
        id: doc.doctorId || doc._id || "—",
        name: (doc.fullName || "—").trim().replace(/\s+/g, " "),
        dob: doc.DOB ? new Date(doc.DOB).toISOString().split("T")[0] : "—",
        age: doc.Age ?? "—",
        specialty: Array.isArray(doc.speciality)
          ? doc.speciality.filter(Boolean).join(", ")
          : "—",
        phone: doc.phone || "—",
        // Keep full date object for reliable sorting
        _dobDate: doc.DOB ? new Date(doc.DOB) : null,
      });

      return acc;
    }, {});

    // Sort each month's doctors by actual DOB ascending
    Object.values(groups).forEach((monthGroup) => {
      monthGroup.sort((a, b) => {
        // Handle missing/invalid dates → push to bottom
        if (!a._dobDate) return 1;
        if (!b._dobDate) return -1;
        return a._dobDate - b._dobDate;
      });
    });

    return groups;
  }, [doctors]);

  const monthsWithData = useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b),
    [grouped]
  );

  const monthsToShow =
    selectedMonth === "All"
      ? monthsWithData
      : [monthNames.indexOf(selectedMonth)].filter((m) => m > 0);

  const columns = [
    { header: "ID", render: (r) => r.id },
    { header: "Name", render: (r) => r.name },
    { header: "DOB", render: (r) => r.dob },
    { header: "Age", render: (r) => r.age },
    { header: "Specialty", render: (r) => r.specialty },
    { header: "Phone", render: (r) => r.phone },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-gray-600">
        Loading birthday data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
        <div className="p-5 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Doctor Monthly Birthday Report
      </h1>

      {/* Month Filter */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="All">All Months</option>
          {monthNames.slice(1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {monthsToShow.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center text-gray-500 text-lg">
          No birthdays recorded{" "}
          {selectedMonth !== "All" ? `in ${selectedMonth}` : "yet"}
        </div>
      ) : (
        <div className="space-y-10">
          {monthsToShow.map((monthNum) => {
            const monthDoctors = grouped[monthNum] || [];
            const total = monthDoctors.length;

            if (total === 0) return null;

            return (
              <div
                key={monthNum}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Month Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {monthNames[monthNum]} — {total} doctor
                    {total !== 1 ? "s" : ""} celebrating birthday
                  </h2>
                  <span className="text-sm text-gray-500">Birthdays</span>
                </div>

                <div className="w-full overflow-x-hidden">
                  <Table
                    data={monthDoctors}
                    columns={columns}
                    pagination={true}
                    defaultPageSize={10}
                    showSrNo={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}