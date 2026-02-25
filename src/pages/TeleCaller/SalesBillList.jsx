// import React, { useState, useEffect } from 'react';
// import Table from '../../../components/mainComponents/Table';

// const SalesBill = () => {
//   const [searchName, setSearchName] = useState('Raj Sharma');
//   const [searchSBNo, setSearchSBNo] = useState('');
//   const [searchOldSBNo, setSearchOldSBNo] = useState('');
//   const [searchMembershipType, setSearchMembershipType] = useState('');
//   const [searchMembershipYear, setSearchMembershipYear] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [data, setData] = useState([
//     { srNo: 1, sbNo: '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//     { srNo: 1, sbNo: '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//     { srNo: 1, sbNo : '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//   ]);

//   const fetchData = async () => {
//     // API call placeholder
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     // Add filtering logic here based on search fields
//     const filteredData = data; // Placeholder, replace with actual filtering
//     setData(filteredData);
//   };

// //   const actions = [
// //     {
// //       label: 'Edit',
// //       icon: '✏️',
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Edit ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Print',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Print ${row.sbNo}`),
// //     },
// //     {
// //       label: 'SA',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`SA for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'SAWHF',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`SAWHF for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'WN',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`WN for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Renewed',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Renewed for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Renewal letter',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Renewal letter for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Membership Form',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Membership Form for ${row.sbNo}`),
// //     },
// //   ];





// const actions = [
//   { label: 'Edit', icon: '✏️', showAsIcon: true, onClick: (row) => alert(`Edit ${row.sbNo}`) },
//   { label: 'Print', useDropdown: true, onClick: (row) => alert(`Print ${row.sbNo}`) },
//   { label: 'SA', useDropdown: true, onClick: (row) => alert(`SA for ${row.sbNo}`) },
//   { label: 'SAWHF', useDropdown: true, onClick: (row) => alert(`SAWHF for ${row.sbNo}`) },
//   { label: 'WN', useDropdown: true, onClick: (row) => alert(`WN for ${row.sbNo}`) },
//   { label: 'Renewed', useDropdown: true, onClick: (row) => alert(`Renewed for ${row.sbNo}`) },
//   { label: 'Renewal letter', useDropdown: true, onClick: (row) => alert(`Renewal letter for ${row.sbNo}`) },
//   { label: 'Membership Form', useDropdown: true, onClick: (row) => alert(`Membership Form for ${row.sbNo}`) },
// ];


//   const extraColumns = [
//     // No extra columns needed for this layout
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 min-h-screen mt-16">
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold text-gray-800">Sales Bill</h1>
//           <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium">
//             Create Sale Bill
//           </button>
//         </div>
//         <div className="grid grid-cols-5 gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search SB No</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchSBNo}
//               onChange={(e) => setSearchSBNo(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Old SB No</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchOldSBNo}
//               onChange={(e) => setSearchOldSBNo(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Membership Type</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchMembershipType}
//               onChange={(e) => setSearchMembershipType(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Membership Year</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchMembershipYear}
//               onChange={(e) => setSearchMembershipYear(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <Table
//           data={data}
//           extraColumns={extraColumns}
//           actions={actions}
//         />
//       </div>
//     </div>
//   );
// };

// export default SalesBill;





import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '../../components/mainComponents/Table';
import { Link } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { toast } from 'react-toastify';

const SalesBill = () => {
  const [searchName, setSearchName] = useState('');
  const [searchSBNo, setSearchSBNo] = useState('');
  const [searchOldSBNo, setSearchOldSBNo] = useState('');
  const [searchMembershipType, setSearchMembershipType] = useState('');
  const [searchMembershipYear, setSearchMembershipYear] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);



  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);

      let query = {
        page,
        limit: 15 // Increased page size
      };

      // Add search filters
      if (searchName) query.search = searchName;
      if (searchSBNo) query.billNumber = searchSBNo;
      if (searchOldSBNo) query.oldBillNumber = searchOldSBNo;
      if (searchMembershipType) query.membershipType = searchMembershipType;
      if (searchMembershipYear) query.membershipYear = searchMembershipYear;
      if (fromDate || toDate) {
        if (fromDate) query.dateFrom = fromDate;
        if (toDate) query.dateTo = toDate;
      }

      const response = await apiClient.get(apiEndpoints.salesBills.list, { params: query });

      if (response.data.success) {
        // Transform backend data to match frontend table structure
        const transformedData = response.data.data.map((bill, index) => ({
          id: bill.billId || bill._id, // Use billId if available, otherwise use _id
          srNo: (page - 1) * 15 + index + 1, // Proper sequential numbering
          sbNo: bill.billNumber,
          oldSBNo: bill.relatedDocuments?.quotationId || '', // If related to old bill
          sbDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
          sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
          docToName: bill.client?.name || '',
          membership: bill.items?.length > 0 ? bill?.membershipType || 'N/A' : 'N/A',
          membershipPeriod: bill.servicePeriod
            ? `${bill.servicePeriod.startDate ? new Date(bill.servicePeriod.startDate).toLocaleDateString('en-GB') : ''} - ${bill.servicePeriod.endDate ? new Date(bill.servicePeriod.endDate).toLocaleDateString('en-GB') : ''}`
            : '',
          amount: `₹${bill.totalAmount?.toLocaleString('en-IN') || '0'}`,
          narration: bill.notes || '',
          expiryDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
          _id: bill._id, // Keep the original _id for operations
          client: bill.client
        }));

        setData(transformedData);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
          setTotalCount(response.data.pagination.total || 0);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch sales bills');
      }
    } catch (error) {
      console.error('Error fetching sales bills:', error);
      toast.error(error.response?.data?.message || 'Error fetching sales bills');
    } finally {
      setLoading(false);
    }
  };

  const deleteSalesBill = async (row) => {
    if (window.confirm(`Are you sure you want to delete sales bill ${row.sbNo}?`)) {
      try {
        const response = await apiClient.delete(apiEndpoints.salesBills.delete(row._id));

        if (response.data.success) {
          toast.success('Sales bill deleted successfully!');
          fetchData(currentPage); // Refresh current page
        } else {
          toast.error(response.data.message || 'Failed to delete sales bill');
        }
      } catch (error) {
        console.error('Error deleting sales bill:', error);
        toast.error(error.response?.data?.message || 'Error deleting sales bill');
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchData(1);
  };

  const actions = [
    { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/admin/edit-salesbill/${row._id}`) },
    {
  label: 'Print',
  useDropdown: true,
  onClick: (row) => {
    // Option 1: Simple navigation (best for most cases)
    navigate(`/admin/salesbill/print/${row._id}`);

    // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
    // navigate(`/admin/salesbill/print/${row.billNumber}`);
  }
},
  {
  label: 'SA',
  useDropdown: true,
  onClick: (row) => {
    // Option 1: Simple navigation (best for most cases)
    navigate(`/admin/salesbill/sa/${row._id}`);

    // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
    // navigate(`/admin/salesbill/print/${row.billNumber}`);
  }
},

    // { label: 'Print', useDropdown: true, onClick: (row) => console.log(`Print ${row.sbNo}`) },
    // { label: 'SA', useDropdown: true, onClick: (row) => console.log(`SA for ${row.sbNo}`) },
    { label: 'SAWHF', useDropdown: true, onClick: (row) => console.log(`SAWHF for ${row.sbNo}`) },
    // { label: 'WN', useDropdown: true, onClick: (row) => console.log(`WN for ${row.sbNo}`) },


     {
  label: 'WN',
  useDropdown: true,
  onClick: (row) => {
    // Option 1: Simple navigation (best for most cases)
    navigate(`/admin/salesbill/WN/${row._id}`);

    // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
    // navigate(`/admin/salesbill/print/${row.billNumber}`);
  }
},
    // { label: 'Renewed', useDropdown: true, onClick: (row) => console.log(`Renewed for ${row.sbNo}`) },

//     {
//   label: 'Renewed',
//   useDropdown: true,
//   onClick: (row) => {
//     // Option 1: Simple navigation (best for most cases)
//     navigate(`/admin/salesbill/renewed/${row._id}`);

//     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
//     // navigate(`/admin/salesbill/print/${row.billNumber}`);
//   }
// },

//     {
//   label: 'Renewal letter',
//   useDropdown: true,
//   onClick: (row) => {
//     // Option 1: Simple navigation (best for most cases)
//     navigate(`/admin/salesbill/rwnl/${row._id}`);

//     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
//     // navigate(`/admin/salesbill/print/${row.billNumber}`);
//   }
// },



{
  label: 'Renewed',
  useDropdown: true,
  onClick: (row) => {
    if (row.sbType !== 'Renewal') {
      toast.warn('This action is only available for Renewal bills');
      return;
    }
    navigate(`/admin/salesbill/renewed/${row._id}`);
  }
},

{
  label: 'Renewal letter',
  useDropdown: true,
  onClick: (row) => {
    if (row.sbType !== 'Renewal') {
      toast.warn('This action is only available for Renewal bills');
      return;
    }
    navigate(`/admin/salesbill/rwnl/${row._id}`);
  }
},




    // { label: 'Renewal letter', useDropdown: true, onClick: (row) => console.log(`Renewal letter for ${row.sbNo}`) },
    { label: 'Membership Form', useDropdown: true, onClick: (row) => console.log(`Membership Form for ${row.sbNo}`) },
    { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true }, // Added delete action
  ];

  const extraColumns = [
    // No extra columns needed for this layout
  ];

  return (
    <div className="max-w-[79vw] mx-auto p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Sales Bill</h1>
          <Link to="/telecaller/add-salesbill">
            <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium">
              Create Sale Bill
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search By Name</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Doctor name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search SB No</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={searchSBNo}
                onChange={(e) => setSearchSBNo(e.target.value)}
                placeholder="Bill number"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search Old SB No</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={searchOldSBNo}
                onChange={(e) => setSearchOldSBNo(e.target.value)}
                placeholder="Old bill number"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search Membership Type</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={searchMembershipType}
                onChange={(e) => setSearchMembershipType(e.target.value)}
                placeholder="Membership type"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search Membership Year</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={searchMembershipYear}
                onChange={(e) => setSearchMembershipYear(e.target.value)}
                placeholder="Membership year"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium w-full"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ overflow: "visible" }}>
            <Table
              data={data}
              extraColumns={extraColumns}
              actions={actions}
              headers={[
                "Sr No.",
                "SB No",
                "Old SB No",
                "SB Date",
                "SB Type",
                "Doctor Name",
                "Membership",
                // "Membership Period",
                "Amount",
                "Narration",
                "Expiry Date"
              ]}
            />
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {data.length > 0 ? ((currentPage - 1) * 15) + 1 : 0} to {(currentPage - 1) * 15 + data.length} of {totalCount} sales bills
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Previous
                </button>

                <span className="px-3 py-1 bg-teal-500 text-white rounded">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesBill;