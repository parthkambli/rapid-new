// // CreateBulkReceipt.jsx
// import React, { useState } from "react";
// import * as XLSX from "xlsx"; // npm install xlsx

// const CreateBulkReceipt = () => {
//   const [step, setStep] = useState(1);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No file chosen");
//   const [headers, setHeaders] = useState([]);
//   const [data, setData] = useState([]);
//   const [mapping, setMapping] = useState({});

//   // Demo Data
//   const demoData = [
//     {
//       Doctor: "DR. ATUL RAVINDRA KOLAPKAR",
//       Hospital: "VITHAL CLINIC",
//       Description: "PREMIUM OF JULY 2025",
//       Amount: "₹899",
//       Date: "2025-07-17",
//     },
//     {
//       Doctor: "Dr. Nisha Rao",
//       Hospital: "City Medicco",
//       Description: "PREMIUM OF JULY 2025",
//       Amount: "₹899",
//       Date: "2025-07-17",
//     },
//     {
//       Doctor: "Dr. Amit Sharma",
//       Hospital: "Sunrise Clinic",
//       Description: "PREMIUM OF JULY 2025",
//       Amount: "₹899",
//       Date: "2025-07-17",
//     },
//   ];

//   const requiredFields = [
//     "Doctor",
//     "Hospital Address",
//     "Hospital Address",
//     "Amount (Service Charges)",
//     "Amount",
//     "Cheque/Ref Date",
//     "Cheque Date",
//   ];

//   const optionalFields = [
//     "Qualification",
//     "Specialization",
//     "Membership (e.g. Monthly by NACH)",
//     "Bank (Drawn On)",
//     "Receipt No (optional)",
//     "Ref No (optional)",
//   ];

//   // Handle File Upload
//   const handleFileUpload = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (!uploadedFile) return;

//     setFile(uploadedFile);
//     setFileName(uploadedFile.name);
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const wb = XLSX.read(bstr, { type: "binary" });
//       const wsname = wb.SheetNames[0];
//       const ws = wb.Sheets[wsname];
//       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
//       const headers = data[0];
//       const rows = data.slice(1);
//       setHeaders(headers);
//       setData(rows);
//       setStep(2);
//     };

//     reader.readAsBinaryString(uploadedFile);
//   };

//   // Load Demo Data
//   const loadDemoData = () => {
//     setFileName("NACHACHDR_9000005478_Mumbai_SucAndFail_07102025_092735276_4979 (3) (1).xlsx");
//     const demoHeaders = ["Doctor", "Hospital", "Description", "Amount", "Date"];
//     setHeaders(demoHeaders);
//     setData(demoData.map((row) => Object.values(row)));
//     setStep(2);
//   };

//   // Handle Mapping Change
//   const handleMappingChange = (excelCol, receiptField) => {
//     setMapping((prev) => ({
//       ...prev,
//       [receiptField]: excelCol,
//     }));
//   };

//   // Apply Mapping
//   const applyMapping = () => {
//     if (Object.keys(mapping).length < 5) {
//       alert("Please map all required fields!");
//       return;
//     }
//     setStep(3);
//   };

//   // Generate Receipts
//   const generateReceipts = () => {
//     alert("Receipts Generated! (In real app: PDF/Print)");
//     setStep(4);
//   };

//   return (
//     <div className="max-w-[79vw] mt-16 mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk Receipts</h2>

//       {/* Progress Steps */}
//       <div className="flex items-center mb-8 text-sm font-medium text-gray-600">
//         <div className={`flex items-center ${step >= 1 ? "text-[#398C89]" : ""}`}>
//           <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center mr-2">
//             1
//           </span>
//           Import Excel/CSV
//         </div>
//         <div className="w-16 h-px bg-gray-300 mx-2"></div>
//         <div className={`flex items-center ${step >= 2 ? "text-[#398C89]" : ""}`}>
//           <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center mr-2">
//             2
//           </span>
//           Map columns
//         </div>
//         <div className="w-16 h-px bg-gray-300 mx-2"></div>
//         <div className={`flex items-center ${step >= 3 ? "text-[#398C89]" : ""}`}>
//           <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center mr-2">
//             3
//           </span>
//           Preview
//         </div>
//         <div className="w-16 h-px bg-gray-300 mx-2"></div>
//         <div className={`flex items-center ${step >= 4 ? "text-[#398C89]" : ""}`}>
//           <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center mr-2">
//             4
//           </span>
//           Generate printable receipts (month-wise)
//         </div>
//       </div>

//       {/* Step 1: Upload */}
//       {step === 1 && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">(1) Import File</h3>
//           <p className="text-sm text-gray-600 mb-4">
//             Upload Excel/CSV <span className="text-red-500">*</span>
//           </p>
//           <div className="flex items-center space-x-3">
//             <label className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
//               Choose File
//               <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
//             </label>
//             <span className="text-sm text-gray-600">{fileName}</span>
//             <button
//               onClick={loadDemoData}
//               className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] ml-auto"
//             >
//               Load Demo Data
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mt-3">
//             Tip: CSV works instantly in this demo. For .xlsx, plug in SheetJS (code hook provided below).
//           </p>
//         </div>
//       )}

//       {/* Step 2: Map Columns */}
//       {step === 2 && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">(2) Map Columns</h3>
//           <p className="text-sm text-gray-600 mb-4">
//             We detected your file's headers. Map them to receipt fields once — they'll apply to all rows.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[...requiredFields, ...optionalFields].map((field) => (
//               <div key={field} className="flex items-center space-x-3">
//                 <span className="w-48 text-sm font-medium text-gray-700">{field}:</span>
//                 <select
//                   className="flex-1 p-2 border border-gray-300 rounded-md bg-white"
//                   onChange={(e) => handleMappingChange(e.target.value, field)}
//                   value={mapping[field] || ""}
//                 >
//                   <option value="">Select Column</option>
//                   {headers.map((h, i) => (
//                     <option key={i} value={h}>
//                       {h}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6">
//             <button
//               onClick={applyMapping}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Apply Mapping
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 3: Preview */}
//       {step === 3 && (
//         <div>
//           <h3 className="text-lg font-semibold mb-4">(3) Receipt Options</h3>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Template</label>
//               <select className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white">
//                 <option>Classic (matches your sample)</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Default Receipt Date (if empty)</label>
//               <input type="date" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Auto Receipt Prefix</label>
//               <input
//                 type="text"
//                 placeholder="REC-"
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Auto Start Number</label>
//               <input
//                 type="number"
//                 placeholder="3000"
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//               />
//             </div>
//           </div>

//           <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
//             Preview Ready: <strong>3 rows ready</strong>
//           </div>

//           <div className="overflow-x-auto border rounded-lg">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2">#</th>
//                   <th className="px-4 py-2">Doctor</th>
//                   <th className="px-4 py-2">Hospital</th>
//                   <th className="px-4 py-2">Description</th>
//                   <th className="px-4 py-2">Amount</th>
//                   <th className="px-4 py-2">Date</th>
//                   <th className="px-4 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {demoData.map((row, i) => (
//                   <tr key={i} className="border-t">
//                     <td className="px-4 py-2">{i + 1}</td>
//                     <td className="px-4 py-2">{row.Doctor}</td>
//                     <td className="px-4 py-2">{row.Hospital}</td>
//                     <td className="px-4 py-2">{row.Description}</td>
//                     <td className="px-4 py-2">{row.Amount}</td>
//                     <td className="px-4 py-2">{row.Date}</td>
//                     <td className="px-4 py-2">
//                       <button className="text-gray-600">
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6">
//             <button
//               onClick={generateReceipts}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] mr-2"
//             >
//               Build
//             </button>
//             <button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 mr-2">
//               Print / Save PDF
//             </button>
//             <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
//               Clear
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 4: Done */}
//       {step === 4 && (
//         <div className="text-center py-10">
//           <h3 className="text-xl font-bold text-green-600">Receipts Generated Successfully!</h3>
//           <p className="text-gray-600 mt-2">You can now print or download PDFs.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateBulkReceipt;















// CreateBulkReceipt.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

const CreateBulkReceipt = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const [mapping, setMapping] = useState({});

  // Required Fields for Receipt
  const receiptFields = {
    Doctor: "Customer Name",
    Hospital: "Customer Name", // fallback if no hospital
    Description: "Unique_Registration_Number",
    Amount: "Amount",
    Date: "Date",
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0];
      const rows = data.slice(1);
      setHeaders(headers);
      setRawData(rows);
      setStep(2);
    };

    reader.readAsBinaryString(uploadedFile);
  };

  // Load Demo Data (from your real Excel)
  const loadDemoData = () => {
    setFileName("NACHACHDR_900000005478_Mumbai_SuccAndFail_07102025.xlsx");
    const demoHeaders = [
      "Unique_Registration_Number",
      "Transaction ID",
      "Presentment Mode",
      "Customer Name",
      "Amount",
      "Date",
      "Status",
      "Reason Code",
      "Reason description",
    ];
    const demoRows = [
      ["RML-10830/May 2025", "702250332699", "NACH - ACH - DR", "Nilesh Namdeo Nalavade", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
      ["RML-10831/May 2025", "702250332700", "NACH - ACH - DR", "Pragati Hospital", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
      ["RML-10737/Jan 2025", "702250332647", "NACH - ACH - DR", "Shreyansh Patil", "1199", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
      ["RML-10782/March 2025", "702250332669", "NACH - ACH - DR", "Chetan Deepak Sugandhi", "1400", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
      ["RML-10769/FEB2025", "702250332663", "NACH - ACH - DR", "Sandhyarani Ashok Khot", "899", "07-10-2025 00:00:00", "Bill Payment Failed", "04", "Balance Insufficient"],
    ];
    setHeaders(demoHeaders);
    setRawData(demoRows);
    setStep(2);
  };

  // Handle Mapping
  const handleMappingChange = (receiptField, excelCol) => {
    setMapping((prev) => ({
      ...prev,
      [receiptField]: excelCol,
    }));
  };

  // Apply Mapping → Generate Preview Table
  const applyMapping = () => {
    const required = ["Doctor", "Amount", "Date"];
    const missing = required.filter((f) => !mapping[f]);
    if (missing.length > 0) {
      alert(`Please map: ${missing.join(", ")}`);
      return;
    }

    const previewData = rawData.map((row, idx) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });

      return {
        Doctor: obj[mapping.Doctor] || "",
        Hospital: obj[mapping.Hospital] || obj[mapping.Doctor] || "",
        Description: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
        Amount: `₹${obj[mapping.Amount] || ""}`,
        Date: formatDate(obj[mapping.Date] || ""),
      };
    });

    setMappedData(previewData);
    setStep(3);
  };

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk Receipts</h2>

      {/* Progress Steps */}
      <div className="flex flex-wrap items-center mb-8 text-sm font-medium text-gray-600 gap-2">
        {[
          "Import Excel/CSV",
          "Map columns",
          "Preview",
          "Generate printable receipts (month-wise)",
        ].map((label, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center ${step > i ? "text-[#398C89]" : ""}`}>
              <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="ml-1">{label}</span>
            </div>
            {i < 3 && <div className="w-12 h-px bg-gray-300"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">(1) Import File</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload Excel/CSV <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
              Choose File
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
            <button
              onClick={loadDemoData}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
            >
              Load Demo Data
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Tip: CSV works instantly. For .xlsx, SheetJS is used.
          </p>
        </div>
      )}

      {/* Step 2: Map Columns */}
      {step === 2 && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">(2) Map Columns</h3>
          <p className="text-sm text-gray-600 mb-4">
            Map Excel columns to receipt fields.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(receiptFields).map((field) => (
              <div key={field} className="flex items-center space-x-3">
                <span className="w-40 text-sm font-medium text-gray-700">
                  {field} {["Doctor", "Amount", "Date"].includes(field) && <span className="text-red-500">*</span>}:
                </span>
                <select
                  className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm"
                  value={mapping[field] || ""}
                  onChange={(e) => handleMappingChange(field, e.target.value)}
                >
                  <option value="">Select Column</option>
                  {headers.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={applyMapping}
              className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
            >
              Apply Mapping
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">(3) Preview Rows</h3>
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
            Preview Ready: <strong>{mappedData.length} rows ready</strong>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Doctor</th>
                  <th className="px-4 py-2">Hospital</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {mappedData.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">{row.Doctor}</td>
                    <td className="px-4 py-2">{row.Hospital}</td>
                    <td className="px-4 py-2 text-gray-600">{row.Description}</td>
                    <td className="px-4 py-2 font-semibold">{row.Amount}</td>
                    <td className="px-4 py-2">{row.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-2">
            <button className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]">
              Build
            </button>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Print / Save PDF
            </button>
            <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBulkReceipt;