// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorPayments = () => {
//     const [loading, setLoading] = useState(true);
//     const [receipts, setReceipts] = useState([]);

//     useEffect(() => {
//         const fetchReceipts = async () => {
//             try {
//                 // Fetch user info to get doctor ID
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
//                         // Fetch all receipts first
//                         const response = await apiClient.get(apiEndpoints.receipts.list);

//                         if (response.data.success) {
//                             // The response contains data array with receipts
//                             const allReceipts = Array.isArray(response.data.data) ? response.data.data : [];

//                             // Filter receipts for current doctor and their linked doctor (if applicable)
//                             const doctorReceipts = allReceipts.filter(receipt => {
//                                 // Check if the receipt belongs to this doctor using multiple possible fields
//                                 const receiptOwnerId = receipt.payer?.entityId?._id;
//                                 // Linked doctor ID (the spouse/linked doctor)
//                                 const receiptLinkedDoctorId = receipt.payer?.entityId?.linkedDoctorId;

//                                 // Include receipts where:
//                                 // 1. The receipt belongs to the current doctor (receiptOwnerId === doctorId)
//                                 // 2. The receipt belongs to the main doctor that the current doctor is linked to (receiptLinkedDoctorId === doctorId)
//                                 return receiptOwnerId === doctorId || receiptLinkedDoctorId === doctorId;
//                             });

//                             setReceipts(doctorReceipts);
//                         } else {
//                             console.error('Failed to fetch receipts:', response.data.message || 'Unknown error');
//                             setReceipts([]);
//                         }
//                     } else {
//                         console.error('Could not determine doctor ID for filtering receipts');
//                         setReceipts([]);
//                     }
//                 } else {
//                     console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
//                     setReceipts([]);
//                 }
//             } catch (err) {
//                 console.error('Error fetching receipts:', err);
//                 setReceipts([]); // Set empty array on error
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReceipts();
//     }, []);

//     const handleViewReceipt = (receiptId) => {
//         // Navigate to the doctor-specific receipt view page
//         window.open(`/doctor/view-receipt/${receiptId}`, '_blank');
//     };

//     const handleDownloadReceipt = (receiptId) => {
//         // For download, we'll use the print endpoint which generates a PDF-like view
//         window.open(`/doctor/print-receipt/${receiptId}`, '_blank');
//     };

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
//                 <h1 className="text-2xl font-bold text-gray-900">Receipts & Bills</h1>
//                 <p className="text-gray-600">View your receipts and bills</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {receipts.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {receipts.map((receipt) => (
//                                     <tr key={receipt._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {receipt.receiptDate
//                                                 ? `${new Date(receipt.receiptDate).toLocaleDateString()}`
//                                                 : receipt.startDate && receipt.endDate
//                                                     ? `${new Date(receipt.startDate).toLocaleDateString()} → ${new Date(receipt.endDate).toLocaleDateString()}`
//                                                     : receipt.period || 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{receipt.amount?.toLocaleString('en-IN') || '0'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{receipt.paymentMethod || receipt.mode || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                         ${receipt.status === 'received' || receipt.status === 'active' ? 'bg-green-100 text-green-800' :
//                                                     receipt.status === 'bounced' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                 {receipt.status || 'N/A'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                             <div className="flex space-x-2">
//                                                 <button
//                                                     onClick={() => handleViewReceipt(receipt._id)}
//                                                     className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
//                                                 >
//                                                     View
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDownloadReceipt(receipt._id)}
//                                                     className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
//                                                 >
//                                                     Download
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="p-8 text-center text-gray-500">
//                         No receipts found.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DoctorPayments;




import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorPayments = () => {
    const [loading, setLoading] = useState(true);
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                // Fetch user info to get doctor ID
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
                        // Fetch all receipts first
                        const response = await apiClient.get(apiEndpoints.receipts.list);

                        if (response.data.success) {
                            // The response contains data array with receipts
                            const allReceipts = Array.isArray(response.data.data) ? response.data.data : [];

                            // Filter receipts for current doctor and their linked doctor (if applicable)
                            const doctorReceipts = allReceipts.filter(receipt => {
                                // Check if the receipt belongs to this doctor using multiple possible fields
                                const receiptOwnerId = receipt.payer?.entityId?._id;
                                // Linked doctor ID (the spouse/linked doctor)
                                const receiptLinkedDoctorId = receipt.payer?.entityId?.linkedDoctorId;

                                // Include receipts where:
                                // 1. The receipt belongs to the current doctor (receiptOwnerId === doctorId)
                                // 2. The receipt belongs to the main doctor that the current doctor is linked to (receiptLinkedDoctorId === doctorId)
                                return receiptOwnerId === doctorId || receiptLinkedDoctorId === doctorId;
                            });

                            setReceipts(doctorReceipts);
                        } else {
                            console.error('Failed to fetch receipts:', response.data.message || 'Unknown error');
                            setReceipts([]);
                        }
                    } else {
                        console.error('Could not determine doctor ID for filtering receipts');
                        setReceipts([]);
                    }
                } else {
                    console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
                    setReceipts([]);
                }
            } catch (err) {
                console.error('Error fetching receipts:', err);
                setReceipts([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    const handleViewReceipt = (receiptId) => {
        // Navigate to the doctor-specific receipt view page
        window.open(`/doctor/view-receipt/${receiptId}`, '_blank');
    };

    const handleDownloadReceipt = (receiptId) => {
        // For download, we'll use the print endpoint which generates a PDF-like view
        window.open(`/doctor/print-receipt/${receiptId}`, '_blank');
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Receipts & Bills</h1>
                <p className="text-gray-600">View your receipts and bills</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {receipts.length > 0 ? (
                    <>
                        {/* Mobile View - Card Layout */}
                        <div className="block sm:hidden p-4 space-y-4">
                            {receipts.map((receipt) => (
                                <div key={receipt._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Receipt No</p>
                                            <p className="text-sm font-medium text-blue-600">
                                                {receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="text-sm text-gray-900">
                                                {receipt.receiptDate
                                                    ? `${new Date(receipt.receiptDate).toLocaleDateString()}`
                                                    : receipt.startDate && receipt.endDate
                                                        ? `${new Date(receipt.startDate).toLocaleDateString()} → ${new Date(receipt.endDate).toLocaleDateString()}`
                                                        : receipt.period || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                ₹{receipt.amount?.toLocaleString('en-IN') || '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Mode</p>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {receipt.paymentMethod || receipt.mode || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                                                ${receipt.status === 'received' || receipt.status === 'active' ? 'bg-green-100 text-green-800' :
                                                  receipt.status === 'bounced' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {receipt.status || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewReceipt(receipt._id)}
                                                className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownloadReceipt(receipt._id)}
                                                className="bg-green-500 text-white px-3 py-1.5 rounded text-xs hover:bg-green-600"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Layout */}
                        <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Receipt No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Mode</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {receipts.map((receipt) => (
                                        <tr key={receipt._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {receipt.receiptDate
                                                    ? `${new Date(receipt.receiptDate).toLocaleDateString()}`
                                                    : receipt.startDate && receipt.endDate
                                                        ? `${new Date(receipt.startDate).toLocaleDateString()} → ${new Date(receipt.endDate).toLocaleDateString()}`
                                                        : receipt.period || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{receipt.amount?.toLocaleString('en-IN') || '0'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                {receipt.paymentMethod || receipt.mode || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full whitespace-nowrap
                                                    ${receipt.status === 'received' || receipt.status === 'active' ? 'bg-green-100 text-green-800' :
                                                      receipt.status === 'bounced' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {receipt.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewReceipt(receipt._id)}
                                                        className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadReceipt(receipt._id)}
                                                        className="bg-green-500 text-white px-3 py-1.5 rounded text-xs hover:bg-green-600"
                                                    >
                                                        Download
                                                    </button>
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
                        No receipts found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPayments;