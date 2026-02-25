

import React, { useState, useEffect, useMemo } from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const QuotationList = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotationData();
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return (
        (item.Code && item.Code.toLowerCase().includes(query)) ||
        (item["Party Name"] && item["Party Name"].toLowerCase().includes(query)) ||
        (item.Narration && item.Narration.toLowerCase().includes(query)) ||
        (item._id && item._id.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  const fetchQuotationData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.quotations.myQuotations);

      if (response.data.success) {
        const mappedData = response.data.data.map(quotation => ({
          Code: quotation.quotationNumber || quotation._id,
          "Party Name": quotation.requester?.name || quotation.clientName || "N/A",
          Narration: quotation.requestDetails?.additionalRequirements || quotation.narration || "N/A",
          "Entry Date": quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : "N/A",
          _id: quotation._id,
          status: quotation.status || "Pending"
        }));

        setData(mappedData);
        setAllData(mappedData); // Store original data
      } else {
        toast.error("Failed to load quotation data");
      }
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      setError("Failed to load quotation data");
      toast.error("Failed to load quotation data");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Action buttons
  const actions = [
    {
      label: "Print",
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
      onClick: (row) => {
        window.open(`/telecaller/quotation/${row._id}/`, '_blank');
      },
      showAsIcon: true,
    },
    {
      label: "Edit",
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      onClick: (row) => {
        navigate(`/sales/quotation/edit/${row._id}`);
      },
      showAsIcon: true,
    },
    {
      label: "Delete",
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: async (row) => {
        if (window.confirm("Are you sure you want to delete this quotation?")) {
          try {
            const response = await apiClient.delete(apiEndpoints.quotations.delete(row._id));
            if (response.data.success) {
              toast.success("Quotation deleted successfully");
              setData(prevData => prevData.filter(item => item._id !== row._id));
              setAllData(prevData => prevData.filter(item => item._id !== row._id));
            } else {
              throw new Error(response.data.message || "Failed to delete quotation");
            }
          } catch (error) {
            console.error("Error deleting quotation:", error);
            toast.error("Failed to delete quotation");
          }
        }
      },
      showAsIcon: true,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Quotation</h2>
          <button
            onClick={() => navigate("/sales/add/quotation")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Quotation
          </button>
        </div>
        <div className="text-red-500 text-center p-4 bg-red-50 rounded">
          {error}
          <button
            onClick={fetchQuotationData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Quotation</h2>
        <button
          onClick={() => navigate("/sales/add/quotation")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Quotation
        </button>
      </div>
      
      {/* Search input with clear button */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-1/3">
            <input
              type="text"
              placeholder="Search by Code, Party Name, Narration..."
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 pl-10 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Search icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Clear button (only when there's text) */}
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Show results count */}
          {searchQuery && (
            <div className="text-sm text-gray-600">
              Found {filteredData.length} of {data.length} quotations
            </div>
          )}
        </div>
      </div>
      
      {/* Show message if no results found */}
      {searchQuery && filteredData.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700">
            No quotations found for "{searchQuery}". Try a different search term.
          </p>
          <button
            onClick={handleClearSearch}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}
      
      <Table
        data={filteredData} // Pass filtered data to table
        actions={actions}
      />
    </div>
  );
};

export default QuotationList;
