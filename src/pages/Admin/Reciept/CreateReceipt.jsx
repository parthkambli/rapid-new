import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const CreateReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("monthly");
  const [banks, setBanks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFirstPayment, setIsFirstPayment] = useState(false);
  const [searchingBill, setSearchingBill] = useState(false);

  const billSearchTimeout = useRef(null);

  const [formData, setFormData] = useState({
    receiptNumber: "",
    receiptDate: new Date().toISOString().split("T")[0],
    refCode: "",
    refDate: "",
    paymentMethod: "cash",
    cashBankAc: "",
    amount: "",
    chequeNo: "",
    chequeDate: "",
    drawnOnBank: "",
    paymentType: "full",
    nextInstallmentDate: "",
    installmentAmt: "",
    narration: "",
    customer: {
      type: "doctor",
      entityId: "",
      name: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      address: { address: "", city: "", state: "", pinCode: "", country: "India" },
    },
    salesBillNo: "", // Added salesBillNo
    paymentAgainst: null, // Added paymentAgainst
    isFirstPayment: false, // Added isFirstPayment
    debitType: "",
    debitOn: "",
    debitDate: "",
    gst: "",
    monthlyPremium: "",
  });

  // State for bill details to track balance
  const [billDetails, setBillDetails] = useState({
    totalAmount: 0,
    totalPaid: 0,
    outstandingAmount: 0,
     isInstallment: false,  // Add isInstallment flag
    nextInstallmentDueDate: null,  // Add next installment due date
    membership: null  // ← YEH ADD KAR DE!
  });

  useEffect(() => {
    fetchReceiptBanks();
    fetchDoctorsForReceipt();

    // Check for refCode in URL query parameters
    const refCodeFromUrl = searchParams.get('refCode');
    if (refCodeFromUrl) {
      // Set the refCode in form data
      setFormData(prev => ({
        ...prev,
        refCode: refCodeFromUrl
      }));

      // Trigger the bill search to auto-populate details
      setTimeout(() => {
        fetchDoctorByBillNumber(refCodeFromUrl);
      }, 100); // Small delay to ensure form state is updated
    }

    if (id) {
      setIsEditMode(true);
      fetchReceiptData();
    }
    return () => {
      if (billSearchTimeout.current) clearTimeout(billSearchTimeout.current);
    };
  }, [id, searchParams]);

  const fetchReceiptBanks = async () => {
    try {
      const response = await apiHelpers.getList(apiEndpoints.recBankDetails.list);
      const bankList = response?.data || response || [];
      setBanks(Array.isArray(bankList) ? bankList : []);
    } catch (error) {
      console.error("Error fetching receipt bank details:", error);
      setBanks([]);
    }
  };

  const fetchDoctorsForReceipt = async () => {
    try {
      const response = await apiHelpers.getList(apiEndpoints.doctors.foreceipt);
      const doctorList = response?.data || response || [];
      setDoctors(Array.isArray(doctorList) ? doctorList : []);
    } catch (error) {
      console.error("Error fetching doctors for receipt:", error);
      setDoctors([]);
    }
  };

  const fetchReceiptData = async () => {
    setLoading(true);
    try {
      const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);
      setFormData({
        receiptNumber: data.receiptNumber || "",
        receiptDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        refCode: data.referenceNumber || "",
        refDate: data.refDate || "",
        paymentMethod: data.paymentMethod || "cash",
        cashBankAc: data.cashBankAc || "",
        amount: data.amount || "",
        chequeNo: data.chequeNo || "",
        chequeDate: data.chequeDate ? new Date(data.chequeDate).toISOString().split("T")[0] : "",
        drawnOnBank: data.drawnOnBank || "",
        paymentType: data.paymentType || "full",
        nextInstallmentDate: data.nextInstallmentDate ? new Date(data.nextInstallmentDate).toISOString().split("T")[0] : "",
        installmentAmt: data.installmentAmount || "",
        narration: data.remarks || "",
        customer: data.payer || {
          type: "doctor",
          entityId: "",
          name: "",
          contactPerson: "",
          phoneNumber: "",
          email: "",
          address: { address: "", city: "", state: "", pinCode: "", country: "India" },
        },
        debitType: data.debitType || "",
        debitOn: data.debitOn || "",
        debitDate: data.debitDate ? new Date(data.debitDate).toISOString().split("T")[0] : "",
        gst: data.gst || "",
        monthlyPremium: data.monthlyPremium || "",
      });
      // Set the first payment status
      setIsFirstPayment(data.isFirstPayment || false);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      alert("Failed to load receipt data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("customer.")) {
      const customerField = field.replace("customer.", "");
      if (customerField.startsWith("address.")) {
        const addressField = customerField.replace("address.", "");
        setFormData((prev) => ({
          ...prev,
          customer: {
            ...prev.customer,
            address: { ...prev.customer.address, [addressField]: value },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          customer: { ...prev.customer, [customerField]: value },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentUserId = () => {
    try {
      const persistData = localStorage.getItem("persist:root");
      if (!persistData) return null;
      const allData = JSON.parse(persistData);
      const authString = allData.auth;
      if (!authString) return null;
      let authObj;
      try {
        authObj = JSON.parse(authString);
      } catch (e) {
        authObj = authString;
      }
      const user = typeof authObj === "object" ? authObj.user : authObj;
      return user?._id || null;
    } catch (error) {
      return null;
    }
  };

  // Bill Number se Doctor Auto-Fill with enhanced functionality
  const fetchDoctorByBillNumber = async (billNumber) => {
    const trimmed = billNumber.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4 || searchingBill) return;

    setSearchingBill(true);
    try {
      // First try to get the detailed bill information from receipt endpoints (more comprehensive)
      let response;
      try {
        response = await apiHelpers.getById(apiEndpoints.receipts.billDetails, trimmed);
      } catch (receiptError) {
        // If receipt endpoint fails, fall back to sales bill endpoint
        response = await apiHelpers.getList(apiEndpoints.salesBills.getDoctorByBillNumber(trimmed));
      }

      const result = response?.data || response;

      if (!result) {
        setSearchingBill(false);
        return;
      }

      // Check if we got data from receipt/bill-details endpoint (has more fields)
      const hasBillDetails = result.billId || result.billNumber; // This means we got detailed bill info

      let doctor, bill;
      let doctorId;

      if (hasBillDetails) {
        bill = result;
        doctorId = result.client?.entityId?._id || result.client?.entityId;
      } else {
        bill = result.bill;
        doctorId = result.doctor?._id || result.doctor;
      }

      // Try to find the doctor in our local list (which populates the dropdown)
      const matchedDoctor = doctors.find(d => d._id === doctorId);

      if (matchedDoctor) {
        doctor = matchedDoctor;
      } else {
        // Fallback to data from response
        if (hasBillDetails) {
          if (result.client?.entityId && typeof result.client.entityId === 'object') {
            doctor = result.client.entityId;
          } else {
            doctor = {
              _id: doctorId,
              fullName: result.client?.fullName || result.client?.name || "Dr. Unknown",
              hospitalName: result.client?.hospitalName || "",
              phoneNumber: result.client?.phoneNumber || "",
              email: result.client?.email || "",
              address: result.client?.address || {}
            };
          }
        } else {
          doctor = result.doctor;
        }
        // Add this doctor to the list so the dropdown can select it
        setDoctors(prev => [...prev, doctor]);
      }

      const fullName = doctor.fullName || doctor.name || "Dr. Unknown";
      const hospitalName = doctor.hospitalName || "";
      const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;

      // Prepare address based on whether it's matchedDoctor (local) or fallback
      let addressObj = { address: "", city: "", state: "", pinCode: "", country: "India" };

      if (matchedDoctor) {
        addressObj = {
          address: matchedDoctor.address?.full ||
            `${matchedDoctor.hospitalAddress?.address || ""}, ${matchedDoctor.hospitalAddress?.taluka || ""}, ${matchedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
          city: matchedDoctor.hospitalAddress?.city || matchedDoctor.address?.city || "",
          state: matchedDoctor.hospitalAddress?.state || matchedDoctor.address?.state || "",
          pinCode: matchedDoctor.hospitalAddress?.pinCode || matchedDoctor.address?.pinCode || "",
          country: "India",
        };
      } else {
        // Fallback address logic - Handle both object and string addresses
        // Check if doctor.address is an object with nested address field
        if (doctor.address && typeof doctor.address === 'object' && doctor.address.address) {
          // Address is an object like {address: '...', city: '...', state: '...', pinCode: '...'}
          addressObj = {
            address: doctor.address.address || '',
            city: doctor.address.city || doctor.city || '',
            state: doctor.address.state || doctor.state || '',
            pinCode: doctor.address.pinCode || doctor.pinCode || '',
            country: doctor.address.country || doctor.country || 'India',
          };
        } else if (doctor.address && typeof doctor.address === 'object' && doctor.address.full) {
          // Address is an object with .full property
          addressObj = {
            address: doctor.address.full || '',
            city: doctor.address.city || doctor.city || '',
            state: doctor.address.state || doctor.state || '',
            pinCode: doctor.address.pinCode || doctor.pinCode || '',
            country: doctor.address.country || doctor.country || 'India',
          };
        } else {
          // Address is a string or doesn't exist - use empty strings
          addressObj = {
            address: typeof doctor.address === 'string' ? doctor.address || "" : "",
            city: typeof doctor.city === 'string' ? doctor.city || "" : "",
            state: typeof doctor.state === 'string' ? doctor.state || "" : "",
            pinCode: typeof doctor.pinCode === 'string' ? doctor.pinCode || "" : "",
            country: "India",
          };
        }
      }

      // Update form data and bill details
      setFormData((prev) => ({
        ...prev,
        refCode: bill.billNumber,
        refDate: bill.billDate ? new Date(bill.billDate).toISOString().split("T")[0] : "",
        // Auto-populate amount with outstanding amount if available, otherwise total amount
        // amount: bill.outstandingAmount !== undefined ? bill.outstandingAmount :
        //   bill.totalAmount !== undefined ? bill.totalAmount : prev.amount,

  amount: bill.items[0].amount,

        customer: {
          type: "doctor",
          entityId: doctor._id,
          name: displayName,
          contactPerson: fullName,
          phoneNumber: doctor.phoneNumber || "",
          email: doctor.email || "",
          address: addressObj,
        },
      }));

      // Set bill details for balance calculation
      setBillDetails({
        billId: bill.billId || null,
        totalAmount: bill.totalAmount || 0,
        totalPaid: bill.totalPaid || 0,
        outstandingAmount: bill.outstandingAmount || 0,
          isInstallment: bill.isInstallment || false,  // Add isInstallment flag
        nextInstallmentDueDate: bill.nextInstallmentDueDate || null,  // Add next installment due date
        lastPaymentDate: bill.lastPaymentDate || null,  // Add last payment date
       membership: bill.membershipTracking || null  // ← YEH ADD KAR DE
      });

      // Auto-switch tab based on membershipType if available
      if (bill.membershipType) {
        const tabType = bill.membershipType.toLowerCase();
        if (tabType.includes('monthly') || tabType.includes('year') || tabType === 'yearly') {
          setActiveTab(tabType.includes('monthly') ? 'monthly' : 'yearly');
        }
      }


 // Auto-set payment type to installment if this is an installment bill
      if (bill.isInstallment && activeTab === 'yearly') {
        setFormData(prev => ({
          ...prev,
          paymentType: 'installment'
        }));
      }



      // Set isFirstPayment status if available from bill details
      if (result.isFirstReceipt !== undefined) {
        setIsFirstPayment(result.isFirstReceipt);
      }

    } catch (error) {
      console.log("Bill number not found or error:", error);
    } finally {
      setSearchingBill(false);
    }
  };

  const handleDoctorSelect = async (doctorId) => {
    const selectedDoctor = doctors.find((d) => d._id === doctorId);
    if (!selectedDoctor) return;

    const fullName = selectedDoctor.fullName || "Dr. Unknown";
    const hospitalName = selectedDoctor.hospitalName || "";
    const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;
    const latestBillNumber = selectedDoctor.latestSalesBill?.billNumber || "";

    // Check if this is the first payment for this doctor
    try {
      // Using apiHelpers.getList with proper filter object instead of direct URL params
      const response = await apiHelpers.getList(apiEndpoints.receipts.list, {
        'payer.entityId': doctorId,
        'payer.type': 'doctor',
        limit: 1,
        sort: '-createdAt' // Get the most recent receipt
      });
      const isFirst = !response.data || response.data.length === 0;
      setIsFirstPayment(isFirst);

      // If this is not the first payment, get the previous receipt's debit date to calculate the next one
      if (!isFirst && response.data && response.data.length > 0) {
        const previousReceipt = response.data[0];
        if (previousReceipt.debitDate && activeTab === "monthly") {
          // Calculate next debit date by adding 1 month to the previous debit date
          const nextDebitDate = new Date(previousReceipt.debitDate);
          nextDebitDate.setMonth(nextDebitDate.getMonth() + 1);

          // Format the date to YYYY-MM-DD for input field
          const formattedDate = nextDebitDate.toISOString().split('T')[0];

          setFormData((prev) => ({
            ...prev,
            refCode: latestBillNumber,
            customer: {
              ...prev.customer,
              entityId: selectedDoctor._id,
              name: displayName,
              contactPerson: fullName,
              phoneNumber: selectedDoctor.phoneNumber || "",
              email: selectedDoctor.email || "",
              address: {
                address: selectedDoctor.address?.full ||
                  `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
                city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
                state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
                pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
                country: "India",
              },
            },
            debitDate: formattedDate // Set the calculated next debit date
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            refCode: latestBillNumber,
            customer: {
              ...prev.customer,
              entityId: selectedDoctor._id,
              name: displayName,
              contactPerson: fullName,
              phoneNumber: selectedDoctor.phoneNumber || "",
              email: selectedDoctor.email || "",
              address: {
                address: selectedDoctor.address?.full ||
                  `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
                city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
                state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
                pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
                country: "India",
              },
            },
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          refCode: latestBillNumber,
          customer: {
            ...prev.customer,
            entityId: selectedDoctor._id,
            name: displayName,
            contactPerson: fullName,
            phoneNumber: selectedDoctor.phoneNumber || "",
            email: selectedDoctor.email || "",
            address: {
              address: selectedDoctor.address?.full ||
                `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
              city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
              state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
              pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
              country: "India",
            },
          },
        }));
      }
    } catch (error) {
      console.error("Error checking if first payment:", error);
      // Default to true if there was an error in checking
      setIsFirstPayment(true);

      setFormData((prev) => ({
        ...prev,
        refCode: latestBillNumber,
        customer: {
          ...prev.customer,
          entityId: selectedDoctor._id,
          name: displayName,
          contactPerson: fullName,
          phoneNumber: selectedDoctor.phoneNumber || "",
          email: selectedDoctor.email || "",
          address: {
            address: selectedDoctor.address?.full ||
              `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
            city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
            state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
            pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
            country: "India",
          },
        },
      }));
    }
  };

  const handleBankSelect = (bankId) => {
    const selectedBank = banks.find((b) => b._id === bankId);
    if (!selectedBank) return;
    setFormData((prev) => ({
      ...prev,
      cashBankAc: selectedBank._id,
      // Don't auto-populate drawnOnBank when selecting a bank
      // drawnOnBank: selectedBank.bankName || "Unknown Bank",
    }));
  };

  // Function to calculate next payment date for full payments (for display)
  const calculateNextPaymentDate = () => {
    // Only calculate for yearly full payments (not monthly or installments)
    if (!billDetails.membership || activeTab !== "yearly" || formData.paymentType !== "full") {
      return "Membership details not available";
    }

    const { periodType, planYears } = billDetails.membership;

    // For yearly full payments, calculate next payment date
    if (planYears > 1) {
      // For multi-year plan, next payment is due after current year period
      const receiptDate = new Date(formData.receiptDate);
      const nextPaymentDate = new Date(receiptDate);

      // Add 1 year for the current payment period
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

      // Subtract 1 day to get the date before the next payment is due
      nextPaymentDate.setDate(nextPaymentDate.getDate() - 1);

      return `Next payment due: ${nextPaymentDate.toLocaleDateString('en-GB')}`;
    } else {
      // For single year plan, next payment is due after 1 year
      const receiptDate = new Date(formData.receiptDate);
      const nextPaymentDate = new Date(receiptDate);

      // Add 1 year for the plan period
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

      // Subtract 1 day to get the date before the next payment is due
      nextPaymentDate.setDate(nextPaymentDate.getDate() - 1);

      return `Next payment due: ${nextPaymentDate.toLocaleDateString('en-GB')}`;
    }
  };

  // Function to calculate next payment date for saving to the database (yearly full payments only)
  const calculateNextPaymentDateForSaving = () => {
    // Only calculate for yearly full payments (not monthly or installments)
    if (!billDetails.membership || activeTab !== "yearly" || formData.paymentType !== "full") {
      return null;
    }

    const { periodType, planYears } = billDetails.membership;

    // For yearly full payments, calculate next payment date
    if (planYears > 1) {
      // For multi-year plan, next payment is due after current year period
      const receiptDate = new Date(formData.receiptDate);
      const nextPaymentDate = new Date(receiptDate);

      // Add 1 year for the current payment period
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

      // Subtract 1 day to get the date before the next payment is due
      nextPaymentDate.setDate(nextPaymentDate.getDate() - 1);

      return nextPaymentDate;
    } else {
      // For single year plan, next payment is due after 1 year
      const receiptDate = new Date(formData.receiptDate);
      const nextPaymentDate = new Date(receiptDate);

      // Add 1 year for the plan period
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

      // Subtract 1 day to get the date before the next payment is due
      nextPaymentDate.setDate(nextPaymentDate.getDate() - 1);

      return nextPaymentDate;
    }
  };

  // const handleSave = async () => {
  //   if (!formData.amount || !formData.customer.entityId) {
  //     alert("Please fill required fields: Amount and Customer");
  //     return;
  //   }

  //   setSaving(true);
  //   const receivedById = getCurrentUserId();
  //   if (!receivedById) {
  //     alert("User session expired! Please login again.");
  //     navigate("/login");
  //     setSaving(false);
  //     return;
  //   }

  //   try {
  //     const receiptData = {
  //       receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
  //       payer: {
  //         type: "doctor",
  //         entityId: formData.customer.entityId,
  //         name: formData.customer.name,
  //         contactPerson: formData.customer.contactPerson || formData.customer.name,
  //         phoneNumber: formData.customer.phoneNumber || "",
  //         email: formData.customer.email || "",
  //         address: formData.customer.address,
  //       },
  //       receivedBy: receivedById,
  //       amount: parseFloat(formData.amount),
  //       paymentMethod: formData.paymentMethod,
  //       paymentDate: formData.chequeDate || formData.receiptDate,
  //       status: "received",
  //       referenceNumber: formData.refCode || formData.chequeNo || "",
  //       remarks: formData.narration,
  //       // Link to the sales bill if reference number exists
  //       ...(formData.refCode && {
  //         paymentAgainst: {
  //           type: 'bill',
  //           referenceId: billDetails.billId || formData.refCode  // Use bill ID if available, else bill number
  //         }
  //       }),
  //       // Bank details should be grouped under bankDetails object
  //       bankDetails: {
  //         ...(formData.paymentMethod !== 'cash' && {
  //           bankName: banks.find(bank => bank._id === formData.cashBankAc)?.bankName || undefined,
  //           branchName: banks.find(bank => bank._id === formData.cashBankAc)?.branch || undefined,
  //           accountNumber: banks.find(bank => bank._id === formData.cashBankAc)?.accountNumber || undefined,
  //           ifscCode: banks.find(bank => bank._id === formData.cashBankAc)?.ifscCode || undefined,
  //           chequeNumber: formData.paymentMethod === 'cheque' ? formData.chequeNo : undefined,
  //           chequeDate: formData.paymentMethod === 'cheque' ? formData.chequeDate : undefined,
  //           referenceNumber: formData.paymentMethod !== 'cash' ? formData.refCode : undefined,
  //         })
  //       },
  //       cashBankAc: formData.cashBankAc || undefined,  // ← YEH ADD KAR DO
  //       drawnOnBank: formData.drawnOnBank || undefined,
  //       isFirstPayment: isFirstPayment, // Include the first payment status
  //       ...(activeTab === "monthly" && {
  //         debitType: formData.debitType || undefined,
  //         debitOn: formData.debitOn || undefined,
  //         debitDate: formData.debitDate || undefined,
  //         gst: formData.gst || undefined,
  //         monthlyPremium: formData.monthlyPremium ? parseFloat(formData.monthlyPremium) : undefined,
  //       }),
  //       ...(activeTab === "yearly" && {
  //         paymentType: formData.paymentType,
  //         // Only save nextPaymentDate for full payments, not for installments
  //         ...(formData.paymentType === "full" && {
  //           nextPaymentDate: calculateNextPaymentDateForSaving(), // Calculate and save next payment date for full payments
  //         }),
  //         ...(formData.paymentType === "installment" && {
  //           nextInstallmentDate: formData.nextInstallmentDate || undefined,
  //           installmentAmount: formData.installmentAmt ? parseFloat(formData.installmentAmt) : undefined,
  //         })
  //       }),
  //     };

  //     if (isEditMode) {
  //       await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
  //       alert("Receipt updated successfully!");
  //     } else {
  //       await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
  //       alert("Receipt created successfully!");
  //     }
  //     navigate("/admin/receipt-list");
  //   } catch (error) {
  //     console.error("Error saving receipt:", error);
  //     const msg = error.response?.data?.message || error.message || "Unknown error";
  //     alert(`Failed to save receipt: ${msg}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };


const handleSave = async () => {
  if (!formData.amount || !formData.customer.entityId) {
    alert("Please fill required fields: Amount and Customer");
    return;
  }

  setSaving(true);
  const receivedById = getCurrentUserId();
  if (!receivedById) {
    alert("User session expired! Please login again.");
    navigate("/login");
    setSaving(false);
    return;
  }

  try {
    const receiptData = {
      // receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
      ...(formData.receiptNumber?.trim() && {
        receiptNumber: formData.receiptNumber.trim()
      }),
      receiptDate: formData.receiptDate, // Send selected receipt date
      payer: {
        type: "doctor",
        entityId: formData.customer.entityId,
        name: formData.customer.name,
        contactPerson: formData.customer.contactPerson || formData.customer.name,
        phoneNumber: formData.customer.phoneNumber || "",
        email: formData.customer.email || "",
        address: formData.customer.address,
      },
      receivedBy: receivedById,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.chequeDate || formData.receiptDate,
      status: "received",
      referenceNumber: formData.refCode || formData.chequeNo || "",
      remarks: formData.narration,
      // Link to the sales bill if reference number exists
      ...(formData.refCode && {
        paymentAgainst: {
          type: 'bill',
          referenceId: billDetails.billId || formData.refCode  // Use bill ID if available, else bill number
        }
      }),
      // Bank details should be grouped under bankDetails object
      bankDetails: {
        ...(formData.paymentMethod !== 'cash' && {
          bankName: banks.find(bank => bank._id === formData.cashBankAc)?.bankName || undefined,
          branchName: banks.find(bank => bank._id === formData.cashBankAc)?.branch || undefined,
          accountNumber: banks.find(bank => bank._id === formData.cashBankAc)?.accountNumber || undefined,
          ifscCode: banks.find(bank => bank._id === formData.cashBankAc)?.ifscCode || undefined,
          chequeNumber: formData.paymentMethod === 'cheque' ? formData.chequeNo : undefined,
          chequeDate: formData.paymentMethod === 'cheque' ? formData.chequeDate : undefined,
          referenceNumber: formData.paymentMethod !== 'cash' ? formData.refCode : undefined,
        })
      },
      cashBankAc: formData.cashBankAc || undefined,  // ← YEH ADD KAR DO
      drawnOnBank: formData.drawnOnBank || undefined,
      isFirstPayment: isFirstPayment, // Include the first payment status
      ...(activeTab === "monthly" && {
        debitType: formData.debitType || undefined,
        debitOn: formData.debitOn || undefined,
        debitDate: formData.debitDate || undefined,
        gst: formData.gst || undefined,
        monthlyPremium: formData.monthlyPremium ? parseFloat(formData.monthlyPremium) : undefined,
      }),
      ...(activeTab === "yearly" && {
        paymentType: formData.paymentType,
        // Only save nextPaymentDate for full payments, not for installments
        ...(formData.paymentType === "full" && {
          nextPaymentDate: calculateNextPaymentDateForSaving(), // Calculate and save next payment date for full payments
        }),
        ...(formData.paymentType === "installment" && {
          nextInstallmentDate: formData.nextInstallmentDate || undefined,
          installmentAmount: formData.installmentAmt ? parseFloat(formData.installmentAmt) : undefined,
        })
      }),
    };

    if (isEditMode) {
      await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
      alert("Receipt updated successfully!");
      navigate("/admin/receipt-list");
    } else {
      // ✅ CHANGES HERE: CREATE RECEIPT AND NAVIGATE TO PRINT PAGE
      const response = await apiHelpers.create(apiEndpoints.receipts.create, receiptData);

      // The API response might be wrapped in a data property or might be the receipt directly
      let createdReceipt;
      if (response && response.data) {
        // If response has a data wrapper (common format)
        createdReceipt = response.data;
      } else if (response && response._id) {
        // If response is the receipt object directly
        createdReceipt = response;
      }

      if (createdReceipt && createdReceipt._id) {
        alert("Receipt created successfully! Redirecting to print page...");

        // Get the newly created receipt ID
        const receiptId = createdReceipt._id;

        // ✅ NAVIGATE TO APPROPRIATE PRINT PAGE BASED ON MEMBERSHIP TYPE
        if (activeTab === "monthly") {
          // Navigate to monthly receipt print page
          navigate(`/admin/print-monthly-receipt/${receiptId}`);
        } else if (activeTab === "yearly") {
          // Navigate to yearly receipt print page
          navigate(`/admin/print-yearly-receipt/${receiptId}`);
        } else {
          // Fallback - should not happen as we only have monthly/yearly tabs
          navigate("/admin/receipt-list");
        }
      } else {
        console.error("Receipt created but response format unexpected:", response);
        alert("Receipt created successfully! Redirecting to receipt list...");
        navigate("/admin/receipt-list");
      }
    }
  } catch (error) {
    console.error("Error saving receipt:", error);
    const msg = error.response?.data?.message || error.message || "Unknown error";
    alert(`Failed to save receipt: ${msg}`);
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate("/admin/receipt-list");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Receipt" : "Create Receipt"}
        </h2>
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "monthly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "yearly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
          >
            Yearly
          </button>
        </div>
      </div>





{/* 🔥 MEMBERSHIP PLAN INFO – Simple Rows Mein (Tere UI Style Mein) */}
{formData.refCode && billDetails.membership && (
  <div className="mt-6 space-y-3">
    <h3 className="text-md font-semibold text-gray-800 flex items-center">
      📊 Membership Plan Details
    </h3>

    {/* Row 1 */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Type:</span>
        <p className="font-medium text-gray-900">{billDetails.membership.type}</p>
      </div>
      <div>
        <span className="text-gray-600">Duration:</span>
        <p className="font-medium text-gray-900">
          {billDetails.membership.planYears} Year{billDetails.membership.planYears > 1 ? 's' : ''}
          ({billDetails.membership.planTotalPeriods} {billDetails.membership.periodType})
        </p>
      </div>
      <div>
        <span className="text-gray-600">Rate:</span>
        <p className="font-medium text-gray-900">
          ₹{billDetails.membership.monthlyRate.toLocaleString('en-IN')} / {billDetails.membership.periodType === 'months' ? 'month' : 'year'}
        </p>
      </div>
      <div>
        <span className="text-gray-600">Expected Total:</span>
        <p className="font-medium text-teal-700">
          ₹{billDetails.membership.expectedTotalAmount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>

    {/* Row 2: Progress (Simple Text + Slim Bar) */}
    <div className="pt-2">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-600">Progress:</span>
        <span className={`font-bold ${billDetails.membership.isPlanCompleted ? 'text-green-600' : 'text-orange-600'}`}>
          {billDetails.membership.periodsPaid} / {billDetails.membership.planTotalPeriods}
          ({billDetails.membership.progressPercentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-full rounded-full transition-all ${billDetails.membership.isPlanCompleted ? 'bg-green-500' : 'bg-teal-500'}`}
          style={{ width: `${billDetails.membership.progressPercentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Remaining: <strong>{billDetails.membership.remainingPeriods} {billDetails.membership.periodType}</strong>
        {billDetails.membership.isPlanCompleted && " ✅ Completed"}
      </p>
    </div>
  </div>
)}

{/* 🔥 INSTALLMENT SUMMARY INFO – For Installment Bills */}
{formData.refCode && billDetails.isInstallment && (
  <div className="mt-6 space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
    <h3 className="text-md font-semibold text-blue-800 flex items-center">
      💳 Installment Summary
    </h3>

    {/* Row 1: Installment Overview */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-blue-600">Installment Type:</span>
        <p className="font-medium text-blue-900">Active</p>
      </div>
      <div>
        <span className="text-blue-600">Total Amount:</span>
        <p className="font-medium text-blue-900">₹{billDetails.totalAmount?.toLocaleString('en-IN')}</p>
      </div>
      <div>
        <span className="text-blue-600">Paid So Far:</span>
        <p className="font-medium text-blue-900">₹{billDetails.totalPaid?.toLocaleString('en-IN')}</p>
      </div>
      <div>
        <span className="text-blue-600">Remaining:</span>
        <p className="font-medium text-red-700">₹{billDetails.outstandingAmount?.toLocaleString('en-IN')}</p>
      </div>
    </div>

    {/* Row 2: Last Payment Information */}
    {billDetails.totalPaid > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-blue-600">Last Payment:</span>
          <p className="font-medium text-blue-900">₹{billDetails.totalPaid?.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span className="text-blue-600">Last Payment Date:</span>
          <p className="font-medium text-blue-900">
            {billDetails.lastPaymentDate
              ? new Date(billDetails.lastPaymentDate).toLocaleDateString('en-IN')
              : 'N/A'}
          </p>
        </div>
        <div>
          <span className="text-blue-600">Next Installment Due:</span>
          <p className="font-medium text-orange-700">
            {billDetails.nextInstallmentDueDate
              ? new Date(billDetails.nextInstallmentDueDate).toLocaleDateString('en-IN')
              : 'Not Set'}
          </p>
        </div>
      </div>
    )}

    {/* Row 3: Status Indicator */}
    <div className="pt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${((billDetails.totalPaid || 0) / (billDetails.totalAmount || 1)) * 100}%` }}
        />
      </div>
      <p className="text-sm text-blue-600 mt-1">
        Payment Progress: <strong>{Math.round(((billDetails.totalPaid || 0) / (billDetails.totalAmount || 1)) * 100)}%</strong>
      </p>
    </div>
  </div>
)}


      {/* Receipt Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
          <input
            type="text"
            value={formData.receiptNumber}
            onChange={(e) => handleInputChange("receiptNumber", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            placeholder="Auto-generated"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Receipt Date</label>
          <input
            type="date"
            value={formData.receiptDate}
            onChange={(e) => handleInputChange("receiptDate", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Ref Code (Bill No.)</span>
            {searchingBill && <span className="text-xs text-blue-600 animate-pulse">Searching...</span>}
          </label>
          <input
            type="text"
            value={formData.refCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              handleInputChange("refCode", val);
              if (billSearchTimeout.current) clearTimeout(billSearchTimeout.current);
              billSearchTimeout.current = setTimeout(() => {
                fetchDoctorByBillNumber(val);
              }, 1500);
            }}
            className="mt-1 p-2 w-full border-2 border-[#398C89] rounded-md font-semibold focus:ring-2 focus:ring-[#398C89]/30"
            placeholder="Type Bill No. → Auto-fill Doctor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ref Date</label>
          <input
            type="date"
            value={formData.refDate}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
          />
        </div>
      </div>

      {/* Doctor Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Doctor/Hospital *</label>
          <select
            value={formData.customer.entityId}
            onChange={(e) => handleDoctorSelect(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            required
          >
            <option value="">Select Doctor/Hospital</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.fullName}
                {doctor.hospitalName && ` - ${doctor.hospitalName}`}
                {doctor.membershipId && ` (${doctor.membershipId})`}
                {doctor.latestSalesBill && ` | Last Bill: ${doctor.latestSalesBill.billNumber}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input
            type="text"
            value={formData.customer.contactPerson}
            onChange={(e) => handleInputChange("customer.contactPerson", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* Conditional rendering based on isFirstPayment */}
      {isFirstPayment && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">First Payment Alert</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This is the first payment for this customer.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={formData.customer.phoneNumber}
            onChange={(e) => handleInputChange("customer.phoneNumber", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.customer.email}
            onChange={(e) => handleInputChange("customer.email", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={formData.customer.address.address}
            onChange={(e) => handleInputChange("customer.address.address", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.customer.address.city}
            onChange={(e) => handleInputChange("customer.address.city", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={formData.customer.address.state}
            onChange={(e) => handleInputChange("customer.address.state", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PIN</label>
          <input
            type="text"
            value={formData.customer.address.pinCode}
            onChange={(e) => handleInputChange("customer.address.pinCode", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* Payment Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
        <div className="flex flex-wrap gap-6">
          {["cash", "cheque", "nach", "neft/rtgs", "online", "other"].map((mode) => (
            <label key={mode} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value={mode}
                checked={formData.paymentMethod === mode}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="text-[#398C89]"
              />
              <span className="text-sm text-gray-700 capitalize">{mode.replace("_", "/")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amount & Cheque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount *</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            required
          />
        </div>
        {/* Bill Amount Information - only shown when refCode (bill number) is present */}
        {formData.refCode && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500">Total Amount</label>
                <input
                  type="number"
                  readOnly
                  value={billDetails.totalAmount}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Paid Amount</label>
                <input
                  type="number"
                  readOnly
                  value={billDetails.totalPaid}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Balance Left to Pay</label>
              <input
                type="number"
                readOnly
                value={billDetails.outstandingAmount}
                className="mt-1 p-2 w-full border-2 border-[#398C89] rounded-md bg-gray-100 font-semibold cursor-not-allowed"
              />
            </div>
          </div>
        )}
        {formData.paymentMethod === "cheque" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cheque No.</label>
              <input
                type="text"
                value={formData.chequeNo}
                onChange={(e) => handleInputChange("chequeNo", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
              <input
                type="date"
                value={formData.chequeDate}
                onChange={(e) => handleInputChange("chequeDate", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </>
        )}
      </div>

      {/* Bank Selection (Non-cash) */}
      {formData.paymentMethod !== "cash" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Our Bank Account *</label>
            <select
              value={formData.cashBankAc}
              onChange={(e) => {
                handleInputChange("cashBankAc", e.target.value);
                handleBankSelect(e.target.value);
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="">Select Bank Account</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName} - {bank.accountNumber} ({bank.ifsc || "IFSC"})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
            <input
              type="text"
              value={formData.drawnOnBank}
              onChange={(e) => handleInputChange("drawnOnBank", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              placeholder="Enter bank name"
            />
          </div>
        </div>
      )}

      {/* Yearly Installment */}
      {activeTab === "yearly" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={formData.paymentType}
              onChange={(e) => handleInputChange("paymentType", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
            </select>
          </div>
          {formData.paymentType === "installment" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
                <input
                  type="number"
                  value={formData.installmentAmt}
                  onChange={(e) => handleInputChange("installmentAmt", e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
                <input
                  type="date"
                  value={formData.nextInstallmentDate}
                  onChange={(e) => handleInputChange("nextInstallmentDate", e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Monthly Details */}
      {activeTab === "monthly" && (
        <div className="border-t pt-6 mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit Type</label>
              <select
                value={formData.debitType}
                onChange={(e) => handleInputChange("debitType", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select</option>
                <option value="ach">ACH</option>
                <option value="nach">NACH</option>
                <option value="online">ONLINE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit On</label>
              <input
                type="text"
                value={formData.debitOn}
                onChange={(e) => handleInputChange("debitOn", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit Date</label>
              <input
                type="date"
                value={formData.debitDate}
                onChange={(e) => handleInputChange("debitDate", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST</label>
              <input
                type="text"
                value={formData.gst}
                onChange={(e) => handleInputChange("gst", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Monthly Premium</label>
              <input
                type="number"
                value={formData.monthlyPremium}
                onChange={(e) => handleInputChange("monthlyPremium", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Narration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Narration / Remarks</label>
        <textarea
          value={formData.narration}
          onChange={(e) => handleInputChange("narration", e.target.value)}
          rows={4}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          placeholder="Any additional notes..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-start space-x-4 mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditMode ? "Update Receipt" : "Create Receipt"}
        </button>
        <button
          onClick={handleCancel}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateReceipt;