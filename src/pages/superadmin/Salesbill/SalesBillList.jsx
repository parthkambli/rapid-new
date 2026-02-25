
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '../../../components/mainComponents/Table';
import { Link } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const SalesBill = () => {
  const [filters, setFilters] = useState({
    searchName: '',
    searchSBNo: '',
    searchOldSBNo: '',
    searchMembershipType: '',
    searchMembershipYear: '',
    fromDate: '',
    toDate: ''
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const navigate = useNavigate();

  const calculateMembershipPeriod = (billDate, dueDate) => {
    if (!billDate || !dueDate) return 'N/A';
    try {
      const start = new Date(billDate);
      const end = new Date(dueDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';

      const diffInMs = end.getTime() - start.getTime();
      const msInYear = 1000 * 60 * 60 * 24 * 365.25;
      const years = diffInMs / msInYear;
      const roundedYears = Math.round(years);

      if (roundedYears === 0) {
        const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
        return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : '< 1 Month';
      }
      return `${roundedYears} Year${roundedYears > 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Error calculating membership period:', error);
      return 'N/A';
    }
  };

  const getYearFromDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  };

  const fetchData = async (page = 1, applySearch = false) => {
    try {
      setLoading(true);

      let query = { page, limit: 1000 };

      if (applySearch) {
        if (filters.searchName.trim()) query.search = filters.searchName.trim();
        if (filters.searchSBNo.trim()) query.billNumber = filters.searchSBNo.trim();
        if (filters.searchOldSBNo.trim()) query.oldBillNumber = filters.searchOldSBNo.trim();
        if (filters.searchMembershipType.trim()) query.membershipType = filters.searchMembershipType.trim();
        if (filters.fromDate) query.dateFrom = filters.fromDate;
        if (filters.toDate) query.dateTo = filters.toDate;
      }

      const response = await apiClient.get(apiEndpoints.salesBills.list, { params: query });

      if (response.data.success) {
        const transformedData = response.data.data.map((bill, index) => {
          const membershipPeriod = calculateMembershipPeriod(bill.billDate, bill.dueDate);
          const billYear = getYearFromDate(bill.billDate);

          // Helper to format date strictly from ISO string (UTC) to DD/MM/YYYY
          // avoiding local timezone conversion shifts
          const formatDate = (isoString) => {
            if (!isoString) return '';
            return isoString.split('T')[0].split('-').reverse().join('/');
          };




const isMonthly = bill.membershipType === 'monthly';
  const itemAmount =
    bill.items && bill.items.length > 0 ? bill.items[0].amount : 0;

  const displayAmount = isMonthly ? itemAmount : bill.totalAmount;


          return {
            id: bill.billId || bill._id,
            srNo: (page - 1) * 15 + index + 1,
            sbNo: bill.billNumber || '',
            oldSBNo: bill.renewalFrom || '',
            sbDate: formatDate(bill.billDate),
            sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
            doctorName: bill.client?.name || '',
            membership: bill.membershipType || 'N/A',
            membershipPeriod: membershipPeriod,
            // amount: `₹${(bill.totalAmount || 0).toLocaleString('en-IN')}`,
            amount: `₹${(displayAmount || 0).toLocaleString('en-IN')}`,

            narration: bill.notes || '',
            expiryDate: formatDate(bill.dueDate),
            billYear: billYear,
            _id: bill._id,
            client: bill.client
          };
        });

        setData(transformedData);

        let finalData = transformedData;
        if (applySearch && filters.searchMembershipYear.trim()) {
          finalData = transformedData.filter(item =>
            item.billYear?.toString() === filters.searchMembershipYear.trim()
          );
        }

        setFilteredData(finalData);
        setIsSearchApplied(applySearch);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
          setTotalCount(response.data.pagination.total || 0);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch sales bills');
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching sales bills:', error);
      toast.error(error.response?.data?.message || 'Error fetching sales bills');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, []);

  useEffect(() => {
    const hasAnyFilter = Object.values(filters).some(v => v.toString().trim() !== '');
    fetchData(currentPage, hasAnyFilter);
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const hasAnyFilter = Object.values(filters).some(v => v.toString().trim() !== '');
    fetchData(1, hasAnyFilter);
  };

  const handleClearFilters = () => {
    setFilters({
      searchName: '',
      searchSBNo: '',
      searchOldSBNo: '',
      searchMembershipType: '',
      searchMembershipYear: '',
      fromDate: '',
      toDate: ''
    });
    setCurrentPage(1);
    setIsSearchApplied(false);
    fetchData(1, false);
    toast.success('All filters cleared');
  };

  const deleteSalesBill = async (row) => {
    if (window.confirm(`Are you sure you want to delete sales bill ${row.sbNo}?`)) {
      try {
        const response = await apiClient.delete(apiEndpoints.salesBills.delete(row._id));
        if (response.data.success) {
          toast.success('Sales bill deleted successfully!');
          const hasFilters = Object.values(filters).some(v => v.toString().trim() !== '');
          fetchData(currentPage, hasFilters);
        } else {
          toast.error(response.data.message || 'Failed to delete');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting sales bill');
      }
    }
  };

  const actions = [
    { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/admin/edit-salesbill/${row._id}`) },
    { label: 'Print', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/print/${row._id}`) },
    // { label: 'SA', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/sa/${row._id}`) },
    {
      label: 'SA', useDropdown: true, onClick: (row) => {
        const membershipType = row.membership.toLowerCase();
        const path = membershipType === 'monthly' ? `/admin/salesbill/sa/monthly/${row._id}` : `/admin/salesbill/sa/yearly/${row._id}`;
        navigate(path);
      }
    },
    // { label: 'SAWHF', useDropdown: true, onClick: (row) => console.log(`SAWHF for ${row.sbNo}`) },
    // SAWHF ke liye

    {
      label: 'SAWHF',
      useDropdown: true,
      onClick: (row) => {
        const membershipType = row.membership.toLowerCase();
        const path = `/admin/salesbill/sa-whf/${membershipType}/${row._id}`;
        navigate(path);
      }
    },


    { label: 'WN', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/WN/${row._id}`) },
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
    { label: 'Membership Form', useDropdown: true, onClick: (row) => console.log(`Membership Form for ${row.sbNo}`) },
    { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true },
  ];

  // Count how many filters are active
  const activeFilterCount = Object.values(filters).filter(v => v.toString().trim() !== '').length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="md:w-[70vw]  mx-auto px-2 sm:px-4 md:px-6 lg:px-4 min-h-screen py-4 lg:w-[80vw]">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">Sales Bill</h1>
          <Link to="/admin/add-salesbill">
            <button className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
              Create Sale Bill
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search By Name</label>
              <input name="searchName" value={filters.searchName} onChange={handleFilterChange} placeholder="Doctor name" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search SB No</label>
              <input name="searchSBNo" value={filters.searchSBNo} onChange={handleFilterChange} placeholder="Bill number" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Old SB No</label>
              <input name="searchOldSBNo" value={filters.searchOldSBNo} onChange={handleFilterChange} placeholder="Old bill number" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Type</label>
              <input name="searchMembershipType" value={filters.searchMembershipType} onChange={handleFilterChange} placeholder="Membership type" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Year</label>
              <input type="text" name="searchMembershipYear" value={filters.searchMembershipYear} onChange={handleFilterChange} placeholder="e.g., 2025" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={loading} className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Clear Filters + Active Filter Count */}
          {(hasActiveFilters || isSearchApplied) && (
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 font-medium text-sm transition-colors"
              >
                Clear All Filters
              </button>

              {hasActiveFilters && (
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold mr-2">
                    {activeFilterCount}
                  </span>
                  filter{activeFilterCount > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          )}
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading sales bills...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900">No sales bills found</h3>
          <p className="mt-2 text-gray-500">
            {isSearchApplied ? 'Try adjusting your search filters' : 'No bills have been created yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            {/* Table height auto - no fixed height, no row cutting */}
            <Table
              data={filteredData}
              actions={actions}
              headers={[
                "Sr No.",
                "SB No",
                "Old SB No",
                "SB Date",
                "SB Type",
                "Doctor Name",
                "Membership",
                "Membership Period",
                "Amount",
                "Narration",
                "Expiry Date"
              ]}
              excludeColumns={['id', 'billYear', '_id', 'client']}
              pagination={{
                currentPage,
                totalPages,
                totalCount,
                onPageChange: setCurrentPage
              }}
            // Agar Table component mein height prop ho to remove karo, ya auto set karo
            // height="auto"  // Agar support karta hai to
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesBill;