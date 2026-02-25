

// // AddBankAccount.jsx
// import React, { useState } from "react";
// import Table from "../../../components/mainComponents/Table";

// // Sample Bank Data (replace with API later)
// const bankData = [
//   {
//     BankName: "fkshfk",
//     IFSCCode: "fkshfk",
//     Branch: "fkshfk",
//     City: "fkshfk",
//     AccountType: "fkshfk",
//   },
// ];

// // Actions with SVG Icons (Edit = Pencil, Delete = Trash)
// const actions = [
//   {
//     label: "Edit",
//     useDropdown: false,
//     showAsIcon: true,
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//         />
//       </svg>
//     ),
//     onClick: (row, idx) => alert(`Edit: ${row.BankName}`),
//   },
//   {
//     label: "Delete",
//     useDropdown: false,
//     showAsIcon: true,
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5 text-red-600 hover:text-red-800 transition-colors"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//         />
//       </svg>
//     ),
//     onClick: (row, idx) => {
//       if (window.confirm(`Delete bank: ${row.BankName}?`)) {
//         console.log("Deleted:", row);
//         alert("Bank deleted!");
//       }
//     },
//   },
// ];

// const AddBankAccount = () => {
//   // Form States
//   const [bankAccount, setBankAccount] = useState("");
//   const [ifscCode, setIfscCode] = useState("");
//   const [branch, setBranch] = useState("");
//   const [city, setCity] = useState("");
//   const [accountType, setAccountType] = useState("Saving");

//   // Search & Sort States
//   const [searchByBankName, setSearchByBankName] = useState("");
//   const [sortByAccountType, setSortByAccountType] = useState("");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchByIFSC, setSearchByIFSC] = useState("");

//   const handleSave = () => {
//     if (!bankAccount || !ifscCode || !branch || !city) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     const newBank = {
//       BankName: bankAccount,
//       IFSCCode: ifscCode,
//       Branch: branch,
//       City: city,
//       AccountType: accountType,
//     };

//     console.log("New Bank Added:", newBank);
//     alert("Bank Account Saved Successfully!");

//     // Reset form
//     setBankAccount("");
//     setIfscCode("");
//     setBranch("");
//     setCity("");
//     setAccountType("Saving");
//   };

//   return (
//     <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* Title */}
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Receipt Bank Account</h2>

//       {/* Add Bank Form */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
//           <input
//             type="text"
//             value={bankAccount}
//             onChange={(e) => setBankAccount(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
//             placeholder="Enter Bank Account"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">IFSC code</label>
//           <input
//             type="text"
//             value={ifscCode}
//             onChange={(e) => setIfscCode(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
//             placeholder="Enter IFSC Code"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//           <input
//             type="text"
//             value={branch}
//             onChange={(e) => setBranch(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
//             placeholder="Enter Branch"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//           <input
//             type="text"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
//             placeholder="Enter City"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
//           <select
//             value={accountType}
//             onChange={(e) => setAccountType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
//           >
//             <option value="Saving">Saving</option>
//             <option value="Current">Current</option>
//           </select>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="mb-8">
//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition-colors shadow-sm"
//         >
//           Save
//         </button>
//       </div>

//       {/* Search & Sort Filters */}
//       <div className="grid grid-cols-averaged-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Search By Bank Name</label>
//           <input
//             type="text"
//             value={searchByBankName}
//             onChange={(e) => setSearchByBankName(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
//             placeholder="Search..."
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sort by Account Type</label>
//           <select
//             value={sortByAccountType}
//             onChange={(e) => setSortByAccountType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
//           >
//             <option value="">None</option>
//             <option value="Saving">Saving</option>
//             <option value="Current">Current</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Search By City</label>
//           <input
//             type="text"
//             value={searchByCity}
//             onChange={(e) => setSearchByCity(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
//             placeholder="Search..."
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Search by IFSC Code</label>
//           <input
//             type="text"
//             value={searchByIFSC}
//             onChange={(e) => setSearchByIFSC(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
//             placeholder="Search..."
//           />
//         </div>
//       </div>

//       {/* Reusable Table */}
//       <Table data={bankData} actions={actions} />
//     </div>
//   );
// };

// export default AddBankAccount;




import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const AddBankAccount = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we're editing

  // Form states
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    city: "",
    accountType: "saving",
  });

  // Search states
  const [searchByBankName, setSearchByBankName] = useState("");
  const [sortByAccountType, setSortByAccountType] = useState("");
  const [searchByCity, setSearchByCity] = useState("");
  const [searchByIFSC, setSearchByIFSC] = useState("");

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      // Using apiHelpers for consistent API calls with the new receipt bank details endpoints
      const data = await apiHelpers.getList(apiEndpoints.recBankDetails.list);

      // Ensure we always have an array
      const banksData = Array.isArray(data?.data) ? data.data : [];
      setBanks(banksData);
    } catch (error) {
      console.error('Error fetching receipt bank details:', error);
      setBanks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      if (editingId) {
        // Update existing bank
        await apiHelpers.update(apiEndpoints.recBankDetails.update, editingId, formData);
        alert("Receipt Bank Account Updated Successfully!");
        setEditingId(null); // Reset editing mode
      } else {
        // Create new bank
        await apiHelpers.create(apiEndpoints.recBankDetails.create, formData);
        alert("Receipt Bank Account Saved Successfully!");
      }

      // Reset form
      setFormData({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branch: "",
        city: "",
        accountType: "saving",
      });

      // Refresh bank list
      fetchBanks();
    } catch (error) {
      console.error('Error saving receipt bank account:', error);
      alert('Failed to save receipt bank account');
    }
  };

  const handleDeleteBank = async (bank) => {
    if (window.confirm(`Delete bank: ${bank.bankName}?`)) {
      try {
        await apiHelpers.delete(apiEndpoints.recBankDetails.delete, bank._id);
        alert('Receipt bank deleted successfully!');
        fetchBanks();
      } catch (error) {
        console.error('Error deleting receipt bank:', error);
        alert('Failed to delete receipt bank');
      }
    }
  };

  // Table actions
  const actions = [
    {
      label: "Edit",
      useDropdown: false,
      showAsIcon: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: (row) => {
        // Set form data to the selected row's data for editing
        setFormData({
          bankName: row.bankName,
          accountNumber: row.accountNumber,
          ifscCode: row.ifscCode,
          branch: row.branch,
          city: row.city,
          accountType: row.accountType || 'saving',
        });

        // Store the ID of the bank being edited
        setEditingId(row._id);
      },
    },
    {
      label: "Delete",
      useDropdown: false,
      showAsIcon: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-600 hover:text-red-800 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: handleDeleteBank,
    },
  ];

  const tableColumns = [
    { header: "Bank Name", render: (row) => row.bankName },
    { header: "Account Number", render: (row) => row.accountNumber },
    { header: "IFSC Code", render: (row) => row.ifscCode },
    { header: "Branch", render: (row) => row.branch },
    { header: "City", render: (row) => row.city },
    { header: "Account Type", render: (row) => (
      <span className="capitalize">{row.accountType}</span>
    )},
  ];

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Receipt Bank Account</h2>

      {/* Add Bank Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
            placeholder="Enter Bank Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
            placeholder="Enter Account Number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => handleInputChange('ifscCode', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
            placeholder="Enter IFSC Code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
            placeholder="Enter Branch"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
            placeholder="Enter City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <select
            value={formData.accountType}
            onChange={(e) => handleInputChange('accountType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#398C89] focus:outline-none"
          >
            <option value="saving">Saving</option>
            <option value="current">Current</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition-colors shadow-sm"
        >
          {editingId ? 'Update Receipt Bank Account' : 'Save Receipt Bank Account'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                bankName: "",
                accountNumber: "",
                ifscCode: "",
                branch: "",
                city: "",
                accountType: "saving",
              });
              setEditingId(null);
            }}
            className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors shadow-sm"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Search & Sort Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search By Bank Name</label>
          <input
            type="text"
            value={searchByBankName}
            onChange={(e) => setSearchByBankName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
            placeholder="Search..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by Account Type</label>
          <select
            value={sortByAccountType}
            onChange={(e) => setSortByAccountType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
          >
            <option value="">All</option>
            <option value="saving">Saving</option>
            <option value="current">Current</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search By City</label>
          <input
            type="text"
            value={searchByCity}
            onChange={(e) => setSearchByCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
            placeholder="Search..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by IFSC Code</label>
          <input
            type="text"
            value={searchByIFSC}
            onChange={(e) => setSearchByIFSC(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Banks Table */}
      {loading ? (
        <div className="text-center py-8">Loading banks...</div>
      ) : (
        <Table 
          data={banks} 
          actions={actions} 
          columns={tableColumns}
          pagination={true}
        />
      )}
    </div>
  );
};

export default AddBankAccount;