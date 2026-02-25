// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Table from '../../components/mainComponents/Table';
// import { Calendar, Plus, FileText, Search } from 'lucide-react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { useAuth } from '../../hooks/useAuth';

// const ExpertCasesPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [cases, setCases] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch expert's assigned cases
//   const fetchCases = async () => {
//     try {
//       // First check if user has expert field populated
//       let expertId = user?.expert?._id || user?.expert;

//       // If not, we need to fetch the expert record using user ID
//       if (!expertId) {
//         const userId = user?._id || user?.id;

//         if (!userId) {
//           toast.error('User ID not found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         // Fetch expert record to get expert ID
//         try {
//           const expertResponse = await apiClient.get('/experts', {
//             params: { user: userId }
//           });

//           if (expertResponse.data.success && expertResponse.data.data.length > 0) {
//             expertId = expertResponse.data.data[0]._id;
//           } else {
//             toast.error('Expert profile not found. Please contact administrator.');
//             setLoading(false);
//             return;
//           }
//         } catch (err) {
//           console.error('Error fetching expert profile:', err);
//           toast.error('Failed to fetch expert profile');
//           setLoading(false);
//           return;
//         }
//       }

//       const response = await apiClient.get('/query-cases', {
//         params: { assignedExpert: expertId }
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
//             onClick={() => navigate(`/expert/case/${row._id}`)}
//             className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
//             title="View Case Details"
//           >
//             View
//           </button>
//           <button
//             onClick={() => navigate(`/expert/case/${row._id}/update`)}
//             className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded hover:bg-[#149f91] transition-colors"
//             title="Update Case"
//           >
//             Update
//           </button>
//           <button
//             onClick={() => navigate(`/expert/case/${row._id}/history`)}
//             className="px-3 py-1 bg-[#5A8B8A] text-white text-xs rounded hover:bg-[#4a7574] transition-colors"
//             title="View History"
//           >
//             History
//           </button>
//           {row.status !== 'Closed' && (
//             <button
//               onClick={() => navigate(`/expert/case/${row._id}/close`)}
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

// export default ExpertCasesPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../components/mainComponents/Table';
import { Calendar, FileText, Search } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';

const ExpertCasesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Same date format as Advocate
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // EXACT SAME LOGIC as Advocate → Get latest stage from followUps
  const getLatestStage = (followUps) => {
    if (!followUps || followUps.length === 0) return 'Initial Review';
    const sorted = [...followUps].sort((a, b) =>
      new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    );
    return sorted[0].stage || 'Open';
  };

  const fetchCases = async () => {
    try {
      let expertId = user?.expert?._id || user?.expert;

      if (!expertId) {
        const userId = user?._id || user?.id;
        if (!userId) {
          toast.error('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const expertResponse = await apiClient.get('/experts', { params: { user: userId } });
        if (expertResponse.data.success && expertResponse.data.data.length > 0) {
          expertId = expertResponse.data.data[0]._id;
        } else {
          toast.error('Expert profile not found.');
          setLoading(false);
          return;
        }
      }

      const response = await apiClient.get('/query-cases', {
        params: { assignedExpert: expertId }
      });

      if (response.data.success) {
        setCases(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Error fetching cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCases();
  }, [user]);

  // Filtering (same as Advocate)
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchTerm === '' ||
      caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || caseItem.status === filterStatus;
    const matchesType = filterType === 'All' || caseItem.caseType === filterType;

    // Date range filtering - using nextDate field
    const caseNextDate = caseItem.nextDate ? new Date(caseItem.nextDate) : null;
    const dateFrom = filterDateFrom ? new Date(filterDateFrom) : null;
    const dateTo = filterDateTo ? new Date(filterDateTo) : null;

    // Reset time part for comparison
    if (dateFrom) dateFrom.setHours(0, 0, 0, 0);
    if (dateTo) dateTo.setHours(23, 59, 59, 999);

    // If no date range is specified, all cases match
    // If date range is specified, only cases with nextDate in range match
    const matchesDateRange = (!dateFrom && !dateTo) ||
      (caseNextDate && (!dateFrom || caseNextDate >= dateFrom) && (!dateTo || caseNextDate <= dateTo));

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Prepare table data with formatted dates & latest stage
  const tableData = filteredCases.map(caseItem => ({
    ...caseItem,
    assignedDate: formatDate(caseItem.createdAt),
    nextDate: caseItem.nextDate ? formatDate(caseItem.nextDate) : '-',
    stage: getLatestStage(caseItem.followUps),
  }));

  // Actions column – Hide Update & Close when status is Closed
  const extraColumns = [{
    header: 'Actions',
    render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => navigate(`/expert/case/${row._id}`)}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          View
        </button>

        {row.status !== 'Closed' && (
          <button onClick={() => navigate(`/expert/case/${row._id}/update`)}
            className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded hover:bg-[#149f91]">
            Update
          </button>
        )}

        <button onClick={() => navigate(`/expert/case/${row._id}/history`)}
          className="px-3 py-1 bg-[#5A8B8A] text-white text-xs rounded hover:bg-[#4a7574]">
          History
        </button>

        {row.status !== 'Closed' && (
          <button onClick={() => navigate(`/expert/case/${row._id}/close`)}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
            Close
          </button>
        )}
      </div>
    )
  }];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#398C89]"></div>
    </div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Cases</h1>
      </div>

      {/* Filters – Same as Advocate */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search cases..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="All">All Types</option>
            <option value="Civil">Civil</option>
            <option value="Criminal">Criminal</option>
            <option value="Consumer">Consumer</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex gap-2">
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full" placeholder="From Date" />
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full" placeholder="To Date" />
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
                setFilterType('All');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {tableData.length > 0 ? (
          <Table
            data={tableData}
            extraColumns={extraColumns}
            excludeColumns={['doctorId','subType','queryDescription','patientName','ageGender','contactNo','address','opponentName','relation','opponentType','opponentContact','opponentEmail','opponentAddress','tags','createdAt','updatedAt','__v','updatedBy','priority','queryType','caseStage','followUps']}
            columnOrder={['caseId', 'caseNo', 'doctorName', 'assignedDate', 'caseType', 'nextDate', 'stage', 'status']}
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
  );
};

export default ExpertCasesPage;