// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Table from '../../components/mainComponents/Table';
// import { Calendar, Plus, FileText, Search } from 'lucide-react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { useAuth } from '../../hooks/useAuth';

// const AdvocateCasesPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [cases, setCases] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch advocate's assigned cases
//   const fetchCases = async () => {
//     try {
//       // First check if user has advocate field populated
//       let advocateId = user?.advocate?._id || user?.advocate;

//       // If not, we need to fetch the advocate record using user ID
//       if (!advocateId) {
//         const userId = user?._id || user?.id;

//         if (!userId) {
//           toast.error('User ID not found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         // Fetch advocate record to get advocate ID
//         try {
//           const advocateResponse = await apiClient.get('/advocates', {
//             params: { user: userId }
//           });

//           if (advocateResponse.data.success && advocateResponse.data.data.length > 0) {
//             advocateId = advocateResponse.data.data[0]._id;
//           } else {
//             toast.error('Advocate profile not found. Please contact administrator.');
//             setLoading(false);
//             return;
//           }
//         } catch (err) {
//           console.error('Error fetching advocate profile:', err);
//           toast.error('Failed to fetch advocate profile');
//           setLoading(false);
//           return;
//         }
//       }

//       const response = await apiClient.get('/query-cases', {
//         params: { assignedAdvocate: advocateId }
//       });

//       if (response.data.success) {
//         setCases(response.data.data || []);
//       } else {
//         toast.error(response.data.message || 'Failed to fetch cases');
//       }
//     } catch (error) {
//       console.error('Error fetching cases:', error);
//       toast.error(error.response?.data?.message || 'Error fetching cases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchCases();
//     }
//   }, [user]);

//   // Filter cases based on search term
//   const filteredCases = cases.filter(caseItem =>
//     caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     caseItem.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     caseItem.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Define extra columns for Actions
//   const extraColumns = [
//     {
//       header: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}`)}
//             className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
//             title="View Case Details"
//           >
//             View
//           </button>
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}/update`)}
//             className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded hover:bg-[#149f91] transition-colors"
//             title="Update Case"
//           >
//             Update
//           </button>
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}/history`)}
//             className="px-3 py-1 bg-[#5A8B8A] text-white text-xs rounded hover:bg-[#4a7574] transition-colors"
//             title="View History"
//           >
//             History
//           </button>
//           {row.status !== 'Closed' && (
//             <button
//               onClick={() => navigate(`/advocate/case/${row._id}/close`)}
//               className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
//               title="Close Case"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       )
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#398C89]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">My Assigned Cases</h1>
//         {/* <button
//           onClick={() => navigate('/advocate/cases/create')}
//           className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium flex items-center gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Add Case
//         </button> */}
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search cases..."
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <select className="border border-gray-300 rounded px-3 py-2 text-sm">
//             <option>All Statuses</option>
//             <option>Open</option>
//             <option>Pending</option>
//             <option>Closed</option>
//           </select>
//           <select className="border border-gray-300 rounded px-3 py-2 text-sm">
//             <option>All Types</option>
//             <option>Medical Negligence</option>
//             <option>Personal Injury</option>
//             <option>Insurance</option>
//           </select>
//           <input
//             type="date"
//             className="border border-gray-300 rounded px-3 py-2 text-sm"
//             placeholder="Date"
//           />
//         </div>
//       </div>

//       {/* Cases Table */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-6">
//           {filteredCases.length > 0 ? (
//             <Table
//               data={filteredCases}
//               extraColumns={extraColumns}
//             />
//           ) : (
//             <div className="text-center py-12 text-gray-500">
//               <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-lg">No assigned cases found</p>
//               <p className="text-sm">You don't have any cases assigned to you at the moment.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdvocateCasesPage;









// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Table from '../../components/mainComponents/Table';
// import { Calendar, Plus, FileText, Search } from 'lucide-react';
// import apiClient from '../../services/apiClient';
// import { useAuth } from '../../hooks/useAuth';

// const AdvocateCasesPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [cases, setCases] = useState([]);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterType, setFilterType] = useState('All');
//   const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD

//   // Fetch advocate's assigned cases
//   const fetchCases = async () => {
//     try {
//       let advocateId = user?.advocate?._id || user?.advocate;

//       if (!advocateId) {
//         const userId = user?._id || user?.id;
//         if (!userId) {
//           toast.error('User ID not found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         const advocateResponse = await apiClient.get('/advocates', {
//           params: { user: userId }
//         });

//         if (advocateResponse.data.success && advocateResponse.data.data.length > 0) {
//           advocateId = advocateResponse.data.data[0]._id;
//         } else {
//           toast.error('Advocate profile not found. Please contact administrator.');
//           setLoading(false);
//           return;
//         }
//       }

//       const response = await apiClient.get('/query-cases', {
//         params: { assignedAdvocate: advocateId }
//       });

//       if (response.data.success) {
//         setCases(response.data.data || []);
//       } else {
//         toast.error(response.data.message || 'Failed to fetch cases');
//       }
//     } catch (error) {
//       console.error('Error fetching cases:', error);
//       toast.error(error.response?.data?.message || 'Error fetching cases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchCases();
//     }
//   }, [user]);

//   // Main filtering logic
//   const filteredCases = cases.filter(caseItem => {
//     // Search term (caseId, caseNo, doctorName, caseType)
//     const matchesSearch = searchTerm === '' ||
//       caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       caseItem.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       caseItem.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase());

//     // Status filter
//     const matchesStatus = filterStatus === 'All' ||
//       caseItem.status?.toLowerCase() === filterStatus.toLowerCase();

//     // Case Type filter
//     const matchesType = filterType === 'All' ||
//       caseItem.caseType?.toLowerCase() === filterType.toLowerCase();

//     // Date filter (nextHearingDate or filingDate – adjust if field name is different)
//     const caseDate = caseItem.nextHearingDate || caseItem.filingDate || caseItem.createdAt;
//     const matchesDate = !filterDate ||
//       (caseDate && new Date(caseDate).toISOString().slice(0, 10) === filterDate);

//     return matchesSearch && matchesStatus && matchesType && matchesDate;
//   });

//   const extraColumns = [
//     {
//       header: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}`)}
//             className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
//             title="View Case Details"
//           >
//             View
//           </button>
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}/update`)}
//             className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded hover:bg-[#149f91] transition-colors"
//             title="Update Case"
//           >
//             Update
//           </button>
//           <button
//             onClick={() => navigate(`/advocate/case/${row._id}/history`)}
//             className="px-3 py-1 bg-[#5A8B8A] text-white text-xs rounded hover:bg-[#4a7574] transition-colors"
//             title="View History"
//           >
//             History
//           </button>
//           {row.status !== 'Closed' && (
//             <button
//               onClick={() => navigate(`/advocate/case/${row._id}/close`)}
//               className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
//               title="Close Case"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       )
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#398C89]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">My Assigned Cases</h1>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search cases..."
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//           >
//             <option value="All">All Statuses</option>
//             <option value="Open">Open</option>
//             <option value="Pending">Pending</option>
//             <option value="Closed">Closed</option>
//           </select>

//           {/* Type Filter */}
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//           >
//             <option value="All">All Types</option>
//             <option value="Medical Negligence">Medical Negligence</option>
//             <option value="Personal Injury">Personal Injury</option>
//             <option value="Insurance">Insurance</option>
//             {/* Add more if needed */}
//           </select>

//           {/* Date Filter */}
//           <input
//             type="date"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//           />
//         </div>
//       </div>

//       {/* Cases Table */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-6">
//           {filteredCases.length > 0 ? (
//             <Table
//               data={filteredCases}
//               extraColumns={extraColumns}
//               excludeColumns={['doctorId','caseType','subType','queryDescription','patientName','ageGender','contactNo','address','opponentName','relation','opponentType','opponentContact','opponentEmail','opponentAddress','tags','createdAt','updatedAt','__v','updatedBy']}
//               columnOrder={['caseId','caseNo','doctorName','']}
//               pagination={true}
//             />
//           ) : (
//             <div className="text-center py-12 text-gray-500">
//               <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-lg">No cases match your filters</p>
//               <p className="text-sm">Try adjusting the search or filters.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdvocateCasesPage;












import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../components/mainComponents/Table';
import { Calendar, Plus, FileText, Search } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';

const AdvocateCasesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Clear all filters function
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterType('All');
    setFilterFromDate('');
    setFilterToDate('');
  };

  // Format MongoDB date → DD/MM/YYYY (fix timezone issue)
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    // Create a date object using the ISO string to avoid timezone shifts
    // Use UTC methods to ensure we get the correct date without timezone conversion
    const date = new Date(dateString);

    // Get the date components in a way that avoids timezone shifts
    // Using toISOString() and slicing to get YYYY-MM-DD, then reformatting
    const isoString = date.toISOString();
    const [year, month, day] = isoString.split('T')[0].split('-');

    // Return in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  };


const getLatestStage = (followUps) => {
  if (!followUps || followUps.length === 0) return 'Initial Review';

  // Sort by date (newest first) and take the latest stage
  const sorted = [...followUps].sort((a, b) =>
    new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );

  return sorted[0].stage || 'Open';
};

  const fetchCases = async () => {
    try {
      let advocateId = user?.advocate?._id || user?.advocate;

      if (!advocateId) {
        const userId = user?._id || user?.id;
        if (!userId) {
          toast.error('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const advocateResponse = await apiClient.get('/advocates', {
          params: { user: userId }
        });

        if (advocateResponse.data.success && advocateResponse.data.data.length > 0) {
          advocateId = advocateResponse.data.data[0]._id;
        } else {
          toast.error('Advocate profile not found. Please contact administrator.');
          setLoading(false);
          return;
        }
      }

      const response = await apiClient.get('/query-cases', {
        params: { assignedAdvocate: advocateId }
      });

      if (response.data.success) {
        setCases(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch cases');
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error(error.response?.data?.message || 'Error fetching cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  // Filtering logic (updated to include date range)
  // const filteredCases = cases.filter(caseItem => {
  //   const matchesSearch = searchTerm === '' ||
  //     caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     caseItem.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     caseItem.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus = filterStatus === 'All' ||
  //     caseItem.status?.toLowerCase() === filterStatus.toLowerCase();

  //   const matchesType = filterType === 'All' ||
  //     caseItem.caseType?.toLowerCase() === filterType.toLowerCase();

  //   const caseDate = caseItem.nextHearingDate || caseItem.filingDate || caseItem.createdAt;

  //   // Convert case date to comparable format
  //   const caseDateObj = new Date(caseDate);
  //   const fromDateObj = filterFromDate ? new Date(filterFromDate) : null;
  //   const toDateObj = filterToDate ? new Date(filterToDate) : null;

  //   // Check if case date is within the range
  //   const matchesDateRange = (!fromDateObj || caseDateObj >= fromDateObj) &&
  //                           (!toDateObj || caseDateObj <= toDateObj);

  //   return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  // });




  // Filtering logic (updated to include date range - fixed timezone/time issue)
const filteredCases = cases.filter(caseItem => {
  const matchesSearch = searchTerm === '' ||
    caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = filterStatus === 'All' ||
    caseItem.status?.toLowerCase() === filterStatus.toLowerCase();

  const matchesType = filterType === 'All' ||
    caseItem.caseType?.toLowerCase() === filterType.toLowerCase();

  // ──────────────────────────────────────────────────────────────
  // Date range filter – अब सही तरीके से काम करेगा (1 से 8 तक 8 भी दिखेगा)
  // ──────────────────────────────────────────────────────────────
  const caseDateRaw = caseItem.nextHearingDate || caseItem.filingDate || caseItem.createdAt;

  let matchesDateRange = true; // default – अगर कोई date filter नहीं है तो पास

  if (caseDateRaw && (filterFromDate || filterToDate)) {
    // MongoDB date → "YYYY-MM-DD" string
    const getYMD = (dateValue) => {
      if (!dateValue) return null;
      const d = new Date(dateValue);
      return d.toISOString().split('T')[0]; // हमेशा UTC based date string
    };

    const caseYMD = getYMD(caseDateRaw);
    const fromYMD = filterFromDate || null;     // already "2025-01-01" format
    const toYMD   = filterToDate   || null;

    matchesDateRange =
      (!fromYMD  || caseYMD >= fromYMD) &&
      (!toYMD    || caseYMD <= toYMD);
  }

  return matchesSearch && matchesStatus && matchesType && matchesDateRange;
});

  // Clean data for Table + Add "Assigned Date" + Format Next Date
  const tableData = filteredCases.map(caseItem => ({
    ...caseItem,
    assignedDate: formatDate(caseItem.createdAt),  // New Column
    nextDate: caseItem.nextDate ? formatDate(caseItem.nextDate) : '-', // Formatted
    stage: getLatestStage(caseItem.followUps),
  }));

  const extraColumns = [
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/advocate/case/${row._id}`)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            View
          </button>
          {(row.status !== 'Closed' && row.stage !== 'Closed') && (
            <button onClick={() => navigate(`/advocate/case/${row._id}/update`)}
              className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded hover:bg-[#149f91]">
              Update
            </button>
          )}
          <button onClick={() => navigate(`/advocate/case/${row._id}/history`)}
            className="px-3 py-1 bg-[#5A8B8A] text-white text-xs rounded hover:bg-[#4a7574]">
            History
          </button>
          {row.status !== 'Closed' && (
            <button onClick={() => navigate(`/advocate/case/${row._id}/close`)}
              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
              Close
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#398C89]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Cases</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] min-w-[120px]">
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex gap-3">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] min-w-[150px]">
              <option value="All">All Types</option>
              {/* <option value="Medico Legal">Medico Legal</option> */}
              <option value="Civil">Civil</option>
              <option value="Criminal">Criminal</option>
              <option value="Consumer">Consumer</option>
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] min-w-[120px]"
                placeholder="From"
              />
              <input
                type="date"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] min-w-[120px]"
                placeholder="To"
              />
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                title="Clear all filters"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {tableData.length > 0 ? (
            <Table
              data={tableData}
              extraColumns={extraColumns}
              excludeColumns={['doctorId','subType','queryDescription','patientName','ageGender','contactNo','address','opponentName','relation','opponentType','opponentContact','opponentEmail','opponentAddress','tags','createdAt','updatedAt','__v','updatedBy','priority','queryType','caseStage']} // hide raw dates
              columnOrder={['caseId', 'caseNo', 'doctorName', 'assignedDate','caseType', 'nextDate', 'stage','status', ]}
              pagination={true}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg">No cases match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateCasesPage;