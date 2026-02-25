// // src/pages/Admin/UserManagement/UserManagement.jsx
// import React, { useState, useEffect } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { isPermissionDisabled, isPermissionDisabledForPanel, getAvailableActions } from "../../../utils/permissionRules";
// import Table from "../../../components/mainComponents/Table";

// const UserManagement = () => {
//   const [panel, setPanel] = useState("");
//   const [role, setRole] = useState("");
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [empName, setEmpName] = useState("");
//   const [contact, setContact] = useState("");
//   const [createdBy, setCreatedBy] = useState("");
//   const [status, setStatus] = useState("Active");
//   const [note, setNote] = useState("");
//   const [formSearch, setFormSearch] = useState("");
//   const [forms, setForms] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [userSearch, setUserSearch] = useState("");
//   const [filterSource, setFilterSource] = useState("All");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [overrideMode, setOverrideMode] = useState(false);
//   const [additionalPanels, setAdditionalPanels] = useState([]);
//   const [existingUserForEdit, setExistingUserForEdit] = useState(null);
//   const [showAllUsersDropdown, setShowAllUsersDropdown] = useState(false);
  
//   // NEW STATES FOR MODALS
//   const [viewUserModal, setViewUserModal] = useState(null);
//   const [permissionsModal, setPermissionsModal] = useState(null);

//   // Get forms based on selected panel - SAME AS UserEdit
//   const getFormsForPanel = (selectedPanel) => {
//     if (!selectedPanel) return [];
//     const panelFormsMap = {
//       admin: [
//         "Dashboard",
//         "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
//         "Doctor Management", "Total Doctor List", "Add Doctor", "Accept Doctor", "Doctor Follow-ups",
//         "Quotation List",
//         "Sales Bill List",
//         "Receipt List",
//         "Policy Management", "Policy List", "Add Policy", "Insurance Companies", "Insurance Types",
//         "Renewal Alert List", "Service Renewal Alert List", "Indemnity Renewal Alert List",
//         "Services Package List", "Services Package List", "Create Service Package",
//         "Queries or Case", "Queries or Case", "Create Query Case",
//         "User Management", "All Users", "Add User",
//         "Advocate List", "Advocate List", "Create Advocate",
//         "Expert List", "Expert List", "Create Expert List",
//         "Expense List",
//         "Reports", "Employee Reports", "Doctor Reports", "Policy Reports", "Advocate Reports", "Expert Reports", "Expense Reports", "Case Wise Reports", "Dr. DOB Reports", "Statement of Account"
//       ],
//       employee: [
//         "Dashboard",
//         "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
//         "User Management", "All Users", "Add User"
//       ],
//       salesman: [
//         "Dashboard",
//         "Doctor Management", "Total Doctor List", "Add Doctor",
//         "Quotation List",
//         "Sales Bill List",
//         "Receipt List"
//       ],
//       telecaller: [
//         "Dashboard",
//         "Doctor Management", "Total Doctor List",
//         "Quotation List"
//       ],
//       doctor: [
//         "Dashboard",
//         "My Profile", "Personal Details", "Membership Details",
//         "Policy History", "Case List", "Case History", "Payments", "Documents"
//       ],
//       advocate: [
//         "My Assigned Cases", "Update Follow-up", "View History", "Close Case", "Reports"
//       ],
//       expert: [
//         "Assigned Cases", "Give Opinion", "Upload Report", "Reports"
//       ]
//     };
//     return panelFormsMap[selectedPanel] || [];
//   };

//   // Fetch all users from multiple sources
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const allUsers = [];

//       // Fetch system users
//       try {
//         const usersResponse = await apiClient.get(apiEndpoints.users.list);
//         const usersData = usersResponse.data.data || usersResponse.data || [];
//         usersData.forEach(user => {
//           allUsers.push({
//             _id: user._id,
//             id: user.username || user.email || user._id,
//             name: user.fullName,
//             role: user.role,
//             panel: user.panel || user.role,
//             source: 'System User',
//             permissions: user.permissions || [],
//             forms: user.permissions ? user.permissions.length : 0,
//             contact: user.phoneNumber || '-',
//             email: user.email || '-',
//             createdBy: user.createdBy?.fullName || 'System',
//             createdOn: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '-',
//             status: user.status === 'active' ? 'Active' : (user.status || 'Active'),
//             userId: user._id || user.id,
//             username: user.username,
//             fullName: user.fullName,
//             phoneNumber: user.phoneNumber,
//             remarks: user.remarks,
//             additionalPanels: user.additionalPanels || []
//           });
//         });
//       } catch (err) {
//         console.error('Error fetching system users:', err);
//       }

//       // Fetch employees
//       try {
//         const employeesResponse = await apiClient.get(apiEndpoints.employees.list);
//         const employeesData = employeesResponse.data.data || employeesResponse.data || [];
//         employeesData.forEach(emp => {
//           allUsers.push({
//             _id: emp._id,
//             id: emp.employeeId || emp.email || emp._id,
//             name: emp.fullName,
//             role: emp.role || 'employee',
//             panel: 'employee',
//             source: 'Employee',
//             permissions: [],
//             forms: 0,
//             contact: emp.phoneNumber || '-',
//             email: emp.email || '-',
//             createdBy: emp.createdBy?.fullName || 'System',
//             createdOn: emp.createdAt ? new Date(emp.createdAt).toISOString().slice(0, 10) : (emp.joiningDate ? new Date(emp.joiningDate).toISOString().slice(0, 10) : '-'),
//             status: emp.status === 'active' ? 'Active' : (emp.status || 'Active'),
//             userId: emp._id || emp.id
//           });
//         });
//       } catch (err) {
//         console.error('Error fetching employees:', err);
//       }

//       // Fetch doctors
//       try {
//         const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list);
//         const doctorsData = doctorsResponse.data.data || doctorsResponse.data || [];
//         doctorsData.forEach(doctor => {
//           allUsers.push({
//             _id: doctor._id,
//             id: doctor.doctorId || doctor.email || doctor._id,
//             name: doctor.fullName || doctor.name,
//             role: 'doctor',
//             panel: 'doctor',
//             source: 'Doctor',
//             permissions: [],
//             forms: 0,
//             contact: doctor.phoneNumber || doctor.mobileNumber || '-',
//             email: doctor.email || '-',
//             createdBy: doctor.createdBy?.fullName || 'System',
//             createdOn: doctor.createdAt ? new Date(doctor.createdAt).toISOString().slice(0, 10) : '-',
//             status: doctor.status === 'active' ? 'Active' : (doctor.status || 'Active'),
//             userId: doctor._id || doctor.id
//           });
//         });
//       } catch (err) {
//         console.error('Error fetching doctors:', err);
//       }

//       // Fetch advocates
//       try {
//         const advocatesResponse = await apiClient.get(apiEndpoints.advocates.list);
//         const advocatesData = advocatesResponse.data.data || advocatesResponse.data || [];
//         advocatesData.forEach(advocate => {
//           allUsers.push({
//             _id: advocate._id,
//             id: advocate.barCouncilNumber || advocate.email || advocate._id,
//             name: advocate.fullName || advocate.name,
//             role: 'advocate',
//             panel: 'advocate',
//             source: 'Advocate',
//             permissions: [],
//             forms: 0,
//             contact: advocate.phoneNumber || advocate.mobileNumber || '-',
//             email: advocate.email || '-',
//             createdBy: advocate.createdBy?.fullName || 'System',
//             createdOn: advocate.createdAt ? new Date(advocate.createdAt).toISOString().slice(0, 10) : '-',
//             status: advocate.status === 'active' ? 'Active' : (advocate.status || 'Active'),
//             userId: advocate._id || advocate.id
//           });
//         });
//       } catch (err) {
//         console.error('Error fetching advocates:', err);
//       }

//       // Fetch experts
//       try {
//         const expertsResponse = await apiClient.get(apiEndpoints.experts.list);
//         const expertsData = expertsResponse.data.data || expertsResponse.data || [];
//         expertsData.forEach(expert => {
//           allUsers.push({
//             _id: expert._id,
//             id: expert.email || expert._id,
//             name: expert.fullName || expert.name,
//             role: 'expert',
//             panel: 'expert',
//             source: 'Expert',
//             permissions: [],
//             forms: 0,
//             contact: expert.phoneNumber || expert.mobileNumber || '-',
//             email: expert.email || '-',
//             createdBy: expert.createdBy?.fullName || 'System',
//             createdOn: expert.createdAt ? new Date(expert.createdAt).toISOString().slice(0, 10) : '-',
//             status: expert.status === 'active' ? 'Active' : (expert.status || 'Active'),
//             userId: expert._id || expert.id
//           });
//         });
//       } catch (err) {
//         console.error('Error fetching experts:', err);
//       }

//       setUsers(allUsers);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError('Failed to load users. Please refresh the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   // NEW FUNCTION: Load forms and permissions (SAME AS UserEdit)
//   const loadFormsAndPermissions = (userData) => {
//     // Get forms from primary panel
//     let allForms = [...getFormsForPanel(userData.panel)];
    
//     // Add forms from additional panels if any
//     if (userData.additionalPanels && userData.additionalPanels.length > 0) {
//       userData.additionalPanels.forEach(panel => {
//         const forms = getFormsForPanel(panel);
//         forms.forEach(form => {
//           if (!allForms.includes(form)) {
//             allForms.push(form);
//           }
//         });
//       });
//     }
    
//     // Create forms with user's existing permissions
//     const newForms = allForms.map((name, idx) => {
//       const userPerm = userData.permissions?.find(p => p.formName === name);
//       return {
//         id: idx,
//         name,
//         read: userPerm?.read || false,
//         write: userPerm?.write || false,
//         edit: userPerm?.edit || false,
//         delete: userPerm?.delete || false,
//         full: userPerm?.full || false,
//       };
//     });
    
//     setForms(newForms);
//   };

//   // Load forms when panel changes - UPDATED LOGIC
//   useEffect(() => {
//     // Don't auto-load forms if we're in edit mode and the panel hasn't changed
//     if (existingUserForEdit && !panel) {
//       return;
//     }
    
//     if (panel) {
//       // For new user creation, load empty forms
//       if (!existingUserForEdit) {
//         let allForms = [...getFormsForPanel(panel)];
        
//         if (additionalPanels && additionalPanels.length > 0) {
//           additionalPanels.forEach(addPanel => {
//             const forms = getFormsForPanel(addPanel);
//             forms.forEach(form => {
//               if (!allForms.includes(form)) {
//                 allForms.push(form);
//               }
//             });
//           });
//         }
        
//         const newForms = allForms.map((name, idx) => ({
//           id: idx,
//           name,
//           read: false,
//           write: false,
//           edit: false,
//           delete: false,
//           full: false,
//         }));
//         setForms(newForms);
//       }
//     } else {
//       setForms([]);
//     }
//   }, [panel, additionalPanels]);

//   // Handle checkbox change - UPDATED WITH PERMISSION LOGIC
//   const handlePermissionChange = (idx, perm, value) => {
//     const updated = [...forms];

//     // Check if this permission is disabled for the current panel
//     if (!overrideMode && isPermissionDisabledForPanel(forms[idx].name, perm, panel)) {
//       return; // Don't allow changing disabled permissions unless in override mode
//     }

//     updated[idx][perm] = value;

//     if (perm === "full") {
//       const availableActions = getAvailableActions(forms[idx].name, panel);
//       availableActions.forEach(p => {
//         updated[idx][p] = value;
//       });
//       // Also set disabled actions if in override mode
//       if (overrideMode) {
//         ["read", "write", "edit", "delete"].forEach(p => {
//           if (!availableActions.includes(p)) {
//             updated[idx][p] = value;
//           }
//         });
//       }
//     } else {
//       const availableActions = getAvailableActions(forms[idx].name, panel);
//       const allAvailableChecked = availableActions.every(p => updated[idx][p]);
//       const allChecked = allAvailableChecked && (!overrideMode ||
//         ["read", "write", "edit", "delete"].every(p => updated[idx][p]));
//       updated[idx].full = allChecked;
//     }
//     setForms(updated);
//   };

//   // Column all - UPDATED WITH PERMISSION LOGIC
//   const colAll = (perm, value) => {
//     const updated = forms.map((f, idx) => {
//       // Check if this permission is disabled for this form and panel
//       if (!overrideMode && isPermissionDisabledForPanel(f.name, perm, panel)) {
//         return f; // Don't change disabled permissions
//       }
//       return { ...f, [perm]: value };
//     });

//     updated.forEach((f, i) => {
//       const availableActions = getAvailableActions(f.name, panel);
//       const allAvailableChecked = availableActions.every(p => updated[i][p]);
//       const allChecked = allAvailableChecked && (!overrideMode ||
//         ["read", "write", "edit", "delete"].every(p => updated[i][p]));
//       f.full = allChecked;
//     });
//     setForms(updated);
//   };

//   const clearMatrix = () => {
//     const updated = forms.map(f => ({ ...f, read: false, write: false, edit: false, delete: false, full: false }));
//     setForms(updated);
//   };

//   const applyPreset = (presetRole) => {
//     setRole(presetRole);
//     if (!panel) {
//       const rolePanelMap = {
//         "Admin": "admin",
//         "Telecaller": "telecaller",
//         "Salesman": "salesman",
//         "Advocates": "advocate",
//         "Experts": "expert"
//       };
//       setPanel(rolePanelMap[presetRole] || "admin");
//     }
//     if (forms.length === 0) return;

//     clearMatrix();
//     const updated = [...forms];

//     const check = (filter, perms) => {
//       updated.forEach((f, i) => {
//         if (filter(f.name)) {
//           perms.forEach(p => {
//             if (!overrideMode && isPermissionDisabledForPanel(f.name, p, panel)) {
//               return; // Skip disabled permissions
//             }
//             f[p] = true;
//           });
//           const availableActions = getAvailableActions(f.name, panel);
//           f.full = availableActions.every(p => f[p]);
//         }
//       });
//     };

//     if (presetRole === "Admin") {
//       ["read", "write", "edit", "delete"].forEach(p => colAll(p, true));
//     } else if (presetRole === "Telecaller") {
//       check(n => /Calling List|Assigned Tasks|Follow-ups|Doctor Forms|Doctor Directory|Quotation|Reports/i.test(n), ["read"]);
//       check(n => /Calling List|Assigned Tasks|Follow-ups|Quotation/i.test(n), ["write", "edit"]);
//     } else if (presetRole === "Salesman") {
//       check(n => /Leads|Quotations|Sales Bills|Receipts|Doctor Onboarding|Reports|Dashboard/i.test(n), ["read"]);
//       check(n => /Leads|Quotations|Sales Bills|Receipts/i.test(n), ["write", "edit"]);
//     } else if (presetRole === "Advocates") {
//       check(n => /Assigned Cases|My Assigned Cases|View History|Close Case|Reports|Update Follow-up/i.test(n), ["read", "write", "edit"]);
//     } else if (presetRole === "Experts") {
//       check(n => /Assigned Cases|Give Opinion|Upload Report|Reports/i.test(n), ["read", "write", "edit"]);
//     }

//     setForms(updated);
//   };

//   const presetReadOnly = () => {
//     colAll("read", true);
//     ["write", "edit", "delete"].forEach(p => colAll(p, false));
//   };

//   // Save user (either create new or update existing)
//   const saveUser = async () => {
//     if (!panel || !role || !userId || !empName) {
//       alert("Please fill Panel, Role, User ID, and Name.");
//       return;
//     }
//     if (forms.length === 0) {
//       alert("Please select a Panel to load forms.");
//       return;
//     }

//     // For new users, require password
//     if (!existingUserForEdit && !password) {
//       alert("Please provide a password for the new user.");
//       return;
//     }

//     // For existing users, if password is the masked value, don't send it
//     const shouldUpdatePassword = existingUserForEdit && password !== "••••••" && password.trim() !== "";

//     try {
//       setLoading(true);
//       const permissionsArray = forms.map(f => ({
//         formName: f.name,
//         read: f.read,
//         write: f.write,
//         edit: f.edit,
//         delete: f.delete,
//         full: f.full
//       }));

//       if (existingUserForEdit) {
//         // Update existing user
//         const userData = {
//           username: userId,
//           email: userId.includes('@') ? userId : `${userId}@rapid.com`,
//           fullName: empName,
//           phoneNumber: contact,
//           role,
//           panel,
//           additionalPanels,
//           permissions: permissionsArray,
//           status: status.toLowerCase(),
//           remarks: note
//         };

//         // Only include password if it's changed
//         if (shouldUpdatePassword) {
//           userData.password = password;
//         }

//         const response = await apiClient.put(apiEndpoints.users.update(existingUserForEdit._id), userData);
//         if (response.data.success) {
//           alert('User updated successfully!');
//           await fetchUsers();
//           resetForm();
//         } else {
//           setError(response.data.message || 'Failed to update user');
//         }
//       } else {
//         // Create new user
//         const userData = {
//           username: userId,
//           email: userId.includes('@') ? userId : `${userId}@rapid.com`,
//           password, 
//           fullName: empName, 
//           phoneNumber: contact,
//           role, 
//           panel, 
//           additionalPanels, 
//           permissions: permissionsArray,
//           status: status.toLowerCase(), 
//           remarks: note
//         };

//         const response = await apiClient.post(apiEndpoints.users.create, userData);
//         if (response.data.success) {
//           alert('User created successfully!');
//           await fetchUsers();
//           resetForm();
//         } else {
//           setError(response.data.message || 'Failed to create user');
//         }
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to save user';
//       setError(msg);
//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setPanel(""); 
//     setRole(""); 
//     setUserId(""); 
//     setPassword(""); 
//     setEmpName("");
//     setContact(""); 
//     setCreatedBy(""); 
//     setStatus("Active"); 
//     setNote(""); 
//     setFormSearch("");
//     setForms([]); 
//     setOverrideMode(false); 
//     setAdditionalPanels([]);
//     setExistingUserForEdit(null);
//     setShowAllUsersDropdown(false);
//     setError("");
//   };

//   // Reset password for existing user
//   const resetUserPassword = async (userId, newPassword) => {
//     if (!newPassword) {
//       alert('Please provide a new password');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await apiClient.put(apiEndpoints.users.update(userId), {
//         password: newPassword
//       });
      
//       if (response.data.success) {
//         alert('Password reset successfully!');
//         if (existingUserForEdit && existingUserForEdit._id === userId) {
//           setPassword('••••••');
//         }
//       } else {
//         setError(response.data.message || 'Failed to reset password');
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to reset password';
//       setError(msg);
//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit user function - COMPLETELY REWRITTEN USING UserEdit LOGIC
//   const handleEditUser = (user) => {
//     console.log("Editing user:", user);
    
//     // Set the existing user for edit
//     setExistingUserForEdit(user);
//     setShowAllUsersDropdown(true);
    
//     // Auto-fill the form with user data (SAME AS UserEdit)
//     setPanel(user.panel || "");
//     setRole(user.role || "");
//     setUserId(user.username || user.email || user.id || "");
//     setEmpName(user.fullName || user.name || "");
//     setContact(user.phoneNumber || user.contact || "");
//     setStatus(user.status === 'active' ? 'Active' : (user.status || 'Active'));
//     setNote(user.remarks || user.note || "");
//     setAdditionalPanels(user.additionalPanels || []);
    
//     // Set password field to indicate it's being edited
//     setPassword("••••••");
    
//     // Load forms and permissions using UserEdit logic
//     loadFormsAndPermissions(user);
    
//     // Scroll to form section
//     setTimeout(() => {
//       document.getElementById('user-form-section')?.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'start'
//       });
//     }, 100);
//   };

//   // Delete user function
//   const handleDeleteUser = async (user) => {
//     if (!window.confirm(`Are you sure you want to delete user "${user.fullName || user.name}"?`)) return;

//     try {
//       setLoading(true);
//       await apiClient.delete(apiEndpoints.users.delete(user._id));
//       await fetchUsers();
//       alert('User deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError(err.response?.data?.message || 'Failed to delete user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle user status
//   const handleToggleStatus = async (user) => {
//     const newStatus = user.status === 'Active' || user.status === 'active' ? 'inactive' : 'active';
//     if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} user "${user.fullName || user.name}"?`)) return;

//     try {
//       setLoading(true);
//       await apiClient.put(apiEndpoints.users.update(user._id), {
//         status: newStatus
//       });
//       await fetchUsers();
//     } catch (err) {
//       console.error('Error updating user status:', err);
//       setError(err.response?.data?.message || 'Failed to update user status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // View User Details Modal Handler
//   const handleViewUser = (user) => {
//     setViewUserModal(user);
//   };

//   // View Permissions Modal Handler
//   const handleViewPermissions = (user) => {
//     setPermissionsModal(user);
//   };

//   const filteredForms = forms.filter(f => f.name.toLowerCase().includes(formSearch.toLowerCase()));
//   const filteredUsers = users.filter(u => {
//     const str = `${u.id} ${u.name} ${u.role} ${u.panel} ${u.contact} ${u.createdBy} ${u.status} ${u.source || ''} ${u.email || ''}`.toLowerCase();
//     const matchesSearch = !userSearch || str.includes(userSearch.toLowerCase());
//     const matchesSource = filterSource === 'All' || (u.source || '').toLowerCase() === filterSource.toLowerCase();
//     return matchesSearch && matchesSource;
//   });

//   // Table actions for the users list
//   const tableActions = [
//     {
//       label: "View",
//       icon: <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//       </svg>,
//       onClick: (row) => handleViewUser(row),
//       showAsIcon: true
//     },
//     {
//       label: "Edit",
//       icon: <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//       </svg>,
//       onClick: (row) => handleEditUser(row),
//       showAsIcon: true
//     },
//     {
//       label: "Delete",
//       icon: <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//       </svg>,
//       onClick: (row) => handleDeleteUser(row),
//       showAsIcon: true
//     },
//   ];

//   // Extra columns for the table
//   const extraColumns = [
//     {
//       header: "Permissions",
//       render: (row) => (
//         <button
//           onClick={() => handleViewPermissions(row)}
//           className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 border border-purple-300 transition-colors flex items-center gap-1"
//         >
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//           </svg>
//           View ({row.permissions?.length || 0})
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleToggleStatus(row)}
//             className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${
//               (row.status === 'Active' || row.status === 'active') ? 'bg-green-500' : 'bg-red-500'
//             }`}
//             title={row.status === 'Active' ? 'Deactivate user' : 'Activate user'}
//           >
//             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
//               (row.status === 'Active' || row.status === 'active') ? 'translate-x-5' : 'translate-x-0'
//             }`}></div>
//           </button>
//           <span className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] text-center ${
//             (row.status === 'Active' || row.status === 'active') 
//               ? 'bg-green-100 text-green-800 border border-green-200' 
//               : 'bg-red-100 text-red-800 border border-red-200'
//           }`}>
//             {row.status === 'Active' || row.status === 'active' ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//       ),
//     }
//   ];

//   if (loading && users.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto p-6 font-sans flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading user management...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 font-sans">
//       <h1 className="text-2xl font-bold text-[#1e3d36] mb-2">User Management</h1>
//       <p className="text-sm text-[#6c8b83] mb-6">
//         Create new users with custom permissions. View all users from System Users, Employees, Doctors, Telecallers, Advocates, and Experts. Select a Panel to auto-load all its sections/forms, then assign user details & permissions (Read / Write / Edit / Delete).
//       </p>
      
//       {/* Security Notice */}
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm">
//         <strong>Security Notice:</strong> For security reasons, passwords are stored using bcrypt hashing and cannot be displayed in plain text after creation. To reset a user's password, use the "Reset Password" feature when managing existing users or generate a new secure password.
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* EXISTING USER MANAGEMENT */}
//       {!existingUserForEdit && !showAllUsersDropdown && (
//         <div className="mb-6">
//           <button
//             onClick={() => setShowAllUsersDropdown(true)}
//             className="px-6 py-3 text-sm bg-[#157a6e] text-white rounded-lg hover:bg-[#0f5c55] font-bold flex items-center gap-2"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//             </svg>
//             Manage Existing Users
//           </button>
//         </div>
//       )}
      
