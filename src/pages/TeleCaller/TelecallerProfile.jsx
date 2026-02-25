import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Clock, Target, Building2, Badge, Key, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { apiEndpoints } from '../../services/apiClient';

const EmployeeProfile = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.employees.profile);
        if (response.data.success) {
          setEmployeeData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch employee data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching employee data');
        console.error('Error fetching employee profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:mt-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:mt-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen p-4 md:mt-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No employee data found</p>
        </div>
      </div>
    );
  }

  // Format profile data based on employee data
  const profileData = [
    { label: 'Name', value: employeeData.fullName, icon: User },
    { label: 'Role/Designation', value: employeeData.role || 'N/A', icon: Badge },
    { label: 'Employee ID', value: employeeData.employeeId, icon: Building2 },
    { label: 'Department', value: employeeData.department || 'N/A', icon: Building2 },
    { label: 'Joining Date', value: employeeData.jobDetails?.dateOfJoining ? new Date(employeeData.jobDetails.dateOfJoining).toLocaleDateString('en-GB') : 'N/A', icon: Calendar },
    { label: 'Address', value: employeeData.contactDetails?.currentAddress?.address || 'N/A', icon: MapPin },
    { label: 'Mobile', value: employeeData.phoneNumber || 'N/A', icon: Phone },
    { label: 'Email', value: employeeData.email || 'N/A', icon: Mail },
    { label: 'Designation', value: employeeData.jobDetails?.designation || 'N/A', icon: Badge },
    { label: 'Status', value: employeeData.status || 'N/A', icon: Badge },
  ];

  // Add more details if available
  if (employeeData.contactDetails?.currentAddress) {
    const address = employeeData.contactDetails.currentAddress;
    const fullAddress = [
      address.address,
      address.city,
      address.state,
      address.pinCode
    ].filter(Boolean).join(', ');

    // Replace the simple address with detailed address
    const addressIndex = profileData.findIndex(item => item.label === 'Address');
    if (addressIndex !== -1) {
      profileData[addressIndex].value = fullAddress;
    }
  }

  return (
    <div className="min-h-screen p-4 md:mt-2">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
            {/* Header Section with Gradient */}
            <div className="bg-[#EEFFFF] px-8 py-8 text-center relative">


              {/* Profile Avatar */}
              <div className="relative inline-block bg-[#398C89] p-4 rounded-full shadow-lg">
                <div className="w-12 h-12 bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm  border-white  ">
                  <User size={32} color="white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>

              <h2 className="text-black text-lg font-bold mt-3 mb-1">{employeeData.fullName}</h2>
              <p className="text-gray-800 text-xs font-bold">{employeeData.role || 'Employee'}</p>
            </div>

            {/* Profile Details */}
            <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {profileData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-teal-50 transition-colors duration-200">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent size={16} className="text-teal-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Password Field - This is a placeholder since real password is not stored in employee data */}
              {/* <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-teal-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Key size={16} className="text-teal-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Password
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 font-mono">
                      {showPassword ? '•••••••••' : '•••••••••'}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded-md hover:bg-teal-100 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff size={14} className="text-gray-500" />
                      ) : (
                        <Eye size={14} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div> */}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;