
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import { toast } from 'react-toastify';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const TelecallerList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('all'); // For future status filtering

  // === FETCH DATA FROM NEW POWERFUL API ===
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/employees/all-with-targets'); // This specific endpoint might not be in apiEndpoints

      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error('No data found');
        setData([]);
      }
    } catch (err) {
      toast.error('Failed to load telecallers');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === EDIT LOGIC (Monthly & Yearly Target) ===
  const handleEdit = (rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setTempValue(currentValue || '');
  };

  const handleSave = async (rowId) => {
    if (!tempValue || isNaN(tempValue) || tempValue < 0) {
      toast.error('Invalid value');
      return;
    }

    const payload = { employeeId: rowId };
    if (editingCell.field === 'monthly') {
      payload.monthly = [{ monthYear: new Date().toISOString().slice(0, 7), target: +tempValue }];
    } else {
      payload.yearly = [{ year: new Date().getFullYear(), target: +tempValue }];
    }

    try {
      await apiClient.post('/tasks/target', payload);
      toast.success('Target updated!');

      setData(prev => prev.map(item =>
        item._id === rowId
          ? { ...item, [editingCell.field + 'Target']: +tempValue }
          : item
      ));

      setEditingCell(null);
      setTempValue('');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const editableCell = (row, field) => {
    const isEditing = editingCell?.rowId === row._id && editingCell?.field === field;
    const value = row[field + 'Target'] || 0;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm focus:outline-blue-500"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave(row._id)}
          />
          <button onClick={() => handleSave(row._id)} className="text-green-600 hover:text-green-800">
            <FiCheck size={16} />
          </button>
          <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
            <FiX size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className="font-medium">{value}</span>
        <button
          onClick={() => handleEdit(row._id, field, value)}
          className="opacity-0 group-hover:opacity-100 transition ml-2"
        >
          <FiEdit2 size={14} className="text-blue-600" />
        </button>
      </div>
    );
  };

  // === TABLE COLUMNS ===
  const extraColumns = [
    {
      header: 'Monthly Target',
      render: (row) => editableCell(row, 'monthly')
    },
    {
      header: 'Yearly Target',
      render: (row) => editableCell(row, 'yearly')
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/employee/Tellecaller/view-task/${row.userId || row._id}`, { state: { employeeData: row } })}
          className="px-5 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition font-medium"
        >
          View
        </button>
      )
    }
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);

      let res;
      if (searchName || searchEmpId) {
        // Use the search endpoint with role filter
        const query = searchName || searchEmpId;
        res = await apiClient.get(apiEndpoints.employees.search, {
          params: { q: query, role: 'telecaller' }
        });
      } else {
        // If no search terms, fetch all telecallers
        res = await apiClient.get('/employees/all-with-targets');
      }

      if (res.data.success) {
        let filteredData = res.data.data;

        // Apply status filter on client side
        if (filterByStatus !== 'all') {
          filteredData = filteredData.filter(telecaller => {
            // Assuming there's an isActive property or similar in the data
            // If not available, we'll need to adjust this logic
            if (filterByStatus === 'active') {
              return telecaller.isActive !== false; // Default to active if property doesn't exist
            } else {
              return telecaller.isActive === false;
            }
          });
        }

        setData(filteredData);
      } else {
        toast.error('No data found');
        setData([]);
      }
    } catch (err) {
      toast.error('Failed to search telecallers');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmpId('');
    setFilterByStatus('all');
    fetchData(); // Reload all data
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Telecaller Dashboard</h1>
        <p className="text-gray-600">Manage telecaller targets and performance</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search by Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter telecaller name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search by Employee ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter employee ID"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end space-x-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Clear
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => navigate('/admin/employee/Tellecaller/add-task')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Add New Task
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">No telecallers found</div>
        ) : (
          <Table
            data={data}
            extraColumns={extraColumns}
            excludeColumns={['_id']}
            columnOrder={[
              'employeeId',
              'fullName',
              'dailyTarget',
              'Monthly Target',
              'Yearly Target',
              'totalDoctors',
              'hotLeads',
              'closeLeads',
              'Actions'
            ]}
            columnHeaders={{
              employeeId: 'Employee Id',
              fullName: 'Full Name',
              dailyTarget: 'Daily Target',
              totalDoctors: 'Total Doctors',
              hotLeads: 'Hot Leads',
              closeLeads: 'Close Leads',
            }}
            pagination={true}
            rowsPerPage={10}
          />
        )}
      </div>
    </div>
  );
};

export default TelecallerList;
