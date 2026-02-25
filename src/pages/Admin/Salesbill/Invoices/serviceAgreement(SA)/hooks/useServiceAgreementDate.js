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

  // ✅ FIXED: Accurate policy duration calculation
  // const calculatePolicyDuration = (startDate, endDate, fallback = 'Yearly') => {
  //   if (!startDate || !endDate) return fallback;
    
  //   try {
  //     const start = new Date(startDate);
  //     const end = new Date(endDate);
      
  //     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  //       return fallback;
  //     }
      
  //     // Calculate years and months difference accurately
  //     let years = end.getFullYear() - start.getFullYear();
  //     let months = end.getMonth() - start.getMonth();
      
  //     // Adjust if end month is before start month
  //     if (months < 0) {
  //       years--;
  //       months += 12;
  //     }
      
  //     // Adjust for days - if end date day is less than start date day
  //     if (end.getDate() < start.getDate()) {
  //       months--;
  //       if (months < 0) {
  //         years--;
  //         months = 11;
  //       }
  //     }
      
  //     // For insurance policies, we should consider 1 Feb 2026 to 31 Jan 2027 as 1 Year
  //     // Check if it's essentially a full year (12 months)
  //     const diffTime = Math.abs(end - start);
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
  //     // If difference is between 360-370 days (accounting for leap years), consider it as 1 year
  //     if (diffDays >= 360 && diffDays <= 370) {
  //       return '1 Year';
  //     }
      
  //     // For 2 years (730-732 days accounting for leap years)
  //     if (diffDays >= 730 && diffDays <= 732) {
  //       return '2 Years';
  //     }
      
  //     // For 3 years (1095-1098 days)
  //     if (diffDays >= 1095 && diffDays <= 1098) {
  //       return '3 Years';
  //     }
      
  //     // Now format the result
  //     if (years === 0 && months === 0) {
  //       // Same day
  //       return '0 Month';
  //     } else if (years === 0) {
  //       // Less than 1 year
  //       return `${months} Month${months > 1 ? 's' : ''}`;
  //     } else if (months === 0) {
  //       // Exact years
  //       return `${years} Year${years > 1 ? 's' : ''}`;
  //     } else {
  //       // Years and months
  //       return `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
  //     }
      
  //   } catch (error) {
  //     console.error('Error calculating policy duration:', error);
  //     return fallback;
  //   }
  // };

  
  // ✅ FINAL & SIMPLEST - Sirf 1 din ka difference ignore karo aur 11 months ko 1 year banao
const calculatePolicyDuration = (startDate, endDate, fallback = 'Yearly') => {
  if (!startDate || !endDate) return fallback;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate months
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();
    
    // Insurance policy ka rule: 31 Jan vs 1 Feb = same month
    // Isliye agar end date ka din < start date ka din, tabhi adjust karo
    if (end.getDate() < start.getDate()) {
      months--;
    }
    
    // Ab months ko years mein convert karo with ROUNDING
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    // ✅ ROUNDING RULE: 11 months = 1 Year
    if (remainingMonths >= 11) {
      return `${years + 1} YEAR${years + 1 > 1 ? 'S' : ''}`;
    }
    
    // Simple output
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

        console.log('Fetching sales bill with ID:', salesBillId);

        // 1. Fetch Sales Bill
        const billRes = await apiClient.get(apiEndpoints.salesBills.get(salesBillId));
        console.log('Sales bill API response:', billRes);

        if (!billRes.data.success) {
          throw new Error(billRes.data.message || 'Failed to fetch sales bill');
        }

        const bill = billRes.data.data;
        console.log('Sales bill data loaded:', bill);

        // 2. Identify Primary Doctor ID
        const primaryEntity = bill.client?.entityId;
        const primaryId = typeof primaryEntity === 'object' ? primaryEntity._id : primaryEntity;

        if (!primaryId) throw new Error('No doctor linked to this bill');
        console.log('Primary doctor ID:', primaryId);

        // 3. Fetch service agreement policies via new API
        let saPolicies = [];
        let saPoliciesFetched = false;
        try {
          const saPoliciesRes = await apiClient.get(`${apiEndpoints.salesBills.getServiceAgreementPolicies(salesBillId)}`);
          if (saPoliciesRes.data.success) {
            saPolicies = saPoliciesRes.data.data.policies || [];
            saPoliciesFetched = true;
            console.log('Service Agreement policies fetched:', saPolicies);
          } else {
            console.warn('Failed to fetch SA policies via new API, falling back to manual fetch');
          }
        } catch (saErr) {
          console.warn('Error fetching SA policies via new API, falling back to manual fetch:', saErr.message);
        }

        // 4. Fetch Doctor Data (with Spouse Check)
        const doctorRes = await apiClient.get(apiEndpoints.doctors.getWithSpouse(primaryId));
        if (!doctorRes.data.success) throw new Error('Failed to fetch doctor details');

        const responseData = doctorRes.data.data;
        const mainDoctor = responseData.mainDoctor || responseData;
        let linkedDoctor = responseData.linkedDoctor || null;
        let isLinked = responseData.isLinked || false;

        console.log('Main doctor:', mainDoctor?.fullName);
        console.log('Has linked doctor?', isLinked, linkedDoctor?.fullName);

        // Spouse Detection Logic
        const isSpouseCase = (mainDoctor.doctorType === "individual" || mainDoctor.doctorType === "hospital_individual") &&
                             mainDoctor.linkedDoctorId &&
                             mainDoctor.relationshipType === "spouse";

        console.log('Is spouse case?', isSpouseCase);

        // If linked doctor is not populated but ID exists, fetch it manually
        if (!linkedDoctor && isSpouseCase) {
          try {
            const linkedId = typeof mainDoctor.linkedDoctorId === 'object' ? mainDoctor.linkedDoctorId._id : mainDoctor.linkedDoctorId;
            if (linkedId) {
              const linkedRes = await apiClient.get(apiEndpoints.doctors.get(linkedId));
              if (linkedRes.data.success) {
                linkedDoctor = linkedRes.data.data;
                isLinked = true;
                console.log('Fetched linked doctor manually:', linkedDoctor.fullName);
              }
            }
          } catch (e) {
            console.warn('Failed to fetch linked doctor', e);
          }
        }

        // Only fetch from doctor policies if SA API failed to return any policies
        if (!saPoliciesFetched || saPolicies.length === 0) {
          // Apply business logic for policy fetching based on doctor type and relationships
          if (mainDoctor.doctorType === 'hospital' && mainDoctor.policies && mainDoctor.policies.length > 0) {
            console.log(`Found ${mainDoctor.policies.length} policies in hospital doctor, getting the most recent one`);

            const sortedPolicies = [...mainDoctor.policies].sort((a, b) =>
              new Date(a.createdAt) - new Date(b.createdAt)
            );

            const oldestPolicy = sortedPolicies[0];

            const oldestPolicyFormatted = {
              insuranceCoName: oldestPolicy.insuranceCompanyName || oldestPolicy.insuranceCoName || 'N/A',
              policyType: oldestPolicy.policyTypeName || oldestPolicy.policyType || 'Professional Indemnity',
              policyNumber: oldestPolicy.policyNumber || 'N/A',
              policyCover: `₹${(oldestPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
              policyDuration: calculatePolicyDuration(oldestPolicy.startDate, oldestPolicy.endDate, oldestPolicy.duration || 'Yearly'),
              policyPremium: oldestPolicy.premiumAmount ? `₹${oldestPolicy.premiumAmount}` : 'Included',
              policyStartDate: oldestPolicy.startDate ? new Date(oldestPolicy.startDate).toLocaleDateString('en-GB') : '-',
              policyEndDate: oldestPolicy.endDate ? new Date(oldestPolicy.endDate).toLocaleDateString('en-GB') : '-',
              holderName: mainDoctor.fullName || mainDoctor.hospitalName || 'N/A',
              status: oldestPolicy.status || 'active',
              type: oldestPolicy.policyType || 'hospital'
            };

            saPolicies = [oldestPolicyFormatted];
          }
          // For hospital_individual with spouse: Show 3 policies
          else if (mainDoctor.doctorType === 'hospital_individual' && isSpouseCase) {
            console.log('Processing hospital_individual with spouse - showing 3 policies');

            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const sortedPolicies = [...mainDoctor.policies].sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
              );
              const oldestHospitalPolicy = sortedPolicies[0];

              const hospitalPolicyFormatted = {
                insuranceCoName: oldestHospitalPolicy.insuranceCompanyName || oldestHospitalPolicy.insuranceCoName || 'N/A',
                policyType: oldestHospitalPolicy.policyTypeName || oldestHospitalPolicy.policyType || 'Hospital Policy',
                policyNumber: oldestHospitalPolicy.policyNumber || 'N/A',
                policyCover: `₹${(oldestHospitalPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                // ✅ FIXED: Changed calculatePolicyDuration to policyDuration
                policyDuration: calculatePolicyDuration(oldestHospitalPolicy.startDate, oldestHospitalPolicy.endDate, oldestHospitalPolicy.duration || 'Yearly'),
                policyPremium: oldestHospitalPolicy.premiumAmount ? `₹${oldestHospitalPolicy.premiumAmount}` : 'Included',
                policyStartDate: oldestHospitalPolicy.startDate ? new Date(oldestHospitalPolicy.startDate).toLocaleDateString('en-GB') : '-',
                policyEndDate: oldestHospitalPolicy.endDate ? new Date(oldestHospitalPolicy.endDate).toLocaleDateString('en-GB') : '-',
                holderName: mainDoctor.fullName || mainDoctor.hospitalName || 'N/A',
                status: oldestHospitalPolicy.status || 'active',
                type: 'hospital'
              };

              saPolicies.push(hospitalPolicyFormatted);
            }

            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const doctorPolicies = mainDoctor.policies.filter(p => p.policyType === 'dr');
              if (doctorPolicies.length > 0) {
                const sortedDoctorPolicies = [...doctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedDoctorPolicies.length > 0) {
                  const oldestDoctorPolicy = sortedDoctorPolicies[0];

                  const doctorPolicyFormatted = {
                    insuranceCoName: oldestDoctorPolicy.insuranceCompanyName || oldestDoctorPolicy.insuranceCoName || 'N/A',
                    policyType: oldestDoctorPolicy.policyTypeName || oldestDoctorPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestDoctorPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestDoctorPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestDoctorPolicy.startDate, oldestDoctorPolicy.endDate, oldestDoctorPolicy.duration || 'Yearly'),
                    policyPremium: oldestDoctorPolicy.premiumAmount ? `₹${oldestDoctorPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestDoctorPolicy.startDate ? new Date(oldestDoctorPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestDoctorPolicy.endDate ? new Date(oldestDoctorPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: mainDoctor.fullName || 'N/A',
                    status: oldestDoctorPolicy.status || 'active',
                    type: 'main-doctor'
                  };

                  saPolicies.push(doctorPolicyFormatted);
                }
              }
            }

            if (linkedDoctor && linkedDoctor.policies && linkedDoctor.policies.length > 0) {
              const linkedDoctorPolicies = linkedDoctor.policies.filter(p => p.policyType === 'dr');
              if (linkedDoctorPolicies.length > 0) {
                const sortedLinkedPolicies = [...linkedDoctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedLinkedPolicies.length > 0) {
                  const oldestLinkedPolicy = sortedLinkedPolicies[0];

                  const linkedPolicyFormatted = {
                    insuranceCoName: oldestLinkedPolicy.insuranceCompanyName || oldestLinkedPolicy.insuranceCoName || 'N/A',
                    policyType: oldestLinkedPolicy.policyTypeName || oldestLinkedPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestLinkedPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestLinkedPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestLinkedPolicy.startDate, oldestLinkedPolicy.endDate, oldestLinkedPolicy.duration || 'Yearly'),
                    policyPremium: oldestLinkedPolicy.premiumAmount ? `₹${oldestLinkedPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestLinkedPolicy.startDate ? new Date(oldestLinkedPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestLinkedPolicy.endDate ? new Date(oldestLinkedPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: linkedDoctor.fullName || 'N/A',
                    status: oldestLinkedPolicy.status || 'active',
                    type: 'linked-doctor'
                  };

                  saPolicies.push(linkedPolicyFormatted);
                }
              }
            }
          }
          // For individual with spouse: Show 2 policies
          else if ((mainDoctor.doctorType === 'individual' || mainDoctor.doctorType === 'hospital_individual') && isSpouseCase) {
            console.log('Processing individual with spouse - showing 2 policies');

            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const doctorPolicies = mainDoctor.policies.filter(p => p.policyType === 'dr');
              if (doctorPolicies.length > 0) {
                const sortedDoctorPolicies = [...doctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedDoctorPolicies.length > 0) {
                  const oldestDoctorPolicy = sortedDoctorPolicies[0];

                  const doctorPolicyFormatted = {
                    insuranceCoName: oldestDoctorPolicy.insuranceCompanyName || oldestDoctorPolicy.insuranceCoName || 'N/A',
                    policyType: oldestDoctorPolicy.policyTypeName || oldestDoctorPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestDoctorPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestDoctorPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestDoctorPolicy.startDate, oldestDoctorPolicy.endDate, oldestDoctorPolicy.duration || 'Yearly'),
                    policyPremium: oldestDoctorPolicy.premiumAmount ? `₹${oldestDoctorPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestDoctorPolicy.startDate ? new Date(oldestDoctorPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestDoctorPolicy.endDate ? new Date(oldestDoctorPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: mainDoctor.fullName || 'N/A',
                    status: oldestDoctorPolicy.status || 'active',
                    type: 'main-doctor'
                  };

                  saPolicies.push(doctorPolicyFormatted);
                }
              }
            }

            if (linkedDoctor && linkedDoctor.policies && linkedDoctor.policies.length > 0) {
              const linkedDoctorPolicies = linkedDoctor.policies.filter(p => p.policyType === 'dr');
              if (linkedDoctorPolicies.length > 0) {
                const sortedLinkedPolicies = [...linkedDoctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedLinkedPolicies.length > 0) {
                  const oldestLinkedPolicy = sortedLinkedPolicies[0];

                  const linkedPolicyFormatted = {
                    insuranceCoName: oldestLinkedPolicy.insuranceCompanyName || oldestLinkedPolicy.insuranceCoName || 'N/A',
                    policyType: oldestLinkedPolicy.policyTypeName || oldestLinkedPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestLinkedPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestLinkedPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestLinkedPolicy.startDate, oldestLinkedPolicy.endDate, oldestLinkedPolicy.duration || 'Yearly'),
                    policyPremium: oldestLinkedPolicy.premiumAmount ? `₹${oldestLinkedPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestLinkedPolicy.startDate ? new Date(oldestLinkedPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestLinkedPolicy.endDate ? new Date(oldestLinkedPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: linkedDoctor.fullName || 'N/A',
                    status: oldestLinkedPolicy.status || 'active',
                    type: 'linked-doctor'
                  };

                  saPolicies.push(linkedPolicyFormatted);
                }
              }
            }
          }
          // For individual without spouse: Show 1 policy
          else if (mainDoctor.doctorType === 'individual' && !isSpouseCase) {
            console.log('Processing individual without spouse - showing 1 policy');

            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const doctorPolicies = mainDoctor.policies.filter(p => p.policyType === 'dr');
              if (doctorPolicies.length > 0) {
                const sortedDoctorPolicies = [...doctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedDoctorPolicies.length > 0) {
                  const oldestDoctorPolicy = sortedDoctorPolicies[0];

                  const doctorPolicyFormatted = {
                    insuranceCoName: oldestDoctorPolicy.insuranceCompanyName || oldestDoctorPolicy.insuranceCoName || 'N/A',
                    policyType: oldestDoctorPolicy.policyTypeName || oldestDoctorPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestDoctorPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestDoctorPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestDoctorPolicy.startDate, oldestDoctorPolicy.endDate, oldestDoctorPolicy.duration || 'Yearly'),
                    policyPremium: oldestDoctorPolicy.premiumAmount ? `₹${oldestDoctorPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestDoctorPolicy.startDate ? new Date(oldestDoctorPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestDoctorPolicy.endDate ? new Date(oldestDoctorPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: mainDoctor.fullName || 'N/A',
                    status: oldestDoctorPolicy.status || 'active',
                    type: 'main-doctor'
                  };

                  saPolicies.push(doctorPolicyFormatted);
                }
              }
            }
          }
          // For hospital_individual without spouse: Show 2 policies (hospital and doctor)
          else if (mainDoctor.doctorType === 'hospital_individual' && !isSpouseCase) {
            console.log('Processing hospital_individual without spouse - showing 2 policies');

            // Get the oldest hospital policy
            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const hospitalPolicies = mainDoctor.policies.filter(p => p.policyType === 'hospital');
              if (hospitalPolicies.length > 0) {
                const sortedPolicies = [...hospitalPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );
                const oldestHospitalPolicy = sortedPolicies[0];

                const hospitalPolicyFormatted = {
                  insuranceCoName: oldestHospitalPolicy.insuranceCompanyName || oldestHospitalPolicy.insuranceCoName || 'N/A',
                  policyType: oldestHospitalPolicy.policyTypeName || oldestHospitalPolicy.policyType || 'Hospital Policy',
                  policyNumber: oldestHospitalPolicy.policyNumber || 'N/A',
                  policyCover: `₹${(oldestHospitalPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                  policyDuration: calculatePolicyDuration(oldestHospitalPolicy.startDate, oldestHospitalPolicy.endDate, oldestHospitalPolicy.duration || 'Yearly'),
                  policyPremium: oldestHospitalPolicy.premiumAmount ? `₹${oldestHospitalPolicy.premiumAmount}` : 'Included',
                  policyStartDate: oldestHospitalPolicy.startDate ? new Date(oldestHospitalPolicy.startDate).toLocaleDateString('en-GB') : '-',
                  policyEndDate: oldestHospitalPolicy.endDate ? new Date(oldestHospitalPolicy.endDate).toLocaleDateString('en-GB') : '-',
                  holderName: mainDoctor.fullName || mainDoctor.hospitalName || 'N/A',
                  status: oldestHospitalPolicy.status || 'active',
                  type: 'hospital'
                };

                saPolicies.push(hospitalPolicyFormatted);
              }
            }

            // Get the oldest doctor policy
            if (mainDoctor.policies && mainDoctor.policies.length > 0) {
              const doctorPolicies = mainDoctor.policies.filter(p => p.policyType === 'dr');
              if (doctorPolicies.length > 0) {
                const sortedDoctorPolicies = [...doctorPolicies].sort((a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
                );

                if (sortedDoctorPolicies.length > 0) {
                  const oldestDoctorPolicy = sortedDoctorPolicies[0];

                  const doctorPolicyFormatted = {
                    insuranceCoName: oldestDoctorPolicy.insuranceCompanyName || oldestDoctorPolicy.insuranceCoName || 'N/A',
                    policyType: oldestDoctorPolicy.policyTypeName || oldestDoctorPolicy.policyType || 'Doctor Policy',
                    policyNumber: oldestDoctorPolicy.policyNumber || 'N/A',
                    policyCover: `₹${(oldestDoctorPolicy.coverageAmount || 0).toLocaleString('en-IN')}`,
                    policyDuration: calculatePolicyDuration(oldestDoctorPolicy.startDate, oldestDoctorPolicy.endDate, oldestDoctorPolicy.duration || 'Yearly'),
                    policyPremium: oldestDoctorPolicy.premiumAmount ? `₹${oldestDoctorPolicy.premiumAmount}` : 'Included',
                    policyStartDate: oldestDoctorPolicy.startDate ? new Date(oldestDoctorPolicy.startDate).toLocaleDateString('en-GB') : '-',
                    policyEndDate: oldestDoctorPolicy.endDate ? new Date(oldestDoctorPolicy.endDate).toLocaleDateString('en-GB') : '-',
                    holderName: mainDoctor.fullName || 'N/A',
                    status: oldestDoctorPolicy.status || 'active',
                    type: 'main-doctor'
                  };

                  saPolicies.push(doctorPolicyFormatted);
                }
              }
            }
          }
        }

        if (!mainDoctor) throw new Error('Doctor data is missing');

        // 5. Process Payment Data
        const payments = bill.payments || [];
        const totalAmount = bill.totalAmount || 0;
        const paidAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingAmount = totalAmount - paidAmount;

        const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;
        // let paymentMode = 'N/A';
        // if (lastPayment) {
        //   paymentMode = lastPayment.paymentMethod === 'cheque'
        //     ? `Cheque (${lastPayment.referenceNumber || '-'})`
        //     : lastPayment.paymentMethod === 'online'
        //       ? 'Online Transfer'
        //       : 'Cash';
        // } else if (bill.paymentTerms === 'Auto Debit') {
        //   paymentMode = 'By Nach (Auto Debit)';
        // }

let paymentMode = 'N/A';

if (lastPayment) {
  paymentMode = (
    lastPayment.paymentMethod === 'cheque'
      ? `Cheque (${lastPayment.referenceNumber || '-'})`
      : lastPayment.paymentMethod === 'online'
        ? 'Online Transfer'
        : 'Cash'
  ).toUpperCase();
} else if (bill.paymentTerms === 'Auto Debit') {
  paymentMode = 'By Nach (Auto Debit)'.toUpperCase();
}



        // 6. Calculate Membership Period
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

        // 7. Shape Data for Frontend
        let serviceChargeAmount = totalAmount;

        if (bill.membershipType === 'monthly' && bill.items && bill.items.length > 0) {
          const monthlyItem = bill.items.find(item => item.serviceType === 'consultation');
          if (monthlyItem) {
            serviceChargeAmount = monthlyItem.amount || totalAmount;
          }
        }

        // const mapToMember = (d, isPrimary = true) => {
        //   const isHospitalOnly = d.doctorType === 'hospital';
          
        //   return {
        //     fullName: isHospitalOnly ? '-' : d.fullName,
        //     hospitalName: d.hospitalName || 'N/A',
        //     qualification: isHospitalOnly ? '-' : d.qualification || 'N/A',
        //     specialization: isHospitalOnly ? 
        //       (d.hospitalDetails?.hospitalType || 'Hospital Management') : 
        //       (d.specialization?.join(', ') || 'N/A'),
        //     registrationNumber: isHospitalOnly ? 
        //       (d.hospitalDetails?.licenseNumber || d.licenseNumber || 'N/A') : 
        //       (d.licenseNumber || 'N/A'),
        //     registrationYear: isHospitalOnly ? 
        //       (d.hospitalDetails?.establishmentYear || d.registrationYear || 'N/A') : 
        //       (d.registrationYear || 'N/A'),
        //     membershipId: bill.billNumber || d.membershipId || 'N/A',
        //     membershipType:  bill.membershipType.toUpperCase() || 'N/A',
        //     doctorType: d.doctorType ? d.doctorType.toUpperCase() : 'N/A',
        //     membershipPeriod: membershipPeriod,
        //     startDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
        //     endDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
        //     totalServiceCharge: `₹${serviceChargeAmount.toLocaleString('en-IN')}`,
        //     address: d.hospitalAddress?.address || d.contactDetails?.currentAddress?.address || 'N/A',
        //     city: d.hospitalAddress?.city || d.contactDetails?.currentAddress?.city || 'N/A',
        //     state: d.hospitalAddress?.state || d.contactDetails?.currentAddress?.state || 'N/A',
        //     pincode: d.hospitalAddress?.pinCode || d.contactDetails?.currentAddress?.pinCode || 'N/A',
        //     country: 'India',
        //     medicalCouncilNumber: isHospitalOnly ? 
        //       (d.hospitalDetails?.licenseNumber || d.licenseNumber || 'N/A') : 
        //       (d.licenseNumber || 'N/A'),
        //     isPrimary: isPrimary,
        //     isSpouse: !isPrimary,
        //     isHospitalOnly: isHospitalOnly,
        //     hospitalDetails: d.hospitalDetails,
        //     formattedHospitalAddress: d.hospitalName && d.hospitalAddress ?
        //       `${d.hospitalName}, ${d.hospitalAddress.address || 'N/A'}, ${d.hospitalAddress.city || 'N/A'}, ${d.hospitalAddress.state || 'N/A'}, ${d.hospitalAddress.country || 'India'} - ${d.hospitalAddress.pinCode || 'N/A'}` :
        //       d.hospitalName || 'N/A'
        //   };
        // };


const mapToMember = (d, isPrimary = true) => {
  const isHospitalOnly = d.doctorType === 'hospital';
  
  // ✅ FIXED: Check if doctorType is hospital, then use hospitalAddress
  // Otherwise use currentAddress (doctor's personal address)
  const doctorAddress = isHospitalOnly 
    ? d.hospitalAddress?.address || 'N/A'
    : d.contactDetails?.currentAddress?.address || 'N/A';
  
  const doctorCity = isHospitalOnly
    ? d.hospitalAddress?.city || 'N/A'
    : d.contactDetails?.currentAddress?.city || 'N/A';
  
  const doctorState = isHospitalOnly
    ? d.hospitalAddress?.state || 'N/A'
    : d.contactDetails?.currentAddress?.state || 'N/A';
  
  const doctorPincode = isHospitalOnly
    ? d.hospitalAddress?.pinCode || 'N/A'
    : d.contactDetails?.currentAddress?.pinCode || 'N/A';
  
  const doctorCountry = isHospitalOnly
    ? (d.hospitalAddress?.country || 'India').toUpperCase()
    : (d.contactDetails?.currentAddress?.country || 'India').toUpperCase();

  return {
    fullName: isHospitalOnly ? '-' : d.fullName,
    hospitalName: d.hospitalName || 'N/A',
    qualification: isHospitalOnly ? '-' : d.qualification || 'N/A',
    specialization: isHospitalOnly ? 
      (d.hospitalDetails?.hospitalType || 'Hospital Management') : 
      (d.specialization?.join(', ') || 'N/A'),
    registrationNumber: isHospitalOnly ? 
      (d.hospitalDetails?.licenseNumber || d.licenseNumber || 'N/A') : 
      (d.licenseNumber || 'N/A'),
    registrationYear: isHospitalOnly ? 
      (d.hospitalDetails?.establishmentYear || d.registrationYear || 'N/A') : 
      (d.registrationYear || 'N/A'),
    membershipId: bill.billNumber || d.membershipId || 'N/A',
    membershipType: bill.membershipType.toUpperCase() || 'N/A',
    // doctorType: d.doctorType || 'individual' ,
    doctorType: d.doctorType ? d.doctorType.toUpperCase() : 'N/A',
    membershipPeriod: membershipPeriod,
    startDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
    endDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
    totalServiceCharge: `₹${serviceChargeAmount.toLocaleString('en-IN')}`,
    // ✅ FIXED: Address logic based on doctor type
    address: doctorAddress,
    city: doctorCity,
    state: doctorState,
    pincode: doctorPincode,
    country: doctorCountry, // ✅ Always uppercase for India
    medicalCouncilNumber: isHospitalOnly ? 
      (d.hospitalDetails?.licenseNumber || d.licenseNumber || 'N/A') : 
      (d.licenseNumber || 'N/A'),
    isPrimary: isPrimary,
    isSpouse: !isPrimary,
    isHospitalOnly: isHospitalOnly,
    hospitalDetails: d.hospitalDetails,
    formattedHospitalAddress: d.hospitalName && d.hospitalAddress ?
      `${d.hospitalName}, ${d.hospitalAddress.address || 'N/A'}, ${d.hospitalAddress.city || 'N/A'}, ${d.hospitalAddress.state || 'N/A'}, ${(d.hospitalAddress.country || 'India').toUpperCase()}  , , PIN CODE  - ${d.hospitalAddress.pinCode || 'N/A'}` :
      d.hospitalName || 'N/A',
    // ✅ ADDED: Original addresses for reference
    originalHospitalAddress: d.hospitalAddress,
    originalCurrentAddress: d.contactDetails?.currentAddress
  };
};

        const primaryDocData = mapToMember(mainDoctor, true);
        let members = [primaryDocData];

        // Handle hospital_individual cases properly
        if (mainDoctor.doctorType === 'hospital_individual') {
          if (isSpouseCase) {
            console.log('Creating hospital_individual WITH spouse: doctor + spouse + hospital (3 columns)');
            
            if (isLinked && linkedDoctor) {
              const linkedDocData = mapToMember(linkedDoctor, false);
              members.push(linkedDocData);
              console.log('Added linked doctor to members:', linkedDocData.fullName);
            }
            
            const hospitalMemberData = {
              fullName: '-',
              hospitalName: mainDoctor.hospitalName || 'N/A',
              qualification: '-',
              specialization: mainDoctor.hospitalDetails?.hospitalType || 'Hospital Management',
              registrationNumber: mainDoctor.hospitalDetails?.licenseNumber || mainDoctor.licenseNumber || 'N/A',
              registrationYear: mainDoctor.hospitalDetails?.establishmentYear || mainDoctor.registrationYear || 'N/A',
              membershipId: bill.billNumber || mainDoctor.membershipId || 'N/A',
              membershipType: bill.membershipType.toUpperCase() || 'N/A',
              doctorType: 'hospital',
              membershipPeriod: membershipPeriod,
              startDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
              endDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
              totalServiceCharge: `₹${serviceChargeAmount.toLocaleString('en-IN')}`,
              address: mainDoctor.hospitalAddress?.address || mainDoctor.contactDetails?.currentAddress?.address || 'N/A',
              city: mainDoctor.hospitalAddress?.city || mainDoctor.contactDetails?.currentAddress?.city || 'N/A',
              state: mainDoctor.hospitalAddress?.state || mainDoctor.contactDetails?.currentAddress?.state || 'N/A',
              pincode: mainDoctor.hospitalAddress?.pinCode || mainDoctor.contactDetails?.currentAddress?.pinCode || 'N/A',
              country: 'India',
              medicalCouncilNumber: mainDoctor.hospitalDetails?.licenseNumber || mainDoctor.licenseNumber || 'N/A',
              isPrimary: false,
              isSpouse: false,
                isHospitalOnly: true,
              formattedHospitalAddress: mainDoctor.hospitalName && mainDoctor.hospitalAddress ?
                `${mainDoctor.hospitalName}, ${mainDoctor.hospitalAddress.address || 'N/A'}, ${mainDoctor.hospitalAddress.city || 'N/A'}, ${mainDoctor.hospitalAddress.state || 'N/A'}, ${mainDoctor.hospitalAddress.country || 'India'} - ${mainDoctor.hospitalAddress.pinCode || 'N/A'}` :
                mainDoctor.hospitalName || 'N/A'
            };
            
            members.push(hospitalMemberData);
            console.log('Added hospital member for hospital_individual WITH spouse');
          } else {
            console.log('Creating hospital_individual WITHOUT spouse: doctor + hospital (2 columns)');
            
            const hospitalMemberData = {
              fullName: '-',
              hospitalName: mainDoctor.hospitalName || 'N/A',
              qualification: '-',
              specialization: mainDoctor.hospitalDetails?.hospitalType || 'Hospital Management',
              registrationNumber: mainDoctor.hospitalDetails?.licenseNumber || mainDoctor.licenseNumber || 'N/A',
              registrationYear: mainDoctor.hospitalDetails?.establishmentYear || mainDoctor.registrationYear || 'N/A',
              membershipId: bill.billNumber || mainDoctor.membershipId || 'N/A',
              membershipType: bill.membershipType,
              doctorType: 'hospital',
              membershipPeriod: membershipPeriod,
              startDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
              endDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
              totalServiceCharge: `₹${serviceChargeAmount.toLocaleString('en-IN')}`,
              address: mainDoctor.hospitalAddress?.address || mainDoctor.contactDetails?.currentAddress?.address || 'N/A',
              city: mainDoctor.hospitalAddress?.city || mainDoctor.contactDetails?.currentAddress?.city || 'N/A',
              state: mainDoctor.hospitalAddress?.state || mainDoctor.contactDetails?.currentAddress?.state || 'N/A',
              pincode: mainDoctor.hospitalAddress?.pinCode || mainDoctor.contactDetails?.currentAddress?.pinCode || 'N/A',
              country: 'India',
              medicalCouncilNumber: mainDoctor.hospitalDetails?.licenseNumber || mainDoctor.licenseNumber || 'N/A',
              isPrimary: false,
              isSpouse: false,
              formattedHospitalAddress: mainDoctor.hospitalName && mainDoctor.hospitalAddress ?
                `${mainDoctor.hospitalName}, ${mainDoctor.hospitalAddress.address || 'N/A'}, ${mainDoctor.hospitalAddress.city || 'N/A'}, ${mainDoctor.hospitalAddress.state || 'N/A'}, ${mainDoctor.hospitalAddress.country || 'India'} - ${mainDoctor.hospitalAddress.pinCode || 'N/A'}` :
                mainDoctor.hospitalName || 'N/A'
            };
            
            members = [primaryDocData, hospitalMemberData];
          }
        } else if (isLinked && linkedDoctor) {
          const linkedDocData = mapToMember(linkedDoctor, false);
          members.push(linkedDocData);
          console.log('Added linked doctor to members:', linkedDocData.fullName);
        }

        console.log('Total members:', members.length, 'Member types:', members.map(m => ({ 
          name: m.fullName, 
          type: m.doctorType,
          isSpouse: m.isSpouse 
        })));

        // Enhanced SalesBill Object
        // const enhancedBill = {
        //   ...bill,
        //   paymentStats: {
        //     totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
        //     paidAmount: `₹${paidAmount.toLocaleString('en-IN')}`,
        //     pendingAmount: `₹${pendingAmount.toLocaleString('en-IN')}`,
        //     paymentMode: lastPayment ?
        //       (lastPayment.paymentMethod === 'cheque' ? 'Cheque' :
        //        lastPayment.paymentMethod === 'online_transfer' ? 'Online Transfer' :
        //        lastPayment.paymentMethod === 'cash' ? 'Cash' :
        //        lastPayment.paymentMethod) : 'N/A',
        //     paymentDate: lastPayment ? new Date(lastPayment.paymentDate).toLocaleDateString('en-GB') : 'N/A',
        //     chequeNo: lastPayment?.paymentMethod === 'cheque' ? (lastPayment.referenceNumber || '-') : '-',
        //     drawnOn: lastPayment?.paymentMethod === 'cheque' ? (lastPayment.drawnOn || '-') : '-',
        //     amountPaid: lastPayment ? `₹${lastPayment.amount?.toLocaleString('en-IN')}` : 'N/A'
        //   }
        // };
const enhancedBill = {
  ...bill,
  paymentStats: {
    totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
    paidAmount: `₹${paidAmount.toLocaleString('en-IN')}`,
    pendingAmount: `₹${pendingAmount.toLocaleString('en-IN')}`,
    paymentMode: (
      lastPayment
        ? (lastPayment.paymentMethod === 'cheque'
            ? 'Cheque'
            : lastPayment.paymentMethod === 'online_transfer'
              ? 'Online Transfer'
              : lastPayment.paymentMethod === 'cash'
                ? 'Cash'
                : lastPayment.paymentMethod
          )
        : 'N/A'
    ).toUpperCase(),
    paymentDate: lastPayment
      ? new Date(lastPayment.paymentDate).toLocaleDateString('en-GB')
      : 'N/A',
   chequeNo: lastPayment?.paymentMethod === 'cheque'
  ? (lastPayment?.paymentId?.bankDetails?.chequeNumber?.toUpperCase() || '-')
  : '-',
  drawnOn: lastPayment?.paymentMethod === 'cheque'  || 'neft/rtgs' || 'nach'|| 'online'||'other'
  ? (lastPayment?.paymentId?.drawnOnBank?.toUpperCase() || '-')  // ✅ CORRECTED
  : '-',
    amountPaid: lastPayment
      ? `₹${lastPayment.amount?.toLocaleString('en-IN')}`
      : 'N/A'
  }
};



        // ✅ FIXED: Map Policies to standardized format
        const formattedPolicies = saPolicies.map(p => ({
          insuranceCoName: p.insuranceCompany?.companyName || p.insuranceCompanyName || p.insuranceCoName || 'N/A',
          policyType: p.insuranceType?.typeName || p.policyTypeName || p.policyType || 'Professional Indemnity',
          policyNumber: p.policyNumber || 'N/A',
          policyCover: `₹${(p.coverageAmount || p.coverageAmount || 0).toLocaleString('en-IN')}`,
          policyDuration: calculatePolicyDuration(p.startDate, p.endDate, p.premiumFrequency || p.duration || 'Yearly'),
          // policyPremium: p.paidBy === 'by_company' ? 'Paid By Rapid' : (p.paidBy === 'by_hospital' ? `₹${p.premiumAmount}` : (p.premiumAmount ? `₹${p.premiumAmount}` : 'Included')),
          policyPremium: (
  p.paidBy === 'by_company'
    ? 'Paid By Rapid'
    : p.paidBy === 'by_hospital'
      ? `₹${p.premiumAmount}`
      : p.premiumAmount
        ? `₹${p.premiumAmount}`
        : 'Included'
).toUpperCase(),

          policyStartDate: p.startDate ? new Date(p.startDate).toLocaleDateString('en-GB') : '-',
          policyEndDate: p.endDate ? new Date(p.endDate).toLocaleDateString('en-GB') : '-',
          holderName: p.policyHolderName || p.policyHolder?.name || p.policyHolder?.entityId?.fullName || p.policyHolder?.entityId?.hospitalName || p.holderName || 'N/A',
          status: p.status || 'active',
          type: p.type || p.policyType || (p.policyHolder?.type === 'hospital' ? 'hospital' : 'doctor'),
          paidBy: p.paidBy
        }));

        console.log('Formatted policies for display:', formattedPolicies);

        // 8. Extract receipt data for Upcoming Payment Schedule
        let receiptData = null;

        if (payments.length > 0) {
          const sortedPayments = [...payments].sort((a, b) =>
            new Date(b.paymentDate) - new Date(a.paymentDate)
          );

          for (const payment of sortedPayments) {
            if (payment.paymentId &&
                (payment.paymentId.debitType || payment.paymentId.debitDate || payment.paymentId.monthlyPremium)) {
              receiptData = payment.paymentId;
              console.log('Found receipt data:', receiptData);
              break;
            }
          }

          if (!receiptData) {
            for (const payment of payments) {
              if (payment.paymentId) {
                receiptData = payment.paymentId;
                break;
              }
            }
          }
        }

        const getOrdinalDay = (day) => {
          if (day > 31 || day < 1) return 'N/A';
          const suffixes = ['TH', 'ST', 'ND', 'RD'];
          const remainder = day % 100;
          return day + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
        };

        // 9. Process receipt data for Upcoming Payment Schedule
        let upcomingPayments = null;
        if (receiptData) {
          let debitDay = 27;
          if (receiptData.debitDate) {
            try {
              const debitDateObj = new Date(receiptData.debitDate);
              if (!isNaN(debitDateObj.getTime())) {
                debitDay = debitDateObj.getDate();
              }
            } catch (e) {
              console.warn('Invalid debitDate format:', receiptData.debitDate);
            }
          }

          const formattedDebitDate = `${getOrdinalDay(debitDay)} OF EVERY MONTH`;

          let debitTypeDisplay = 'By Nach (Auto Debit)';
          if (receiptData.debitOn) {
            debitTypeDisplay = receiptData.debitOn;
          } else if (receiptData.debitType) {
            debitTypeDisplay = receiptData.debitType.toUpperCase();
          }

          upcomingPayments = {
            paymentFrequency: 'MONTHLY',
            debitType: debitTypeDisplay.toUpperCase(),
            debitDate: formattedDebitDate,
            gst: receiptData.gst ? `${receiptData.gst}%` : 'NA',
            monthlyPremium: receiptData.monthlyPremium ? `₹${receiptData.monthlyPremium}` : 'NA'
          };

          console.log('Upcoming payments data:', upcomingPayments);
        } else {
          upcomingPayments = {
            paymentFrequency: 'Monthly',
            debitType: 'By Nach (Auto Debit)',
            debitDate: '27th of every month',
            gst: 'NA',
            monthlyPremium: 'NA'
          };
        }

        const salesBillWithReceipt = {
          ...enhancedBill,
          upcomingPayments: upcomingPayments
        };

        // Create enhanced doctor object
        const enhancedDoctor = {
          ...primaryDocData,
          hasSpouse: isSpouseCase && !!linkedDoctor,
          spouseInfo: isSpouseCase && linkedDoctor ? {
            fullName: linkedDoctor.fullName,
            medicalCouncilNumber: linkedDoctor.licenseNumber || 'N/A',
            address: linkedDoctor.contactDetails?.currentAddress?.address || linkedDoctor.hospitalAddress?.address || 'N/A',
            city: linkedDoctor.contactDetails?.currentAddress?.city || linkedDoctor.hospitalAddress?.city || 'N/A',
            state: linkedDoctor.contactDetails?.currentAddress?.state || linkedDoctor.hospitalAddress?.state || 'N/A',
            pincode: linkedDoctor.contactDetails?.currentAddress?.pinCode || linkedDoctor.hospitalAddress?.pinCode || 'N/A',
            country: 'India'
          } : null,
          originalDoctor: mainDoctor,
          linkedDoctor: linkedDoctor
        };

        // Final Set
        setData({
          doctor: enhancedDoctor,
          members,
          policies: formattedPolicies,
          salesBill: salesBillWithReceipt,
          loading: false,
          error: null
        });

        console.log('Final data loaded successfully');

      } catch (err) {
        console.error('Error in SA Hook:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || err.message || 'Unknown error occurred'
        }));
      }
    };

    fetchData();
  }, [type, salesBillId]);

  return data;
};

export default useServiceAgreementData;