
// // components/QuotationController.jsx - REAL API VERSION
// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import apiClient, { apiEndpoints } from '../../../services/apiClient'; // Your API client
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [componentData, setComponentData] = useState(null);
//   const [quotationId, setQuotationId] = useState(null);
//   const [doctorData, setDoctorData] = useState(null);
//   const componentRef = useRef();
  
//   const location = useLocation();
//   const params = useParams();
//   const navigate = useNavigate();

//   console.log("📍 QuotationController - Params:", params);
//   console.log("📍 QuotationController - Location State:", location.state);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         let quotationData = null;
//         let doctorDetails = null;
//         let determinedType = 'hospital';
//         let idFromSource = null;
        
//         // CASE 1: Fetch by ID from URL (e.g., /quotation/12345)
//         if (params.id) {
//           console.log("📍 Fetching by ID from URL:", params.id);
//           idFromSource = params.id;
          
//           try {
//             // Fetch quotation by ID
//             const quoteResponse = await apiClient.get(apiEndpoints.quotations.get(params.id));
//             quotationData = quoteResponse.data.data;
//             console.log("📍 Quotation API Response:", quotationData);
            
//             // Get doctor ID from quotation
//             const entityId = quotationData.requester?.entityId;
//             // if (entityId) {
//             //   try {
//             //     const doctorResponse = await apiClient.get(`/doctors/${entityId}`);
//             //     doctorDetails = doctorResponse.data.data;
//             //     console.log("📍 Doctor API Response:", doctorDetails);
//             //   } catch (doctorError) {
//             //     console.warn("📍 Could not fetch doctor details:", doctorError);
//             //     // Continue with basic doctor info from quotation
//             //     doctorDetails = {
//             //       fullName: quotationData.requester?.name || "Doctor Name",
//             //       doctorType: quotationData.requester?.type || "individual"
//             //     };
//             //   }
//             // }


//             // Inside loadData function, yeh part replace karo:

// if (entityId) {
//   try {
//     const doctorResponse = await apiClient.get(`/doctors/${entityId}`);
//     doctorDetails = doctorResponse.data.data;
//     console.log("📍 Doctor API Response:", doctorDetails);
//   } catch (doctorError) {
//     console.warn("📍 Could not fetch doctor details (possibly null entityId):", doctorError);
//     // Safe fallback using quotation requester data
//     doctorDetails = {
//       fullName: quotationData.requester?.name || "Dr. Name Not Available",
//       hospitalName: quotationData.requester?.name || "Hospital Name",
//       hospitalAddress: { address: "", city: "", state: "", pinCode: "" },
//       specialization: ["General"],
//       hospitalDetails: { hospitalType: "General", beds: "N/A" },
//       doctorType: quotationData.requester?.type === 'hospital' ? 'hospital' : 'individual'
//     };
//   }
// } else {
//   console.warn("📍 No entityId in quotation, using requester data as fallback");
//   doctorDetails = {
//     fullName: quotationData.requester?.name || "Dr. Name Not Available",
//     hospitalName: quotationData.requester?.name || "Hospital Name",
//     hospitalAddress: { address: "", city: "", state: "", pinCode: "" },
//     specialization: ["General"],
//     hospitalDetails: { hospitalType: "General", beds: "N/A" },
//     doctorType: quotationData.requester?.type === 'hospital' ? 'hospital' : 'individual'
//   };
// }
            
//             // Determine membership type from doctor type
//             if (doctorDetails?.doctorType) {
//               determinedType = doctorDetails.doctorType === 'hospital' 
//                 ? 'hospital' 
//                 : doctorDetails.doctorType === 'hospital_individual' 
//                   ? 'combined' 
//                   : 'individual';
//             } else if (quotationData.requester?.type) {
//               determinedType = quotationData.requester.type; // 'hospital' or 'doctor'
//             }
            
//           } catch (quoteError) {
//             console.error("📍 Error fetching quotation:", quoteError);
//             toast.error('Failed to load quotation. Using demo data.');
//             // Fallback to demo
//             quotationData = getDemoQuotationData(params.id);
//             doctorDetails = getDemoDoctorData();
//           }
//         }
//         // CASE 2: Data from navigation state (CreateQuotation page)
//         else if (location.state) {
//           console.log("📍 Using location state data");
//           idFromSource = 'new_' + Date.now();
          
//           const { 
//             doctorData: formDoctorData, 
//             hospitalData, 
//             membershipData,
//             membershipType: formMembershipType 
//           } = location.state;
          
//           // Create quotation data from form
//           quotationData = createQuotationFromFormData(location.state);
//           doctorDetails = {
//             fullName: formDoctorData?.name || hospitalData?.name || "Doctor Name",
//             hospitalName: hospitalData?.name || "Hospital Name",
//             hospitalAddress: {
//               address: hospitalData?.address || "Address Not Available",
//               city: "",
//               state: "",
//               pinCode: ""
//             },
//             specialization: membershipData?.specialization ? [membershipData.specialization] : ["General"],
//             hospitalDetails: {
//               hospitalType: membershipData?.specialization || "General",
//               beds: membershipData?.numberOfBeds || "N/A"
//             },
//             doctorType: formMembershipType?.includes('HOSPITAL') ? 'hospital' : 'individual'
//           };
          
//           determinedType = formMembershipType?.toLowerCase().includes('individual') && 
//                           formMembershipType?.toLowerCase().includes('hospital') 
//                             ? 'combined' 
//                             : formMembershipType?.toLowerCase().includes('individual') 
//                               ? 'individual' 
//                               : 'hospital';
//         }
//         // CASE 3: No data - show demo with option to load from API
//         else {
//           console.log("📍 No ID or state, loading demo");
//           idFromSource = 'demo_' + Date.now();
//           quotationData = getDemoQuotationData();
//           doctorDetails = getDemoDoctorData();
//           determinedType = 'hospital';
//         }
        
//         // Map data to component format
//         if (quotationData && doctorDetails) {
//           const mappedData = mapToComponentData(quotationData, doctorDetails, determinedType);
//           console.log("📍 Mapped Component Data:", mappedData);
          
//           setComponentData(mappedData);
//           setDoctorData(doctorDetails);
//           setMembershipType(determinedType);
//           setQuotationId(idFromSource);
//         } else {
//           setError('Could not load quotation data');
//         }
        
//       } catch (error) {
//         console.error("📍 Error in loadData:", error);
//         setError(error.message || 'Failed to load data');
//         toast.error('Failed to load quotation data');
        
//         // Fallback to demo
//         const demoData = mapToComponentData(
//           getDemoQuotationData(), 
//           getDemoDoctorData(), 
//           'hospital'
//         );
//         setComponentData(demoData);
//         setMembershipType('hospital');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadData();
//   }, [location.state, params.id]);

//   // Map API response to component data
//   const mapToComponentData = (quotationData, doctorData, type) => {
//     // Format doctor info
//     const doctorName = doctorData.fullName || quotationData.requester?.name || "Dr. Name Not Available";
//     const hospitalName = doctorData.hospitalName || "Hospital Name Not Available";
    
//     // Format address
//     let address = "Address Not Available";
//     if (doctorData.hospitalAddress?.address) {
//       const addr = doctorData.hospitalAddress;
//       address = `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pinCode}`;
//     } else if (quotationData.requester?.address) {
//       address = quotationData.requester.address;
//     }
    
//     // Specialization
//     const specialization = doctorData.specialization?.join(", ") || 
//                           doctorData.hospitalDetails?.hospitalType || 
//                           "General";
    
//     // Beds
//     const beds = doctorData.hospitalDetails?.beds?.toString() || "N/A";
    
//     // Policy years from quotation
//     const policyYears = quotationData.requestDetails?.policyTerms || [1, 5];
    
//     // Pricing items from quotation
//     const pricingItems = quotationData.requestDetails?.items?.map(item => {
//       const pricingItem = {
//         indemnity: item.indemnity || "10 LAKH",
//         monthly: item.monthly || ""
//       };
      
//       // Add year prices
//       for (let year = 1; year <= 10; year++) {
//         const yearKey = `year_${year}`;
//         if (item[yearKey]) {
//           pricingItem[yearKey] = item[yearKey];
//         }
//       }
      
//       return pricingItem;
//     }) || [];
    
//     // If no pricing items, add default
//     if (pricingItems.length === 0) {
//       pricingItems.push({
//         indemnity: "10 LAKH",
//         monthly: "1000",
//         year_1: "10000",
//         year_5: "50000"
//       });
//     }
    
//     // Determine membership type string
//     let membershipTypeStr = "HOSPITAL MEMBERSHIP";
//     if (type === 'individual') membershipTypeStr = "INDIVIDUAL DOCTOR MEMBERSHIP";
//     if (type === 'combined') membershipTypeStr = "COMBINED HOSPITAL + INDIVIDUAL";
    
//     return {
//       doctor_name: doctorName,
//       hospital_name: hospitalName,
//       address: address,
//       specialization: specialization,
//       membership_type: membershipTypeStr,
//       number_of_beds: beds,
//       quotation_date: formatDate(quotationData.createdAt),
//       valid_till: formatDate(quotationData.expiryDate),
//       area: "All India",
//       qr_code_image: "",
//       note: quotationData.requestDetails?.additionalRequirements || "Standard membership terms apply",
//       trno: quotationData.trno || `TRNO${Date.now()}`,
//       quotation_number: quotationData.quotationNumber || `QUO${Date.now()}`,
//       pricing_items: pricingItems,
//       policy_years: policyYears,
//       payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
//       indemnity_cover: quotationData.requestDetails?.specialConditions || "Standard",
      
//       // Additional data for reference
//       _quotation_id: quotationData._id,
//       _doctor_id: doctorData._id
//     };
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return new Date().toLocaleDateString('en-GB');
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}.${month}.${year}`;
//   };

//   const createQuotationFromFormData = (state) => {
//     const { membershipData = {} } = state;
    
//     return {
//       quotationNumber: `QUO${Date.now()}`,
//       trno: `TRNO${Date.now()}`,
//       createdAt: new Date().toISOString(),
//       expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//       requester: {
//         type: state.membershipType?.includes('HOSPITAL') ? 'hospital' : 'doctor',
//         name: state.doctorData?.name || state.hospitalData?.name || "Doctor"
//       },
//       requestDetails: {
//         additionalRequirements: "Generated from form",
//         policyTerms: [1, 5], // Default
//         paymentFrequency: "monthly",
//         specialConditions: "Standard",
//         items: membershipData.priceMatrix?.map(item => ({
//           indemnity: item.indemnity || "10 LAKH",
//           monthly: item.monthly,
//           year_1: item.y1,
//           year_5: item.y5
//         })) || []
//       }
//     };
//   };

//   const getDemoQuotationData = (id = null) => {
//     return {
//       _id: id || "demo_" + Date.now(),
//       quotationNumber: id ? `QUO${id}` : "QUODEMO123",
//       trno: id ? `TRNO${id}` : "TRNODEMO456",
//       createdAt: new Date().toISOString(),
//       expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//       requester: {
//         type: 'hospital',
//         name: 'Dr. Demo Doctor',
//         entityId: 'doc_demo_123'
//       },
//       requestDetails: {
//         additionalRequirements: "Demo quotation for testing",
//         policyTerms: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         paymentFrequency: "monthly",
//         specialConditions: "Indemnity Cover Included",
//         items: [
//           {
//             indemnity: "10 LAKH",
//             monthly: "1000",
//             year_1: "10000",
//             year_2: "19000",
//             year_3: "28000",
//             year_4: "36000",
//             year_5: "45000",
//             year_6: "53000",
//             year_7: "61000",
//             year_8: "68000",
//             year_9: "75000",
//             year_10: "82000"
//           },
//           {
//             indemnity: "25 LAKH",
//             monthly: "1500",
//             year_1: "15000",
//             year_3: "42000",
//             year_5: "67500",
//             year_10: "120000"
//           }
//         ]
//       }
//     };
//   };

//   const getDemoDoctorData = () => {
//     return {
//       _id: "doc_demo_123",
//       fullName: "Dr. Rajesh Kumar",
//       hospitalName: "City Medical Center",
//       hospitalAddress: {
//         address: "123 Medical Street",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pinCode: "400001"
//       },
//       specialization: ["Cardiology", "General Medicine"],
//       hospitalDetails: {
//         hospitalType: "Multispeciality Hospital",
//         beds: 25
//       },
//       doctorType: "hospital"
//     };
//   };



// // const handlePrint = useReactToPrint({
// //   content: () => {
// //     if (!componentRef.current) {
// //       console.error("Print ref is null!");
// //       toast.error("Print content not ready yet. Please wait...");
// //       return null;
// //     }
// //     return componentRef.current;
// //   },
// //   documentTitle: `Quotation_${componentData?.quotation_number || 'New'}_${membershipType}`,
// //   pageStyle: `@page { size: A4; margin: 0; }`,
// //   onBeforeGetContent: () => {
// //     console.log("Preparing to print...", componentRef.current ? "Ref Found ✓" : "Ref Missing ✗");
// //   },
// //   onAfterPrint: () => toast.success("Quotation printed/PDF generated!"),
// //   onPrintError: (error) => {
// //     console.error("Print failed:", error);
// //     toast.error("Print failed. Check console.");
// //   }
// // });

//   // const renderQuotation = () => {
//   //   if (!componentData) {
//   //     return (
//   //       <div className="text-center p-8 bg-yellow-50 rounded-lg">
//   //         <p className="text-yellow-700">No data available</p>
//   //       </div>
//   //     );
//   //   }
    
//   //   console.log("📍 Rendering membership type:", membershipType);
    
//   //   const commonProps = {
//   //     ref: componentRef,
//   //     data: componentData,
//   //     onPrint: handlePrint
//   //   };
    
//   //   switch(membershipType) {
//   //     case 'hospital':
//   //       return <HospitalMembershipQuotation {...commonProps} />;
//   //     case 'individual':
//   //       const individualData = {
//   //         ...componentData,
//   //         membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
//   //         number_of_beds: "N/A",
//   //         hospital_name: "Individual Practice"
//   //       };
//   //       return <IndividualMembershipQuotation {...commonProps} data={individualData} />;
//   //     case 'combined':
//   //       const combinedData = {
//   //         ...componentData,
//   //         membership_type: "COMBINED HOSPITAL + INDIVIDUAL"
//   //       };
//   //       return <CombinedMembershipQuotation {...commonProps} data={combinedData} />;
//   //     default:
//   //       return <HospitalMembershipQuotation {...commonProps} />;
//   //   }
//   // };


// //   const handlePrint = useReactToPrint({
// //   content: () => {
// //     console.log("Print triggered - Ref:", componentRef.current);
// //     if (!componentRef.current) {
// //       toast.error("Content not ready for printing. Please wait a second and try again.");
// //       return null;
// //     }
// //     return componentRef.current;
// //   },
// //   documentTitle: `Rapid_Quotation_${componentData?.quotation_number || 'New'}`,
// //   pageStyle: `
// //     @page { size: A4; margin: 0; }
// //     @media print {
// //       body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
// //     }
// //   `,
// //   onAfterPrint: () => toast.success("PDF generated successfully!"),
// // });

// const handlePrint = useReactToPrint({
//   content: () => componentRef.current,
//   documentTitle: `Rapid_Quotation_${componentData?.quotation_number || 'New'}`,
//   pageStyle: `
//     @page { size: A4 portrait; margin: 0; }
//     @media print {
//       body { -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
//       html, body { height: 100%; overflow: visible; }
//     }
//   `,
//   onBeforeGetContent: () => {
//     // Yeh delay deta hai taaki images load ho jayein
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log("Print ready after delay - Ref:", componentRef.current);
//         resolve();
//       }, 1000); // 1 second delay → images load hone ka time
//     });
//   },
//   onAfterPrint: () => toast.success("PDF successfully generated!"),
//   onPrintError: (error) => {
//     console.error("Print error:", error);
//     toast.error("Print failed. Try again after 2 seconds.");
//   }
// });

// //   const renderQuotation = () => {
// //   if (!componentData) {
// //     return (
// //       <div className="text-center p-8 bg-yellow-50 rounded-lg">
// //         <p className="text-yellow-700">No data available</p>
// //       </div>
// //     );
// //   }

// //   const baseProps = {
// //     data: componentData,
// //     onPrint: handlePrint
// //   };

// //   switch(membershipType) {
// //     case 'hospital':
// //       return <HospitalMembershipQuotation ref={componentRef} {...baseProps} />;
// //     case 'individual':
// //       const individualData = {
// //         ...componentData,
// //         membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
// //         number_of_beds: "N/A",
// //         hospital_name: "Individual Practice"
// //       };
// //       return <IndividualMembershipQuotation ref={componentRef} data={individualData} {...baseProps} />;
// //     case 'combined':
// //       const combinedData = {
// //         ...componentData,
// //         membership_type: "COMBINED HOSPITAL + INDIVIDUAL"
// //       };
// //       return <CombinedMembershipQuotation ref={componentRef} data={combinedData} {...baseProps} />;
// //     default:
// //       return <HospitalMembershipQuotation ref={componentRef} {...baseProps} />;
// //   }
// // };

// const renderQuotation = () => {
//   if (!componentData) {
//     return (
//       <div className="text-center p-8 bg-yellow-50 rounded-lg">
//         <p className="text-yellow-700">No data available</p>
//       </div>
//     );
//   }

//   // Yeh baseProps banao – REF KO YAHAN MAT DAALO!
//   const baseProps = {
//     data: componentData,
//     onPrint: handlePrint
//   };

//   switch (membershipType) {
//     case 'hospital':
//       return (
//         <HospitalMembershipQuotation 
//           ref={componentRef}    // ← REF KO ALAG SE YAHAN DAALO
//           {...baseProps}        // ← BAHUT SAARI PROPS SPREAD KARNE KE LIYE
//         />
//       );

//     case 'individual':
//       const individualData = {
//         ...componentData,
//         membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
//         number_of_beds: "N/A",
//         hospital_name: "Individual Practice"
//       };
//       return (
//         <IndividualMembershipQuotation 
//           ref={componentRef}    // ← REF KO ALAG SE YAHAN DAALO
//           data={individualData} // ← INDIVIDUAL DATA ALAG SE PASS KARO
//           {...baseProps}        // ← BAHUT SAARI PROPS SPREAD KARNE KE LIYE
//         />
//       );

//     case 'combined':
//       const combinedData = {
//         ...componentData,
//         membership_type: "COMBINED HOSPITAL + INDIVIDUAL"
//       };
//       return (
//         <CombinedMembershipQuotation 
//           ref={componentRef}    // ← REF KO ALAG SE YAHAN DAALO
//           data={combinedData}   // ← COMBINED DATA ALAG SE PASS KARO
//           {...baseProps}        // ← BAHUT SAARI PROPS SPREAD KARNE KE LIYE
//         />
//       );

//     default:
//       return (
//         <HospitalMembershipQuotation 
//           ref={componentRef}
//           {...baseProps}
//         />
//       );
//   }
//   console.log("Ref attached?", componentRef.current); // ← print button click karne se pehle check
// };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Loading quotation data from API...</p>
//         {params.id && (
//           <p className="text-sm text-gray-500">ID: {params.id}</p>
//         )}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-8 bg-red-50 rounded-lg">
//         <p className="text-red-600 font-bold text-lg mb-2">⚠️ Error Loading Data</p>
//         <p className="text-gray-700 mb-4">{error}</p>
//         <div className="flex justify-center gap-3">
//           <button 
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Retry
//           </button>
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Status info */}
//       <div className="print:hidden mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-sm font-bold text-blue-800">
//               {params.id ? `Quotation #${params.id}` : 'New Quotation'}
//             </p>
//             <div className="text-xs text-blue-700 space-y-1 mt-1">
//               <p>Status: <span className="font-semibold">Loaded from API</span></p>
//               <p>Type: <span className="font-semibold">{membershipType.toUpperCase()}</span></p>
//               <p>Policy Years: <span className="font-semibold">{componentData.policy_years?.join(", ")}</span></p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             {params.id && (
//               <button
//                 onClick={() => navigator.clipboard.writeText(window.location.href)}
//                 className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded"
//                 title="Copy link"
//               >
//                 📋 Copy Link
//               </button>
//             )}
//             <button
//               onClick={handlePrint}
//               className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//             >
//               🖨️ Print / PDF
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Membership Type Selector */}
//       <div className="print:hidden mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
//             Select Membership Type
//           </h2>
          
//           <div className="flex flex-wrap justify-center gap-4">
//             {[
//               { id: 'hospital', label: 'HOSPITAL', color: 'blue' },
//               { id: 'individual', label: 'INDIVIDUAL DOCTOR', color: 'green' },
//               { id: 'combined', label: 'COMBINED', color: 'purple' }
//             ].map((type) => (
//               <button
//                 key={type.id}
//                 onClick={() => setMembershipType(type.id)}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   membershipType === type.id 
//                     ? `bg-${type.color}-600 text-white shadow-lg` 
//                     : `bg-${type.color}-100 text-gray-700 hover:bg-${type.color}-200`
//                 }`}
//               >
//                 {type.label}
//               </button>
//             ))}
//           </div>
          
//           <div className="mt-4 text-center">
//             <p className="text-sm text-gray-600">
//               Currently viewing: <span className="font-bold">{membershipType.toUpperCase()}</span>
//             </p>
//             {componentData && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Doctor: {componentData.doctor_name} | 
//                 Quotation: {componentData.quotation_number}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Render the selected quotation */}
//       {renderQuotation()}
//     </div>
//   );
// };












// // components/QuotationController.jsx - PRINT FIXED VERSION
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [componentData, setComponentData] = useState(null);
//   const [printReady, setPrintReady] = useState(false);
  
//   // ✅ CRITICAL: useRef yahi declare karo
//   const componentRef = useRef();
  
//   const location = useLocation();
//   const params = useParams();
//   const navigate = useNavigate();

//   console.log("📍 QuotationController - Ref available:", !!componentRef.current);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Your existing data loading logic...
//         // ... [same as before] ...
        
//         // DEMO DATA for testing print
//         const demoData = {
//           doctor_name: "Dr. Test Doctor",
//           hospital_name: "Test Hospital",
//           address: "123 Test Street, Mumbai",
//           specialization: "Cardiology",
//           membership_type: "HOSPITAL MEMBERSHIP",
//           number_of_beds: "25",
//           quotation_date: "15.12.2025",
//           valid_till: "15.01.2026",
//           area: "All India",
//           qr_code_image: "",
//           note: "Test quotation for print functionality",
//           trno: "TRNO123456",
//           quotation_number: "QUO123456",
//           pricing_items: [
//             {
//               indemnity: "10 LAKH",
//               monthly: "1000",
//               year_1: "10000",
//               year_2: "19000",
//               year_5: "45000"
//             }
//           ],
//           policy_years: [1, 2, 5],
//           payment_frequency: "monthly",
//           indemnity_cover: "Standard"
//         };
        
//         setComponentData(demoData);
//         setMembershipType('hospital');
        
//         // Small delay to ensure components are mounted
//         setTimeout(() => {
//           setPrintReady(true);
//           console.log("📍 Print ready, ref:", !!componentRef.current);
//         }, 500);
        
//       } catch (error) {
//         console.error("Error loading data:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadData();
//   }, [location.state, params.id]);

//   // ✅ PROPER PRINT FUNCTION - useCallback use karo
//   // const handlePrint = useCallback(() => {
//   //   console.log("📍 handlePrint called");
//   //   console.log("📍 Ref current:", componentRef.current);
    
//   //   if (!componentRef.current) {
//   //     toast.error("Print content not ready yet. Please wait a moment.");
//   //     console.error("Print ref is null!");
//   //     return;
//   //   }
    
//   //   // Create print window
//   //   const printContent = componentRef.current.innerHTML;
//   //   const printWindow = window.open('', '_blank');
    
//   //   printWindow.document.write(`
//   //     <!DOCTYPE html>
//   //     <html>
//   //     <head>
//   //       <title>Medical Legal Quotation</title>
//   //       <style>
//   //         @page {
//   //           size: A4;
//   //           margin: 0;
//   //         }
//   //         body {
//   //           margin: 0;
//   //           padding: 0;
//   //           font-family: Arial, sans-serif;
//   //           -webkit-print-color-adjust: exact !important;
//   //           print-color-adjust: exact !important;
//   //         }
//   //         .print-container {
//   //           width: 210mm;
//   //           min-height: 297mm;
//   //           margin: 0 auto;
//   //           background: white;
//   //           position: relative;
//   //         }
//   //         @media print {
//   //           body { margin: 0 !important; }
//   //           .no-print { display: none !important; }
//   //         }
//   //       </style>
//   //     </head>
//   //     <body>
//   //       <div class="print-container">
//   //         ${printContent}
//   //       </div>
//   //       <script>
//   //         window.onload = function() {
//   //           window.print();
//   //           setTimeout(() => window.close(), 1000);
//   //         };
//   //       </script>
//   //     </body>
//   //     </html>
//   //   `);
    
//   //   printWindow.document.close();
//   // }, []);



//   // Correct way (react-to-print v3+)
// const handlePrint = useReactToPrint({
//   contentRef: componentRef,  // ← Ye important hai
//   documentTitle: `Quotation_${componentData?.quotation_number || 'New'}`,
//   pageStyle: `
//     @page { size: A4; margin: 0; }
//     body { margin: 0; }
//   `,
//   onAfterPrint: () => console.log("Print completed"),
//   onPrintError: (error) => {
//     console.error("Print error:", error);
//     toast.error("Print failed, trying browser print...");
//     window.print();
//   }
// });

//   // ✅ Alternative: useReactToPrint with proper ref handling
//   // const printInstance = useReactToPrint({
//   //   content: () => componentRef.current,
//   //   documentTitle: `Medical-Legal-Quotation-${componentData?.quotation_number || 'New'}`,
//   //   pageStyle: `
//   //     @page { size: A4; margin: 0; }
//   //     body { margin: 0; -webkit-print-color-adjust: exact; }
//   //     .no-print { display: none !important; }
//   //   `,
//   //   onBeforeGetContent: () => {
//   //     console.log("📍 onBeforeGetContent - Ref:", !!componentRef.current);
//   //     return Promise.resolve();
//   //   },
//   //   onPrintError: (err) => {
//   //     console.error("Print error:", err);
//   //     toast.error("Print failed. Using fallback method.");
//   //     // Fallback to simple print
//   //     window.print();
//   //   }
//   // });

//   // ✅ Combined print function
//   const handlePrintCombined = () => {
//     console.log("Print button clicked");
//     console.log("Ref available:", !!componentRef.current);
//     console.log("Print ready:", printReady);
    
//     if (componentRef.current) {
//       printInstance();
//     } else {
//       handlePrint(); // Use fallback
//     }
//   };

//   const renderQuotation = () => {
//     if (!componentData) {
//       return (
//         <div className="text-center p-8 bg-yellow-50 rounded-lg">
//           <p className="text-yellow-700">No data available</p>
//         </div>
//       );
//     }

//     console.log("📍 Rendering with ref:", !!componentRef);
    
//     // ✅ Direct props, no spreading
//     const baseData = membershipType === 'individual' 
//       ? { ...componentData, membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP", number_of_beds: "N/A" }
//       : membershipType === 'combined'
//       ? { ...componentData, membership_type: "COMBINED HOSPITAL + INDIVIDUAL" }
//       : componentData;

//     switch(membershipType) {
//       case 'hospital':
//         return (
//           <HospitalMembershipQuotation 
//             ref={componentRef}
//             data={baseData}
//             onPrint={handlePrintCombined}
//           />
//         );
//       case 'individual':
//         return (
//           <IndividualMembershipQuotation 
//             ref={componentRef}
//             data={baseData}
//             onPrint={handlePrintCombined}
//           />
//         );
//       case 'combined':
//         return (
//           <CombinedMembershipQuotation 
//             ref={componentRef}
//             data={baseData}
//             onPrint={handlePrintCombined}
//           />
//         );
//       default:
//         return (
//           <HospitalMembershipQuotation 
//             ref={componentRef}
//             data={baseData}
//             onPrint={handlePrintCombined}
//           />
//         );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Debug info */}
//       <div className="no-print mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-sm font-bold text-blue-800">Print Status</p>
//             <div className="text-xs text-blue-700 space-y-1 mt-1">
//               <p>Ref Available: <span className={`font-bold ${componentRef.current ? 'text-green-600' : 'text-red-600'}`}>
//                 {componentRef.current ? 'YES ✅' : 'NO ❌'}
//               </span></p>
//               <p>Print Ready: <span className={`font-bold ${printReady ? 'text-green-600' : 'text-yellow-600'}`}>
//                 {printReady ? 'READY ✅' : 'LOADING...'}
//               </span></p>
//             </div>
//           </div>
//           <button
//             onClick={handlePrintCombined}
//             disabled={!printReady}
//             className={`font-bold py-2 px-4 rounded ${
//               printReady 
//                 ? 'bg-green-600 hover:bg-green-700 text-white' 
//                 : 'bg-gray-400 text-gray-200 cursor-not-allowed'
//             }`}
//           >
//             {printReady ? '🖨️ Print Now' : 'Loading...'}
//           </button>
//         </div>
//       </div>
      
//       {/* Membership selector */}
//       <div className="no-print mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
//             Select Membership Type
//           </h2>
          
//           <div className="flex flex-wrap justify-center gap-4">
//             {['hospital', 'individual', 'combined'].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setMembershipType(type)}
//                 className={`px-6 py-3 rounded-lg font-semibold ${
//                   membershipType === type 
//                     ? 'bg-blue-600 text-white shadow-lg' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {type.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Render quotation */}
//       {renderQuotation()}
      
//       {/* Simple fallback print button */}
//       <div className="no-print mt-4 text-center">
//         <button
//           onClick={() => window.print()}
//           className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
//         >
//           Browser Print (Fallback)
//         </button>
//         <p className="text-xs text-gray-500 mt-2">
//           If the main print button doesn't work, use this fallback
//         </p>
//       </div>
//     </div>
//   );
// };















// // components/QuotationController.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [printReady, setPrintReady] = useState(false);
//   const [componentData, setComponentData] = useState(null);

//   // Main ref for printing
//   const componentRef = useRef();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         // DEMO DATA (replace with your API call later)
//         const demoData = {
//           doctor_name: "Dr. Test Doctor",
//           hospital_name: "Test Hospital",
//           address: "123 Test Street, Mumbai",
//           specialization: "Cardiology",
//           membership_type: "HOSPITAL MEMBERSHIP",
//           number_of_beds: "25",
//           quotation_date: "16.12.2025",
//           valid_till: "16.01.2026",
//           note: "Test quotation for print functionality",
//           trno: "TRNO123456",
//           quotation_number: "QUO123456",
//           pricing_items: [
//             {
//               indemnity: "10 LAKH",
//               monthly: "1000",
//               year_1: "10000",
//               year_2: "19000",
//               year_5: "45000"
//             }
//           ],
//           policy_years: [1, 2, 5],
//         };

//         setComponentData(demoData);
//         setMembershipType('hospital');

//         // Wait for component to mount
//         setTimeout(() => {
//           setPrintReady(true);
//         }, 600);

//       } catch (error) {
//         console.error("Error loading data:", error);
//         toast.error("Data load nahi hua");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Correct react-to-print usage (v3+)
//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: `Quotation_${componentData?.quotation_number || 'New'}`,
//     pageStyle: `
//       @page { size: A4 portrait; margin: 0; }
//       body { margin: 0; padding: 0; }
//       * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     `,
//     onAfterPrint: () => console.log("Print successful!"),
//     onPrintError: (error) => {
//       console.error("Print error:", error);
//       toast.error("Print failed. Browser print try karo.");
//     }
//   });

//   const renderQuotation = () => {
//     if (!componentData) return null;

//     const baseData = membershipType === 'individual'
//       ? { ...componentData, membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP", number_of_beds: "N/A" }
//       : membershipType === 'combined'
//       ? { ...componentData, membership_type: "COMBINED HOSPITAL + INDIVIDUAL" }
//       : componentData;

//     switch (membershipType) {
//       case 'hospital':
//         return <HospitalMembershipQuotation ref={componentRef} data={baseData} />;
//       case 'individual':
//         return <IndividualMembershipQuotation ref={componentRef} data={baseData} />;
//       case 'combined':
//         return <CombinedMembershipQuotation ref={componentRef} data={baseData} />;
//       default:
//         return <HospitalMembershipQuotation ref={componentRef} data={baseData} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
//           <p className="text-xl">Loading Quotation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Print Button & Debug */}
//       <div className="no-print sticky top-0 z-50 bg-white shadow-md p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="text-sm">
//             <span className="font-bold">Status:</span>
//             <span className={`ml-2 font-bold ${componentRef.current ? 'text-green-600' : 'text-red-600'}`}>
//               {componentRef.current ? 'Ready to Print ✅' : 'Loading...'}
//             </span>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={handlePrint}
//               disabled={!printReady || !componentRef.current}
//               className={`px-8 py-3 rounded-lg font-bold text-white transition ${
//                 printReady && componentRef.current
//                   ? 'bg-green-600 hover:bg-green-700 shadow-lg'
//                   : 'bg-gray-400 cursor-not-allowed'
//               }`}
//             >
//               🖨️ Print Quotation
//             </button>

//             <button
//               onClick={() => window.print()}
//               className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
//             >
//               Browser Print (Fallback)
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Membership Selector */}
//       <div className="no-print max-w-3xl mx-auto my-8">
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-center mb-6">Select Membership Type</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {['hospital', 'individual', 'combined'].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setMembershipType(type)}
//                 className={`py-4 px-6 rounded-lg font-bold text-lg transition ${
//                   membershipType === type
//                     ? 'bg-blue-600 text-white shadow-xl'
//                     : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
//                 }`}
//               >
//                 {type.toUpperCase().replace('COMBINED', 'COMBINED (H+I)')}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Printable Content */}
//       {renderQuotation()}
//     </div>
//   );
// };



// // components/QuotationController.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [printReady, setPrintReady] = useState(false);
//   const [componentData, setComponentData] = useState(null);

//   const componentRef = useRef();
//   const { id } = useParams(); // Quotation ID

//   useEffect(() => {
//     // const fetchAllData = async () => {
//     //   if (!id) {
//     //     toast.error("Quotation ID missing");
//     //     setLoading(false);
//     //     return;
//     //   }

//     //   try {
//     //     setLoading(true);

//     //     // Step 1: Fetch Quotation Data
//     //     const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
//     //     const quotationData = quotationResponse.data?.data;

//     //     if (!quotationData) {
//     //       throw new Error("Quotation data not found");
//     //     }

//     //     // Extract doctor ID from quotation if available, or fallback
//     //     // In your quotation response, doctor ID nahi hai, but linked entity ya createdBy se guess kar sakte hain
//     //     // But you said doctor API URL has ID: 690dca6ee07d4f004c862d3a → hardcode for now or find logic
//     //     // Better: Agar quotation mein doctor reference ho to use karo, warna separate logic

//     //     // For now, assuming you have doctorId in quotation or pass separately
//     //     // Let's assume doctorId is available in quotationData somehow, or you pass it in URL
//     //     // Temporary: Hardcode doctor ID from your example, replace later with dynamic
//     //     const doctorId = "690dca6ee07d4f004c862d3a"; // ← Replace with dynamic if available

//     //     // Step 2: Fetch Doctor Data
//     //     let doctorData = null;
//     //     try {
//     //       const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
//     //       doctorData = doctorResponse.data?.data;
//     //     } catch (docError) {
//     //       console.warn("Doctor API failed, using partial data", docError);
//     //       // Continue with quotation data only
//     //     }

//     //     // Step 3: Combine Both
//     //     const requester = quotationData.requester || {};
//     //     const requestDetails = quotationData.requestDetails || {};

//     //     const combinedData = {
//     //       // From Doctor API (Priority)
//     //       doctor_name: doctorData?.fullName || requester.contactPerson || requester.name || "Dr. Name Not Available",
//     //       hospital_name: doctorData?.hospitalName || (requester.type === "hospital" ? requester.name : "Not Applicable"),
//     //       address: doctorData?.hospitalAddress 
//     //         ? `${doctorData.hospitalAddress.address}, ${doctorData.hospitalAddress.city}, ${doctorData.hospitalAddress.state} - ${doctorData.hospitalAddress.pinCode}`
//     //         : doctorData?.contactDetails?.currentAddress
//     //         ? `${doctorData.contactDetails.currentAddress.address}, ${doctorData.contactDetails.currentAddress.city}, ${doctorData.contactDetails.currentAddress.state}`
//     //         : "All India Coverage",
//     //       specialization: doctorData?.specialization?.join(", ") || doctorData?.hospitalDetails?.hospitalType || "Multi-Speciality",
//     //       number_of_beds: doctorData?.hospitalDetails?.beds?.toString() || "N/A",

//     //       // From Quotation API
//     //       pricing_items: requestDetails.items || [],
//     //       policy_years: requestDetails.policyTerms || [1],
//     //       note: requestDetails.additionalRequirements || requestDetails.specialConditions || "All prices exclusive of GST.",
//     //       payment_frequency: requestDetails.paymentFrequency || "yearly",

//     //       // Dates & IDs
//     //       quotation_date: new Date(quotationData.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.'),
//     //       valid_till: new Date(quotationData.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '.'),
//     //       quotation_number: quotationData.quotationNumber || "N/A",
//     //       trno: quotationData.trno || "",
//     //     };

//     //     setComponentData(combinedData);

//     //     // Set membership type
//     //     let type = 'hospital';
//     //     if (doctorData?.doctorType?.includes('individual') && !doctorData?.doctorType?.includes('hospital')) {
//     //       type = 'individual';
//     //     } else if (doctorData?.doctorType?.includes('combined') || requester.type === 'combined') {
//     //       type = 'combined';
//     //     } else {
//     //       type = requester.type?.toLowerCase() === 'individual' ? 'individual' : 'hospital';
//     //     }
//     //     setMembershipType(type);

//     //     setTimeout(() => setPrintReady(true), 1200);

//     //   } catch (error) {
//     //     console.error("Error fetching data:", error);
//     //     toast.error("Failed to load complete data");
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // };





// // const fetchAllData = async () => {
// //   if (!id) {
// //     toast.error("Quotation ID missing");
// //     setLoading(false);
// //     return;
// //   }

// //   try {
// //     setLoading(true);

// //     // 1. QUOTATION DATA FETCH
// //     const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
// //     const quotationData = quotationResponse.data?.data;

// //     if (!quotationData) {
// //       throw new Error("Quotation data not found");
// //     }

// //     console.log("📄 QUOTATION DATA:", quotationData);
// //     console.log("🔍 REQUESTER TYPE:", quotationData.requester?.type);
// //     console.log("🔍 ENTITYID:", quotationData.requester?.entityId);

// //     // 2. DOCTOR ID EXTRACT - FIXED FOR ALL CASES
// //     let doctorId = null;
// //     let doctorDataFromQuotation = null;
    
// //     const requester = quotationData.requester || {};
    
// //     // ✅ IMPORTANT FIX: Combined type check
// //     console.log("🔍 Checking requester type for combined:", requester.type);
    
// //     if (requester.entityId) {
// //       // Object case (populated)
// //       if (typeof requester.entityId === 'object' && requester.entityId._id) {
// //         doctorId = requester.entityId._id;
// //         doctorDataFromQuotation = requester.entityId;
// //         console.log("✅ Doctor data POPULATED:", doctorDataFromQuotation);
// //       }
// //       // String case
// //       else if (typeof requester.entityId === 'string') {
// //         doctorId = requester.entityId;
// //         console.log("✅ Doctor ID string:", doctorId);
// //       }
// //     } else {
// //       console.warn("⚠️ No entityId in quotation");
      
// //       // ✅ SPECIAL FIX FOR COMBINED TYPE: Check createdBy
// //       if (quotationData.createdBy && quotationData.createdBy._id) {
// //         doctorId = quotationData.createdBy._id;
// //         console.log("🔄 Using createdBy as fallback:", doctorId);
// //       }
// //     }

// //     // 3. GET DOCTOR DATA
// //     let doctorData = doctorDataFromQuotation;
    
// //     // ✅ IMPORTANT: For combined type, always try to fetch doctor data
// //     if (doctorId && !doctorDataFromQuotation) {
// //       try {
// //         const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
// //         if (doctorResponse.data?.success) {
// //           doctorData = doctorResponse.data.data;
// //           console.log("✅ Doctor from API:", doctorData.fullName);
// //         }
// //       } catch (apiError) {
// //         console.error("❌ Doctor API error:", apiError.message);
// //         // Don't show toast for combined - it might be expected
// //         if (requester.type !== 'combined') {
// //           toast.warning("Doctor details not available");
// //         }
// //       }
// //     }

// //     // 4. DETERMINE MEMBERSHIP TYPE - FIXED LOGIC
// //     let membershipType = 'hospital';
// //     let membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
    
// //     // ✅ LOGIC FOR COMBINED TYPE
// //     if (doctorData) {
// //       console.log("🔍 Doctor Type from doctorData:", doctorData.doctorType);
      
// //       if (doctorData.doctorType === 'individual') {
// //         membershipType = 'individual';
// //         membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
// //       } 
// //       else if (doctorData.doctorType === 'hospital') {
// //         membershipType = 'hospital';
// //         membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
// //       }
// //       else if (doctorData.doctorType === 'hospital_individual') {
// //         membershipType = 'combined';
// //         membershipTypeDisplay = "HOSPITAL + INDIVIDUAL MEMBERSHIP";
// //       }
// //     } 
// //     // Fallback to requester type
// //     else if (requester.type === 'doctor') {
// //       membershipType = 'individual';
// //       membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
// //     }
// //     else if (requester.type === 'hospital') {
// //       membershipType = 'hospital';
// //       membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
// //     }
// //     else if (requester.type === 'combined') {
// //       membershipType = 'combined';
// //       membershipTypeDisplay = "HOSPITAL + INDIVIDUAL MEMBERSHIP";
// //     }

// //     console.log("🎯 FINAL MEMBERSHIP TYPE:", {
// //       membershipType,
// //       membershipTypeDisplay,
// //       requesterType: requester.type,
// //       doctorType: doctorData?.doctorType
// //     });

// //     // 5. PREPARE FINAL DATA WITH PROPER ADDRESS
// //     let finalData = {
// //       // Basic info
// //       doctor_name: doctorData?.fullName || requester.name || "Dr. Name Not Available",
// //       hospital_name: doctorData?.hospitalName || 
// //                     (requester.type === 'individual' ? "Individual Practice" : "Hospital Name Not Available"),
      
// //       // ✅ FIXED ADDRESS FORMATTING
// //       address: getFormattedAddress(doctorData) || "All India Coverage",
      
// //       specialization: doctorData?.specialization?.join(", ") || 
// //                      doctorData?.hospitalDetails?.hospitalType || 
// //                      "Multi-Speciality",
      
// //       number_of_beds: doctorData?.hospitalDetails?.beds?.toString() || "N/A",
// //       doctor_id: doctorData?.doctorId || "N/A",
      
// //       // Quotation details
// //       pricing_items: quotationData.requestDetails?.items || [],
// //       policy_years: quotationData.requestDetails?.policyTerms || [1],
// //       note: quotationData.requestDetails?.additionalRequirements || "",
// //       payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
// //       indemnity_cover: quotationData.requestDetails?.specialConditions || "",
      
// //       // Dates
// //       quotation_date: new Date(quotationData.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.'),
// //       valid_till: new Date(quotationData.expiryDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
// //         .toLocaleDateString('en-GB').replace(/\//g, '.'),
      
// //       // IDs
// //       quotation_number: quotationData.quotationNumber || quotationData.quotationId || `Q-${id.substring(0, 8)}`,
// //       trno: quotationData.trno || "",
// //       quotation_id: quotationData._id,
      
// //       // ✅ CORRECT MEMBERSHIP TYPE
// //       membership_type: membershipTypeDisplay,
// //     };

// //     console.log("🎯 FINAL DATA:", {
// //       name: finalData.doctor_name,
// //       hospital: finalData.hospital_name,
// //       address: finalData.address,
// //       type: finalData.membership_type
// //     });
    
// //     setComponentData(finalData);
// //     setMembershipType(membershipType);
// //     setTimeout(() => setPrintReady(true), 800);

// //   } catch (error) {
// //     console.error("🔥 ERROR:", error.response?.data || error.message);
// //     toast.error("Failed to load quotation data");
    
// //     // Fallback
// //     const fallbackData = {
// //       doctor_name: "Dr. Name",
// //       hospital_name: "Hospital",
// //       address: "Address, City, State - PIN",
// //       specialization: "Specialization",
// //       number_of_beds: "N/A",
// //       quotation_number: `Q-${id?.substring(0, 8) || 'ERROR'}`,
// //       quotation_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
// //       valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.'),
// //       membership_type: "HOSPITAL + INDIVIDUAL MEMBERSHIP",
// //     };
    
// //     setComponentData(fallbackData);
// //     setMembershipType('combined');
// //     setTimeout(() => setPrintReady(true), 500);
// //   } finally {
// //     setLoading(false);
// //   }
// // };




// // QuotationController.jsx - fetchAllData function

// // const fetchAllData = async () => {
// //   try {
// //     setLoading(true);
    
// //     // 1. GET QUOTATION
// //     const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
// //     const quotationData = quotationResponse.data?.data;
    
// //     if (!quotationData) throw new Error("Quotation not found");
    
// //     console.log("📄 QUOTATION LOADED:", {
// //       id: quotationData._id,
// //       requesterType: quotationData.requester?.type,
// //       entityId: quotationData.requester?.entityId,
// //       name: quotationData.requester?.name
// //     });

// //     const requester = quotationData.requester || {};
    
// //     // ✅ CRITICAL FIX: Handle NULL entityId
// //     let doctorId = null;
// //     let doctorData = null;
    
// //     console.log("🔍 Checking entityId:", {
// //       value: requester.entityId,
// //       type: typeof requester.entityId,
// //       isNull: requester.entityId === null,
// //       isUndefined: requester.entityId === undefined
// //     });

// //     // ✅ CASE 1: entityId is NULL or UNDEFINED
// //     if (requester.entityId === null || requester.entityId === undefined) {
// //       console.warn("⚠️ ENTITY ID IS NULL/UNDEFINED!");
      
// //       // ✅ FIX: Try to find doctor by name from requester.name
// //       const doctorName = requester.name;
// //       if (doctorName && doctorName !== "shared_doc_2") {
// //         try {
// //           console.log("🔄 SEARCHING DOCTOR BY NAME:", doctorName);
          
// //           // Search doctors by name
// //           const searchResponse = await apiClient.get(`/doctors?search=${encodeURIComponent(doctorName)}&limit=5`);
          
// //           if (searchResponse.data?.data?.length > 0) {
// //             // Find matching doctor
// //             const foundDoctor = searchResponse.data.data.find(doc => 
// //               doc.fullName === doctorName || 
// //               doc.hospitalName === doctorName ||
// //               (doc.fullName && doctorName.includes(doc.fullName))
// //             );
            
// //             if (foundDoctor) {
// //               doctorId = foundDoctor._id;
// //               doctorData = foundDoctor;
// //               console.log("✅ DOCTOR FOUND BY NAME:", foundDoctor.fullName);
// //             } else {
// //               console.log("⚠️ No exact match, using first result");
// //               doctorId = searchResponse.data.data[0]._id;
// //               doctorData = searchResponse.data.data[0];
// //             }
// //           }
// //         } catch (searchError) {
// //           console.error("Search error:", searchError);
// //         }
// //       }
      
// //       // If still no doctor found, check createdBy
// //       if (!doctorId && quotationData.createdBy?._id) {
// //         console.log("🔄 Using createdBy as fallback:", quotationData.createdBy._id);
// //         doctorId = quotationData.createdBy._id;
// //       }
// //     }
// //     // ✅ CASE 2: entityId is OBJECT (populated)
// //     else if (typeof requester.entityId === 'object' && requester.entityId !== null) {
// //       if (requester.entityId._id) {
// //         doctorId = requester.entityId._id;
// //         doctorData = requester.entityId;
// //         console.log("✅ Doctor data populated from object");
// //       }
// //     }
// //     // ✅ CASE 3: entityId is STRING
// //     else if (typeof requester.entityId === 'string') {
// //       doctorId = requester.entityId;
// //       console.log("✅ Doctor ID is string:", doctorId);
// //     }

// //     console.log("🎯 FINAL DOCTOR ID:", doctorId);

// //     // 2. FETCH DOCTOR DATA IF WE HAVE ID
// //     if (doctorId && !doctorData) {
// //       try {
// //         const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
// //         if (doctorResponse.data?.success) {
// //           doctorData = doctorResponse.data.data;
// //           console.log("✅ Doctor fetched from API:", doctorData.fullName);
// //         }
// //       } catch (fetchError) {
// //         console.error("Doctor fetch failed:", fetchError.response?.status);
// //         // Continue without doctor data
// //       }
// //     }

// //     // 3. PREPARE INVOICE DATA
// //     const prepareInvoiceData = () => {
// //       // Base data - always available
// //       const baseData = {
// //         // From requester
// //         doctor_name: requester.name || "Dr. Name",
// //         hospital_name: requester.type === "hospital" ? requester.name : 
// //                       requester.type === "doctor" ? "Individual Practice" : 
// //                       "Hospital Name",
        
// //         // Default values
// //         address: "Address Not Available",
// //         specialization: "General Practitioner",
// //         number_of_beds: "N/A",
// //         doctor_id: "N/A",
        
// //         // Quotation details
// //         pricing_items: quotationData.requestDetails?.items || [],
// //         policy_years: quotationData.requestDetails?.policyTerms || [1],
// //         note: quotationData.requestDetails?.additionalRequirements || "",
// //         payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
        
// //         // Dates
// //         quotation_date: new Date(quotationData.createdAt).toLocaleDateString('en-GB'),
// //         valid_till: new Date(quotationData.expiryDate).toLocaleDateString('en-GB'),
// //         quotation_number: quotationData.quotationNumber || `Q-${id.substring(0, 8)}`,
// //         trno: quotationData.trno || "",
// //         quotation_id: quotationData._id,
        
// //         // Membership type
// //         membership_type: getMembershipType(requester.type, doctorData?.doctorType)
// //       };

// //       // Enhance with doctor data if available
// //       if (doctorData) {
// //         return {
// //           ...baseData,
// //           doctor_name: doctorData.fullName || baseData.doctor_name,
// //           hospital_name: doctorData.hospitalName || baseData.hospital_name,
// //           address: formatAddress(doctorData),
// //           specialization: doctorData.specialization?.join(", ") || 
// //                         doctorData.hospitalDetails?.hospitalType || 
// //                         baseData.specialization,
// //           number_of_beds: doctorData.hospitalDetails?.beds?.toString() || baseData.number_of_beds,
// //           doctor_id: doctorData.doctorId || baseData.doctor_id,
// //         };
// //       }

// //       return baseData;
// //     };

// //     const finalData = prepareInvoiceData();
    
// //     console.log("🎯 FINAL INVOICE DATA:", {
// //       name: finalData.doctor_name,
// //       hospital: finalData.hospital_name,
// //       address: finalData.address,
// //       type: finalData.membership_type
// //     });
    
// //     setComponentData(finalData);
    
// //     // Set component type
// //     const compType = getComponentType(requester.type, doctorData?.doctorType);
// //     setMembershipType(compType);
    
// //     setTimeout(() => setPrintReady(true), 800);

// //   } catch (error) {
// //     console.error("🔥 ERROR:", error);
// //     toast.error("Failed to load quotation");
    
// //     // Emergency fallback
// //     const emergencyData = {
// //       doctor_name: "Dr. Professional",
// //       hospital_name: "Medical Center",
// //       address: "Address, City, State - PIN",
// //       specialization: "Multi-Speciality",
// //       number_of_beds: "50",
// //       quotation_number: `Q-${id?.substring(0, 6) || "EMG"}`,
// //       quotation_date: new Date().toLocaleDateString('en-GB'),
// //       valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
// //       membership_type: "HOSPITAL + INDIVIDUAL MEMBERSHIP"
// //     };
    
// //     setComponentData(emergencyData);
// //     setMembershipType('combined');
// //     setTimeout(() => setPrintReady(true), 500);
// //   } finally {
// //     setLoading(false);
// //   }
// // };



// // COMPLETE fetchAllData function for QuotationController.jsx
// const fetchAllData = async () => {
//   try {
//     setLoading(true);
    
//     // 1. Fetch quotation data
//     const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
//     const quotationData = quotationResponse.data?.data;
    
//     if (!quotationData) {
//       toast.error("Quotation not found");
//       return;
//     }
    
//     // 2. Extract basic info
//     const requester = quotationData.requester || {};
    
//     // 3. Prepare simplified data structure
//     const simplifiedData = {
//       // Basic info
//       doctor_name: requester.name || "Dr. Professional",
//       hospital_name: requester.type === "hospital" ? requester.name : "Individual Practice",
//       address: formatAddressFromData(quotationData),
//       specialization: "General Practitioner",
//       number_of_beds: "N/A",
      
//       // Quotation details
//       pricing_items: quotationData.requestDetails?.items || getDefaultPricingItems(),
//       policy_years: quotationData.requestDetails?.policyTerms || [1],
//       note: quotationData.requestDetails?.additionalRequirements || "All prices exclusive of GST.",
//       payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
      
//       // Dates
//       quotation_date: formatDate(quotationData.createdAt),
//       valid_till: formatDate(quotationData.expiryDate),
//       quotation_number: quotationData.quotationNumber || `Q-${id?.substring(0, 8)}`,
//       trno: quotationData.trno || "",
//       quotation_id: quotationData._id,
      
//       // Membership type based on requester type
//       membership_type: getMembershipTypeFromRequester(requester.type)
//     };
    
//     // 4. Try to fetch doctor data if available
//     if (requester.entityId) {
//       try {
//         const doctorResponse = await apiClient.get(`/doctors/${requester.entityId}`);
//         if (doctorResponse.data?.success) {
//           const doctorData = doctorResponse.data.data;
//           simplifiedData.doctor_name = doctorData.fullName || simplifiedData.doctor_name;
//           simplifiedData.hospital_name = doctorData.hospitalName || simplifiedData.hospital_name;
//           simplifiedData.address = getFormattedAddress(doctorData) || simplifiedData.address;
//           simplifiedData.specialization = doctorData.specialization?.join(", ") || "Multi-Speciality";
//           simplifiedData.number_of_beds = doctorData.hospitalDetails?.beds?.toString() || "N/A";
//           simplifiedData.doctor_id = doctorData.doctorId || "N/A";
//         }
//       } catch (docError) {
//         console.warn("Doctor fetch optional, continuing:", docError.message);
//       }
//     }
    
//     console.log("📄 FINAL QUOTATION DATA:", simplifiedData);
//     setComponentData(simplifiedData);
    
//     // 5. Set component type
//     const compType = requester.type === "doctor" ? "individual" : 
//                      requester.type === "combined" ? "combined" : "hospital";
//     setMembershipType(compType);
    
//     setTimeout(() => setPrintReady(true), 500);
    
//   } catch (error) {
//     console.error("Error fetching quotation:", error);
//     toast.error("Failed to load quotation");
    
//     // Emergency fallback data
//     const emergencyData = getEmergencyData(id);
//     setComponentData(emergencyData);
//     setMembershipType('hospital');
//     setTimeout(() => setPrintReady(true), 300);
//   } finally {
//     setLoading(false);
//   }
// };


// // ====================== HELPER FUNCTIONS ======================

// // Helper 1: Format address from quotation data
// function formatAddressFromData(quotationData) {
//   if (!quotationData) return "Address Not Available";
  
//   const requester = quotationData.requester || {};
  
//   // Check if address exists in requester
//   if (requester.address) {
//     return requester.address;
//   }
  
//   // Check if createdBy has address
//   if (quotationData.createdBy?.address) {
//     return quotationData.createdBy.address;
//   }
  
//   // Check entityId if it's populated
//   if (typeof requester.entityId === 'object' && requester.entityId !== null) {
//     const entity = requester.entityId;
    
//     // Try hospital address first
//     if (entity.hospitalAddress) {
//       const addr = entity.hospitalAddress;
//       const parts = [];
//       if (addr.address) parts.push(addr.address);
//       if (addr.city) parts.push(addr.city);
//       if (addr.state) parts.push(addr.state);
//       if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//       return parts.join(", ");
//     }
    
//     // Try contact address
//     if (entity.contactDetails?.currentAddress) {
//       const addr = entity.contactDetails.currentAddress;
//       const parts = [];
//       if (addr.address) parts.push(addr.address);
//       if (addr.city) parts.push(addr.city);
//       if (addr.state) parts.push(addr.state);
//       if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//       return parts.join(", ");
//     }
    
//     // Try simple address fields
//     if (entity.address) {
//       return entity.address;
//     }
//   }
  
//   return "Address Not Available";
// }

// // Helper 2: Get formatted address from doctor data
// function getFormattedAddress(doctorData) {
//   if (!doctorData) return null;
  
//   // Try hospital address first
//   if (doctorData.hospitalAddress) {
//     const addr = doctorData.hospitalAddress;
//     const parts = [];
//     if (addr.address) parts.push(addr.address);
//     if (addr.city) parts.push(addr.city);
//     if (addr.state) parts.push(addr.state);
//     if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//     return parts.join(", ");
//   }
  
//   // Try contact address
//   if (doctorData.contactDetails?.currentAddress) {
//     const addr = doctorData.contactDetails.currentAddress;
//     const parts = [];
//     if (addr.address) parts.push(addr.address);
//     if (addr.city) parts.push(addr.city);
//     if (addr.state) parts.push(addr.state);
//     if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//     return parts.join(", ");
//   }
  
//   return null;
// }

// // Helper 3: Format date to DD.MM.YYYY
// function formatDate(dateString) {
//   if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
  
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
//     }
    
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}.${month}.${year}`;
//   } catch {
//     return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
//   }
// }

// // Helper 4: Get membership type display name
// function getMembershipTypeFromRequester(type) {
//   if (!type) return "HOSPITAL MEMBERSHIP";
  
//   switch(type.toLowerCase()) {
//     case 'doctor': 
//       return "INDIVIDUAL DOCTOR MEMBERSHIP";
//     case 'hospital': 
//       return "HOSPITAL MEMBERSHIP";
//     case 'combined': 
//       return "COMBINED HOSPITAL + INDIVIDUAL";
//     default: 
//       return "HOSPITAL MEMBERSHIP";
//   }
// }

// // Helper 5: Default pricing items for fallback
// function getDefaultPricingItems() {
//   return [
//     {
//       indemnity: "10 LAKH",
//       monthly: "1000",
//       year_1: "10000",
//       year_5: "50000"
//     }
//   ];
// }

// // Helper 6: Emergency data for fallback
// function getEmergencyData(id) {
//   return {
//     doctor_name: "Dr. Professional",
//     hospital_name: "Medical Center",
//     address: "123 Medical Street, Mumbai, Maharashtra - 400001",
//     specialization: "Multi-Speciality",
//     number_of_beds: "50",
//     doctor_id: "N/A",
//     pricing_items: getDefaultPricingItems(),
//     policy_years: [1, 5],
//     note: "All prices exclusive of GST. Terms and conditions apply.",
//     payment_frequency: "yearly",
//     quotation_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
//     valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.'),
//     quotation_number: `Q-${id?.substring(0, 6) || "EMG"}`,
//     trno: "",
//     quotation_id: id || "",
//     membership_type: "HOSPITAL MEMBERSHIP"
//   };
// }

// // Helper functions
// function formatAddress(doctor) {
//   if (!doctor) return "Address Not Available";
  
//   // Try hospital address
//   if (doctor.hospitalAddress) {
//     const a = doctor.hospitalAddress;
//     const parts = [];
//     if (a.address) parts.push(a.address);
//     if (a.city) parts.push(a.city);
//     if (a.state) parts.push(a.state);
//     if (a.pinCode) parts.push(`- ${a.pinCode}`);
//     return parts.join(", ");
//   }
  
//   // Try contact address
//   if (doctor.contactDetails?.currentAddress) {
//     const a = doctor.contactDetails.currentAddress;
//     const parts = [];
//     if (a.address) parts.push(a.address);
//     if (a.city) parts.push(a.city);
//     if (a.state) parts.push(a.state);
//     if (a.pinCode) parts.push(`- ${a.pinCode}`);
//     return parts.join(", ");
//   }
  
//   return "Address Not Available";
// }

// function getMembershipType(requesterType, doctorType) {
//   if (doctorType === 'hospital_individual') return "HOSPITAL + INDIVIDUAL MEMBERSHIP";
//   if (doctorType === 'individual') return "INDIVIDUAL DOCTOR MEMBERSHIP";
//   if (doctorType === 'hospital') return "HOSPITAL MEMBERSHIP";
//   if (requesterType === 'combined') return "HOSPITAL + INDIVIDUAL MEMBERSHIP";
//   if (requesterType === 'doctor') return "INDIVIDUAL DOCTOR MEMBERSHIP";
//   return "HOSPITAL MEMBERSHIP";
// }

// function getComponentType(requesterType, doctorType) {
//   if (doctorType === 'hospital_individual' || requesterType === 'combined') return 'combined';
//   if (doctorType === 'individual' || requesterType === 'doctor') return 'individual';
//   return 'hospital';
// }




// // ✅ Helper function for address formatting
// function getFormattedAddress(doctorData) {
//   if (!doctorData) return null;
  
//   // Try hospital address first
//   if (doctorData.hospitalAddress) {
//     const addr = doctorData.hospitalAddress;
//     const parts = [];
//     if (addr.address) parts.push(addr.address);
//     if (addr.city) parts.push(addr.city);
//     if (addr.state) parts.push(addr.state);
//     if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//     return parts.join(", ");
//   }
  
//   // Try contact address
//   if (doctorData.contactDetails?.currentAddress) {
//     const addr = doctorData.contactDetails.currentAddress;
//     const parts = [];
//     if (addr.address) parts.push(addr.address);
//     if (addr.city) parts.push(addr.city);
//     if (addr.state) parts.push(addr.state);
//     if (addr.pinCode) parts.push(`- ${addr.pinCode}`);
//     return parts.join(", ");
//   }
  
//   return null;
// }


//     fetchAllData();
//   }, [id]);

//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: `Quotation_${componentData?.quotation_number || 'RMS'}`,
//     pageStyle: `
//       @page { size: A4 portrait; margin: 0; }
//       body { margin: 0; padding: 0; }
//       * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     `,
//   });

//   const renderQuotation = () => {
//     if (!componentData) return null;

//     const baseData = {
//       ...componentData,
//       membership_type: membershipType === 'individual'
//         ? "INDIVIDUAL DOCTOR MEMBERSHIP"
//         : membershipType === 'combined'
//         ? "COMBINED HOSPITAL + INDIVIDUAL"
//         : "HOSPITAL MEMBERSHIP",
//       number_of_beds: membershipType === 'individual' ? "N/A" : componentData.number_of_beds,
//     };

//     switch (membershipType) {
//       case 'hospital':
//         return <HospitalMembershipQuotation ref={componentRef} data={baseData} />;
//       case 'individual':
//         return <IndividualMembershipQuotation ref={componentRef} data={baseData} />;
//       case 'combined':
//         return <CombinedMembershipQuotation ref={componentRef} data={baseData} />;
//       default:
//         return <HospitalMembershipQuotation ref={componentRef} data={baseData} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
//           <p className="text-2xl font-bold">Loading Quotation & Doctor Details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="no-print sticky top-0 bg-white shadow-2xl z-50 p-6">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Quotation: {componentData?.quotation_number}</h1>
//             <p className="text-lg">Dr. {componentData?.doctor_name} | {componentData?.hospital_name}</p>
//           </div>
//           <button
//             onClick={handlePrint}
//             className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl"
//           >
//             🖨️ Print Now
//           </button>
//         </div>
//       </div>


//       {renderQuotation()}
//     </div>
//   );
// };











// // components/QuotationController.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [printReady, setPrintReady] = useState(false);
//   const [componentData, setComponentData] = useState(null);

//   const componentRef = useRef();
//   const { id } = useParams(); // Quotation ID

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. GET QUOTATION DATA
//         const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
//         const quotationData = quotationResponse.data?.data;
        
//         if (!quotationData) {
//           toast.error("Quotation not found");
//           return;
//         }

//         console.log("📄 QUOTATION DATA:", {
//           id: quotationData._id,
//           requesterType: quotationData.requester?.type,
//           name: quotationData.requester?.name,
//           entityId: quotationData.requester?.entityId
//         });

//         const requester = quotationData.requester || {};
        
//         // 2. GET DOCTOR DATA IF AVAILABLE
//         let doctorData = null;
//         let doctorId = null;
        
//         // Extract doctor ID from entityId
//         if (requester.entityId) {
//           if (typeof requester.entityId === 'object' && requester.entityId._id) {
//             doctorId = requester.entityId._id;
//             doctorData = requester.entityId;
//           } else if (typeof requester.entityId === 'string') {
//             doctorId = requester.entityId;
//           }
//         }
        
//         // Fetch doctor data if we have ID but not populated
//         if (doctorId && !doctorData) {
//           try {
//             const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
//             if (doctorResponse.data?.success) {
//               doctorData = doctorResponse.data.data;
//             }
//           } catch (error) {
//             console.warn("Doctor fetch failed:", error.message);
//           }
//         }

//         // 3. DETERMINE MEMBERSHIP TYPE
//         // let determinedType = 'hospital';
//         // let membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
        
//         // // Check doctor type first
//         // if (doctorData?.doctorType) {
//         //   if (doctorData.doctorType === 'individual') {
//         //     determinedType = 'individual';
//         //     membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
//         //   } else if (doctorData.doctorType === 'hospital_individual') {
//         //     determinedType = 'combined';
//         //     membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//         //   } else if (doctorData.doctorType === 'hospital') {
//         //     determinedType = 'hospital';
//         //     membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
//         //   }
//         // }
//         // // Fallback to requester type
//         // else if (requester.type === 'doctor') {
//         //   determinedType = 'individual';
//         //   membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
//         // } else if (requester.type === 'combined') {
//         //   determinedType = 'combined';
//         //   membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//         // }

//         // console.log("🎯 DETERMINED TYPE:", {
//         //   determinedType,
//         //   membershipTypeDisplay,
//         //   doctorType: doctorData?.doctorType,
//         //   requesterType: requester.type
//         // });


// // 3. DETERMINE MEMBERSHIP TYPE
// let determinedType = 'hospital';
// let membershipTypeDisplay = "HOSPITAL MEMBERSHIP";

// // Check doctor type first
// if (doctorData?.doctorType) {
//   if (doctorData.doctorType === 'individual') {
//     determinedType = 'individual';
//     membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
//   } else if (doctorData.doctorType === 'hospital_individual') {
//     determinedType = 'combined';
//     // CRITICAL: Use EXACT same string as Combined component expects
//     membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//   } else if (doctorData.doctorType === 'hospital') {
//     determinedType = 'hospital';
//     membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
//   }
// }
// // Fallback to requester type
// else if (requester.type === 'doctor') {
//   determinedType = 'individual';
//   membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
// } else if (requester.type === 'combined') {
//   determinedType = 'combined';
//   // CRITICAL: Use EXACT same string
//   membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
// }

// console.log("🎯 DETERMINED TYPE:", {
//   determinedType,
//   membershipTypeDisplay,
//   doctorType: doctorData?.doctorType,
//   requesterType: requester.type
// });



//         // 4. PREPARE COMPONENT DATA
//         const prepareComponentData = () => {
//           const baseData = {
//             // Doctor/Hospital Info
//             doctor_name: doctorData?.fullName || requester.name || "Dr. Professional",
//             hospital_name: doctorData?.hospitalName || 
//                           (determinedType === 'individual' ? "Individual Practice" : "Hospital Name"),
            
//             // Address
//             address: formatAddress(doctorData) || "Address Not Available",
            
//             // Specialization & Details
//             specialization: doctorData?.specialization?.join(", ") || 
//                            doctorData?.hospitalDetails?.hospitalType || 
//                            "Multi-Speciality",
            
//             number_of_beds: determinedType === 'individual' ? "N/A" : 
//                            doctorData?.hospitalDetails?.beds?.toString() || "15",
            
//             doctor_id: doctorData?.doctorId || "N/A",
            
//             // Quotation Details
//             pricing_items: quotationData.requestDetails?.items || getDefaultPricingItems(determinedType),
//             policy_years: quotationData.requestDetails?.policyTerms || [1, 2, 3],
//             note: quotationData.requestDetails?.additionalRequirements || 
//                  getDefaultNote(determinedType),
            
//             payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
//             indemnity_cover: quotationData.requestDetails?.specialConditions || "₹25,00,000",
            
//             // Dates
//             quotation_date: formatDate(quotationData.createdAt),
//             valid_till: formatDate(quotationData.expiryDate),
            
//             // IDs
//             quotation_number: quotationData.quotationNumber || `Q-${id?.substring(0, 8)}`,
//             trno: quotationData.trno || "",
//             quotation_id: quotationData._id,
            
//             // Membership Type (IMPORTANT FOR TABLE)
//             membership_type: membershipTypeDisplay
//           };

//           return baseData;
//         };

//         const finalData = prepareComponentData();
        
//         console.log("✅ FINAL DATA FOR COMPONENT:", {
//           name: finalData.doctor_name,
//           hospital: finalData.hospital_name,
//           type: finalData.membership_type,
//           beds: finalData.number_of_beds
//         });
        
//         setComponentData(finalData);
//         setMembershipType(determinedType);
        
//         setTimeout(() => setPrintReady(true), 800);

//       } catch (error) {
//         console.error("🔥 ERROR:", error);
//         toast.error("Failed to load quotation");
        
//         // Emergency fallback
//         const emergencyData = getEmergencyData(id);
//         setComponentData(emergencyData);
//         setMembershipType('hospital');
//         setTimeout(() => setPrintReady(true), 500);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Helper Functions
//     function formatAddress(doctor) {
//       if (!doctor) return null;
      
//       // Try hospital address
//       if (doctor.hospitalAddress) {
//         const a = doctor.hospitalAddress;
//         const parts = [];
//         if (a.address) parts.push(a.address);
//         if (a.city) parts.push(a.city);
//         if (a.state) parts.push(a.state);
//         if (a.pinCode) parts.push(`- ${a.pinCode}`);
//         return parts.join(", ");
//       }
      
//       // Try contact address
//       if (doctor.contactDetails?.currentAddress) {
//         const a = doctor.contactDetails.currentAddress;
//         const parts = [];
//         if (a.address) parts.push(a.address);
//         if (a.city) parts.push(a.city);
//         if (a.state) parts.push(a.state);
//         if (a.pinCode) parts.push(`- ${a.pinCode}`);
//         return parts.join(", ");
//       }
      
//       return null;
//     }

//     function formatDate(dateString) {
//       if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
      
//       try {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}.${month}.${year}`;
//       } catch {
//         return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
//       }
//     }

//     function getDefaultPricingItems(type) {
//       if (type === 'individual') {
//         return [
//           {
//             indemnity: "₹25,00,000",
//             monthly: "1200",
//             year_1: "10800",
//             year_2: "21600",
//             year_3: "32400"
//           }
//         ];
//       } else if (type === 'combined') {
//         return [
//           {
//             indemnity: "₹25,00,000",
//             monthly: "1000",
//             year_1: "10000",
//             year_2: "20000",
//             year_3: "30000"
//           }
//         ];
//       } else {
//         // Hospital
//         return [
//           {
//             indemnity: "₹25,00,000",
//             monthly: "1000",
//             year_1: "10000",
//             year_2: "20000",
//             year_3: "30000"
//           }
//         ];
//       }
//     }

//     // function getDefaultNote(type) {
//     //   if (type === 'individual') {
//     //     return "Individual doctor membership covers personal practice only. Coverage does not extend to hospital staff or facilities.";
//     //   } else if (type === 'combined') {
//     //     return "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice.";
//     //   } else {
//     //     return "All prices are exclusive of taxes. Terms and conditions apply.";
//     //   }
//     // }

// function getDefaultNote(type) {
//   if (type === 'individual') {
//     return "Individual doctor membership covers personal practice only. Coverage does not extend to hospital staff or facilities.";
//   } else if (type === 'combined') {
//     return "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice.";
//   } else {
//     return "All prices are exclusive of taxes. Terms and conditions apply.";
//   }
// }

//     function getEmergencyData(quotationId) {
//       return {
//         doctor_name: "Dr. Professional",
//         hospital_name: "Medical Center",
//         address: "123 Medical Street, Mumbai, Maharashtra - 400001",
//         specialization: "Multi-Speciality",
//         number_of_beds: "50",
//         doctor_id: "N/A",
//         pricing_items: getDefaultPricingItems('hospital'),
//         policy_years: [1, 2, 3],
//         note: "Emergency quotation data. Please contact support.",
//         payment_frequency: "yearly",
//         quotation_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
//         valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.'),
//         quotation_number: `Q-${quotationId?.substring(0, 6) || "EMG"}`,
//         trno: "",
//         quotation_id: quotationId || "",
//         membership_type: "HOSPITAL MEMBERSHIP"
//       };
//     }

//     fetchAllData();
//   }, [id]);

//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: `Quotation_${componentData?.quotation_number || 'RMS'}`,
//     pageStyle: `
//       @page { size: A4 portrait; margin: 0; }
//       body { margin: 0; padding: 0; }
//       * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     `,
//   });

//   const renderQuotation = () => {
//     if (!componentData) return null;

//     console.log("🎯 RENDERING QUOTATION WITH:", {
//       type: membershipType,
//       dataType: componentData.membership_type
//     });

//     switch (membershipType) {
//       case 'individual':
//         return <IndividualMembershipQuotation ref={componentRef} data={componentData} />;
//       case 'combined':
//         return <CombinedMembershipQuotation ref={componentRef} data={componentData} />;
//       case 'hospital':
//       default:
//         return <HospitalMembershipQuotation ref={componentRef} data={componentData} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
//           <p className="text-2xl font-bold">Loading Quotation Details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="no-print sticky top-0 bg-white shadow-2xl z-50 p-6">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Quotation: {componentData?.quotation_number}</h1>
//             <p className="text-lg">Dr. {componentData?.doctor_name} | Type: {componentData?.membership_type}</p>
//           </div>
//           <button
//             onClick={handlePrint}
//             className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl"
//             disabled={!printReady}
//           >
//             {printReady ? "🖨️ Print Now" : "⏳ Loading..."}
//           </button>
//         </div>
//       </div>

//       {renderQuotation()}
//     </div>
//   );
// };










// // components/QuotationController.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import HospitalMembershipQuotation from './HospitalMembershipQuotation';
// import IndividualMembershipQuotation from './IndividualMembershipQuotation';
// import CombinedMembershipQuotation from './CombinedMembershipQuotation';
// import { useReactToPrint } from 'react-to-print';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const QuotationController = () => {
//   const [membershipType, setMembershipType] = useState('hospital');
//   const [loading, setLoading] = useState(true);
//   const [printReady, setPrintReady] = useState(false);
//   const [componentData, setComponentData] = useState(null);

//   const componentRef = useRef();
//   const { id } = useParams(); // Quotation ID

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. GET QUOTATION DATA
//         const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
//         const quotationData = quotationResponse.data?.data;
        
//         if (!quotationData) {
//           toast.error("Quotation not found");
//           return;
//         }

//         console.log("📄 RAW QUOTATION DATA:", quotationData);
//         console.log("📄 Requester:", quotationData.requester);
//         console.log("📄 Doctor Data:", quotationData.requester?.entityId);

//         const requester = quotationData.requester || {};
        
//         // 2. GET DOCTOR DATA IF AVAILABLE
//         let doctorData = null;
//         let doctorId = null;
        
//         // Extract doctor ID from entityId
//         if (requester.entityId) {
//           if (typeof requester.entityId === 'object' && requester.entityId._id) {
//             doctorId = requester.entityId._id;
//             doctorData = requester.entityId;
//             console.log("🔄 Doctor data already populated:", doctorData);
//           } else if (typeof requester.entityId === 'string') {
//             doctorId = requester.entityId;
//             console.log("🔄 Doctor ID from string:", doctorId);
//           }
//         }
        
//         // Fetch doctor data if we have ID but not populated
//         if (doctorId && !doctorData) {
//           try {
//             console.log("🔄 Fetching doctor data for ID:", doctorId);
//             const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
//             if (doctorResponse.data?.success) {
//               doctorData = doctorResponse.data.data;
//               console.log("🔄 Fetched doctor data:", doctorData);
//             }
//           } catch (error) {
//             console.warn("Doctor fetch failed:", error.message);
//           }
//         }

//         // 3. CRITICAL FIX: DETERMINE MEMBERSHIP TYPE FROM DOCTOR DATA
//         let determinedType = 'hospital';
//         let membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
        
//         console.log("🔍 DEBUG - Checking doctor type:", {
//           doctorType: doctorData?.doctorType,
//           doctorData: doctorData,
//           requesterType: requester.type
//         });

//         // FIRST PRIORITY: Check doctor's doctorType field
//         if (doctorData?.doctorType) {
//           console.log("✅ Doctor type found:", doctorData.doctorType);
          
//           if (doctorData.doctorType === 'individual' || doctorData.doctorType === 'Individual') {
//             determinedType = 'individual';
//             membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
//             console.log("✅ Set to INDIVIDUAL");
//           } 
//           else if (doctorData.doctorType === 'hospital_individual' || 
//                    doctorData.doctorType === 'combined' ||
//                    doctorData.doctorType === 'hospital_combined') {
//             determinedType = 'combined';
//             membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//             console.log("✅ Set to COMBINED");
//           } 
//           else if (doctorData.doctorType === 'hospital' || doctorData.doctorType === 'Hospital') {
//             determinedType = 'hospital';
//             membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
//             console.log("✅ Set to HOSPITAL");
//           }
//         }
//         // SECOND PRIORITY: Check quotation's requester type
//         else if (requester.type) {
//           console.log("⚠️ Using requester type:", requester.type);
          
//           if (requester.type === 'doctor' || requester.type === 'individual') {
//             determinedType = 'individual';
//             membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
//           } 
//           else if (requester.type === 'combined' || requester.type === 'hospital_individual') {
//             determinedType = 'combined';
//             membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//           }
//           else if (requester.type === 'hospital') {
//             determinedType = 'hospital';
//             membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
//           }
//         }

//         console.log("🎯 FINAL DETERMINATION:", {
//           determinedType,
//           membershipTypeDisplay,
//           doctorType: doctorData?.doctorType,
//           requesterType: requester.type
//         });

//         // 4. PREPARE COMPONENT DATA WITH CORRECT TYPE
//         const prepareComponentData = () => {
//           const baseData = {
//             // Doctor/Hospital Info
//             doctor_name: doctorData?.fullName || doctorData?.name || requester.name || "Dr. Professional",
//             hospital_name: doctorData?.hospitalName || 
//                           (determinedType === 'individual' ? "Individual Practice" : "Hospital Name"),
            
//             // Address
//             address: formatAddress(doctorData) || "Address Not Available",
            
//             // Specialization & Details
//             specialization: doctorData?.specialization?.join(", ") || 
//                            doctorData?.hospitalDetails?.hospitalType || 
//                            "Multi-Speciality",
            
//             number_of_beds: determinedType === 'individual' ? "N/A" : 
//                            (doctorData?.hospitalDetails?.beds?.toString() || "15"),
            
//             doctor_id: doctorData?.doctorId || "N/A",
            
//             // Quotation Details
//             pricing_items: quotationData.requestDetails?.items || getDefaultPricingItems(determinedType),
//             policy_years: quotationData.requestDetails?.policyTerms || [1, 2, 3],
//             note: quotationData.requestDetails?.additionalRequirements || 
//                  getDefaultNote(determinedType),
            
//             payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
//             indemnity_cover: quotationData.requestDetails?.specialConditions || "₹25,00,000",
            
//             // Dates
//             quotation_date: formatDate(quotationData.createdAt),
//             valid_till: formatDate(quotationData.expiryDate),
            
//             // IDs
//             quotation_number: quotationData.quotationNumber || `Q-${id?.substring(0, 8)}`,
//             trno: quotationData.trno || "",
//             quotation_id: quotationData._id,
            
//             // CRITICAL: Force the membership type from our determination
//             membership_type: membershipTypeDisplay
//           };

//           return baseData;
//         };

//         const finalData = prepareComponentData();
        
