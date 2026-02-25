import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const ViewAttendanceRecord = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0
  });

  // Filters
  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState(employeeId || '');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Fetch attendance data based on filters
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      // Get month and year from selectedMonth (format: YYYY-MM)
      const [year, month] = selectedMonth.split('-').map(Number);

      // Fetch attendance records for the selected employee and month
      const response = await apiClient.get(apiEndpoints.attendance.list, {
        params: {
          month: month,
          year: year,
          search: searchName || searchEmpId, // Search by name or employee ID
          limit: 50,
          page: 1
        }
      });

      if (response.data.success) {
        // Format the response data to match table structure
        const formattedData = response.data.data.map(record => ({
          _id: record._id,
          date: new Date(record.date).toLocaleDateString('en-IN'),
          status: record.statusDisplay || record.status,
          remarks: record.remarks || '-'
        }));

        setAttendanceData(formattedData);

        // Calculate stats from the data
        const presentCount = formattedData.filter(record =>
          record.status.toLowerCase().includes('present') || record.status.toLowerCase() === 'present'
        ).length;
        const absentCount = formattedData.filter(record =>
          record.status.toLowerCase().includes('absent') || record.status.toLowerCase() === 'absent'
        ).length;

        setStats({
          totalPresent: presentCount,
          totalAbsent: absentCount
        });
      } else {
        toast.error(response.data.message || 'Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      setSearchEmpId(employeeId);
    }
  }, [employeeId]);

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchAttendanceData();
  }, [searchName, searchEmpId, selectedRole, selectedMonth]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  // Format selected month for display
  const formatDateLabel = () => {
    const date = new Date(`${selectedMonth}-01`);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="container md:max-w-[79vw] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Attendance Record</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Search By Name</label>
          <input
            type="text"
            placeholder="Enter employee name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
          <input
            type="text"
            placeholder="Enter employee ID"
            value={searchEmpId}
            onChange={(e) => setSearchEmpId(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Roles</option>
            <option value="salesperson">Salesperson</option>
            <option value="telecaller">Telecaller</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="bg-[#1B504E] text-white px-6 py-2 rounded hover:bg-[#164641] transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1B504E] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.totalPresent}</div>
          <div className="text-sm">Total Days Present</div>
        </div>
        <div className="bg-[#1B504E] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.totalAbsent}</div>
          <div className="text-sm">Total Days Absent</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : attendanceData.length > 0 ? (
          <Table
            data={attendanceData}
            extraColumns={[
              {
                header: "Status",
                render: (row, index) => (
                  <span className={`text-sm px-2 py-1 rounded ${row.status.toLowerCase().includes('present') ? 'bg-green-100 text-green-800' :
                      row.status.toLowerCase().includes('absent') ? 'bg-red-100 text-red-800' :
                        row.status.toLowerCase().includes('leave') ? 'bg-yellow-100 text-yellow-800' :
                          row.status.toLowerCase().includes('late') ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {row.status}
                  </span>
                ),
              },
              {
                header: "Remarks",
                render: (row, index) => (
                  <span className="text-sm text-gray-600">{row.remarks}</span>
                ),
              },
            ]}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            {selectedMonth ? `No attendance records found for ${formatDateLabel()}` : 'Please select a month to view attendance records'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendanceRecord;