// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Chart from "react-apexcharts";
// import apiClient, { apiEndpoints } from "../../services/apiClient";
// import { useAuth } from "../../hooks/useAuth";
// import { toast } from "react-toastify";

// const SalesPersonDashboard = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // State for data (structure matches the original dummy data structure)
//   const [data, setData] = useState({
//     totalVisitedDr: 0,
//     close: 0,
//     hot: 0,
//     followup: 0,
//     tasks: 0, // NEW: Pending tasks count
//     dailyTarget: 0, // Assigned Daily Target
//     daily: { completed: 0, pending: 0, revisited: 0 },
//     monthlyTarget: 0,
//     monthly: { closed: 0, pending: 0, completed: "0%" },
//     yearly: { total: 0, completed: 0, pending: 0 },
//   });

//   // State for today's tasks
//   const [allTodaysPendingTasks, setAllTodaysPendingTasks] = useState([]);
//   const [todaysTasks, setTodaysTasks] = useState([]);
//   const [loadingTasks, setLoadingTasks] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 5;

//   const [tableData, setTableData] = useState([]);
//   const [chartSeries, setChartSeries] = useState([
//     { name: "Visits Made", data: [] },
//     { name: "Visits Converted", data: [] },
//   ]);
//   const [chartCategories, setChartCategories] = useState([]);

//   // Filter states for table
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     page: 1,
//     sortBy: "To Date" // Placeholder
//   });

//   const [pagination, setPagination] = useState({ pages: 1 });

//   useEffect(() => {
//     if (user) {
//       setCurrentPage(1); // Reset to first page when user changes
//       fetchDashboardData();
//     }
//   }, [user]);

//   // Re-fetch data when currentPage changes to update the paginated tasks
//   useEffect(() => {
//     if (user && allTodaysPendingTasks.length > 0) {
//       const startIndex = (currentPage - 1) * tasksPerPage;
//       const paginatedTodaysTasks = allTodaysPendingTasks.slice(startIndex, startIndex + tasksPerPage);
//       setTodaysTasks(paginatedTodaysTasks);
//     }
//   }, [currentPage, allTodaysPendingTasks, user, tasksPerPage]);

//   // Refetch doctors when pagination changes (Strictly pagination only for dashboard list)
//   useEffect(() => {
//     if (user && pagination.page) {
//       fetchDoctorsOnly();
//     }
//   }, [pagination.page]);

//   const fetchDashboardData = async () => {
//     try {
//       // 1. Fetch Stats (Updated to include tasks)
//       const statsRes = await apiClient.get(apiEndpoints.salesmanTasks.dashboardStats, {
//         params: { employeeId: user?.employee }
//       });
//       const stats = statsRes.data.success ? statsRes.data.data : {};

//       // 2. Fetch Targets
//       const targetRes = await apiClient.get(apiEndpoints.salesmanDashboard.target);
//       const targets = targetRes.data.success ? targetRes.data.data : {};

//       // 3. Fetch Weekly Performance
//       const perfRes = await apiClient.get(apiEndpoints.salesmanDashboard.weeklyPerformance);
//       const perf = perfRes.data.success ? perfRes.data.data : { categories: [], series: [] };

//       // 4. Fetch Doctors (Initial)
//       const doctorsRes = await apiClient.get(apiEndpoints.salesmanDashboard.doctors, {
//         params: { page: 1, limit: 10 }
//       });
//       const docs = doctorsRes.data.success ? doctorsRes.data.data : [];
//       const docPagination = doctorsRes.data.success ? doctorsRes.data.pagination : { pages: 1, current: 1 };

//       // 5. Fetch Today's Tasks
//       const tasksRes = await apiClient.get(apiEndpoints.salesmanTasks.getTasks(user?.employee));
//       const allTasks = tasksRes.data.success ? tasksRes.data : { tasks: [] };

//       // Filter for today's pending tasks
//       const today = new Date();
//       const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

