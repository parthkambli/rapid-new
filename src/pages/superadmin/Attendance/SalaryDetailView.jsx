
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import Table from "../../../components/mainComponents/Table";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import headerImage from "../../../assets/quotation/Header.png";

const loadImageAsBase64 = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageSrc;
  });
};

const SalaryDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [imgData, setImgData] = useState(null);

  useEffect(() => {
    fetchSalaryDetail();
    loadImageAsBase64(headerImage).then(setImgData);
  }, [id]);

  const fetchSalaryDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiEndpoints.salaries.list}/${id}`);

      if (response.data.success) {
        const salaryData = response.data.data;

        // ================= IMPORTANT FIX =================
        // Get totalSalary from employee.salaryDetails.totalSalary
        const totalSalary = salaryData.employee?.salaryDetails?.totalSalary || 0;
        
        // Gross Salary = Total Salary (incentive separate)
        const grossSalary = totalSalary; // Gross salary mein incentive nahi include

        const employee = {
          _id: salaryData._id,
          srNo: 1,
          name: salaryData.employee?.fullName || "N/A",
          employeeId: salaryData.employee?.employeeId || "N/A",
          presentDays: salaryData.attendanceData?.presentDays || 0,
          absentDays: salaryData.attendanceData?.absentDays || 0,
          totalDays: salaryData.attendanceData?.totalDays || 0,
          perDaySalary: (salaryData.attendanceData?.monthDays && salaryData.attendanceData?.monthDays > 0)
            ? (grossSalary / salaryData.attendanceData.monthDays).toFixed(2)
            : (grossSalary / 30).toFixed(2),
          totalSalary: grossSalary, // ← Yeh Gross Salary hai, employee ka total salary
          incentive: salaryData.incentives || 0,
          pf: salaryData.providentFund || 0,
          advanceSalaryData: salaryData.advanceSalary || [],
          lossOfPay: salaryData.lossOfPay || 0,
          deductions: (salaryData.otherDeductions || 0) + (salaryData.incomeTax || 0),
          balanceOnAdvance: salaryData.balance || 0,
          totalPay: grossSalary, // ← Total Pay bhi Gross Salary (incentive ke bina)
          paymentDate: salaryData.paymentDate ? new Date(salaryData.paymentDate).toISOString().split('T')[0] : "",
          netPayment: salaryData.netSalary || 0,
          withdrawFrom: salaryData.withdrawFrom || "",
          debitTo: salaryData.debitTo || "",
          finalPay: salaryData.netSalary || 0,
          balance: salaryData.balance || 0,
          rawData: salaryData
        };

        setSalary(employee);
        setEditData(employee);
      }
    } catch (error) {
      console.error("Error fetching salary detail:", error);
      toast.error("Failed to fetch salary details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditData({ ...salary });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...salary });
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdvanceChange = (index, field, value) => {
    const updatedAdvance = [...editData.advanceSalaryData];
    updatedAdvance[index] = { ...updatedAdvance[index], [field]: value };
    setEditData(prev => ({ ...prev, advanceSalaryData: updatedAdvance }));
  };

  const addAdvanceRow = () => {
    setEditData(prev => ({
      ...prev,
      advanceSalaryData: [...(prev.advanceSalaryData || []), { date: new Date().toISOString(), amount: 0 }]
    }));
  };

  const removeAdvanceRow = (index) => {
    const updatedAdvance = editData.advanceSalaryData.filter((_, i) => i !== index);
    setEditData(prev => ({ ...prev, advanceSalaryData: updatedAdvance }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatePayload = {
        incentives: parseFloat(editData.incentive) || 0,
        providentFund: parseFloat(editData.pf) || 0,
        otherDeductions: parseFloat(editData.deductions) || 0,
        paymentDate: editData.paymentDate,
        withdrawFrom: editData.withdrawFrom,
        debitTo: editData.debitTo,
        paymentStatus: editData.paymentDate ? 'paid' : 'pending',
        advanceSalary: editData.advanceSalaryData
      };

      const response = await apiClient.put(`${apiEndpoints.salaries.list}/${id}`, updatePayload);

      if (response.data.success) {
        toast.success("Salary updated successfully");
        setIsEditing(false);
        fetchSalaryDetail();
      } else {
        toast.error(response.data.message || "Failed to update salary");
      }
    } catch (error) {
      console.error("Error updating salary:", error);
      toast.error("Failed to update salary");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!id) {
      toast.error("Salary ID not found");
      return;
    }

    try {
      const response = await apiClient.get(`${apiEndpoints.salaries.list}/${id}`);

      if (!response.data.success) {
        toast.error("Failed to fetch latest salary data for printing");
        return;
      }

      const latestSalary = response.data.data;

      // ================= IMPORTANT: Use employee.salaryDetails.totalSalary =================
      const totalSalary = latestSalary.employee?.salaryDetails?.totalSalary || 0;
      const grossSalary = totalSalary; // Gross Salary = Total Salary (incentive separate)

      const transformedSalary = {
        _id: latestSalary._id,
        srNo: 1,
        name: latestSalary.employee?.fullName || "N/A",
        employeeId: latestSalary.employee?.employeeId || "N/A",
        presentDays: latestSalary.attendanceData?.presentDays || 0,
        absentDays: latestSalary.attendanceData?.absentDays || 0,
        totalDays: latestSalary.attendanceData?.totalDays || 0,
        perDaySalary: (latestSalary.attendanceData?.monthDays && latestSalary.attendanceData?.monthDays > 0)
          ? (grossSalary / latestSalary.attendanceData.monthDays).toFixed(2)
          : (grossSalary / 30).toFixed(2),
        totalSalary: grossSalary, // Gross Salary
        incentive: latestSalary.incentives || 0,
        pf: latestSalary.providentFund || 0,
        advanceSalaryData: latestSalary.advanceSalary || [],
        lossOfPay: latestSalary.lossOfPay || 0,
        deductions: (latestSalary.otherDeductions || 0) + (latestSalary.incomeTax || 0),
        balanceOnAdvance: latestSalary.balance || 0,
        totalPay: grossSalary, // Total Pay = Gross Salary (incentive separate)
        paymentDate: latestSalary.paymentDate ? new Date(latestSalary.paymentDate).toISOString().split('T')[0] : "",
        netPayment: latestSalary.netSalary || 0,
        withdrawFrom: latestSalary.withdrawFrom || "",
        debitTo: latestSalary.debitTo || "",
        finalPay: latestSalary.netSalary || 0,
        balance: latestSalary.balance || 0,
        rawData: latestSalary
      };

      if (!imgData) {
        const loadedImgData = await loadImageAsBase64(headerImage);
        setImgData(loadedImgData);
      }

      const printWindow = window.open('', '_blank');

      const totalAdvance = transformedSalary.advanceSalaryData?.reduce((sum, adv) => sum + Number(adv.amount || 0), 0) || 0;
      const calculatedBalance = Math.max(0, totalAdvance - (transformedSalary.deductions || 0));

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Salary Slip - ${transformedSalary.name}</title>
          <style>
            @page {
              margin: 10mm;
              size: landscape;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            
    body {
      font-family: Arial, sans-serif;
      margin: 0 !important;
      padding: 0 !important;
      width: 100vw;
      background: white;
    }

    .container {
      width: 100vw;
      max-width: 100vw;
      margin: 0;
      padding: 0 10px;
      overflow: hidden;
    }

    .header-section {
      width: 100%;
      margin: 0 0 25px 0;
      text-align: center;
      padding: 0;
    }

    .header-img {
      width: 100% !important;
      max-width: 100% !important;
      height: auto;
      display: block;
      margin: 0;
      padding: 0;
    }

            .title {
              color: #1B504E;
              font-size: 20px;
              font-weight: bold;
              margin: 10px 0 5px;
            }

            .subtitle {
              color: #333;
              font-size: 12px;
              margin-bottom: 5px;
            }

            .divider {
              border-top: 1.5px solid #1B504E;
              margin: 15px 0 20px;
            }

            .salary-table {
              width: 100%;
              border-collapse: collapse;
              margin: 0 auto 20px;
              font-size: 10px;
            }

            .salary-table th {
              background-color: #1B504E !important;
              color: white !important;
              font-weight: bold;
              padding: 8px 4px;
              border: 1px solid #1B504E;
              text-align: center;
            }

            .salary-table td {
              padding: 6px 4px;
              border: 1px solid #e0e0e0;
              text-align: center;
              color: #333;
            }

            .salary-table tbody tr:nth-child(even) {
              background-color: #f8f9fa !important;
            }

            .salary-table tbody tr:nth-child(odd) {
              background-color: white !important;
            }

            .advance-section {
              margin-top: 25px;
            }

            .advance-table {
              width: 50%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 10px;
            }

            .advance-table th {
              background-color: #f0f5f8 !important;
              color: #333 !important;
              font-weight: bold;
              padding: 6px 4px;
              border: 1px solid #ddd;
              text-align: center;
            }

            .advance-table td {
              padding: 5px 4px;
              border: 1px solid #ddd;
              text-align: center;
            }

            .signature-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ccc;
            }

            .signature-row {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
            }

            .signature-box {
              width: 45%;
            }

            .signature-line {
              border-top: 1px solid #333;
              width: 100%;
              margin-top: 60px;
            }

            .footer {
              text-align: center;
              font-size: 9px;
              color: #666;
              margin-top: 20px;
            }

            @media print {
              body {
                width: 100%;
                margin: 0;
                padding: 0;
              }

              .container {
                padding: 0;
              }

              .salary-table {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header-section">
              <img src="${imgData || headerImage}" alt="Company Header" class="header-img">
              <div class="title">Salary Slip - ${transformedSalary.name}</div>
              <div class="subtitle">Employee ID: ${transformedSalary.employeeId} • ${new Date().toLocaleDateString('en-IN')}</div>
              <div class="divider"></div>
            </div>

            <table class="salary-table">
              <thead>
                <tr>
                  <th>Present<br>Days</th>
                  <th>Gross<br>Salary</th>
                  <th>Incentive</th>
                  <th>PF</th>
                  <th>Advance</th>
                  <th>Deductions</th>
                  <th>Total<br>Pay</th>
                  <th>Net Pay</th>
                  <th>Pay Date</th>
                  <th>Final<br>Pay</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${transformedSalary.presentDays}</td>
                  <td>Rs. ${Number(transformedSalary.totalSalary).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(transformedSalary.incentive).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(transformedSalary.pf).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(totalAdvance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(transformedSalary.deductions).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(transformedSalary.totalPay).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(transformedSalary.netPayment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${transformedSalary.paymentDate ? new Date(transformedSalary.paymentDate).toLocaleDateString('en-IN') : "—"}</td>
                  <td>Rs. ${Number(transformedSalary.finalPay).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>Rs. ${Number(calculatedBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>

            ${transformedSalary.advanceSalaryData?.length > 0 ? `
              <div class="advance-section">
                <div style="color: #1B504E; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
                  Advance Details
                </div>
                <table class="advance-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${transformedSalary.advanceSalaryData.map((adv, i) => `
                      <tr>
                        <td>${i + 1}</td>
                        <td>${new Date(adv.date).toLocaleDateString('en-IN')}</td>
                        <td>Rs. ${Number(adv.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <div class="signature-section">
              <div class="signature-row">
                <div class="signature-box">
                  <div style="font-size: 11px; color: #333; margin-bottom: 5px;">
                    <strong>Employee Signature</strong>
                  </div>
                  <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                  <div style="font-size: 11px; color: #333; margin-bottom: 5px;">
                    <strong>Authorized Signature</strong>
                  </div>
                  <div class="signature-line"></div>
                </div>
              </div>
            </div>

            <div class="footer">
              Computer Generated Document • Printed on: ${new Date().toLocaleString('en-IN')}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error("Error in handlePrint:", error);
      toast.error("Failed to print salary slip");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!imgData) {
        const loadedImgData = await loadImageAsBase64(headerImage);
        setImgData(loadedImgData);
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

       const pageWidth = doc.internal.pageSize.width; // Approximately 297mm for A4 landscape
    const pageHeight = doc.internal.pageSize.height;
    
    // Image dimensions set karein - full page width ke according
    const imgWidth = pageWidth - 20; // 10mm margin on each side = 277mm
    const imgHeight = (imgWidth * 30) / 180; // Maintain aspect ratio
    
    // Center position calculation
    const xPosition = 10; // 10mm left margin
    const yPosition = 10; // 10mm top margin

    // Header image add karein - full width
    doc.addImage(imgData || headerImage, 'PNG', xPosition, yPosition, imgWidth, imgHeight);

    // Baaki ka code same rahega...
    doc.setFont("helvetica", "normal");

    const headerYPosition = yPosition + imgHeight + 8;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(27, 80, 78);
      doc.text(`Salary Slip - ${salary.name}`, 148.5, headerYPosition, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      doc.text(
        `Employee ID: ${salary.employeeId}  •  ${new Date().toLocaleDateString('en-IN')}`,
        148.5, headerYPosition + 7, { align: "center" }
      );

      doc.setDrawColor(27, 80, 78);
      doc.setLineWidth(0.4);
      doc.line(12, headerYPosition + 12, 283, headerYPosition + 12);

      // ================= ORIGINAL TABLE COLUMNS (NO EXTRA COLUMNS) =================
      const tableColumn = [
        "Present\nDays", "Gross\nSalary", "Incentive", "PF", "Advance Given",
        "Deductions", "Total\nPay", "Net Pay", "Pay Date", "Final\nPay", "Balance on Advance"
      ];

      const totalAdvance = salary.advanceSalaryData?.reduce((sum, adv) => sum + Number(adv.amount || 0), 0) || 0;
      const calculatedBalance = Math.max(0, totalAdvance - (salary.deductions || 0));

      const tableRows = [[
        salary.presentDays,
        "Rs. " + Number(salary.totalSalary).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Gross Salary = Employee's Total Salary
        "Rs. " + Number(salary.incentive).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Rs. " + Number(salary.pf).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Rs. " + Number(totalAdvance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Rs. " + Number(salary.deductions).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Rs. " + Number(salary.totalPay).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Total Pay = Gross Salary
        "Rs. " + Number(salary.netPayment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        salary.paymentDate ? (() => {
          const dateStr = salary.paymentDate.split('T')[0];
          const [year, month, day] = dateStr.split('-');
          return `${day}/${month}/${year}`;
        })() : "—",
        "Rs. " + Number(salary.finalPay).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Rs. " + Number(calculatedBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      ]];

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: headerYPosition + 18,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          font: "helvetica",
          cellWidth: 'wrap',
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
          cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }
        },
        headStyles: {
          fillColor: [27, 80, 78],
          textColor: 255,
          fontSize: 8,
          fontStyle: 'bold',
          cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }
        },
        bodyStyles: {
          textColor: 30,
          fontStyle: 'normal',
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 25 },
          9: { cellWidth: 25 },
          10: { cellWidth: 25 }
        },
        margin: {
          top: headerYPosition + 18,
          left: 14,
          right: 14
        },
        rowPageBreak: 'avoid',
        horizontalPageBreak: false
      });

      if (salary.advanceSalaryData?.length > 0) {
        const startY = doc.lastAutoTable.finalY + 16;

        doc.setFontSize(11);
        doc.setTextColor(27, 80, 78);
        doc.text("Advance Details", 14, startY - 4);

        const advColumns = ["#", "Date", "Amount"];
        const advRows = salary.advanceSalaryData.map((adv, i) => [
          i + 1,
          new Date(adv.date).toLocaleDateString('en-IN'),
          "Rs. " + Number(adv.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })
        ]);

        autoTable(doc, {
          startY: startY,
          head: [advColumns],
          body: advRows,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 3,
            halign: 'center',
            cellWidth: 'wrap',
            lineWidth: 0.1,
            lineColor: [200, 200, 200],
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }
          },
          headStyles: {
            fillColor: [240, 245, 248],
            textColor: 40,
            fontStyle: 'bold',
            fontSize: 8
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 35 },
            2: { cellWidth: 35 }
          },
          margin: { left: 14, right: 14 }
        });
      }








      

      // const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8.5);
      doc.setTextColor(140);
      doc.text("Computer Generated Document", 148.5, pageHeight - 10, { align: "center" });

      doc.save(`Salary_${salary.employeeId}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF downloaded successfully!");

    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF");
    }
  };

  // ================= ORIGINAL COLUMNS FOR TABLE (NO EXTRA COLUMNS) =================
  const columns = [
    { header: "SR No", render: (row) => row.srNo },
    { header: "Name", render: (row) => row.name },
    { header: "Employee ID", render: (row) => row.employeeId },
    { header: "Present Days", render: (row) => row.presentDays },
    { header: "Absent Days", render: (row) => row.absentDays },
    { header: "Total Days", render: (row) => row.totalDays },
    { header: "Per Day Salary", render: (row) => `₹${row.perDaySalary?.toLocaleString() || 0}` },
    { 
      header: "Total Salary", 
      render: (row) => `₹${Number(row.totalSalary).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}` 
    },
    { header: "Loss of Pay", render: (row) => `₹${(row.lossOfPay || 0).toLocaleString()}` },
    {
      header: "Incentive",
      render: (row) => isEditing ? (
        <input
          type="number"
          value={editData.incentive}
          onChange={(e) => handleInputChange('incentive', e.target.value)}
          className="w-20 px-1 py-1 border rounded text-xs"
        />
      ) : `₹${row.incentive.toLocaleString()}`
    },
    {
      header: "PF",
      render: (row) => isEditing ? (
        <input
          type="number"
          value={editData.pf}
          onChange={(e) => handleInputChange('pf', e.target.value)}
          className="w-20 px-1 py-1 border rounded text-xs"
        />
      ) : `₹${row.pf.toLocaleString()}`
    },
    {
      header: "Advance Salary (Date & Amount)",
      render: (row) => (
        <div className="w-full">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-1">Date</th>
                    <th className="border p-1">Amount</th>
                    <th className="border p-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editData.advanceSalaryData && editData.advanceSalaryData.length > 0 ? (
                    editData.advanceSalaryData.map((adv, i) => (
                      <tr key={i}>
                        <td className="border p-1">
                          <input
                            type="date"
                            value={adv.date ? new Date(adv.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleAdvanceChange(i, 'date', e.target.value)}
                            className="w-full px-1 py-0.5 border rounded"
                          />
                        </td>
                        <td className="border p-1">
                          <input
                            type="number"
                            value={adv.amount}
                            onChange={(e) => handleAdvanceChange(i, 'amount', e.target.value)}
                            className="w-20 px-1 py-0.5 border rounded"
                          />
                        </td>
                        <td className="border p-1 text-center">
                          <button
                            onClick={() => removeAdvanceRow(i)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="border p-1 text-center text-gray-500">No entries</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                onClick={addAdvanceRow}
                className="self-start px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
              >
                + Add Entry
              </button>
            </div>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-1 font-medium text-gray-600">Date</th>
                  <th className="border p-1 font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {row.advanceSalaryData && row.advanceSalaryData.length > 0 ? (
                  row.advanceSalaryData.map((adv, i) => (
                    <tr key={i}>
                      <td className="border p-1 text-center">{new Date(adv.date).toLocaleDateString()}</td>
                      <td className="border p-1 text-center">₹ {Number(adv.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="border p-1 text-center text-gray-400">-</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      ),
    },
    {
      header: "Deductions",
      render: (row) => isEditing ? (
        <input
          type="number"
          value={editData.deductions}
          onChange={(e) => handleInputChange('deductions', e.target.value)}
          className="w-20 px-1 py-1 border rounded text-xs"
        />
      ) : `₹${row.deductions.toLocaleString()}`
    },
    {
      header: "Balance on Advance",
      render: (row) => {
        const totalAdvance = row.advanceSalaryData?.reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0) || 0;
        const balanceOnAdvance = totalAdvance - (row.deductions || 0);
        return `₹${Math.max(0, balanceOnAdvance).toLocaleString()}`;
      }
    },
    { 
      header: "Total Pay", 
      render: (row) => `₹${Number(row.totalPay).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}` 
    },
    {
      header: "Payment Date",
      render: (row) => isEditing ? (
        <input
          type="date"
          value={editData.paymentDate}
          onChange={(e) => handleInputChange('paymentDate', e.target.value)}
          className="w-24 px-1 py-1 border rounded text-xs"
        />
      ) : (row.paymentDate ? (() => {
          const dateStr = row.paymentDate.split('T')[0];
          const [year, month, day] = dateStr.split('-');
          return `${day}/${month}/${year}`;
        })() : "Not Paid")
    },
    { header: "Net Payment", render: (row) => `₹${row.netPayment.toLocaleString()}` },
    {
      header: "Withdraw on",
      render: (row) => isEditing ? (
        <input
          type="text"
          value={editData.withdrawFrom}
          onChange={(e) => handleInputChange('withdrawFrom', e.target.value)}
          className="w-24 px-1 py-1 border rounded text-xs"
          placeholder="Bank Name"
        />
      ) : (row.withdrawFrom || "N/A")
    },
    {
      header: "Debit To",
      render: (row) => isEditing ? (
        <input
          type="text"
          value={editData.debitTo}
          onChange={(e) => handleInputChange('debitTo', e.target.value)}
          className="w-24 px-1 py-1 border rounded text-xs"
          placeholder="Bank Name"
        />
      ) : (row.debitTo || "N/A")
    },
    { header: "Final Pay", render: (row) => `₹${row.finalPay.toLocaleString()}` },
    {
      header: "Balance on Advance",
      render: (row) => {
        const totalAdvance = row.advanceSalaryData?.reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0) || 0;
        const balance = (row.netPayment || 0);
        return `₹${balance.toLocaleString()}`;
      }
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!salary) {
    return (
      <div className="container mx-auto mt-16 p-4 text-center text-red-600">
        Salary record not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#1B504E]">
        Employee Salary Record – {salary.name}
      </h2>

      <div className="flex gap-4 mb-6">
        {!isEditing ? (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Salary
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        )}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641]"
        >
          Print Salary Slip
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#164641]"
        >
          Download Salary PDF
        </button>
      </div>

      <div className="print:hidden">
        <Table
          data={[isEditing ? editData : salary]}
          extraColumns={columns}
          excludeColumns={[
            'srNo', 'name', 'employeeId', 'presentDays', 'absentDays',
            'totalDays', 'perDaySalary', 'totalSalary', 'incentive', 'pf',
            'advanceSalaryData', 'deductions', 'balanceOnAdvance', 'totalPay',
            'paymentDate', 'netPayment', 'withdrawFrom', 'debitTo', 'finalPay', 'balance',
            'rawData'
          ]}
        />
      </div>
    </div>
  );
};

export default SalaryDetailView;