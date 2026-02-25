// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { Calendar, Printer, Download, Search, X } from 'lucide-react';
// import Table from '../../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const TelecallerReport = () => {
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     fromDate: '',
//     toDate: '',
//     enquiryType: 'All',
//     status: 'All',
//     membershipType: 'All',
//     searchTerm: ''
//   });

//   // Fetch telecaller reports data from the reports API
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (filters.fromDate) params.fromDate = filters.fromDate;
//       if (filters.toDate) params.toDate = filters.toDate;

//       const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller);

//       if (response.data.success) {
//         // Process the data to handle linked/spouse doctors properly
//         // Each linked doctor pair should be counted as a single entry but represent both doctors
//         const processedData = response.data.data.map((item, index) => {
//           // Ensure doctor name is properly formatted - use the name as provided by the API
//           // which should already have the correct format for linked doctors
//           const doctorName = item.drName || item.name || item.doctorName || "N/A";

//           return {
//             id: item._id || index,
//             date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
//             doctor: doctorName, // Use the properly formatted name (already combined for linked doctors)
//             membershipType: item.membershipType || item.membership || "N/A",
//             speciality: item.speciality || item.specialty || "N/A",
//             hospital: item.hospitalName || item.hospital || "N/A",
//             hospitalAddress: item.address || item.city || "N/A",
//             contact: item.mobile || item.phone || "N/A",
//             enquiry: item.enquiryType || item.leadType || "Warm",
//             status: item.status || "Pending",
//             followups: item.followupCount || item.followUps || 0,
//             lastFollowup: item.lastFollowup ? new Date(item.lastFollowup).toLocaleDateString('en-GB') : "-",
//             nextFollowup: item.nextFollowup ? new Date(item.nextFollowup).toLocaleDateString('en-GB') : "-",
//             quote: item.quotationAmount || item.quote || "-",
//             isLinked: item.isLinked || false,
//             linkedDoctorId: item.linkedDoctorId || null,
//             relationshipType: item.relationshipType || null
//           };
//         });

//         // Deduplicate by keeping only one entry per linked pair
//         // Use a Set to track processed pairs to avoid duplicates
//         const seenPairs = new Set();
//         const uniqueData = [];

//         processedData.forEach(item => {
//           if (item.isLinked && item.linkedDoctorId) {
//             // Create a consistent pair identifier regardless of order
//             const pairId = [item.id, item.linkedDoctorId].sort().join('|');

//             if (!seenPairs.has(pairId)) {
//               // Add the entry and mark the pair as seen
//               uniqueData.push(item);
//               seenPairs.add(pairId);
//             }
//             // If pairId already exists, skip this item (it's a duplicate of the same pair)
//           } else {
//             // Not linked, just add the item
//             uniqueData.push(item);
//           }
//         });

//         setReports(uniqueData);
//         setFilteredReports(uniqueData);
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch reports');
//       }
//     } catch (err) {
//       setError(err.message);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply filters
//   const applyFilters = () => {
//     let filtered = [...reports];

//     if (filters.fromDate) {
//       filtered = filtered.filter(report =>
//         new Date(report.date) >= new Date(filters.fromDate)
//       );
//     }

//     if (filters.toDate) {
//       filtered = filtered.filter(report =>
//         new Date(report.date) <= new Date(filters.toDate)
//       );
//     }

//     if (filters.enquiryType !== 'All') {
//       filtered = filtered.filter(report =>
//         report.enquiry.toLowerCase() === filters.enquiryType.toLowerCase()
//       );
//     }

//     if (filters.status !== 'All') {
//       filtered = filtered.filter(report =>
//         report.status.toLowerCase() === filters.status.toLowerCase()
//       );
//     }

//     if (filters.membershipType !== 'All') {
//       filtered = filtered.filter(report =>
//         report.membershipType === filters.membershipType
//       );
//     }

//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(report =>
//         report.doctor.toLowerCase().includes(term) ||
//         report.hospital.toLowerCase().includes(term) ||
//         report.speciality.toLowerCase().includes(term) ||
//         report.hospitalAddress.toLowerCase().includes(term)
//       );
//     }

//     setFilteredReports(filtered);
//     toast.info(`${filtered.length} reports found`);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       fromDate: '',
//       toDate: '',
//       enquiryType: 'All',
//       status: 'All',
//       membershipType: 'All',
//       searchTerm: ''
//     });
//     setFilteredReports(reports);
//     toast.info('Filters reset');
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [filters, reports]);

//   // Export to Excel
//   const exportToExcel = () => {
//     try {
//       // Prepare data for export - convert to appropriate format
//       const exportData = filteredReports.map((report, index) => ({
//         'Sr No': index + 1,
//         'Date': report.date,
//         'Doctor': report.doctor,
//         'Membership Type': report.membershipType,
//         'Speciality': report.speciality,
//         'Hospital': report.hospital,
//         'Hospital Address': report.hospitalAddress,
//         'Contact': report.contact,
//         'Enquiry': report.enquiry,
//         'Status': report.status,
//         'Follow-ups': report.followups,
//         'Last Follow-up': report.lastFollowup,
//         'Next Follow-up': report.nextFollowup,
//         'Quote (₹)': report.quote !== '-' ? `₹${report.quote}` : '-'
//       }));

//       // Create worksheet
//       const ws = XLSX.utils.json_to_sheet(exportData);

//       // Create workbook
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Telecaller Reports');

//       // Export the file
//       XLSX.writeFile(wb, `telecaller-reports-${new Date().toISOString().split('T')[0]}.xlsx`);

//       toast.success('Excel file exported successfully!');
//     } catch (error) {
//       console.error('Error exporting to Excel:', error);
//       toast.error('Failed to export Excel file');
//     }
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     try {
//       // Prepare data for export
//       const headers = ['Sr No', 'Date', 'Doctor', 'Membership Type', 'Speciality', 'Hospital', 'Hospital Address', 'Contact', 'Enquiry', 'Status', 'Follow-ups', 'Last Follow-up', 'Next Follow-up', 'Quote (₹)'];
//       const csvContent = [
//         headers.join(','),
//         ...filteredReports.map((report, index) => [
//           index + 1,
//           `"${report.date}"`,
//           `"${report.doctor}"`,
//           `"${report.membershipType}"`,
//           `"${report.speciality}"`,
//           `"${report.hospital}"`,
//           `"${report.hospitalAddress}"`,
//           `"${report.contact}"`,
//           `"${report.enquiry}"`,
//           `"${report.status}"`,
//           report.followups,
//           `"${report.lastFollowup}"`,
//           `"${report.nextFollowup}"`,
//           report.quote !== '-' ? `"₹${report.quote}"` : '"-"'
//         ].join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `telecaller-reports-${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       toast.success('CSV file exported successfully!');
//     } catch (error) {
//       console.error('Error exporting to CSV:', error);
//       toast.error('Failed to export CSV file');
//     }
//   };

//   // Print report
//   const printReport = () => {
//     const printWindow = window.open('', '_blank');
//     const reportData = filteredReports;

//     const reportHTML = `
//       <html>
//         <head>
//           <title>Telecaller Reports</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1 { color: #333; text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f5f5f5; }
//             .summary { margin: 20px 0; display: flex; justify-content: space-around; }
//             .summary-item { text-align: center; }
//           </style>
//         </head>
//         <body>
//           <h1>Telecaller Reports - ${new Date().toLocaleDateString()}</h1>

//           <div class="summary">
//             <div class="summary-item">
//               <strong>Total Records:</strong><br>
//               ${reportData.length}
//             </div>
//             <div class="summary-item">
//               <strong>Hot Enquiries:</strong><br>
//               ${reportData.filter(r => r.enquiry === 'Hot').length}
//             </div>
//             <div class="summary-item">
//               <strong>Pending Status:</strong><br>
//               ${reportData.filter(r => r.status === 'Pending').length}
//             </div>
//             <div class="summary-item">
//               <strong>Completed:</strong><br>
//               ${reportData.filter(r => r.status === 'Completed').length}
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 ${['Sr No', 'Date', 'Doctor', 'Membership Type', 'Speciality', 'Hospital', 'Hospital Address', 'Contact', 'Enquiry', 'Status', 'Follow-ups', 'Last Follow-up', 'Next Follow-up', 'Quote (₹)']
//                 .map(header => `<th>${header}</th>`).join('')}
//               </tr>
//             </thead>
//             <tbody>
//               ${reportData.map((report, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${report.date}</td>
//                   <td>${report.doctor}</td>
//                   <td>${report.membershipType}</td>
//                   <td>${report.speciality}</td>
//                   <td>${report.hospital}</td>
//                   <td>${report.hospitalAddress}</td>
//                   <td>${report.contact}</td>
//                   <td>${report.enquiry}</td>
//                   <td>${report.status}</td>
//                   <td>${report.followups}</td>
//                   <td>${report.lastFollowup}</td>
//                   <td>${report.nextFollowup}</td>
//                   <td>${report.quote !== '-' ? `₹${report.quote}` : '-'}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(reportHTML);
//     printWindow.document.close();
//     printWindow.print();

//     toast.success('Report sent to printer');
//   };

//   // Define columns for the table
//   const columns = [
//     {
//       header: "Date",
//       accessor: "date",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Doctor",
//       accessor: "doctor",
//       render: (value) => <span className="text-gray-700 font-medium">{value}</span>
//     },
//     {
//       header: "Membership Type",
//       accessor: "membershipType",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Speciality",
//       accessor: "speciality",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Hospital",
//       accessor: "hospital",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Hospital Address",
//       accessor: "hospitalAddress",
//       render: (value) => <span className="text-gray-700 max-w-xs truncate">{value}</span>
//     },
//     {
//       header: "Contact",
//       accessor: "contact",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Enquiry",
//       accessor: "enquiry",
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value.toLowerCase() === 'hot' ? 'bg-red-100 text-red-800' :
//           value.toLowerCase() === 'warm' ? 'bg-yellow-100 text-yellow-800' :
//           value.toLowerCase() === 'cold' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
//         }`}>
//           {value}
//         </span>
//       )
//     },
//     {
//       header: "Status",
//       accessor: "status",
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//         }`}>
//           {value}
//         </span>
//       )
//     },
//     {
//       header: "Follow-ups",
//       accessor: "followups",
//       render: (value) => <span className="text-gray-700 text-center">{value}</span>
//     },
//     {
//       header: "Last Follow-up",
//       accessor: "lastFollowup",
//       render: (value) => <span className="text-gray-700">{value}</span>
//     },
//     {
//       header: "Next Follow-up",
//       accessor: "nextFollowup",
//       render: (value) => <span className="text-gray-700 font-medium">{value}</span>
//     },
//     {
//       header: "Quote (₹)",
//       accessor: "quote",
//       render: (value) => <span className="text-gray-700 font-bold text-green-600">{value !== '-' ? `₹${value}` : '-'}</span>
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error! </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Telecaller Reports</h1>
//         <p className="text-gray-600">Track and manage telecaller enquiries, follow-ups, and membership performance</p>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <div className="relative">
//               <DatePicker
//                 selected={filters.fromDate ? new Date(filters.fromDate) : null}
//                 onChange={(date) => setFilters({...filters, fromDate: date ? date.toISOString().split('T')[0] : ''})}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholderText="Select start date"
//                 dateFormat="yyyy-MM-dd"
//               />
//               <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <div className="relative">
//               <DatePicker
//                 selected={filters.toDate ? new Date(filters.toDate) : null}
//                 onChange={(date) => setFilters({...filters, toDate: date ? date.toISOString().split('T')[0] : ''})}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholderText="Select end date"
//                 dateFormat="yyyy-MM-dd"
//               />
//               <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
//             <select
//               value={filters.enquiryType}
//               onChange={(e) => setFilters({...filters, enquiryType: e.target.value})}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">All Types</option>
//               <option value="Hot">Hot</option>
//               <option value="Warm">Warm</option>
//               <option value="Cold">Cold</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({...filters, status: e.target.value})}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">All Statuses</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
//             <select
//               value={filters.membershipType}
//               onChange={(e) => setFilters({...filters, membershipType: e.target.value})}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">All Types</option>
//               <option value="Individual">Individual</option>
//               <option value="Hospital">Hospital</option>
//               <option value="Hospital + Individual">Individual + Hospital</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <input
//               type="text"
//               value={filters.searchTerm}
//               onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
//               placeholder="Search doctor/hospital..."
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="flex items-end space-x-2">
//             <button
//               onClick={applyFilters}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               <Search className="h-4 w-4 mr-2" />
//               Apply Filters
//             </button>
//             <button
//               onClick={resetFilters}
//               className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//             >
//               <X className="h-4 w-4 mr-2" />
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-medium text-gray-500">Total Records</h3>
//           <p className="text-3xl font-bold text-gray-900">
//             {filteredReports.length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-medium text-gray-500">Hot Enquiries</h3>
//           <p className="text-3xl font-bold text-gray-900">
//             {filteredReports.filter(r => r.enquiry === 'Hot').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-medium text-gray-500">Pending</h3>
//           <p className="text-3xl font-bold text-gray-900">
//             {filteredReports.filter(r => r.status === 'Pending').length}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-medium text-gray-500">Completed</h3>
//           <p className="text-3xl font-bold text-gray-900">
//             {filteredReports.filter(r => r.status === 'Completed').length}
//           </p>
//         </div>
//       </div>

//       {/* Table and Export Section */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">Telecaller Report Details</h2>
//           <div className="flex space-x-2">
//             <button
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//               onClick={exportToExcel}
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export Excel
//             </button>
//             <button
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               onClick={exportToCSV}
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </button>
//             <button
//               className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//               onClick={printReport}
//             >
//               <Printer className="h-4 w-4 mr-2" />
//               Print
//             </button>
//           </div>
//         </div>

//         <Table
//           data={filteredReports}
//           showSrNo={true}
//           excludeColumns={['_id', '__v', 'leadStatus', 'salesStatus', 'followUpsCount', 'lastFollowUp', 'nextFollowUp', 'finalPremium']}
//           columnOrder={['date', 'doctor', 'membershipType', 'speciality', 'hospital', 'hospitalAddress', 'contact', 'enquiry', 'status', 'followups', 'lastFollowup', 'nextFollowup', 'quote']}
//           pagination={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default TelecallerReport;









import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Printer, Download, Search, X } from 'lucide-react';
import Table from '../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TelecallerReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    enquiryType: 'All',
    status: 'All',
    membershipType: 'All',
    searchTerm: ''
  });

  // Fetch telecaller reports data from the reports API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.fromDate) params.dateFrom = filters.fromDate;
      if (filters.toDate) params.dateTo = filters.toDate;

      const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller, { params });

      if (response.data.success) {
        const apiData = response.data.data;

        // Process the data according to the new API response structure (matches my-doctors API)
        const processedData = apiData.map((item, index) => {
          // Parse the date from API response
          let formattedDate = "N/A";
          if (item.date) {
            // Convert "7/1/2026" to "2025-09-02" format
            const [day, month, year] = item.date.split('/');
            formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else if (item.createdAt) {
            // Format from createdAt field if date field is not present
            formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
          }

          // Map leadStatus to enquiry type (Hot/Warm/Cold)
          const getEnquiryType = (leadStatus) => {
            switch(leadStatus?.toLowerCase()) {
              case 'hot': return 'Hot';
              case 'warm': return 'Warm';
              case 'cold': return 'Cold';
              case 'closed': return 'Closed'; // Handle 'closed' status
              default: return 'Warm';
            }
          };

          // Map salesStatus to status
          const getStatus = (salesStatus) => {
            switch(salesStatus?.toLowerCase()) {
              case 'close': return 'Completed';
              case 'closed': return 'Completed'; // Handle 'closed' status
              case 'cold':
              case 'warm':
              case 'hot': return 'Pending';
              default: return 'Pending';
            }
          };

          // Extract followup count from "2 FU" format or use followUps array length
          let followups = 0;
          if (item.followUpsCount !== undefined) {
            followups = item.followUpsCount;
          } else if (item.followUps) {
            followups = typeof item.followUps === 'string' ?
              parseInt(item.followUps.replace(' FU', '')) || 0 :
              item.followUps.length || 0;
          }

          // Parse followup dates
          const parseFollowupDate = (followupStr) => {
            if (!followupStr || followupStr.includes('No FU') || followupStr === '-') return "-";
            const dateMatch = followupStr.match(/(\d+\/\d+\/\d+)/);
            if (dateMatch) {
              const [day, month, year] = dateMatch[1].split('/');
              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            // If it's already in date format, convert it
            if (followupStr.includes('T')) {
              return new Date(followupStr).toLocaleDateString('en-GB');
            }
            return followupStr;
          };

          // Extract last followup date (remove call/meeting info)
          const lastFollowup = parseFollowupDate(item.lastFollowUp);

          // For next followup, use item.nextFollowUp if available
          let nextFollowup = "-";
          if (item.nextFollowUp && item.nextFollowUp !== "-") {
            if (item.nextFollowUp.includes('T')) {
              nextFollowup = new Date(item.nextFollowUp).toLocaleDateString('en-GB');
            } else {
              const dateMatch = item.nextFollowUp.match(/(\d+\/\d+\/\d+)/);
              if (dateMatch) {
                const [day, month, year] = dateMatch[1].split('/');
                nextFollowup = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              } else {
                nextFollowup = item.nextFollowUp;
              }
            }
          }

          // Get contact information from multiple possible sources
          const contact = item.phoneNumber ||
                         item.contactDetails?.phoneNumber ||
                         item.contactDetails?.whatsapp ||
                         item.whatsappNumber ||
                         "N/A";

          return {
            id: item._id || item.id || index,
            date: formattedDate,
            doctor: item.fullName || item.drName || "N/A", // Use fullName from new API structure
            membershipType: item.membership || item.membershipType || "N/A",
            speciality: item.specialty ||
                       (Array.isArray(item.specialization) && item.specialization.length > 0 ? item.specialization[0] :
                       item.specialization || "N/A"),
            hospital: item.hospital || item.hospitalName || "N/A",
            hospitalAddress: item.hospitalAddress?.address || item.city || "-",
            contact: contact,
            enquiry: getEnquiryType(item.leadStatus || item.typeOfEnquiry),
            status: getStatus(item.salesStatus || item.doctorStatus || item.status),
            followups: followups,
            lastFollowup: lastFollowup,
            nextFollowup: nextFollowup,
            quote: item.finalPremium !== "-" && item.finalPremium ? item.finalPremium : "-",
            isLinked: item.isLinked || false,
            linkedDoctorId: item.linkedDoctorId || null,
            relationshipType: item.relationshipType || null
          };
        });

        // Remove duplicates for linked doctors (should already be handled by backend, but as extra safety)
        const seenIds = new Set();
        const uniqueData = [];

        processedData.forEach(item => {
          if (item.isLinked && item.linkedDoctorId) {
            const pairId = [item.id, item.linkedDoctorId].sort().join('-');
            if (!seenIds.has(pairId)) {
              uniqueData.push(item);
              seenIds.add(pairId);
            }
          } else {
            if (!seenIds.has(item.id)) {
              uniqueData.push(item);
              seenIds.add(item.id);
            }
          }
        });

        setReports(uniqueData);
        setFilteredReports(uniqueData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.fromDate) {
      filtered = filtered.filter(report =>
        new Date(report.date) >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(report =>
        new Date(report.date) <= new Date(filters.toDate)
      );
    }

    if (filters.enquiryType !== 'All') {
      filtered = filtered.filter(report =>
        report.enquiry.toLowerCase() === filters.enquiryType.toLowerCase()
      );
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(report =>
        report.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.membershipType !== 'All') {
      filtered = filtered.filter(report =>
        report.membershipType === filters.membershipType
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.doctor.toLowerCase().includes(term) ||
        report.hospital.toLowerCase().includes(term) ||
        report.speciality.toLowerCase().includes(term) ||
        report.hospitalAddress.toLowerCase().includes(term)
      );
    }

    setFilteredReports(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      enquiryType: 'All',
      status: 'All',
      membershipType: 'All',
      searchTerm: ''
    });
    setFilteredReports(reports);
    toast.info('Filters reset');
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = filteredReports.map((report, index) => ({
        'Srt No.': index + 1,
        'Date': report.date,
        'Doctor': report.doctor,
        'Membership Type': report.membershipType,
        'Speciality': report.specialization,
        'Hospital': report.hospital,
        'Hospital Address': report.hospitalAddress,
        'Contact': report.contact,
        'Enquiry': report.enquiry,
        'Status': report.status,
        'Follow-ups': report.followups,
        'Last Follow-up': report.lastFollowup,
        'Next Follow-up': report.nextFollowup,
        'Quote ($)': report.quote !== '-' ? report.quote : '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Telecaller Reports');
      XLSX.writeFile(wb, `telecaller-reports-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export Excel file');
    }
  };

  // Print report
  const printReport = () => {
    const printWindow = window.open('', '_blank');
    const reportData = filteredReports;

    const reportHTML = `
      <html>
        <head>
          <title>Telecaller Reports</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            .filters {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: 600;
            }
            .hot { background-color: #ffebee; color: #c62828; }
            .warm { background-color: #fff8e1; color: #ff8f00; }
            .cold { background-color: #e3f2fd; color: #1565c0; }
            .pending { background-color: #fff3cd; color: #856404; }
            .completed { background-color: #d4edda; color: #155724; }
            .summary {
              display: flex;
              justify-content: space-between;
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 5px;
            }
            .summary-item { text-align: center; }
            .summary-item strong { display: block; font-size: 24px; }
          </style>
        </head>
        <body>
          <h1>Telecaller Reports</h1>

          <div class="filters">
            <strong>Report Period:</strong>
            ${filters.fromDate ? filters.fromDate : 'Start'} to ${filters.toDate ? filters.toDate : 'End'} |
            <strong>Enquiry Type:</strong> ${filters.enquiryType} |
            <strong>Status:</strong> ${filters.status} |
            <strong>Membership Type:</strong> ${filters.membershipType}
          </div>

          <div class="summary">
            <div class="summary-item">
              <div>Total Records</div>
              <strong>${reportData.length}</strong>
            </div>
            <div class="summary-item">
              <div>Hot Enquiries</div>
              <strong>${reportData.filter(r => r.enquiry === 'Hot').length}</strong>
            </div>
            <div class="summary-item">
              <div>Pending</div>
              <strong>${reportData.filter(r => r.status === 'Pending').length}</strong>
            </div>
            <div class="summary-item">
              <div>Completed</div>
              <strong>${reportData.filter(r => r.status === 'Completed').length}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Srt No.</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Membership Type</th>
                <th>Speciality</th>
                <th>Hospital</th>
                <th>Hospital Address</th>
                <th>Contact</th>
                <th>Enquiry</th>
                <th>Status</th>
                <th>Follow-ups</th>
                <th>Last Follow-up</th>
                <th>Next Follow-up</th>
                <th>Quote ($)</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map((report, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${report.date}</td>
                  <td>${report.doctor}</td>
                  <td>${report.membershipType}</td>
                  <td>${report.specialization}</td>
                  <td>${report.hospital}</td>
                  <td>${report.hospitalAddress}</td>
                  <td>${report.contact}</td>
                  <td class="${report.enquiry.toLowerCase()}">${report.enquiry}</td>
                  <td class="${report.status.toLowerCase()}">${report.status}</td>
                  <td>${report.followups}</td>
                  <td>${report.lastFollowup}</td>
                  <td>${report.nextFollowup}</td>
                  <td>${report.quote !== '-' ? '$' + report.quote : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
    toast.success('Report sent to printer');
  };

  // Define columns for the table matching the screenshot
  const columns = [
    {
      header: "Srt No.",
      accessor: "srtNo",
      render: (_, index) => <span className="text-gray-700 font-medium">{index + 1}</span>,
      width: "80px"
    },
    {
      header: "Date",
      accessor: "date",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "100px"
    },
    {
      header: "Doctor",
      accessor: "doctor",
      render: (value) => <span className="text-gray-800 font-medium">{value}</span>,
      width: "150px"
    },
    {
      header: "Membership Type",
      accessor: "membershipType",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "120px"
    },
    {
      header: "Speciality",
      accessor: "speciality",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "120px"
    },
    {
      header: "Hospital",
      accessor: "hospital",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "120px"
    },
    {
      header: "Hospital Address",
      accessor: "hospitalAddress",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "150px"
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "110px"
    },
    {
      header: "Enquiry",
      accessor: "enquiry",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value.toLowerCase() === 'hot' ? 'bg-red-100 text-red-800' :
          value.toLowerCase() === 'warm' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
      width: "90px"
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
      width: "100px"
    },
    {
      header: "Follow-ups",
      accessor: "followups",
      render: (value) => <span className="text-gray-700 text-center font-medium">{value}</span>,
      width: "90px"
    },
    {
      header: "Last Follow-up",
      accessor: "lastFollowup",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: "110px"
    },
    {
      header: "Next Follow-up",
      accessor: "nextFollowup",
      render: (value) => <span className="text-gray-800 font-medium">{value}</span>,
      width: "110px"
    },
    {
      header: "Quote ($)",
      accessor: "quote",
      render: (value) => <span className="text-gray-800 font-bold">{value !== '-' ? `$${value}` : '-'}</span>,
      width: "90px"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-[85vw]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">Track and manage telecaller enquiries and follow-ups</p>
      </div>

      {/* Filters Section - Matching Screenshot */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <DatePicker
                selected={filters.fromDate ? new Date(filters.fromDate) : null}
                onChange={(date) => setFilters({...filters, fromDate: date ? date.toISOString().split('T')[0] : ''})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="01/09/2025"
                dateFormat="dd/MM/yyyy"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <DatePicker
                selected={filters.toDate ? new Date(filters.toDate) : null}
                onChange={(date) => setFilters({...filters, toDate: date ? date.toISOString().split('T')[0] : ''})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="30/09/2025"
                dateFormat="dd/MM/yyyy"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Enquiry Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
            <select
              value={filters.enquiryType}
              onChange={(e) => setFilters({...filters, enquiryType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="All">All</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Membership Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            <select
              value={filters.membershipType}
              onChange={(e) => setFilters({...filters, membershipType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="All">All</option>
              <option value="Individual">Individual</option>
              <option value="Hospital">Hospital</option>
              <option value="Individual + Hospital">Individual + Hospital</option>
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search (Doctor / Speciality / Hospital / Address / Mobile)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                placeholder="Type to search..."
                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              <Search className="h-4 w-4 mr-1" />
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Report Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header with Export Buttons */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Telecaller Report Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={exportToExcel}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Excel
            </button>
            <button
              onClick={printReport}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            data={filteredReports}
            showSrNo={true}
            pagination={true}
            excludeColumns={['isLinked','linkedDoctorId','relationshipType','quote','id']}

          />
        </div>
      </div>
    </div>
  );
};

export default TelecallerReport;