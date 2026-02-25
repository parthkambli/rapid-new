import React, { useState, useEffect, useRef } from 'react';
import Table from '../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DateInput from '../../../components/DateInput/DateInput';

const AttendanceRecord = () => {
  const navigate = useNavigate();
  const remarksTimeouts = useRef({}); // To store timeout IDs for remarks updates
  const statusTimeouts = useRef({}); // To store timeout IDs for status updates
  const checkInTimeouts = useRef({}); // To store timeout IDs for check-in updates
  const checkOutTimeouts = useRef({}); // To store timeout IDs for check-out updates
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    lateCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [saveStatus, setSaveStatus] = useState({}); // Track saving status for each record

  // Filters
  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));




 // Date conversion functions
  const formatToBackendDate = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    if (ddmmyyyy.includes('-')) {
      const parts = ddmmyyyy.split('-');
      if (parts.length === 3) {
        // Check format
        if (parts[0].length === 4) {
          // Already yyyy-mm-dd format
          return ddmmyyyy;
        } else {
          // dd-mm-yyyy to yyyy-mm-dd
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }
    return ddmmyyyy;
  };



   const formatToDisplayDate = (yyyymmdd) => {
    if (!yyyymmdd) return '';
    if (yyyymmdd.includes('-')) {
      const parts = yyyymmdd.split('-');
      if (parts.length === 3) {
        // Check format
        if (parts[0].length === 2) {
          // Already dd-mm-yyyy format
          return yyyymmdd;
        } else {
          // yyyy-mm-dd to dd-mm-yyyy
          const [year, month, day] = parts;
          return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
        }
      }
    }
    return yyyymmdd;
  };



  
  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    
    // Agar DateInput se aa raha hai (dd-mm-yyyy format)
    if (inputValue.includes('-') && inputValue.split('-')[0].length <= 2) {
      // Convert dd-mm-yyyy to yyyy-mm-dd for backend
      const backendDate = formatToBackendDate(inputValue);
      setSelectedDate(backendDate);
    } else {
      // Direct input ya koi aur format
      setSelectedDate(inputValue);
    }
  };



  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      // Fetch attendance stats with filters
      // const statsParams = {
      //   month: new Date(selectedMonth).getMonth() + 1,
      //   year: new Date(selectedMonth).getFullYear()
      // };




           // Fetch attendance stats with filters
      const statsParams = {
        month: new Date(selectedDate).getMonth() + 1, // Use selectedDate instead of selectedMonth
        year: new Date(selectedDate).getFullYear()
      };

        // Log for debugging
      console.log('Fetching for date:', selectedDate);
      console.log('Month params:', statsParams);

      const statsResponse = await apiClient.get(apiEndpoints.attendance.stats, {
        params: statsParams
      });

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      let attendanceDataToSet = [];
      let allEmployees = [];

      if (selectedRole) {
        // If filtering by role, first get employees with that role
        const employeesResponse = await apiClient.get(apiEndpoints.employees.byRole(selectedRole), {
          params: {
            limit: 100 // Get up to 100 employees with this role
          }
        });

        if (employeesResponse.data.success) {
          allEmployees = employeesResponse.data.data;
        }
      } else {
        // Get all employees based on search criteria
        const employeeParams = {};
        if (searchName) {
          employeeParams.search = searchName;
        } else if (searchEmpId) {
          employeeParams.search = searchEmpId;
        }

        const employeesResponse = await apiClient.get(apiEndpoints.employees.list, {
          params: {
            ...employeeParams,
            limit: 1000 // Get all employees
          }
        });

        if (employeesResponse.data.success) {
          allEmployees = employeesResponse.data.data;
        }
      }

      // Get existing attendance records for the selected date
      const attendanceParams = {
        date: selectedDate,
        limit: 1000, // Get all attendance records for the date
        page: 1
      };

      if (searchName) {
        attendanceParams.search = searchName;
      } else if (searchEmpId) {
        attendanceParams.search = searchEmpId;
      }

      const attendanceResponse = await apiClient.get(apiEndpoints.attendance.list, {
        params: attendanceParams
      });

      if (attendanceResponse.data.success) {
        attendanceDataToSet = attendanceResponse.data.data;
      }

      // Combine employee data with existing attendance data
      // If an employee doesn't have attendance for this date, create a placeholder record
      const combinedData = allEmployees.map(employee => {
        const existingAttendance = attendanceDataToSet.find(att =>
          att.employee && att.employee._id === employee._id
        );

        if (existingAttendance) {
          // Format existing attendance record
          return {
            ...existingAttendance,
            attendanceId: existingAttendance._id, // Store the actual attendance ID
            employeeId: existingAttendance.employee?.employeeId || employee.employeeId || 'N/A',
            fullName: existingAttendance.employee?.fullName || employee.fullName || 'N/A',
            role: existingAttendance.employee?.role || employee.role || 'N/A',
            checkInTime: existingAttendance.checkInTime,
            checkOutTime: existingAttendance.checkOutTime,
            date: new Date(existingAttendance.date).toLocaleDateString(),
            status: existingAttendance.status,
            remarks: existingAttendance.remarks || '',
            hasRecord: true, // Flag to indicate if the record already exists
            employeeIdRef: employee._id // Reference to the employee ID
          };
        } else {
          // Create a placeholder for employees without attendance record
          return {
            attendanceId: null, // No attendance record yet
            employeeIdRef: employee._id, // Reference to the employee ID
            employeeId: employee.employeeId || 'N/A',
            fullName: employee.fullName || 'N/A',
            role: employee.role || 'N/A',
            checkInTime: null,
            checkOutTime: null,
            date: new Date(selectedDate).toLocaleDateString(),
            status: 'absent', // Default status
            remarks: '',
            hasRecord: false, // Flag to indicate this is a placeholder
            employee: employee
          };
        }
      });

      // Apply role filter on the frontend if needed
      if (selectedRole && !searchName && !searchEmpId) {
        const filteredByRole = combinedData.filter(record =>
          record.role.toLowerCase() === selectedRole.toLowerCase()
        );
        setAttendanceData(filteredByRole);
      } else {
        // If search is applied, filter the combined data
        if (searchName || searchEmpId) {
          const searchTerm = (searchName || searchEmpId).toLowerCase();
          const filteredData = combinedData.filter(record =>
            record.fullName.toLowerCase().includes(searchTerm) ||
            record.employeeId.toLowerCase().includes(searchTerm)
          );
          setAttendanceData(filteredData);
        } else {
          setAttendanceData(combinedData);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate, selectedMonth, searchName, searchEmpId, selectedRole]);



  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmpId('');
    setSelectedRole('');
    setSelectedMonth(new Date().toISOString().slice(0, 7));
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }

  const handleViewEmployeeAttendance = () => {
    navigate('/admin/view/attendance-record');
  };

  const updateStatus = async (employeeId, newStatus) => {
    try {
      // Update save status
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saving' }));

      // First, check if the attendance record exists
      const record = attendanceData.find(r => r.employeeIdRef === employeeId);

      if (record && record.hasRecord && record.attendanceId) {
        // Update existing attendance record
        await apiClient.put(apiEndpoints.attendance.update(record.attendanceId), {
          status: newStatus
        });

        // Update local state
        setAttendanceData(prevData =>
          prevData.map(r =>
            r.employeeIdRef === employeeId ? { ...r, status: newStatus } : r
          )
        );
      } else {
        // Create new attendance record for the employee
        const newAttendanceData = {
          employee: employeeId, // This should be the employee ID
          date: selectedDate,
          status: newStatus,
          remarks: record ? record.remarks : ''
        };

        const response = await apiClient.post(apiEndpoints.attendance.create, newAttendanceData);

        if (response.data.success) {
          // Update local state to mark that this record now exists
          setAttendanceData(prevData =>
            prevData.map(r =>
              r.employeeIdRef === employeeId ? {
                ...r,
                attendanceId: response.data.data._id, // Use the new attendance ID
                status: newStatus,
                hasRecord: true
              } : r
            )
          );
        }
      }

      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saved' }));
      // Hide the saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => {
          const newStatusObj = { ...prev };
          if (newStatusObj[employeeId] === 'saved') {
            delete newStatusObj[employeeId];
          }
          return newStatusObj;
        });
      }, 2000);
    } catch (error) {
      console.error('Error updating attendance status:', error);
      toast.error('Failed to update attendance status');
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'error' }));
    }
  };

  const handleStatusChange = (employeeId, newStatus) => {
    // Update local state immediately for UI responsiveness
    setAttendanceData(prevData =>
      prevData.map(r =>
        r.employeeIdRef === employeeId ? { ...r, status: newStatus } : r
      )
    );

    // Clear the existing timeout for this employee if it exists
    if (statusTimeouts.current[employeeId]) {
      clearTimeout(statusTimeouts.current[employeeId]);
    }

    // Set a new timeout to update the data after 800ms of inactivity
    statusTimeouts.current[employeeId] = setTimeout(() => {
      updateStatus(employeeId, newStatus);
    }, 800);
  };

  const updateRemarks = async (employeeId, newRemarks) => {
    try {
      // Update save status
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saving' }));

      // First, check if the attendance record exists
      const record = attendanceData.find(r => r.employeeIdRef === employeeId);

      if (record && record.hasRecord && record.attendanceId) {
        // Update existing attendance record
        await apiClient.put(apiEndpoints.attendance.update(record.attendanceId), {
          remarks: newRemarks
        });

        // Update local state
        setAttendanceData(prevData =>
          prevData.map(r =>
            r.employeeIdRef === employeeId ? { ...r, remarks: newRemarks } : r
          )
        );
      } else {
        // Create new attendance record for the employee with the status and remarks
        const newAttendanceData = {
          employee: employeeId, // This should be the employee ID
          date: selectedDate,
          status: record ? record.status : 'absent',
          remarks: newRemarks
        };

        const response = await apiClient.post(apiEndpoints.attendance.create, newAttendanceData);

        if (response.data.success) {
          // Update local state to mark that this record now exists
          setAttendanceData(prevData =>
            prevData.map(r =>
              r.employeeIdRef === employeeId ? {
                ...r,
                attendanceId: response.data.data._id, // Use the new attendance ID
                remarks: newRemarks,
                hasRecord: true
              } : r
            )
          );
        }
      }

      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saved' }));
      // Hide the saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => {
          const newStatus = { ...prev };
          if (newStatus[employeeId] === 'saved') {
            delete newStatus[employeeId];
          }
          return newStatus;
        });
      }, 2000);
    } catch (error) {
      console.error('Error updating remarks:', error);
      toast.error('Failed to update remarks');
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'error' }));
    }
  };

  const handleRemarksChange = (employeeId, newRemarks) => {
    // Update local state immediately for UI responsiveness
    setAttendanceData(prevData =>
      prevData.map(r =>
        r.employeeIdRef === employeeId ? { ...r, remarks: newRemarks } : r
      )
    );

    // Clear the existing timeout for this employee if it exists
    if (remarksTimeouts.current[employeeId]) {
      clearTimeout(remarksTimeouts.current[employeeId]);
    }

    // Set a new timeout to update the data after 800ms of inactivity
    remarksTimeouts.current[employeeId] = setTimeout(() => {
      updateRemarks(employeeId, newRemarks);
    }, 800);
  };

  // const updateCheckIn = async (employeeId, checkInTime) => {
  //   try {
  //     // Update save status
  //     setSaveStatus(prev => ({ ...prev, [employeeId]: 'saving' }));

  //     // First, check if the attendance record exists
  //     const record = attendanceData.find(r => r.employeeIdRef === employeeId);

  //     if (record && record.hasRecord && record.attendanceId) {
  //       // Update existing attendance record
  //       const [hours, minutes] = checkInTime.split(':');
  //       const dateTime = new Date(`${selectedDate}T${checkInTime}:00`);

  //       await apiClient.put(apiEndpoints.attendance.update(record.attendanceId), {
  //         checkInTime: dateTime
  //       });

  //       // Update local state
  //       setAttendanceData(prevData =>
  //         prevData.map(r =>
  //           r.employeeIdRef === employeeId ? { ...r, checkInTime: dateTime } : r
  //         )
  //       );
  //     } else {
  //       // Create new attendance record with check-in time
  //       const [hours, minutes] = checkInTime.split(':');
  //       const checkInDateTime = new Date(`${selectedDate}T${checkInTime}:00`);

  //       const newAttendanceData = {
  //         employee: employeeId,
  //         date: selectedDate,
  //         checkInTime: checkInDateTime,
  //         status: record ? record.status : 'present', // Default to present if not set
  //         remarks: record ? record.remarks : ''
  //       };

  //       const response = await apiClient.post(apiEndpoints.attendance.create, newAttendanceData);

  //       if (response.data.success) {
  //         // Update local state to mark that this record now exists
  //         setAttendanceData(prevData =>
  //           prevData.map(r =>
  //             r.employeeIdRef === employeeId ? {
  //               ...r,
  //               attendanceId: response.data.data._id,
  //               checkInTime: checkInDateTime,
  //               hasRecord: true
  //             } : r
  //           )
  //         );
  //       }
  //     }

  //     setSaveStatus(prev => ({ ...prev, [employeeId]: 'saved' }));
  //     // Hide the saved status after 2 seconds
  //     setTimeout(() => {
  //       setSaveStatus(prev => {
  //         const newStatus = { ...prev };
  //         if (newStatus[employeeId] === 'saved') {
  //           delete newStatus[employeeId];
  //         }
  //         return newStatus;
  //       });
  //     }, 2000);
  //   } catch (error) {
  //     console.error('Error updating check-in time:', error);
  //     toast.error('Failed to update check-in time');
  //     setSaveStatus(prev => ({ ...prev, [employeeId]: 'error' }));
  //   }
  // };


// Update check-in/check-out handlers to use proper format
  const updateCheckIn = async (employeeId, checkInTime) => {
    try {
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saving' }));

      const record = attendanceData.find(r => r.employeeIdRef === employeeId);

      if (record && record.hasRecord && record.attendanceId) {
        // Use selectedDate directly (already in yyyy-mm-dd)
        const dateTimeString = `${selectedDate}T${checkInTime}:00`;
        const dateTime = new Date(dateTimeString);

        await apiClient.put(apiEndpoints.attendance.update(record.attendanceId), {
          checkInTime: dateTime.toISOString() // Send as ISO string
        });

        setAttendanceData(prevData =>
          prevData.map(r =>
            r.employeeIdRef === employeeId ? { ...r, checkInTime: dateTime } : r
          )
        );
      } else {
        // Create new attendance record
        const dateTimeString = `${selectedDate}T${checkInTime}:00`;
        const checkInDateTime = new Date(dateTimeString);

        const newAttendanceData = {
          employee: employeeId,
          date: selectedDate, // yyyy-mm-dd format
          checkInTime: checkInDateTime.toISOString(), // ISO string
          status: record ? record.status : 'present',
          remarks: record ? record.remarks : ''
        };

        const response = await apiClient.post(apiEndpoints.attendance.create, newAttendanceData);

        if (response.data.success) {
          setAttendanceData(prevData =>
            prevData.map(r =>
              r.employeeIdRef === employeeId ? {
                ...r,
                attendanceId: response.data.data._id,
                checkInTime: checkInDateTime,
                hasRecord: true
              } : r
            )
          );
        }
      }

      setSaveStatus(prev => ({ ...prev, [employeeId]: 'saved' }));
      setTimeout(() => {
        setSaveStatus(prev => {
          const newStatusObj = { ...prev };
          if (newStatusObj[employeeId] === 'saved') {
            delete newStatusObj[employeeId];
          }
          return newStatusObj;
        });
      }, 2000);
    } catch (error) {
      console.error('Error updating check-in time:', error);
      toast.error('Failed to update check-in time');
      setSaveStatus(prev => ({ ...prev, [employeeId]: 'error' }));
    }
  };



  const handleCheckInChange = (employeeId, checkInTime) => {
    // Update local state immediately for UI responsiveness
    setAttendanceData(prevData =>
      prevData.map(r =>
        r.employeeIdRef === employeeId ? { ...r, checkInTime: checkInTime ? new Date(`${selectedDate}T${checkInTime}:00`) : null } : r
      )
    );

    // Clear the existing timeout for this employee if it exists
    if (checkInTimeouts.current[employeeId]) {
      clearTimeout(checkInTimeouts.current[employeeId]);
    }

    // Set a new timeout to update the data after 800ms of inactivity
    checkInTimeouts.current[employeeId] = setTimeout(() => {
      updateCheckIn(employeeId, checkInTime);
    }, 800);
  };

  const handleCheckOutChange = async (employeeId, checkOutTime) => {
    try {
      setUpdating(true);

      // First, check if the attendance record exists
      const record = attendanceData.find(r => r.employeeIdRef === employeeId);

      if (record && record.hasRecord && record.attendanceId) {
        // Update existing attendance record
        const [hours, minutes] = checkOutTime.split(':');
        const dateTime = new Date(`${selectedDate}T${checkOutTime}:00`);

        await apiClient.put(apiEndpoints.attendance.update(record.attendanceId), {
          checkOutTime: dateTime
        });

        // Update local state
        setAttendanceData(prevData =>
          prevData.map(r =>
            r.employeeIdRef === employeeId ? { ...r, checkOutTime: dateTime } : r
          )
        );
      } else {
        // Create new attendance record with check-out time
        const [hours, minutes] = checkOutTime.split(':');
        const checkOutDateTime = new Date(`${selectedDate}T${checkOutTime}:00`);

        const newAttendanceData = {
          employee: employeeId,
          date: selectedDate,
          checkOutTime: checkOutDateTime,
          status: record ? record.status : 'present', // Default to present if not set
          remarks: record ? record.remarks : ''
        };

        const response = await apiClient.post(apiEndpoints.attendance.create, newAttendanceData);

        if (response.data.success) {
          // Update local state to mark that this record now exists
          setAttendanceData(prevData =>
            prevData.map(r =>
              r.employeeIdRef === employeeId ? {
                ...r,
                attendanceId: response.data.data._id,
                checkOutTime: checkOutDateTime,
                hasRecord: true
              } : r
            )
          );
        }
      }

      toast.success('Check-out time updated successfully');
    } catch (error) {
      console.error('Error updating check-out time:', error);
      toast.error('Failed to update check-out time');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAttendance = async (record) => {
    if (!record.hasRecord || !record.attendanceId) {
      toast.error('No attendance record to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        setUpdating(true);
        await apiClient.delete(apiEndpoints.attendance.delete(record.attendanceId));

        // Remove from local state
        setAttendanceData(prevData =>
          prevData.filter(r => r.attendanceId !== record.attendanceId)
        );

        toast.success('Attendance record deleted successfully');
      } catch (error) {
        console.error('Error deleting attendance record:', error);
        toast.error('Failed to delete attendance record');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleViewDetails = (record) => {
    // Navigate to detailed attendance view for specific employee
    if (record.employeeIdRef) {
      navigate(`/admin/attendance/employee/${record.employeeIdRef}`);
    } else {
      toast.error('Employee ID not available');
    }
  };

  // Define actions for the table
  const tableActions = [
    {
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      label: "View Details",
      showAsIcon: true,
      onClick: (record) => handleViewDetails(record),
    },
    {
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      label: "Delete",
      showAsIcon: true,
      onClick: (record) => {
        if (record.hasRecord && record.attendanceId) {
          handleDeleteAttendance(record);
        } else {
          toast.error('No attendance record to delete');
        }
      },
    },
  ];

  // Debounce utility function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  return (
    <div className="container max-w-[79vw] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Attendance Record</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Search By Name</label>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter employee name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-l text-sm"
            />
            <button
              onClick={fetchAttendanceData}
              className="bg-[#1B504E] text-white px-3 py-2 rounded-r hover:bg-[#164641] transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter employee ID"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-l text-sm"
            />
            <button
              onClick={fetchAttendanceData}
              className="bg-[#1B504E] text-white px-3 py-2 rounded-r hover:bg-[#164641] transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Roles</option>
            <option value="salesman">Salesman</option>
            <option value="telecaller">Telecaller</option>
            {/* <option value="manager">Manager</option> */}
            <option value="admin">Admin</option>
            {/* <option value="employee">Employee</option> */}
          </select>
        </div>
        <div className="flex flex-col"  >
          <label className="text-sm text-gray-600 mb-1">Date</label>  
          {/* <DateInput
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          /> */}

    <DateInput
            value={formatToDisplayDate(selectedDate)} // Display ke liye dd-mm-yyyy
            onChange={handleDateChange} // Yeh convert karega yyyy-mm-dd mein
            name="date"
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"

          />

        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
            }}
            className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex items-end">
          {/* <button
            onClick={handleViewEmployeeAttendance}
            className="bg-[#1B504E] text-white px-6 py-2 rounded hover:bg-[#164641] transition-colors font-medium"
          >
            View Employee Attendance
          </button> */}
          <button
            onClick={handleClearFilters}
            className="bg-[#1B504E] text-white px-6 py-2 rounded hover:bg-[#164641] transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1B504E] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.totalRecords}</div>
          <div className="text-sm">Total Records</div>
        </div>
        <div className="bg-[#1B504ECC] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.presentCount}</div>
          <div className="text-sm">Present</div>
        </div>
        <div className="bg-[#497371BA] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.absentCount}</div>
          <div className="text-sm">Absent</div>
        </div>
        <div className="bg-[#788382A6] text-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold">{stats.lateCount}</div>
          <div className="text-sm">Late</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Table
            data={attendanceData}
            excludeColumns={[
              "attendanceId",
              "hasRecord",
              "employeeIdRef",
              "checkInTime",
              "checkOutTime",
              "status",
              "remarks",
              "employee",
              "__v",
              "_id",
              "createdAt",
              "updatedAt",
              "month",
              "year",
              "workingHours",
              "overtimeHours",
              "lunchBreak",
              "breaks",
              "leaveType",
              "leaveReason",
              "leaveApproved",
              "workLocation",
              "remoteWork",
              "tasksCompleted",
              "productivityRating",
              "supervisorNotes",
              "verifiedBy",
              "verifiedAt",
              "approvedBy",
              "approvedAt",
              "createdBy",
              "updatedBy"
            ]}
            columnOrder={[
              "employeeId",
              "fullName",
              "checkInTime",
              "checkOutTime",
              "role",
              "date",
              "status",
              "remarks"
            ]}
            extraColumns={[
              {
                header: "Status",
                render: (row, index) => (
                  <div className="relative">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.employeeIdRef, e.target.value)}
                      disabled={updating}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="leave">Leave</option>
                      <option value="late">Late</option>
                      <option value="half_day">Half Day</option>
                    </select>
                    {saveStatus[row.employeeIdRef] === 'saving' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-blue-600">Saving...</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'saved' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-green-600">✓ Saved</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'error' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-red-600">✗ Error</span>
                    )}
                  </div>
                ),
              },
              {
                header: "Check In",
                render: (row, index) => (
                  <div className="relative">
                    <input
                      type="time"
                      value={row.checkInTime ? new Date(row.checkInTime).toTimeString().substring(0, 5) : ''}
                      onChange={(e) => handleCheckInChange(row.employeeIdRef, e.target.value)}
                      disabled={updating}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    {saveStatus[row.employeeIdRef] === 'saving' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-blue-600">Saving...</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'saved' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-green-600">✓ Saved</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'error' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-red-600">✗ Error</span>
                    )}
                  </div>
                ),
              },
              {
                header: "Check Out",
                render: (row, index) => (
                  <div className="relative">
                    <input
                      type="time"
                      value={row.checkOutTime ? new Date(row.checkOutTime).toTimeString().substring(0, 5) : ''}
                      onChange={(e) => handleCheckOutChange(row.employeeIdRef, e.target.value)}
                      disabled={updating}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    {saveStatus[row.employeeIdRef] === 'saving' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-blue-600">Saving...</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'saved' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-green-600">✓ Saved</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'error' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-red-600">✗ Error</span>
                    )}
                  </div>
                ),
              },
              {
                header: "Remarks",
                render: (row, index) => (
                  <div className="relative">
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => handleRemarksChange(row.employeeIdRef, e.target.value)}
                      disabled={updating}
                      placeholder="Enter remarks"
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    {saveStatus[row.employeeIdRef] === 'saving' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-blue-600">Saving...</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'saved' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-green-600">✓ Saved</span>
                    )}
                    {saveStatus[row.employeeIdRef] === 'error' && (
                      <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-xs text-red-600">✗ Error</span>
                    )}
                  </div>
                )
              }
            ]}
            actions={tableActions}
            pagination={true}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceRecord;

