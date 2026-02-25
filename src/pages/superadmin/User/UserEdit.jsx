// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import apiClient from "../../../services/apiClient";

// const UserEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);
  
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     fullName: "",
//     phoneNumber: "",
//     role: "",
//     panel: "",
//     status: "active",
//     remarks: ""
//   });

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await apiClient.get(`/users/${id}`);
      
//       if (response.data.success) {
//         const userData = response.data.data;
//         setUser(userData);
//         setFormData({
//           username: userData.username || "",
//           email: userData.email || "",
//           fullName: userData.fullName || "",
//           phoneNumber: userData.phoneNumber || "",
//           role: userData.role || "",
//           panel: userData.panel || "",
//           status: userData.status || "active",
//           remarks: userData.remarks || ""
//         });
//       } else {
//         setError("User not found");
//       }
//     } catch (err) {
//       console.error('Error fetching user:', err);
//       setError(err.response?.data?.message || 'Failed to load user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (!formData.username || !formData.email || !formData.fullName || !formData.role || !formData.panel) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const response = await apiClient.put(`/users/${id}`, formData);

//       if (response.data.success) {
//         navigate('/admin/all-users', { 
//           state: { 
//             message: 'User updated successfully!' 
//           } 
//         });
//       } else {
//         setError(response.data.message || 'Failed to update user');
//       }
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError(err.response?.data?.message || 'Failed to update user');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     const newPassword = prompt('Enter new password for this user:');
//     if (!newPassword) return;

//     if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
//       return;
//     }

//     try {
//       setSaving(true);
//       const response = await apiClient.put(`/users/${id}`, {
//         password: newPassword
//       });
      
//       if (response.data.success) {
//         alert('Password reset successfully!');
//       } else {
//         setError(response.data.message || 'Failed to reset password');
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to reset password';
//       setError(msg);
//       alert(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     return status === 'active' 
//       ? 'bg-green-100 text-green-800 border border-green-200'
//       : 'bg-red-100 text-red-800 border border-red-200';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading user details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
//             <strong className="block mb-1">Error</strong>
//             {error || 'User not found'}
//           </div>
//           <button
//             onClick={() => navigate('/admin/users')}
//             className="bg-[#2E7D78] text-white px-6 py-2 rounded-lg hover:bg-[#256f6a] transition-colors"
//           >
//             Back to Users
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <button
//                 onClick={() => navigate('/admin/users')}
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Edit User</h1>
//             </div>
//             <p className="text-gray-600 ml-10">Update user information and settings</p>
//           </div>
          
//           <div className="flex gap-3 w-full lg:w-auto">
//             <Link
//               to={`/admin/users/${user._id}`}
//               className="flex-1 lg:flex-none bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//               View User
//             </Link>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* User Info Form */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Username *
//                   </label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Role *
//                   </label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                     required
//                   >
//                     <option value="">Select Role</option>
//                     <option value="admin">Admin</option>
//                     <option value="super_admin">Super Admin</option>
//                     <option value="sales">Sales</option>
//                     <option value="salesman">Salesman</option>
//                     <option value="telecaller">Telecaller</option>
//                     <option value="doctor">Doctor</option>
//                     <option value="advocate">Advocate</option>
//                     <option value="expert">Expert</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Panel *
//                   </label>
//                   <select
//                     name="panel"
//                     value={formData.panel}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                     required
//                   >
//                     <option value="">Select Panel</option>
//                     <option value="admin">Admin</option>
//                     <option value="employee">Employee</option>
//                     <option value="salesman">Salesman</option>
//                     <option value="telecaller">Telecaller</option>
//                     <option value="doctor">Doctor</option>
//                     <option value="advocate">Advocate</option>
//                     <option value="expert">Expert</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
                
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={handleResetPassword}
//                     className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
//                     disabled={saving}
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                     Reset Password
//                   </button>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Remarks
//                 </label>
//                 <textarea
//                   name="remarks"
//                   value={formData.remarks}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
//                   placeholder="Any additional remarks or notes..."
//                 />
//               </div>

//               <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/admin/users')}
//                   className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="px-6 py-3 bg-[#2E7D78] text-white rounded-lg hover:bg-[#256f6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {saving ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     'Update User'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* User Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">User Summary</h3>
              
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D78] to-[#1B504E] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
//                     {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
//                   </div>
//                   <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
//                   <p className="text-sm text-gray-600">{user.email}</p>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">User ID:</span>
//                     <span className="text-sm font-mono text-gray-800">{user.userId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Status:</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
//                       {user.status === 'active' ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Role:</span>
//                     <span className="text-sm text-gray-800 capitalize">{user.role}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Panel:</span>
//                     <span className="text-sm text-gray-800 capitalize">{user.panel}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Created:</span>
//                     <span className="text-sm text-gray-800">
//                       {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Last Login:</span>
//                     <span className="text-sm text-gray-800">
//                       {user.lastLogin 
//                         ? new Date(user.lastLogin).toLocaleDateString() 
//                         : 'Never'
//                       }
//                     </span>
//                   </div>
//                 </div>

//                 {/* Permissions Summary */}
//                 {user.permissions && user.permissions.length > 0 && (
//                   <div className="pt-4 border-t border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-medium text-gray-700">Permissions:</span>
//                       <span className="text-sm text-gray-600">{user.permissions.length} forms</span>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="flex justify-between text-xs">
//                         <span className="text-gray-500">Full Access:</span>
//                         <span className="text-green-600 font-medium">
//                           {user.permissions.filter(p => p.full).length}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-xs">
//                         <span className="text-gray-500">Read Only:</span>
//                         <span className="text-blue-600 font-medium">
//                           {user.permissions.filter(p => p.read && !p.write && !p.edit && !p.delete).length}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserEdit;

















import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import { isPermissionDisabled, isPermissionDisabledForPanel, getAvailableActions } from "../../../utils/permissionRules";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "",
    panel: "",
    status: "active",
    remarks: ""
  });

  // Permissions states (same as UserManagement)
  const [forms, setForms] = useState([]);
  const [formSearch, setFormSearch] = useState("");
  const [overrideMode, setOverrideMode] = useState(false);
  const [additionalPanels, setAdditionalPanels] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Get forms based on selected panel (same as UserManagement)
  const getFormsForPanel = (selectedPanel) => {
    if (!selectedPanel) return [];
    const panelFormsMap = {
      admin: [
        "Dashboard",
        "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
        "Doctor Management", "Total Doctor List", "Add Doctor", "Accept Doctor", "Doctor Follow-ups",
        "Quotation List",
        "Sales Bill List",
        "Receipt List",
        "Policy Management", "Policy List", "Add Policy", "Insurance Companies", "Insurance Types",
        "Renewal Alert List", "Service Renewal Alert List", "Indemnity Renewal Alert List",
        "Services Package List", "Services Package List", "Create Service Package",
        "Queries or Case", "Queries or Case", "Create Query Case",
        "User Management", "All Users", "Add User",
        "Advocate List", "Advocate List", "Create Advocate",
        "Expert List", "Expert List", "Create Expert List",
        "Expense List",
        "Reports", "Employee Reports", "Doctor Reports", "Policy Reports", "Advocate Reports", "Expert Reports", "Expense Reports", "Case Wise Reports", "Dr. DOB Reports", "Statement of Account"
      ],
      employee: [
        "Dashboard",
        "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
        "User Management", "All Users", "Add User"
      ],
      salesman: [
        "Dashboard",
        "Doctor Management", "Total Doctor List", "Add Doctor",
        "Quotation List",
        "Sales Bill List",
        "Receipt List"
      ],
      telecaller: [
        "Dashboard",
        "Doctor Management", "Total Doctor List",
        "Quotation List"
      ],
      doctor: [
        "Dashboard",
        "My Profile", "Personal Details", "Membership Details",
        "Policy History", "Case List", "Case History", "Payments", "Documents"
      ],
      advocate: [
        "My Assigned Cases", "Update Follow-up", "View History", "Close Case", "Reports"
      ],
      expert: [
        "Assigned Cases", "Give Opinion", "Upload Report", "Reports"
      ]
    };
    return panelFormsMap[selectedPanel] || [];
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(`/users/${id}`);
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        
        // Set basic form data
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          password: "", // Don't load password
          fullName: userData.fullName || "",
          phoneNumber: userData.phoneNumber || "",
          role: userData.role || "",
          panel: userData.panel || "",
          status: userData.status || "active",
          remarks: userData.remarks || ""
        });

        // Set additional panels
        setAdditionalPanels(userData.additionalPanels || []);

        // Load forms and permissions
        loadFormsAndPermissions(userData);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const loadFormsAndPermissions = (userData) => {
    // Get forms from primary panel
    let allForms = [...getFormsForPanel(userData.panel)];
    
    // Add forms from additional panels if any
    if (userData.additionalPanels && userData.additionalPanels.length > 0) {
      userData.additionalPanels.forEach(panel => {
        const forms = getFormsForPanel(panel);
        forms.forEach(form => {
          if (!allForms.includes(form)) {
            allForms.push(form);
          }
        });
      });
    }
    
    // Create forms with user's existing permissions
    const newForms = allForms.map((name, idx) => {
      const userPerm = userData.permissions?.find(p => p.formName === name);
      return {
        id: idx,
        name,
        read: userPerm?.read || false,
        write: userPerm?.write || false,
        edit: userPerm?.edit || false,
        delete: userPerm?.delete || false,
        full: userPerm?.full || false,
      };
    });
    
    setForms(newForms);
  };

  // Handle basic form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If panel changes, reload forms
    if (name === 'panel') {
      const allForms = [...getFormsForPanel(value)];
      
      // Add forms from additional panels
      if (additionalPanels.length > 0) {
        additionalPanels.forEach(panel => {
          const forms = getFormsForPanel(panel);
          forms.forEach(form => {
            if (!allForms.includes(form)) {
              allForms.push(form);
            }
          });
        });
      }
      
      const newForms = allForms.map((name, idx) => ({
        id: idx,
        name,
        read: false,
        write: false,
        edit: false,
        delete: false,
        full: false,
      }));
      setForms(newForms);
    }
  };

  // Handle permission checkbox changes (same as UserManagement)
  const handlePermissionChange = (idx, perm, value) => {
    const updated = [...forms];

    // Check if this permission is disabled for the current panel
    if (!overrideMode && isPermissionDisabledForPanel(forms[idx].name, perm, formData.panel)) {
      return; // Don't allow changing disabled permissions unless in override mode
    }

    updated[idx][perm] = value;

    if (perm === "full") {
      const availableActions = getAvailableActions(forms[idx].name, formData.panel);
      availableActions.forEach(p => {
        updated[idx][p] = value;
      });
      // Also set disabled actions if in override mode
      if (overrideMode) {
        ["read", "write", "edit", "delete"].forEach(p => {
          if (!availableActions.includes(p)) {
            updated[idx][p] = value;
          }
        });
      }
    } else {
      const availableActions = getAvailableActions(forms[idx].name, formData.panel);
      const allAvailableChecked = availableActions.every(p => updated[idx][p]);
      const allChecked = allAvailableChecked && (!overrideMode ||
        ["read", "write", "edit", "delete"].every(p => updated[idx][p]));
      updated[idx].full = allChecked;
    }
    setForms(updated);
  };

  // Column all permissions (same as UserManagement)
  const colAll = (perm, value) => {
    const updated = forms.map((f, idx) => {
      // Check if this permission is disabled for this form and panel
      if (!overrideMode && isPermissionDisabledForPanel(f.name, perm, formData.panel)) {
        return f; // Don't change disabled permissions
      }
      return { ...f, [perm]: value };
    });

    updated.forEach((f, i) => {
      const availableActions = getAvailableActions(f.name, formData.panel);
      const allAvailableChecked = availableActions.every(p => updated[i][p]);
      const allChecked = allAvailableChecked && (!overrideMode ||
        ["read", "write", "edit", "delete"].every(p => updated[i][p]));
      f.full = allChecked;
    });
    setForms(updated);
  };

  const clearMatrix = () => {
    const updated = forms.map(f => ({ ...f, read: false, write: false, edit: false, delete: false, full: false }));
    setForms(updated);
  };

  // Apply preset permissions based on role
  const applyPreset = (presetRole) => {
    if (forms.length === 0) return;

    clearMatrix();
    const updated = [...forms];

    const check = (filter, perms) => {
      updated.forEach((f, i) => {
        if (filter(f.name)) {
          perms.forEach(p => {
            if (!overrideMode && isPermissionDisabledForPanel(f.name, p, formData.panel)) {
              return; // Skip disabled permissions
            }
            f[p] = true;
          });
          const availableActions = getAvailableActions(f.name, formData.panel);
          f.full = availableActions.every(p => f[p]);
        }
      });
    };

    if (presetRole === "Admin") {
      ["read", "write", "edit", "delete"].forEach(p => colAll(p, true));
    } else if (presetRole === "Telecaller") {
      check(n => /Calling List|Assigned Tasks|Follow-ups|Doctor Forms|Doctor Directory|Quotation|Reports/i.test(n), ["read"]);
      check(n => /Calling List|Assigned Tasks|Follow-ups|Quotation/i.test(n), ["write", "edit"]);
    } else if (presetRole === "Salesman") {
      check(n => /Leads|Quotations|Sales Bills|Receipts|Doctor Onboarding|Reports|Dashboard/i.test(n), ["read"]);
      check(n => /Leads|Quotations|Sales Bills|Receipts/i.test(n), ["write", "edit"]);
    } else if (presetRole === "Advocates") {
      check(n => /Assigned Cases|My Assigned Cases|View History|Close Case|Reports|Update Follow-up/i.test(n), ["read", "write", "edit"]);
    } else if (presetRole === "Experts") {
      check(n => /Assigned Cases|Give Opinion|Upload Report|Reports/i.test(n), ["read", "write", "edit"]);
    }

    setForms(updated);
  };

  const presetReadOnly = () => {
    colAll("read", true);
    ["write", "edit", "delete"].forEach(p => colAll(p, false));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.fullName || !formData.role || !formData.panel) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Prepare permissions array
      const permissionsArray = forms.map(f => ({
        formName: f.name,
        read: f.read,
        write: f.write,
        edit: f.edit,
        delete: f.delete,
        full: f.full
      }));

      // Prepare user data
      const userData = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        panel: formData.panel,
        additionalPanels: additionalPanels,
        permissions: permissionsArray,
        status: formData.status,
        remarks: formData.remarks
      };

      // Include password only if provided
      if (formData.password) {
        userData.password = formData.password;
      }

      const response = await apiClient.put(`/users/${id}`, userData);

      if (response.data.success) {
        navigate('/superadmin/all-users', { 
          state: { 
            message: 'User updated successfully!' 
          } 
        });
      } else {
        setError(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  // Reset password function
  const handleResetPassword = async () => {
    const newPassword = prompt('Enter new password for this user:');
    if (!newPassword) return;

    if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.put(`/users/${id}`, {
        password: newPassword
      });
      
      if (response.data.success) {
        alert('Password reset successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Generate secure password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
    alert(`Generated password: ${password}\nMake sure to share this securely with the user!`);
  };

  const filteredForms = forms.filter(f => f.name.toLowerCase().includes(formSearch.toLowerCase()));

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-red-100 text-red-800 border border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="block mb-1">Error</strong>
            {error || 'User not found'}
          </div>
          <button
            onClick={() => navigate('/superadmin/all-users')}
            className="bg-[#2E7D78] text-white px-6 py-2 rounded-lg hover:bg-[#256f6a] transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/superadmin/all-users')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Edit User</h1>
            </div>
            <p className="text-gray-600 ml-10">Update user information, permissions and settings</p>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <Link
              to={`/Superadmin/users/${user._id}`}
              className="flex-1 lg:flex-none bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View User
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Info Form & Permissions */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      value={formData.password} 
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      type={showPassword ? "text" : "password"} 
                      placeholder="New password (optional)" 
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} 
                      className="px-3 py-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={handleResetPassword}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Reset Password
                    </button>
                    <button 
                      type="button"
                      onClick={generatePassword}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Generate Password
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="sales">Sales</option>
                    <option value="salesman">Salesman</option>
                    <option value="telecaller">Telecaller</option>
                    <option value="doctor">Doctor</option>
                    <option value="advocate">Advocate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Panel *
                  </label>
                  <select
                    name="panel"
                    value={formData.panel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                    required
                  >
                    <option value="">Select Panel</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="salesman">Salesman</option>
                    <option value="telecaller">Telecaller</option>
                    <option value="doctor">Doctor</option>
                    <option value="advocate">Advocate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Additional Panels Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Panels (Optional)</label>
                <div className="flex flex-wrap gap-3">
                  {["admin", "employee", "salesman", "telecaller", "doctor", "advocate", "expert"]
                    .filter(p => p !== formData.panel)
                    .map((availablePanel) => (
                      <label key={availablePanel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={additionalPanels.includes(availablePanel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAdditionalPanels([...additionalPanels, availablePanel]);
                              // Add forms from this panel
                              const newForms = getFormsForPanel(availablePanel);
                              const currentFormNames = forms.map(f => f.name);
                              newForms.forEach(formName => {
                                if (!currentFormNames.includes(formName)) {
                                  setForms(prev => [...prev, {
                                    id: prev.length,
                                    name: formName,
                                    read: false,
                                    write: false,
                                    edit: false,
                                    delete: false,
                                    full: false
                                  }]);
                                }
                              });
                            } else {
                              setAdditionalPanels(additionalPanels.filter(p => p !== availablePanel));
                              // Remove forms from this panel (only if not in primary panel)
                              const formsToRemove = getFormsForPanel(availablePanel);
                              setForms(prev => prev.filter(f => 
                                !formsToRemove.includes(f.name) || 
                                getFormsForPanel(formData.panel).includes(f.name)
                              ));
                            }
                          }}
                          className="mr-2 w-4 h-4 text-[#2E7D78] border-gray-300 rounded focus:ring-[#2E7D78]"
                        />
                        <span className="text-sm text-gray-700 capitalize">{availablePanel}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent"
                  placeholder="Any additional remarks or notes..."
                />
              </div>
            </div>

            {/* Permissions Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Forms & Permissions</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-block bg-[#eef8f7] border border-[#e0ece7] text-[#246a60] px-2 py-1 rounded-full text-xs font-bold">
                    {forms.length} forms
                  </span>
                  <button onClick={() => colAll("read", true)} className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">All Read</button>
                  <button onClick={() => colAll("write", true)} className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">All Write</button>
                  <button onClick={() => colAll("edit", true)} className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">All Edit</button>
                  <button onClick={() => colAll("delete", true)} className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">All Delete</button>
                  <button onClick={clearMatrix} className="px-3 py-1 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600">Clear</button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-sm text-gray-600">Quick presets:</span>
                {["Admin", "Telecaller", "Salesman", "Advocates", "Experts"].map(r => (
                  <button 
                    key={r} 
                    onClick={() => applyPreset(r)} 
                    className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {r}
                  </button>
                ))}
                <button onClick={presetReadOnly} className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Read-only
                </button>
              </div>

              {/* Override Toggle */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={overrideMode}
                  onChange={e => setOverrideMode(e.target.checked)}
                  className="w-4 h-4 text-[#2E7D78] rounded focus:ring-[#2E7D78]"
                />
                <span className="text-sm font-medium text-gray-700">
                  {overrideMode ? "Override Mode ON (All editable)" : "Enable Override"}
                </span>
                {overrideMode && <span className="text-xs text-amber-600">Manual control</span>}
              </div>

              {/* Form Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search forms</label>
                <input 
                  value={formSearch} 
                  onChange={e => setFormSearch(e.target.value)} 
                  type="text" 
                  placeholder="Type to filter forms..." 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D78] focus:border-transparent" 
                />
              </div>

              {/* Permissions Table */}
              <div className="border border-gray-200 rounded-lg overflow-auto max-h-96">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50 text-gray-700 font-bold">
                    <tr>
                      <th className="p-3 text-left text-sm" style={{ minWidth: "260px" }}>Form / Section</th>
                      <th className="p-3 text-center text-sm">Read</th>
                      <th className="p-3 text-center text-sm">Write</th>
                      <th className="p-3 text-center text-sm">Edit</th>
                      <th className="p-3 text-center text-sm">Delete</th>
                      <th className="p-3 text-center text-sm">Full</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredForms.map((f, i) => (
                      <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-800">{f.name}</td>
                        {["read", "write", "edit", "delete", "full"].map(perm => {
                          const disabled = !overrideMode && isPermissionDisabledForPanel(f.name, perm, formData.panel);
                          return (
                            <td key={perm} className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={f[perm]}
                                disabled={disabled}
                                onChange={e => handlePermissionChange(i, perm, e.target.checked)}
                                className={`w-4 h-4 text-[#2E7D78] border-gray-300 rounded focus:ring-[#2E7D78] ${
                                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={disabled ? `${perm} permission not allowed for ${formData.panel} panel on ${f.name}` : ''}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/superadmin/all-users')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-3 bg-[#2E7D78] text-white rounded-lg hover:bg-[#256f6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </button>
            </div>
          </div>

          {/* User Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Summary</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D78] to-[#1B504E] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </div>
                  <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User ID:</span>
                    <span className="text-sm font-mono text-gray-800">{user.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Role:</span>
                    <span className="text-sm text-gray-800 capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Panel:</span>
                    <span className="text-sm text-gray-800 capitalize">{user.panel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="text-sm text-gray-800">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Login:</span>
                    <span className="text-sm text-gray-800">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString() 
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>

                {/* Permissions Summary */}
                {user.permissions && user.permissions.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Current Permissions:</span>
                      <span className="text-sm text-gray-600">{user.permissions.length} forms</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Full Access:</span>
                        <span className="text-green-600 font-medium">
                          {user.permissions.filter(p => p.full).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Read Only:</span>
                        <span className="text-blue-600 font-medium">
                          {user.permissions.filter(p => p.read && !p.write && !p.edit && !p.delete).length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;