//       {showAllUsersDropdown && (
//         <div className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <strong className="text-lg text-[#1e3d36]">Manage Existing User</strong>
//             <button 
//               onClick={() => setShowAllUsersDropdown(false)}
//               className="text-sm text-[#157a6e] hover:underline flex items-center gap-1"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               Cancel
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-[#35524a] mb-2">Select Existing User</label>
//               <select 
//                 value={existingUserForEdit ? existingUserForEdit._id : ""} 
//                 onChange={(e) => {
//                   const selectedId = e.target.value;
//                   if (!selectedId) {
//                     setExistingUserForEdit(null);
//                     return;
//                   }
                  
//                   const selected = users.find(user => {
//                     return String(user._id) === String(selectedId);
//                   });
                  
//                   if (selected) {
//                     handleEditUser(selected);
//                   } else {
//                     console.warn(`User with ID ${selectedId} not found in users list`);
//                     setExistingUserForEdit(null);
//                   }
//                 }}
//                 className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
//               >
//                 <option value="">-- Select User --</option>
//                 {users.filter(u => !u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role)).map(user => (
//                   <option key={user._id} value={user._id}>
//                     {user.name} - {user.role} ({user.email})
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             {existingUserForEdit && (
//               <div className="flex items-end">
//                 <button
//                   onClick={resetForm}
//                   className="px-6 py-3 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 w-full"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Reset Selection
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {existingUserForEdit && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
//                 <div><strong>User:</strong> {existingUserForEdit.fullName}</div>
//                 <div><strong>Role:</strong> {existingUserForEdit.role}</div>
//                 <div><strong>Panel:</strong> {existingUserForEdit.panel}</div>
//                 <div><strong>Status:</strong> 
//                   <span className={`ml-1 px-2 py-1 rounded text-xs ${
//                     existingUserForEdit.status === 'Active' || existingUserForEdit.status === 'active' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {existingUserForEdit.status}
//                   </span>
//                 </div>
//                 {existingUserForEdit.additionalPanels && existingUserForEdit.additionalPanels.length > 0 && (
//                   <div className="md:col-span-2 lg:col-span-4">
//                     <strong>Additional Panels:</strong> {existingUserForEdit.additionalPanels.join(', ')}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* CREATE / EDIT USER SECTION */}
//       <div id="user-form-section" className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6 mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <strong className="text-xl text-[#1e3d36]">
//             {existingUserForEdit ? `Edit User: ${existingUserForEdit.fullName}` : "Create New User"}
//           </strong>
//           <div className="flex gap-2 flex-wrap">
//             {!existingUserForEdit && (
//               <>
//                 {/* Template from existing user button */}
//                 <button 
//                   onClick={() => {
//                     const validUsers = users.filter(u => !u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role));
//                     if (validUsers.length === 0) {
//                       alert('No existing users available to use as template');
//                       return;
//                     }
                    
//                     const templateUserEmail = prompt('Enter email/username of user to use as template:');
//                     if (templateUserEmail) {
//                       const templateUser = users.find(u => 
//                         (!u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role)) && 
//                         (u.email === templateUserEmail || u.username === templateUserEmail || u._id === templateUserEmail)
//                       );
                      
//                       if (templateUser) {
//                         setPanel(templateUser.panel || "");
//                         setRole(templateUser.role || "");
//                         setAdditionalPanels(templateUser.additionalPanels || []);
                        
//                         // Load user's permissions as template using UserEdit logic
//                         loadFormsAndPermissions(templateUser);
                        
//                         alert(`Template loaded from user: ${templateUser.fullName}`);
//                       } else {
//                         alert('User not found. Please check the email/username.');
//                       }
//                     }
//                   }}
//                   className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Use Template
//                 </button>
                
//                 <span className="text-sm text-[#6c8b83] flex items-center">Quick presets:</span>
//                 {["Admin", "Telecaller", "Salesman", "Advocates", "Experts"].map(r => (
//                   <button key={r} onClick={() => applyPreset(r)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
//                     {r}
//                   </button>
//                 ))}
//                 <button onClick={presetReadOnly} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
//                   Read-only
//                 </button>
//               </>
//             )}
//             {existingUserForEdit && (
//               <button 
//                 onClick={resetForm}
//                 className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Create New
//               </button>
//             )}
//           </div>
//         </div>

//         {/* === INPUT FIELDS === */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Panel</label>
//             <select value={panel} onChange={e => setPanel(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
//               <option value="">-- Select Panel --</option>
//               <option value="admin">Admin</option>
//               <option value="employee">Employee</option>
//               <option value="salesman">Salesman</option>
//               <option value="telecaller">Telecaller</option>
//               <option value="doctor">Doctor</option>
//               <option value="advocate">Advocate</option>
//               <option value="expert">Expert</option>
//             </select>
//             <p className="text-xs text-[#6c8b83] mt-1">Loads all sections/forms below.</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">User Type / Role</label>
//             <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
//               <option value="">-- Select Role --</option>
//               <option value="admin">Admin</option>
//               <option value="super_admin">Super Admin</option>
//               <option value="sales">Sales</option>
//               <option value="salesman">Salesman</option>
//               <option value="telecaller">Telecaller</option>
//               <option value="doctor">Doctor</option>
//               <option value="advocate">Advocate</option>
//               <option value="expert">Expert</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">User ID</label>
//             <input value={userId} onChange={e => setUserId(e.target.value)} type="text" placeholder="username or email" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">
//               {existingUserForEdit ? "New Password (leave blank to keep current)" : "Password"}
//             </label>
//             <div className="flex gap-2">
//               <input 
//                 value={password} 
//                 onChange={e => setPassword(e.target.value)} 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder={existingUserForEdit ? "New password (optional)" : "Set password"} 
//                 className="flex-1 p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" 
//               />
//               <button onClick={() => setShowPassword(!showPassword)} className="px-4 py-3 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//             {existingUserForEdit && (
//               <div className="flex gap-3 mt-2">
//                 <button 
//                   onClick={() => resetUserPassword(existingUserForEdit._id, prompt('Enter new password:'))}
//                   className="text-xs text-red-600 hover:underline"
//                 >
//                   Reset Password
//                 </button>
//                 <button 
//                   onClick={() => {
//                     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
//                     let newPassword = '';
//                     for (let i = 0; i < 12; i++) {
//                       newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
//                     }
//                     setPassword(newPassword);
//                     alert(`Generated password: ${newPassword}\nMake sure to share this securely with the user!`);
//                   }}
//                   className="text-xs text-blue-600 hover:underline"
//                 >
//                   Generate Password
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Employee / Name</label>
//             <input value={empName} onChange={e => setEmpName(e.target.value)} type="text" placeholder="e.g., Ananya Sharma" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Contact</label>
//             <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="e.g., 9876543210" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Created By</label>
//             <select value={createdBy} onChange={e => setCreatedBy(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
//               <option value="">-- Select --</option>
//               <option>Owner</option>
//               <option>Admin — Neha Patel</option>
//               <option>HR — Karan Shah</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Status</label>
//             <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
//               <option>Active</option>
//               <option>Inactive</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Note</label>
//             <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any remarks..." rows={3} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent resize-vertical"></textarea>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#35524a] mb-2">Search form in this panel</label>
//             <input value={formSearch} onChange={e => setFormSearch(e.target.value)} type="text" placeholder="Type to filter forms..." className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
//           </div>
//         </div>

//         {/* Additional Panels Section */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-[#35524a] mb-3">Additional Panels (Optional)</label>
//           <div className="flex flex-wrap gap-4">
//             {["admin", "employee", "salesman", "telecaller", "doctor", "advocate", "expert"]
//               .filter(p => p !== panel)
//               .map((availablePanel) => (
//                 <label key={availablePanel} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={additionalPanels.includes(availablePanel)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setAdditionalPanels([...additionalPanels, availablePanel]);
//                         // Add forms from this panel
//                         const newForms = getFormsForPanel(availablePanel);
//                         const currentFormNames = forms.map(f => f.name);
//                         newForms.forEach(formName => {
//                           if (!currentFormNames.includes(formName)) {
//                             setForms(prev => [...prev, {
//                               id: prev.length,
//                               name: formName,
//                               read: false,
//                               write: false,
//                               edit: false,
//                               delete: false,
//                               full: false
//                             }]);
//                           }
//                         });
//                       } else {
//                         setAdditionalPanels(additionalPanels.filter(p => p !== availablePanel));
//                         // Remove forms from this panel (only if not in primary panel)
//                         const formsToRemove = getFormsForPanel(availablePanel);
//                         setForms(prev => prev.filter(f => 
//                           !formsToRemove.includes(f.name) || 
//                           getFormsForPanel(panel).includes(f.name)
//                         ));
//                       }
//                     }}
//                     className="mr-2 w-4 h-4 text-[#157a6e] border-[#e0ece7] rounded focus:ring-[#157a6e]"
//                   />
//                   <span className="text-sm text-[#35524a] capitalize">{availablePanel.replace('_', ' ')}</span>
//                 </label>
//               ))}
//           </div>
//           {additionalPanels.length > 0 && (
//             <p className="text-xs text-[#6c8b83] mt-2">
//               User will have access to forms from: {additionalPanels.join(', ')}
//             </p>
//           )}
//         </div>

//         {/* === OVERRIDE TOGGLE === */}
//         <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
//           <input
//             type="checkbox"
//             checked={overrideMode}
//             onChange={e => setOverrideMode(e.target.checked)}
//             className="w-5 h-5 text-[#157a6e] rounded focus:ring-[#157a6e]"
//           />
//           <div>
//             <span className="text-sm font-medium text-[#157a6e]">
//               {overrideMode ? "Override Mode ON (All permissions editable)" : "Enable Override Mode"}
//             </span>
//             {overrideMode && <p className="text-xs text-amber-600 mt-1">Manual control enabled - you can edit all permissions regardless of panel restrictions</p>}
//           </div>
//         </div>

//         {/* === PERMISSIONS MATRIX === */}
//         <div className="flex justify-between items-center mb-4">
//           <strong className="text-lg text-[#1e3d36]">Forms & Permissions</strong>
//           <div className="flex gap-2 flex-wrap">
//             <span className="inline-block bg-[#eef8f7] border border-[#e0ece7] text-[#246a60] px-3 py-2 rounded-full text-sm font-bold">
//               {forms.length} forms
//             </span>
//             <button onClick={() => colAll("read", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Read</button>
//             <button onClick={() => colAll("write", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Write</button>
//             <button onClick={() => colAll("edit", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Edit</button>
//             <button onClick={() => colAll("delete", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Delete</button>
//             <button onClick={clearMatrix} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">Clear All</button>
//           </div>
//         </div>

//         {forms.length > 0 ? (
//           <div className="border border-[#e0ece7] rounded-lg overflow-auto max-h-96">
//             <table className="w-full">
//               <thead className="sticky top-0 bg-[#f0faf6] text-[#157a6e] font-bold">
//                 <tr>
//                   <th className="p-4 text-left text-sm" style={{ minWidth: "260px" }}>Form / Section</th>
//                   <th className="p-4 text-center text-sm">Read</th>
//                   <th className="p-4 text-center text-sm">Write</th>
//                   <th className="p-4 text-center text-sm">Edit</th>
//                   <th className="p-4 text-center text-sm">Delete</th>
//                   <th className="p-4 text-center text-sm">Full</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredForms.map((f, i) => (
//                   <tr key={i} className="border-b border-[#e0ece7] hover:bg-[#f8fdfa]">
//                     <td className="p-4 text-sm text-[#35524a]">{f.name}</td>
//                     {["read", "write", "edit", "delete", "full"].map(perm => {
//                       const disabled = !overrideMode && isPermissionDisabledForPanel(f.name, perm, panel);
//                       return (
//                         <td key={perm} className="p-4 text-center">
//                           <input
//                             type="checkbox"
//                             checked={f[perm]}
//                             disabled={disabled}
//                             onChange={e => handlePermissionChange(i, perm, e.target.checked)}
//                             className={`w-5 h-5 text-[#157a6e] border-[#e0ece7] rounded focus:ring-[#157a6e] cursor-pointer ${
//                               disabled ? 'opacity-50 cursor-not-allowed' : ''
//                             }`}
//                             title={disabled ? `${perm} permission not allowed for ${panel} panel on ${f.name}` : ''}
//                           />
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="border border-[#e0ece7] rounded-lg p-8 text-center bg-gray-50">
//             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <p className="text-gray-500">No forms loaded. Please select a Panel to load forms.</p>
//           </div>
//         )}

//         <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#e0ece7]">
//           <button onClick={resetForm} className="px-6 py-3 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Reset
//           </button>
//           <button
//             onClick={saveUser}
//             disabled={loading}
//             className="px-6 py-3 text-sm bg-[#157a6e] text-white rounded-lg hover:bg-[#0f5c55] font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 {existingUserForEdit ? 'Updating User...' : 'Creating User...'}
//               </>
//             ) : (
//               existingUserForEdit ? 'Update User' : 'Create User'
//             )}
//           </button>
//         </div>
//       </div>

//       {/* === ALL USERS LIST WITH TABLE COMPONENT === */}
//       <div className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <strong className="text-xl text-[#1e3d36]">All Users List</strong>
//           <div className="flex gap-4 items-center flex-wrap">
//             <div className="relative">
//               <input
//                 value={userSearch}
//                 onChange={e => setUserSearch(e.target.value)}
//                 type="text"
//                 placeholder="Search by name/email/role..."
//                 className="pl-10 pr-4 py-2 text-sm border border-[#e0ece7] rounded-lg focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
//               />
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c8b83]">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
//             <select
//               value={filterSource}
//               onChange={e => setFilterSource(e.target.value)}
//               className="px-4 py-2 text-sm border border-[#e0ece7] rounded-lg focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
//             >
//               <option value="All">All Sources</option>
//               <option value="System User">System Users</option>
//               <option value="Employee">Employees</option>
//               <option value="Doctor">Doctors</option>
//               <option value="Advocate">Advocates</option>
//               <option value="Expert">Experts</option>
//             </select>
//             <span className="inline-block bg-[#eef8f7] border border-[#e0ece7] text-[#246a60] px-3 py-2 rounded-full text-sm font-bold">
//               {filteredUsers.length} / {users.length} users
//             </span>
//           </div>
//         </div>

//         {/* USE TABLE COMPONENT HERE - PERMISSIONS COLUMN AT 6TH POSITION */}
//         <Table
//           data={filteredUsers}
//           actions={tableActions}
//           extraColumns={extraColumns}
//           excludeColumns={['permissions', 'forms', '_id', 'userId', 'username', 'fullName', 'phoneNumber', 'remarks', 'additionalPanels']}
//           columnOrder={['id', 'name', 'role', 'panel', 'contact', 'Permissions', 'email', 'createdBy', 'createdOn', 'Status', 'source']}
//           pagination={true}
//           defaultPageSize={10}
//         />
//       </div>

//       {/* === VIEW USER DETAILS MODAL (Eye Icon) === */}
//       {viewUserModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b border-[#e0ece7] sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-[#1e3d36]">User Details</h2>
//               <button
//                 onClick={() => setViewUserModal(null)}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Full Name</label>
//                     <p className="text-lg font-semibold text-gray-900">{viewUserModal.fullName || viewUserModal.name}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">User ID / Username</label>
//                     <p className="text-gray-700">{viewUserModal.username || viewUserModal.id}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Email</label>
//                     <p className="text-gray-700">{viewUserModal.email || 'N/A'}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Contact Number</label>
//                     <p className="text-gray-700">{viewUserModal.phoneNumber || viewUserModal.contact || 'N/A'}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Source</label>
//                     <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                       {viewUserModal.source}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Role</label>
//                     <p className="text-gray-700 capitalize">{viewUserModal.role}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Panel</label>
//                     <p className="text-gray-700 capitalize">{viewUserModal.panel}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Status</label>
//                     <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                       (viewUserModal.status === 'Active' || viewUserModal.status === 'active') 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {viewUserModal.status === 'Active' || viewUserModal.status === 'active' ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Created By</label>
//                     <p className="text-gray-700">{viewUserModal.createdBy || 'System'}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-[#35524a] mb-1">Created On</label>
//                     <p className="text-gray-700">{viewUserModal.createdOn || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>
              
//               {viewUserModal.additionalPanels && viewUserModal.additionalPanels.length > 0 && (
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                   <label className="block text-sm font-medium text-[#35524a] mb-2">Additional Panels</label>
//                   <div className="flex flex-wrap gap-2">
//                     {viewUserModal.additionalPanels.map((panel, index) => (
//                       <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
//                         {panel}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
              
//               {viewUserModal.remarks && (
//                 <div className="mt-6">
//                   <label className="block text-sm font-medium text-[#35524a] mb-2">Remarks / Notes</label>
//                   <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{viewUserModal.remarks}</p>
//                 </div>
//               )}
              
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setViewUserModal(null)}
//                   className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* === PERMISSIONS MATRIX MODAL (Permissions Button) === */}
//       {permissionsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//             <div className="flex justify-between items-center p-6 border-b border-[#e0ece7] sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-[#1e3d36]">
//                 Permissions for {permissionsModal.fullName || permissionsModal.name}
//               </h2>
//               <button
//                 onClick={() => setPermissionsModal(null)}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="overflow-auto max-h-[calc(90vh-80px)]">
//               <div className="p-6">
//                 <div className="mb-4 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-gray-600">
//                       <strong>Role:</strong> {permissionsModal.role} | <strong>Panel:</strong> {permissionsModal.panel} | 
//                       <strong> Total Forms:</strong> {permissionsModal.permissions?.length || 0}
//                     </p>
//                   </div>
//                   <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
//                     Permissions Matrix
//                   </span>
//                 </div>

//                 {permissionsModal.permissions && permissionsModal.permissions.length > 0 ? (
//                   <div className="border border-[#e0ece7] rounded-lg overflow-auto">
//                     <table className="w-full">
//                       <thead className="sticky top-0 bg-[#f0faf6] text-[#157a6e] font-bold">
//                         <tr>
//                           <th className="p-4 text-left text-sm" style={{ minWidth: "260px" }}>Form / Section</th>
//                           <th className="p-4 text-center text-sm">Read</th>
//                           <th className="p-4 text-center text-sm">Write</th>
//                           <th className="p-4 text-center text-sm">Edit</th>
//                           <th className="p-4 text-center text-sm">Delete</th>
//                           <th className="p-4 text-center text-sm">Full Access</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {permissionsModal.permissions.map((perm, idx) => (
//                           <tr key={idx} className="border-b border-[#e0ece7] hover:bg-[#f8fdfa]">
//                             <td className="p-4 text-sm text-[#35524a]">{perm.formName || perm.name || 'N/A'}</td>
//                             <td className="p-4 text-center">
//                               <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
//                                 perm.read ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                               }`}>
//                                 {perm.read ? '✓' : '✗'}
//                               </div>
//                             </td>
//                             <td className="p-4 text-center">
//                               <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
//                                 perm.write ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                               }`}>
//                                 {perm.write ? '✓' : '✗'}
//                               </div>
//                             </td>
//                             <td className="p-4 text-center">
//                               <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
//                                 perm.edit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                               }`}>
//                                 {perm.edit ? '✓' : '✗'}
//                               </div>
//                             </td>
//                             <td className="p-4 text-center">
//                               <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
//                                 perm.delete ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                               }`}>
//                                 {perm.delete ? '✓' : '✗'}
//                               </div>
//                             </td>
//                             <td className="p-4 text-center">
//                               <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
//                                 perm.full ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                               }`}>
//                                 {perm.full ? '✓' : '✗'}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 bg-gray-50 rounded-lg">
//                     <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                     <p className="text-gray-500 text-lg">No permissions assigned</p>
//                     <p className="text-gray-400 text-sm mt-2">This user doesn't have any specific permissions configured.</p>
//                   </div>
//                 )}

//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={() => setPermissionsModal(null)}
//                     className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//                   >
//                     Close
//                 </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;










// src/pages/Admin/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { 
  isPermissionDisabledForPanel, 
  getAvailableActions,
  getPermissionDependencies,
  canChangePermission 
} from "../../../utils/permissionRules";
import Table from "../../../components/mainComponents/Table";

const UserManagement = () => {
  const [panel, setPanel] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [empName, setEmpName] = useState("");
  const [contact, setContact] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [status, setStatus] = useState("Active");
  const [note, setNote] = useState("");
  const [formSearch, setFormSearch] = useState("");
  const [forms, setForms] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overrideMode, setOverrideMode] = useState(false);
  const [additionalPanels, setAdditionalPanels] = useState([]);
  const [existingUserForEdit, setExistingUserForEdit] = useState(null);
  const [showAllUsersDropdown, setShowAllUsersDropdown] = useState(false);
  
  // NEW STATES FOR MODALS
  const [viewUserModal, setViewUserModal] = useState(null);
  const [permissionsModal, setPermissionsModal] = useState(null);

  // Get forms based on selected panel
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

  // Fetch all users from multiple sources
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const allUsers = [];

      // Fetch system users
      try {
        const usersResponse = await apiClient.get(apiEndpoints.users.list);
        const usersData = usersResponse.data.data || usersResponse.data || [];
        usersData.forEach(user => {
          allUsers.push({
            _id: user._id,
            id: user.username || user.email || user._id,
            name: user.fullName,
            role: user.role,
            panel: user.panel || user.role,
            source: 'System User',
            permissions: user.permissions || [],
            forms: user.permissions ? user.permissions.length : 0,
            contact: user.phoneNumber || '-',
            email: user.email || '-',
            createdBy: user.createdBy?.fullName || 'System',
            createdOn: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '-',
            status: user.status === 'active' ? 'Active' : (user.status || 'Active'),
            userId: user._id || user.id,
            username: user.username,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            remarks: user.remarks,
            additionalPanels: user.additionalPanels || []
          });
        });
      } catch (err) {
        console.error('Error fetching system users:', err);
      }

      // Fetch employees
      try {
        const employeesResponse = await apiClient.get(apiEndpoints.employees.list);
        const employeesData = employeesResponse.data.data || employeesResponse.data || [];
        employeesData.forEach(emp => {
          allUsers.push({
            _id: emp._id,
            id: emp.employeeId || emp.email || emp._id,
            name: emp.fullName,
            role: emp.role || 'employee',
            panel: 'employee',
            source: 'Employee',
            permissions: [],
            forms: 0,
            contact: emp.phoneNumber || '-',
            email: emp.email || '-',
            createdBy: emp.createdBy?.fullName || 'System',
            createdOn: emp.createdAt ? new Date(emp.createdAt).toISOString().slice(0, 10) : (emp.joiningDate ? new Date(emp.joiningDate).toISOString().slice(0, 10) : '-'),
            status: emp.status === 'active' ? 'Active' : (emp.status || 'Active'),
            userId: emp._id || emp.id
          });
        });
      } catch (err) {
        console.error('Error fetching employees:', err);
      }

      // Fetch doctors
      try {
        const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list);
        const doctorsData = doctorsResponse.data.data || doctorsResponse.data || [];
        doctorsData.forEach(doctor => {
          allUsers.push({
            _id: doctor._id,
            id: doctor.doctorId || doctor.email || doctor._id,
            name: doctor.fullName || doctor.name,
            role: 'doctor',
            panel: 'doctor',
            source: 'Doctor',
            permissions: [],
            forms: 0,
            contact: doctor.phoneNumber || doctor.mobileNumber || '-',
            email: doctor.email || '-',
            createdBy: doctor.createdBy?.fullName || 'System',
            createdOn: doctor.createdAt ? new Date(doctor.createdAt).toISOString().slice(0, 10) : '-',
            status: doctor.status === 'active' ? 'Active' : (doctor.status || 'Active'),
            userId: doctor._id || doctor.id
          });
        });
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }

      // Fetch advocates
      try {
        const advocatesResponse = await apiClient.get(apiEndpoints.advocates.list);
        const advocatesData = advocatesResponse.data.data || advocatesResponse.data || [];
        advocatesData.forEach(advocate => {
          allUsers.push({
            _id: advocate._id,
            id: advocate.barCouncilNumber || advocate.email || advocate._id,
            name: advocate.fullName || advocate.name,
            role: 'advocate',
            panel: 'advocate',
            source: 'Advocate',
            permissions: [],
            forms: 0,
            contact: advocate.phoneNumber || advocate.mobileNumber || '-',
            email: advocate.email || '-',
            createdBy: advocate.createdBy?.fullName || 'System',
            createdOn: advocate.createdAt ? new Date(advocate.createdAt).toISOString().slice(0, 10) : '-',
            status: advocate.status === 'active' ? 'Active' : (advocate.status || 'Active'),
            userId: advocate._id || advocate.id
          });
        });
      } catch (err) {
        console.error('Error fetching advocates:', err);
      }

      // Fetch experts
      try {
        const expertsResponse = await apiClient.get(apiEndpoints.experts.list);
        const expertsData = expertsResponse.data.data || expertsResponse.data || [];
        expertsData.forEach(expert => {
          allUsers.push({
            _id: expert._id,
            id: expert.email || expert._id,
            name: expert.fullName || expert.name,
            role: 'expert',
            panel: 'expert',
            source: 'Expert',
            permissions: [],
            forms: 0,
            contact: expert.phoneNumber || expert.mobileNumber || '-',
            email: expert.email || '-',
            createdBy: expert.createdBy?.fullName || 'System',
            createdOn: expert.createdAt ? new Date(expert.createdAt).toISOString().slice(0, 10) : '-',
            status: expert.status === 'active' ? 'Active' : (expert.status || 'Active'),
            userId: expert._id || expert.id
          });
        });
      } catch (err) {
        console.error('Error fetching experts:', err);
      }

      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Load forms and permissions for existing user
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

  // Load forms when panel changes
  useEffect(() => {
    // Don't auto-load forms if we're in edit mode and the panel hasn't changed
    if (existingUserForEdit && !panel) {
      return;
    }
    
    if (panel) {
      // For new user creation, load empty forms
      if (!existingUserForEdit) {
        let allForms = [...getFormsForPanel(panel)];
        
        if (additionalPanels && additionalPanels.length > 0) {
          additionalPanels.forEach(addPanel => {
            const forms = getFormsForPanel(addPanel);
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
    } else {
      setForms([]);
    }
  }, [panel, additionalPanels]);

  // UPDATED: Handle checkbox change with permission dependencies
  const handlePermissionChange = (idx, perm, value) => {
    const updated = [...forms];
    const form = updated[idx];

    // Check if this permission is disabled for the current panel
    if (!overrideMode && isPermissionDisabledForPanel(form.name, perm, panel)) {
      return; // Don't allow changing disabled permissions unless in override mode
    }

    // Check permission dependencies
    const dependencyCheck = canChangePermission(updated, idx, perm, value, panel);
    if (!dependencyCheck.allowed) {
      alert(dependencyCheck.reason);
      return;
    }

    if (perm === "full") {
      // When full is selected, enable all available permissions
      const availableActions = getAvailableActions(form.name, panel);
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
      updated[idx].full = value;
    } else {
      // Handle individual permission changes
      updated[idx][perm] = value;

      // If enabling a permission, enable its dependencies
      if (value === true) {
        const dependencies = getPermissionDependencies(perm);
        dependencies.forEach(dep => {
          if (!isPermissionDisabledForPanel(form.name, dep, panel)) {
            updated[idx][dep] = true;
          }
        });
      }

      // If disabling read, disable all dependent permissions
      if (perm === "read" && value === false) {
        ["write", "edit", "delete"].forEach(p => {
          if (!isPermissionDisabledForPanel(form.name, p, panel)) {
            updated[idx][p] = false;
          }
        });
      }

      // Update full permission status
      const availableActions = getAvailableActions(form.name, panel);
      const allAvailableChecked = availableActions.every(p => updated[idx][p]);
      const allChecked = allAvailableChecked && (!overrideMode ||
        ["read", "write", "edit", "delete"].every(p => updated[idx][p]));
      updated[idx].full = allChecked;
    }

    setForms(updated);
  };

  // UPDATED: Column all with permission dependencies
  const colAll = (perm, value) => {
    const updated = forms.map((f, idx) => {
      // Check if this permission is disabled for this form and panel
      if (!overrideMode && isPermissionDisabledForPanel(f.name, perm, panel)) {
        return f; // Don't change disabled permissions
      }

      // Check if we can change this permission
      const dependencyCheck = canChangePermission(updated, idx, perm, value, panel);
      if (!dependencyCheck.allowed) {
        return f;
      }

      const newForm = { ...f, [perm]: value };

      // If enabling a permission, enable its dependencies
      if (value === true) {
        const dependencies = getPermissionDependencies(perm);
        dependencies.forEach(dep => {
          if (!isPermissionDisabledForPanel(f.name, dep, panel)) {
            newForm[dep] = true;
          }
        });
      }

      // If disabling read, disable all dependent permissions
      if (perm === "read" && value === false) {
        ["write", "edit", "delete"].forEach(p => {
          if (!isPermissionDisabledForPanel(f.name, p, panel)) {
            newForm[p] = false;
          }
        });
      }

      return newForm;
    });

    // Update full permission status for all forms
    updated.forEach((f, i) => {
      const availableActions = getAvailableActions(f.name, panel);
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

  const applyPreset = (presetRole) => {
    setRole(presetRole);
    if (!panel) {
      const rolePanelMap = {
        "Admin": "admin",
        "Telecaller": "telecaller",
        "Salesman": "salesman",
        "Advocates": "advocate",
        "Experts": "expert"
      };
      setPanel(rolePanelMap[presetRole] || "admin");
    }
    if (forms.length === 0) return;

    clearMatrix();
    const updated = [...forms];

    const check = (filter, perms) => {
      updated.forEach((f, i) => {
        if (filter(f.name)) {
          perms.forEach(p => {
            if (!overrideMode && isPermissionDisabledForPanel(f.name, p, panel)) {
              return; // Skip disabled permissions
            }
            updated[i][p] = true;
            
            // Enable dependencies
            const dependencies = getPermissionDependencies(p);
            dependencies.forEach(dep => {
              if (!isPermissionDisabledForPanel(f.name, dep, panel)) {
                updated[i][dep] = true;
              }
            });
          });
          const availableActions = getAvailableActions(f.name, panel);
          updated[i].full = availableActions.every(p => updated[i][p]);
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

  // Save user (either create new or update existing)
  const saveUser = async () => {
    if (!panel || !role || !userId || !empName) {
      alert("Please fill Panel, Role, User ID, and Name.");
      return;
    }
    if (forms.length === 0) {
      alert("Please select a Panel to load forms.");
      return;
    }

    // For new users, require password
    if (!existingUserForEdit && !password) {
      alert("Please provide a password for the new user.");
      return;
    }

    // For existing users, if password is the masked value, don't send it
    const shouldUpdatePassword = existingUserForEdit && password !== "••••••" && password.trim() !== "";

    try {
      setLoading(true);
      const permissionsArray = forms.map(f => ({
        formName: f.name,
        read: f.read,
        write: f.write,
        edit: f.edit,
        delete: f.delete,
        full: f.full
      }));

      if (existingUserForEdit) {
        // Update existing user
        const userData = {
          username: userId,
          email: userId.includes('@') ? userId : `${userId}@rapid.com`,
          fullName: empName,
          phoneNumber: contact,
          role,
          panel,
          additionalPanels,
          permissions: permissionsArray,
          status: status.toLowerCase(),
          remarks: note
        };

        // Only include password if it's changed
        if (shouldUpdatePassword) {
          userData.password = password;
        }

        const response = await apiClient.put(apiEndpoints.users.update(existingUserForEdit._id), userData);
        if (response.data.success) {
          alert('User updated successfully!');
          await fetchUsers();
          resetForm();
        } else {
          setError(response.data.message || 'Failed to update user');
        }
      } else {
        // Create new user
        const userData = {
          username: userId,
          email: userId.includes('@') ? userId : `${userId}@rapid.com`,
          password, 
          fullName: empName, 
          phoneNumber: contact,
          role, 
          panel, 
          additionalPanels, 
          permissions: permissionsArray,
          status: status.toLowerCase(), 
          remarks: note
        };

        const response = await apiClient.post(apiEndpoints.users.create, userData);
        if (response.data.success) {
          alert('User created successfully!');
          await fetchUsers();
          resetForm();
        } else {
          setError(response.data.message || 'Failed to create user');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save user';
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPanel(""); 
    setRole(""); 
    setUserId(""); 
    setPassword(""); 
    setEmpName("");
    setContact(""); 
    setCreatedBy(""); 
    setStatus("Active"); 
    setNote(""); 
    setFormSearch("");
    setForms([]); 
    setOverrideMode(false); 
    setAdditionalPanels([]);
    setExistingUserForEdit(null);
    setShowAllUsersDropdown(false);
    setError("");
  };

  // Reset password for existing user
  const resetUserPassword = async (userId, newPassword) => {
    if (!newPassword) {
      alert('Please provide a new password');
      return;
    }

    if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.put(apiEndpoints.users.update(userId), {
        password: newPassword
      });
      
      if (response.data.success) {
        alert('Password reset successfully!');
        if (existingUserForEdit && existingUserForEdit._id === userId) {
          setPassword('••••••');
        }
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Edit user function
  const handleEditUser = (user) => {
    console.log("Editing user:", user);
    
    // Set the existing user for edit
    setExistingUserForEdit(user);
    setShowAllUsersDropdown(true);
    
    // Auto-fill the form with user data
    setPanel(user.panel || "");
    setRole(user.role || "");
    setUserId(user.username || user.email || user.id || "");
    setEmpName(user.fullName || user.name || "");
    setContact(user.phoneNumber || user.contact || "");
    setStatus(user.status === 'active' ? 'Active' : (user.status || 'Active'));
    setNote(user.remarks || user.note || "");
    setAdditionalPanels(user.additionalPanels || []);
    
    // Set password field to indicate it's being edited
    setPassword("••••••");
    
    // Load forms and permissions
    loadFormsAndPermissions(user);
    
    // Scroll to form section
    setTimeout(() => {
      document.getElementById('user-form-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Delete user function
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.fullName || user.name}"?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.users.delete(user._id));
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' || user.status === 'active' ? 'inactive' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} user "${user.fullName || user.name}"?`)) return;

    try {
      setLoading(true);
      await apiClient.put(apiEndpoints.users.update(user._id), {
        status: newStatus
      });
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // View User Details Modal Handler
  const handleViewUser = (user) => {
    setViewUserModal(user);
  };

  // View Permissions Modal Handler
  const handleViewPermissions = (user) => {
    setPermissionsModal(user);
  };

  // UPDATED: Check if permission should be disabled considering dependencies
  const isPermissionDisabled = (form, permission) => {
    // Check if disabled by panel rules
    if (!overrideMode && isPermissionDisabledForPanel(form.name, permission, panel)) {
      return true;
    }

    // Check dependency rules
    if (permission !== 'read') {
      const dependencies = getPermissionDependencies(permission);
      if (dependencies.includes('read') && !form.read) {
        return true; // Disable if read permission is not granted
      }
    }

    return false;
  };

  const filteredForms = forms.filter(f => f.name.toLowerCase().includes(formSearch.toLowerCase()));
  const filteredUsers = users.filter(u => {
    const str = `${u.id} ${u.name} ${u.role} ${u.panel} ${u.contact} ${u.createdBy} ${u.status} ${u.source || ''} ${u.email || ''}`.toLowerCase();
    const matchesSearch = !userSearch || str.includes(userSearch.toLowerCase());
    const matchesSource = filterSource === 'All' || (u.source || '').toLowerCase() === filterSource.toLowerCase();
    return matchesSearch && matchesSource;
  });

  // Table actions for the users list
  const tableActions = [
    {
      label: "View",
      icon: <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>,
      onClick: (row) => handleViewUser(row),
      showAsIcon: true
    },
    {
      label: "Edit",
      icon: <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>,
      onClick: (row) => handleEditUser(row),
      showAsIcon: true
    },
    {
      label: "Delete",
      icon: <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>,
      onClick: (row) => handleDeleteUser(row),
      showAsIcon: true
    },
  ];

  // Extra columns for the table
  const extraColumns = [
    {
      header: "Permissions",
      render: (row) => (
        <button
          onClick={() => handleViewPermissions(row)}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 border border-purple-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          View ({row.permissions?.length || 0})
        </button>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(row)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${
              (row.status === 'Active' || row.status === 'active') ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={row.status === 'Active' ? 'Deactivate user' : 'Activate user'}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              (row.status === 'Active' || row.status === 'active') ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
          <span className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] text-center ${
            (row.status === 'Active' || row.status === 'active') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {row.status === 'Active' || row.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    }
  ];

  if (loading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 font-sans flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-[#1e3d36] mb-2">User Management</h1>
      <p className="text-sm text-[#6c8b83] mb-6">
        Create new users with custom permissions. View all users from System Users, Employees, Doctors, Telecallers, Advocates, and Experts. Select a Panel to auto-load all its sections/forms, then assign user details & permissions (Read / Write / Edit / Delete).
      </p>
      
      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm">
        <strong>Security Notice:</strong> For security reasons, passwords are stored using bcrypt hashing and cannot be displayed in plain text after creation. To reset a user's password, use the "Reset Password" feature when managing existing users or generate a new secure password.
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* EXISTING USER MANAGEMENT */}
      {!existingUserForEdit && !showAllUsersDropdown && (
        <div className="mb-6">
          <button
            onClick={() => setShowAllUsersDropdown(true)}
            className="px-6 py-3 text-sm bg-[#157a6e] text-white rounded-lg hover:bg-[#0f5c55] font-bold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Manage Existing Users
          </button>
        </div>
      )}
      
      {showAllUsersDropdown && (
        <div className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <strong className="text-lg text-[#1e3d36]">Manage Existing User</strong>
            <button 
              onClick={() => setShowAllUsersDropdown(false)}
              className="text-sm text-[#157a6e] hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#35524a] mb-2">Select Existing User</label>
              <select 
                value={existingUserForEdit ? existingUserForEdit._id : ""} 
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) {
                    setExistingUserForEdit(null);
                    return;
                  }
                  
                  const selected = users.find(user => {
                    return String(user._id) === String(selectedId);
                  });
                  
                  if (selected) {
                    handleEditUser(selected);
                  } else {
                    console.warn(`User with ID ${selectedId} not found in users list`);
                    setExistingUserForEdit(null);
                  }
                }}
                className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
              >
                <option value="">-- Select User --</option>
                {users.filter(u => !u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role)).map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.role} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            {existingUserForEdit && (
              <div className="flex items-end">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset Selection
                </button>
              </div>
            )}
          </div>
          
          {existingUserForEdit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div><strong>User:</strong> {existingUserForEdit.fullName}</div>
                <div><strong>Role:</strong> {existingUserForEdit.role}</div>
                <div><strong>Panel:</strong> {existingUserForEdit.panel}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    existingUserForEdit.status === 'Active' || existingUserForEdit.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {existingUserForEdit.status}
                  </span>
                </div>
                {existingUserForEdit.additionalPanels && existingUserForEdit.additionalPanels.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-4">
                    <strong>Additional Panels:</strong> {existingUserForEdit.additionalPanels.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT USER SECTION */}
      <div id="user-form-section" className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <strong className="text-xl text-[#1e3d36]">
            {existingUserForEdit ? `Edit User: ${existingUserForEdit.fullName}` : "Create New User"}
          </strong>
          <div className="flex gap-2 flex-wrap">
            {!existingUserForEdit && (
              <>
                {/* Template from existing user button */}
                <button 
                  onClick={() => {
                    const validUsers = users.filter(u => !u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role));
                    if (validUsers.length === 0) {
                      alert('No existing users available to use as template');
                      return;
                    }
                    
                    const templateUserEmail = prompt('Enter email/username of user to use as template:');
                    if (templateUserEmail) {
                      const templateUser = users.find(u => 
                        (!u.source || u.source === 'System User' || ['admin', 'super_admin', 'sales', 'salesman', 'telecaller', 'advocate', 'doctor', 'expert'].includes(u.role)) && 
                        (u.email === templateUserEmail || u.username === templateUserEmail || u._id === templateUserEmail)
                      );
                      
                      if (templateUser) {
                        setPanel(templateUser.panel || "");
                        setRole(templateUser.role || "");
                        setAdditionalPanels(templateUser.additionalPanels || []);
                        
                        // Load user's permissions as template
                        loadFormsAndPermissions(templateUser);
                        
                        alert(`Template loaded from user: ${templateUser.fullName}`);
                      } else {
                        alert('User not found. Please check the email/username.');
                      }
                    }
                  }}
                  className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Use Template
                </button>
                
                <span className="text-sm text-[#6c8b83] flex items-center">Quick presets:</span>
                {["Admin", "Telecaller", "Salesman", "Advocates", "Experts"].map(r => (
                  <button key={r} onClick={() => applyPreset(r)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
                    {r}
                  </button>
                ))}
                <button onClick={presetReadOnly} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
                  Read-only
                </button>
              </>
            )}
            {existingUserForEdit && (
              <button 
                onClick={resetForm}
                className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New
              </button>
            )}
          </div>
        </div>

        {/* === INPUT FIELDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Panel</label>
            <select value={panel} onChange={e => setPanel(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
              <option value="">-- Select Panel --</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="salesman">Salesman</option>
              <option value="telecaller">Telecaller</option>
              <option value="doctor">Doctor</option>
              <option value="advocate">Advocate</option>
              <option value="expert">Expert</option>
            </select>
            <p className="text-xs text-[#6c8b83] mt-1">Loads all sections/forms below.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">User Type / Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
              <option value="">-- Select Role --</option>
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
            <label className="block text-sm font-medium text-[#35524a] mb-2">User ID</label>
            <input value={userId} onChange={e => setUserId(e.target.value)} type="text" placeholder="username or email" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">
              {existingUserForEdit ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <div className="flex gap-2">
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type={showPassword ? "text" : "password"} 
                placeholder={existingUserForEdit ? "New password (optional)" : "Set password"} 
                className="flex-1 p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" 
              />
              <button onClick={() => setShowPassword(!showPassword)} className="px-4 py-3 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {existingUserForEdit && (
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => resetUserPassword(existingUserForEdit._id, prompt('Enter new password:'))}
                  className="text-xs text-red-600 hover:underline"
                >
                  Reset Password
                </button>
                <button 
                  onClick={() => {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                    let newPassword = '';
                    for (let i = 0; i < 12; i++) {
                      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    setPassword(newPassword);
                    alert(`Generated password: ${newPassword}\nMake sure to share this securely with the user!`);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Generate Password
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Employee / Name</label>
            <input value={empName} onChange={e => setEmpName(e.target.value)} type="text" placeholder="e.g., Ananya Sharma" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Contact</label>
            <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="e.g., 9876543210" className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Created By</label>
            <select value={createdBy} onChange={e => setCreatedBy(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
              <option value="">-- Select --</option>
              <option>Owner</option>
              <option>Admin — Neha Patel</option>
              <option>HR — Karan Shah</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any remarks..." rows={3} className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent resize-vertical"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35524a] mb-2">Search form in this panel</label>
            <input value={formSearch} onChange={e => setFormSearch(e.target.value)} type="text" placeholder="Type to filter forms..." className="w-full p-3 border border-[#e0ece7] rounded-lg text-sm focus:ring-2 focus:ring-[#157a6e] focus:border-transparent" />
          </div>
        </div>

        {/* Additional Panels Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#35524a] mb-3">Additional Panels (Optional)</label>
          <div className="flex flex-wrap gap-4">
            {["admin", "employee", "salesman", "telecaller", "doctor", "advocate", "expert"]
              .filter(p => p !== panel)
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
                          getFormsForPanel(panel).includes(f.name)
                        ));
                      }
                    }}
                    className="mr-2 w-4 h-4 text-[#157a6e] border-[#e0ece7] rounded focus:ring-[#157a6e]"
                  />
                  <span className="text-sm text-[#35524a] capitalize">{availablePanel.replace('_', ' ')}</span>
                </label>
              ))}
          </div>
          {additionalPanels.length > 0 && (
            <p className="text-xs text-[#6c8b83] mt-2">
              User will have access to forms from: {additionalPanels.join(', ')}
            </p>
          )}
        </div>

        {/* === OVERRIDE TOGGLE === */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={overrideMode}
            onChange={e => setOverrideMode(e.target.checked)}
            className="w-5 h-5 text-[#157a6e] rounded focus:ring-[#157a6e]"
          />
          <div>
            <span className="text-sm font-medium text-[#157a6e]">
              {overrideMode ? "Override Mode ON (All permissions editable)" : "Enable Override Mode"}
            </span>
            {overrideMode && <p className="text-xs text-amber-600 mt-1">Manual control enabled - you can edit all permissions regardless of panel restrictions</p>}
          </div>
        </div>

        {/* === PERMISSIONS MATRIX === */}
        <div className="flex justify-between items-center mb-4">
          <strong className="text-lg text-[#1e3d36]">Forms & Permissions</strong>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-block bg-[#eef8f7] border border-[#e0ece7] text-[#246a60] px-3 py-2 rounded-full text-sm font-bold">
              {forms.length} forms
            </span>
            <button onClick={() => colAll("read", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Read</button>
            <button onClick={() => colAll("write", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Write</button>
            <button onClick={() => colAll("edit", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Edit</button>
            <button onClick={() => colAll("delete", true)} className="px-4 py-2 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6]">All Delete</button>
            <button onClick={clearMatrix} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">Clear All</button>
          </div>
        </div>

        {forms.length > 0 ? (
          <div className="border border-[#e0ece7] rounded-lg overflow-auto max-h-96">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#f0faf6] text-[#157a6e] font-bold">
                <tr>
                  <th className="p-4 text-left text-sm" style={{ minWidth: "260px" }}>Form / Section</th>
                  <th className="p-4 text-center text-sm">Read</th>
                  <th className="p-4 text-center text-sm">Write</th>
                  <th className="p-4 text-center text-sm">Edit</th>
                  <th className="p-4 text-center text-sm">Delete</th>
                  <th className="p-4 text-center text-sm">Full</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.map((f, i) => (
                  <tr key={i} className="border-b border-[#e0ece7] hover:bg-[#f8fdfa]">
                    <td className="p-4 text-sm text-[#35524a]">{f.name}</td>
                    {["read", "write", "edit", "delete", "full"].map(perm => {
                      const disabled = isPermissionDisabled(f, perm);
                      return (
                        <td key={perm} className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={f[perm]}
                            disabled={disabled}
                            onChange={e => handlePermissionChange(i, perm, e.target.checked)}
                            className={`w-5 h-5 text-[#157a6e] border-[#e0ece7] rounded focus:ring-[#157a6e] cursor-pointer ${
                              disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={disabled ? 
                              (perm !== 'read' && !f.read ? `${perm} permission requires Read permission` : 
                              `${perm} permission not allowed for ${panel} panel on ${f.name}`) 
                              : ''}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#e0ece7] rounded-lg p-8 text-center bg-gray-50">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No forms loaded. Please select a Panel to load forms.</p>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#e0ece7]">
          <button onClick={resetForm} className="px-6 py-3 text-sm border border-[#e0ece7] text-[#157a6e] rounded-lg hover:bg-[#f0faf6] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={saveUser}
            disabled={loading}
            className="px-6 py-3 text-sm bg-[#157a6e] text-white rounded-lg hover:bg-[#0f5c55] font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {existingUserForEdit ? 'Updating User...' : 'Creating User...'}
              </>
            ) : (
              existingUserForEdit ? 'Update User' : 'Create User'
            )}
          </button>
        </div>
      </div>

      {/* === ALL USERS LIST WITH TABLE COMPONENT === */}
      <div className="bg-white border border-[#e0ece7] rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <strong className="text-xl text-[#1e3d36]">All Users List</strong>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative">
              <input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                type="text"
                placeholder="Search by name/email/role..."
                className="pl-10 pr-4 py-2 text-sm border border-[#e0ece7] rounded-lg focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c8b83]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
              className="px-4 py-2 text-sm border border-[#e0ece7] rounded-lg focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
            >
              <option value="All">All Sources</option>
              <option value="System User">System Users</option>
              <option value="Employee">Employees</option>
              <option value="Doctor">Doctors</option>
              <option value="Advocate">Advocates</option>
              <option value="Expert">Experts</option>
            </select>
            <span className="inline-block bg-[#eef8f7] border border-[#e0ece7] text-[#246a60] px-3 py-2 rounded-full text-sm font-bold">
              {filteredUsers.length} / {users.length} users
            </span>
          </div>
        </div>

        {/* USE TABLE COMPONENT HERE - PERMISSIONS COLUMN AT 6TH POSITION */}
        <Table
          data={filteredUsers}
          actions={tableActions}
          extraColumns={extraColumns}
          excludeColumns={['permissions', 'forms', '_id', 'userId', 'username', 'fullName', 'phoneNumber', 'remarks', 'additionalPanels']}
          columnOrder={['id', 'name', 'role', 'panel', 'contact', 'Permissions', 'email', 'createdBy', 'createdOn', 'Status', 'source']}
          pagination={true}
          defaultPageSize={10}
        />
      </div>

      {/* === VIEW USER DETAILS MODAL (Eye Icon) === */}
      {viewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#e0ece7] sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#1e3d36]">User Details</h2>
              <button
                onClick={() => setViewUserModal(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{viewUserModal.fullName || viewUserModal.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">User ID / Username</label>
                    <p className="text-gray-700">{viewUserModal.username || viewUserModal.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Email</label>
                    <p className="text-gray-700">{viewUserModal.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Contact Number</label>
                    <p className="text-gray-700">{viewUserModal.phoneNumber || viewUserModal.contact || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Source</label>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {viewUserModal.source}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Role</label>
                    <p className="text-gray-700 capitalize">{viewUserModal.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Panel</label>
                    <p className="text-gray-700 capitalize">{viewUserModal.panel}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      (viewUserModal.status === 'Active' || viewUserModal.status === 'active') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewUserModal.status === 'Active' || viewUserModal.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Created By</label>
                    <p className="text-gray-700">{viewUserModal.createdBy || 'System'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#35524a] mb-1">Created On</label>
                    <p className="text-gray-700">{viewUserModal.createdOn || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {viewUserModal.additionalPanels && viewUserModal.additionalPanels.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-[#35524a] mb-2">Additional Panels</label>
                  <div className="flex flex-wrap gap-2">
                    {viewUserModal.additionalPanels.map((panel, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                        {panel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {viewUserModal.remarks && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#35524a] mb-2">Remarks / Notes</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{viewUserModal.remarks}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewUserModal(null)}
                  className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === PERMISSIONS MATRIX MODAL (Permissions Button) === */}
      {permissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#e0ece7] sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#1e3d36]">
                Permissions for {permissionsModal.fullName || permissionsModal.name}
              </h2>
              <button
                onClick={() => setPermissionsModal(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Role:</strong> {permissionsModal.role} | <strong>Panel:</strong> {permissionsModal.panel} | 
                      <strong> Total Forms:</strong> {permissionsModal.permissions?.length || 0}
                    </p>
                  </div>
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Permissions Matrix
                  </span>
                </div>

                {permissionsModal.permissions && permissionsModal.permissions.length > 0 ? (
                  <div className="border border-[#e0ece7] rounded-lg overflow-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#f0faf6] text-[#157a6e] font-bold">
                        <tr>
                          <th className="p-4 text-left text-sm" style={{ minWidth: "260px" }}>Form / Section</th>
                          <th className="p-4 text-center text-sm">Read</th>
                          <th className="p-4 text-center text-sm">Write</th>
                          <th className="p-4 text-center text-sm">Edit</th>
                          <th className="p-4 text-center text-sm">Delete</th>
                          <th className="p-4 text-center text-sm">Full Access</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissionsModal.permissions.map((perm, idx) => (
                          <tr key={idx} className="border-b border-[#e0ece7] hover:bg-[#f8fdfa]">
                            <td className="p-4 text-sm text-[#35524a]">{perm.formName || perm.name || 'N/A'}</td>
                            <td className="p-4 text-center">
                              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                                perm.read ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {perm.read ? '✓' : '✗'}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                                perm.write ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {perm.write ? '✓' : '✗'}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                                perm.edit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {perm.edit ? '✓' : '✗'}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                                perm.delete ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {perm.delete ? '✓' : '✗'}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                                perm.full ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {perm.full ? '✓' : '✗'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No permissions assigned</p>
                    <p className="text-gray-400 text-sm mt-2">This user doesn't have any specific permissions configured.</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setPermissionsModal(null)}
                    className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Close
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;