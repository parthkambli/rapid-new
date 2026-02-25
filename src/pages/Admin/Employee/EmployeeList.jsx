// import React, { useState, useEffect } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// const EmployeeList = () => {
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [statuses, setStatuses] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [searchName, setSearchName] = useState("");
//   const [searchId, setSearchId] = useState("");
//   const [searchRole, setSearchRole] = useState("");

//   // FETCH DATA
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.employees.list);
//         const data = response.data.data;

//         const formatted = data.map(emp => ({
//         _id: emp._id,  // ← YE LINE ADD KAR DO!
//           employeeId: emp.employeeId,
//           fullName: emp.fullName,
//           phoneNumber: emp.phoneNumber,
//           email: emp.email,
//           role: emp.role,
//           joiningDate: new Date(emp.joiningDate).toLocaleDateString("en-GB"), // DD-MM-YYYY
//           status: emp.status,
//         }));

//         setEmployees(formatted);

//         const initialStatuses = {};
//         formatted.forEach(emp => {
//           initialStatuses[emp.employeeId] = emp.status === "active";
//         });
//         setStatuses(initialStatuses);
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Failed to load employees");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // FILTER
//   const filteredEmployees = employees.filter(emp => {
//     return (
//       emp.fullName.toLowerCase().includes(searchName.toLowerCase()) &&
//       emp.employeeId.toLowerCase().includes(searchId.toLowerCase()) &&
//       emp.role.toLowerCase().includes(searchRole.toLowerCase())
//     );
//   });

//   // ACTIONS
//   const actions = [
//     {
//       label: "View",
//       icon: (
//         <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         </svg>
//       ),
//       onClick: (row) => navigate(`/admin/employee/view/${row._id}`),
//       showAsIcon: true,
//     },
//     {
//       label: "Edit",
//       icon: (
//         <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//         </svg>
//       ),
//       onClick: (row) => navigate(`/admin/employee/edit/${row._id}`),
//       showAsIcon: true,
//     },
//     {
//       label: "Delete",
//       icon: (
//         <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//         </svg>
//       ),
//       onClick: async (row) => {
//         if (window.confirm(`Delete ${row.fullName}?`)) {
//           try {
//             await apiClient.delete(`${apiEndpoints.employees.delete}/${row._id}`);
//             setEmployees(prev => prev.filter(e => e._id !== row._id));
//             alert("Deleted!");
//           } catch {
//             alert("Delete failed");
//           }
//         }
//       },
//       showAsIcon: true,
//     },
//   ];

//   // STATUS TOGGLE
//   const extraColumns = [
//     {
//       header: "Status",
//       render: (row) => (
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={statuses[row.employeeId] || false}
//             onChange={async () => {
//               const newStatus = !statuses[row.employeeId];
//               try {
//                 await apiClient.patch(`${apiEndpoints.employees.update}/${row._id}`, {
//                   status: newStatus ? "active" : "inactive"
//                 });
//                 setStatuses(prev => ({ ...prev, [row.employeeId]: newStatus }));
//               } catch {
//                 alert("Status update failed");
//               }
//             }}
//             className="sr-only peer"
//           />
//           <div
//             className={`w-11 h-6 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-600 ${
//               statuses[row.employeeId] ? "bg-green-500" : "bg-red-500"
//             }`}
//           ></div>
//         </label>
//       ),
//     },
//   ];

//   const handleAddEmployee = () => {
//     navigate("/admin/employee/add");
//   };

//   if (loading) return <div className="text-center p-8">Loading...</div>;

//   return (
//     <div className="max-w-[78vw] p-2 min-h-screen">
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-xl font-semibold text-gray-800">Employee Management</h1>
//         <button
//           onClick={handleAddEmployee}
//           className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641] font-medium"
//         >
//           Add Employee
//         </button>
//       </div>

//       {/* SEARCH */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         <div className="flex flex-col">
//           <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//           <input
//             type="text"
//             placeholder="Name"
//             className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm text-gray-600 mb-1">Search By ID</label>
//           <input
//             type="text"
//             placeholder="Employee ID"
//             className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//             value={searchId}
//             onChange={(e) => setSearchId(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm text-gray-600 mb-1">Search By Role</label>
//           <input
//             type="text"
//             placeholder="Role"
//             className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//             value={searchRole}
//             onChange={(e) => setSearchRole(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mb-6">
//         <Table
//           data={filteredEmployees}
//           actions={actions}
//           extraColumns={extraColumns}
//           pagination={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;












import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const EmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchRole, setSearchRole] = useState("");

  // SERVER-SIDE PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // FETCH DATA ON PAGE OR PAGESIZE CHANGE
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.employees.list, {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        });

        const data = response.data.data;
        setTotalEmployees(response.data.pagination.total);

        const formatted = data.map(emp => ({
          _id: emp._id,
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          phoneNumber: emp.phoneNumber,
          email: emp.email,
          role: emp.role,
          joiningDate: new Date(emp.joiningDate).toLocaleDateString("en-GB"),
          status: emp.status,
        }));

        setEmployees(formatted);

        const initialStatuses = {};
        formatted.forEach(emp => {
          initialStatuses[emp.employeeId] = emp.status === "active";
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage, pageSize]);

  // FILTER ON CURRENT PAGE DATA
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchName.toLowerCase()) &&
    emp.employeeId.toLowerCase().includes(searchId.toLowerCase()) &&
    emp.role.toLowerCase().includes(searchRole.toLowerCase())
  );

  // ACTIONS
  const actions = [
    {
      label: "View", icon: <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
      onClick: (row) => navigate(`/admin/employee/view/${row._id}`), showAsIcon: true,
    },
    {
      label: "Edit", icon: <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
      onClick: (row) => navigate(`/admin/employee/edit/${row._id}`), showAsIcon: true,
    },
    {
      label: "Delete", icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: async (row) => {
        if (window.confirm(`Delete ${row.fullName}?`)) {
          try {
            await apiClient.delete(`${apiEndpoints.employees.delete}/${row._id}`);
            setEmployees(prev => prev.filter(e => e._id !== row._id));
            alert("Deleted!");
          } catch { alert("Delete failed"); }
        }
      },
      showAsIcon: true,
    },
  ];

  // STATUS TOGGLE
  const extraColumns = [
    {
      header: "Status",
      render: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={statuses[row.employeeId] || false}
    //         onChange={async () => {
    //           const newStatus = !statuses[row.employeeId];
    //           try {
               
               
    // //            await apiClient.put(
    // //   apiEndpoints.employees.update(row._id),           // ← Use _id (most APIs use mongo _id)
    // //   { status: newStatus ? "active" : "inactive" }
    // // );
            
    
    
    // await apiClient.put(
    //   apiEndpoints.employees.update(row._id),
    //   { 
    //     data: JSON.stringify({ status: statusValue })   // ← ये लाइन सबसे महत्वपूर्ण
    //   }
    // );
    
    // // await apiClient.put(`${employees.update(employeeId)}`, { status: newStatus ? "active" : "inactive" });
    //             setStatuses(prev => ({ ...prev, [row.employeeId]: newStatus }));
    //           } catch { alert("Status update failed"); }
    //         }}

// STATUS TOGGLE के अंदर
onChange={async () => {
  const newStatus = !statuses[row.employeeId];
  const statusValue = newStatus ? "active" : "inactive";

  try {
    await apiClient.put(
      apiEndpoints.employees.update(row._id),
      { 
        data: JSON.stringify({ status: statusValue })   // ← ये लाइन सबसे महत्वपूर्ण
      }
    );

    setStatuses(prev => ({ ...prev, [row.employeeId]: newStatus }));
    alert("Status updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Status update failed");
  }
}}

            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-600 ${statuses[row.employeeId] ? "bg-green-500" : "bg-red-500"}`}></div>
        </label>
      ),
    },
  ];

  const handleAddEmployee = () => navigate("/admin/employee/add");

  if (loading) return <div className="text-center p-8 text-xl">Loading...</div>;

  return (
    <div className="max-w-[78vw] p-2 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Employee Management</h1>
        <button onClick={handleAddEmployee} className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641] font-medium">
          Add Employee
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex flex-col"><label className="text-sm text-gray-600 mb-1">Search By Name</label><input type="text" placeholder="Name" className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm" value={searchName} onChange={(e) => setSearchName(e.target.value)} /></div>
        <div className="flex flex-col"><label className="text-sm text-gray-600 mb-1">Search By ID</label><input type="text" placeholder="Employee ID" className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm" value={searchId} onChange={(e) => setSearchId(e.target.value)} /></div>
        <div className="flex flex-col"><label className="text-sm text-gray-600 mb-1">Search By Role</label><input type="text" placeholder="Role" className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm" value={searchRole} onChange={(e) => setSearchRole(e.target.value)} /></div>
      </div>

      {/* TABLE WITH FULL SERVER-SIDE PAGINATION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <Table
          data={filteredEmployees}
          actions={actions}
          extraColumns={extraColumns}
          pagination={true}
          defaultPageSize={pageSize}

          // YE PROPS ADD KIYE — SERVER-SIDE KE LIYE
          serverPagination={true}
          totalServerItems={totalEmployees}
          currentServerPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeList;