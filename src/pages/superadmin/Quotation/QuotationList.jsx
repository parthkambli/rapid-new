
import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from 'react-toastify';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const navigate = useNavigate();

  const fetchQuotations = async (page = 1, search = '', newLimit = pagination.limit) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: newLimit.toString(),
        ...(search && { search })
      });

      const response = await apiClient.get(`${apiEndpoints.quotations.list}?${params.toString()}`);

      if (response.data.success) {
        const formattedData = response.data.data.map(quotation => ({
          id: quotation._id,
          Code: quotation.quotationNumber || `Q${quotation._id.slice(-6).toUpperCase()}`,
          "Party Name": quotation.requester?.name || quotation.doctorName || 'N/A',
          Narration: quotation.requestDetails?.additionalRequirements || 'N/A',
          "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
          status: quotation.status || 'responses_pending',
          totalAmount: quotation.totalAmount || 0,
          clientEmail: quotation.requester?.email || 'N/A',
          clientPhone: quotation.requester?.phone || 'N/A',
          createdAt: quotation.createdAt,
          rawData: quotation
        }));

        setQuotations(formattedData);
        
        // Update pagination state from backend response
        if (response.data.pagination) {
          setPagination({
            current: response.data.pagination.current || 1,
            pages: response.data.pagination.pages || 1,
            total: response.data.pagination.total || 0,
            limit: newLimit
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load quotations');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations(1, searchTerm);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.search.value.trim();
    setSearchTerm(term);
    fetchQuotations(1, term);
  };

  const handlePageChange = (page) => {
    fetchQuotations(page, searchTerm);
  };

  const handlePageSizeChange = (pageSize) => {
    fetchQuotations(1, searchTerm, pageSize);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete quotation ${row.Code}?`)) return;

    try {
      await apiClient.delete(apiEndpoints.quotations.delete(row.id));
      toast.success('Quotation deleted');
      
      // Re-fetch current page or previous page if current becomes empty
      const remainingItems = pagination.total - 1;
      const itemsOnCurrentPage = quotations.length - 1;
      let newPage = pagination.current;
      
      if (itemsOnCurrentPage === 0 && pagination.current > 1) {
        newPage = pagination.current - 1;
      }
      
      fetchQuotations(newPage, searchTerm);
    } catch (error) {
      toast.error('Failed to delete');
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/quotations/${row.id}/edit`);
  };

  const actions = [
    {
      label: "Print",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
      onClick: (row) => window.open(`/admin/quotation/${row.id}/`, '_blank'),
      showAsIcon: true,
    },
    {
      label: "Edit",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
      onClick: handleEdit,
      showAsIcon: true,
    },
    {
      label: "Delete",
      icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: handleDelete,
      showAsIcon: true,
    },
  ];

  const visibleColumns = ["Code", "Party Name", "Narration", "Entry Date"];

  const extraColumns = [
    {
      header: "Status",
      render: (row) => {
        const status = row.status;
        const color = {
          draft: 'bg-gray-200 text-gray-800',
          responses_pending: 'bg-yellow-200 text-yellow-800',
          sent: 'bg-blue-200 text-blue-800',
          accepted: 'bg-green-200 text-green-800',
          rejected: 'bg-red-200 text-red-800',
        }[status?.toLowerCase()] || 'bg-gray-200 text-gray-700';

        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50  w-[85vw] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
        <button
          onClick={() => navigate("/admin/create-quotation")}
          className="px-5 py-2.5 bg-[#15BBB3] text-white rounded-lg hover:bg-[#13a89e] transition"
        >
          + Create Quotation
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="search"
          placeholder="Search by Code, Party Name..."
          defaultValue={searchTerm}
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
        />
        <button type="submit" className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            document.querySelector('input[name="search"]').value = '';
            setSearchTerm('');
            fetchQuotations(1, '');
          }}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Table
          data={quotations}
          actions={actions}
          extraColumns={extraColumns}
          excludeColumns={["id", "status", "totalAmount", "clientEmail", "clientPhone", "createdAt", "rawData"]}
          columnOrder={["Code", "Party Name", "Narration", "Entry Date", "Status"]}
          pagination={true}
          serverPagination={true}
          totalServerItems={pagination.total}
          currentServerPage={pagination.current}
          defaultPageSize={pagination.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default QuotationList;
