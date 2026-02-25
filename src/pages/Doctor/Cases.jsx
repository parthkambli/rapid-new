// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorCases = () => {
//     const [loading, setLoading] = useState(true);
//     const [cases, setCases] = useState([]);

//     useEffect(() => {
//         const fetchCases = async () => {
//             try {
//                 // Get the logged-in user info to get doctor ID
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

//                     if (doctorId) {
//                         // Use the new dedicated endpoint that handles linked/spouse doctors automatically
//                         try {
//                             const response = await apiClient.get(apiEndpoints.doctors.getQueryCases(doctorId));
//                             if (response.data.success) {
//                                 setCases(response.data.data || []);
//                             } else {
//                                 console.error('Failed to fetch doctor query cases:', response.data.message);
//                                 setCases([]);
//                             }
//                         } catch (err) {
//                             console.error('Error fetching doctor query cases:', err.message);

//                             // Fallback: try to get cases from user response as before
//                             const cases = userResponse.data.user?.doctor?.queryCases || [];
//                             setCases(cases);
//                         }
//                     } else {
//                         console.error('Could not determine doctor ID for fetching cases');
//                         setCases([]);
//                     }
//                 } else {
//                     console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
//                     setCases([]);
//                 }
//             } catch (err) {
//                 console.error('Error fetching cases:', err);
//                 setCases([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCases();
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
//                 <h1 className="text-2xl font-bold text-gray-900">Case List</h1>
//                 <p className="text-gray-600">View and track your cases</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {cases.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Stage</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {cases.map((item) => (
//                                     <tr key={item._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.caseId || item.caseNo || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.caseType || item.queryType || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                         ${item.status === 'Open' || item.status === 'open' ? 'bg-green-100 text-green-800' :
//                           item.status === 'Pending' || item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           item.status === 'Closed' || item.status === 'closed' ? 'bg-red-100 text-red-800' :
//                           'bg-gray-100 text-gray-800'}`}>
//                                                 {item.status || 'N/A'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.caseStage || item.stage || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {(item.nextDate || item.next_date) ?
//                                                 new Date(item.nextDate || item.next_date).toLocaleDateString('en-GB', {
//                                                     day: '2-digit',
//                                                     month: '2-digit',
//                                                     year: 'numeric'
//                                                 }) : 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                             <button
//                                                 onClick={() => window.location.href = `/doctor/view-case/${item._id}`}
//                                                 className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
//                                             >
//                                                 View
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="p-8 text-center text-gray-500">
//                         No cases found.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DoctorCases;




import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorCases = () => {
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                // Get the logged-in user info to get doctor ID
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

                    if (doctorId) {
                        // Use the new dedicated endpoint that handles linked/spouse doctors automatically
                        try {
                            const response = await apiClient.get(apiEndpoints.doctors.getQueryCases(doctorId));
                            if (response.data.success) {
                                setCases(response.data.data || []);
                            } else {
                                console.error('Failed to fetch doctor query cases:', response.data.message);
                                setCases([]);
                            }
                        } catch (err) {
                            console.error('Error fetching doctor query cases:', err.message);

                            // Fallback: try to get cases from user response as before
                            const cases = userResponse.data.user?.doctor?.queryCases || [];
                            setCases(cases);
                        }
                    } else {
                        console.error('Could not determine doctor ID for fetching cases');
                        setCases([]);
                    }
                } else {
                    console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
                    setCases([]);
                }
            } catch (err) {
                console.error('Error fetching cases:', err);
                setCases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

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
                <h1 className="text-2xl font-bold text-gray-900">Case List</h1>
                <p className="text-gray-600">View and track your cases</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {cases.length > 0 ? (
                    <>
                        {/* Mobile View - Card Layout */}
                        <div className="block sm:hidden p-4 space-y-4">
                            {cases.map((item) => (
                                <div key={item._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Case ID</p>
                                            <p className="text-sm font-medium text-blue-600">
                                                {item.caseId || item.caseNo || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Type</p>
                                            <p className="text-sm text-gray-900">
                                                {item.caseType || item.queryType || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Case Stage</p>
                                            <p className="text-sm text-gray-900">
                                                {item.caseStage || item.stage || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Next Date</p>
                                            <p className="text-sm text-gray-900">
                                                {(item.nextDate || item.next_date) ?
                                                    new Date(item.nextDate || item.next_date).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                                                ${item.status === 'Open' || item.status === 'open' ? 'bg-green-100 text-green-800' :
                                                  item.status === 'Pending' || item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                  item.status === 'Closed' || item.status === 'closed' ? 'bg-red-100 text-red-800' :
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {item.status || 'N/A'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = `/doctor/view-case/${item._id}`}
                                            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                                        >
                                            View Case
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Layout */}
                        <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Case ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Case Stage</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Next Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cases.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {item.caseId || item.caseNo || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.caseType || item.queryType || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full whitespace-nowrap
                                                    ${item.status === 'Open' || item.status === 'open' ? 'bg-green-100 text-green-800' :
                                                      item.status === 'Pending' || item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                      item.status === 'Closed' || item.status === 'closed' ? 'bg-red-100 text-red-800' :
                                                      'bg-gray-100 text-gray-800'}`}>
                                                    {item.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.caseStage || item.stage || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(item.nextDate || item.next_date) ?
                                                    new Date(item.nextDate || item.next_date).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => window.location.href = `/doctor/view-case/${item._id}`}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No cases found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorCases;