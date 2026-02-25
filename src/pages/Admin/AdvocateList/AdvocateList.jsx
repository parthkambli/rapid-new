// src/pages/Admin/Advocates/AdvocateList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import { Link } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const AdvocateList = () => {
  const navigate = useNavigate();
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("All");
  const [searchSpecialization, setSearchSpecialization] = useState("All");
  const [searchCity, setSearchCity] = useState("");
  
  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch advocates from API
  const fetchAdvocates = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: pageSize,
        ...searchParams
      };

      // Use list endpoint with all params
      const response = await apiClient.get(apiEndpoints.advocates.list, { params });
      setAdvocates(response.data.data || []);
      // Extract total from pagination object
      setTotalItems(response.data.pagination?.total || response.data.total || response.data.count || 0);
    } catch (err) {
      console.error('Error fetching advocates:', err);
      setError(err.response?.data?.message || 'Failed to fetch advocates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  // Handle search
  useEffect(() => {
    const searchParams = {};

    if (searchName) {
      searchParams.search = searchName;
    }
    if (searchStatus !== "All") {
      searchParams.status = searchStatus.toLowerCase();
    }
    if (searchSpecialization !== "All") {
      searchParams.specialization = searchSpecialization;
    }
    if (searchCity) {
      searchParams.city = searchCity;
    }

    const timeoutId = setTimeout(() => {
      fetchAdvocates(searchParams);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchName, searchStatus, searchSpecialization, searchCity]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.fullName}?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.advocates.delete(row._id || row.id));
      await fetchAdvocates(); // Refresh the list
    } catch (err) {
      console.error('Error deleting advocate:', err);
      setError(err.response?.data?.message || 'Failed to delete advocate');
      alert(err.response?.data?.message || 'Failed to delete advocate');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/create-advocate`, { state: { editData: row } });
  };

  const handleView = (row) => {
    navigate(`/admin/advocate/${row._id || row.id}`, { state: { advocate: row } });
  };

  const filteredAdvocates = advocates;

  return (
    <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Advocate List</h2>
        <div className="flex gap-3">

          <Link
            to="/admin/create-advocate-bill"

          >
            <button
              // onClick={() => alert("Create Advocate Bill")}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm  font-medium"
            >
              Create Advocate Bill
            </button>
          </Link>

          <Link
            to="/admin/advocate-bills"

          >
            <button
              // onClick={() => alert("Create Advocate Bill")}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
            >
              View Advocate Bills
            </button>
          </Link>

          <Link
            to="/admin/create-advocate"

          >
            <button

              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
            >
              Create Advocate List
            </button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading advocates...
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search By Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="retired">Retired</option>
        </select>
        <select
          value={searchSpecialization}
          onChange={(e) => setSearchSpecialization(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        >
          <option value="All">All Specializations</option>
          <option value="Civil">Civil</option>
          <option value="Criminal">Criminal</option>
          <option value="Consumer">Consumer</option>
          <option value="Family">Family</option>
          <option value="Corporate">Corporate</option>
        </select>
        <input
          type="text"
          placeholder="Search By City"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
      </div>

      {/* Table - Using Your Table Component */}
      {filteredAdvocates.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No advocates found. {searchName || searchStatus !== "All" || searchSpecialization !== "All" ? "Try adjusting your filters." : ""}
        </div>
      ) : (
        <Table
          data={filteredAdvocates.map(adv => {
            // Format date fields to DD-MM-YY format
            const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = String(date.getFullYear());
              return `${day}-${month}-${year}`;
            };

            return {
              ...adv,
              city: adv.residentialAddress?.city || adv.officeAddress?.city || '',
              specialization: Array.isArray(adv.specialization) ? adv.specialization.join(', ') : adv.specialization || '',
              status: adv.status || 'active',
              // Format DOB if it exists
              ...(adv.dateOfBirth && { dateOfBirth: formatDate(adv.dateOfBirth) }),
              ...(adv.dob && { dob: formatDate(adv.dob) }), // In case it's stored as 'dob'
              ...(adv.createdAt && { createdAt: formatDate(adv.createdAt) }),
              ...(adv.updatedAt && { updatedAt: formatDate(adv.updatedAt) }),
            };
          })}
          extraColumns={[
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(row)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          excludeColumns={['whatsappNumber', 'barCouncilNumber', 'upi', 'courts', 'qualifications', 'availability', 'rating', 'successRate', 'assignedCases', 'user', 'enrollmentDate', 'practiceType', 'aadhar', 'license', 'remarks', 'totalCases', 'successfulCases']}
          columnOrder={['advocateId', 'fullName', 'gender', 'dateOfBirth', 'city', 'specialization', 'experience', 'email']}
          pagination={true}
          serverPagination={true}
          totalServerItems={totalItems}
          currentServerPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchAdvocates({ page });
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
            fetchAdvocates({ page: 1, limit: size });
          }}
        />
      )}
    </div>
  );
};

export default AdvocateList;