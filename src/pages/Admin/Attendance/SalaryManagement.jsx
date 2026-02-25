// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const EmployeeSalaryRecord = () => {
//   const navigate = useNavigate();
//   const [salaryData, setSalaryData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0); // Track total items
//   const [pageSize, setPageSize] = useState(10); // Default to 10 entries per page

//   // Filters
//   const [searchName, setSearchName] = useState('');
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

//   const fetchSalaryData = async () => {
//     try {
//       setLoading(true);

//       const params = {
//         page: currentPage,
//         limit: pageSize,
//         sortBy: 'createdAt',
//         sortOrder: 'desc'
//       };

//       // Add search filters
//       if (searchName) {
//         params.search = searchName;
//       }
//       if (searchEmpId) {
//         params.employeeId = searchEmpId; // Changed to match backend parameter
//       }

//       if (selectedRole) {
//         params.role = selectedRole; // Changed to match employee role field
//       }

//       // Add month/year filters
//       if (selectedMonth) {
//         const [year, month] = selectedMonth.split('-');
//         params.month = parseInt(month);
//         params.year = parseInt(year);
//       }

//       const response = await apiClient.get(apiEndpoints.salaries.list, { params });

//       if (response.data.success) {
//         const formattedData = response.data.data.map(salary => ({
//           ...salary,
//           employeeId: salary.employee?.employeeId || 'N/A',
//           name: salary.employee?.fullName || 'N/A',
//           present: salary.attendanceData?.presentDays || 0,
//           absent: salary.attendanceData?.absentDays || 0,
//           totalDays: salary.attendanceData?.totalDays || 0,
//           monthDays: salary.attendanceData?.monthDays || 30,
//           perDay: (salary.employee?.salaryDetails?.totalSalary && salary.attendanceData?.monthDays) ? (salary.employee?.salaryDetails?.totalSalary / salary.attendanceData?.monthDays).toFixed(2) : (salary.employee?.salaryDetails?.totalSalary ? (salary.employee?.salaryDetails?.totalSalary / 30).toFixed(2) : 0),
//           totalPayment: salary.employee?.salaryDetails?.totalSalary || 0,
//           finalPayment: salary.employee?.salaryDetails?.totalSalary && salary.attendanceData?.presentDays !== undefined ? Math.round((salary.employee.salaryDetails.totalSalary / (salary.attendanceData?.monthDays || 30)) * salary.attendanceData?.presentDays) : salary.netSalary || 0
//         }));

//         setSalaryData(formattedData);
//         // Handle different pagination response formats
//         setTotalPages(response.data.pagination?.totalPages || response.data.pagination?.pages || 1);
//         setTotalItems(response.data.pagination?.totalItems || formattedData.length);
//       }
//     } catch (error) {
//       console.error('Error fetching salary data:', error);
//       toast.error('Failed to fetch salary data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSalaryData();
//   }, [currentPage, pageSize, selectedMonth, searchName, searchEmpId, selectedRole]);

//   const handleViewSalaryDetails = (salaryId) => {
//     navigate(`/admin/employee/salary/view/${salaryId}`);
//   };

//   const handleGenerateSalary = async (salaryPreview) => {
//     try {
//       setLoading(true);
//       const payload = {
//         employeeId: salaryPreview.employee._id,
//         month: salaryPreview.month,
//         year: salaryPreview.year,
//         basicSalary: salaryPreview.basicSalary
//       };

//       const response = await apiClient.post(apiEndpoints.salaries.create, payload);

//       if (response.data.success) {
//         toast.success('Salary generated successfully');
//         fetchSalaryData(); // Refresh list
//       } else {
//         toast.error(response.data.message || 'Failed to generate salary');
//       }
//     } catch (error) {
//       console.error('Error generating salary:', error);
//       toast.error('Failed to generate salary');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     setCurrentPage(1); // Reset to first page when searching
//     fetchSalaryData();
//   };

//   const handlePageChange = (page) => {
//     // Ensure page is within valid range
//     const newPage = Math.max(1, Math.min(page, totalPages));
//     setCurrentPage(newPage);
//   };

