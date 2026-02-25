// // src/pages/Admin/Experts/ViewExpertBill.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { format } from "date-fns";

const ViewExpertBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiClient.get(apiEndpoints.expertBills.get(id));
      setBill(res.data.data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Expert Bill Details</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/admin/edit-expert-bill/${id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Edit
          </button>
          <button onClick={() => navigate("/admin/expert-bills")} className="px-4 py-2 bg-gray-600 text-white rounded-md">
            Back  
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p><strong>Expert:</strong> {bill.expert?.fullName || bill.expert?.name}</p>
            <p><strong>Doctor:</strong> {bill.doctor?.fullName}</p>
            <p><strong>Case No:</strong> {bill.caseNo}</p>
            <p><strong>Case Type:</strong> {bill.caseType}</p>
          </div>
          <div>
            <p><strong>Date:</strong> {format(new Date(bill.createdAt), "dd/MM/yyyy")}</p>
            <p><strong>Remark:</strong> {bill.remark || "-"}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3">Stages</h3>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Stage</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">GST %</th>
              <th className="p-3 text-left">GST Amt</th>
            </tr>
          </thead>
          <tbody>
            {bill.stages.map((s) => (
              <tr key={s._id}>
                <td className="p-3">{s.stage}</td>
                <td className="p-3">₹{s.amount}</td>
                <td className="p-3">{s.gstPercent}%</td>
                <td className="p-3">₹{s.gstAmount || ((s.amount * s.gstPercent) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-5 gap-4 mt-6 p-4 bg-gray-50 rounded">
          <div><strong>Subtotal</strong> ₹{bill.totals?.subtotal?.toFixed(2)}</div>
          <div><strong>GST</strong> ₹{bill.totals?.gstTotal?.toFixed(2)}</div>
          <div><strong>Other</strong> ₹{bill.otherCharges}</div>
          <div><strong>Discount</strong> -₹{bill.discount}</div>
          <div className="text-lg font-bold text-green-600"><strong>Final</strong> ₹{bill.totals?.finalTotal?.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpertBill;