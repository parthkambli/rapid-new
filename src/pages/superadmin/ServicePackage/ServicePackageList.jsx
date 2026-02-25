




// src/pages/Admin/ServicePackageList/ServicePackageList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const ServicePackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewPackage, setViewPackage] = useState(null); // Only for View modal

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.servicePackages.list);
      if (response.data.success) {
        setPackages(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load service packages!");
      }
    } catch (error) {
      console.error("Error fetching service packages:", error);
      toast.error(error.response?.data?.message || "Error loading service packages!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkg) => {
    if (!window.confirm(`Are you sure you want to delete ${pkg.name || pkg.packageName}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(apiEndpoints.servicePackages.delete(pkg._id));
      if (response.data.success) {
        toast.success("Service package deleted successfully!");
        fetchPackages(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete service package!");
      }
    } catch (error) {
      console.error("Error deleting service package:", error);
      toast.error(error.response?.data?.message || "Error deleting service package!");
    }
  };

  // NEW: Edit handler - navigates to dedicated edit page
  const handleEditClick = (row) => {
    navigate(`/admin/edit-service-package/${row._id}`);
  };

  const handleView = (row) => {
    setViewPackage(row);
  };

  const filteredPackages = packages.filter((pkg) =>
    (pkg.name || pkg.packageName || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Map packages to table rows
  const tableRows = filteredPackages.map((pkg) => ({
    name: pkg.name || pkg.packageName || '',
    year: pkg.year || (pkg.validityPeriod ? `${pkg.validityPeriod.value} ${pkg.validityPeriod.unit}` : ''),
    indemnity: pkg.indemnity || (pkg.indemnityCover ? pkg.indemnityCover : ''),
    amount: pkg.amount || pkg.finalPrice || pkg.totalPrice || '',
    detail: pkg.detail || pkg.targetAudience || '',
    user: pkg.user || (pkg.createdBy ? (pkg.createdBy.fullName || pkg.createdBy.name) : 'admin'),
    yearlyCharges: pkg.yearlyCharges || [],
    _id: pkg._id,
  }));

  const amountColumn = {
    header: 'amount',
    render: (row) => {
      const val = row.amount;
      if (val === null || val === undefined || val === '') return '-';
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return String(val);
      return `\u20b9${num.toLocaleString('en-IN')}`;
    }
  };

  const indemnityColumn = {
    header: 'indemnity',
    render: (row) => {
      const val = row.indemnity;
      if (val === null || val === undefined || val === '') return '-';
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return String(val);
      return `\u20b9${num.toLocaleString('en-IN')}`;
    }
  };

  const yearlyChargesColumn = {
    header: 'yearlyCharges',
    render: (row) => {
      const yc = row.yearlyCharges || [];
      if (!yc || yc.length === 0) return '-';
      return (
        <div className="text-sm">
          <span className="font-semibold text-green-600">{yc.length} yr</span>
          <div className="mt-1 max-h-20 overflow-y-auto">
            {yc.slice(0, 3).map((y, i) => (
              <div key={i} className="text-xs">Y{y.year}: \u20b9{Number(y.charge).toLocaleString('en-IN')}</div>
            ))}
            {yc.length > 3 && <div className="text-xs text-gray-500">+{yc.length - 3} more</div>}
          </div>
        </div>
      );
    }
  };

  const actions = [
    {
      label: 'Edit',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleEditClick(row),
    },
    {
      label: 'View',
      icon: <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleView(row),
    },
    {
      label: 'Delete',
      icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleDelete(row),
    }
  ];

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Package List</h2>
        <button
          onClick={() => navigate("/admin/create-service-package")}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
        >
          Create Service Package
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Service Packages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <Table
          data={tableRows}
          actions={actions}
          extraColumns={[yearlyChargesColumn, amountColumn, indemnityColumn]}
          headers={["SERVICE PACKAGE NAME", "YEAR", "INDEMNITY COVER (₹)", "AMOUNT (₹)", "DETAIL", "USER"]}
        />
      )}

      {/* View Modal */}
      {viewPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Service Package Details</h2>
              <button onClick={() => setViewPackage(null)} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Name:</strong> {viewPackage.name || viewPackage.packageName}</div>
              <div><strong>Year/Validity:</strong> {viewPackage.year}</div>
              <div><strong>Amount:</strong> {amountColumn.render(viewPackage)}</div>
              <div><strong>Indemnity Cover:</strong> {indemnityColumn.render(viewPackage)}</div>
              <div><strong>Detail / Audience:</strong> {viewPackage.detail}</div>
              <div><strong>User:</strong> {viewPackage.user}</div>
              <div>
                <strong>Yearly Charges:</strong>
                {viewPackage.yearlyCharges && viewPackage.yearlyCharges.length > 0 ? (
                  <ul className="list-disc ml-6 mt-2 text-xs">
                    {viewPackage.yearlyCharges.map((yc, i) => (
                      <li key={i}>
                        Year {yc.year}: ₹{Number(yc.charge).toLocaleString('en-IN')} – {yc.description || 'No description'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 ml-6">None</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackageList;