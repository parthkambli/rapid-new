// import React, { useState } from "react";
// import Table from "../../../components/mainComponents/Table";

// const TargetStatus = () => {
//   const [activeTab, setActiveTab] = useState("Pending");

//   // Dummy data for each tab
//   const data = {
//     Pending: [
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Hot", status: "Pending" },
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Hot", status: "Pending" },
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Normal", status: "Pending" },
//     ],
//     Confirmed: [
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Hot", status: "Confirmed" },
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Normal", status: "Confirmed" },
//     ],
//     Approved: [
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Hot", status: "Approved" },
//       { name: "Dr. Ram Kumar", hospital: "City Hospital", location: "Vasai West", typeOfEnquiries: "Normal", status: "Approved" },
//     ],
//   };

//   // Actions for table
//   const actions = [
//     { label: "View", icon: <span>👁️</span>, onClick: () => console.log("View clicked") },
//     { label: "Edit", icon: <span>✏️</span>, onClick: () => console.log("Edit clicked") },
//   ];

//   // Navigation from dashboard
//   const handleNavigateFromDashboard = (status) => {
//     setActiveTab(status);
//   };

//   // Extra columns for status
//   const extraColumns = [
//     {
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`px-2 py-1 rounded ${
//             row.status === "Pending" ? "bg-yellow-200" : row.status === "Confirmed" ? "bg-blue-200" : "bg-green-200"
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       {/* Tabs */}
//       <div className="flex space-x-4 mb-4">
//         {["Pending", "Confirmed", "Approved"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded ${
//               activeTab === tab ? "bg-white text-black" : "bg-[#15BBB3] text-white"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <Table
//         data={data[activeTab]}
//         actions={actions}
//         extraColumns={extraColumns}
//         expandedRow={() => null}
//       />
//     </div>
//   );
// };

// export default TargetStatus;




import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const TargetStatus = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [data, setData] = useState({
    Pending: [],
    Confirmed: [],
    Approved: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTargetData();
  }, []);

  const fetchTargetData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiEndpoints.doctors.list}`); // Fetch doctors with target data

      if (response.data.success) {
        // Group doctors by status
        const allDoctors = response.data.data;

        const pending = allDoctors.filter(doctor =>
          doctor.status === 'pending' ||
          doctor.followupStatus === 'pending' ||
          (doctor.targetStatus && doctor.targetStatus.toLowerCase() === 'pending')
        ).map(doctor => ({
          name: doctor.name || doctor.fullName || doctor.doctorName,
          hospital: doctor.hospitalName,
          location: doctor.address || "N/A",
          typeOfEnquiries: doctor.enquiryType || doctor.leadType || "Normal",
          status: doctor.targetStatus || doctor.status || "Pending",
          _id: doctor._id
        }));

        const confirmed = allDoctors.filter(doctor =>
          doctor.status === 'confirmed' ||
          doctor.followupStatus === 'confirmed' ||
          (doctor.targetStatus && doctor.targetStatus.toLowerCase() === 'confirmed')
        ).map(doctor => ({
          name: doctor.name || doctor.fullName || doctor.doctorName,
          hospital: doctor.hospitalName,
          location: doctor.address || "N/A",
          typeOfEnquiries: doctor.enquiryType || doctor.leadType || "Normal",
          status: doctor.targetStatus || doctor.status || "Confirmed",
          _id: doctor._id
        }));

        const approved = allDoctors.filter(doctor =>
          doctor.status === 'approved' ||
          doctor.followupStatus === 'approved' ||
          (doctor.targetStatus && doctor.targetStatus.toLowerCase() === 'approved')
        ).map(doctor => ({
          name: doctor.name || doctor.fullName || doctor.doctorName,
          hospital: doctor.hospitalName,
          location: doctor.address || "N/A",
          typeOfEnquiries: doctor.enquiryType || doctor.leadType || "Normal",
          status: doctor.targetStatus || doctor.status || "Approved",
          _id: doctor._id
        }));

        setData({
          Pending: pending,
          Confirmed: confirmed,
          Approved: approved
        });
      } else {
        toast.error("Failed to load target data");
      }
    } catch (error) {
      console.error("Error fetching target data:", error);
      setError("Failed to load target data");
      toast.error("Failed to load target data");
    } finally {
      setLoading(false);
    }
  };

  // Actions for table
  const actions = [
    {
      label: "View",
      icon: <span>👁️</span>,
      onClick: (row) => {
        console.log("View clicked", row);
        // Add navigation to view doctor details
      }
    },
    {
      label: "Edit",
      icon: <span>✏️</span>,
      onClick: (row) => {
        console.log("Edit clicked", row);
        // Add navigation to edit doctor
      }
    },
  ];

  // Navigation from dashboard
  const handleNavigateFromDashboard = (status) => {
    setActiveTab(status);
  };

  // Extra columns for status
  const extraColumns = [
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded ${
            row.status === "Pending" ? "bg-yellow-200" : row.status === "Confirmed" ? "bg-blue-200" : "bg-green-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading target status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mt-4">Target Status</h2> <br />
        <div className="text-red-500 text-center p-4 bg-red-50 rounded">
          {error}
          <button
            onClick={fetchTargetData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Tabs */}
      <h2 className="text-2xl font-semibold mt-4">Target Status</h2> <br />
      <div className="flex flex-wrap justify-end items-center mb-4 w-full overflow-x-auto">
        {["Pending", "Confirmed", "Approved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded mr-2 mb-2 ${
              activeTab === tab ? "bg-white text-black" : "bg-[#15BBB3] text-white"
            } whitespace-nowrap`}
          >
            {tab} ({data[tab].length})
          </button>
        ))}
      </div>

      {/* Table */}
      <Table
        data={data[activeTab]}
        actions={actions}
        extraColumns={extraColumns}
        expandedRow={() => null}
      />
    </div>
  );
};

export default TargetStatus;