// // src/pages/AccountStatementPage.jsx
// import React, { useState } from 'react';
// import { Calendar, CheckCircle, XCircle, Printer } from 'lucide-react';

// const bankOptions = [
//   { value: "idbi", label: "IDBI Bank" },
//   { value: "sbi", label: "SBI Bank" },
//   { value: "hdfc", label: "HDFC Bank" },
// ];

// const statementData = {
//   idbi: [
//     { date: "2025-06-10", type: "", trno: "", particulars: "Opening Balance", dr: "", cr: "", balance: "13604476.00 Dr" },
//     { date: "2025-06-12", type: "82", trno: "REC-2732", particulars: "M/S Ratna Polyclinic & Medicare Center / Payment by Cheque (Next Installment Date 09/07/2025 Rs. 15000)", dr: "15000.00", cr: "", balance: "13619476 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2795", particulars: "Dr. Sandeep Ganpati Arade & Dr. Mamta Sandeep Arade / Premium of June 2025", dr: "916.00", cr: "", balance: "13620392 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2746", particulars: "Dr. Rahim Rajekhan Jamadar / Premium of June 2025", dr: "800.00", cr: "", balance: "13621192 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2763", particulars: "Dr. Pravin V. Masurkar & Dr. Prajakta P. Masurkar / Premium of June 2025", dr: "1199.00", cr: "", balance: "13622391 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2779", particulars: "Dr. Suyog Samuel Arawattigi / Premium of June 2025", dr: "1299.00", cr: "", balance: "13623690 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2790", particulars: "Dr. Vilas N. Satpute & Dr. Sushma V. Satpute / Premium of June 2025", dr: "1499.00", cr: "", balance: "13625189 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2741", particulars: "Dr. Akshaykumar Shashikant Sohani / Premium of June 2025", dr: "1100.00", cr: "", balance: "13626289 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2758", particulars: "Dr. Sagar Shivaji Giri Gosavi / Premium of June 2025", dr: "1250.00", cr: "", balance: "13627539 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2774", particulars: "Dr. Shital Vishwajit Patil / Premium of June 2025", dr: "1199.00", cr: "", balance: "13628738 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2752", particulars: "Dr. Ravindra Bhaskar Prabhukhot / Premium of June 2025", dr: "899.00", cr: "", balance: "13629637 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2769", particulars: "Dr. Chandrakant Pandurang Utture / Premium of June 2025", dr: "899.00", cr: "", balance: "13630536 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2785", particulars: "Dr. Shubham Dattatray Khavare / Premium of June 2025", dr: "999.00", cr: "", balance: "13631535 Dr" },
//     { date: "2025-06-17", type: "82", trno: "REC-2796", particulars: "Dr. Anirudha Nirvutti Patil & Dr. Yogita Rajesh Agrawal / Premium of June 2025", dr: "999.00", cr: "", balance: "13632534 Dr" },
//   ],
//   sbi: [],
//   hdfc: [],
// };

// export default function AccountStatementPage() {
//   const [selectedBank, setSelectedBank] = useState("");
//   const [fromDate, setFromDate] = useState("10/09/2025");
//   const [toDate, setToDate] = useState("10/10/2025");
//   const [showStatement, setShowStatement] = useState(false);

//   const handleGetStatement = () => {
//     if (selectedBank) {
//       setShowStatement(true);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedBank("");
//     setShowStatement(false);
//   };

//   const currentStatement = selectedBank ? statementData[selectedBank] : [];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold text-gray-900 mb-1">Statement of Account</h1>
//       <p className="text-sm text-gray-600 mb-6">Account Statement</p>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="grid grid-cols-3 gap-6 items-end">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
//             <select
//               value={selectedBank}
//               onChange={(e) => setSelectedBank(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700"
//             >
//               <option value="">-- Select Account --</option>
//               {bankOptions.map((bank) => (
//                 <option key={bank.value} value={bank.value}>{bank.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm bg-white text-gray-700"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm bg-white text-gray-700"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={handleGetStatement}
//             disabled={!selectedBank}
//             className={`flex items-center gap-2 px-5 py-2 rounded-md text-white text-sm font-medium transition ${
//               selectedBank
//                 ? "bg-teal-600 hover:bg-teal-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <CheckCircle className="h-4 w-4" />
//             Get Statement
//           </button>
//           <button
//             onClick={handleCancel}
//             className="flex items-center gap-2 px-5 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
//           >
//             <XCircle className="h-4 w-4" />
//             Cancel
//           </button>
//           <button className="flex items-center gap-2 px-5 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700">
//             <Printer className="h-4 w-4" />
//             Print
//           </button>
//         </div>
//       </div>

//       {/* Statement Table */}
//       {showStatement && selectedBank && (
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 text-center">
//             <h2 className="text-lg font-semibold text-gray-900">Statement of Account</h2>
//             <p className="text-sm text-gray-600">
//               {bankOptions.find(b => b.value === selectedBank)?.label}<br />
//               {fromDate} To {toDate}
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-[#f5fdfd]">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">TrType</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">TRNO</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Particulars</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">DR</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">CR</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Balance</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentStatement.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700 font-mono">{row.trno}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700 max-w-md">{row.particulars}</td>
//                     <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">{row.dr}</td>
//                     <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">{row.cr}</td>
//                     <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{row.balance}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


  // src/pages/AccountStatementPage.jsx
  import React, { useState, useEffect } from 'react';
  import { Calendar, CheckCircle, XCircle, Printer } from 'lucide-react';
  import apiClient from '../../../services/apiClient';

  export default function AccountStatementPage() {
    const [selectedBank, setSelectedBank] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showStatement, setShowStatement] = useState(false);
    const [statementData, setStatementData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bankOptions, setBankOptions] = useState([]);
    const [accountTitle, setAccountTitle] = useState("");

    // Fetch bank options
    useEffect(() => {
      const fetchBanks = async () => {
        try {
          const response = await apiClient.get('/receipt-bank-details');
          if (response.data.success) {
            const banks = response.data.data.map(bank => ({
              value: bank._id,
              label: `${bank.bankName} - ${bank.accountNumber}`
            }));
            setBankOptions(banks);
          }
        } catch (err) {
          console.error('Error fetching banks:', err);
          setError('Failed to load bank accounts');
        }
      };

      fetchBanks();
    }, []);

    const parseBalance = (balanceStr) => {
      if (!balanceStr || balanceStr === '—') return { num: 0, display: '—' };

      const cleaned = balanceStr.replace(/,/g, '').trim();
      const match = cleaned.match(/^([\d.]+)\s*(Dr|Cr)?$/i);

      if (!match) {
        const fallbackNum = parseFloat(cleaned) || 0;
        return {
          num: fallbackNum,
          display: fallbackNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };
      }

      let num = parseFloat(match[1]) || 0;
      const suffix = match[2]?.toUpperCase();

      if (suffix === 'DR') {
        num = -num;
      }
      // 'Cr' → stays positive
      // no suffix → assume positive

      let display;
      if (num === 0) {
        display = '0.00';
      } else if (num < 0) {
        display = `-${Math.abs(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        display = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      return { num, display };
    };

    const handleGetStatement = async () => {
      if (!selectedBank) {
        setError('Please select a bank account');
        return;
      }
      if (!fromDate || !toDate) {
        setError('Please select both from and to dates');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get('/reports/bank-account-statement', {
          params: {
            bankId: selectedBank,
            fromDate,
            toDate
          }
        });

        if (response.data.success) {
          const data = response.data.data || [];
          setStatementData(data);
          const selected = bankOptions.find(b => b.value === selectedBank);
          setAccountTitle(selected ? selected.label : "Selected Bank Account");
          setShowStatement(true);
        } else {
          setError(response.data.message || 'Failed to fetch statement');
        }
      } catch (err) {
        console.error('Error fetching statement:', err);
        setError(err.response?.data?.message || 'Error fetching account statement');
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setSelectedBank("");
      setFromDate("");
      setToDate("");
      setShowStatement(false);
      setStatementData([]);
      setError(null);
      setAccountTitle("");
    };

    const handlePrint = () => {
      if (statementData.length === 0) return;

      let totalDr = 0;
      let totalCr = 0;
      let openingBalance = 0;
      let closingBalance = 0;

      if (statementData.length > 0) {
        const openParsed = parseBalance(statementData[0].balance);
        const closeParsed = parseBalance(statementData[statementData.length - 1].balance);
        openingBalance = openParsed.num;
        closingBalance = closeParsed.num;

        statementData.forEach(row => {
          const drVal = row.dr && row.dr !== "-" ? parseFloat(row.dr.replace(/,/g, '')) || 0 : 0;
          const crVal = row.cr && row.cr !== "-" ? parseFloat(row.cr.replace(/,/g, '')) || 0 : 0;
          totalDr += drVal;
          totalCr += crVal;
        });
      }

      const isNegative = closingBalance < 0;

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Account Statement - ${accountTitle}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 25px; font-size: 11pt; margin: 0; }
            h1 { text-align: center; margin: 0 0 8px; font-size: 18pt; }
            .subtitle { text-align: center; color: #444; margin-bottom: 20px; font-size: 13pt; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #888; padding: 8px 10px; font-size: 10.5pt; }
            th { background-color: #e0f2f1; color: #1a3c34; font-weight: bold; text-align: center; }
            .date       { width: 11%; text-align: center; }
            .trtype     { width: 8%;  text-align: center; }
            .trno       { width: 9%;  text-align: center; }
            .particulars { width: 36%; }
            .amount     { text-align: right; width: 12%; }
            .balance    { text-align: right; width: 14%; font-weight: bold; }
            .negative   { color: #c53030; }
            .total-row  { background-color: #f7fafc; font-weight: bold; }
            .summary    { margin-top: 25px; padding: 12px; background: #f9fafb; border: 1px solid #cbd5e0; border-radius: 6px; text-align: right; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Statement of Account</h1>
          <div class="subtitle">
            ${accountTitle}<br/>
            From ${fromDate} To ${toDate}
          </div>

          <table>
            <thead>
              <tr>
                <th class="date">Date</th>
                <th class="trtype">TrType</th>
                <th class="trno">TRNO</th>
                <th class="particulars">Particulars</th>
                <th class="amount">DR</th>
                <th class="amount">CR</th>
                <th class="balance">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${statementData.map(row => {
                const { display, num: bal } = parseBalance(row.balance);
                return `
                  <tr>
                    <td class="date">${row.date || '—'}</td>
                    <td class="trtype">${row.type || '—'}</td>
                    <td class="trno">${row.trno || '—'}</td>
                    <td class="particulars">${row.particulars || '—'}</td>
                    <td class="amount">${row.dr || '—'}</td>
                    <td class="amount">${row.cr || '—'}</td>
                    <td class="balance ${bal < 0 ? 'negative' : ''}">${display}</td>
                  </tr>
                `;
              }).join('')}

              <!-- Total Row -->
              <tr class="total-row">
                <td colspan="4" style="text-align:right;">TOTAL</td>
                <td class="amount">${totalDr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="amount">${totalCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="balance ${isNegative ? 'negative' : ''}">
                  ${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            Opening Balance: ₹${openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  
                |    
            Closing Balance: <span class="${isNegative ? 'negative' : ''}">
              ₹${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </body>
        </html>
      `;

      // ─── Hidden iframe method ────────────────────────────────────────────────
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.left = '-9999px';
      printFrame.style.top = '-9999px';
      document.body.appendChild(printFrame);

      const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(printContent);
        doc.close();

        setTimeout(() => {
          const win = printFrame.contentWindow;
          if (win) {
            win.focus();
            win.print();

            // Clean up after a delay (most browsers finish printing)
            setTimeout(() => {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
            }, 1500);
          }
        }, 800); // increased slightly to ensure content is rendered
      }
    };

    // Calculate totals for UI display
    const calculateTotals = () => {
      if (statementData.length === 0) return { totalDr: 0, totalCr: 0, closingBalance: 0 };

      let totalDr = 0;
      let totalCr = 0;

      statementData.forEach(row => {
        const drVal = row.dr && row.dr !== "-" ? parseFloat(row.dr.replace(/,/g, '')) || 0 : 0;
        const crVal = row.cr && row.cr !== "-" ? parseFloat(row.cr.replace(/,/g, '')) || 0 : 0;
        totalDr += drVal;
        totalCr += crVal;
      });

      const closingParsed = parseBalance(statementData[statementData.length - 1]?.balance || '0');
      const closingBalance = closingParsed.num;

      return { totalDr, totalCr, closingBalance };
    };

    const { totalDr, totalCr, closingBalance } = calculateTotals();
    const isNegativeClosing = closingBalance < 0;

    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Statement of Account</h1>
        <p className="text-sm text-gray-600 mb-6">Account Statement</p>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">-- Select Account --</option>
                {bankOptions.map(bank => (
                  <option key={bank.value} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <XCircle size={18} />
              Cancel
            </button>

            <button
              onClick={handleGetStatement}
              disabled={!selectedBank || !fromDate || !toDate || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition ${
                selectedBank && fromDate && toDate && !loading
                  ? "bg-teal-600 hover:bg-teal-700 shadow-sm"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Get Statement
                </>
              )}
            </button>

            {showStatement && statementData.length > 0 && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <Printer size={18} />
                Print
              </button>
            )}
          </div>
        </div>

        {showStatement && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b text-center bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Statement of Account</h2>
              <p className="text-sm text-gray-600 mt-1.5">
                {accountTitle} • {fromDate} to {toDate}
              </p>
            </div>

            {statementData.length === 0 ? (
              <div className="p-12 text-center text-gray-500 italic">
                No transactions found in the selected period.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">Date</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-20">TrType</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-24">TRNO</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Particulars</th>
                        <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">DR</th>
                        <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">CR</th>
                        <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {statementData.map((row, idx) => {
                        const { display, num: balanceNum } = parseBalance(row.balance);
                        return (
                          <tr 
                            key={idx}
                            className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fdfd]'} hover:bg-gray-50 transition-colors`}
                          >
                            <td className="px-5 py-3.5 text-sm text-gray-900 border-r">{row.date || '—'}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-700 border-r">{row.type || '—'}</td>
                            <td className="px-5 py-3.5 text-sm font-mono text-gray-700 border-r">{row.trno || '—'}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-700 border-r">{row.particulars || '—'}</td>
                            <td className="px-5 py-3.5 text-sm text-red-600 text-right font-medium border-r">{row.dr || '—'}</td>
                            <td className="px-5 py-3.5 text-sm text-green-600 text-right font-medium border-r">{row.cr || '—'}</td>
                            <td className={`px-5 py-3.5 text-sm text-right font-medium border-r ${balanceNum < 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                              {display}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Total Row - visible in UI */}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={4} className="px-5 py-4 text-right text-gray-800">
                          TOTAL
                        </td>
                        <td className="px-5 py-4 text-right text-red-600">
                          {totalDr.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-4 text-right text-green-600">
                          {totalCr.toLocaleString('en-IN')}
                        </td>
                        <td className={`px-5 py-4 text-right ${isNegativeClosing ? 'text-red-600' : 'text-gray-900'}`}>
                          {closingBalance.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Optional summary row below table */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between text-sm font-medium text-gray-700">
                  <div>
                    Opening Balance:{' '}
                    <span className="font-semibold text-gray-900">
                      ₹{(statementData[0]?.balance?.replace(/,/g, '') || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className={isNegativeClosing ? 'text-red-600' : ''}>
                    Closing Balance:{' '}
                    <span className="font-semibold">
                      ₹{closingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }


// // src/pages/AccountStatementPage.jsx
// import React, { useState, useEffect } from 'react';
// import { Calendar, CheckCircle, XCircle, Printer } from 'lucide-react';
// import apiClient from '../../../services/apiClient';

// export default function AccountStatementPage() {
//   const [selectedBank, setSelectedBank] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [showStatement, setShowStatement] = useState(false);
//   const [statementData, setStatementData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bankOptions, setBankOptions] = useState([]);
//   const [accountTitle, setAccountTitle] = useState("");

//   // Fetch bank options
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await apiClient.get('/receipt-bank-details');
//         if (response.data.success) {
//           const banks = response.data.data.map(bank => ({
//             value: bank._id,
//             label: `${bank.bankName} - ${bank.accountNumber}`
//           }));
//           setBankOptions(banks);
//         }
//       } catch (err) {
//         console.error('Error fetching banks:', err);
//         setError('Failed to load bank accounts');
//       }
//     };

//     fetchBanks();
//   }, []);

//   const parseBalance = (balanceStr) => {
//     if (!balanceStr || balanceStr === '—') return { num: 0, display: '—' };

//     const cleaned = balanceStr.replace(/,/g, '').trim();
//     const match = cleaned.match(/^([\d.]+)\s*(Dr|Cr)?$/i);

//     if (!match) {
//       const fallbackNum = parseFloat(cleaned) || 0;
//       return {
//         num: fallbackNum,
//         display: fallbackNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//       };
//     }

//     let num = parseFloat(match[1]) || 0;
//     const suffix = match[2]?.toUpperCase();

//     if (suffix === 'DR') {
//       num = -num;
//     }
//     // 'Cr' → stays positive
//     // no suffix → assume positive

//     let display;
//     if (num === 0) {
//       display = '0.00';
//     } else if (num < 0) {
//       display = `-${Math.abs(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     } else {
//       display = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     }

//     return { num, display };
//   };

//   const handleGetStatement = async () => {
//     if (!selectedBank) {
//       setError('Please select a bank account');
//       return;
//     }
//     if (!fromDate || !toDate) {
//       setError('Please select both from and to dates');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await apiClient.get('/reports/bank-account-statement', {
//         params: {
//           bankId: selectedBank,
//           fromDate,
//           toDate
//         }
//       });

//       if (response.data.success) {
//         const data = response.data.data || [];
//         setStatementData(data);
//         const selected = bankOptions.find(b => b.value === selectedBank);
//         setAccountTitle(selected ? selected.label : "Selected Bank Account");
//         setShowStatement(true);
//       } else {
//         setError(response.data.message || 'Failed to fetch statement');
//       }
//     } catch (err) {
//       console.error('Error fetching statement:', err);
//       setError(err.response?.data?.message || 'Error fetching account statement');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedBank("");
//     setFromDate("");
//     setToDate("");
//     setShowStatement(false);
//     setStatementData([]);
//     setError(null);
//     setAccountTitle("");
//   };

//   const handlePrint = () => {
//     if (statementData.length === 0) return;

//     const printWindow = window.open("", "", "width=1100,height=800");

//     let totalDr = 0;
//     let totalCr = 0;
//     let openingBalance = 0;
//     let closingBalance = 0;

//     if (statementData.length > 0) {
//       const openParsed = parseBalance(statementData[0].balance);
//       const closeParsed = parseBalance(statementData[statementData.length - 1].balance);
//       openingBalance = openParsed.num;
//       closingBalance = closeParsed.num;

//       statementData.forEach(row => {
//         const drVal = row.dr && row.dr !== "-" ? parseFloat(row.dr.replace(/,/g, '')) || 0 : 0;
//         const crVal = row.cr && row.cr !== "-" ? parseFloat(row.cr.replace(/,/g, '')) || 0 : 0;
//         totalDr += drVal;
//         totalCr += crVal;
//       });
//     }

//     const isNegative = closingBalance < 0;

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Account Statement - ${accountTitle}</title>
//         <style>
//           body { font-family: Arial, Helvetica, sans-serif; padding: 25px; font-size: 11pt; margin: 0; }
//           h1 { text-align: center; margin: 0 0 8px; font-size: 18pt; }
//           .subtitle { text-align: center; color: #444; margin-bottom: 20px; font-size: 13pt; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { border: 1px solid #888; padding: 8px 10px; font-size: 10.5pt; }
//           th { background-color: #e0f2f1; color: #1a3c34; font-weight: bold; text-align: center; }
//           .date       { width: 11%; text-align: center; }
//           .trtype     { width: 8%;  text-align: center; }
//           .trno       { width: 9%;  text-align: center; }
//           .particulars { width: 36%; }
//           .amount     { text-align: right; width: 12%; }
//           .balance    { text-align: right; width: 14%; font-weight: bold; }
//           .negative   { color: #c53030; }
//           .total-row  { background-color: #f7fafc; font-weight: bold; }
//           .summary    { margin-top: 25px; padding: 12px; background: #f9fafb; border: 1px solid #cbd5e0; border-radius: 6px; text-align: right; }
//         </style>
//       </head>
//       <body>
//         <h1>Statement of Account</h1>
//         <div class="subtitle">
//           ${accountTitle}<br/>
//           From ${fromDate} To ${toDate}
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th class="date">Date</th>
//               <th class="trtype">TrType</th>
//               <th class="trno">TRNO</th>
//               <th class="particulars">Particulars</th>
//               <th class="amount">DR</th>
//               <th class="amount">CR</th>
//               <th class="balance">Balance</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${statementData.map(row => {
//               const { display, num: bal } = parseBalance(row.balance);
//               return `
//                 <tr>
//                   <td class="date">${row.date || '—'}</td>
//                   <td class="trtype">${row.type || '—'}</td>
//                   <td class="trno">${row.trno || '—'}</td>
//                   <td class="particulars">${row.particulars || '—'}</td>
//                   <td class="amount">${row.dr || '—'}</td>
//                   <td class="amount">${row.cr || '—'}</td>
//                   <td class="balance ${bal < 0 ? 'negative' : ''}">${display}</td>
//                 </tr>
//               `;
//             }).join('')}

//             <!-- Total Row -->
//             <tr class="total-row">
//               <td colspan="4" style="text-align:right;">TOTAL</td>
//               <td class="amount">${totalDr.toLocaleString('en-IN')}</td>
//               <td class="amount">${totalCr.toLocaleString('en-IN')}</td>
//               <td class="balance ${isNegative ? 'negative' : ''}">
//                 ${closingBalance.toLocaleString('en-IN')}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div class="summary">
//           Opening Balance: ₹${openingBalance.toLocaleString('en-IN')}  
//               |    
//           Closing Balance: <span class="${isNegative ? 'negative' : ''}">
//             ₹${closingBalance.toLocaleString('en-IN')}
//           </span>
//         </div>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();
//     // Give it a moment to render
//     setTimeout(() => printWindow.print(), 600);
//   };

//   // Calculate totals for UI display
//   const calculateTotals = () => {
//     if (statementData.length === 0) return { totalDr: 0, totalCr: 0, closingBalance: 0 };

//     let totalDr = 0;
//     let totalCr = 0;

//     statementData.forEach(row => {
//       const drVal = row.dr && row.dr !== "-" ? parseFloat(row.dr.replace(/,/g, '')) || 0 : 0;
//       const crVal = row.cr && row.cr !== "-" ? parseFloat(row.cr.replace(/,/g, '')) || 0 : 0;
//       totalDr += drVal;
//       totalCr += crVal;
//     });

//     const closingParsed = parseBalance(statementData[statementData.length - 1]?.balance || '0');
//     const closingBalance = closingParsed.num;

//     return { totalDr, totalCr, closingBalance };
//   };

//   const { totalDr, totalCr, closingBalance } = calculateTotals();
//   const isNegativeClosing = closingBalance < 0;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold text-gray-900 mb-1">Statement of Account</h1>
//       <p className="text-sm text-gray-600 mb-6">Account Statement</p>

//       {error && (
//         <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
//             <select
//               value={selectedBank}
//               onChange={(e) => setSelectedBank(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//             >
//               <option value="">-- Select Account --</option>
//               {bankOptions.map(bank => (
//                 <option key={bank.value} value={bank.value}>
//                   {bank.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={e => setFromDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={e => setToDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-end gap-4 mt-8">
//           <button
//             onClick={handleCancel}
//             className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             <XCircle size={18} />
//             Cancel
//           </button>

//           <button
//             onClick={handleGetStatement}
//             disabled={!selectedBank || !fromDate || !toDate || loading}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition ${
//               selectedBank && fromDate && toDate && !loading
//                 ? "bg-teal-600 hover:bg-teal-700 shadow-sm"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <>Loading...</>
//             ) : (
//               <>
//                 <CheckCircle size={18} />
//                 Get Statement
//               </>
//             )}
//           </button>

//           {showStatement && statementData.length > 0 && (
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
//             >
//               <Printer size={18} />
//               Print
//             </button>
//           )}
//         </div>
//       </div>

//       {showStatement && (
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="px-6 py-5 border-b text-center bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-900">Statement of Account</h2>
//             <p className="text-sm text-gray-600 mt-1.5">
//               {accountTitle} • {fromDate} to {toDate}
//             </p>
//           </div>

//           {statementData.length === 0 ? (
//             <div className="p-12 text-center text-gray-500 italic">
//               No transactions found in the selected period.
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50 sticky top-0 z-10">
//                     <tr>
//                       <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">Date</th>
//                       <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-20">TrType</th>
//                       <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-24">TRNO</th>
//                       <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Particulars</th>
//                       <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">DR</th>
//                       <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-r w-28">CR</th>
//                       <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Balance</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {statementData.map((row, idx) => {
//                       const { display, num: balanceNum } = parseBalance(row.balance);
//                       return (
//                         <tr 
//                           key={idx}
//                           className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fdfd]'} hover:bg-gray-50 transition-colors`}
//                         >
//                           <td className="px-5 py-3.5 text-sm text-gray-900 border-r">{row.date || '—'}</td>
//                           <td className="px-5 py-3.5 text-sm text-gray-700 border-r">{row.type || '—'}</td>
//                           <td className="px-5 py-3.5 text-sm font-mono text-gray-700 border-r">{row.trno || '—'}</td>
//                           <td className="px-5 py-3.5 text-sm text-gray-700 border-r">{row.particulars || '—'}</td>
//                           <td className="px-5 py-3.5 text-sm text-red-600 text-right font-medium border-r">{row.dr || '—'}</td>
//                           <td className="px-5 py-3.5 text-sm text-green-600 text-right font-medium border-r">{row.cr || '—'}</td>
//                           <td className={`px-5 py-3.5 text-sm text-right font-medium border-r ${balanceNum < 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
//                             {display}
//                           </td>
//                         </tr>
//                       );
//                     })}

//                     {/* Total Row - visible in UI */}
//                     <tr className="bg-gray-100 font-bold">
//                       <td colSpan={4} className="px-5 py-4 text-right text-gray-800">
//                         TOTAL
//                       </td>
//                       <td className="px-5 py-4 text-right text-red-600">
//                         {totalDr.toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-5 py-4 text-right text-green-600">
//                         {totalCr.toLocaleString('en-IN')}
//                       </td>
//                       <td className={`px-5 py-4 text-right ${isNegativeClosing ? 'text-red-600' : 'text-gray-900'}`}>
//                         {closingBalance.toLocaleString('en-IN')}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Optional summary row below table */}
//               <div className="px-6 py-4 bg-gray-50 border-t flex justify-between text-sm font-medium text-gray-700">
//                 <div>
//                   Opening Balance:{' '}
//                   <span className="font-semibold text-gray-900">
//                     ₹{(statementData[0]?.balance?.replace(/,/g, '') || 0).toLocaleString('en-IN')}
//                   </span>
//                 </div>
//                 <div className={isNegativeClosing ? 'text-red-600' : ''}>
//                   Closing Balance:{' '}
//                   <span className="font-semibold">
//                     ₹{closingBalance.toLocaleString('en-IN')}
//                   </span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

