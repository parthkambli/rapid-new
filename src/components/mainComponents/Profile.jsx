import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Clock, Target, Building2, Badge, Key, Eye, EyeOff } from 'lucide-react';

const EmployeeProfile = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const profileData = [
    { label: 'Name', value: 'Rajesh Kumar', icon: User },
    { label: 'Role/Designation', value: 'Sales Person', icon: Badge },
    { label: 'Employee ID', value: 'EMP001', icon: Building2 },
    { label: 'Department', value: 'Sales & Marketing', icon: Building2 },
    { label: 'Joining Date', value: '12 Jan 2024', icon: Calendar },
    { label: 'Work Shift', value: 'Morning (9 AM – 6 PM)', icon: Clock },
    { label: 'Daily Task Limit', value: '5 Tasks', icon: Target },
    { label: 'Address', value: 'Shanti Nagar Virar West', icon: MapPin },
    { label: 'Mobile (User Id)', value: '+91 9876543210', icon: Phone },
    { label: 'Email', value: 'rajesh.kumar@abc.com', icon: Mail },
    { label: 'Contact', value: '+91 9876500000', icon: Phone },
  ];

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
              
              <h2 className="text-black text-lg font-bold mt-3 mb-1">Rajesh Kumar</h2>
              <p className="text-gray-800 text-xs font-bold">Sales Professional</p>
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

              {/* Password Field */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-teal-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Key size={16} className="text-teal-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Password
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 font-mono">
                      {showPassword ? '5fyfuyjtb' : '•••••••••'}
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
              </div>
            </div>

     
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;