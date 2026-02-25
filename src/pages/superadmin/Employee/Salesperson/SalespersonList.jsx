
import React, { useState, useEffect } from 'react';
import Table from '../../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import { toast } from 'react-toastify';
import TaskModal from './TaskModal';

const SalesmanList = () => {
  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const todayKey = new Date().toISOString().split('T')[0];


  // Add Task Modal Open
  const openAddTaskModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setSelectedTask(null); // new task
    setModalOpen(true);
  };






  // SalesmanList.js mein openViewTasksModal ko update karo:

  const openViewTasksModal = async (employee) => {
    try {
      console.log("Opening tasks modal for:", employee.fullName);

      // Pehle check karo ki tasks available hain ya nahi
      if (employee.tasks && employee.tasks.length > 0) {
        console.log("✅ Using local tasks:", employee.tasks);
        setSelectedEmployee(employee);
        setSelectedTask(employee.tasks);
        setIsEditMode(false);
        setModalOpen(true);
        return;
      }

      // Agar local mein nahi hai, to backend se fetch karo
      console.log("🔄 Fetching tasks from API...");
      const res = await apiClient.get(`/salesman-targets/tasks/${employee._id}`, {
        params: {
          year: currentYear,
          month: currentMonth
        }
      });

      console.log("📦 API Tasks response:", res.data);

      if (res.data.success && res.data.tasks && res.data.tasks.length > 0) {
        // Data ko update karo
        const updatedEmployee = {
          ...employee,
          tasks: res.data.tasks
        };

        // Frontend data mein bhi update karo
        setData(prev => prev.map(emp =>
          emp._id === employee._id
            ? { ...emp, tasks: res.data.tasks }
            : emp
        ));

        setSelectedEmployee(updatedEmployee);
        setSelectedTask(res.data.tasks);
        setIsEditMode(false);
        setModalOpen(true);
        toast.success(`Loaded ${res.data.tasks.length} tasks`);
      } else {
        toast.info("No tasks found for this salesman");
      }
    } catch (err) {
      console.error("❌ Task load error:", err);
      toast.error("Failed to load tasks");
    }
  };

  // Function to open task summary modal
  const openTaskSummaryModal = async (employee) => {
    try {
      console.log("Opening task summary for:", employee.fullName);

      // Fetch task summary data
      const res = await apiClient.get(`/salesman-targets/task-summary/${employee._id}`, {
        params: {
          year: currentYear,
          month: currentMonth
        }
      });

      if (res.data.success) {
        // Create a summary object with task statistics
        const summaryData = {
          employee: employee,
          totalTasks: res.data.total || 0,
          pendingTasks: res.data.pendingCount || 0,
          completedTasks: res.data.completedCount || 0,
          completionRate: res.data.total ? Math.round((res.data.completedCount / res.data.total) * 100) : 0
        };

        // Show summary in an alert or create a dedicated summary modal
        alert(`Task Summary for ${employee.fullName}:
Total Tasks: ${summaryData.totalTasks}
Pending: ${summaryData.pendingTasks}
Completed: ${summaryData.completedTasks}
Completion Rate: ${summaryData.completionRate}%`);
      } else {
        toast.info("No task summary available for this salesman");
      }
    } catch (err) {
      console.error("❌ Task summary load error:", err);
      toast.error("Failed to load task summary");
    }
  };


  // const openViewTasksModal = (employee) => {
  //   const tasks = employee.tasks || [];

  //   if (tasks.length > 0) {
  //     setSelectedEmployee(employee);
  //     setSelectedTask(tasks);
  //     setIsEditMode(false);
  //     setModalOpen(true);
  //   } else {
  //     toast.info("No tasks found for this salesman");
  //   }
  // };


  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("🚀 fetchData called...");

  //     // API call for salesman data
  //     const response = await apiClient.get('/salesman-targets/all-current', {
  //       params: { 
  //         year: currentYear, 
  //         month: currentMonth,
  //         includeTasks: true  // agar backend support karta hai to
  //       }
  //     });

  //     console.log("📦 API Response:", response.data);

  //     if (!response.data.success || !response.data.data) {
  //       toast.error("No data received from API");
  //       setData([]);
  //       return;
  //     }

  //     const rawData = response.data.data;
  //     const todayKey = new Date().toISOString().split('T')[0];

  //     console.log(`📊 Processing ${rawData.length} salesmen...`);

  //     // Process each employee with their tasks
  //     const processedRows = await Promise.all(
  //       rawData.map(async (item) => {
  //         const emp = item.employee;
  //         const target = item.target || {};

  //         console.log(`Processing ${emp.fullName}:`, {
  //           employee: emp,
  //           target: target,
  //           hasTasksInTarget: !!target.tasks,
  //           tasksCount: target.tasks?.length || 0
  //         });

  //         // ✅ DAILY TARGET CALCULATION
  //         let dailyTarget = 0;
  //         let dailyAchieved = 0;
  //         let dailyProgress = 0;

  //         if (target.daily) {
  //           // Check multiple formats
  //           if (typeof target.daily === 'object') {
  //             // Format 1: { "2025-12-05": { target: 10, ... } }
  //             if (target.daily[todayKey]) {
  //               const dailyData = target.daily[todayKey];
  //               dailyTarget = dailyData.target || 0;
  //               dailyAchieved = dailyData.achieved || 0;
  //               dailyProgress = dailyData.progressPercentage || 0;
  //             } 
  //             // Format 2: Check all keys for today's date
  //             else {
  //               const dailyKeys = Object.keys(target.daily);
  //               for (const key of dailyKeys) {
  //                 if (key.startsWith(todayKey.substring(0, 10))) {
  //                   const dailyData = target.daily[key];
  //                   if (dailyData && typeof dailyData === 'object') {
  //                     dailyTarget = dailyData.target || 0;
  //                     dailyAchieved = dailyData.achieved || 0;
  //                     dailyProgress = dailyData.progressPercentage || 0;
  //                     break;
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         // ✅ FETCH TASKS SEPARATELY (MOST RELIABLE)
  //         let employeeTasks = [];

  //         try {
  //           // Try to get tasks from API endpoint
  //           const tasksResponse = await apiClient.get(`/salesman-targets/tasks/${emp._id}`, {
  //             params: { 
  //               year: currentYear, 
  //               month: currentMonth 
  //             }
  //           });

  //           if (tasksResponse.data.success) {
  //             employeeTasks = tasksResponse.data.tasks || [];
  //             console.log(`✅ Tasks fetched for ${emp.fullName}:`, employeeTasks.length);
  //           }
  //         } catch (tasksError) {
  //           console.log(`⚠️ No tasks API for ${emp.fullName}:`, tasksError.message);

  //           // Fallback: Try to get tasks from target object
  //           if (target.tasks && Array.isArray(target.tasks)) {
  //             employeeTasks = target.tasks;
  //             console.log(`📝 Using tasks from target object:`, employeeTasks.length);
  //           }
  //         }

  //         // ✅ RETURN COMPLETE ROW OBJECT
  //         const rowData = {
  //           _id: emp._id,
  //           employeeId: emp.employeeId || 'N/A',
  //           fullName: emp.fullName?.trim() || 'Unknown',

  //           // Daily Targets
  //           dailyTarget: dailyTarget,
  //           dailyAchieved: dailyAchieved,
  //           // dailyProgress: dailyProgress,
  //           // dailyCompleted: dailyAchieved, // For display

  //           // Monthly Targets  
  //           monthlyTarget: target.monthly?.target || 0,
  //           monthlyAchieved: target.monthly?.achieved || 0,
  //           // monthlyProgress: target.monthly?.progressPercentage || 0,
  //           // monthlyCompleted: target.monthly?.achieved || 0,

  //           // Yearly Targets
  //           yearlyTarget: target.yearly?.target || 0,
  //           yearlyAchieved: target.yearly?.achieved || 0,
  //           // yearlyProgress: target.yearly?.progressPercentage || 0,
  //           // yearlyCompleted: target.yearly?.achieved || 0,

  //           // Performance Stats
  //           totalDoctors: target.performanceStats?.totalDoctorsAdded || 0,
  //           hotLeads: target.performanceStats?.totalHotLeads || 0,
  //           closeLeads: target.performanceStats?.totalCloseLeads || 0,
  //           // warmLeads: target.performanceStats?.totalWarmLeads || 0,

  //           // ✅ TASKS - Always ensure it's an array
  //           tasks: Array.isArray(employeeTasks) ? employeeTasks : [],

  //           // UI State
  //           // isEditing: false
  //         };

  //         // console.log(`✅ Processed ${emp.fullName}:`, {
  //         //   dailyTarget: rowData.dailyTarget,
  //         //   tasksCount: rowData.tasks.length,
  //         //   tasksSample: rowData.tasks.slice(0, 2)
  //         // });

  //         return rowData;
  //       })
  //     );

  //     // ✅ SET DATA WITH PROPER TASKS
  //     console.log("🎉 Final processed data:", processedRows);

  //     // Check each row's tasks
  //     processedRows.forEach((row, index) => {
  //       if (row.tasks && row.tasks.length > 0) {
  //         console.log(`Row ${index} (${row.fullName}) has ${row.tasks.length} tasks`);
  //       }
  //     });

  //     setData(processedRows);

  //     // Show success message with tasks summary
  //     const totalTasks = processedRows.reduce((sum, row) => sum + (row.tasks?.length || 0), 0);
  //     const employeesWithTasks = processedRows.filter(row => row.tasks?.length > 0).length;

  //     toast.success(
  //       `Loaded ${processedRows.length} salesmen • ${employeesWithTasks} have tasks • Total ${totalTasks} tasks`
  //     );

  //   } catch (err) {
  //     console.error("❌ fetchData Error:", err);
  //     console.error("Error details:", {
  //       message: err.message,
  //       response: err.response?.data,
  //       status: err.response?.status
  //     });

  //     toast.error(`Failed to load: ${err.message}`);
  //     setData([]);

  //     // Fallback: Try to load at least some data
  //     try {
  //       const fallbackResponse = await apiClient.get('/api/employees', {
  //         params: { role: 'salesman' }
  //       });

  //       if (fallbackResponse.data.success) {
  //         const fallbackData = fallbackResponse.data.data.map(emp => ({
  //           _id: emp._id,
  //           employeeId: emp.employeeId,
  //           fullName: emp.fullName,
  //           tasks: [],
  //           dailyTarget: 0,
  //           monthlyTarget: 0,
  //           yearlyTarget: 0,
  //           totalDoctors: 0,
  //           hotLeads: 0,
  //           closeLeads: 0,
  //           isEditing: false
  //         }));
  //         setData(fallbackData);
  //         toast.info("Loaded basic employee data");
  //       }
  //     } catch (fallbackErr) {
  //       console.error("Fallback also failed:", fallbackErr);
  //     }

  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const fetchData = async () => {
  //   try {
  //     setLoading(true);

  //     const response = await apiClient.get('/salesman-targets/all-current', {
  //       params: { 
  //         year: currentYear, 
  //         month: currentMonth 
  //       }
  //     });

  //     if (!response.data.success || !response.data.data) {
  //       toast.error("No data received");
  //       setData([]);
  //       return;
  //     }

  //     const rawData = response.data.data;

  //     const todayKey = new Date().toISOString().split('T')[0];

  //     const processedRows = rawData.map(item => {
  //       const emp = item.employee;
  //       const target = item.target || {};

  //       // Daily target for today
  //       let dailyTarget = 0;
  //       let dailyAchieved = 0;
  //       let dailyProgress = 0;

  //       if (target.daily && typeof target.daily === 'object') {
  //         const todayData = target.daily[todayKey];
  //         if (todayData) {
  //           dailyTarget = todayData.target || 0;
  //           dailyAchieved = todayData.achieved || 0;
  //           dailyProgress = todayData.progressPercentage || 0;
  //         }
  //       }

  //       // Tasks - directly from target
  //       const tasks = Array.isArray(target.tasks) ? target.tasks : [];

  //       return {
  //         _id: emp._id,
  //         employeeId: emp.employeeId || 'N/A',
  //         fullName: emp.fullName?.trim() || 'Unknown',

  //         // Targets
  //         dailyTarget,
  //         dailyAchieved,
  //         dailyProgress,

  //         monthlyTarget: target.monthly?.target || 0,
  //         monthlyAchieved: target.monthly?.achieved || 0,

  //         yearlyTarget: target.yearly?.target || 0,
  //         yearlyAchieved: target.yearly?.achieved || 0,

  //         // Stats
  //         totalDoctors: target.performanceStats?.totalDoctorsAdded || 0,
  //         hotLeads: target.performanceStats?.totalHotLeads || 0,
  //         closeLeads: target.performanceStats?.totalCloseLeads || 0,

  //         // Tasks
  //         tasks: tasks,

  //         isEditing: false
  //       };
  //     });

  //     setData(processedRows);

  //     const totalTasks = processedRows.reduce((sum, row) => sum + row.tasks.length, 0);
  //     const withTasks = processedRows.filter(r => r.tasks.length > 0).length;

  //     toast.success(`Loaded ${processedRows.length} salesmen | ${withTasks} have tasks | Total ${totalTasks} tasks`);

  //   } catch (err) {
  //     console.error("fetchData error:", err);
  //     toast.error("Failed to load data");
  //     setData([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get('/salesman-targets/all-current', {
        params: {
          year: currentYear,
          month: currentMonth
        }
      });

      console.log("🔥 RAW API RESPONSE:", response.data);

      if (!response.data.success || !response.data.data) {
        toast.error("No data received");
        setData([]);
        return;
      }

      const rawData = response.data.data;
      const todayKey = new Date().toISOString().split('T')[0];

      const processedRows = rawData.map(item => {
        const emp = item.employee;
        const target = item.target || {};

        console.log(`🔍 Processing ${emp.fullName}:`, {
          monthlyTarget: target.monthly?.target,
          yearlyTarget: target.yearly?.target,
          daily: target.daily,
          todayKey
        });

        // 🔴 IMPROVED DAILY TARGET HANDLING - Handle Map conversion to object
        let dailyTarget = 0;
        let dailyAchieved = 0;
        let dailyProgress = 0;

        if (target.daily) {
          // Check if daily is a Map that got converted to an object
          if (typeof target.daily === 'object' && !Array.isArray(target.daily)) {
            // Look for today's date in the object keys
            const dailyKeys = Object.keys(target.daily);

            // First, try exact match
            if (target.daily[todayKey]) {
              const dailyData = target.daily[todayKey];
              dailyTarget = dailyData.target || 0;
              dailyAchieved = dailyData.achieved || 0;
              dailyProgress = dailyData.progressPercentage || 0;
            }
            // If no exact match, try partial date match (in case of timezone differences)
            else {
              for (const key of dailyKeys) {
                if (key.includes(todayKey.substring(0, 10))) { // Match YYYY-MM-DD part
                  const dailyData = target.daily[key];
                  if (dailyData && typeof dailyData === 'object') {
                    dailyTarget = dailyData.target || 0;
                    dailyAchieved = dailyData.achieved || 0;
                    dailyProgress = dailyData.progressPercentage || 0;
                    console.log(`✅ Found daily target with key: ${key}`, dailyData);
                    break;
                  }
                }
              }
            }
          }
        }

        // Tasks
        const tasks = Array.isArray(target.tasks) ? target.tasks : [];

        return {
          _id: emp._id,
          employeeId: emp.employeeId || 'N/A',
          fullName: emp.fullName?.trim() || 'Unknown',

          // DAILY - USE THESE IN YOUR TABLE
          dailyTarget: dailyTarget,
          dailyAchieved: dailyAchieved,
          dailyProgress: dailyProgress,
          dailyCompleted: dailyAchieved, // For display in table

          // MONTHLY
          monthlyTarget: target.monthly?.target || 0,
          monthlyAchieved: target.monthly?.achieved || 0,
          monthlyProgress: target.monthly?.progressPercentage || 0,
          monthlyCompleted: target.monthly?.achieved || 0,

          // YEARLY
          yearlyTarget: target.yearly?.target || 0,
          yearlyAchieved: target.yearly?.achieved || 0,
          yearlyProgress: target.yearly?.progressPercentage || 0,
          yearlyCompleted: target.yearly?.achieved || 0,

          // STATS
          totalDoctors: target.performanceStats?.totalDoctorsAdded || 0,
          hotLeads: target.performanceStats?.totalHotLeads || 0,
          closeLeads: target.performanceStats?.totalCloseLeads || 0,
          // warmLeads: target.performanceStats?.totalWarmLeads || 0,

          // TASKS
          tasks: tasks,

          isEditing: false
        };
      });

      // Debug: Show all processed data
      console.log("✅ FINAL PROCESSED DATA:");
      processedRows.forEach((row, idx) => {
        console.log(`${idx + 1}. ${row.fullName}:`, {
          daily: `${row.dailyTarget} (achieved: ${row.dailyAchieved})`,
          monthly: row.monthlyTarget,
          yearly: row.yearlyTarget
        });
      });

      setData(processedRows);
      toast.success(`Loaded ${processedRows.length} salesmen with targets`);

    } catch (err) {
      console.error("❌ fetchData error:", err);
      toast.error("Failed to load data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear]);

  // Search - Updated to use the targets API to get both employee and target data
  const handleSearch = async () => {
    if (!searchName && !searchEmpId) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      // First get all targets data
      const response = await apiClient.get('/salesman-targets/all-current', {
        params: {
          year: currentYear,
          month: currentMonth
        }
      });

      if (!response.data.success || !response.data.data) {
        toast.error("No data received");
        setData([]);
        return;
      }

      const allData = response.data.data;

      // Filter the data based on search criteria
      let filteredData = allData;
      if (searchName) {
        filteredData = allData.filter(item =>
          item.employee.fullName.toLowerCase().includes(searchName.toLowerCase())
        );
      }
      if (searchEmpId) {
        filteredData = allData.filter(item =>
          item.employee.employeeId.toLowerCase().includes(searchEmpId.toLowerCase())
        );
      }

      // Process the filtered data the same way as in fetchData
      const processedRows = filteredData.map(item => {
        const emp = item.employee;
        const target = item.target || {};

        // DAILY TARGET CALCULATION
        const todayKey = new Date().toISOString().split('T')[0];
        let dailyTarget = 0;
        let dailyAchieved = 0;
        let dailyProgress = 0;

        if (target.daily) {
          if (typeof target.daily === 'object') {
            if (target.daily[todayKey]) {
              const dailyData = target.daily[todayKey];
              dailyTarget = dailyData.target || 0;
              dailyAchieved = dailyData.achieved || 0;
              dailyProgress = dailyData.progressPercentage || 0;
            } else {
              const dailyKeys = Object.keys(target.daily);
              for (const key of dailyKeys) {
                if (key.includes(todayKey.substring(0, 10))) {
                  const dailyData = target.daily[key];
                  if (dailyData && typeof dailyData === 'object') {
                    dailyTarget = dailyData.target || 0;
                    dailyAchieved = dailyData.achieved || 0;
                    dailyProgress = dailyData.progressPercentage || 0;
                    break;
                  }
                }
              }
            }
          }
        }

        // Tasks
        const tasks = Array.isArray(target.tasks) ? target.tasks : [];

        return {
          _id: emp._id,
          employeeId: emp.employeeId || 'N/A',
          fullName: emp.fullName?.trim() || 'Unknown',

          // DAILY
          dailyTarget: dailyTarget,
          dailyAchieved: dailyAchieved,
          dailyProgress: dailyProgress,
          dailyCompleted: dailyAchieved,

          // MONTHLY
          monthlyTarget: target.monthly?.target || 0,
          monthlyAchieved: target.monthly?.achieved || 0,
          monthlyProgress: target.monthly?.progressPercentage || 0,
          monthlyCompleted: target.monthly?.achieved || 0,

          // YEARLY
          yearlyTarget: target.yearly?.target || 0,
          yearlyAchieved: target.yearly?.achieved || 0,
          yearlyProgress: target.yearly?.progressPercentage || 0,
          yearlyCompleted: target.yearly?.achieved || 0,

          // STATS
          totalDoctors: target.performanceStats?.totalDoctorsAdded || 0,
          hotLeads: target.performanceStats?.totalHotLeads || 0,
          closeLeads: target.performanceStats?.totalCloseLeads || 0,
          // warmLeads: target.performanceStats?.totalWarmLeads || 0,

          // TASKS
          tasks: tasks,

          isEditing: false
        };
      });

      setData(processedRows);
      toast.success(`Found ${processedRows.length} salesmen matching your search`);

    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setData(prev => prev.map(d => ({ ...d, isEditing: d._id === id })));
    setEditingRow(id);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setData(prev => prev.map(d => ({ ...d, isEditing: false })));
    fetchData();
    toast.info("Edit cancelled");
  };


  const saveTarget = async (row) => {
    const todayKey = new Date().toISOString().split('T')[0];

    const payload = {
      employeeId: row._id,
      targetYear: currentYear,
      targetMonth: currentMonth,
      yearlyTarget: row.yearlyTarget,
      monthlyTarget: row.monthlyTarget,
      dailyTargets: row.dailyTarget > 0 ? [{
        date: todayKey,
        target: row.dailyTarget
      }] : []
    };

    console.log("📤 Saving target payload:", payload);

    try {
      const res = await apiClient.post('/salesman-targets/', payload);
      console.log("✅ Save response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      throw err;
    }
  };


  const handleSaveRow = async (row, index) => {
    try {
      await saveTarget(row);
      toast.success("Target saved!");
      fetchData();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(`/salesman-targets/tasks/${taskId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success(`Task marked as ${newStatus}`);
        // Refresh data to reflect changes
        fetchData();
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update task status');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
      return false;
    }
  };

  const handleSaveAll = async () => {
    setUpdating(true);
    try {
      const editingRows = data.filter(d => d.isEditing);
      await Promise.all(editingRows.map(saveTarget));
      toast.success("All targets saved successfully!");
      handleCancelEdit();
    } catch (err) {
      toast.error("Some saves failed");
    } finally {
      setUpdating(false);
    }
  };

  const ProgressBar = ({ progress, achieved, target, color = 'blue' }) => {
    const p = Math.min(100, Math.max(0, progress || 0));
    const colors = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500' };
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium">
          <span>{achieved}/{target}</span>
          <span>{p}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${colors[color]} h-full rounded-full transition-all`} style={{ width: `${p}%` }}></div>
        </div>
      </div>
    );
  };

  const extraColumns = [
    // { header: 'Daily Target', render: (r,i) => (
    //     <div className="space-y-2 min-w-[120px]">
    //       <div className="flex items-center gap-2">
    //         <input type="number" value={r.dailyTarget} disabled={!r.isEditing}
    //           onChange={e => setData(p => p.map((d,x) => x===i ? {...d, dailyTarget: +e.target.value||0} : d))}
    //           className={`w-20 h-8 border text-center rounded ${r.isEditing?'border-blue-500 bg-blue-50':'bg-gray-100 border-gray-300'}`} />
    //         <span className="font-bold text-green-600">{r.dailyCompleted}</span>
    //       </div>
    //       <ProgressBar progress={r.dailyProgress} achieved={r.dailyAchieved} target={r.dailyTarget||1} />
    //     </div>
    //   )},
    // { header: 'Monthly Target', render: (r,i) => (
    //     <div className="space-y-2 min-w-[120px]">
    //       <input type="number" value={r.monthlyTarget} disabled={!r.isEditing}
    //         onChange={e => setData(p => p.map((d,x) => x===i ? {...d, monthlyTarget: +e.target.value||0} : d))}
    //         className={`w-20 h-8 border text-center rounded ${r.isEditing?'border-blue-500':''}`} />
    //       <span className="font-bold text-green-600">{r.monthlyCompleted}</span>
    //       <ProgressBar progress={r.monthlyProgress} achieved={r.monthlyAchieved} target={r.monthlyTarget||1} color="green" />
    //     </div>
    //   )},
    // { header: 'Yearly Target', render: (r,i) => (
    //     <div className="space-y-2 min-w-[120px]">
    //       <input type="number" value={r.yearlyTarget} disabled={!r.isEditing}
    //         onChange={e => setData(p => p.map((d,x) => x===i ? {...d, yearlyTarget: +e.target.value||0} : d))}
    //         className={`w-20 h-8 border text-center rounded ${r.isEditing?'border-blue-500':''}`} />
    //       <span className="font-bold text-green-600">{r.yearlyCompleted}</span>
    //       <ProgressBar progress={r.yearlyProgress} achieved={r.yearlyAchieved} target={r.yearlyTarget||1} color="purple" />
    //     </div>
    //   )},


    {
      header: 'Daily Target',
      render: (r, i) => (
        <div className="space-y-2 min-w-[120px]">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={r.dailyTarget}
              disabled={!r.isEditing}
              onChange={e => setData(p => p.map(d =>
                d._id === r._id ? { ...d, dailyTarget: +e.target.value || 0 } : d
              ))}
              className={`w-20 h-8 border text-center rounded ${r.isEditing ? 'border-blue-500 bg-blue-50' : 'bg-gray-100 border-gray-300'
                }`}
            />
            {/* ✅ YEH CHANGE KARO: dailyCompleted use karo */}
            <span className="font-bold text-green-600">{r.dailyCompleted}</span>
          </div>
          <ProgressBar
            progress={r.dailyProgress}
            achieved={r.dailyAchieved}
            target={r.dailyTarget || 1}
          />
        </div>
      )
    },
    {
      header: 'Monthly Target',
      render: (r, i) => (
        <div className="space-y-2 min-w-[120px]">
          <input
            type="number"
            value={r.monthlyTarget}
            disabled={!r.isEditing}
            onChange={e => setData(p => p.map(d =>
              d._id === r._id ? { ...d, monthlyTarget: +e.target.value || 0 } : d
            ))}
            className={`w-20 h-8 border text-center rounded ${r.isEditing ? 'border-blue-500' : ''
              }`}
          />
          {/* ✅ YEH CHANGE KARO: monthlyCompleted use karo */}
          <span className="font-bold text-green-600">{r.monthlyCompleted}</span>
          <ProgressBar
            progress={r.monthlyProgress}
            achieved={r.monthlyAchieved}
            target={r.monthlyTarget || 1}
            color="green"
          />
        </div>
      )
    },
    {
      header: 'Yearly Target',
      render: (r, i) => (
        <div className="space-y-2 min-w-[120px]">
          <input
            type="number"
            value={r.yearlyTarget}
            disabled={!r.isEditing}
            onChange={e => setData(p => p.map(d =>
              d._id === r._id ? { ...d, yearlyTarget: +e.target.value || 0 } : d
            ))}
            className={`w-20 h-8 border text-center rounded ${r.isEditing ? 'border-blue-500' : ''
              }`}
          />
          {/* ✅ YEH CHANGE KARO: yearlyCompleted use karo */}
          <span className="font-bold text-green-600">{r.yearlyCompleted}</span>
          <ProgressBar
            progress={r.yearlyProgress}
            achieved={r.yearlyAchieved}
            target={r.yearlyTarget || 1}
            color="purple"
          />
        </div>
      )
    },


    // { header: 'Total Stats', render: r => (
    //     <div className="space-y-1 text-xs">
    //       <div>Doctors: <strong className="text-purple-700">{r.totalDoctors}</strong></div>
    //       <div>Hot: <strong className="text-orange-600">{r.hotLeads}</strong></div>
    //       <div>Close: <strong className="text-green-600">{r.closeLeads}</strong></div>
    //     </div>
    //   )},

    // Tasks column mein changes
    // { header: 'Tasks', render: (r) => (
    //   <div className="flex gap-2">
    //     <button 
    //       onClick={() => openAddTaskModal(r)}
    //       className="w-9 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-xl font-bold"
    //     >
    //       +
    //     </button>

    //     {r.tasks?.length > 0 && (
    //       <button 
    //         onClick={() => openViewTasksModal(r)}
    //         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 relative text-sm font-medium"
    //       >
    //         View Tasks
    //         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
    //           {r.tasks.length}
    //         </span>
    //       </button>
    //     )}
    //   </div>
    // )},

    // SalesmanList.js mein Tasks column ko update karo:

    {
      header: 'Tasks', render: (r) => {
        const taskCount = r.tasks?.length || 0;
        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => openAddTaskModal(r)}
              className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-xl font-bold shadow-md"
              title="Add New Task"
            >
              +
            </button>

            {taskCount > 0 ? (
              <button
                onClick={() => openViewTasksModal(r)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 relative text-sm font-medium shadow-md flex items-center gap-2"
              >
                View Tasks
                <span className="bg-white text-green-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {taskCount}
                </span>
              </button>
            ) : (
              <span className="text-gray-500 text-sm italic px-3 py-2">
                No tasks
              </span>
            )}
          </div>
        );
      }
    },


    {
      header: 'Actions', render: (r, i) => r.isEditing ? (
        <div className="flex gap-2">
          <button onClick={() => handleSaveRow(r, i)} className="px-3 py-1 bg-green-600 text-white text-xs rounded">Save</button>
          <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-600 text-white text-xs rounded">Cancel</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(r._id)} className="w-8 h-8 bg-blue-600 text-white rounded flex-center hover:bg-blue-700">Edit</button>
          {/* <button onClick={async () => { if (confirm('Delete this salesman?')) { await apiClient.delete(apiEndpoints.employees.delete(r._id)); fetchData(); toast.success("Deleted"); } }}
            className="w-8 h-8 bg-red-600 text-white rounded flex-center hover:bg-red-700">Delete</button> */}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
      {/* Tera Full Original UI */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Salesman Management</h1>
          <p className="text-gray-600">Manage salesman targets, tasks, and track completions</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchData} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm border font-bold text-lg">
            {monthNames[currentMonth - 1]} {currentYear}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex gap-4 items-end">
          <input placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()}
            className="w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Search by ID" value={searchEmpId} onChange={e => setSearchEmpId(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()}
            className="w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Search</button>
          <button onClick={() => { setSearchName(''); setSearchEmpId(''); fetchData(); }} className="bg-gray-600 text-white px-6 py-2 rounded-lg">Clear</button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading instantly...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No salesmen found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            data={data}
            extraColumns={extraColumns}
            columnOrder={['employeeId', 'fullName', 'Daily Target', 'Monthly Target', 'Yearly Target', 'Tasks', 'Actions']}
            pagination={true}
            excludeColumns={['tasks', 'dailyTarget', 'monthlyTarget', 'yearlyTarget',  'dailyAchieved','isEditing' , 'monthlyCompleted', 'yearlyCompleted', 'totalCompleted']}
            defaultPageSize={10}
          />
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={(shouldRefresh) => {
          setModalOpen(false);
          if (shouldRefresh) {
            fetchData(); // ✅ Refresh data without page reload
          }
        }}
        employee={selectedEmployee}
        task={selectedTask}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default SalesmanList;