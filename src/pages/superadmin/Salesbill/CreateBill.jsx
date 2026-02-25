// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// const SalesBillForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctors, setDoctors] = useState([]);

//   const today = new Date().toISOString().split("T")[0];

//   // UI form state (matches the design in the screenshot)
//   const [formData, setFormData] = useState({
//     sbNo: "", // Optional manual SB No (billNumber)
//     sbDate: today,
//     type: "New", // New / Renewal etc.
//     oldSbNo: "",
//     doctorId: "",
//     membershipType: "Monthly",
//     membershipYear: "1",
//     particular: "",
//     amount: "",
//     expiry: "",
//     narration: "",
//     note: "",
//   });

//   // Fetch doctors with typeOfEnquiry = "closed" for the dropdown
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         // Using the list endpoint with query parameters to filter by typeOfEnquiry
//         const response = await apiClient.get(apiEndpoints.doctors.list, {
//           params: { limit: 1000, typeOfEnquiry: "closed" },
//         });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         toast.error("Failed to load doctors list");
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // Generic input change handler with special logic for doctor selection
//   const handleChange = async (e) => {
//     const { name, value } = e.target;

//     if (name === 'doctorId') {
//       // Update doctor ID
//       setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));

//       // If a doctor is selected, fetch their latest SB number
//       if (value) {
//         try {
//           // Find the latest sales bill for this doctor
//           const response = await apiClient.get(apiEndpoints.salesBills.list, {
//             params: {
//               'client.entityId': value,
//               limit: 1,
//               sort: '-createdAt' // Get the most recent bill
//             }
//           });

//           if (response.data.success && response.data.data && response.data.data.length > 0) {
//             const latestBill = response.data.data[0];
//             setFormData(prev => ({
//               ...prev,
//               doctorId: value,
//               oldSbNo: latestBill.billNumber || "" // Auto-populate old SB number
//             }));
//           } else {
//             // If no previous bills found, just update the doctor ID
//             setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));
//           }
//         } catch (error) {
//           console.error("Error fetching doctor's previous SB:", error);
//           // Still update the doctor ID but don't populate old SB No
//           setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));
//         }
//       }
//     } else {
//       // For other fields, just update normally
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation aligned with screenshot fields
//     if (!formData.doctorId) {
//       toast.error("Please select a Doctor");
//       return;
//     }
//     if (!formData.expiry) {
//       toast.error("Please select Expiry date");
//       return;
//     }
//     if (!formData.amount) {
//       toast.error("Please enter Amount");
//       return;
//     }

//     setLoading(true);

//     try {
//       const amount = parseFloat(formData.amount) || 0;
//       const membershipYears = parseInt(formData.membershipYear, 10) || 1;
//       const quantity = 1; // Single bill line as per simple UI
//       const lineTotal = amount * quantity;

//       const selectedDoctor = doctors.find((d) => d._id === formData.doctorId);

//       // Build backend payload compatible with SalesBill model
//       const billData = {
//         // Use manual SB No if given; otherwise backend will auto-generate
//         ...(formData.sbNo && { billNumber: formData.sbNo }),
//         billDate: formData.sbDate,
//         dueDate: formData.expiry,
//         client: {
//           type: "doctor",
//           name: selectedDoctor?.fullName || "",
//           entityId: formData.doctorId,
//         },
//         items: [
//           {
//             serviceType: "consultation",
//             description:
//               formData.particular ||
//               `${formData.membershipType} Membership - ${membershipYears} Year(s)`,
//             quantity,
//             unitPrice: amount,
//             discount: 0,
//             taxRate: 0,
//             amount: lineTotal,
//           },
//         ],
//         subTotal: lineTotal,
//         discountAmount: 0,
//         taxAmount: 0,
//         totalAmount: lineTotal,
//         paymentTerms: "30_days",
//         currency: "INR",
//         status: "draft",
//         outstandingAmount: lineTotal,
//         notes: formData.narration
//           ? `${formData.narration}${formData.note ? " - " + formData.note : ""}`
//           : formData.note,
//       };

//       const response = await apiClient.post(apiEndpoints.salesBills.create, billData);

//       if (response.data.success) {
//         toast.success("Sales Bill created successfully!");
//         navigate("/admin/salesbill/list");
//       } else {
//         toast.error(response.data.message || "Failed to create sales bill");
//       }
//     } catch (error) {
//       console.error("Error creating sales bill:", error);
//       toast.error(error.response?.data?.message || "Error creating sales bill");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/admin/salesbill/list");
//   };

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Bill</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Row 1: SB details & Doctor */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB No</label>
//             <input
//               type="text"
//               name="sbNo"
//               value={formData.sbNo}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="Auto if blank"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB Date</label>
//             <input
//               type="date"
//               name="sbDate"
//               value={formData.sbDate}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="New">New</option>
//               <option value="Renewal">Renewal</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Old SB No</label>
//             <input
//               type="text"
//               name="oldSbNo"
//               value={formData.oldSbNo}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Doctor</label>
//             <select
//               name="doctorId"
//               value={formData.doctorId}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="">
//                 {loadingDoctors ? "Loading..." : "Select Doctor"}
//               </option>
//               {doctors.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.fullName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Row 2: Membership & Particular */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Membership Type
//             </label>
//             <select
//               name="membershipType"
//               value={formData.membershipType}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="Monthly">Monthly</option>
//               <option value="Yearly">Yearly</option>
//               <option value="One-time">One-time</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Membership Year
//             </label>
//             <select
//               name="membershipYear"
//               value={formData.membershipYear}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
//                 <option key={year} value={year.toString()}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Particular
//             </label>
//             <input
//               type="text"
//               name="particular"
//               value={formData.particular}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="Note"
//             />
//           </div>
//         </div>

//         {/* Row 3: Amount, Expiry, Narration */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="0.00"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Expiry</label>
//             <input
//               type="date"
//               name="expiry"
//               value={formData.expiry}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Narration
//             </label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>
//         </div>

//         {/* Row 4: Note */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Note</label>
//           <textarea
//             name="note"
//             value={formData.note}
//             onChange={handleChange}
//             rows={3}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-start space-x-3 mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SalesBillForm;


























import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const SalesBillForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingPreviousBill, setFetchingPreviousBill] = useState(false); // Optional UX

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    sbNo: "",
    sbDate: today,
    type: "New",
    oldSbNo: "",
    doctorId: "",
    membershipType: "Monthly",
    membershipYear: "1",
    particular: "",
    amount: "",
    expiry: "",
    narration: "",
    note: "",
  });

  // Fetch only closed enquiry doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await apiClient.get(apiEndpoints.doctors.list, {
          params: { limit: 1000, typeOfEnquiry: "closed" },
        });
        setDoctors(response.data.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors list");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Main Change Handler
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "doctorId") {
      if (!value) {
        setFormData(prev => ({
          ...prev,
          doctorId: "",
          oldSbNo: "",
          type: "New",
        }));
        return;
      }

      // Reset first
      setFormData(prev => ({
        ...prev,
        doctorId: value,
        oldSbNo: "",
        type: "New",
      }));

      setFetchingPreviousBill(true);

      try {
        // Correct query to fetch only this doctor's previous bills
        const response = await apiClient.get(apiEndpoints.salesBills.list, {
          params: {
            // "client.entityId": value,      // This must match your backend field exactly
        "client.entityId._id": value,
            "client.type": "doctor",       // Extra safety
            limit: 1,
            sort: "-createdAt",
            status: { $ne: "cancelled" },  // Ignore cancelled bills
          },
        });

        const bills = response.data?.data || [];

        if (bills.length > 0) {
          const latestBill = bills[0];
          setFormData(prev => ({
            ...prev,
            doctorId: value,
            oldSbNo: latestBill.billNumber || "",
            type: "Renewal", // Auto set to Renewal
          }));
          toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
        } else {
          setFormData(prev => ({
            ...prev,
            doctorId: value,
            oldSbNo: "",
            type: "New",
          }));
          toast.info("New Membership Bill", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Error fetching previous bill:", error);
        toast.warn("Could not check previous bill");
        setFormData(prev => ({ ...prev, doctorId: value })); // Still keep doctor
      } finally {
        setFetchingPreviousBill(false);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Please select a Doctor");
    if (!formData.expiry) return toast.error("Please select Expiry date");
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      return toast.error("Please enter valid Amount");

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const years = parseInt(formData.membershipYear, 10) || 1;
      const selectedDoctor = doctors.find(d => d._id === formData.doctorId);

      const payload = {
        ...(formData.sbNo && { billNumber: formData.sbNo }),
        billDate: formData.sbDate,
        membershipType: formData.membershipType === "One-time" ? null : formData.membershipType === "Monthly" ? "monthly" : "yearly",
        dueDate: formData.expiry,
        client: {
          type: "doctor",
          name: selectedDoctor?.fullName || "Unknown Doctor",
          entityId: formData.doctorId,
        },
        items: [
          {
            serviceType: "consultation",
            description:
              formData.particular ||
              `${formData.membershipType} Membership - ${years} Year(s)`,
            quantity: 1,
            unitPrice: amount,
            discount: 0,
            taxRate: 0,
            amount: amount,
          },
        ],
        subTotal: amount,
        totalAmount: amount,
        outstandingAmount: amount,
        paymentTerms: "30_days",
        currency: "INR",
        status: "draft",
        notes: [formData.narration, formData.note].filter(Boolean).join(" - "),
      };

      const response = await apiClient.post(apiEndpoints.salesBills.create, payload);

      if (response.data.success) {
        toast.success(`Sales Bill ${formData.type === "Renewal" ? "Renewed" : "Created"} Successfully!`);
        navigate("/admin/salesbill/list");
      } else {
        toast.error(response.data.message || "Failed to create bill");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Error creating sales bill");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/salesbill/list");

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Sales Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SB No</label>
            <input
              type="text"
              name="sbNo"
              value={formData.sbNo}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SB Date</label>
            <input
              type="date"
              name="sbDate"
              value={formData.sbDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={formData.type}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 font-medium text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Old SB No</label>
            <input
              type="text"
              value={formData.oldSbNo}
              readOnly
              className={`mt-1 p-2 w-full border rounded-md font-medium ${
                formData.oldSbNo
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
              placeholder={formData.oldSbNo ? "" : "None"}
            />
            {fetchingPreviousBill && (
              <p className="text-xs text-blue-600 mt-1">Checking previous bill...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            >
              <option value="">{loadingDoctors ? "Loading..." : "Select Doctor"}</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.fullName} 
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Membership Type</label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="One-time">One-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years</label>
            <select
              name="membershipYear"
              value={formData.membershipYear}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Particular (Optional)</label>
            <input
              type="text"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              placeholder="Custom description (if any)"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="0.00"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date *</label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              min={today}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <input
              type="text"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              placeholder="Payment remarks"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Internal Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            placeholder="Any internal notes (not visible to doctor)"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Bill"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesBillForm;
























