//       const todaysPendingTasks = allTasks.tasks?.filter(task => {
//         const taskDate = new Date(task.createdAt);
//         const taskDateString = taskDate.toISOString().split('T')[0];
//         return taskDateString === todayString && task.status === 'pending';
//       }) || [];

//       // Calculate pending tasks count if not provided in stats
//       const pendingTasksCount = stats.tasks || (allTasks.tasks ? allTasks.tasks.filter(task => task.status === 'pending').length : 0);

//       // Store all today's tasks but display only current page
//       const allTodaysPendingTasksArray = todaysPendingTasks;
//       setAllTodaysPendingTasks(allTodaysPendingTasksArray);

//       const startIndex = (currentPage - 1) * tasksPerPage;
//       const paginatedTodaysTasks = allTodaysPendingTasksArray.slice(startIndex, startIndex + tasksPerPage);

//       // Update State
//       setData({
//         totalVisitedDr: stats.total || 0,
//         close: stats.closed || 0, // Using cold as close
//         hot: stats.hot || 0,
//         followup: stats.followUp || 0,
//         tasks: pendingTasksCount, // NEW: Pending tasks count
//         dailyTarget: targets.dailyTarget || 0,
//         daily: {
//           completed: targets.daily?.completed || 0,
//           pending: targets.daily?.pending || 0,
//           revisited: targets.daily?.revisited || 0
//         },
//         monthlyTarget: targets.monthlyTarget || 0,
//         monthly: {
//           closed: targets.monthly?.closed || 0,
//           pending: targets.monthly?.pending || 0,
//           completed: targets.monthly?.completedPercent || "0%"
//         },
//         yearly: {
//           total: targets.yearly?.total || 0,
//           completed: targets.yearly?.completed || 0,
//           pending: targets.yearly?.pending || 0
//         },
//       });

//       setTodaysTasks(paginatedTodaysTasks);
//       setTableData(docs);
//       setPagination({ page: docPagination.current, pages: docPagination.pages });

//       if (perf.series && perf.series.length > 0) {
//         setChartSeries(perf.series);
//         setChartCategories(perf.categories);
//       }

//     } catch (error) {
//       console.error("Error loading dashboard:", error);
//       // toast.error("Failed to load dashboard data");
//     }
//   };

//   const fetchDoctorsOnly = async () => {
//     try {
//       const doctorsRes = await apiClient.get(apiEndpoints.salesmanDashboard.doctors, {
//         params: {
//           page: pagination.page,
//           limit: 10
//         }
//       });
//       if (doctorsRes.data.success) {
//         setTableData(doctorsRes.data.data);
//         setPagination(prev => ({ ...prev, pages: doctorsRes.data.pagination.pages }));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   // Handle Date Filter Change (Only for visual date pickers, logic removed from doc list specific query as per strict requirement)
//   const handleDateChange = (e, type) => {
//     setFilters(prev => ({ ...prev, [type]: e.target.value }));
//   };


// // Helper for circle box with navigation
//   const CircleBox = ({ value, label, bg, status }) => (
//     <div
//       className="flex flex-col items-center cursor-pointer"
//       onClick={() => {
//         if (label === "Tasks") {
//           navigate("/salesman/tasks"); // Navigate to tasks page
//         } else {
//           navigate("/sales/target-status", { state: { tab: status || label } });
//         }
//       }}
//     >
//       <div
//         className="w-20 h-20 flex items-center justify-center rounded-full shadow-[0_4.91px_4px_rgba(0,0,0,0.1)] text-xl font-bold"
//         style={{ backgroundColor: bg }}
//       >
//         {value}
//       </div>
//       <p className="text-sm text-gray-700 mt-2 text-center">{label}</p>
//     </div>
//   );

//   // Section component for Targets
//   const TargetSection = ({ title, targetValue, items }) => (
//     <div className="mb-8">
//       {/* Heading Centered */}
//       <div className="flex items-center justify-center border-t border-[#DFDFDF] pb-2 mb-4 pt-4">
//         <h2 className="text-lg font-semibold flex items-center gap-3">
//           {title} -{" "}
//           {targetValue !== null && (
//             <span className="bg-[#216267] text-white px-4 py-1 rounded-lg font-bold">
//               {targetValue}
//             </span>
//           )}
//         </h2>
//       </div>

//       {/* Circles with equal spacing like top stats */}
// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center px-6">
//         {items.map((item, idx) => (
//           <CircleBox
//             key={idx}
//             value={item.value}
//             label={item.label}
//             bg="#EEFFFF"
//             status={item.label === "Pending" ? "Pending" : item.label === "Completed Visit" ? "Confirmed" : "Approved"}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   // === CHART CONFIG WITH DYNAMIC DATA ===
//   const chartOptions = {
//     series: chartSeries,
//     chart: {
//       type: "bar",
//       height: 350,
//       stacked: true,
//       toolbar: { show: true },
//       zoom: { enabled: true },
//       fontFamily: "Lato, sans-serif",
//     },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           legend: { position: "bottom", offsetX: -10, offsetY: 0 },
//         },
//       },
//     ],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         borderRadius: 10,
//         borderRadiusApplication: "end",
//         borderRadiusWhenStacked: "last",
//         dataLabels: {
//           total: {
//             enabled: true,
//             style: { fontSize: "13px", fontWeight: 900, color: "#fff" },
//             offsetY: -25,
//           },
//         },
//       },
//     },
//     xaxis: {
//       type: "category", // Changed from datetime as we might send date strings or day names
//       categories: chartCategories.length > 0 ? chartCategories : [
//         "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
//       ],
//       labels: { style: { fontSize: "12px" } },
//     },
//     legend: {
//       position: "right",
//       offsetY: 40,
//       markers: { radius: 12 },
//     },
//     fill: { opacity: 1 },
//     colors: ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"],
//     tooltip: { y: { formatter: (val) => val + " visits" } },
//   };


//   return (
//     <div className="w-full bg-white p-6 min-h-screen ">
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

//       {/* Top Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
//         <CircleBox value={data.totalVisitedDr} label="Total Visited DR." bg="#FFC888" />
//         <CircleBox value={data.close} label="Close" bg="#A4FF90" />
//         <CircleBox value={data.hot} label="Hot" bg="#FF7777" />
//         <CircleBox value={data.followup} label="Followup" bg="#7BF8FF" />
//         <CircleBox value={data.cold}     label="Cold"     bg="#E5E7EB"/>
//         <CircleBox value={data.tasks} label="Tasks" bg="#D1C4E9" /> {/* NEW: Tasks circle */}
//       </div>

//       {/* Main Grid for Table & Targets */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Left: Table - KEEPING UI EXACTLY SAME */}
//         <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-5 border flex flex-col">
//           <div className="flex flex-wrap gap-3 mb-4 text-sm">
//             <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
//               <span className="text-gray-600">Sort by Date</span>
//               <input
//                 type="date"
//                 className="bg-transparent outline-none text-gray-700 w-32"
//                 onChange={(e) => handleDateChange(e, 'endDate')}
//                 placeholder="To Date"
//               />
//             </div>
//             <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
//               <span className="text-gray-600">From Date</span>
//               <input
//                 type="date"
//                 className="bg-transparent outline-none text-gray-700"
//                 onChange={(e) => handleDateChange(e, 'startDate')}
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto flex-1">
//             <table className="w-full text-sm text-left border-t">
//               <thead className="text-xs text-gray-500 uppercase bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2">DR Name</th>
//                   <th className="px-4 py-2">Hospital Name</th>
//                   <th className="px-4 py-2">Contact</th>
//                   <th className="px-4 py-2">Hospital Address</th>
//                   <th className="px-4 py-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.length > 0 ? (
//                   tableData.map((row, i) => (
//                     <tr key={i} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-2 font-medium">{row.dr}</td>
//                       <td className="px-4 py-2">{row.hospital}</td>
//                       <td className="px-4 py-2">{row.contact}</td>
//                       <td className="px-4 py-2">{row.address}</td>
//                       <td className="px-4 py-2 text-gray-500">{row.date}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No doctors found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination & View All Button Row */}
//           <div className="flex items-center justify-between mt-4 pt-2 border-t">
//             {/* Pagination Controls */}
//             <div className="flex gap-2">
//               <button
//                 disabled={pagination.page <= 1}
//                 onClick={() => setPagination(p => ({ ...p, page: (p.page || 1) - 1 }))}
//                 className="px-3 py-1 text-xs border rounded hover:bg-gray-100 disabled:opacity-50"
//               >Prev</button>
//               <span className="text-xs py-1 text-gray-500">Page {pagination.page || 1} of {pagination.pages || 1}</span>
//               <button
//                 disabled={pagination.page >= (pagination.pages || 1)}
//                 onClick={() => setPagination(p => ({ ...p, page: (p.page || 1) + 1 }))}
//                 className="px-3 py-1 text-xs border rounded hover:bg-gray-100 disabled:opacity-50"
//               >Next</button>
//             </div>

//             {/* View All Button */}
//             <button
//               onClick={() => navigate('/sales/all-doctors')}
//               className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
//             >
//               View All Doctors →
//             </button>
//           </div>
//         </div>

//         {/* Right Side: Targets and Tasks */}
//         <div className="space-y-6">
//           {/* Today's Tasks Section */}
//           <div className="bg-white rounded-lg shadow-sm p-5 border">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Today's Tasks</h3>
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                 {todaysTasks.length}
//               </span>
//             </div>

//             {todaysTasks.length > 0 ? (
//               <div className="space-y-3">
//                 {todaysTasks.map((task, index) => (
//                   <div key={task._id || index} className="border-l-4 border-blue-500 pl-3 py-1">
//                     <p className="text-sm text-gray-700 truncate">{task.title}</p>
//                     <p className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

//                     {/* Display task images if available */}
//                     {task.images && task.images.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-1">
//                         {task.images.slice(0, 3).map((img, imgIdx) => {
//                           // Construct image URL properly using the API base URL from environment
//                           const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Default fallback
//                           const imageUrl = img.startsWith('http') ? img : `${API_BASE_URL}${img}`;

//                           return (
//                             <a
//                               key={imgIdx}
//                               href={imageUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="inline-block"
//                             >
//                               <img
//                                 src={imageUrl}
//                                 className="w-10 h-10 object-cover rounded border cursor-pointer hover:opacity-90"
//                                 alt={`Task ${index+1} - Image ${imgIdx+1}`}
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   e.target.src = 'https://via.placeholder.com/40x40?text=Img';
//                                 }}
//                               />
//                             </a>
//                           );
//                         })}
//                         {task.images.length > 3 && (
//                           <span className="text-xs text-gray-500">+{task.images.length - 3} more</span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">No tasks for today</p>
//             )}

//             {/* Pagination Controls */}
//             {allTodaysPendingTasks.length > 0 && (
//               <div className="mt-4 flex items-center justify-between">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 text-sm rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                 >
//                   Previous
//                 </button>

//                 <span className="text-sm text-gray-600">
//                   Page {currentPage} of {Math.ceil(allTodaysPendingTasks.length / tasksPerPage)}
//                 </span>

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(allTodaysPendingTasks.length / tasksPerPage)))}
//                   disabled={currentPage >= Math.ceil(allTodaysPendingTasks.length / tasksPerPage)}
//                   className={`px-3 py-1 text-sm rounded ${currentPage >= Math.ceil(allTodaysPendingTasks.length / tasksPerPage) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}

