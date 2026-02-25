import axios from "axios";

// API Base URL - change this for different environments
const API_BASE_URL = import.meta.env.VITE_API_URI || 'https://rapid-apis.onrender.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Dispatch logout event to notify the app
      window.dispatchEvent(new Event('tokenExpired'));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// API endpoints
export const apiEndpoints = {
  // Authentication
  auth: {
    login: "/users/login",
    forgotPassword: "/users/forgot-password",
    resetPassword: "/users/reset-password",
    changePassword: "/users/change-password",
    seedAdmin: "/users/seed-admin",
    me: "/users/me",
    permissions: "/users/permissions",
  },

  // Users
  users: {
    list: "/users",
    create: "/users",
    get: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    toggleStatus: (id) => `/users/${id}/toggle-status`,
    updateStatus: (id) => `/users/${id}/status`,
    permissions: (id) => `/users/${id}/permissions`,
    panelPermissions: "/users/panel-permissions", // Comprehensive panel permissions
    forms: "/users/forms",
    search: "/users/search",
    byEmployee: (employeeId) => `/users/by-employee/${employeeId}`,
    additionalPanels: (id) => `/users/${id}/additional-panels`,
  },

  // Employees
  employees: {
    list: '/employees',
    listdropdown: '/employees/dropdown',
    create: '/employees',
    get: (id) => `/employees/${id}`,
    update: (id) => `/employees/${id}`,
    delete: (id) => `/employees/${id}`,
    byRole: (role) => `/employees/role/${role}`,
    search: "/employees/search",
    profile: "/employees/profile",
  },
  //   // Salesman Targets
  //   salesmanTargets: {
  //   byEmployee: (id) => `/salesman-targets/employee/${id}`,  // id = Employee _id
  //   stats: '/salesman-targets/stats',
  //   create: '/salesman-targets',
  //   update: (id) => `/salesman-targets/${id}`
  // },

  salesmanTargets: {
    // Get all targets for employee (with year/month filtering)
    byEmployee: (id) => `/salesman-targets/employee/${id}`,

    // Get today's target with full statistics
    getToday: (employeeId) => `/salesman-targets/today/${employeeId}`,

    // Get complete stats for frontend table
    stats: "/salesman-targets/stats",

    // Create/Update target (single endpoint for both)
    createUpdate: "/salesman-targets",

    // Reset daily stats (admin)
    resetDaily: (employeeId) => `/salesman-targets/reset-daily/${employeeId}`,
    // NEW - ALL EMPLOYEES APIs (Main jo hum use karenge)
    // allCurrentTargets: '/salesman-targets/employee-all/current',   // ← Yeh sabse powerful
    allCurrentTargets: "/salesman-targets/all-current", // ← Yeh sabse powerful
    allStats: "/salesman-targets/stats-all",
    // YE 2 NAYE ADD KAR DE
    addTask: "/salesman-targets/add-task", // POST - Add task with images
    getTasks: (employeeId) => `/salesman-targets/tasks/${employeeId}`,
  },

  // Locations (for city, district, taluka, state dropdowns)
  locations: {
    list: "/locations",
    getByType: (type) => `/locations/type/${type}`,
    create: "/locations",
    search: "/locations/search",
  },

  // Doctors
  doctors: {
    list: "/doctors",
    forpolicy: "/doctors/for-policy-add",
    foreceipt: "/doctors/for-receipt",
    create: "/doctors",

    getCloseDoctorIdsOnly: "/doctors/close-only-ids",

    doctorAddedbySalesman: (id) => `/doctors/salesman-added-full/${id}`,
    get: (id) => `/doctors/${id}`,
    getWithSpouse: (id) => `/doctors/${id}/with-spouse`,
    getQueryCases: (id) => `/doctors/${id}/query-cases`,
    update: (id) => `/doctors/${id}`,
    updatesalesman: (id) => `/doctors/salesman/${id}`,
    patchUpdate: (id) => `/doctors/${id}`,
    transferdrtoTele: (id) => `/doctors/transfer-doctor/${id}`,
    delete: (id) => `/doctors/${id}`,
    accept: (id) => `/doctors/${id}/accept`,
    reject: (id) => `/doctors/${id}/reject`,
    transfer: (id) => `/doctors/${id}/transfer`,
    followup: (id) => `/doctors/${id}/followup`,
    search: "/doctors/search",
    byStatus: (status) => `/doctors/status/${status}`,
    pending: '/doctors/pending',
    myDoctors: '/doctors/my-doctors',
    myDoctorss: '/doctors/my-doctorsss',
    allAccepted: '/doctors/all-accepted',
    dropdown: '/doctors/dropdown',
    uploadDocuments: '/doctors/upload-documents',
    dobReport: '/doctors/dob-report',
    // Follow-up related endpoints
    followUps: {
      all: '/doctors/followups/all',
      my: '/doctors/followups/my',
      today: '/doctors/followups/today', 
    },
  },

  // Policies
  policies: {
    list: "/policies",
    create: "/policies",
    get: (id) => `/policies/${id}`,
    update: (id) => `/policies/${id}`,
    updateWithDocuments: (id) => `/policies/${id}`, // Same endpoint, but with file upload
    delete: (id) => `/policies/${id}`,
    byNumber: (policyNumber) => `/policies/number/${policyNumber}`,
    renew: (id) => `/policies/${id}/renew`,
    renewWithDocuments: (id) => `/policies/${id}/renew`, // Same endpoint, but with file upload
    expiring: "/policies/expiring",
    search: "/policies/search",
    history: (policyNo) => `/policies/history/${policyNo}`,
  },

  // Quotations
  quotations: {
    list: "/quotations",
    create: "/quotations",
    get: (id) => `/quotations/${id}`,
    update: (id) => `/quotations/${id}`,
    delete: (id) => `/quotations/${id}`,
    byNumber: (quotationNumber) => `/quotations/number/${quotationNumber}`,
    response: (id) => `/quotations/${id}/response`,
    acceptResponse: (id) => `/quotations/${id}/accept-response`,
    followup: (id) => `/quotations/${id}/followup`,
    search: "/quotations/search",
    byStatus: (status) => `/quotations/status/${status}`,
    myQuotations: '/quotations/my-quotations',
    getLatestForDoctor: (doctorId) => `/quotations/doctor/${doctorId}/latest`,
    getByDoctorId: (doctorId) => `/quotations/doctor/${doctorId}`
  },

  // Sales Bills
  salesBills: {
    list: "/sales-bills",
    create: "/sales-bills",

    getRenewalCallsDoctors: "/sales-bills/renewal-doctors",

    get: (id) => `/sales-bills/${id}`,
    getRenewalExpiry: (id) => `/sales-bills/${id}/renewal-info`,
    // apiEndpoints.js mein yeh line fix karo
    getDoctorByBillNumber: (billNumber) => `/sales-bills/billno/${billNumber}`, // Fixed: // → /
    getServiceAgreementPolicies: (salesBillId) =>
      `/sales-bills/${salesBillId}/service-agreement-policies`,
    update: (id) => `/sales-bills/${id}`,
    delete: (id) => `/sales-bills/${id}`,
    byNumber: (billNumber) => `/sales-bills/number/${billNumber}`,
    approve: (id) => `/sales-bills/${id}/approve`,
    payment: (id) => `/sales-bills/${id}/payment`,
    overdue: "/sales-bills/overdue",
    dueSoon: "/sales-bills/due-soon",
    search: "/sales-bills/search",
    byStatus: (status) => `/sales-bills/status/${status}`,
  },

  // Receipts
  receipts: {
    list: "/receipts",
    create: "/receipts",
    get: (id) => `/receipts/${id}`,
    getprintyear: (id) => `/receipts/print/${id}`,
    getprintmonth: (id) => `/receipts/print/month/${id}`,
    update: (id) => `/receipts/${id}`,
    delete: (id) => `/receipts/${id}`,
    byNumber: (receiptNumber) => `/receipts/number/${receiptNumber}`,
    billDetails: (billNumber) => `/receipts/bill-details/${billNumber}`,
    clear: (id) => `/receipts/${id}/clear`,
    bounce: (id) => `/receipts/${id}/bounce`,
    summary: "/receipts/summary/payment",
    byPaymentMethod: (method) => `/receipts/payment-method/${method}`,
    byStatus: (status) => `/receipts/status/${status}`,
    search: "/receipts/search",
  },

  // Advocates
  advocates: {
    list: "/advocates",
    listdropdown: "/advocates/dropdown",
    create: "/advocates",
    get: (id) => `/advocates/${id}`,
    update: (id) => `/advocates/${id}`,
    delete: (id) => `/advocates/${id}`,
    byBarCouncil: (barCouncilNumber) =>
      `/advocates/bar-council/${barCouncilNumber}`,
    case: (id) => `/advocates/${id}/case`,
    updateCase: (id, caseId) => `/advocates/${id}/case/${caseId}/status`,
    bySpecialization: (specialization) =>
      `/advocates/specialization/${specialization}`,
    topRated: "/advocates/top-rated",
    stats: "/advocates/stats",
    search: "/advocates/search",
    dashboard: "/advocates/dashboard",
    profile: "/advocates/profile",
  },

  // Experts
  experts: {
    list: "/experts",
    byRole: "/employees/roles/expert", // Alternative endpoint with broader permissions
    create: "/experts",
    get: (id) => `/experts/${id}`,
    update: (id) => `/experts/${id}`,
    delete: (id) => `/experts/${id}`,
    case: (id) => `/experts/${id}/case`,
    updateCase: (id, caseId) => `/experts/${id}/case/${caseId}/status`,
    byExpertise: (expertise) => `/experts/expertise/${expertise}`,
    topRated: "/experts/top-rated",
    stats: "/experts/stats",
    search: "/experts/search",
    dashboard: "/experts/dashboard",
    profile: "/experts/profile",
  },

  // Expert Bills
  expertBills: {
    list: "/expert-bills",
    create: "/expert-bills",
    get: (id) => `/expert-bills/${id}`,
    update: (id) => `/expert-bills/${id}`,
    delete: (id) => `/expert-bills/${id}`,
  },

  // Advocate Bills
  advocateBills: {
    list: "/advocate-bills",
    create: "/advocate-bills",
    get: (id) => `/advocate-bills/${id}`,
    update: (id) => `/advocate-bills/${id}`,
    delete: (id) => `/advocate-bills/${id}`,
  },

  // Expenses
  expenses: {
    list: "/expenses",
    create: "/expenses",
    get: (id) => `/expenses/${id}`,
    update: (id) => `/expenses/${id}`,
    delete: (id) => `/expenses/${id}`,
    search: "/expenses/search",
    stats: "/expenses/stats",
    byCategory: (category) => `/expenses/category/${category}`,
    dropdown: {
      advocates: "/expenses/dropdown/advocates",
      experts: "/expenses/dropdown/experts",
    },
    cases: {
      advocate: (advocateId) => `/expenses/advocate/${advocateId}/cases`,
      expert: (expertId) => `/expenses/expert/${expertId}/cases`,
    },
  },

  // Reports
  reports: {
    dashboard: "/reports/dashboard",
    doctors: "/reports/doctors",
    doctorstelecaller: "/reports/doctors-telecaller",
    employees: "/reports/employees",
    policies: "/reports/policies",
    quotations: "/reports/quotations",
    financial: "/reports/financial",
    advocates: "/reports/advocates",
    advocateSpecific: "/reports/advocates/my-reports",
    experts: "/reports/experts",
    expertSpecific: "/reports/experts/my-reports",
    cases: "/reports/cases",
    doctorDob: "/reports/doctors/dob",
    accountStatement: "/reports/account-statement",
    master: "/reports/master",
    salesBills: "/reports/sales-bills",
    receipts: "/reports/receipts",
    attendance: "/reports/attendance",
    salaries: "/reports/salaries",
    targets: "/reports/targets",
    tasks: "/reports/tasks",
    dobReport: "/doctors/dob-report",
  },

  // Insurance Companies
  insuranceCompanies: {
    list: "/insurance-companies/simple",
    create: "/insurance-companies/simple",
    get: (id) => `/insurance-companies/${id}`,
    update: (id) => `/insurance-companies/simple/${id}`,
    delete: (id) => `/insurance-companies/${id}`,
    search: "/insurance-companies/search",
  },

  // Insurance Types
  insuranceTypes: {
    list: "/insurance-types/simple",
    create: "/insurance-types/simple",
    get: (id) => `/insurance-types/${id}`,
    update: (id) => `/insurance-types/simple/${id}`,
    delete: (id) => `/insurance-types/${id}`,
    search: "/insurance-types/search",
  },

  // Attendance
  attendance: {
    list: "/attendance",
    create: "/attendance",
    get: (id) => `/attendance/${id}`,
    update: (id) => `/attendance/${id}`,
    delete: (id) => `/attendance/${id}`,
    byEmployee: (employeeId) => `/attendance/employee/${employeeId}`,
    byEmployeeAllDates: (employeeId) => `/attendance/employee/${employeeId}/all-dates`,
    search: '/attendance/search',
    stats: '/attendance/stats',
  },

  // Salary Management
  salaries: {
    list: "/salaries",
    create: "/salaries",
    get: (id) => `/salaries/${id}`,
    update: (id) => `/salaries/${id}`,
    delete: (id) => `/salaries/${id}`,
    search: "/salaries/search",
    stats: "/salaries/stats",
    employeeHistory: (employeeId) => `/salaries/employee/${employeeId}/history`,
  },

  // Alerts and Notifications
  alerts: {
    list: "/alerts",
    myAlerts: "/alerts/my-alerts",
    get: (id) => `/alerts/${id}`,
    create: "/alerts",
    update: (id) => `/alerts/${id}`,
    delete: (id) => `/alerts/${id}`,
    updateStatus: (id) => `/alerts/${id}/status`,
    acknowledge: (id) => `/alerts/${id}/acknowledge`,
    complete: (id) => `/alerts/${id}/complete`,
    dismiss: (id) => `/alerts/${id}/dismiss`,
    unreadCount: "/alerts/unread-count",
    markAllAsRead: "/alerts/mark-all-read",
    preferences: "/alerts/preferences",
    updatePreferences: "/alerts/preferences",
    notifications: "/alerts/notifications",
    markNotificationAsRead: (id) => `/alerts/notifications/${id}/read`,
    markAllNotificationsAsRead: "/alerts/notifications/mark-all-read",
    unreadNotificationCount: "/alerts/notifications/unread-count",
  },

  // Service Packages
  servicePackages: {
    list: "/service-packages/list", // Formatted list for frontend components
    createForm: "/service-packages/create-form", // For CreateService form
    simpleList: "/service-packages/simple", // Simple list for dropdowns
    all: "/service-packages", // All packages with pagination
    get: (id) => `/service-packages/${id}`,
    update: (id) => `/service-packages/update-form/${id}`,
    delete: (id) => `/service-packages/${id}`,
    search: "/service-packages/search",
    simpleCreate: "/service-packages/simple",
    simpleUpdate: (id) => `/service-packages/simple/${id}`,
  },

  // Salesman Analytics
  salesmanAnalytics: {
    dashboard: (salesmanId) => `/salesman-analytics/dashboard/${salesmanId}`,
    teamComparison: "/salesman-analytics/team-comparison",
    doctorStatus: (salesmanId) =>
      `/salesman-analytics/doctor-status/${salesmanId}`,
  },

  // Query Cases
  queryCases: {
    list: "/query-cases/list",
    all: "/query-cases",
    create: "/query-cases",
    get: (id) => `/query-cases/${id}`,
    update: (id) => `/query-cases/${id}`,
    delete: (id) => `/query-cases/${id}`,
    stats: "/query-cases/stats",
    addFollowUp: (id) => `/query-cases/${id}/follow-up`,
    assignExpert: (id) => `/query-cases/${id}/assign-expert`,
    assignAdvocate: (id) => `/query-cases/${id}/assign-advocate`,
  },

  // Targets & Tasks
  targets: {
    list: "/targets",
    create: "/targets",
    get: (id) => `/targets/${id}`,
    update: (id) => `/targets/${id}`,
    delete: (id) => `/targets/${id}`,
    byEmployee: (employeeId) => `/targets/employee/${employeeId}`,
    stats: "/targets/stats",
    search: "/targets/search",
  },

  tasks: {
    list: "/tasks",
    create: "/tasks",
    target: "/tasks/target",
    getCallingList: "/tasks/telecallertask",
    getOtherTask: "/tasks/assigned-list",
    get: (id) => `/tasks/${id}`,
    update: (id) => `/tasks/${id}`,
    editTelecallerTask: (taskId) => `/tasks/${taskId}/edit-telecaller`,
    delete: (id) => `/tasks/${id}`,
    byEmployee: (employeeId) => `/tasks/employee/${employeeId}`,
    stats: '/tasks/stats',
    pending: '/tasks/pending',
    search: '/tasks/search',
    telecallerStats: '/tasks/telecaller-stats',
    weeklyCallsReport: '/tasks/weekly-calls-report',
  },

  // Salesman specific endpoints
  salesman: {
    dashboard: "/salesman/dashboard",
    targets: "/salesman/targets",
    tasks: "/salesman/tasks",
    performance: "/salesman/performance",
    addDoctor: "/salesman/add-doctor",
    doctors: "/salesman/doctors",
    transferDoctor: "/salesman/transfer-doctor",
  },

  // Salesman Tasks endpoints
  salesmanTasks: {
    getTasks: (salesmanId) => `/salesman-targets/tasks/${salesmanId}`,
    getAllTasks: (salesmanId) => `/salesman-targets/all-tasks/${salesmanId}`,
    editTask: (taskId) => `/salesman-targets/tasks/${taskId}`,
    updateStatus: (taskId) => `/salesman-targets/tasks/${taskId}/status`,
    addTask: "/salesman-targets/add-task",
    dashboardStats: "/salesman/dashboard/stats",
  },

  // Salesman Tasks API service functions
  getSalesmanTasks: (salesmanId) =>
    apiClient.get(`/salesman-targets/tasks/${salesmanId}`),
  getAllSalesmanTasks: (salesmanId) =>
    apiClient.get(`/salesman-targets/all-tasks/${salesmanId}`),
  editTask: (taskId, taskData) =>
    apiClient.put(`/salesman-targets/tasks/${taskId}`, taskData),
  editTaskWithFormData: (taskId, formData) =>
    apiClient.put(`/salesman-targets/tasks/${taskId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateTaskStatus: (taskId, status) =>
    apiClient.put(`/salesman-targets/tasks/${taskId}/status`, { status }),
  getDashboardStats: (employeeId) =>
    apiClient.get("/salesman/dashboard/stats", {
      params: { employeeId },
    }),
  addTask: (employeeId, taskData) =>
    apiClient.post("/salesman-targets/add-task", taskData),
  getAllCurrentTargets: (params) =>
    apiClient.get("/salesman-targets/all-current", { params }),

  // Salesman Dashboard (New)
  salesmanDashboard: {
    stats: "/salesman/dashboard/stats",
    doctors: "/salesman/dashboard/doctors",
    target: "/salesman/dashboard/target",
    weeklyPerformance: "/salesman/dashboard/weekly-performance",
  },

  // Renewal Alerts
  renewalAlerts: {
    list: "/renewal-alerts",
    get: (id) => `/renewal-alerts/${id}`,
    create: "/renewal-alerts",
    update: (id) => `/renewal-alerts/${id}`,
    delete: (id) => `/renewal-alerts/${id}`,
    serviceRenewals: "/renewal-alerts/service-renewals", // This is the endpoint for service renewal alerts
    indemnityRenewals: "/renewal-alerts/indemnity-renewals", // This is the endpoint for indemnity renewal alerts
    createServiceRenewal: "/renewal-alerts/service-renewals",
    createIndemnityRenewal: "/renewal-alerts/indemnity-renewals",
    search: "/renewal-alerts/search",
    upcoming: "/renewal-alerts/upcoming",
    stats: "/renewal-alerts/stats",
  },

  // Receipt Bank Details
  recBankDetails: {
    list: "/receipt-bank-details",
    create: "/receipt-bank-details",
    get: (id) => `/receipt-bank-details/${id}`,
    update: (id) => `/receipt-bank-details/${id}`,
    delete: (id) => `/receipt-bank-details/${id}`,
  },

  // Admin Dashboard
  adminDashboard: {
    monthlyDoctors: '/admin/dashboard/monthly-doctors',
    yearlyDoctors: '/admin/dashboard/yearly-doctors',
    salesmanDoctors: '/admin/dashboard/salesman-doctors',
    telecallerDoctors: '/admin/dashboard/telecaller-doctors',
    monthlyPaymentReminders: '/admin/dashboard/monthly-payment-reminders',
    renewalReminders: '/admin/dashboard/renewal-reminders',
  },


};

// Helper functions for common API operations
export const apiHelpers = {
  // Generic CRUD operations
  async getList(endpoint, params = {}) {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },

  async getById(endpoint, id) {
    const response = await apiClient.get(endpoint(id));
    return response.data;
  },

  async create(endpoint, data) {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  },

  async update(endpoint, id, data) {
    const response = await apiClient.put(endpoint(id), data);
    return response.data;
  },

  // Update policy with document uploads (multipart/form-data)
  async updateWithDocuments(endpoint, id, data, documents) {
    const formData = new FormData();

    // Add policy data fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Add document files
    if (documents) {
      if (documents.policyDocument) {
        formData.append("policyDocument", documents.policyDocument);
      }
      if (documents.proposalForm) {
        formData.append("proposalForm", documents.proposalForm);
      }
      if (documents.otherDocuments && Array.isArray(documents.otherDocuments)) {
        documents.otherDocuments.forEach((file, index) => {
          formData.append("otherDocuments", file);
        });
      }
    }

    const response = await apiClient.put(endpoint(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Renew policy with document uploads (multipart/form-data)
  async renewWithDocuments(endpoint, id, renewalData, documents) {
    const formData = new FormData();

    // Add renewal data
    formData.append("renewalData", JSON.stringify(renewalData));

    // Add document files
    if (documents) {
      if (documents.policyDocument) {
        formData.append("policyDocument", documents.policyDocument);
      }
      if (documents.proposalForm) {
        formData.append("proposalForm", documents.proposalForm);
      }
      if (documents.otherDocuments && Array.isArray(documents.otherDocuments)) {
        documents.otherDocuments.forEach((file, index) => {
          formData.append("otherDocuments", file);
        });
      }
    }

    const response = await apiClient.put(endpoint(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async delete(endpoint, id) {
    const response = await apiClient.delete(endpoint(id));
    return response.data;
  },

  // Pagination helper
  buildPaginationParams(page = 1, limit = 10, filters = {}) {
    return {
      page,
      limit,
      ...filters,
    };
  },

  // Search helper
  buildSearchParams(query, additionalParams = {}) {
    return {
      q: query,
      ...additionalParams,
    };
  },
};

export default apiClient;
