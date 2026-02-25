// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorPolicies = () => {
//     const [loading, setLoading] = useState(true);
//     const [policies, setPolicies] = useState([]);

//     useEffect(() => {
//         const fetchPolicies = async () => {
//             try {
//                 // Fetch user info to get doctor data with policies
//                 const userResponse = await apiClient.get(apiEndpoints.auth.me);

//                 if (userResponse.data.success) {
//                     let doctorId = null;

//                     // Try different ways to get the doctor ID
//                     if (userResponse.data.user && userResponse.data.user.doctorId) {
//                         doctorId = userResponse.data.user.doctorId;
//                     } else if (userResponse.data.user && userResponse.data.user.doctor && userResponse.data.user.doctor._id) {
//                         doctorId = userResponse.data.user.doctor._id;
//                     } else if (userResponse.data.doctorId) {
//                         doctorId = userResponse.data.doctorId;
//                     } else if (userResponse.data.user && userResponse.data.user._id) {
//                         // Fallback to user ID if doctor ID not found
//                         doctorId = userResponse.data.user._id;
//                     }

//                     // Fetch doctor information if we have a doctor ID
//                     if (doctorId) {
//                         // Fetch complete doctor info to get policies
//                         try {
//                             const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorId));
//                             if (doctorResponse.data.success) {
//                                 // Get policies from the doctor object (this includes policies for both main and linked doctor)
//                                 const doctorPolicies = doctorResponse.data.data?.policies || [];
//                                 setPolicies(doctorPolicies);
//                             }
//                         } catch (err) {
//                             console.warn('Could not fetch doctor info for policies:', err.message);

//                             // Fallback: try to get policies from user response as before
//                             const policies = userResponse.data.user?.doctor?.policies || [];
//                             setPolicies(policies);
//                         }
//                     } else {
//                         // Fallback: try to get policies from user response
//                         const policies = userResponse.data.user?.doctor?.policies || [];
//                         setPolicies(policies);
//                     }
//                 } else {
//                     console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
//                 }
//             } catch (err) {
//                 console.error('Error fetching policies:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPolicies();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-900">Policy History</h1>
//                 <p className="text-gray-600">View your insurance policies (Active/Expired)</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {policies.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {policies.map((policy) => {
//                                     // Handle the new nested structure where policyId contains the full policy object
//                                     const policyData = policy.policyId || policy;
//                                     const insuranceCompany = policyData.insuranceCompany || policy.insuranceCompany;

//                                     return (
//                                         <tr key={policy._id}>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{policyData.policyNumber || policy.policyNumber || 'N/A'}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insuranceCompany?.companyName || policy.company || 'N/A'}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{policyData.coverageAmount || policy.coverageAmount || policy.coverage_amount || '0'}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policyData.policyType || policy.policyType || policy.type || 'N/A'}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {policyData.startDate || policy.startDate ? new Date(policyData.startDate || policy.startDate).toLocaleDateString() : 'N/A'}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {policyData.endDate || policy.endDate ? new Date(policyData.endDate || policy.endDate).toLocaleDateString() : 'N/A'}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                             ${(policyData.status === 'active' || policyData.status === 'Active' || policy.status === 'active' || policy.status === 'Active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                                     {policyData.status || policy.status || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {(policyData.endDate || policy.endDate) ? Math.ceil((new Date(policyData.endDate || policy.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A'}
//                                                 {(policyData.endDate || policy.endDate) && (
//                                                     <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//                                                         <div
//                                                             className="bg-teal-600 h-2 rounded-full"
//                                                             style={{
//                                                                 width: `${Math.min(100, Math.max(0,
//                                                                     (policyData.endDate || policy.endDate) ?
//                                                                         (Math.max(0, (new Date(policyData.endDate || policy.endDate) - new Date()) / (1000 * 60 * 60 * 24)) / 365) * 100
//                                                                     : 0
//                                                                 ))}%`
//                                                             }}
//                                                         ></div>
//                                                     </div>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="p-8 text-center text-gray-500">
//                         No policies found.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DoctorPolicies;




// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorPolicies = () => {
//     const [loading, setLoading] = useState(true);
//     const [policies, setPolicies] = useState([]);

//     useEffect(() => {
//         const fetchPolicies = async () => {
//             try {
//                 // Fetch user info to get doctor data with policies
//                 const userResponse = await apiClient.get(apiEndpoints.auth.me);

//                 if (userResponse.data.success) {
//                     let doctorId = null;

//                     // Try different ways to get the doctor ID
//                     if (userResponse.data.user && userResponse.data.user.doctorId) {
//                         doctorId = userResponse.data.user.doctorId;
//                     } else if (userResponse.data.user && userResponse.data.user.doctor && userResponse.data.user.doctor._id) {
//                         doctorId = userResponse.data.user.doctor._id;
//                     } else if (userResponse.data.doctorId) {
//                         doctorId = userResponse.data.doctorId;
//                     } else if (userResponse.data.user && userResponse.data.user._id) {
//                         // Fallback to user ID if doctor ID not found
//                         doctorId = userResponse.data.user._id;
//                     }

//                     // Fetch doctor information if we have a doctor ID
//                     if (doctorId) {
//                         // Fetch complete doctor info to get policies
//                         try {
//                             const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorId));
//                             if (doctorResponse.data.success) {
//                                 // Get policies from the doctor object (this includes policies for both main and linked doctor)
//                                 const doctorPolicies = doctorResponse.data.data?.policies || [];
//                                 setPolicies(doctorPolicies);
//                             }
//                         } catch (err) {
//                             console.warn('Could not fetch doctor info for policies:', err.message);

//                             // Fallback: try to get policies from user response as before
//                             const policies = userResponse.data.user?.doctor?.policies || [];
//                             setPolicies(policies);
//                         }
//                     } else {
//                         // Fallback: try to get policies from user response
//                         const policies = userResponse.data.user?.doctor?.policies || [];
//                         setPolicies(policies);
//                     }
//                 } else {
//                     console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
//                 }
//             } catch (err) {
//                 console.error('Error fetching policies:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPolicies();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 sm:p-6">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-900">Policy History</h1>
//                 <p className="text-gray-600">View your insurance policies (Active/Expired)</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {policies.length > 0 ? (
//                     <>
//                         {/* Mobile View - Card Layout */}
//                         <div className="block sm:hidden p-4 space-y-4">
//                             {policies.map((policy) => {
//                                 // Handle the new nested structure where policyId contains the full policy object
//                                 const policyData = policy.policyId || policy;
//                                 const insuranceCompany = policyData.insuranceCompany || policy.insuranceCompany;
//                                 const endDate = policyData.endDate || policy.endDate;
//                                 const daysLeft = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
                                
//                                 return (
//                                     <div key={policy._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                         <div className="grid grid-cols-2 gap-3 mb-4">
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Policy No</p>
//                                                 <p className="text-sm font-medium text-blue-600">
//                                                     {policyData.policyNumber || policy.policyNumber || 'N/A'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Company</p>
//                                                 <p className="text-sm text-gray-900">
//                                                     {insuranceCompany?.companyName || policy.company || 'N/A'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Cover</p>
//                                                 <p className="text-sm font-medium text-gray-900">
//                                                     ₹{policyData.coverageAmount || policy.coverageAmount || policy.coverage_amount || '0'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Type</p>
//                                                 <p className="text-sm text-gray-600">
//                                                     {policyData.policyType || policy.policyType || policy.type || 'N/A'}
//                                                 </p>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="grid grid-cols-2 gap-3 mb-4">
//                                             <div>
//                                                 <p className="text-xs text-gray-500">Start Date</p>
//                                                 <p className="text-sm text-gray-900">
//                                                     {policyData.startDate || policy.startDate ? 
//                                                         new Date(policyData.startDate || policy.startDate).toLocaleDateString() : 'N/A'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-gray-500">End Date</p>
//                                                 <p className="text-sm text-gray-900">
//                                                     {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
//                                                 </p>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="flex justify-between items-center">
//                                             <div>
//                                                 <p className="text-xs text-gray-500 mb-1">Status</p>
//                                                 <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
//                                                     ${(policyData.status === 'active' || policyData.status === 'Active' || 
//                                                        policy.status === 'active' || policy.status === 'Active') ? 
//                                                        'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                                     {policyData.status || policy.status || 'N/A'}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-gray-500 mb-1">Days Left</p>
//                                                 <p className="text-sm font-medium text-gray-900">
//                                                     {endDate ? daysLeft : 'N/A'}
//                                                 </p>
//                                             </div>
//                                         </div>
                                        
//                                         {/* Progress Bar */}
//                                         {endDate && (
//                                             <div className="mt-3">
//                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                     <div
//                                                         className="bg-teal-600 h-2 rounded-full"
//                                                         style={{
//                                                             width: `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%`
//                                                         }}
//                                                     ></div>
//                                                 </div>
//                                                 <p className="text-xs text-gray-500 mt-1 text-center">
//                                                     {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Desktop View - Table Layout */}
//                         <div className="hidden sm:block overflow-x-auto w-full">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Policy No</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Company</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cover</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Start Date</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">End Date</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
//                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Days Left</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {policies.map((policy) => {
//                                         // Handle the new nested structure where policyId contains the full policy object
//                                         const policyData = policy.policyId || policy;
//                                         const insuranceCompany = policyData.insuranceCompany || policy.insuranceCompany;
//                                         const endDate = policyData.endDate || policy.endDate;
//                                         const daysLeft = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
                                        
//                                         return (
//                                             <tr key={policy._id} className="hover:bg-gray-50">
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                                                     {policyData.policyNumber || policy.policyNumber || 'N/A'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                     {insuranceCompany?.companyName || policy.company || 'N/A'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                     ₹{policyData.coverageAmount || policy.coverageAmount || policy.coverage_amount || '0'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                     {policyData.policyType || policy.policyType || policy.type || 'N/A'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                     {policyData.startDate || policy.startDate ? 
//                                                         new Date(policyData.startDate || policy.startDate).toLocaleDateString() : 'N/A'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                     {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
//                                                 </td>
//                                                 <td className="px-4 py-4 whitespace-nowrap">
//                                                     <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full whitespace-nowrap
//                                                         ${(policyData.status === 'active' || policyData.status === 'Active' || 
//                                                            policy.status === 'active' || policy.status === 'Active') ? 
//                                                            'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                                         {policyData.status || policy.status || 'N/A'}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-4">
//                                                     <div className="flex flex-col items-start">
//                                                         <span className="text-sm font-medium text-gray-900 mb-2">
//                                                             {endDate ? daysLeft : 'N/A'} days
//                                                         </span>
//                                                         {endDate && (
//                                                             <div className="w-32 bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className="bg-teal-600 h-2 rounded-full"
//                                                                     style={{
//                                                                         width: `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%`
//                                                                     }}
//                                                                 ></div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="p-8 text-center text-gray-500">
//                         No policies found.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DoctorPolicies;



























import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorPolicies = () => {
    const [loading, setLoading] = useState(true);
    const [policies, setPolicies] = useState([]);
    const [activeTab, setActiveTab] = useState('doctor'); // 'doctor' or 'hospital'

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                // Fetch user info to get doctor data with policies
                const userResponse = await apiClient.get(apiEndpoints.auth.me);

                if (userResponse.data.success) {
                    let doctorId = null;

                    // Try different ways to get the doctor ID
                    if (userResponse.data.user && userResponse.data.user.doctorId) {
                        doctorId = userResponse.data.user.doctorId;
                    } else if (userResponse.data.user && userResponse.data.user.doctor && userResponse.data.user.doctor._id) {
                        doctorId = userResponse.data.user.doctor._id;
                    } else if (userResponse.data.doctorId) {
                        doctorId = userResponse.data.doctorId;
                    } else if (userResponse.data.user && userResponse.data.user._id) {
                        // Fallback to user ID if doctor ID not found
                        doctorId = userResponse.data.user._id;
                    }

                    // Fetch doctor information if we have a doctor ID
                    if (doctorId) {
                        // Fetch complete doctor info to get policies
                        try {
                            const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorId));
                            if (doctorResponse.data.success) {
                                // Get policies from the doctor object
                                const doctorPolicies = doctorResponse.data.data?.policies || [];
                                setPolicies(doctorPolicies);
                            }
                        } catch (err) {
                            console.warn('Could not fetch doctor info for policies:', err.message);

                            // Fallback: try to get policies from user response as before
                            const policies = userResponse.data.user?.doctor?.policies || [];
                            setPolicies(policies);
                        }
                    } else {
                        // Fallback: try to get policies from user response
                        const policies = userResponse.data.user?.doctor?.policies || [];
                        setPolicies(policies);
                    }
                } else {
                    console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
                }
            } catch (err) {
                console.error('Error fetching policies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    // Filter policies based on active tab
    const getFilteredPolicies = () => {
        // First, process all policies
        const processedPolicies = policies.map(policy => {
            const policyData = policy.policyId || policy;
            const insuranceCompany = policyData.insuranceCompany || policy.insuranceCompany;
            const endDate = policyData.endDate || policy.endDate;
            const daysLeft = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
            const isActive = (policyData.status === 'active' || policyData.status === 'Active');
            
            return {
                ...policy,
                policyData,
                insuranceCompany,
                endDate,
                daysLeft,
                isActive,
                // Use policyType from the policy object (not policyId)
                policyType: policy.policyType // This will be 'doctor' or 'hospital'
            };
        });

        // Filter by active tab
        const tabPolicies = processedPolicies.filter(p => 
            p.policyType && p.policyType.toLowerCase() === activeTab
        );

        // Separate current (active) policies and other policies
        return {
            current: tabPolicies.filter(p => p.isActive),
            other: tabPolicies.filter(p => !p.isActive)
        };
    };

    const { current: currentPolicies, other: otherPolicies } = getFilteredPolicies();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Policy History</h1>
                <p className="text-gray-600">View your insurance policies (Active/Expired)</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('doctor')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'doctor'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Doctor Policies
                        </button>
                        <button
                            onClick={() => setActiveTab('hospital')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'hospital'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Hospital Policies
                        </button>
                    </nav>
                </div>
            </div>

            {/* Current Active Policies - Card View */}
            {currentPolicies.length > 0 ? (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Currently Active Policies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPolicies.map((policy) => (
                            <div key={policy._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {policy.policyData.policyNumber || policy.policyNumber || 'N/A'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {policy.insuranceCompany?.companyName || policy.company || 'N/A'}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                        Active
                                    </span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Coverage</span>
                                        <span className="font-semibold">
                                            ₹{policy.policyData.coverageAmount?.toLocaleString() || 
                                               policy.coverageAmount?.toLocaleString() || 
                                               policy.coverage_amount?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Premium</span>
                                        <span className="font-medium">
                                            ₹{policy.policyData.premiumAmount?.toLocaleString() || 
                                               policy.premiumAmount?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Policy ID</span>
                                        <span className="font-medium text-blue-600">
                                            {policy.policyData.policyId || policy.policyId || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Validity</span>
                                        <span className="font-medium">
                                            {policy.endDate ? `${policy.daysLeft} days left` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                
                                {policy.endDate && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Expires: {new Date(policy.endDate).toLocaleDateString()}</span>
                                            <span>{policy.daysLeft} days</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-600 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, (policy.daysLeft / 365) * 100))}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        Holder: {policy.policyData.policyHolder?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                        No active {activeTab} policies found.
                    </p>
                </div>
            )}

            {/* Other Policies (Expired/Inactive) - Table View */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {activeTab === 'doctor' ? 'Doctor' : 'Hospital'} Policy History
                    </h2>
                    <p className="text-sm text-gray-600">All {activeTab} policies (expired/inactive)</p>
                </div>

                {otherPolicies.length > 0 ? (
                    <>
                        {/* Mobile View - Card Layout */}
                        <div className="block sm:hidden p-4 space-y-4">
                            {otherPolicies.map((policy) => (
                                <div key={policy._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Policy No</p>
                                            <p className="text-sm font-medium text-blue-600">
                                                {policy.policyData.policyNumber || policy.policyNumber || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Company</p>
                                            <p className="text-sm text-gray-900">
                                                {policy.insuranceCompany?.companyName || policy.company || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Cover</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                ₹{policy.policyData.coverageAmount?.toLocaleString() || 
                                                   policy.coverageAmount?.toLocaleString() || 
                                                   policy.coverage_amount?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Premium</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                ₹{policy.policyData.premiumAmount?.toLocaleString() || 
                                                   policy.premiumAmount?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Start Date</p>
                                            <p className="text-sm text-gray-900">
                                                {policy.policyData.startDate || policy.startDate ? 
                                                    new Date(policy.policyData.startDate || policy.startDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">End Date</p>
                                            <p className="text-sm text-gray-900">
                                                {policy.endDate ? new Date(policy.endDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                                                ${policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {policy.policyData.status || policy.status || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Days Left</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {policy.endDate ? policy.daysLeft : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    {policy.endDate && (
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        policy.isActive ? 'bg-teal-600' : 'bg-gray-400'
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, (policy.daysLeft / 365) * 100))}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-center">
                                                {policy.daysLeft > 0 ? `${policy.daysLeft} days remaining` : 'Expired'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Layout */}
                        <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Policy No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cover</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Premium</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Start Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">End Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Days Left</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {otherPolicies.map((policy) => (
                                        <tr key={policy._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {policy.policyData.policyNumber || policy.policyNumber || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {policy.insuranceCompany?.companyName || policy.company || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{policy.policyData.coverageAmount?.toLocaleString() || 
                                                   policy.coverageAmount?.toLocaleString() || 
                                                   policy.coverage_amount?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{policy.policyData.premiumAmount?.toLocaleString() || 
                                                   policy.premiumAmount?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {policy.policyData.startDate || policy.startDate ? 
                                                    new Date(policy.policyData.startDate || policy.startDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {policy.endDate ? new Date(policy.endDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full whitespace-nowrap
                                                    ${policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {policy.policyData.status || policy.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-medium text-gray-900 mb-2">
                                                        {policy.endDate ? policy.daysLeft : 'N/A'} days
                                                    </span>
                                                    {policy.endDate && (
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    policy.isActive ? 'bg-teal-600' : 'bg-gray-400'
                                                                }`}
                                                                style={{
                                                                    width: `${Math.min(100, Math.max(0, (policy.daysLeft / 365) * 100))}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No {activeTab} policy history found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPolicies;