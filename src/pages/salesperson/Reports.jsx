import React, { useState, useEffect } from "react";
import { Calendar, Download, RotateCcw, Search } from "lucide-react";
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { toast } from 'react-toastify';

const SalesmanReport = () => {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [enquiryType, setEnquiryType] = useState("All");
  const [status, setStatus] = useState("All");
  const [membershipType, setMembershipType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSalesmanReports();
  }, []);

  const fetchSalesmanReports = async () => {
    try {
      setLoading(true);
      // Using doctor reports endpoint for salesman data since it has the required fields
      const response = await apiClient.get(apiEndpoints.reports.doctors);
      if (response.data.success) {
        const transformedData = response.data.data.map((item, index) => ({
          srNo: index + 1,
          date: item.date,
          doctor: item.drName,
          membershipType: item.membership,
          specialty: item.specialty || '-',
          hospital: item.hospital,
          address: item.city || '-',
          contact: '-', // Contact might not be available in the API response
          enquiry: item.leadStatus,
          status: item.salesStatus,
          followUps: item.followUps ? parseInt(item.followUps) : 0,
          lastFollowUp: item.lastFollowUp || '-',
          nextFollowUp: item.nextFollowUp || '-',
          quote: item.finalPremium || '-',
        }));
        setOriginalData(transformedData);
        setFilteredData(transformedData);
      } else {
        toast.error('Failed to fetch salesman reports');
      }
    } catch (error) {
      console.error('Error fetching salesman reports:', error);
      toast.error('Error fetching salesman reports');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...originalData];

    // Date filters
    if (fromDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const fromDateParsed = new Date(fromDate);
        return itemDate >= fromDateParsed;
      });
    }
    if (toDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const toDateParsed = new Date(toDate);
        return itemDate <= toDateParsed;
      });
    }

    // Enquiry Type
    if (enquiryType !== 'All') {
      result = result.filter(item => item.enquiry.toLowerCase() === enquiryType.toLowerCase());
    }

    // Status
    if (status !== 'All') {
      result = result.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    // Membership Type
    if (membershipType !== 'All') {
      result = result.filter(item => item.membershipType === membershipType);
    }

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.doctor.toLowerCase().includes(query) ||
        item.specialty.toLowerCase().includes(query) ||
        item.hospital.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query)
      );
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setEnquiryType("All");
    setStatus("All");
    setMembershipType("All");
    setSearchQuery("");
    setFilteredData(originalData);
  };

  const exportToExcel = () => {
    // Excel export functionality would go here
    toast.info('Export to Excel functionality will be implemented');
  };

  return (
    <div className=" min-h-screen font-sans max-w-[80vw]">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="border-b border-gray-300 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Salesman Report</h1>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="flex">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm text-gray-700 focus:outline-none"
                />
                <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="flex">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm text-gray-700 focus:outline-none"
                />
                <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Enquiry Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none"
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Converted">Converted</option>
              </select>
            </div>

            {/* Membership Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Individual">Individual</option>
                <option value="Hospital">Hospital</option>
                <option value="Hospital + Individual">Individual + Hospital</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search (Doctor / Specialty / Hospital / City)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sort & Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort by Next Follow up Date</span>
              <div className="flex">
                <input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm text-gray-700 focus:outline-none"
                />
                <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <button 
                onClick={applyFilters}
                className="bg-teal-600 text-white px-5 py-1.5 rounded-md text-sm font-medium hover:bg-teal-700 flex items-center gap-1.5"
              >
                Generate
              </button>
              <button 
                onClick={resetFilters}
                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button 
                onClick={exportToExcel}
                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-2 text-gray-600">Loading reports...</span>
          </div>
        )}

        {/* Data table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#f5fdfd] border-b border-gray-300">
                <tr>
                  {[
                    "Sr",
                    "Date",
                    "Doctor",
                    "Member",
                    "Specialty",
                    "Hospital",
                    "Address",
                    "Contact",
                    "Enquiry",
                    "Status",
                    "Follow-ups",
                    "Last",
                    "Next",
                    "Quote",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-2 py-2 text-left text-xs font-extrabold text-[#178888] uppercase tracking-tight whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="px-2 py-4 text-center text-gray-500">
                      No data found for selected filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <tr key={row.srNo} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-2 py-2 text-xs text-gray-900">{row.srNo}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap">{row.date}</td>
                      <td className="px-2 py-2 text-xs font-medium text-gray-900">{row.doctor}</td>
                      <td className="px-2 py-2 text-xs text-gray-700">{row.membershipType}</td>
                      <td className="px-2 py-2 text-xs text-gray-700">{row.specialty}</td>
                      <td className="px-2 py-2 text-xs text-gray-700">{row.hospital}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 max-w-[120px] truncate" title={row.address}>{row.address}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap">{row.contact}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            row.enquiry.toLowerCase() === "hot"
                              ? "bg-red-100 text-red-700"
                              : row.enquiry.toLowerCase() === "warm"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <div className={`w-1 h-1 rounded-full ${
                            row.enquiry.toLowerCase() === "hot" ? "bg-red-500" : row.enquiry.toLowerCase() === "warm" ? "bg-yellow-500" : "bg-blue-500"
                          }`}></div>
                          {row.enquiry}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            row.status.toLowerCase() === "pending" || row.status.toLowerCase() === "cold"
                              ? "bg-pink-100 text-pink-700" 
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-xs text-center text-gray-700">{row.followUps}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap">{row.lastFollowUp}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap">{row.nextFollowUp}</td>
                      <td className="px-2 py-2 text-xs text-gray-700 whitespace-nowrap">{row.quote}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesmanReport;