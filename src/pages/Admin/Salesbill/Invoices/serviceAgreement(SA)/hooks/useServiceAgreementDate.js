// hooks/useServiceAgreementData.js - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../../../../../services/apiClient';

const useServiceAgreementData = (type, salesBillId) => {
  const [data, setData] = useState({
    doctor: null,
    members: [],
    policies: [],
    salesBill: null,
    loading: true,
    error: null
  });

  const calculatePolicyDuration = (startDate, endDate, fallback = 'Yearly') => {
    if (!startDate || !endDate) return fallback;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      let months = (end.getFullYear() - start.getFullYear()) * 12;
      months += end.getMonth() - start.getMonth();
      
      if (end.getDate() < start.getDate()) {
        months--;
      }
      
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (remainingMonths >= 11) {
        return `${years + 1} YEAR${years + 1 > 1 ? 'S' : ''}`;
      }
      
      if (years === 0) {
        return `${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
      } else if (remainingMonths === 0) {
        return `${years} YEAR${years > 1 ? 'S' : ''}`;
      } else {
        return `${years} YEAR${years > 1 ? 'S' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
      }
      
    } catch (error) {
      return fallback;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!salesBillId) {
        setData(prev => ({ ...prev, loading: false, error: 'Sales Bill ID is required' }));
        return;
      }

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // 1. Fetch Sales Bill
        const billRes = await apiClient.get(apiEndpoints.salesBills.get(salesBillId));
        if (!billRes.data.success) throw new Error(billRes.data.message || 'Failed to fetch sales bill');
        const bill = billRes.data.data;

        // 2. Identify Primary Doctor ID
        const primaryEntity = bill.client?.entityId;
        const primaryId = typeof primaryEntity === 'object' ? primaryEntity._id : primaryEntity;
        if (!primaryId) throw new Error('No doctor linked to this bill');

        // 3. Fetch service agreement policies
        let saPolicies = [];
        try {
          const saPoliciesRes = await apiClient.get(`${apiEndpoints.salesBills.getServiceAgreementPolicies(salesBillId)}`);
          if (saPoliciesRes.data.success) {
            saPolicies = saPoliciesRes.data.data.policies || [];
          }
        } catch (saErr) {
          console.warn('Error fetching SA policies:', saErr.message);
        }

        // 4. Fetch Doctor Data (with Spouse Check)
        const doctorRes = await apiClient.get(apiEndpoints.doctors.getWithSpouse(primaryId));
        if (!doctorRes.data.success) throw new Error('Failed to fetch doctor details');

        const responseData = doctorRes.data.data;
        const mainDoctor = responseData.mainDoctor || responseData;
        let linkedDoctor = responseData.linkedDoctor || null;
        const isLinked = responseData.isLinked || false;

        const isSpouseCase = (mainDoctor.doctorType === "individual" || mainDoctor.doctorType === "hospital_individual") &&
                             mainDoctor.linkedDoctorId &&
                             mainDoctor.relationshipType === "spouse";

        // Calculate Period
        const calculatePeriod = (start, end) => {
          if (!start || !end) return 'N/A';
          const s = new Date(start);
          const e = new Date(end);
          const diffTime = Math.abs(e - s);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 360) return `${Math.round(diffDays / 365)} Year(s)`;
          return `${Math.round(diffDays / 30)} Month(s)`;
        };
        const membershipPeriod = calculatePeriod(bill.billDate, bill.dueDate);

        // Service Charge
        let serviceChargeAmount = bill.totalAmount || 0;
        if (bill.membershipType === 'monthly' && bill.items?.length > 0) {
          const monthlyItem = bill.items.find(item => item.serviceType === 'consultation');
          if (monthlyItem) serviceChargeAmount = monthlyItem.amount || bill.totalAmount;
        }

        const mapToMember = (d, isPrimary = true) => {
          const isHospitalOnly = d.doctorType === 'hospital';
          const addr = isHospitalOnly ? d.hospitalAddress : d.contactDetails?.currentAddress;
          
          return {
            fullName: isHospitalOnly ? '-' : d.fullName,
            hospitalName: d.hospitalName || 'N/A',
            qualification: isHospitalOnly ? '-' : d.qualification || 'N/A',
            specialization: isHospitalOnly ? 
              (d.hospitalDetails?.hospitalType || 'Hospital Management') : 
              (Array.isArray(d.specialization) ? d.specialization.join(', ') : d.specialization || 'N/A'),
            registrationNumber: d.licenseNumber || d.hospitalDetails?.licenseNumber || 'N/A',
            registrationYear: d.registrationYear || d.hospitalDetails?.establishmentYear || 'N/A',
            membershipId: bill.billNumber || d.membershipId || 'N/A',
            membershipType: bill.membershipType.toUpperCase() || 'N/A',
            doctorType: d.doctorType ? d.doctorType.toLowerCase() : 'individual',
            membershipPeriod: membershipPeriod,
            startDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
            endDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
            totalServiceCharge: `₹${serviceChargeAmount.toLocaleString('en-IN')}`,
            
            // ✅ CRITICAL FIX: Ensure all address fields are explicitly included
            address: addr?.address || 'N/A',
            city: addr?.city || 'N/A',
            taluka: addr?.taluka || 'N/A',
            district: addr?.district || 'N/A',
            state: addr?.state || 'N/A',
            pincode: addr?.pinCode || 'N/A',
            country: (addr?.country || 'India').toUpperCase(),
            
            medicalCouncilNumber: d.licenseNumber || 'N/A',
            isPrimary: isPrimary,
            isSpouse: !isPrimary,
            isHospitalOnly: isHospitalOnly,
            formattedHospitalAddress: d.hospitalName && d.hospitalAddress ?
              `${d.hospitalName}, ${d.hospitalAddress.address || ''}, ${d.hospitalAddress.taluka || ''}, ${d.hospitalAddress.district || ''}, ${d.hospitalAddress.city || ''}, ${d.hospitalAddress.state || ''}, ${(d.hospitalAddress.country || 'India').toUpperCase()} - ${d.hospitalAddress.pinCode || ''}`.replace(/, ,/g, ',').replace(/,,/g, ',') :
              d.hospitalName || 'N/A'
          };
        };

        const primaryDocData = mapToMember(mainDoctor, true);
        let members = [primaryDocData];

        if (mainDoctor.doctorType === 'hospital_individual') {
          if (isSpouseCase && linkedDoctor) {
            members.push(mapToMember(linkedDoctor, false));
          }
          // Add hospital as a member too
          members.push({
            ...primaryDocData,
            fullName: '-',
            doctorType: 'hospital',
            isPrimary: false,
            isHospitalOnly: true
          });
        } else if (isLinked && linkedDoctor) {
          members.push(mapToMember(linkedDoctor, false));
        }

        // Process Payment Data
        const payments = bill.payments || [];
        const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;
        
        // Robust payment mode and debit type logic
        const isAutomated = 
          bill.paymentTerms === 'Auto Debit' || 
          bill.paymentTerms === 'NACH' || 
          lastPayment?.paymentMethod === 'nach' || 
          lastPayment?.paymentMethod === 'online' ||
          lastPayment?.paymentId?.debitType;

        let paymentMode = (isAutomated ? 'By Nach (Auto Debit)' : 'N/A').toUpperCase();
        
        if (lastPayment) {
          const method = lastPayment.paymentMethod?.toLowerCase();
          paymentMode = (method === 'cheque' ? `Cheque (${lastPayment.referenceNumber || '-'})` :
                         (method === 'online' || method === 'online_transfer' || method === 'upi') ? 'Online Transfer' : 
                         (method === 'nach' || method === 'auto_debit') ? 'By Nach (Auto Debit)' : 'Cash').toUpperCase();
        }

        const formattedPolicies = saPolicies.map(p => ({
          insuranceCoName: p.insuranceCompany?.companyName || p.insuranceCompanyName || 'N/A',
          policyType: p.insuranceType?.typeName || p.policyTypeName || 'Professional Indemnity',
          policyNumber: p.policyNumber || 'N/A',
          policyCover: `₹${(p.coverageAmount || 0).toLocaleString('en-IN')}`,
          policyDuration: calculatePolicyDuration(p.startDate, p.endDate, p.premiumFrequency || 'Yearly'),
          policyPremium: (p.paidBy === 'by_company' ? 'Paid By Rapid' : `₹${(p.premiumAmount || 0).toLocaleString('en-IN')}`).toUpperCase(),
          paidBy: p.paidBy,
          premiumAmount: p.premiumAmount,
          policyStartDate: p.startDate ? new Date(p.startDate).toLocaleDateString('en-GB') : '-',
          policyEndDate: p.endDate ? new Date(p.endDate).toLocaleDateString('en-GB') : '-',
          holderName: p.policyHolderName || p.holderName || 'N/A',
          status: p.status || 'active'
        }));

        // Extract receipt details if paymentId is populated
        const receipt = lastPayment?.paymentId;

        // Dynamic Upcoming Payment Logic
        const getOrdinalDay = (day) => {
          if (!day || day < 1 || day > 31) return '27th';
          const s = ["th", "st", "nd", "rd"];
          const v = day % 100;
          return day + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        let debitDateDisplay = '27th of every month';
        if (receipt?.debitDate) {
          const dDate = new Date(receipt.debitDate);
          if (!isNaN(dDate.getTime())) {
            debitDateDisplay = `${getOrdinalDay(dDate.getDate())} of every month`;
          }
        } else if (lastPayment?.nextDebitDate) {
          const nDate = new Date(lastPayment.nextDebitDate);
          if (!isNaN(nDate.getTime())) {
            debitDateDisplay = `${getOrdinalDay(nDate.getDate())} of every month`;
          }
        }

        setData({
          doctor: {
            ...primaryDocData,
            hasSpouse: isSpouseCase && !!linkedDoctor,
            spouseInfo: isSpouseCase && linkedDoctor ? mapToMember(linkedDoctor, false) : null,
            originalDoctor: mainDoctor,
            originalLinkedDoctor: linkedDoctor
          },
          members,
          policies: formattedPolicies,
          salesBill: {
            ...bill,
            paymentStats: {
              totalAmount: `₹${bill.totalAmount?.toLocaleString('en-IN')}`,
              paidAmount: `₹${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-IN')}`,
              paymentMode,
              paymentDate: lastPayment ? new Date(lastPayment.paymentDate).toLocaleDateString('en-GB') : 'N/A',
              amountPaid: lastPayment ? `₹${lastPayment.amount?.toLocaleString('en-IN')}` : 'N/A',
              chequeNo: lastPayment?.paymentMethod?.toLowerCase() === 'cheque' ? lastPayment.referenceNumber : '-',
              drawnOnBank: receipt?.drawnOnBank || '-'
            },
            upcomingPayments: bill.membershipType === 'monthly' ? {
              paymentFrequency: 'Monthly',
              debitType: isAutomated ? 'By Nach (Auto Debit)' : 'N/A',
              debitDate: debitDateDisplay,
              gst: receipt?.gst || 'NA',
              monthlyPremium: `₹${(receipt?.monthlyPremium || serviceChargeAmount).toLocaleString('en-IN')}`
            } : null
          },
          loading: false,
          error: null
        });

      } catch (err) {
        console.error('Error in SA Hook:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };
    fetchData();
  }, [type, salesBillId]);

  return data;
};

export default useServiceAgreementData;