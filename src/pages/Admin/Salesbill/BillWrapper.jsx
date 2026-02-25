// import React from "react";
// import YearlyInvoice from "./Invoices/YearlyBill";
// import MonthlyInvoice from "./Invoices/MonthlyBill";

// export default function Wrapper({ membershipType }) {
//   return (
//     <div>
//       {membershipType === "Yearly" && <YearlyInvoice />}
//       {membershipType === "Monthly" && <MonthlyInvoice />}
//     </div>
//   );
// }























import React, { useEffect, useState ,useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import YearlyInvoice from "./Invoices/YearlyBill";
import MonthlyInvoice from "./Invoices/MonthlyBill";


export default function SalesBillPrintWrapper() {
  const { id } = useParams(); // bill ka _id from URL
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasPrinted = useRef(false);
  const printTriggered = useRef(false);

  useEffect(() => {
    const fetchBill = async () => {
      if (!id) {
        toast.error("Invalid bill ID");
        navigate("/admin/salesbill/list");
        return;
      }

      try {
        setLoading(true);
    const response = await apiClient.get(apiEndpoints.salesBills.get(id));

        if (response.data.success) {
          setBill(response.data.data);

          // // Optional: Auto trigger print after 800ms (user ko wait na karna pade)
          // setTimeout(() => {
          //   window.print();
          // }, 800);

        } else {
          toast.error("Bill not found");
          navigate("/admin/salesbill/list");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bill");
        navigate("/admin/salesbill/list");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);


// Yeh wala effect sirf tab chalega jab bill load ho jayega
  useEffect(() => {
    if (!bill || loading) return;

    // Yeh line magic hai — agar URL mein already ?printed=true hai toh print nahi karega
    if (printTriggered.current || window.location.search.includes("printed=true")) {
      return;
    }

    printTriggered.current = true;

    // Thodi der baad print karo aur URL mein flag laga do
    const timer = setTimeout(() => {
      window.print();

      // Print hone ke baad URL mein flag daal do taaki back/refresh pe dobara na ho
      window.history.replaceState({}, "", `${window.location.pathname}?printed=true`);
    }, 800);

    return () => clearTimeout(timer);
  }, [bill, loading]);
  
  // Agar bill nahi mila ya loading hai
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <LoadingSpinner size="large" /> */}
        <span className="ml-3 text-lg">Loading invoice...</span>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Bill not found!
      </div>
    );
  }

  // Yeh decide karega kaunsa invoice render hoga
  const membershipType = bill.membershipType; // "monthly", "yearly", ya null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print-only header (browser mein print karte waqt dikhega) */}
    
      {/* Actual Invoice */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {membershipType === "yearly" && <YearlyInvoice bill={bill} />}
        {membershipType === "monthly" && <MonthlyInvoice bill={bill} />}
        
        {/* Agar membershipType null hai ya "one-time" hai */}
        {(membershipType === null || !membershipType) && <OneTimeInvoice bill={bill} />}

        {/* Fallback agar kuch bhi match na kare */}
        {!["monthly", "yearly"].includes(membershipType) && membershipType !== null && (
          <div className="p-10 text-center">
            <p className="text-xl text-gray-600">Invoice format not configured for this membership type.</p>
            <p className="text-sm text-gray-500 mt-2">Membership Type: {membershipType || "None"}</p>
          </div>
        )}
      </div>

      {/* Print button (screen pe dikhega, print mein nahi) */}
      <div className="text-center py-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-[#398C89] text-white rounded-lg hover:bg-[#2e706e] font-medium shadow-md"
        >
          Print Invoice
        </button>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}