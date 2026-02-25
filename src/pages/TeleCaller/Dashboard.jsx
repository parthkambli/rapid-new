








import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Table from "../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../services/apiClient";
import { toast } from "react-toastify";

// Top Stat Box with Circle
const StatBox = ({ title, value, bg }) => (
  <div
    className="flex flex-col items-center justify-center text-white rounded-lg p-4 shadow-sm"
    style={{ backgroundColor: bg }}
  >
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
      <span
        style={{
          fontFamily: "Lato",
          fontWeight: 700,
          fontSize: "32.88px",
          lineHeight: "100%",
        }}
        className="text-[#18514E]"
      >
        {value}
      </span>
    </div>
    <p className="text-sm font-medium text-center">{title}</p>
  </div>
);

// Helper function to check if a date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const taskDate = new Date(dateString);
  const today = new Date();
  return taskDate.getDate() === today.getDate() &&
         taskDate.getMonth() === today.getMonth() &&
         taskDate.getFullYear() === today.getFullYear();
};

const TelecallerDashboard = () => {
  const [showAllFollowups, setShowAllFollowups] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for all the data
  const [tableData, setTableData] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [taskTableData, setTaskTableData] = useState([]); // New state for task table
  const [stats, setStats] = useState({
    callsMadeToday: 0,
    newEnquiries: 0,
    pendingFollowup: 0,
    convertedLeads: 0
  });
  const [chartSeries, setChartSeries] = useState([
    { name: "Calls Made", data: [0, 0, 0, 0, 0, 0, 0] },
    { name: "Doctors Converted", data: [0, 0, 0, 0, 0, 0, 0] }
  ]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [todaysFollowUps, setTodaysFollowUps] = useState([]); // New state for today's follow-ups

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all required data in parallel
      const [telecallerStatsResponse, weeklyCallsResponse, doctorsResponse, alertsResponse, quotationsResponse, tasksResponse, todayFollowUpsResponse] = await Promise.allSettled([
        apiClient.get(apiEndpoints.tasks.telecallerStats),
        apiClient.get(apiEndpoints.tasks.weeklyCallsReport), // Fetch weekly calls report data
        apiClient.get(apiEndpoints.doctors.myDoctors), // Get assigned doctors
        apiClient.get(apiEndpoints.alerts.myAlerts), // Get alerts for follow-ups
        apiClient.get(apiEndpoints.quotations.myQuotations), // Get quotations
        apiClient.get(apiEndpoints.tasks.getOtherTask), // Get assigned tasks from admin
        apiClient.get(apiEndpoints.doctors.followUps.today), // Get today's follow-ups
      ]);

      // Handle telecaller dashboard stats
      if (telecallerStatsResponse.status === 'fulfilled' && telecallerStatsResponse.value.data.success) {
        const statsData = telecallerStatsResponse.value.data.data;
        setStats({
          callsMadeToday: statsData.callsMadeToday || 0,
          newEnquiries: statsData.newEnquiries || 0,
          pendingFollowup: statsData.pendingFollowup || 0,
          convertedLeads: statsData.convertedLeads || 0
        });
      }

      // Handle weekly calls report data
      if (weeklyCallsResponse.status === 'fulfilled' && weeklyCallsResponse.value.data.success) {
        const weeklyData = weeklyCallsResponse.value.data.data;
        setChartSeries([
          { name: "Calls Made", data: weeklyData.callsMade || [0, 0, 0, 0, 0, 0, 0] },
          { name: "Doctors Converted", data: weeklyData.callsConverted || [0, 0, 0, 0, 0, 0, 0] }
        ]);
      }

      // Handle doctors data (for calling list)
      if (doctorsResponse.status === 'fulfilled' && doctorsResponse.value.data.success) {
        const doctors = doctorsResponse.value.data.data;
        const tableData = doctors.map(doctor => ({
          "DR Name": doctor.name || doctor.fullName || doctor.doctorName || "N/A",
          "Hospital Name": doctor.hospitalName || "N/A",
          Contact: doctor.mobile || doctor.phone || "N/A",
          Followups: doctor.followupStatus || "No follow-up",
          Date: new Date(doctor.createdAt).toLocaleDateString() || "N/A",
        }));
        setTableData(tableData);
      }

      // Handle alerts data (for follow-ups)
      if (alertsResponse.status === 'fulfilled' && alertsResponse.value.data.success) {
        const alerts = alertsResponse.value.data.data;
        const followups = alerts
          .filter(alert => alert.status === 'pending' || alert.status === 'active' || alert.status === 'sent')
          .map(alert => ({
            name: alert.title || alert.description || "Task",
            time: alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Time",
          }));
        setFollowups(followups);
      }

      // Handle today's follow-ups response
      if (todayFollowUpsResponse.status === 'fulfilled' && todayFollowUpsResponse.value.data.success) {
        const todayFollowUpsData = todayFollowUpsResponse.value.data.data || [];
        setTodaysFollowUps(todayFollowUpsData);
      }

      // Handle tasks data for today's tasks - these are tasks assigned by admin
      if (tasksResponse.status === 'fulfilled' && tasksResponse.value.data.success) {
        const tasks = tasksResponse.value.data.data;

        // Get today's quotations to combine with today's admin tasks
        let todayQuotations = [];
        if (quotationsResponse.status === 'fulfilled' && quotationsResponse.value.data.success) {
          const quotations = quotationsResponse.value.data.data;
          todayQuotations = quotations
            .filter(quote =>
              (quote.status === 'pending' || quote.status === 'in-progress') &&
              isToday(quote.createdAt || quote.updatedAt)
            )
            .map(quote => `Follow up on quotation for ${quote.doctorName || 'client'}`);
        }

        const filteredTasks = tasks.filter(task =>
          (task.status === 'pending' || task.status === 'active' || task.status === 'assigned' || task.status === 'in_progress') &&
          isToday(task.scheduledDate || task.createdAt)
        );

        // Format tasks for the list view
        const adminTasks = filteredTasks.map(task => {
          // Extract telecaller data if available
          const telecallerData = task.telecallerData || {};
          const dailyTarget = telecallerData.dailyCallTarget ? ` (Target: ${telecallerData.dailyCallTarget})` : '';
          // const deadline = task.scheduledDate ? ` | Deadline: ${new Date(task.scheduledDate).toLocaleDateString()}` : '';
          const deadline = task.scheduledDate ? ` | Deadline: ${new Date(task.scheduledDate).toLocaleDateString('en-GB')}` : '';

          // return `${task.title || task.taskName || "Task"}${dailyTarget}${deadline} - ${task.description || "No description"}`;
          // return `${"Task"} ${dailyTarget}${deadline} - ${task.description || "No description"}`;
          return (
  <div>
    <span style={{ fontWeight: 800 }}>Task</span>{" "}
    <span style={{ fontWeight: 600 }}>
      {dailyTarget}
      {deadline} - {task.description || "No description"}
    </span>
  </div>
);

        });

        setTodaysTasks([...adminTasks, ...todayQuotations]);

        // Format tasks for the table view (all assigned tasks, not just today's)
        const allFilteredTasks = tasks.filter(task =>
          task.status === 'pending' || task.status === 'active' || task.status === 'assigned' || task.status === 'in_progress'
        );

        const taskTableData = allFilteredTasks.map(task => {
          const telecallerData = task.telecallerData || {};
          return {
            "Task Title": task.title || task.taskName || "N/A",
            // "Description": task.description || "No description",
            "Priority": task.priority || "medium",
            "Deadline": task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString('en-GB') : "N/A",
            "Daily Target": telecallerData.dailyCallTarget || "N/A",
            "Status": task.status || "pending"
          };
        });
        setTaskTableData(taskTableData);
      } else {
        // If tasks response failed, at least set today's quotations if available
        let todayQuotations = [];
        if (quotationsResponse.status === 'fulfilled' && quotationsResponse.value.data.success) {
          const quotations = quotationsResponse.value.data.data;
          todayQuotations = quotations
            .filter(quote =>
              (quote.status === 'pending' || quote.status === 'in-progress') &&
              isToday(quote.createdAt || quote.updatedAt)
            )
            .map(quote => `Follow up on quotation for ${quote.doctorName || 'client'}`);
        }
        setTodaysTasks(todayQuotations);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Using fallback data.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    chart: {
      stacked: true,
      stackType: "100%",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    colors: ["#FEB019", "#00E396"],
    legend: {
      position: "right",
      offsetY: 40,
      markers: {
        radius: 12,
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: true,
    },
  };

  if (loading) {
    return (
      <div className="w-full bg-white p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 min-h-screen ">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Telecaller Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatBox title="Calls Made Today" value={stats.callsMadeToday} bg="#18514E" />
        <StatBox title="New Enquiries Added" value={stats.newEnquiries} bg="#257D7A" />
        <StatBox title="Pending Followup" value={stats.pendingFollowup} bg="#35B2AE" />
        <StatBox title="Converted Leads" value={stats.convertedLeads} bg="#42E2DC" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Table */}
        <div className="lg:col-span-2 bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recently Added Doctors</h2>
          <Table data={tableData} />
        </div>

        {/* Right side: Today's Follow-ups */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Today's Follow Ups</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(showAllFollowups ? todaysFollowUps : todaysFollowUps.slice(0, 3)).flatMap((doctor, idx) => {
              // Show all follow-ups for the doctor, not just the latest one
              const allFollowUps = doctor.followUps || [];
              
              if (allFollowUps.length === 0) {
                // If no follow-ups, show the doctor with a placeholder
                return [
                  <div
                    key={`${idx}-0`}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{doctor.doctorName || doctor.fullName || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{doctor.hospitalName || 'N/A'}</p>
                      <p className="text-xs text-gray-400">No follow-up scheduled</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {doctor.nextFollowUpDate ? new Date(doctor.nextFollowUpDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Follow-up
                      </span>
                    </div>
                  </div>
                ];
              } else {
                // Show each follow-up as a separate entry
                return allFollowUps.map((followUp, followUpIdx) => (
                  <div
                    key={`${idx}-${followUpIdx}`}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{doctor.doctorName || doctor.fullName || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{doctor.hospitalName || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{followUp.notes || followUp.followupNote || 'No note'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date()
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {/* {followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date()
                          ? 'Pending'
                          : 'Completed'} */}
                      </span>
                    </div>
                  </div>
                ));
              }
            })}
          </div>
          {todaysFollowUps.length > 3 && (
            <button
              className="mt-3 text-sm text-[#18514E] font-medium"
              onClick={() => setShowAllFollowups(!showAllFollowups)}
            >
              {showAllFollowups ? "View Less" : "View More"}
            </button>
          )}
          {todaysFollowUps.length === 0 && (
            <p className="text-gray-500 text-center py-4">No follow-ups scheduled for today</p>
          )}
        </div>
      </div>

      {/* Tasks Table - Always Show */}
      <div className="bg-white border rounded-lg p-4 shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Assigned Tasks</h2>
        <Table data={taskTableData} />
      </div>

      {/* Charts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly Calls Report</h2>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task, idx) => (
                <li
                  key={idx}
                  className="p-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  {task}
                </li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500 text-center">
                No tasks for today
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TelecallerDashboard;














