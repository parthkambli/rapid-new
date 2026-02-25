import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const YearlyDoctorList = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchYearlyDoctors();
    }, []);

    const fetchYearlyDoctors = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(apiEndpoints.adminDashboard.yearlyDoctors);
            if (response.data.success) {
                setDoctors(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching yearly doctors:", err);
            setError("Failed to load yearly doctors");
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const totalPages = Math.ceil(doctors.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentDoctors = doctors.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading yearly doctors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Yearly Doctors</h1>
                    <p className="text-sm text-gray-600 mt-1">Total: {doctors.length} doctors added this year</p>
                </div>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentDoctors.length > 0 ? currentDoctors.map((doctor, index) => (
                                <tr key={doctor._id || index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{doctor.doctorId || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{doctor.fullName || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{doctor.phoneNumber || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{doctor.hospitalName || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{doctor.specialization?.[0] || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${doctor.doctorType === 'hospital' ? 'bg-purple-100 text-purple-800' :
                                            doctor.doctorType === 'individual' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {doctor.doctorType || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div>
                                            <div className="font-medium">{doctor.createdBy?.fullName || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{doctor.createdBy?.role || ''}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                        No doctors found for this year
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {startIndex + 1} to {Math.min(endIndex, doctors.length)} of {doctors.length} results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default YearlyDoctorList;
