// utils/quotationDataMapper.js
export const mapQuotationData = (doctorData, quotationData, membershipType) => {
  // Extract doctor info
  const doctorInfo = {
    doctor_name: doctorData?.fullName || "Dr. Name Not Available",
    hospital_name: doctorData?.hospitalName || "Hospital Name Not Available",
    address: doctorData?.hospitalAddress?.address 
      ? `${doctorData.hospitalAddress.address}, ${doctorData.hospitalAddress.city}, ${doctorData.hospitalAddress.state} - ${doctorData.hospitalAddress.pinCode}`
      : "Address Not Available",
    specialization: doctorData?.specialization?.join(", ") || doctorData?.hospitalDetails?.hospitalType || "General",
    membership_type: getMembershipType(membershipType),
    number_of_beds: doctorData?.hospitalDetails?.beds?.toString() || "N/A",
    quotation_date: formatDate(quotationData?.createdAt),
    valid_till: formatDate(quotationData?.expiryDate),
    area: "All India",
    qr_code_image: "",
    note: quotationData?.requestDetails?.additionalRequirements || "",
    trno: quotationData?.trno || "",
    quotation_number: quotationData?.quotationNumber || "",
    
    // Pricing data from API
    pricing_items: quotationData?.requestDetails?.items || [],
    policy_years: quotationData?.requestDetails?.policyTerms || [],
    payment_frequency: quotationData?.requestDetails?.paymentFrequency || "yearly",
    indemnity_cover: quotationData?.requestDetails?.specialConditions || "Standard"
  };

  return doctorInfo;
};

const getMembershipType = (type) => {
  switch(type?.toLowerCase()) {
    case 'hospital':
      return "HOSPITAL MEMBERSHIP";
    case 'individual':
      return "INDIVIDUAL DOCTOR MEMBERSHIP";
    case 'hospital_individual':
    case 'combined':
      return "COMBINED HOSPITAL + INDIVIDUAL";
    default:
      return "HOSPITAL MEMBERSHIP";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "13.12.2025";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Helper to get column headers based on policy years
export const getYearColumns = (policyYears) => {
  if (!policyYears || policyYears.length === 0) return ['1 Year', '5 Year'];
  
  return policyYears.map(year => `${year} Year`);
};

// Helper to get price for specific year
export const getPriceForYear = (item, year) => {
  return item[`year_${year}`] || item[`y${year}`] || "";
};