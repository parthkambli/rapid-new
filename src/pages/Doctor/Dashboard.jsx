

import  React, { useState, useEffect } from 'react';
import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorDashboard = () => {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [queryCases, setQueryCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch user data (which includes doctor info)
        const userResponse = await apiClient.get(apiEndpoints.auth.me);
        if (userResponse.data.success) {
          setUser(userResponse.data.user);

          // First, fetch the complete doctor information to get spouse details and properly populated policies
          const doctorIdToUse = userResponse.data.user.doctorId || userResponse.data.user.doctor?._id;

          // Fetch complete doctor info including spouse details and properly populated policies
          try {
            const doctorResponse = await apiClient.get(apiEndpoints.doctors.getWithSpouse(doctorIdToUse));
            if (doctorResponse.data.success) {
              // The getWithSpouse response contains both mainDoctor and linkedDoctor
              // Use mainDoctor as the primary doctor info
              const responseData = doctorResponse.data.data;
              const mainDoctor = responseData.mainDoctor || responseData;
              const linkedDoctor = responseData.linkedDoctor;

              // Set the main doctor as the primary doctor
              // Add linked doctor info to main doctor object for reference
              const updatedMainDoctor = { ...mainDoctor };
              if (linkedDoctor) {
                updatedMainDoctor.linkedDoctor = linkedDoctor;
              }
              setDoctor(updatedMainDoctor);

              // Combine policies from both main doctor and linked doctor for spouse relationships
              let combinedPolicies = [...(mainDoctor.policies || [])];

              // If there's a linked doctor and they are spouse, add their policies too
              if (linkedDoctor && responseData.relationshipType === 'spouse') {
                combinedPolicies = [...combinedPolicies, ...(linkedDoctor.policies || [])];

                // For hospital policies, if main doctor doesn't have one but linked doctor does,
                // we might want to use the linked doctor's hospital policy
                const mainHospitalPolicy = mainDoctor.policies?.find(p => p.policyType === 'hospital');
                const linkedHospitalPolicy = linkedDoctor.policies?.find(p => p.policyType === 'hospital');

                // If main doctor doesn't have a hospital policy but linked doctor does,
                // we'll handle this in the UI logic later
                if (!mainHospitalPolicy && linkedHospitalPolicy) {
                  // Add a reference to the linked doctor's hospital policy in the main doctor object
                  if (!updatedMainDoctor.mainDoctorPolicy) {
                    updatedMainDoctor.mainDoctorPolicy = {};
                  }
                  updatedMainDoctor.mainDoctorPolicy.hospital = linkedHospitalPolicy;
                }
              }

              setPolicies(combinedPolicies);
            } else {
              // Fallback to basic doctor info if getWithSpouse fails
              const basicDoctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorIdToUse));
              if (basicDoctorResponse.data.success) {
                setDoctor(basicDoctorResponse.data.doctor);
                setPolicies(basicDoctorResponse.data.doctor.policies || []);
              }
            }
          } catch (err) {
            console.warn('Could not fetch doctor with spouse info, using basic info:', err.message);

            // Fallback to basic doctor info if getWithSpouse fails
            if (userResponse.data.user.doctor) {
              setDoctor(userResponse.data.user.doctor);
              setPolicies(userResponse.data.user.doctor.policies || []);
            } else if (userResponse.data.user.doctorId) {
              const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(userResponse.data.user.doctorId));
              if (doctorResponse.data.success) {
                setDoctor(doctorResponse.data.doctor);
                setPolicies(doctorResponse.data.doctor.policies || []);
              }
            }
          }
        } else {
          throw new Error('Failed to fetch user data');
        }

        // Use the new dedicated endpoint that handles linked/spouse doctors automatically
        try {
          const doctorIdToUse = userResponse.data.user.doctorId || userResponse.data.user.doctor?._id;
          const response = await apiClient.get(apiEndpoints.doctors.getQueryCases(doctorIdToUse));
          if (response.data.success) {
            setQueryCases(response.data.data || []);
          } else {
            console.error('Failed to fetch doctor query cases:', response.data.message);

            // Fallback: try to get cases from user response as before
            const cases = userResponse.data.user?.doctor?.queryCases || [];
            setQueryCases(cases);
          }
        } catch (err) {
          console.error('Error fetching doctor query cases:', err.message);

          // Fallback: try to get cases from user response as before
          const cases = userResponse.data.user?.doctor?.queryCases || [];
          setQueryCases(cases);
        }

      } catch (err) {
        setError('Error loading dashboard data: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate dashboard stats based on fetched data - Updated with new UI logic
  const calculateDashboardStats = () => {
    if (!doctor) return {};

    // Handle the new nested structure where policyId contains the full policy object with insuranceCompany
    const getPolicyWithCompany = (policy) => {
      if (!policy) return {};

      // If policy has policyId with nested data, use that
      if (policy.policyId) {
        const nestedInsuranceCompany = policy.policyId?.insuranceCompany;

        return {
          ...policy.policyId,
          policyNumber: policy.policyNumber || policy.policyId?.policyNumber,
          policyType: policy.policyType || policy.policyId?.policyType,
          coverageAmount: policy.coverageAmount || policy.policyId?.coverageAmount || policy.policyId?.coverage_amount,
          startDate: policy.startDate || policy.policyId?.startDate || policy.policyId?.start_date,
          endDate: policy.endDate || policy.policyId?.endDate || policy.policyId?.end_date,
          status: policy.status || policy.policyId?.status,
          insuranceCompany: nestedInsuranceCompany,
          // Extract the insurance company name at the top level for easier access
          insuranceCompanyName: nestedInsuranceCompany?.companyName,
        };
      }

      // For policies without policyId nesting, extract insurance company from the top level
      const topLevelInsuranceCompany = policy.insuranceCompany || policy.insurance_company;

      return {
        ...policy,
        insuranceCompany: topLevelInsuranceCompany,
        insuranceCompanyName: topLevelInsuranceCompany?.companyName || topLevelInsuranceCompany?.company_name,
        policyNumber: policy.policyNumber || policy.policy_number,
        policyType: policy.policyType || policy.policy_type,
        coverageAmount: policy.coverageAmount || policy.coverage_amount,
        startDate: policy.startDate || policy.start_date,
        endDate: policy.endDate || policy.end_date,
        status: policy.status,
      };
    };

    // Find the most recent active doctor and hospital policies from the embedded policies
    const doctorPolicy = policies.find(policy => policy && policy.policyType === 'doctor' && policy.status === 'active') || {};
    const processedDoctorPolicy = getPolicyWithCompany(doctorPolicy);

    // For hospital policy, if this is a linked/spouse doctor, we should use the main doctor's hospital policy
    // This assumes that hospital policies are shared among linked doctors
    let hospitalPolicy = policies.find(policy => policy && policy.policyType === 'hospital' && policy.status === 'active') || {};
    const processedHospitalPolicy = getPolicyWithCompany(hospitalPolicy);

    // If no hospital policy found for this specific doctor, try to get it from the main doctor
    // This handles the case where linked doctors share the same hospital policy
    let finalHospitalPolicy = processedHospitalPolicy;
    if ((!hospitalPolicy || !hospitalPolicy.policyNumber || !processedHospitalPolicy.policyNumber) && doctor.mainDoctorPolicy && doctor.mainDoctorPolicy.hospital) {
      finalHospitalPolicy = getPolicyWithCompany(doctor.mainDoctorPolicy.hospital);
    } else if ((!hospitalPolicy || !hospitalPolicy.policyNumber || !processedHospitalPolicy.policyNumber) &&
               doctor.linkedDoctor && doctor.linkedDoctor.policies) {
      // Check if linked doctor has a hospital policy
      const linkedHospitalPolicy = doctor.linkedDoctor.policies.find(policy => policy && policy.policyType === 'hospital' && policy.status === 'active');
      if (linkedHospitalPolicy) {
        finalHospitalPolicy = getPolicyWithCompany(linkedHospitalPolicy);
      }
    }

    // Calculate days left for policies based on endDate field
    const calculateDaysLeft = (endDate) => {
      if (!endDate) return 0;
      const expiry = new Date(endDate);
      const today = new Date();
      const diffTime = expiry - today;
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    // Calculate membership duration in years
    const calculateDuration = (startDate, endDate) => {
      if (!startDate || !endDate) return 'N/A';
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return `${Math.round(diffYears)} Years`;
    };

    // Calculate completed years based on start date
    const calculateCompletedYears = (startDate) => {
      if (!startDate) return 0;
      const start = new Date(startDate);
      const today = new Date();
      const diffYears = (today - start) / (1000 * 60 * 60 * 24 * 365);
      return Math.floor(diffYears);
    };

    // Robust nextDate extraction preferring root nextDate, then latest followUp
    const getNextDate = (qc) => {
      let nextDateStr = qc.nextDate || qc.next_date;
      if (nextDateStr) {
        return formatDateToDDMMYYYY(nextDateStr);
      }
      if (qc.followUps && qc.followUps.length > 0) {
        const sortedFollowUps = [...qc.followUps].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = sortedFollowUps.find(fu => fu.nextDate || fu.next_date);
        if (latest) {
          return formatDateToDDMMYYYY(latest.nextDate || latest.next_date);
        }
      }
      return '-';
    };

    // Format cases data from API response structure
    const formattedCases = Array.isArray(queryCases) ? queryCases.map(qc => {
      const nextDate = getNextDate(qc);
      return {
        id: qc.caseNo || qc.caseId || qc.case_no || qc.case_id || `CASE-${qc._id?.slice(-3) || 'XXX'}`,
        queryType: qc.queryType || 'Medico-legal',
        caseType: qc.caseType || 'Unknown',
        status: qc.status || 'Pending',
        caseStage: qc.caseStage || 'Pending',
        nextDate: nextDate,
        nextDateRaw: qc.nextDate || (qc.followUps?.[0]?.nextDate) || null, // For sorting
        date: qc.createdAt || qc.created_at ? formatDateToDDMMYYYY(qc.createdAt || qc.created_at) : 'N/A'
      };
    }) : [];

    // Sort upcoming by nextDate ascending (earliest first)
    const sortedUpcoming = formattedCases
      .filter(c => c.nextDate !== '-')
      .sort((a, b) => {
        const dateA = a.nextDateRaw ? new Date(a.nextDateRaw) : new Date(Infinity);
        const dateB = b.nextDateRaw ? new Date(b.nextDateRaw) : new Date(Infinity);
        return dateA - dateB;
      });

    // Get policy cover amount (doctor policy takes priority)
    const policyCoverAmount = processedDoctorPolicy.coverageAmount ||
                             (policies[0]?.coverageAmount) ||
                             0;

    // Format currency with Indian locale
    const formatCurrency = (amount) => {
      return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    const doctorDaysLeft = calculateDaysLeft(processedDoctorPolicy.endDate);
    const hospitalDaysLeft = calculateDaysLeft(finalHospitalPolicy.endDate);

    // Determine the correct end date for the main daysLeft calculation
    // Use sales bill due date if available, otherwise fall back to policy end date
    const mainEndDate = (() => {
      const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                             (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
      if (activeSalesBill && activeSalesBill.billId?.dueDate) {
        return activeSalesBill.billId.dueDate;
      }
      return processedDoctorPolicy.endDate;
    })();

    const mainDaysLeft = calculateDaysLeft(mainEndDate); // Use the determined end date

    // Format doctor type to show "Individual + Hospital" when doctorType is "hospital_individual"
    const formatDoctorType = (type) => {
      if (type === 'hospital_individual') {
        return 'Individual + Hospital';
      }
      return type || 'Individual';
    };

    return {
      doctorName: doctor.fullName || doctor.full_name || doctor.name || 'Dr. Unknown',
      membershipType: formatDoctorType(doctor.doctorType || doctor.doctor_type),
      policyCover: formatCurrency(policyCoverAmount),
      policyCompany: processedDoctorPolicy.insuranceCompany?.companyName || processedDoctorPolicy.insuranceCompanyName ||
                    // If no company info in doctor policy, try to get from any policy in the policies array
                    (policies.length > 0 ? (() => {
                      // Look for any policy with insurance company info
                      for (const policy of policies) {
                        const processedPolicy = getPolicyWithCompany(policy);
                        if (processedPolicy.insuranceCompany?.companyName || processedPolicy.insuranceCompanyName) {
                          return processedPolicy.insuranceCompany?.companyName || processedPolicy.insuranceCompanyName;
                        }
                      }
                      return 'N/A';
                    })() : 'N/A'),
      daysLeft: mainDaysLeft, // Use the mainDaysLeft which considers sales bill due date
      isMonthlyMembership: (() => {
        // Check if the active sales bill has membershipType as 'monthly'
        const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                               (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
        return activeSalesBill && activeSalesBill.billId?.membershipType === 'monthly';
      })(),
      membershipOverview: {
        type: formatDoctorType(doctor.doctorType || doctor.doctor_type),
        // Find the most recent active sales bill for membership details
        duration: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          if (activeSalesBill && activeSalesBill.billId?.billDate && activeSalesBill.billId?.dueDate) {
            const start = new Date(activeSalesBill.billId.billDate);
            const end = new Date(activeSalesBill.billId.dueDate);
            const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
            return `${Math.round(diffYears)} Years`;
          }
          return 'N/A';
        })(),
        startDate: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          return activeSalesBill && activeSalesBill.billId?.billDate ? formatDateToDDMMYYYY(activeSalesBill.billId.billDate) : 'N/A';
        })(),
        endDate: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          return activeSalesBill && activeSalesBill.billId?.dueDate ? formatDateToDDMMYYYY(activeSalesBill.billId.dueDate) : 'N/A';
        })(),
        totalAmount: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          if (activeSalesBill) {
            // Check if membership type is monthly and get the monthly amount from items
            if (activeSalesBill.billId?.membershipType === 'monthly' && activeSalesBill.billId?.items && activeSalesBill.billId.items.length > 0) {
              // Get the first item's amount as the monthly amount
              const monthlyAmount = activeSalesBill.billId.items[0]?.amount || activeSalesBill.billId.items[0]?.unitPrice || 0;
              return formatCurrency(monthlyAmount);
            }
            return formatCurrency(activeSalesBill.billId?.totalAmount || activeSalesBill.billId?.total_amount || 0);
          }
          return 'N/A';
        })(),
        completedYears: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          if (activeSalesBill && activeSalesBill.billId?.billDate && activeSalesBill.billId?.dueDate) {
            const start = new Date(activeSalesBill.billId.billDate);
            const end = new Date(activeSalesBill.billId.dueDate);
            const today = new Date();

            // If today is before start date, return 0
            if (today < start) return 0;

            // Calculate the difference in years from start to today, but cap at the total duration
            const totalDurationYears = end.getFullYear() - start.getFullYear();
            const elapsedYears = today.getFullYear() - start.getFullYear();

            // Adjust for months
            const monthDiff = today.getMonth() - start.getMonth();
            const adjustedElapsedYears = monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())
              ? elapsedYears - 1
              : elapsedYears;

            // Return the minimum of elapsed years and total duration years
            return Math.min(adjustedElapsedYears, totalDurationYears);
          }
          return 0;
        })(),
        paymentMode: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          // Look for payment method in the sales bill's payments array
          if (activeSalesBill && activeSalesBill.billId?.payments && activeSalesBill.billId.payments.length > 0) {
            return activeSalesBill.billId.payments[0].paymentMethod || 'N/A';
          } else if (activeSalesBill && activeSalesBill.paymentMethod) {
            return activeSalesBill.paymentMethod;
          }
          return 'N/A';
        })(),
        status: (() => {
          const activeSalesBill = doctor.salesBills?.find(bill => bill.status === 'pending' || bill.status === 'paid') ||
                                 (doctor.salesBills && doctor.salesBills.length > 0 ? doctor.salesBills[0] : null);
          return activeSalesBill ? (activeSalesBill.status || 'Active') : (doctor.status === 'accepted' ? 'Active' : 'Inactive');
        })(),
      },
      cases: {
        open: formattedCases.filter(c => ['Open', 'open', 'Query Raised'].includes(c.status)),
        pending: formattedCases.filter(c => ['Pending', 'pending'].includes(c.status)),
        closed: formattedCases.filter(c => ['Closed', 'closed'].includes(c.status)), // Added closed filter
        upcoming: sortedUpcoming,
        all: formattedCases
      },
      doctorPolicy: {
        policyNo: processedDoctorPolicy.policyNumber || processedDoctorPolicy.policy_number || 'N/A',
        company: processedDoctorPolicy.insuranceCompany?.companyName || processedDoctorPolicy.company || 'N/A',
        cover: formatCurrency(processedDoctorPolicy.coverageAmount || 0),
        type: 'Doctor Professional Indemnity',
        daysLeft: doctorDaysLeft,
      },
      hospitalPolicy: {
        policyNo: finalHospitalPolicy.policyNumber || finalHospitalPolicy.policy_number || 'N/A',
        company: finalHospitalPolicy.insuranceCompany?.companyName || finalHospitalPolicy.company || 'N/A',
        cover: formatCurrency(finalHospitalPolicy.coverageAmount || 0),
        type: 'Hospital Errors & Omission Policy',
        daysLeft: hospitalDaysLeft,
      },
    };
  };

  const data = calculateDashboardStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">{error}</div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-800">Doctor Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Membership snapshot · Policy cover · Cases & next dates
          </p>
        </div>
        <p className="text-lg md:text-xl font-semibold text-teal-800">{data.doctorName}</p>
      </header>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Membership Type</p>
          <p className="text-xl font-bold text-teal-800 mt-1">{data.membershipType}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
            Active
          </span>
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Policy Cover</p>
          <p className="text-xl font-bold text-teal-800 mt-1">{data.policyCover}</p>
          <p className="text-sm text-gray-600 mt-2">{data.policyCompany}</p>
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Days Left</p>
          <p className="text-xl font-bold text-teal-800 mt-1">{data.daysLeft}</p>
          <div className="w-full bg-teal-100 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (data.daysLeft / 365) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Membership Overview + Cases side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
        {/* Left – Membership Overview */}
        <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-teal-800 mb-5">Membership Overview</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {[
              { label: 'MEMBERSHIP TYPE', value: data.membershipOverview.type },
              // Only show DURATION if membership type is not monthly
              // Check the active sales bill's membership type to determine if it's monthly
              (data.isMonthlyMembership ? null : { label: 'DURATION', value: data.membershipOverview.duration }),
              { label: 'START DATE', value: data.membershipOverview.startDate },
              // Only show END DATE if membership type is not monthly
              (data.isMonthlyMembership ? null : { label: 'END DATE', value: data.membershipOverview.endDate }),
              { label: 'TOTAL AMOUNT', value: data.membershipOverview.totalAmount },
              { label: 'COMPLETED YEARS', value: data.membershipOverview.completedYears },
              { label: 'PAYMENT MODE', value: data.membershipOverview.paymentMode },
              {
                label: 'STATUS',
                value: (
                  <span className={`px-3 py-1 ${data.membershipOverview.status === 'Active' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'} font-medium rounded-full text-sm`}>
                    {data.membershipOverview.status}
                  </span>
                ),
              },
            ]
            .filter(item => item) // Remove falsy values (when conditions are false)
            .map((item, i) => (
              <div key={i}>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className="mt-1 font-medium text-base md:text-lg text-teal-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Cases & Upcoming */}
        <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <h2 className="text-xl font-bold text-teal-800">Cases & Upcoming</h2>
            <div className="text-sm px-3 py-1 bg-teal-50 text-teal-700 rounded-full">
              Open {data.cases.open.length} · Pending {data.cases.pending.length} · Closed {data.cases.closed.length}
            </div>
          </div>

          {/* Case list - Show all cases (open, pending) that have next dates */}
          <div className="space-y-4 mb-6">
            {data.cases.upcoming.length > 0 ? (
              data.cases.upcoming.map((c, i) => (
                <div key={i} className="flex justify-between items-start border-b border-teal-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-base text-teal-800">{c.id}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{c.caseType} - {c.caseStage}</p>
                  </div>
                  <p className="text-sm text-gray-600">Next: {c.nextDate}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming cases found</p>
            )}
          </div>

          {/* Next Important Dates */}
          <div>
            <p className="font-semibold text-base mb-3">Next Important Dates</p>
            <div className="space-y-2">
              {data.cases.all && data.cases.all.length > 0
                ? data.cases.all
                    .filter(c => c.nextDate && c.nextDate !== '-') // Only cases with next dates
                    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate)) // Sort by next date ascending
                    .map((c, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-teal-800">{c.id} – {c.type}</span>
                        <span className="text-gray-600">{c.nextDate}</span>
                      </div>
                    ))
                : <p className="text-gray-500 text-sm">No upcoming dates</p>
              }
              {(!data.cases.all || data.cases.all.length === 0) && (
                <p className="text-gray-500 text-sm">No upcoming dates</p>
              )}
            </div>
            <a href="/doctor/cases" className="mt-4 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition inline-block">
              Open Cases
            </a>
          </div>
        </div>
      </div>

      {/* Doctor Policy Details - Show only if doctor has doctor policy */}
      {(doctor?.doctorType === 'individual' || doctor?.doctorType === 'hospital_individual') && (
        <div className="mb-8 md:mb-10">
          <h2 className="text-xl font-bold text-teal-800 mb-5">Doctor Policy Details</h2>
          <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 uppercase">POLICY NO</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.doctorPolicy.policyNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">COMPANY</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.doctorPolicy.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">COVER</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.doctorPolicy.cover}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">INSURANCE TYPE</p>
              <p className="mt-1 font-medium text-lg text-teal-800 break-words">{data.doctorPolicy.type}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 uppercase">DAYS LEFT</p>
              <div className="flex items-center gap-4 mt-1">
                <p className="font-medium text-lg text-teal-800">{data.doctorPolicy.daysLeft}</p>
                <div className="flex-1 bg-teal-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (data.doctorPolicy.daysLeft / 365) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Policy Details - Show only if doctor has hospital policy */}
      {(doctor?.doctorType === 'hospital' || doctor?.doctorType === 'hospital_individual') && (
        <div>
          <h2 className="text-xl font-bold text-teal-800 mb-5">Hospital Policy Details</h2>
          <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 uppercase">POLICY NO</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.hospitalPolicy.policyNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">COMPANY</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.hospitalPolicy.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">COVER</p>
              <p className="mt-1 font-medium text-lg text-teal-800">{data.hospitalPolicy.cover}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">INSURANCE TYPE</p>
              <p className="mt-1 font-medium text-lg text-teal-800 break-words">{data.hospitalPolicy.type}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 uppercase">DAYS LEFT</p>
              <div className="flex items-center gap-4 mt-1">
                <p className="font-medium text-lg text-teal-800">{data.hospitalPolicy.daysLeft}</p>
                <div className="flex-1 bg-teal-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (data.hospitalPolicy.daysLeft / 365) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

