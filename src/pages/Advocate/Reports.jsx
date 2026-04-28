import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Printer, Download, Search, X } from 'lucide-react';
import Table from '../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdvocateReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    caseNo: '',
    doctor: '',
    status: 'All',
    caseType: 'All',
    priority: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Fetch advocate reports data
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await apiClient.get(apiEndpoints.reports.advocateSpecific, { params });

      if (response.data.success) {
        setReports(response.data.data);
        setFilteredReports(response.data.data);
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

    if (filters.caseNo) {
      filtered = filtered.filter(report =>
        report.caseId.toLowerCase().includes(filters.caseNo.toLowerCase()) ||
        report.caseNo.toLowerCase().includes(filters.caseNo.toLowerCase())
      );
    }

    if (filters.doctor) {
      filtered = filtered.filter(report =>
        report.doctorName.toLowerCase().includes(filters.doctor.toLowerCase())
      );
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.caseType !== 'All') {
      filtered = filtered.filter(report => report.caseType === filters.caseType);
    }

    if (filters.priority !== 'All') {
      filtered = filtered.filter(report => report.priority === filters.priority);
    }

    if (filters.dateFrom) {
      const startDate = new Date(filters.dateFrom);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(report =>
        new Date(report.createdAt) >= startDate
      );
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(report =>
        new Date(report.createdAt) <= endDate
      );
    }

    setFilteredReports(filtered);
    toast.info(`${filtered.length} reports found`);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      caseNo: '',
      doctor: '',
      status: 'All',
      caseType: 'All',
      priority: 'All',
      dateFrom: '',
      dateTo: ''
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

  // Define columns for the table
  const columns = [
    {
      header: "Case ID",
      accessor: "caseId",
      render: (value) => <span className="text-gray-700 font-medium">{value || '-'}</span>
    },
    {
      header: "Case No",
      accessor: "caseNo",
      render: (value) => <span className="text-gray-700">{value || '-'}</span>
    },
    {
      header: "Doctor",
      accessor: "doctorName",
      render: (value) => <span className="text-gray-700">{value || '-'}</span>
    },
    {
      header: "Patient",
      accessor: "patientName",
      render: (value) => <span className="text-gray-700">{value || '-'}</span>
    },
    {
      header: "Query Type",
      accessor: "queryType",
      render: (value) => <span className="text-gray-700">{value || '-'}</span>
    },
    {
      header: "Case Type",
      accessor: "caseType",
      render: (value) => <span className="text-gray-700">{value || '-'}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Open' ? 'bg-green-100 text-green-800' : value === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value || '-'}
        </span>
      )
    },
    {
      header: "Priority",
      accessor: "priority",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Low' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value || '-'}
        </span>
      )
    },
    {
      header: "Next Date",
      accessor: "nextDate",
      render: (value) => {
        if (!value) return <span className="text-gray-700">-</span>;
        try {
          const date = new Date(value);
          return <span className="text-gray-700">{isNaN(date.getTime()) ? '-' : date.toLocaleDateString()}</span>;
        } catch (e) {
          return <span className="text-gray-700">-</span>;
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for export - convert to appropriate format
      const exportData = filteredReports.map((report, index) => ({
        'Sr No': index + 1,
        'Case ID': report.caseId || '-',
        'Case No': report.caseNo || '-',
        'Doctor': report.doctorName || '-',
        'Patient': report.patientName || '-',
        'Query Type': report.queryType || '-',
        'Case Type': report.caseType || '-',
        'Status': report.status || '-',
        'Priority': report.priority || '-',
        'Next Date': report.nextDate ? (() => {
          try {
            const date = new Date(report.nextDate);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
          } catch (e) {
            return '-';
          }
        })() : '-',
        'Created Date': report.createdAt ? (() => {
          try {
            const date = new Date(report.createdAt);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
          } catch (e) {
            return '-';
          }
        })() : '-'
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Advocate Reports');

      // Export the file
      XLSX.writeFile(wb, `advocate-reports-${new Date().toISOString().split('T')[0]}.xlsx`);

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
      const headers = ['Sr No', 'Case ID', 'Case No', 'Doctor', 'Patient', 'Query Type', 'Case Type', 'Status', 'Priority', 'Next Date', 'Created Date'];
      const csvContent = [
        headers.join(','),
        ...filteredReports.map((report, index) => [
          index + 1,
          `"${report.caseId || '-'}"`,
          `"${report.caseNo || '-'}"`,
          `"${report.doctorName || '-'}"`,
          `"${report.patientName || '-'}"`,
          `"${report.queryType || '-'}"`,
          `"${report.caseType || '-'}"`,
          `"${report.status || '-'}"`,
          `"${report.priority || '-'}"`,
          report.nextDate ? `"${(() => {
            try {
              const date = new Date(report.nextDate);
              return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
            } catch (e) {
              return '-';
            }
          })()}"` : '"-"',
          report.createdAt ? `"${(() => {
            try {
              const date = new Date(report.createdAt);
              return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
            } catch (e) {
              return '-';
            }
          })()}"` : '"-"'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `advocate-reports-${new Date().toISOString().split('T')[0]}.csv`);
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
          <title>Advocate Reports</title>
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
          <h1>Advocate Reports - ${new Date().toLocaleDateString()}</h1>

          <div class="summary">
            <div class="summary-item">
              <strong>Total Cases:</strong><br>
              ${reportData.length}
            </div>
            <div class="summary-item">
              <strong>Open Cases:</strong><br>
              ${reportData.filter(c => c.status === 'Open').length}
            </div>
            <div class="summary-item">
              <strong>Closed Cases:</strong><br>
              ${reportData.filter(c => c.status === 'Closed').length}
            </div>
            <div class="summary-item">
              <strong>High Priority:</strong><br>
              ${reportData.filter(c => c.priority === 'High').length}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                ${['Sr No', 'Case ID', 'Case No', 'Doctor', 'Patient', 'Query Type', 'Case Type', 'Status', 'Priority', 'Next Date', 'Created Date']
                .map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${reportData.map((report, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${report.caseId || '-'}</td>
                  <td>${report.caseNo || '-'}</td>
                  <td>${report.doctorName || '-'}</td>
                  <td>${report.patientName || '-'}</td>
                  <td>${report.queryType || '-'}</td>
                  <td>${report.caseType || '-'}</td>
                  <td>${report.status || '-'}</td>
                  <td>${report.priority || '-'}</td>
                  <td>${report.nextDate ? (() => {
                    try {
                      const date = new Date(report.nextDate);
                      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
                    } catch (e) {
                      return '-';
                    }
                  })() : '-'}</td>
                  <td>${report.createdAt ? (() => {
                    try {
                      const date = new Date(report.createdAt);
                      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
                    } catch (e) {
                      return '-';
                    }
                  })() : '-'}</td>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Advocate Reports</h1>
        <p className="text-gray-600">View and analyze advocate performance and statistics</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case No/ID</label>
            <input
              type="text"
              value={filters.caseNo}
              onChange={(e) => setFilters({...filters, caseNo: e.target.value})}
              placeholder="Search case no or ID"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <input
              type="text"
              value={filters.doctor}
              onChange={(e) => setFilters({...filters, doctor: e.target.value})}
              placeholder="Search doctor name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
            <select
              value={filters.caseType}
              onChange={(e) => setFilters({...filters, caseType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Medicolegal">Medicolegal</option>
              <option value="Consumer">Consumer</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <div className="relative">
              <DatePicker
                selected={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={(date) => setFilters({...filters, dateFrom: date ? date.toISOString().split('T')[0] : ''})}
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
                selected={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={(date) => setFilters({...filters, dateTo: date ? date.toISOString().split('T')[0] : ''})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Total Cases</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Open Cases</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(c => c.status === 'Open').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">Closed Cases</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(c => c.status === 'Closed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500">High Priority</h3>
          <p className="text-3xl font-bold text-gray-900">
            {filteredReports.filter(c => c.priority === 'High').length}
          </p>
        </div>
      </div>

      {/* Table and Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Advocate Report Details</h2>
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
          excludeColumns={['_id', 'assignedExpert', 'assignedAdvocate', 'totalFollowUps', 'lastFollowUp', '__v', 'createdBy', 'updatedBy', 'updatedAt', 'followUps', 'doctorId', 'subType', 'queryDescription', 'ageGender', 'contactNo', 'address', 'opponentName', 'relation', 'opponentType', 'opponentContact', 'opponentEmail', 'opponentAddress', 'tags']}
          columnOrder={['caseId', 'caseNo', 'doctorName', 'patientName', 'queryType', 'caseType', 'status', 'priority', 'nextDate', 'createdAt']}
        />
      </div>
    </div>
  );
};

export default AdvocateReports;