//   return (
//     <div className="container mx-auto p-4 min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2 className="text-xl font-bold text-gray-800">Employee Salary Record</h2>
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//             <input
//               type="text"
//               placeholder="Search By Name"
//               value={searchName}
//               onChange={(e) => {
//                 setSearchName(e.target.value);
//                 setCurrentPage(1); // Reset to first page when search changes
//               }}
//               className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
//             <input
//               type="text"
//               placeholder="Search By Employee ID"
//               value={searchEmpId}
//               onChange={(e) => {
//                 setSearchEmpId(e.target.value);
//                 setCurrentPage(1); // Reset to first page when search changes
//               }}
//               className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Role</label>
//             <select
//               value={selectedRole}
//               onChange={(e) => {
//                 setSelectedRole(e.target.value);
//                 setCurrentPage(1); // Reset to first page when filter changes
//               }}
//               className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
//             >
//               <option value="">All Roles</option>
//               <option value="salesman">Salesperson</option>
//               <option value="telecaller">Telecaller</option>
//               <option value="admin">Admin User</option>
//             </select>
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Month</label>
//             <input
//               type="month"
//               value={selectedMonth}
//               onChange={(e) => {
//                 setSelectedMonth(e.target.value);
//                 setCurrentPage(1); // Reset to first page when filter changes
//               }}
//               className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <table className="w-full text-black border-collapse rounded-lg text-sm" style={{ backgroundColor: '#F1F6F6' }}>
//             <thead>
//               <tr className="border-b border-gray-300" style={{ backgroundColor: '#F1F6F6' }}>
//                 <th className="p-3 font-semibold text-left">EMPLOYEE ID</th>
//                 <th className="p-3 font-semibold text-left">NAME</th>
//                 <th className="p-3 font-semibold text-center">PRESENT DAYS</th>
//                 <th className="p-3 font-semibold text-center">ABSENT DAYS</th>
//                 <th className="p-3 font-semibold text-center">TOTAL DAYS</th>
//                 <th className="p-3 font-semibold text-center">MONTHLY SALARY (₹)</th>
//                 <th className="p-3 font-semibold text-center">MONTH DAYS</th>
//                 <th className="p-3 font-semibold text-center">PER DAY PAYMENT (₹)</th>
//                 <th className="p-3 font-semibold text-center">FINAL PAYMENT (₹)</th>
//                 <th className="p-3 font-semibold text-center">ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salaryData.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="p-8 text-center text-gray-500">
//                     No salary records found
//                   </td>
//                 </tr>
//               ) : (
//                 salaryData.map((salary, index) => (
//                   <tr key={salary._id || salary.employee?._id || index} className="border-b border-gray-300 hover:bg-gray-100">
//                     <td className="p-3">{salary.employeeId}</td>
//                     <td className="p-3">{salary.name}</td>
//                     <td className="p-3 text-center">{salary.present}</td>
//                     <td className="p-3 text-center">{salary.absent}</td>
//                     <td className="p-3 text-center">{salary.totalDays}</td>
//                     <td className="p-3 text-center">{salary.totalPayment.toLocaleString()}</td>
//                     <td className="p-3 text-center">{salary.monthDays}</td>
//                     <td className="p-3 text-center">{salary.perDay}</td>
//                     <td className="p-3 text-center">{salary.finalPayment.toLocaleString()}</td>
//                     <td className="p-3 text-center">
//                       {salary._id ? (
//                         <button
//                           onClick={() => handleViewSalaryDetails(salary._id)}
//                           className="bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 transition-colors"
//                         >
//                           View
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleGenerateSalary(salary)}
//                           className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition-colors"
//                         >
//                           Generate
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Enhanced Pagination */}
//       {totalPages > 0 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//           <div className="text-sm font-medium text-gray-700">
//             Showing <span className="text-[#398C89]">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to{" "}
//             <span className="text-[#398C89]">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
//             <span className="text-[#398C89]">{totalItems}</span> entries
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-3">
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setCurrentPage(1); // Reset to first page when page size changes
//                 }}
//                 className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] focus:outline-none transition"
//               >
//                 {[5, 10, 25, 50, 100].map((size) => (
//                   <option key={size} value={size}>{size}</option>
//                 ))}
//               </select>
//               <span className="text-sm text-gray-600 font-medium">per page</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//               >
//                 Previous
//               </button>

//               {(() => {
//                 const pages = [];
//                 if (totalPages <= 7) {
//                   for (let i = 1; i <= totalPages; i++) pages.push(i);
//                 } else if (currentPage <= 4) {
//                   pages.push(1, 2, 3, 4, 5);
//                   pages.push("...");
//                   pages.push(totalPages);
//                 } else if (currentPage >= totalPages - 3) {
//                   pages.push(1);
//                   pages.push("...");
//                   for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
//                 } else {
//                   pages.push(1);
//                   pages.push("...");
//                   pages.push(currentPage - 1, currentPage, currentPage + 1);
//                   pages.push("...");
//                   pages.push(totalPages);
//                 }

//                 return pages.map((page, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => typeof page === "number" && handlePageChange(page)}
//                     disabled={page === "..."}
//                     className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
//                       page === currentPage
//                         ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
//                         : page === "..."
//                         ? "text-gray-500 cursor-default border-transparent"
//                         : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ));
//               })()}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeSalaryRecord;




import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeSalaryRecord = () => {
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // const fetchSalaryData = async () => {
  //   try {
  //     setLoading(true);

  //     const params = {
  //       page: currentPage,
  //       limit: pageSize,
  //       sortBy: 'createdAt',
  //       sortOrder: 'desc'
  //     };

  //     if (searchName) {
  //       params.search = searchName;
  //     }
  //     if (searchEmpId) {
  //       params.employeeId = searchEmpId;
  //     }
  //     if (selectedRole) {
  //       params.role = selectedRole;
  //     }
  //     if (selectedMonth) {
  //       const [year, month] = selectedMonth.split('-');
  //       params.month = parseInt(month);
  //       params.year = parseInt(year);
  //     }

  //     const response = await apiClient.get(apiEndpoints.salaries.list, { params });

  //     if (response.data.success) {
  //       const formattedData = response.data.data.map(salary => {
  //         // Get employee's total salary
  //         const totalSalary = salary.employee?.salaryDetails?.totalSalary || 0;
          
  //         // Get attendance data
  //         const monthDays = salary.attendanceData?.monthDays || 30;
  //         const presentDays = salary.attendanceData?.presentDays || 0;
  //         const halfDays = salary.attendanceData?.halfDays || 0; // ← NEW: Get half days
          
  //         // Calculate per day salary
  //         const perDay = monthDays > 0 ? (totalSalary / monthDays).toFixed(2) : 0;
          
  //         // ================= IMPORTANT FIX: Calculate final payment with half days =================
  //         // Present days full amount + Half days half amount
  //         const fullDaysAmount = (totalSalary / monthDays) * presentDays;
  //         const halfDaysAmount = (totalSalary / monthDays) * 0.5 * halfDays;
  //         const finalPayment = Math.round(fullDaysAmount + halfDaysAmount);

  //         return {
  //           ...salary,
  //           employeeId: salary.employee?.employeeId || 'N/A',
  //           name: salary.employee?.fullName || 'N/A',
  //           present: presentDays,
  //           halfDays: halfDays, // ← NEW: Half days count
  //           absent: salary.attendanceData?.absentDays || 0,
  //           totalDays: salary.attendanceData?.totalDays || 0,
  //           monthDays: monthDays,
  //           perDay: perDay,
  //           totalPayment: totalSalary,
  //           finalPayment: finalPayment // ← UPDATED: Now includes half days amount
  //         };
  //       });

  //       setSalaryData(formattedData);
  //       setTotalPages(response.data.pagination?.totalPages || response.data.pagination?.pages || 1);
  //       setTotalItems(response.data.pagination?.totalItems || formattedData.length);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching salary data:', error);
  //     toast.error('Failed to fetch salary data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSalaryData = async () => {
  try {
    setLoading(true);

    const params = {
      page: currentPage,
      limit: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    // Add search filters
    if (searchName) {
      params.search = searchName;
    }
    if (searchEmpId) {
      params.employeeId = searchEmpId; // Changed to match backend parameter
    }

    if (selectedRole) {
      params.role = selectedRole; // Changed to match employee role field
    }

    // Add month/year filters
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      params.month = parseInt(month);
      params.year = parseInt(year);
    }

    const response = await apiClient.get(apiEndpoints.salaries.list, { params });

    if (response.data.success) {
      const formattedData = response.data.data.map(salary => {
        // Get employee's total salary from response
        const totalSalary = salary.employee?.salaryDetails?.totalSalary || 0;
        
        // Get attendance data from response
        const monthDays = salary.attendanceData?.monthDays || 30;
        const fullPresentDays = salary.attendanceData?.presentDays || 0; // Full present days from backend
        const halfDays = salary.attendanceData?.halfDays || 0; // Half days count from backend
        
        // Calculate per day salary
        const perDay = monthDays > 0 ? (totalSalary / monthDays).toFixed(2) : 0;
        
        // ================= IMPORTANT: FINAL PAYMENT CALCULATION WITH HALF DAYS =================
        // Full present days ke liye full amount
        const fullDaysAmount = (totalSalary / monthDays) * fullPresentDays;
        // Half days ke liye half amount
        const halfDaysAmount = (totalSalary / monthDays) * 0.5 * halfDays;
        const finalPayment = Math.round(fullDaysAmount + halfDaysAmount);

        return {
          ...salary,
          employeeId: salary.employee?.employeeId || 'N/A',
          name: salary.employee?.fullName || 'N/A',
          present: fullPresentDays + halfDays, // UI mein total present days show karega (full + half)
          halfDays: halfDays, // Half days ka separate count
          absent: salary.attendanceData?.absentDays || 0,
          totalDays: salary.attendanceData?.totalDays || 0,
          monthDays: monthDays,
          perDay: perDay,
          totalPayment: totalSalary,
          finalPayment: finalPayment // ← UPDATED: Now includes half days calculation
        };
      });

      setSalaryData(formattedData);
      // Handle different pagination response formats
      setTotalPages(response.data.pagination?.totalPages || response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.totalItems || formattedData.length);
    }
  } catch (error) {
    console.error('Error fetching salary data:', error);
    toast.error('Failed to fetch salary data');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSalaryData();
  }, [currentPage, pageSize, selectedMonth, searchName, searchEmpId, selectedRole]);

  const handleViewSalaryDetails = (salaryId) => {
    navigate(`/admin/employee/salary/view/${salaryId}`);
  };

  const handleGenerateSalary = async (salaryPreview) => {
    try {
      setLoading(true);
      const payload = {
        employeeId: salaryPreview.employee._id,
        month: salaryPreview.month,
        year: salaryPreview.year,
        basicSalary: salaryPreview.basicSalary
      };

      const response = await apiClient.post(apiEndpoints.salaries.create, payload);

      if (response.data.success) {
        toast.success('Salary generated successfully');
        fetchSalaryData();
      } else {
        toast.error(response.data.message || 'Failed to generate salary');
      }
    } catch (error) {
      console.error('Error generating salary:', error);
      toast.error('Failed to generate salary');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSalaryData();
  };

  const handlePageChange = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Employee Salary Record</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Search By Name</label>
            <input
              type="text"
              placeholder="Search By Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
            <input
              type="text"
              placeholder="Search By Employee ID"
              value={searchEmpId}
              onChange={(e) => {
                setSearchEmpId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">All Roles</option>
              <option value="salesman">Salesperson</option>
              <option value="telecaller">Telecaller</option>
              <option value="admin">Admin User</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full text-black border-collapse rounded-lg text-sm" style={{ backgroundColor: '#F1F6F6' }}>
            <thead>
              <tr className="border-b border-gray-300" style={{ backgroundColor: '#F1F6F6' }}>
                <th className="p-3 font-semibold text-left">EMPLOYEE ID</th>
                <th className="p-3 font-semibold text-left">NAME</th>
                <th className="p-3 font-semibold text-center">PRESENT DAYS</th>
                <th className="p-3 font-semibold text-center">HALF DAYS</th> {/* ← NEW COLUMN */}
                <th className="p-3 font-semibold text-center">ABSENT DAYS</th>
                <th className="p-3 font-semibold text-center">TOTAL DAYS</th>
                <th className="p-3 font-semibold text-center">MONTHLY SALARY (₹)</th>
                <th className="p-3 font-semibold text-center">MONTH DAYS</th>
                <th className="p-3 font-semibold text-center">PER DAY PAYMENT (₹)</th>
                <th className="p-3 font-semibold text-center">FINAL PAYMENT (₹)</th>
                <th className="p-3 font-semibold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-gray-500">
                    No salary records found
                  </td>
                </tr>
              ) : (
                salaryData.map((salary, index) => (
                  <tr key={salary._id || salary.employee?._id || index} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="p-3">{salary.employeeId}</td>
                    <td className="p-3">{salary.name}</td>
                    <td className="p-3 text-center">{salary.present}</td>
                    <td className="p-3 text-center">{salary.halfDays}</td> {/* ← NEW: Half days display */}
                    <td className="p-3 text-center">{salary.absent}</td>
                    <td className="p-3 text-center">{salary.totalDays}</td>
                    <td className="p-3 text-center">{salary.totalPayment.toLocaleString()}</td>
                    <td className="p-3 text-center">{salary.monthDays}</td>
                    <td className="p-3 text-center">{salary.perDay}</td>
                    <td className="p-3 text-center">{salary.finalPayment.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {salary._id ? (
                        <button
                          onClick={() => handleViewSalaryDetails(salary._id)}
                          className="bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateSalary(salary)}
                          className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition-colors"
                        >
                          Generate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-700">
            Showing <span className="text-[#398C89]">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to{" "}
            <span className="text-[#398C89]">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
            <span className="text-[#398C89]">{totalItems}</span> entries
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] focus:outline-none transition"
              >
                {[5, 10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600 font-medium">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                Previous
              </button>

              {(() => {
                const pages = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else if (currentPage <= 4) {
                  pages.push(1, 2, 3, 4, 5);
                  pages.push("...");
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 3) {
                  pages.push(1);
                  pages.push("...");
                  for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  pages.push("...");
                  pages.push(currentPage - 1, currentPage, currentPage + 1);
                  pages.push("...");
                  pages.push(totalPages);
                }

                return pages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === "number" && handlePageChange(page)}
                    disabled={page === "..."}
                    className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
                      page === currentPage
                        ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
                        : page === "..."
                        ? "text-gray-500 cursor-default border-transparent"
                        : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                ));
              })()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryRecord;