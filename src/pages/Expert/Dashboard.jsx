import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import Chart from 'react-apexcharts';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: { totalCases: 0, activeCases: 0, closedCases: 0 },
    chartData: { categories: [], series: [] },
    latestCases: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.experts.dashboard);
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching expert dashboard:', error);
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Chart configuration matching admin theme
  const weeklyLeadsOptions = {
    chart: {
      id: 'weekly-cases',
      toolbar: { show: false },
      fontFamily: 'Lato, sans-serif'
    },
    xaxis: {
      categories: dashboardData.chartData.categories || ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    },
    colors: ['#008FFB', '#FEB019'], // Blue for Closed, Orange for Assigned
    legend: {
      show: true,
      position: 'top',
      markers: {
        width: 12,
        height: 12,
        radius: 2
      }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };

  const weeklyLeadsSeries = dashboardData.chartData.series || [
    { name: 'Total Case Closed', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Total Assigned Case', data: [0, 0, 0, 0, 0, 0, 0] }
  ];

  // Stats cards configuration matching admin theme
  const stats = [
    {
      label: 'Total Case',
      value: dashboardData.stats.totalCases,
      bgColor: '#18B4A5', // Teal
      textColor: '#FFFFFF'
    },
    {
      label: 'Active Case',
      value: dashboardData.stats.activeCases,
      bgColor: '#5A8B8A', // Muted teal
      textColor: '#FFFFFF'
    },
    {
      label: 'Close Case',
      value: dashboardData.stats.closedCases,
      bgColor: '#7A9E9D', // Light teal/gray
      textColor: '#FFFFFF'
    }
  ];

  const handleUpdate = (caseId) => {
    navigate(`/expert/case/${caseId}/update`);
  };

  const handleHistory = (caseId) => {
    navigate(`/expert/case/${caseId}/history`);
  };

  const handleClose = (caseId) => {
    navigate(`/expert/case/${caseId}/close`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18B4A5] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-lato">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-lato bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards - 3 columns matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow flex items-center justify-center"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span
                  style={{
                    color: '#161A41C7',
                    fontFamily: 'Lato',
                    fontWeight: 700,
                    fontSize: '30.59px',
                    lineHeight: '100%'
                  }}
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: stat.textColor }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Leads Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Leads</h2>
        <Chart
          options={weeklyLeadsOptions}
          series={weeklyLeadsSeries}
          type="bar"
          height={300}
        />
      </div>

      {/* Latest Case Assigned Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Case Assigned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-medium text-gray-700">Case ID</th>
                <th className="p-3 text-left font-medium text-gray-700">Case No</th>
                <th className="p-3 text-left font-medium text-gray-700">Doctor</th>
                <th className="p-3 text-left font-medium text-gray-700">Assigned Date</th>
                <th className="p-3 text-left font-medium text-gray-700">Case Type</th>
                <th className="p-3 text-left font-medium text-gray-700">Next Date</th>
                <th className="p-3 text-left font-medium text-gray-700">Stage</th>
                <th className="p-3 text-left font-medium text-gray-700">Status</th>
                <th className="p-3 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.latestCases && dashboardData.latestCases.length > 0 ? (
                dashboardData.latestCases.map((caseItem, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-gray-700 font-medium">{caseItem.caseId}</td>
                    <td className="p-3 text-gray-700">{caseItem.caseNo || '-'}</td>
                    <td className="p-3 text-gray-700">{caseItem.doctor}</td>
                    <td className="p-3 text-gray-700">{caseItem.assignedDate}</td>
                    <td className="p-3 text-gray-700">{caseItem.caseType}</td>
                    <td className="p-3 text-gray-700">{caseItem.nextDate || '-'}</td>
                    <td className="p-3 text-gray-700">{caseItem.stage || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${caseItem.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                        caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(caseItem._id)}
                          className="bg-[#18B4A5] text-white px-3 py-1 rounded text-xs hover:bg-[#149f91] transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleHistory(caseItem._id)}
                          className="bg-[#5A8B8A] text-white px-3 py-1 rounded text-xs hover:bg-[#4a7574] transition-colors"
                        >
                          History
                        </button>
                        {caseItem.status !== 'Closed' && (
                          <button
                            onClick={() => handleClose(caseItem._id)}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg">No cases assigned yet</p>
                      <p className="text-sm mt-1">You don't have any cases assigned to you at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;