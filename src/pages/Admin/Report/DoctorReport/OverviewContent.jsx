// src/pages/OverviewContent.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function OverviewContent() {
//   const { id } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     totalReceipts: 0,
//     quotations: 0,
//     policies: 0,
//   });
//   const [recentNotes, setRecentNotes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch doctor/hospital details (this includes salesBills & policies)
//         const doctorResponse = await apiClient.get(
//           apiEndpoints.doctors.get(id),
//         );
//         const doctorData =
//           doctorResponse.data.data || doctorResponse.data || {};

//         // Membership fallback/inference
//         let membership = "N/A";
//         try {
//           const reportRes = await apiClient.get("/reports/doctors", {
//             params: { id, limit: 1 },
//           });
//           const reportItem = reportRes?.data?.data?.[0];
//           if (reportItem?.membership) {
//             membership = reportItem.membership;
//           }
//         } catch {
//           if (doctorData.doctorType === "hospital_individual") {
//             membership = "Hospital + Individual";
//           } else if (
//             doctorData.doctorType === "hospital" ||
//             doctorData.hospitalName
//           ) {
//             membership = "Hospital";
//           } else {
//             membership = "Individual";
//           }
//         }

//         const enhancedDoctor = { ...doctorData, membership };

//         // Use salesBills from doctor object
//         const salesBills = enhancedDoctor.salesBills || [];
//         const totalSales = salesBills.reduce((sum, bill) => {
//           // Try different possible fields for amount
//           return (
//             sum +
//             (bill.totalAmount || bill.billId?.totalAmount || bill.amount || 0)
//           );
//         }, 0);

//         // Receipts - separate call (not in doctor object)
//         let totalReceipts = 0;
//         try {
//           const receiptsRes = await apiClient.get(apiEndpoints.receipts.list, {
//             params: { doctor: id },
//           });
//           const receipts = receiptsRes.data.data || [];
//           totalReceipts = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
//         } catch (err) {
//           console.warn("Receipts fetch failed:", err);
//         }

//         // Quotations - separate call
//         let quotationsCount = 0;
//         try {
//           const quotRes = await apiClient.get(apiEndpoints.quotations.list, {
//             params: { doctor: id },
//           });
//           quotationsCount = (quotRes.data.data || []).length;
//         } catch (err) {
//           console.warn("Quotations fetch failed:", err);
//         }

//         // Policies - use from doctor object
//         const policies = enhancedDoctor.policies || [];
//         const policiesCount = policies.length;

//         const finalSummary = {
//           totalSales: Math.round(totalSales),
//           totalReceipts: Math.round(totalReceipts),
//           quotations: quotationsCount,
//           policies: policiesCount,
//         };

//         console.log("Quick Summary from data:", finalSummary);
//         console.log("Sales bills used:", salesBills); // debug

//         setDoctor(enhancedDoctor);
//         setSummary(finalSummary);

//         // Recent notes from followUps
//         if (
//           enhancedDoctor.followUps &&
//           Array.isArray(enhancedDoctor.followUps)
//         ) {
//           const sorted = enhancedDoctor.followUps
//             .sort((a, b) => new Date(b.date) - new Date(a.date))
//             .slice(0, 5);
//           setRecentNotes(sorted);
//         }
//       } catch (error) {
//         console.error("Error fetching overview:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   if (loading) {
//     return <div className="p-6 text-center">Loading...</div>;
//   }

//   if (!doctor) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Doctor data not found.
//       </div>
//     );
//   }

//   const city =
//     doctor.contactDetails?.currentAddress?.city ||
//     doctor.hospitalAddress?.city ||
//     "N/A";
//   const hospital = doctor.hospitalName || "";
//   const namePrefix = doctor.doctorType?.includes("hospital") ? "" : "Dr. ";

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       {/* Doctor Info Row */}
//       <div className="grid grid-cols-3 gap-8 mb-8 pb-6 border-b border-gray-200">
//         <div>
//           <div className="text-sm text-gray-500">Doctor ID</div>
//           <div className="text-base font-medium mt-1">
//             {doctor.doctorId || "N/A"}
//           </div>
//         </div>
//         <div>
//           <div className="text-sm text-gray-500">Specialty</div>
//           <div className="text-base font-medium mt-1">
//             {doctor.specialization?.join(", ") || "N/A"}
//           </div>
//         </div>
//         <div>
//           <div className="text-sm text-gray-500">Membership</div>
//           <div className="text-base font-medium mt-1">
//             {doctor.membership || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Notes */}
//         <div>
//           <h3 className="text-base font-semibold text-gray-900 mb-4">
//             Recent Notes
//           </h3>
//           <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 min-h-[220px]">
//             {recentNotes.length > 0 ? (
//               <div className="space-y-5">
//                 {recentNotes.map((note, index) => (
//                   <div key={index} className="text-sm">
//                     <div className="text-gray-800">
//                       {new Date(note.date)
//                         .toLocaleString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                           hour: "numeric",
//                           minute: "2-digit",
//                           hour12: true,
//                         })
//                         .replace(",", "")}{" "}
//                       — {note.createdBy?.fullName || "System"}
//                     </div>
//                     <div className="text-gray-600 mt-1 pl-3 border-l-2 border-gray-300">
//                       {note.notes || note.remarks || "No remarks"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-gray-500 italic py-4">
//                 No recent notes available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Summary */}
//         <div>
//           <h3 className="text-base font-semibold text-gray-900 mb-4">
//             Quick Summary
//           </h3>
//           <div className="bg-[#E8EFEF] p-5 rounded-lg border border-teal-100 min-h-[220px] flex flex-col justify-center">
//             <div className="space-y-4 text-sm font-medium text-gray-800">
//               <div className="flex justify-between">
//                 <span>Total Sales</span>
//                 <span>
//                   ₹{summary.totalSales.toLocaleString("en-IN") || "0"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Total Receipts</span>
//                 <span>
//                   ₹{summary.totalReceipts.toLocaleString("en-IN") || "0"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Quotations</span>
//                 <span>{summary.quotations || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Policies</span>
//                 <span>{summary.policies || 0}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/OverviewContent.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";

export default function OverviewContent() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [overview, setOverview] = useState({
    totalSalesBills: 0,
    totalReceipts: 0,
    totalQuotations: 0,
    totalPolicies: 0,
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOverviewData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        // Option A: If you have a dedicated overview endpoint (recommended)
        // const overviewRes = await apiClient.get(`/doctors/${id}/overview`);
        // const overviewData = overviewRes.data?.overview || {};

        // Option B: Assuming data comes embedded in the main doctor response
        const doctorRes = await apiClient.get(
          apiEndpoints.doctors.getWithSpouse(id),
        );
        const rawDoctor = doctorRes.data?.data || doctorRes.data || {};

        // Extract overview – adjust path according to your actual response structure
        const overviewData = rawDoctor.overview || {
          totalSalesBills: 0,
          totalReceipts: 0,
          totalQuotations: 0,
          totalPolicies: 0,
        };

        // Optional: fallback to calculated values if overview is missing
        let fallbackSales = 0;
        if (!overviewData.totalSalesBills && rawDoctor.salesBills) {
          const bills = Array.isArray(rawDoctor.salesBills)
            ? rawDoctor.salesBills
            : [];
          fallbackSales = bills.reduce((sum, bill) => {
            const amount =
              bill.totalAmount ??
              bill.billId?.totalAmount ??
              bill.amount ??
              bill.total ??
              0;
            return sum + Number(amount);
          }, 0);
        }

        // Final overview values (prefer API-provided, fallback to calculation if needed)
        setOverview({
          totalSalesBills: Number(
            overviewData.totalSalesBills ?? fallbackSales ?? 0,
          ),
          totalReceipts: Number(overviewData.totalReceipts ?? 0),
          totalQuotations: Number(overviewData.totalQuotations ?? 0),
          totalPolicies: Number(
            overviewData.totalPolicies ??
              (Array.isArray(rawDoctor.policies)
                ? rawDoctor.policies.length
                : 0),
          ),
        });

        // Doctor data
        const membership =
          rawDoctor.doctorType === "hospital_individual"
            ? "Hospital + Individual"
            : rawDoctor.doctorType === "hospital" || rawDoctor.hospitalName
              ? "Hospital"
              : "Individual";

        setDoctor({
          ...rawDoctor,
          membership,
        });

        // Recent notes (latest 5)
        if (
          Array.isArray(rawDoctor.followUps) &&
          rawDoctor.followUps.length > 0
        ) {
          const sortedNotes = [...rawDoctor.followUps]
            .sort((a, b) => {
              const dateA = new Date(a.date || a.createdAt || 0);
              const dateB = new Date(b.date || b.createdAt || 0);
              return dateB - dateA;
            })
            .slice(0, 5);

          setRecentNotes(sortedNotes);
        }
      } catch (err) {
        console.error("Failed to load doctor overview:", err);
        setFetchError(
          "Could not load doctor information. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [id]);

  // ────────────────────────────────────────────────
  //                RENDERING
  // ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading doctor overview...
      </div>
    );
  }

  if (!doctor && fetchError) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
        {fetchError}
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-8 text-center text-gray-500">
        Doctor profile not found.
      </div>
    );
  }

  const city =
    doctor.contactDetails?.currentAddress?.city ||
    doctor.hospitalAddress?.city ||
    doctor.address?.city ||
    "—";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {fetchError && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
          {fetchError}
        </div>
      )}

      {/* Basic Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-6 border-b border-gray-200">
        <div>
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Doctor ID
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {doctor.doctorId || "—"}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Specialty
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {doctor.specialization?.join(", ") || "—"}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Membership
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {doctor.membership || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Notes
          </h3>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 min-h-[240px]">
            {recentNotes.length > 0 ? (
              <div className="space-y-5">
                {recentNotes.map((note, index) => (
                  <div key={note._id || index} className="text-sm">
                    <div className="text-gray-700 font-medium">
                      {new Date(note.date || note.createdAt).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}{" "}
                      — {note.createdBy?.fullName || "System"}
                    </div>
                    <div className="mt-1 pl-3 border-l-2 border-gray-300 text-gray-600">
                      {note.notes || note.remarks || note.comment || "—"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic py-8 text-center">
                No recent notes available
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary – now using overview data */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Financial Summary
          </h3>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-6 min-h-[240px] flex flex-col justify-center">
            <div className="space-y-5 text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Sales Bills</span>
                <span className="font-semibold text-gray-900">
                  {overview.totalSalesBills.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Receipts</span>
                <span className="font-semibold text-gray-900">
                  {overview.totalReceipts.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Quotations</span>
                <span className="font-semibold text-gray-900">
                  {overview.totalQuotations.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Policies</span>
                <span className="font-semibold text-gray-900">
                  {overview.totalPolicies.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