//             {/* View All Tasks Button */}
//             <button
//               onClick={() => navigate('/sales/tasks')}
//               className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
//             >
//               View All Tasks →
//             </button>
//           </div>

//           {/* Targets Section */}
//           <div>
//             {/* Daily Target */}
//             <TargetSection
//               title="Daily Target"
//               targetValue={data.dailyTarget}
//               items={[
//                 { value: data.daily.completed, label: "Completed Visit" },
//                 { value: data.daily.pending, label: "Pending" },
//                 { value: data.daily.revisited, label: "Re-Visited" },
//               ]}
//             />

//             {/* Monthly Target */}
//             <TargetSection
//               title="Monthly Target"
//               targetValue={data.monthlyTarget}
//               items={[
//                 { value: data.monthly.closed, label: "Closed" },
//                 { value: data.monthly.pending, label: "Pending" },
//                 { value: data.monthly.completed, label: "Completed" },
//               ]}
//             />

//             {/* Yearly Target */}
//             <TargetSection
//               title="Yearly Target"
//               targetValue={null}
//               items={[
//                 { value: data.yearly.total, label: "Total Target" },
//                 { value: data.yearly.completed, label: "Completed" },
//                 { value: data.yearly.pending, label: "Pending" },
//               ]}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Weekly Performance Chart */}
//       <div className="mt-6 bg-white rounded-lg shadow-sm p-5 border">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
//         <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
//       </div>
//     </div>
//   );
// };

// export default SalesPersonDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import apiClient, { apiEndpoints } from "../../services/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const SalesPersonDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState({
    totalVisitedDr: 0,
    close: 0,
    hot: 0,
    followup: 0,
    cold: 0,
    tasks: 0,
    dailyTarget: 0,
    daily: { completed: 0, pending: 0, revisited: 0 },
    monthlyTarget: 0,
    monthly: { closed: 0, pending: 0, completed: "0%" },
    yearly: { total: 0, completed: 0, pending: 0 },
  });

  const [allTodaysPendingTasks, setAllTodaysPendingTasks] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [tableData, setTableData] = useState([]);
  const [chartSeries, setChartSeries] = useState([
    { name: "Visits Made", data: [] },
    { name: "Visits Converted", data: [] },
  ]);
  const [chartCategories, setChartCategories] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    page: 1,
    sortBy: "To Date",
  });

  const [pagination, setPagination] = useState({ pages: 1 });

  useEffect(() => {
    if (user) {
      setCurrentPage(1);
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (user && allTodaysPendingTasks.length > 0) {
      const startIndex = (currentPage - 1) * tasksPerPage;
      setTodaysTasks(allTodaysPendingTasks.slice(startIndex, startIndex + tasksPerPage));
    }
  }, [currentPage, allTodaysPendingTasks]);

  useEffect(() => {
    if (user && pagination.page) {
      fetchDoctorsOnly();
    }
  }, [pagination.page, user]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await apiClient.get(apiEndpoints.salesmanTasks.dashboardStats, {
        params: { employeeId: user?.employee },
      });
      const stats = statsRes.data.success ? statsRes.data.data : {};

      const targetRes = await apiClient.get(apiEndpoints.salesmanDashboard.target);
      const targets = targetRes.data.success ? targetRes.data.data : {};

      const perfRes = await apiClient.get(apiEndpoints.salesmanDashboard.weeklyPerformance);
      const perf = perfRes.data.success ? perfRes.data.data : { categories: [], series: [] };

      const doctorsRes = await apiClient.get(apiEndpoints.salesmanDashboard.doctors, {
        params: { page: 1, limit: 10 },
      });
      const docs = doctorsRes.data.success ? doctorsRes.data.data : [];
      const docPagination = doctorsRes.data.success ? doctorsRes.data.pagination : { pages: 1, current: 1 };

      const tasksRes = await apiClient.get(apiEndpoints.salesmanTasks.getTasks(user?.employee));
      const allTasks = tasksRes.data.success ? tasksRes.data : { tasks: [] };

      const today = new Date();
      const todayString = today.toISOString().split("T")[0];

      const todaysPendingTasks =
        allTasks.tasks?.filter((task) => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toISOString().split("T")[0] === todayString && task.status === "pending";
        }) || [];

      const pendingTasksCount =
        stats.tasks || allTasks.tasks?.filter((t) => t.status === "pending").length || 0;

      setAllTodaysPendingTasks(todaysPendingTasks);

      // Calculate cold (fallback if backend doesn't send it)
      const calculatedCold =
        stats.cold ??
        Math.max(
          0,
          (stats.total || 0) -
            ((stats.closed || 0) + (stats.hot || 0) + (stats.followUp || 0))
        );

      setData({
        totalVisitedDr: stats.total || 0,
        close: stats.closed || 0,
        hot: stats.hot || 0,
        followup: stats.followUp || 0,
        cold: calculatedCold,
        tasks: pendingTasksCount,
        dailyTarget: targets.dailyTarget || 0,
        daily: {
          completed: targets.daily?.completed || 0,
          pending: targets.daily?.pending || 0,
          revisited: targets.daily?.revisited || 0,
        },
        monthlyTarget: targets.monthlyTarget || 0,
        monthly: {
          closed: targets.monthly?.closed || 0,
          pending: targets.monthly?.pending || 0,
          completed: targets.monthly?.completedPercent || "0%",
        },
        yearly: {
          total: targets.yearly?.total || 0,
          completed: targets.yearly?.completed || 0,
          pending: targets.yearly?.pending || 0,
        },
      });

      setTodaysTasks(todaysPendingTasks.slice(0, tasksPerPage));
      setTableData(docs);
      setPagination({ page: docPagination.current, pages: docPagination.pages });

      if (perf.series?.length) {
        setChartSeries(perf.series);
        setChartCategories(perf.categories);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const fetchDoctorsOnly = async () => {
    try {
      const res = await apiClient.get(apiEndpoints.salesmanDashboard.doctors, {
        params: { page: pagination.page, limit: 10 },
      });
      if (res.data.success) {
        setTableData(res.data.data);
        setPagination((prev) => ({ ...prev, pages: res.data.pagination.pages }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = (e, type) => {
    setFilters((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const CircleBox = ({ value, label, bg, status }) => (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => {
        if (label === "Tasks") {
          navigate("/sales/tasks"); // Navigate to tasks page
        } else {
          navigate("/sales/dashboard", { state: { tab: status } });
        }
      }}
    >
      <div
        className="w-20 h-20 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-xl font-bold text-gray-800"
        style={{ backgroundColor: bg }}
      >
        {value}
      </div>
      <p className="text-xs sm:text-sm text-gray-700 mt-2 text-center font-medium">{label}</p>
    </div>
  );

  // ──────────────────────────────────────────────
  //  MISSING COMPONENT – ADD THIS BLOCK
  // ──────────────────────────────────────────────
  const TargetSection = ({ title, targetValue, items }) => (
    <div className="mb-8">
      <div className="flex items-center justify-center border-t border-[#DFDFDF] pb-2 mb-4 pt-4">
        <h2 className="text-lg font-semibold flex items-center gap-3">
          {title} -{" "}
          {targetValue !== null && (
            <span className="bg-[#216267] text-white px-4 py-1 rounded-lg font-bold">
              {targetValue}
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center px-6">
        {items.map((item, idx) => (
          <CircleBox
            key={idx}
            value={item.value}
            label={item.label}
            bg="#EEFFFF"
            status={
              item.label === "Pending"
                ? "Pending"
                : item.label === "Completed Visit"
                ? "Confirmed"
                : "Approved"
            }
          />
        ))}
      </div>
    </div>
  );
  // ──────────────────────────────────────────────

  const chartOptions = {
    series: chartSeries,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
      fontFamily: "Lato, sans-serif",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { position: "bottom", offsetX: -10, offsetY: 0 },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: { fontSize: "13px", fontWeight: 900, color: "#fff" },
            offsetY: -25,
          },
        },
      },
    },
    xaxis: {
      type: "category",
      categories:
        chartCategories.length > 0
          ? chartCategories
          : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { fontSize: "12px" } },
    },
    legend: {
      position: "right",
      offsetY: 40,
      markers: { radius: 12 },
    },
    fill: { opacity: 1 },
    colors: ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"],
    tooltip: { y: { formatter: (val) => val + " visits" } },
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Top Stats - better single-line layout */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 mb-8 justify-items-center">
        <CircleBox value={data.totalVisitedDr} label="Total Visited DR." bg="#FFC888" />
        <CircleBox value={data.close} label="Close" bg="#A4FF90" status="Close" />
        <CircleBox value={data.hot} label="Hot" bg="#FF7777" status="Hot" />
        <CircleBox value={data.followup} label="Followup" bg="#7BF8FF" status="Followup" />
        <CircleBox value={data.cold} label="Cold" bg="#E5E7EB" status="Cold" />
        <CircleBox value={data.tasks} label="Tasks" bg="#D1C4E9" />
      </div>

      {/* Rest of dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-5 border flex flex-col">
          {/* Table content */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            {/* date filters */}
            <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
              <span className="text-gray-600">Sort by Date</span>
              <input
                type="date"
                className="bg-transparent outline-none text-gray-700 w-32"
                onChange={(e) => handleDateChange(e, "endDate")}
                placeholder="To Date"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
              <span className="text-gray-600">From Date</span>
              <input
                type="date"
                className="bg-transparent outline-none text-gray-700"
                onChange={(e) => handleDateChange(e, "startDate")}
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left border-t">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">DR Name</th>
                  <th className="px-4 py-2">Hospital Name</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Hospital Address</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{row.dr}</td>
                      <td className="px-4 py-2">{row.hospital}</td>
                      <td className="px-4 py-2">{row.contact}</td>
                      <td className="px-4 py-2">{row.address}</td>
                      <td className="px-4 py-2 text-gray-500">{row.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-2 border-t">
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: (p.page || 1) - 1 }))}
                className="px-3 py-1 text-xs border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs py-1 text-gray-500">
                Page {pagination.page || 1} of {pagination.pages || 1}
              </span>
              <button
                disabled={pagination.page >= (pagination.pages || 1)}
                onClick={() => setPagination((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                className="px-3 py-1 text-xs border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <button
              onClick={() => navigate("/sales/all-doctors")}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
            >
              View All Doctors →
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-5 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Tasks</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {todaysTasks.length}
              </span>
            </div>

            {/* ... rest of tasks section unchanged ... */}
          </div>

          {/* Targets */}
          <div>
            <TargetSection
              title="Daily Target"
              targetValue={data.dailyTarget}
              items={[
                { value: data.daily.completed, label: "Completed Visit" },
                { value: data.daily.pending, label: "Pending" },
                { value: data.daily.revisited, label: "Re-Visited" },
              ]}
            />

            <TargetSection
              title="Monthly Target"
              targetValue={data.monthlyTarget}
              items={[
                { value: data.monthly.closed, label: "Closed" },
                { value: data.monthly.pending, label: "Pending" },
                { value: data.monthly.completed, label: "Completed" },
              ]}
            />

            <TargetSection
              title="Yearly Target"
              targetValue={null}
              items={[
                { value: data.yearly.total, label: "Total Target" },
                { value: data.yearly.completed, label: "Completed" },
                { value: data.yearly.pending, label: "Pending" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm p-5 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </div>
    </div>
  );
};

export default SalesPersonDashboard;