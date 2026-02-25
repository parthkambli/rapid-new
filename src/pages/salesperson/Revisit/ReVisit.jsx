import React from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";


const ReVisit = () => {
  const data = [
    {
      drName: "Dr. Ram Kumar",
      hospitalName: "City Hospital",
      address: "Vasai West",
      revisitDate: "2023-10-15",
    },
    {
      drName: "Dr. Sita Sharma",
      hospitalName: "LifeCare Hospital",
      address: "Virar East",
      revisitDate: "2023-11-05",
    },
    {
      drName: "Dr. Mohan Das",
      hospitalName: "Global Hospital",
      address: "Nallasopara",
      revisitDate: "2023-09-22",
    },
    {
      drName: "Dr. Anita Verma",
      hospitalName: "Metro Hospital",
      address: "Mira Road",
      revisitDate: "2023-12-01",
    },
  ];


const navigate = useNavigate();


  // Actions config (pass to Table)
  const actions = [
    {
      label: "View",
      onClick: (row) => {
        alert(`Viewing details of ${row.drName}`);
        // 🔹 Future: open modal here
      },
    },
    // {
    //   label: "Edit",
    //   onClick: (row) => {
    //     alert(`Editing details of ${row.drName}`);
    //     // 🔹 Future: navigate to edit page
    //   },
    // },


{
  label: "Edit",
  onClick: (row) => {
    // navigate to edit page with row id
    navigate(`/sales/edit-revisit/${row.drName}`); // Assuming drName is unique identifier
  },
}


  ];

  return (
    <div className="p-6 ">
      <h1 className="text-xl font-bold mb-4">Re-Visit Doctors List</h1>
      <Table data={data} actions={actions} />
    </div>
  );
};

export default ReVisit;