//         console.log("✅ FINAL COMPONENT DATA:", {
//           membership_type: finalData.membership_type,
//           doctor_name: finalData.doctor_name,
//           hospital_name: finalData.hospital_name,
//           type: determinedType
//         });
        
//         // CRITICAL: Set both state values
//         setComponentData(finalData);
//         setMembershipType(determinedType);
        
//         setTimeout(() => setPrintReady(true), 800);

//       } catch (error) {
//         console.error("🔥 ERROR:", error);
//         toast.error("Failed to load quotation");
        
//         // Emergency fallback
//         const emergencyData = getEmergencyData(id);
//         setComponentData(emergencyData);
//         setMembershipType('hospital');
//         setTimeout(() => setPrintReady(true), 500);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Helper Functions (keep existing)
//     function formatAddress(doctor) {
//       if (!doctor) return null;
      
//       if (doctor.hospitalAddress) {
//         const a = doctor.hospitalAddress;
//         const parts = [];
//         if (a.address) parts.push(a.address);
//         if (a.city) parts.push(a.city);
//         if (a.state) parts.push(a.state);
//         if (a.pinCode) parts.push(`- ${a.pinCode}`);
//         return parts.join(", ");
//       }
      
//       if (doctor.contactDetails?.currentAddress) {
//         const a = doctor.contactDetails.currentAddress;
//         const parts = [];
//         if (a.address) parts.push(a.address);
//         if (a.city) parts.push(a.city);
//         if (a.state) parts.push(a.state);
//         if (a.pinCode) parts.push(`- ${a.pinCode}`);
//         return parts.join(", ");
//       }
      
//       return null;
//     }

//     function formatDate(dateString) {
//       if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
      
//       try {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}.${month}.${year}`;
//       } catch {
//         return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
//       }
//     }

//     function getDefaultPricingItems(type) {
//       if (type === 'individual') {
//         return [
//           {
//             description: "Individual Doctor Coverage",
//             indemnity: "₹25,00,000",
//             monthly: "1200",
//             year_1: "10800",
//             year_2: "21600",
//             year_3: "32400"
//           }
//         ];
//       } else if (type === 'combined') {
//         return [
//           {
//             description: "Combined Hospital + Doctor",
//             indemnity: "₹25,00,000",
//             monthly: "1000",
//             year_1: "10000",
//             year_2: "20000",
//             year_3: "30000"
//           }
//         ];
//       } else {
//         // Hospital
//         return [
//           {
//             description: "Hospital Coverage",
//             indemnity: "₹25,00,000",
//             monthly: "1000",
//             year_1: "10000",
//             year_2: "20000",
//             year_3: "30000"
//           }
//         ];
//       }
//     }

//     function getDefaultNote(type) {
//       if (type === 'individual') {
//         return "Individual doctor membership covers personal practice only. Coverage does not extend to hospital staff or facilities.";
//       } else if (type === 'combined') {
//         return "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice.";
//       } else {
//         return "All prices are exclusive of taxes. Terms and conditions apply.";
//       }
//     }

//     function getEmergencyData(quotationId) {
//       return {
//         doctor_name: "Dr. Professional",
//         hospital_name: "Medical Center",
//         address: "123 Medical Street, Mumbai, Maharashtra - 400001",
//         specialization: "Multi-Speciality",
//         number_of_beds: "50",
//         doctor_id: "N/A",
//         pricing_items: getDefaultPricingItems('hospital'),
//         policy_years: [1, 2, 3],
//         note: "Emergency quotation data. Please contact support.",
//         payment_frequency: "yearly",
//         quotation_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
//         valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.'),
//         quotation_number: `Q-${quotationId?.substring(0, 6) || "EMG"}`,
//         trno: "",
//         quotation_id: quotationId || "",
//         membership_type: "HOSPITAL MEMBERSHIP"
//       };
//     }

//     fetchAllData();
//   }, [id]);

//   // Debug current state
//   useEffect(() => {
//     if (componentData) {
//       console.log("🔄 CURRENT STATE:", {
//         membershipType: membershipType,
//         componentData_membership_type: componentData.membership_type,
//         doctor_name: componentData.doctor_name
//       });
//     }
//   }, [componentData, membershipType]);

//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: `Quotation_${componentData?.quotation_number || 'RMS'}`,
//     pageStyle: `
//       @page { size: A4 portrait; margin: 0; }
//       body { margin: 0; padding: 0; }
//       * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     `,
//   });

//   const renderQuotation = () => {
//     if (!componentData) return null;

//     console.log("🎯 RENDERING QUOTATION:", {
//       membershipType: membershipType,
//       data_membership_type: componentData.membership_type,
//       shouldRender: componentData.membership_type.includes('COMBINED') ? 'combined' : 
//                    componentData.membership_type.includes('INDIVIDUAL') ? 'individual' : 'hospital'
//     });

//     // Force based on membership_type in data
//     const renderType = componentData.membership_type.includes('COMBINED') ? 'combined' : 
//                       componentData.membership_type.includes('INDIVIDUAL') ? 'individual' : 'hospital';
    
//     console.log("🎯 ACTUAL RENDER TYPE:", renderType);

//     switch (renderType) {
//       case 'individual':
//         return <IndividualMembershipQuotation ref={componentRef} data={componentData} />;
//       case 'combined':
//         return <CombinedMembershipQuotation ref={componentRef} data={componentData} />;
//       case 'hospital':
//       default:
//         return <HospitalMembershipQuotation ref={componentRef} data={componentData} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
//           <p className="text-2xl font-bold">Loading Quotation Details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="no-print sticky top-0 bg-white shadow-2xl z-50 p-6">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Quotation: {componentData?.quotation_number}</h1>
//             <p className="text-lg">
//               Dr. {componentData?.doctor_name} | 
//               Type: <span className="text-red-600 font-bold">{componentData?.membership_type}</span>
//             </p>
//           </div>
//           {/* Add this in the QuotationController render section */}
// <div className="no-print p-4 bg-yellow-100">
//   <button 
//     onClick={() => {
//       console.log("🔍 DEBUG CURRENT DATA:", {
//         membershipType,
//         componentData,
//         doctorType: componentData?.doctorType
//       });
//     }}
//     className="px-4 py-2 bg-blue-500 text-white"
//   >
//     Debug Data
//   </button>
// </div>
//           <button
//             onClick={handlePrint}
//             className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl"
//             disabled={!printReady}
//           >
//             {printReady ? "🖨️ Print Now" : "⏳ Loading..."}
//           </button>
//         </div>
//       </div>

//       {renderQuotation()}
//     </div>
//   );
// };






// components/QuotationController.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HospitalMembershipQuotation from './HospitalMembershipQuotation';
import IndividualMembershipQuotation from './IndividualMembershipQuotation';
import CombinedMembershipQuotation from './CombinedMembershipQuotation';
import { useReactToPrint } from 'react-to-print';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const QuotationController = () => {
  const [membershipType, setMembershipType] = useState('hospital');
  const [loading, setLoading] = useState(true);
  const [printReady, setPrintReady] = useState(false);
  const [componentData, setComponentData] = useState(null);
  const location = useLocation(); // Add this for state from EditQuotation

  const componentRef = useRef();
  const { id } = useParams(); // Quotation ID

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        console.log('🔍 QUOTATION_CONTROLLER: Starting fetch for ID:', id);
        console.log('🔍 LOCATION_STATE:', location.state); // Debug state from EditQuotation

        // 1. GET QUOTATION DATA
        const quotationResponse = await apiClient.get(apiEndpoints.quotations.get(id));
        const quotationData = quotationResponse.data?.data;
        
        if (!quotationData) {
          toast.error("Quotation not found");
          return;
        }

        console.log("📄 QUOTATION_CONTROLLER - RAW DATA:", {
          id: quotationData._id,
          requester: quotationData.requester,
          requestDetails: quotationData.requestDetails
        });

        const requester = quotationData.requester || {};
        
        // 2. GET DOCTOR DATA IF AVAILABLE
        let doctorData = null;
        let doctorId = null;

        // FIRST: Check if we have state from EditQuotation
        if (location.state) {
          console.log('🎯 USING_STATE_FROM_EDIT_QUOTATION:', location.state);
          doctorData = location.state.doctorData || location.state.membershipData;
          console.log('🎯 DOCTOR_DATA_FROM_STATE:', doctorData);
        }

        // SECOND: Extract doctor ID from entityId
        if (!doctorData && requester.entityId) {
          console.log('🔍 CHECKING_ENTITY_ID:', requester.entityId);
          if (typeof requester.entityId === 'object' && requester.entityId._id) {
            doctorId = requester.entityId._id;
            doctorData = requester.entityId;
            console.log('✅ Doctor data from populated entityId:', doctorData);
          } else if (typeof requester.entityId === 'string') {
            doctorId = requester.entityId;
            console.log('🔍 Doctor ID from string:', doctorId);
          }
        }

        // THIRD: Fetch doctor data if we have ID but not populated
        if (doctorId && !doctorData) {
          try {
            console.log('🔄 FETCHING_DOCTOR_DATA for ID:', doctorId);
            const doctorResponse = await apiClient.get(`/doctors/${doctorId}`);
            if (doctorResponse.data?.success) {
              doctorData = doctorResponse.data.data;
              console.log('✅ Fetched doctor data:', {
                name: doctorData.fullName,
                doctorType: doctorData.doctorType,
                hospitalName: doctorData.hospitalName
              });
            }
          } catch (error) {
            console.warn("Doctor fetch failed:", error.message);
          }
        }

        // FOURTH: If entityId is null, try to find doctor by name as fallback
        if (!doctorData && !doctorId && requester.name) {
          try {
            console.log('🔍 ATTEMPTING TO FIND DOCTOR BY NAME:', requester.name);
            // Search for doctor by name to get complete data using the proper API endpoint
            const searchResponse = await apiClient.get(apiEndpoints.doctors.search, {
              params: { q: requester.name, limit: 1 }
            });

            if (searchResponse.data?.success && searchResponse.data?.data?.length > 0) {
              // Take the first match
              doctorData = searchResponse.data.data[0];
              console.log('✅ Found doctor by name:', {
                name: doctorData.fullName,
                doctorType: doctorData.doctorType,
                hospitalName: doctorData.hospitalName
              });
            } else {
              console.log('🔍 No doctor found by name:', requester.name);
            }
          } catch (error) {
            console.warn("Doctor search by name failed:", error.message);
            // Try alternative approach - fetch all doctors and find by name
            try {
              console.log('🔄 FALLBACK: Fetching all doctors to find match...');
              const allDoctorsResponse = await apiClient.get(apiEndpoints.doctors.list, {
                params: { limit: 1000 } // Get all doctors
              });

              if (allDoctorsResponse.data?.success && allDoctorsResponse.data?.data) {
                // Find doctor by name (exact match or closest match)
                const foundDoctor = allDoctorsResponse.data.data.find(doctor =>
                  doctor.fullName?.toLowerCase() === requester.name.toLowerCase() ||
                  doctor.hospitalName?.toLowerCase() === requester.name.toLowerCase()
                );

                if (foundDoctor) {
                  doctorData = foundDoctor;
                  console.log('✅ Found doctor by name in fallback search:', {
                    name: doctorData.fullName,
                    doctorType: doctorData.doctorType,
                    hospitalName: doctorData.hospitalName
                  });
                }
              }
            } catch (fallbackError) {
              console.warn("Fallback doctor search also failed:", fallbackError.message);
            }
          }
        }

        // 4. CRITICAL FIX: DETERMINE MEMBERSHIP TYPE CORRECTLY
        let determinedType = 'hospital';
        let membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
        
        console.log("🔍 DETERMINING_MEMBERSHIP_TYPE with:", {
          doctorData: doctorData ? {
            doctorType: doctorData.doctorType,
            name: doctorData.fullName || doctorData.name
          } : 'No doctor data',
          requesterType: requester.type,
          locationState: location.state?.membershipType
        });

        // PRIORITY 1: Check location state from EditQuotation (most reliable)
        if (location.state?.membershipType) {
          console.log('🎯 USING_MEMBERSHIP_TYPE_FROM_STATE:', location.state.membershipType);
          membershipTypeDisplay = location.state.membershipType;
          
          if (membershipTypeDisplay.includes('COMBINED') || 
              membershipTypeDisplay.includes('HOSPITAL + INDIVIDUAL')) {
            determinedType = 'combined';
          } else if (membershipTypeDisplay.includes('INDIVIDUAL') && 
                     !membershipTypeDisplay.includes('HOSPITAL')) {
            determinedType = 'individual';
          } else {
            determinedType = 'hospital';
          }
        }
        // PRIORITY 2: Check doctor type from fetched data
        else if (doctorData?.doctorType) {
          console.log('🎯 USING_DOCTOR_TYPE:', doctorData.doctorType);

          // CRITICAL: Use the doctorType field directly as the single source of truth
          // DO NOT derive membership type from other fields like hospital_id
          if (doctorData.doctorType === 'individual' || doctorData.doctorType === 'Individual') {
            determinedType = 'individual';
            membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
          }
          else if (doctorData.doctorType === 'hospital_individual') {
            // CRITICAL FIX: hospital_individual should display as "COMBINED HOSPITAL + INDIVIDUAL"
            determinedType = 'combined';
            membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
          }
          else if (doctorData.doctorType === 'combined' || doctorData.doctorType === 'hospital_combined') {
            determinedType = 'combined';
            membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
          }
          else if (doctorData.doctorType === 'hospital' || doctorData.doctorType === 'Hospital') {
            determinedType = 'hospital';
            membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
          }
        }
        // PRIORITY 3: Check requester type
        else if (requester.type) {
          console.log('🎯 USING_REQUESTER_TYPE:', requester.type);
          
          if (requester.type === 'doctor' || requester.type === 'individual') {
            determinedType = 'individual';
            membershipTypeDisplay = "INDIVIDUAL DOCTOR MEMBERSHIP";
          } 
          else if (requester.type === 'combined' || requester.type === 'hospital_individual') {
            determinedType = 'combined';
            membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
          }
          else if (requester.type === 'hospital') {
            determinedType = 'hospital';
            membershipTypeDisplay = "HOSPITAL MEMBERSHIP";
          }
        }
        // PRIORITY 4: Check from requestDetails
        else if (quotationData.requestDetails?.items?.[0]?.description) {
          const desc = quotationData.requestDetails.items[0].description;
          if (desc.includes('Combined') || desc.includes('Hospital + Doctor')) {
            determinedType = 'combined';
            membershipTypeDisplay = "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
          }
        }

        console.log("🎯 FINAL_DETERMINATION:", {
          determinedType,
          membershipTypeDisplay,
          doctorType: doctorData?.doctorType,
          requesterType: requester.type
        });

        // 5. PREPARE COMPONENT DATA WITH CORRECT TYPE
        // const prepareComponentData = () => {
        //   // Get hospital name properly
        //   let hospitalName = "Hospital Name";
        //   if (doctorData?.hospitalName) {
        //     hospitalName = doctorData.hospitalName;
        //   } else if (doctorData?.fullName && determinedType === 'hospital') {
        //     hospitalName = doctorData.fullName;
        //   } else if (determinedType === 'individual') {
        //     hospitalName = "Individual Practice";
        //   }

        //   // Get beds for combined/hospital
        //   let numberOfBeds = "15";
        //   if (determinedType === 'individual') {
        //     numberOfBeds = "N/A";
        //   } else if (doctorData?.hospitalDetails?.beds) {
        //     numberOfBeds = doctorData.hospitalDetails.beds.toString();
        //   }

        //   const baseData = {
        //     // Doctor/Hospital Info
        //     doctor_name: doctorData?.fullName || doctorData?.name || requester.name || "Dr. Professional",
        //     hospital_name: hospitalName,
            
        //     // Address
        //     address: formatAddress(doctorData) || "Address Not Available",
            
        //     // Specialization & Details
        //     specialization: doctorData?.specialization?.join(", ") || 
        //                    doctorData?.hospitalDetails?.hospitalType || 
        //                    (determinedType === 'combined' ? "Multi-Speciality Hospital" : "Multi-Speciality"),
            
        //     number_of_beds: numberOfBeds,
            
        //     doctor_id: doctorData?.doctorId || "N/A",
            
        //     // Quotation Details
        //     pricing_items: quotationData.requestDetails?.items || getDefaultPricingItems(determinedType),
        //     policy_years: quotationData.requestDetails?.policyTerms || [1, 2, 3],
        //     note: quotationData.requestDetails?.additionalRequirements || 
        //          getDefaultNote(determinedType),
            
        //     payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
        //     indemnity_cover: quotationData.requestDetails?.specialConditions || "₹25,00,000",
            
        //     // Dates
        //     quotation_date: formatDate(quotationData.createdAt),
        //     valid_till: formatDate(quotationData.expiryDate),
            
        //     // IDs
        //     quotation_number: quotationData.quotationNumber || `Q-${id?.substring(0, 8)}`,
        //     trno: quotationData.trno || "",
        //     quotation_id: quotationData._id,
            
        //     // CRITICAL: Force the correct membership type
        //     membership_type: membershipTypeDisplay
        //   };

        //   console.log("📦 PREPARED_COMPONENT_DATA:", {
        //     membership_type: baseData.membership_type,
        //     doctor_name: baseData.doctor_name,
        //     hospital_name: baseData.hospital_name,
        //     number_of_beds: baseData.number_of_beds,
        //     determinedType: determinedType
        //   });

        //   return baseData;
        // };


// QuotationController.jsx में prepareComponentData function में update करें:
const prepareComponentData = () => {
  // Get doctor and hospital names properly
  let doctorName = "Dr. Professional";
  let hospitalName = "Hospital Name";

  // Extract doctor name - prioritize fullName from doctor data
  if (doctorData?.fullName) {
    doctorName = doctorData.fullName;
  } else if (requester.name) {
    doctorName = requester.name;
  } else if (doctorData?.name) {
    doctorName = doctorData.name;
  }

  // Extract hospital name - use hospitalName from doctor data if available
  if (determinedType === 'individual') {
    hospitalName = doctorData?.hospitalName || "Individual Practice";
  } else if (determinedType === 'combined' || determinedType === 'hospital') {
    hospitalName = doctorData?.hospitalName || doctorData?.fullName || "Hospital Name";
  }

  // Get beds from doctor's hospitalDetails - prioritize actual bed count
  let numberOfBeds = "N/A"; // Default to N/A if not specified
  if (doctorData?.hospitalDetails?.beds !== undefined && doctorData?.hospitalDetails?.beds !== null) {
    numberOfBeds = doctorData.hospitalDetails.beds.toString();
  } else if (determinedType === 'individual') {
    numberOfBeds = "N/A";
  } else {
    numberOfBeds = "15"; // Default for hospital types if not specified
  }

  // Get specialization - prioritize from doctor data
  let specialization = "Multi-Speciality";
  if (doctorData?.specialization && Array.isArray(doctorData.specialization) && doctorData.specialization.length > 0) {
    specialization = doctorData.specialization.join(", ");
  } else if (doctorData?.hospitalDetails?.hospitalType) {
    specialization = doctorData.hospitalDetails.hospitalType;
  } else if (determinedType === 'combined') {
    specialization = "Multi-Speciality Hospital";
  }

  const baseData = {
    // Doctor/Hospital Info
    doctor_name: doctorName,
    hospital_name: hospitalName,

    // Address - use hospitalAddress from doctor data with fallback
    address: formatAddress(doctorData) ||
             (doctorData?.contactDetails?.currentAddress ?
               `${doctorData.contactDetails.currentAddress.address || ''}, ${doctorData.contactDetails.currentAddress.city || ''}, ${doctorData.contactDetails.currentAddress.state || ''} - ${doctorData.contactDetails.currentAddress.pinCode || ''}`.replace(/,+/g, ', ').replace(/^, |, $/g, '')
              : "Address Not Available"),

    // Specialization & Details
    specialization: specialization,

    number_of_beds: numberOfBeds,

    doctor_id: doctorData?.doctorId || doctorData?._id || "N/A",

    // Quotation Details
    pricing_items: quotationData.requestDetails?.items || getDefaultPricingItems(determinedType),
    policy_years: quotationData.requestDetails?.policyTerms || [1, 2, 3],
    note: quotationData.requestDetails?.additionalRequirements ||
         getDefaultNote(determinedType),

    payment_frequency: quotationData.requestDetails?.paymentFrequency || "yearly",
    indemnity_cover: quotationData.requestDetails?.specialConditions || "₹25,00,000",

    // Dates
    quotation_date: formatDate(quotationData.createdAt),
    valid_till: formatDate(quotationData.expiryDate),

    // IDs
    quotation_number: quotationData.quotationNumber || `Q-${id?.substring(0, 8)}`,
    trno: quotationData.trno || "",
    quotation_id: quotationData._id,

    // CRITICAL: Force the correct membership type
    membership_type: membershipTypeDisplay
  };

  console.log("📦 PREPARED_COMPONENT_DATA:", {
    membership_type: baseData.membership_type,
    doctor_name: baseData.doctor_name,
    hospital_name: baseData.hospital_name,
    number_of_beds: baseData.number_of_beds,
    determinedType: determinedType
  });

  return baseData;
};


        const finalData = prepareComponentData();
        
        console.log("✅ FINAL DATA FOR COMPONENT:", finalData);
        
        setComponentData(finalData);
        setMembershipType(determinedType);
        
        setTimeout(() => setPrintReady(true), 800);

      } catch (error) {
        console.error("🔥 QUOTATION_CONTROLLER_ERROR:", error);
        toast.error("Failed to load quotation");
        
        // Emergency fallback
        const emergencyData = getEmergencyData(id);
        setComponentData(emergencyData);
        setMembershipType('hospital');
        setTimeout(() => setPrintReady(true), 500);
      } finally {
        setLoading(false);
      }
    };

    // Helper Functions
    function formatAddress(doctor) {
      if (!doctor) return null;
      
      // Try hospital address first
      if (doctor.hospitalAddress) {
        const a = doctor.hospitalAddress;
        const parts = [];
        if (a.address) parts.push(a.address);
        if (a.city) parts.push(a.city);
        if (a.state) parts.push(a.state);
        if (a.pinCode) parts.push(`- ${a.pinCode}`);
        return parts.join(", ");
      }
      
      // Try contact address
      if (doctor.contactDetails?.currentAddress) {
        const a = doctor.contactDetails.currentAddress;
        const parts = [];
        if (a.address) parts.push(a.address);
        if (a.city) parts.push(a.city);
        if (a.state) parts.push(a.state);
        if (a.pinCode) parts.push(`- ${a.pinCode}`);
        return parts.join(", ");
      }
      
      return null;
    }

    function formatDate(dateString) {
      if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
      
      try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      } catch {
        return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
      }
    }

    function getDefaultPricingItems(type) {
      if (type === 'individual') {
        return [
          {
            indemnity: "₹25,00,000",
            monthly: "1200",
            year_1: "10800",
            year_2: "21600",
            year_3: "32400"
          }
        ];
      } else if (type === 'combined') {
        return [
          {
            indemnity: "₹25,00,000",
            monthly: "1000",
            year_1: "10000",
            year_2: "20000",
            year_3: "30000"
          }
        ];
      } else {
        // Hospital
        return [
          {
            indemnity: "₹25,00,000",
            monthly: "1000",
            year_1: "10000",
            year_2: "20000",
            year_3: "30000"
          }
        ];
      }
    }

    function getDefaultNote(type) {
      if (type === 'individual') {
        return "Individual doctor membership covers personal practice only. Coverage does not extend to hospital staff or facilities.";
      } else if (type === 'combined') {
        return "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice.";
      } else {
        return "All prices are exclusive of taxes. Terms and conditions apply.";
      }
    }

    function getEmergencyData(quotationId) {
      return {
        doctor_name: "Dr. Professional",
        hospital_name: "Medical Center",
        address: "123 Medical Street, Mumbai, Maharashtra - 400001",
        specialization: "Multi-Speciality",
        number_of_beds: "50",
        doctor_id: "N/A",
        pricing_items: getDefaultPricingItems('hospital'),
        policy_years: [1, 2, 3],
        note: "Emergency quotation data. Please contact support.",
        payment_frequency: "yearly",
        quotation_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
        valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.'),
        quotation_number: `Q-${quotationId?.substring(0, 6) || "EMG"}`,
        trno: "",
        quotation_id: quotationId || "",
        membership_type: "HOSPITAL MEMBERSHIP"
      };
    }

    fetchAllData();
  }, [id, location.state]); // Add location.state to dependencies

  // Debug current state
  useEffect(() => {
    if (componentData) {
      console.log("🔄 QUOTATION_CONTROLLER_CURRENT_STATE:", {
        membershipType: membershipType,
        componentData_membership_type: componentData.membership_type,
        doctor_name: componentData.doctor_name,
        hospital_name: componentData.hospital_name
      });
    }
  }, [componentData, membershipType]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Quotation_${componentData?.quotation_number || 'RMS'}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      body { margin: 0; padding: 0; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  const renderQuotation = () => {
    if (!componentData) return null;

    console.log("🎯 RENDERING_QUOTATION in controller:", {
      membershipType: membershipType,
      data_membership_type: componentData.membership_type,
      doctor_name: componentData.doctor_name
    });

    // CRITICAL FIX: Use the membership_type from componentData as the single source of truth
    // This ensures that hospital_individual displays as "COMBINED HOSPITAL + INDIVIDUAL"
    let renderType = 'hospital'; // default

    if (componentData.membership_type && typeof componentData.membership_type === 'string') {
      const membershipTypeUpper = componentData.membership_type.toUpperCase();

      if (membershipTypeUpper.includes('COMBINED') ||
          membershipTypeUpper.includes('HOSPITAL + INDIVIDUAL') ||
          membershipTypeUpper.includes('HOSPITAL + DOCTOR')) {
        renderType = 'combined';
      } else if (membershipTypeUpper.includes('INDIVIDUAL') &&
                 !membershipTypeUpper.includes('HOSPITAL')) {
        renderType = 'individual';
      } else {
        renderType = 'hospital';
      }
    }

    console.log("🎯 ACTUAL_RENDER_TYPE:", renderType);

    switch (renderType) {
      case 'individual':
        return <IndividualMembershipQuotation ref={componentRef} data={componentData} />;
      case 'combined':
        return <CombinedMembershipQuotation ref={componentRef} data={componentData} />;
      case 'hospital':
      default:
        return <HospitalMembershipQuotation ref={componentRef} data={componentData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-2xl font-bold">Loading Quotation Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="no-print sticky top-0 bg-white shadow-2xl z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Quotation: {componentData?.quotation_number}</h1>
            <p className="text-lg">
              Dr. {componentData?.doctor_name} | 
              Type: <span className="text-red-600 font-bold">{componentData?.membership_type}</span>
            </p>
            <p className="text-sm text-gray-600">
              Render Type: {membershipType} | 
              Beds: {componentData?.number_of_beds}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl"
            disabled={!printReady}
          >
            {printReady ? "🖨️ Print Now" : "⏳ Loading..."}
          </button>
        </div>
      </div>

      {renderQuotation()}
    </div>
  );
};

export default QuotationController;