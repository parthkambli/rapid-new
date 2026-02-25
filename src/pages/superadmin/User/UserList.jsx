// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const UserList = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchName, setSearchName] = useState("");
//   const [searchStatus, setSearchStatus] = useState("All");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editData, setEditData] = useState({});

//   // Fetch users from API
//   const fetchUsers = async (searchParams = {}) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = apiHelpers.buildSearchParams(searchParams.q || '', searchParams);
//       const response = await apiClient.get(apiEndpoints.users.list, { params });
//       setUsers(response.data.data || response.data || []);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError(err.response?.data?.message || 'Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleCreateUser = () => {
//     navigate("/admin/add-user");
//   };

//   const handleEditClick = (row) => {
//     setSelectedUser(row);
//     setEditData({ ...row, id: row._id || row.id });
//   };

//   const handleViewClick = (row) => {
//     navigate(`/admin/users/${row._id || row.id}`);
//   };

//   const handleDeleteClick = async (row) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       setLoading(true);
//       await apiClient.delete(apiEndpoints.users.delete(row._id || row.id));
//       await fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError(err.response?.data?.message || 'Failed to delete user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (row) => {
//     try {
//       setLoading(true);
//       await apiClient.put(apiEndpoints.users.toggleStatus(row._id || row.id));
//       await fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error('Error updating user status:', err);
//       setError(err.response?.data?.message || 'Failed to update user status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveEdit = async () => {
//     try {
//       setLoading(true);
//       await apiClient.put(apiEndpoints.users.update(editData._id || editData.id), editData);
//       setSelectedUser(null);
//       await fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError(err.response?.data?.message || 'Failed to update user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle search - use API search
//   useEffect(() => {
//     const searchParams = {
//       q: searchName,
//       role: searchStatus !== "All" ? searchStatus : undefined
//     };
//     fetchUsers(searchParams);
//   }, [searchName, searchStatus]);

//   // Filter out complex fields that can't be rendered by Table component
//   const filteredUsers = users.map(user => {
//     const { permissions, ...userData } = user;
//     // Ensure createdBy is a string, not an object
//     return {
//       ...userData,
//       createdBy: typeof userData.createdBy === 'object' ? userData.createdBy?.fullName || 'System' : userData.createdBy || 'System'
//     };
//   });

//   const actions = [
//     {
//       label: "Edit",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//       </svg>,
//       onClick: handleEditClick,
//     },
//     {
//       label: "Delete",
//       icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//       </svg>,
//       onClick: handleDeleteClick,
//     },
//   ];

//   if (loading && users.length === 0) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen mt-0 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen mt-0">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//         <button
//           onClick={() => fetchUsers()}
//           className="bg-[#2E7D78] text-white px-4 py-2 rounded hover:bg-[#256f6a]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen mt-0 ">
//       <div className="flex justify-between  items-center mb-4">
//         <h1 className="text-2xl font-bold">User Management</h1>
//         <button
//           onClick={handleCreateUser}
//           className="bg-[#2E7D78] text-white px-4 py-2 rounded hover:bg-[#256f6a]"
//           disabled={loading}
//         >
//           {loading ? 'Loading...' : 'Create User'}
//         </button>
//       </div>
//       <div className="flex flex-col md:flex-row gap-4 mb-4  p-2 rounded">
//       {/* <div className="grid grid-cols-3 gap-4 mb-4  p-2 rounded"> */}
//         <input
//           type="text"
//           placeholder="Search By Name"
//           className="w-full md:w-1/3 p-2 border rounded bg-[#D0D5D4]"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         <select
//           className="w-full md:w-1/3 p-2 border rounded bg-[#D0D5D4]"
//           value={searchStatus}
//           onChange={(e) => setSearchStatus(e.target.value)}
//         >
//           <option value="All">Search By Role</option>
//           <option value="admin">Admin</option>
//           <option value="super_admin">Super Admin</option>
//           <option value="sales">Sales</option>
//           <option value="salesman">Salesman</option>
//           <option value="telecaller">Telecaller</option>
//           <option value="advocate">Advocate</option>
//           <option value="doctor">Doctor</option>
//           <option value="expert">Expert</option>
//         </select>
//       </div>
//       <Table
//         data={filteredUsers}
//         actions={actions}
//         extraColumns={[
//           {
//             header: "Status",
//             render: (row) => (
//               <button
//                 onClick={() => handleToggleStatus(row)}
//                 className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${row.status ? 'bg-[#40B126]' : 'bg-[#D32F2F]'}`}
//               >
//                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform ${row.status ? 'translate-x-5' : 'translate-x-0'}`}></div>
//               </button>
//             ),
//           },
//           {
//             header: "Actions",
//             render: (row) => (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleViewClick(row)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEditClick(row)}
//                   className="text-green-600 hover:text-green-800"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeleteClick(row)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   Delete
//                 </button>
//               </div>
//             )
//           }
//         ]}
//       />
//     </div>
//   );
// };

// export default UserList;






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient from "../../../services/apiClient";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("All");
  const [searchPanel, setSearchPanel] = useState("All");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // ✅ CORRECTED: Fetch users with proper pagination
  const fetchUsers = async (page = 1, searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Simple params banao
      const params = {
        page: page,
        limit: pagination.limit,
        ...(searchParams.q && { search: searchParams.q }),
        ...(searchParams.role && searchParams.role !== "All" && { role: searchParams.role }),
        ...(searchParams.panel && searchParams.panel !== "All" && { panel: searchParams.panel })
      };

      // ✅ Direct endpoint use karo
      const response = await apiClient.get('/users', { params });
      const responseData = response.data;
      
      console.log('API Response:', responseData); // Debug ke liye
      
      // ✅ Response format handle karo
      if (responseData.success) {
        // Agar data array mein hai
        if (Array.isArray(responseData.data)) {
          setUsers(responseData.data);
        } 
        // Agar data object mein hai
        else if (responseData.data && Array.isArray(responseData.data.users)) {
          setUsers(responseData.data.users);
        }
        // Agar direct array hai
        else if (Array.isArray(responseData)) {
          setUsers(responseData);
        }
        
        // ✅ Pagination handle karo
        if (responseData.pagination) {
          setPagination(prev => ({
            ...prev,
            page: responseData.pagination.current || responseData.pagination.page || 1,
            total: responseData.pagination.total || 0,
            totalPages: responseData.pagination.pages || responseData.pagination.totalPages || 0
          }));
        } else if (responseData.data && responseData.data.pagination) {
          setPagination(prev => ({
            ...prev,
            page: responseData.data.pagination.current || responseData.data.pagination.page || 1,
            total: responseData.data.pagination.total || 0,
            totalPages: responseData.data.pagination.pages || responseData.data.pagination.totalPages || 0
          }));
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // ✅ Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1, {
        q: searchName,
        role: searchRole !== "All" ? searchRole : undefined,
        panel: searchPanel !== "All" ? searchPanel : undefined
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchName, searchRole, searchPanel]);

  // ✅ Create User
  const handleCreateUser = () => {
    navigate("/Superadmin/add-user");
  };

  // ✅ Edit User
  const handleEditClick = (row) => {
    navigate(`/Superadmin/users/edit/${row._id || row.id}`);
  };

  // ✅ View User
  const handleViewClick = (row) => {
    navigate(`/Superadmin/users/${row._id || row.id}`);
  };

  // ✅ Delete User
  const handleDeleteClick = async (row) => {
    if (!window.confirm(`Are you sure you want to delete user "${row.fullName || row.name}"?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(`/users/${row._id || row.id}`);
      await fetchUsers(pagination.page); // Refresh current page
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle User Status
  const handleToggleStatus = async (row) => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} user "${row.fullName || row.name}"?`)) return;

    try {
      setLoading(true);
      // Using the toggle endpoint which cycles through statuses
      await apiClient.put(`/users/${row._id || row.id}/toggle-status`);
      await fetchUsers(pagination.page); // Refresh current page
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Page Change
  const handlePageChange = (newPage) => {
    fetchUsers(newPage, {
      q: searchName,
      role: searchRole !== "All" ? searchRole : undefined,
      panel: searchPanel !== "All" ? searchPanel : undefined
    });
  };

  // ✅ Table actions for your Table component
  const actions = [
    {
      label: "View",
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleViewClick,
      showAsIcon: true
    },
    {
      label: "Edit",
      icon: (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: handleEditClick,
      showAsIcon: true
    },
    {
      label: "Delete",
      icon: (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: handleDeleteClick,
      showAsIcon: true
    },
  ];

  // ✅ Filter out complex fields for Table component
  const tableData = users.map(user => {
    const { permissions, password, __v, ...userData } = user;
    
    return {
      ...userData,
      id: userData._id || userData.id,
      name: userData.fullName || userData.name || userData.username,
      email: userData.email || '-',
      role: userData.role || '-',
      panel: userData.panel || '-',
      status: userData.status || 'active',
      phone: userData.phoneNumber || userData.contact || '-',
      created: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '-',
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never'
    };
  });

  // ✅ Extra columns for Table component
  const extraColumns = [
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(row)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${
              row.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={row.status === 'active' ? 'Deactivate user' : 'Activate user'}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              row.status === 'active' ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
          <span className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] text-center ${
            row.status === 'active' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {row.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleViewClick(row)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View User"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
            title="Edit User"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
            title="Delete User"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // ✅ Loading State
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="block mb-1">Error Loading Users</strong>
            {error}
          </div>
          <button
            onClick={() => fetchUsers(1)}
            className="bg-[#2E7D78] text-white px-6 py-2 rounded-lg hover:bg-[#256f6a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[80vw] mx-auto py-4 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Manage system users, permissions and access levels
            </p>
          </div>
          <button
            onClick={handleCreateUser}
            className="bg-[#2E7D78] text-white px-6 py-3 rounded-lg hover:bg-[#256f6a] transition-colors flex items-center gap-2 w-full lg:w-auto justify-center"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter user name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent pr-10"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter by Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent bg-white"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="sales">Sales</option>
                <option value="salesman">Salesman</option>
                <option value="telecaller">Telecaller</option>
                <option value="advocate">Advocate</option>
                <option value="doctor">Doctor</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Filter by Panel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Panel
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent bg-white"
                value={searchPanel}
                onChange={(e) => setSearchPanel(e.target.value)}
              >
                <option value="All">All Panels</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="salesman">Salesman</option>
                <option value="telecaller">Telecaller</option>
                <option value="doctor">Doctor</option>
                <option value="advocate">Advocate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Table */}
          <Table
            data={tableData}
            // actions={actions}
            extraColumns={extraColumns}
          />

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                  <span className="font-semibold">{pagination.total}</span> results
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Info */}
                  <div className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
                    Page <span className="font-semibold">{pagination.page}</span> of{" "}
                    <span className="font-semibold">{pagination.totalPages}</span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or create a new user.</p>
              <button
                onClick={handleCreateUser}
                className="bg-[#2E7D78] text-white px-6 py-2 rounded-lg hover:bg-[#256f6a] transition-colors"
              >
                Create First User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;