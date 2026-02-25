import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Printer, Download, Search, X } from 'lucide-react';
import Table from '../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SalesReport = () => {
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

  // Fetch sales reports data from the salesman doctors API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.fromDate) params.dateFrom = filters.fromDate;
      if (filters.toDate) params.dateTo = filters.toDate;

      const response = await apiClient.get('/salesman/doctors', { params });

      if (response.data.success) {
        const apiData = response.data.data;

        // Process the data according to the new API response structure (from /salesman/doctors)
        const processedData = apiData.map((item, index) => {
          // Format the date from createdAt field
          const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : "N/A";

          // Map typeOfEnquiry to enquiry type (Hot/Warm/Cold/Closed)
          const getEnquiryType = (typeOfEnquiry) => {
            switch(typeOfEnquiry?.toLowerCase()) {
              case 'hot': return 'Hot';
              case 'warm': return 'Warm';
              case 'cold': return 'Cold';
              case 'closed': return 'Closed';
              default: return 'Warm';
            }
          };

          // Map doctorStatus to status
          const getStatus = (doctorStatus) => {
            switch(doctorStatus?.toLowerCase()) {
              case 'converted': return 'Completed';
              case 'close': return 'Completed';
              case 'closed': return 'Completed';
              case 'cold':
              case 'warm':
              case 'hot': return 'Pending';
              default: return 'Pending';
            }
          };

          // Calculate followup count from followUps array
          const followups = item.followUps ? item.followUps.length : 0;

          // Parse followup dates
          const parseFollowupDate = (followUpDate) => {
            if (!followUpDate) return "-";
            // Convert ISO date string to DD/MM/YYYY format
            return new Date(followUpDate).toLocaleDateString('en-GB');
          };

          // Get last followup date (most recent followup)
          let lastFollowup = "-";
          if (item.followUps && item.followUps.length > 0) {
            // Get the most recent followup
            const mostRecentFollowUp = item.followUps[item.followUps.length - 1];
            lastFollowup = parseFollowupDate(mostRecentFollowUp.date);
          }

          // Get next followup date from the most recent followup
          let nextFollowup = "-";
          if (item.followUps && item.followUps.length > 0) {
            const mostRecentFollowUp = item.followUps[item.followUps.length - 1];
            if (mostRecentFollowUp.nextFollowUpDate) {
              nextFollowup = parseFollowupDate(mostRecentFollowUp.nextFollowUpDate);
            }
          }

          // Get contact information from contactDetails
          const contact = item.contactDetails?.phoneNumber ||
                         item.phoneNumber ||
                         item.contactDetails?.whatsapp ||
                         item.whatsappNumber ||
                         "N/A";

          // Determine membership type based on doctorType
          const getMembershipType = (doctorType) => {
            switch(doctorType?.toLowerCase()) {
              case 'hospital_individual': return 'Hospital + Individual';
              case 'hospital': return 'Hospital';
              case 'individual': return 'Individual';
              default: return 'N/A';
            }
          };

          return {
            id: item._id || item.id || index,
            date: formattedDate,
            doctor: item.fullName || "N/A", // Use fullName from API response
            membershipType: getMembershipType(item.doctorType),
            speciality: Array.isArray(item.specialization) && item.specialization.length > 0 ?
                        item.specialization[0] :
                        (typeof item.specialization === 'string' ? item.specialization : "N/A"),
            hospital: item.hospitalName || "N/A",
            hospitalAddress: item.hospitalAddress?.address || item.contactDetails?.currentAddress?.address || "-",
            contact: contact,
            enquiry: getEnquiryType(item.typeOfEnquiry),
            status: getStatus(item.doctorStatus || item.status),
            followups: followups,
            lastFollowup: lastFollowup,
            nextFollowup: nextFollowup,
            quote: "-", // No quote data in this API
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
    toast.info(`${filtered.length} reports found`);
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
      // Prepare data for export - convert to appropriate format
      const exportData = filteredReports.map((report, index) => ({
        'Sr No': index + 1,
        'Date': report.date,
        'Doctor': report.doctor,
        'Membership Type': report.membershipType,
        'Speciality': report.speciality,
        'Hospital': report.hospital,
        'Hospital Address': report.hospitalAddress,
        'Contact': report.contact,
        'Enquiry': report.enquiry,
        'Status': report.status,
        'Follow-ups': report.followups,
        'Last Follow-up': report.lastFollowup,
        'Next Follow-up': report.nextFollowup,
        'Quote (₹)': report.quote !== '-' ? `₹${report.quote}` : '-'
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Reports');

      // Export the file
      XLSX.writeFile(wb, `sales-reports-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export Excel file');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      // Prepare data for export
      const headers = ['Sr No', 'Date', 'Doctor', 'Membership Type', 'Speciality', 'Hospital', 'Hospital Address', 'Contact', 'Enquiry', 'Status', 'Follow-ups', 'Last Follow-up', 'Next Follow-up', 'Quote (₹)'];
      const csvContent = [
        headers.join(','),
        ...filteredReports.map((report, index) => [
          index + 1,
          `"${report.date}"`,
          `"${report.doctor}"`,
          `"${report.membershipType}"`,
          `"${report.speciality}"`,
          `"${report.hospital}"`,
          `"${report.hospitalAddress}"`,
          `"${report.contact}"`,
          `"${report.enquiry}"`,
          `"${report.status}"`,
          report.followups,
          `"${report.lastFollowup}"`,
          `"${report.nextFollowup}"`,
          report.quote !== '-' ? `"₹${report.quote}"` : '"-"'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sales-reports-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV file exported successfully!');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export CSV file');
    }
  };

  // Print report
  const printReport = () => {
    const printWindow = window.open('', '_blank');
    const reportData = filteredReports;

    const reportHTML = `
      <html>
        <head>
          <title>Sales Reports</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { margin: 20px 0; display: flex; justify-content: space-around; }
            .summary-item { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Sales Reports - ${new Date().toLocaleDateString()}</h1>

          <div class="summary">
            <div class="summary-item">
              <strong>Total Records:</strong><br>
              ${reportData.length}
            </div>
            <div class="summary-item">
              <strong>Hot Enquiries:</strong><br>
              ${reportData.filter(r => r.enquiry === 'Hot').length}
            </div>
            <div class="summary-item">
              <strong>Pending Status:</strong><br>
              ${reportData.filter(r => r.status === 'Pending').length}
            </div>
            <div class="summary-item">
              <strong>Completed:</strong><br>
              ${reportData.filter(r => r.status === 'Completed').length}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                ${['Sr No', 'Date', 'Doctor', 'Membership Type', 'Speciality', 'Hospital', 'Hospital Address', 'Contact', 'Enquiry', 'Status', 'Follow-ups', 'Last Follow-up', 'Next Follow-up', 'Quote (₹)']
                .map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${reportData.map((report, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${report.date}</td>
                  <td>${report.doctor}</td>
                  <td>${report.membershipType}</td>
                  <td>${report.speciality}</td>
                  <td>${report.hospital}</td>
                  <td>${report.hospitalAddress}</td>
                  <td>${report.contact}</td>
                  <td>${report.enquiry}</td>
                  <td>${report.status}</td>
                  <td>${report.followups}</td>
                  <td>${report.lastFollowup}</td>
                  <td>${report.nextFollowup}</td>
                  <td>${report.quote !== '-' ? `₹${report.quote}` : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();

    toast.success('Report sent to printer');
  };

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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sales Reports</h1>
        <p className="text-gray-600">Track and manage sales enquiries, follow-ups, and membership performance</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <div className="relative">
              <DatePicker
                selected={filters.fromDate ? new Date(filters.fromDate) : null}
                onChange={(date) => setFilters({...filters, fromDate: date ? date.toISOString().split('T')[0] : ''})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select start date"
                dateFormat="yyyy-MM-dd"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <div className="relative">
              <DatePicker
                selected={filters.toDate ? new Date(filters.toDate) : null}
                onChange={(date) => setFilters({...filters, toDate: date ? date.toISOString().split('T')[0] : ''})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
            <select
              value={filters.enquiryType}
              onChange={(e) => setFilters({...filters, enquiryType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            <select
              value={filters.membershipType}
              onChange={(e) => setFilters({...filters, membershipType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Hospital">Hospital</option>
              <option value="Hospital + Individual">Individual + Hospital</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              placeholder="Search doctor/hospital..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Total Records</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Hot Enquiries</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(r => r.enquiry === 'Hot').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(r => r.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(r => r.status === 'Completed').length}
          </p>
        </div>
      </div> */}

      {/* Table and Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sales Report Details</h2>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={exportToExcel}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </button>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={printReport}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>

        <Table
          data={filteredReports}
          showSrNo={true}
          pagination={true}
          excludeColumns={['isLinked', 'linkedDoctorId', 'relationshipType', 'quote']}
        />
      </div>
    </div>
  );
};

export default SalesReport;