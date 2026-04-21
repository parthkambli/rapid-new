



import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ChangePassword from './pages/Auth/ChangePassword';
import Navbar from './components/mainComponents/Header';
import SalesPersonDashboard from './pages/salesperson/Dashboard';
import SalesmanTasksPage from './pages/salesperson/Tasks';
import TaskSummaryPage from './pages/Admin/Employee/Salesperson/TaskSummary';
import Sidebar from './components/mainComponents/Sidebar';
// import AddNewDoctor from './pages/Admin/DoctorList/AddDoctor';
import ProtectedRoute from './components/common/ProtectedRoute';
import ReVisit from './pages/salesperson/Revisit/ReVisit';
import EditReVisit from './pages/salesperson/Revisit/EditRevisit';
import SalesProfile from './components/mainComponents/Profile';
import TransferDoctor from './pages/salesperson/Doctor/TransferDoctors';
import AllVisitedDoctorLists from './pages/salesperson/Doctor/AllVisitedDoctorLists';
import AddQuotation from './pages/salesperson/Quotation/AddQuotation';
import ViewQuotation from './pages/salesperson/Quotation/ViewQuation';
import Reports from './pages/salesperson/Reports';
import TeleViewDoctor from './pages/TeleCaller/ViewDoctor';
import TeleFollowUps from './pages/TeleCaller/ViewDoctorFollowUps'
import EditDoctor from './pages/salesperson/Doctor/EditDoctor';
import QuotationList from './pages/salesperson/Quotation/QuotationList';
import TelecallerDashboard from './pages/TeleCaller/Dashboard';
import TelecallerCallingList from './pages/TeleCaller/CallingList';
import TelecallerOtherTaskAssign from './pages/TeleCaller/OtherTaskAssigned';
import TelecallerProfile from './pages/TeleCaller/TelecallerProfile';
import TargetStatus from './pages/TeleCaller/Target/TargetStatus';
import TeleQuotationList from './pages/TeleCaller/Quotation/QuotationList';
import TelecallerAddDoctor from './pages/TeleCaller/AddDoctor';
import AdminDashboard from './pages/Admin/Dashboard';
import EmployeeList from './pages/Admin/Employee/EmployeeList';
import AddEmployee from './pages/Admin/Employee/AddEmployee';
import SalespersonList from './pages/Admin/Employee/Salesperson/SalespersonList';
import TeleCallerList from './pages/Admin/Employee/TeleCaller/TeleCallerList';
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorProfile from './pages/Doctor/Profile';
import DoctorPersonalDetails from './pages/Doctor/PersonalDetails';
import DoctorDocuments from './pages/Doctor/Documents';
import DoctorPolicies from './pages/Doctor/Policies';
import DoctorCases from './pages/Doctor/Cases';
import DoctorPayments from './pages/Doctor/Payments';
import DoctorViewCase from './pages/Doctor/Viewcase';
import DoctorViewReceipt from './pages/Doctor/DoctorViewReceipt';
import DoctorPrintReceipt from './pages/Doctor/DoctorPrintReceipt';
import DoctorPrintMonthlyReceipt from './pages/Doctor/DoctorPrintMonthlyReceipt';
import UserList from './pages/Admin/User/UserList';
import CreateUser from './pages/Admin/User/CreateUser';
import ServicePackageList from './pages/Admin/ServicePackage/ServicePackageList';
// import EditServicePackage from './pages/Admin/ServicePackage/EditService';

// additonal
import EditDoctorAddtional from './pages/TeleCaller/Additional/EditDoctor'
import AllVisitedDoctorListsAddtional from './pages/TeleCaller/Additional/TotalDoctor'
import CreateRecieptAdditional from './pages/TeleCaller/Additional/Reciept/CreateReciept'
// Use existing salesperson components instead of creating new ones

import AdvocateDashboard from './pages/Advocate/Dashboard';
// const ExpertDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Expert Dashboard</h1><p>Welcome to the Expert panel. This is a placeholder page.</p></div>;
import DoctorList from './pages/Admin/DoctorList/TotalDoctorList';
import ApiTest from './components/testing/ApiTest';
import AttendanceRecord from './pages/Admin/Attendance/AttendanceRecord';
import SalaryManagement from './pages/Admin/Attendance/SalaryManagement';
import AdminAddDoctor from './pages/Admin/DoctorList/AddDoctor';
import ViewAttendanceRecoed from './pages/Admin/Attendance/ViewAttendanceRecord';
import SalaryDetailView from './pages/Admin/Attendance/SalaryDetailView';
import SalesBill from './pages/Admin/Salesbill/SalesBillList';
import CreateBill from './pages/Admin/Salesbill/CreateBill';
import EditSalesBill from './pages/Admin/Salesbill/EditSalesBill';
import ReceiptList from './pages/Admin/Reciept/RecieptList';
import CreateReciept from './pages/Admin/Reciept/CreateReceipt';
import AddBank from './pages/Admin/Reciept/AddBank';
import QuotattionAdmin from './pages/Admin/Quotation/QuotationList';
import CreateQuotation from './pages/Admin/Quotation/CreateQuotation';
import AcceptDoctor from './pages/Admin/DoctorList/AcceptDoctor';
import CreateBulkReceipt from './pages/Admin/Reciept/CreateBulkReceipt';
import PolicyList from './pages/Admin/Policy/PolicyList';
import PolicyHistory from './pages/Admin/Policy/PolicyHistory';
import AddPolicy from './pages/Admin/Policy/AddPolicy';
import EditPolicy from './pages/Admin/Policy/EditPolicy';
import RenewPolicy from './pages/Admin/Policy/RenewPolicy';
import ViewPolicy from './pages/Admin/Policy/ViewPolicy';
import InsuranceCompanyList from './pages/Admin/Policy/InsuranceCompanyList';
import AddInsuranceCompany from './pages/Admin/Policy/AddInsuranceCompany';
import InsuranceTypeList from './pages/Admin/Policy/InsuranceTypeList';
import AddInsuranceType from './pages/Admin/Policy/AddInsuranceType';
import EditInsuranceType from './pages/Admin/Policy/EditInsuranceType';
import ServiceRenewalAlertList from './pages/Admin/RenewalAlertList/ServiceRenewalAlertList';
import IndemnityRenewalAlertList from './pages/Admin/RenewalAlertList/IndemnityRenewalAlertList';
import CreateServicePackage from './pages/Admin/ServicePackage/CreateService';
import EditServicePackage from './pages/Admin/ServicePackage/EditService';
import QueriesOrCase from './pages/Admin/Queries/QueriesOrCase';
import CreateQueryCase from './pages/Admin/Queries/CreateQueries';
import ViewQueries from './pages/Admin/Queries/ViewQueries';
import AdminCloseCase from './pages/Admin/Queries/CloseCases';
import AdvocateList from './pages/Admin/AdvocateList/AdvocateList';
import CreateAdvocateForm from './pages/Admin/AdvocateList/CreateAdvocateList';
import CreateAvocateBill from './pages/Admin/AdvocateList/CreateAdvocateBill';
import AdvocateBills from './pages/Admin/AdvocateList/AdvocateBillList';
import ViewAdvocateBill from './pages/Admin/AdvocateList/ViewAdvocateBill';
import EditAdvocateBill from './pages/Admin/AdvocateList/EditAdvocateBill';
import AdvocateHistory from './pages/Admin/AdvocateList/AdvocateHistory';
import ViewAdvocate from './pages/Admin/AdvocateList/ViewAdvocate';
import ExpertList from './pages/Admin/Expert/ExpertList';
import ExpertBill from './pages/Admin/Expert/CreateAdvocateBill';
import ExpertForm from './pages/Admin/Expert/CreateExpertList';
import ExpenseList from './pages/Admin/Expense/ExpenseList';
import CreateExpense from './pages/Admin/Expense/CreateExpense';
import ViewExpense from './pages/Admin/Expense/ViewExpense';
import EmployeeReport from './pages/Admin/Report/EmployeeReports';
import DoctorReports from './pages/Admin/Report/DoctorReports';
import DoctorDetailPage from './pages/Admin/Report/DoctorReport/DoctorDetail';
import SalesBillPage from './pages/Admin/Report/DoctorReport/ReportSalesBill';
import OverviewContent from './pages/Admin/Report/DoctorReport/OverviewContent';
import ReceiptsPage from './pages/Admin/Report/DoctorReport/ReportReciept';
import ViewReceipt from './pages/Admin/Reciept/ViewReceipt'
import QuotationsPage from './pages/Admin/Report/DoctorReport/QuotationsPage';
import PoliciesPage from './pages/Admin/Report/DoctorReport/ReportPoicies';
import InquiriesPage from './pages/Admin/Report/DoctorReport/InquiriesPage';
import PolicyReportPage from './pages/Admin/Report/PolicyReportPage';
import AdvocateReportPage from './pages/Admin/Report/AdvocateReportPage';
import ExpertReportPage from './pages/Admin/Report/ExpertReportPage';
import ExpenseReportPage from './pages/Admin/Report/ExpenseReportPage';
import CaseWiseReportPage from './pages/Admin/Report/CaseWiseReportPage';
import DoctorMonthlyReportPage from './pages/Admin/Report/DobReportPage';
import AccountStatementReport from './pages/Admin/Report/AccountStatementReport';
// import MasterReportPage from './pages/Admin/Report/MasterReportPage';
import MasterReportPage from './pages/superadmin/Report/MasterReportPage';
import QuotationReportPage from './pages/Admin/Report/QuotationReportPage';
import SalesBillReportPage from './pages/Admin/Report/SalesBillReportPage';
import ReceiptReportPage from './pages/Admin/Report/ReceiptReportPage';
import AttendanceReportPage from './pages/Admin/Report/AttendanceReportPage';
import SalaryReportPage from './pages/Admin/Report/SalaryReportPage';
import TargetReportPage from './pages/Admin/Report/TargetReportPage';
import TaskReportPage from './pages/Admin/Report/TaskReportPage';
import ViewDoctor from './pages/Admin/DoctorList/ViewDoctorForm';
import FollowUps from './pages/Admin/DoctorList/FollowUps';
import SendMessage from './pages/Admin/DoctorList/SendMessage';
import MonthlyDoctorList from './pages/Admin/DoctorList/MonthlyDoctorList';
import YearlyDoctorList from './pages/Admin/DoctorList/YearlyDoctorList';
import SalesmanDoctorList from './pages/Admin/DoctorList/SalesmanDoctorList';
import TelecallerDoctorList from './pages/Admin/DoctorList/TelecallerDoctorList';

// Advocate Pages
import AdvocateCasesPage from './pages/Advocate/Cases';
import CaseDetail from './pages/Advocate/CaseDetail';
import UpdateCase from './pages/Advocate/UpdateCase';
import CaseHistory from './pages/Advocate/CaseHistory';
import CloseCase from './pages/Advocate/CloseCase';


// Expert Pages
import ExpertDashboard from './pages/Expert/Dashboard';
import ExpertCasesPage from './pages/Expert/Cases';
import ExpertCaseDetail from './pages/Expert/CaseDetail';
import ExpertUpdateCase from './pages/Expert/UpdateCase';
import ExpertCaseHistory from './pages/Expert/CaseHistory';
import ExpertCloseCase from './pages/Expert/CloseCase';




import AddQuotationTeleCaller from './pages/TeleCaller/Quotation/AddQuotation'
import TelecallerTransferDoctor from './pages/TeleCaller/TransferDoctors';
import TelecallerReport from './pages/TeleCaller/Reports/TelecallerReport';
import TelecallerTaskReport from './pages/TeleCaller/Reports/TaskReports';
import EditdoctorTele from './pages/TeleCaller/EditDoctorTele';


import ReceiptListTele from './pages/TeleCaller/RecieptList';
import SalesBillTele from './pages/TeleCaller/SalesBillList';





import AddDoctorFormbySales from './pages/salesperson/Doctor/AddDoctor-Sales';
import RevisitForm from './pages/salesperson/Doctor/RevisitBySales';
import ViewEmployee from './pages/Admin/Employee/ViewEmployee';
import EditEmployee from './pages/Admin/Employee/EditEmployee';
import EditTask from './pages/Admin/Employee/TeleCaller/EditTask';
import UserView from './pages/Admin/User/UserView';
import UserEdit from './pages/Admin/User/UserEdit';
import InvoiceIndividualMembership from './pages/Admin/Quotation/invoices/IndividualMembershipInvoice';
import HospitalMembershipInvoice from './pages/Admin/Quotation/invoices/HospitalMembershipInvoice';
import CombinedMembershipInvoice from './pages/Admin/Quotation/invoices/CombinedMembershipInvoice';
import EditQuotation from './pages/Admin/Quotation/EditQuotation';
import InvoicePreviewPage from './pages/Admin/Quotation/InvoicePreviewPage';
import AddTaskTelecaller from './pages/Admin/Employee/TeleCaller/AddTask';
import ViewTask from './pages/Admin/Employee/TeleCaller/ViewTask';



// admin
import EditDoctorAdmin from './pages/Admin/DoctorList/EditDoctor'




// reciept print invoice
import PrintRecieptInvoice from './pages/Admin/Reciept/YearlyPrintReceipt'
import MonthlyReceiptPrint from './pages/Admin/Reciept/MonthlyReceiptPrint'



// // superadmin Routes

import SuperAdminDashboard from './pages/superadmin/Dashboard';
// // Advocate
import SuperAdminAdvocateList from './pages/superadmin/AdvocateList/AdvocateList';
import SuperAdminCreateAdvocateBill from './pages/superadmin/AdvocateList/CreateAdvocateBill';
import SuperAdminCreateAdvocateList from './pages/superadmin/AdvocateList/CreateAdvocateList';
// // Attendance
import SuperAdminAttendanceRecord from './pages/superadmin/Attendance/AttendanceRecord';
import SuperAdminSalaryDetail from './pages/superadmin/Attendance/SalaryDetailView';
import SuperAdminSalarymanagement from './pages/superadmin/Attendance/SalaryManagement';
import SuperAdminViewAttendanceRecord from './pages/superadmin/Attendance/ViewAttendanceRecord';
// //Doctor List
import SuperAdminAcceptDoctor from './pages/superadmin/DoctorList/AcceptDoctor'
import SuperAdminAddDoctor from './pages/superadmin/DoctorList/AddDoctor'
import SuperAdminFollowUps from './pages/superadmin/DoctorList/FollowUps'
import SuperAdminSendMessage from './pages/superadmin/DoctorList/SendMessage'
import SuperAdminTotalDoctorList from './pages/superadmin/DoctorList/TotalDoctorList'
// import SuperAdminViewDoctorForm from './pages/superadmin/DoctorList/ViewDoctorForm'
// //employee
// //  - salesperson
import SuperAdminSalesPersonList from './pages/superadmin/Employee/Salesperson/SalespersonList'
// // import SuperAdminSalesPersomTaskModal from './pages/superadmin/Employee/Salesperson/TaskModal.jsx'
// //  - telecaller
import SuperAdminAddTask from './pages/superadmin/Employee/TeleCaller/AddTask'
import SuperAdminTelecallerList from './pages/superadmin/Employee/TeleCaller/TeleCallerList'
// // employee pages
import SuperAdminViewTask from './pages/superadmin/Employee/TeleCaller/ViewTask'
import SuperAdminAddEmployee from './pages/superadmin/Employee/AddEmployee'
import SuperAdminEditEmployee from './pages/superadmin/Employee/EditEmployee'
import SuperAdminEmployeeList from './pages/superadmin/Employee/EmployeeList'
import SuperAdminViewEmployee from './pages/superadmin/Employee/ViewEmployee'
// // expense
import SuperAdminCreateExpense from './pages/superadmin/Expense/CreateExpense'
import SuperAdminExpenseList from './pages/superadmin/Expense/ExpenseList'
// // expert
import SuperAdminCreateExpertAdvocateBill from './pages/superadmin/Expert/CreateAdvocateBill'
import SuperAdminCreateExpertList from './pages/superadmin/Expert/CreateExpertList'
import SuperAdminExpertList from './pages/superadmin/Expert/ExpertList'


// // Policy
// import SuperAdminAddInsuranceCompany from './pages/superadmin/Policy/AddInsuranceCompany';
import SuperAdminAddInsuranceType from './pages/superadmin/Policy/AddInsuranceType';
import SuperAdminAddPolicy from './pages/superadmin/Policy/AddPolicy';
// import SuperAdminEditPolicy from './pages/superadmin/Policy/EditPolicy';
import SuperAdminInsuranceCompanyList from './pages/superadmin/Policy/InsuranceCompanyList';
import SuperAdminInsuranceTypeList from './pages/superadmin/Policy/InsuranceTypeList';
// import SuperAdminPolicyHistory from './pages/superadmin/Policy/PolicyHistory';
import SuperAdminPolicyList from './pages/superadmin/Policy/PolicyList';
import SuperAdminRenewPolicy from './pages/superadmin/Policy/RenewPolicy';


// // Queries
import SuperAdminCreateQueries from './pages/superadmin/Queries/CreateQueries';
import SuperAdminQueriesOrCase from './pages/superadmin/Queries/QueriesOrCase';


// // Quotation
import SuperAdminCreateQuotation from './pages/superadmin/Quotation/CreateQuotation';
import SuperAdminQuotationList from './pages/superadmin/Quotation/QuotationList';
// import SuperAdminQuotationPreview from './pages/superadmin/Quotation/QuotationPreview';


// // Invoices
// import SuperAdminCombinedMembershipInvoice from './pages/superadmin/Quotation/invoices/CombinedMembershipInvoice';
// import SuperAdminFooterInvoice from './pages/superadmin/Quotation/invoices/FooterInvoice';
// import SuperAdminHeaderInvoice from './pages/superadmin/Quotation/invoices/HeaderInvoice';
// import SuperAdminHospitalMembershipInvoice from './pages/superadmin/Quotation/invoices/HospitalMembershipInvoice';
// import SuperAdminIndividualMembershipInvoice from './pages/superadmin/Quotation/invoices/IndividualMembershipInvoice';
// // import SuperAdminInvoicePreviewPage from './pages/superadmin/Quotation/invoices/InvoicePreviewPage';
import SuperAdminEditQuotation from './pages/superadmin/Quotation/EditQuotation';


// // Receipt
import SuperAdminAddBank from './pages/superadmin/Reciept/AddBank';
import SuperAdminCreateBulkReceipt from './pages/superadmin/Reciept/CreateBulkReceipt';
import SuperAdminCreateReceipt from './pages/superadmin/Reciept/CreateReceipt';
// import SuperAdminPrintReceipt from './pages/superadmin/Recipt/PrintReciept';
// import SuperAdminReceiptTemplate from './pages/superadmin/Recipt/RecieptTemplate';
import SuperAdminReceiptList from './pages/superadmin/Reciept/RecieptList';
import SuperAdminViewReceipt from './pages/superadmin/Reciept/ViewReceipt';


// // Renewal Alerts
import SuperAdminIndemnityRenewalAlertList from './pages/superadmin/RenewalAlertList/IndemnityRenewalAlertList';
import SuperAdminServiceRenewalAlertList from './pages/superadmin/RenewalAlertList/ServiceRenewalAlertList';


// // Reports
// import SuperAdminDoctorDetail from './pages/superadmin/Report/DoctorReport/DoctorDetail';
// import SuperAdminDoctorHeader from './pages/superadmin/Report/DoctorReport/DoctorHeader';
// import SuperAdminReportFilters from './pages/superadmin/Report/DoctorReport/FiltersSection';
// import SuperAdminInquiriesPage from './pages/superadmin/Report/DoctorReport/InquiriesPage';
// import SuperAdminOverviewContent from './pages/superadmin/Report/DoctorReport/OverviewContent';
// import SuperAdminQuotationsPage from './pages/superadmin/Report/DoctorReport/QuotationsPage';
// import SuperAdminReportPolicies from './pages/superadmin/Report/DoctorReport/ReportPolicies';
// import SuperAdminReportReceipt from './pages/superadmin/Report/DoctorReport/ReportReceipt';
// import SuperAdminReportSalesBill from './pages/superadmin/Report/DoctorReport/ReportSalesBill';
import SuperAdminAccountStatementReportPage from './pages/superadmin/Report/AccountStatementReport';
import SuperAdminAdvocateReportPage from './pages/superadmin/Report/AdvocateReportPage';
import SuperAdminCaseWiseReportPage from './pages/superadmin/Report/CaseWiseReportPage';
import SuperAdminDobReportPage from './pages/superadmin/Report/DobReportPage';
import SuperAdminDoctorReports from './pages/superadmin/Report/DoctorReports';
import SuperAdminEmployeeReports from './pages/superadmin/Report/EmployeeReports';
import SuperAdminExpenseReportPage from './pages/superadmin/Report/ExpenseReportPage';
import SuperAdminExpertReportPage from './pages/superadmin/Report/ExpertReportPage';
// import SuperAdminMasterReportPage from './pages/superadmin/Report/DoctorReport/MasterReportPage';
import SuperAdminPolicyReportPage from './pages/superadmin/Report/PolicyReportPage';
import SuperAdminDoctorDetails from './pages/superadmin/Report/DoctorReport/DoctorDetail'



// // Salesbill
// import SuperAdminMonthlyBill from './pages/superadmin/Salesbill/Invoices/MonthlyBill';
// import SuperAdminSAForYearPlan from './pages/superadmin/Salesbill/Invoices/SA-ForYearPlan';
// import SuperAdminYearlyBill from './pages/superadmin/Salesbill/Invoices/YearlyBill';
// import SuperAdminBillWrapper from './pages/superadmin/Salesbill/Invoices/BillWrapper';
import SuperAdminCreateBill from './pages/superadmin/Salesbill/CreateBill';
import SuperAdminSalesBillList from './pages/superadmin/Salesbill/SalesBillList';




// reciept
import EditReceipt from './pages/Admin/Reciept/EditReceipt';


// // Service Package
import SuperAdminCreateServicePkg from './pages/superadmin/ServicePackage/CreateService';
import SuperAdminServicePackageList from './pages/superadmin/ServicePackage/ServicePackageList';


// // User
import SuperAdminCreateUser from './pages/superadmin/User/CreateUser';
import SuperAdminUserEdit from './pages/superadmin/User/UserEdit';
import SuperAdminUserList from './pages/superadmin/User/UserList';
import SuperAdminUserView from './pages/superadmin/User/UserView';
import TotalDoctorListTele from './pages/TeleCaller/TotalDoctorList';
import SalesBillPrintWrapper from './pages/Admin/Salesbill/BillWrapper';
import WelcomeLetter from './pages/Admin/Salesbill/Invoices/WelcomeNote';
import RenewalLetterExact from './pages/Admin/Salesbill/Invoices/RWNLetter';
import RenewalContractLetter from './pages/Admin/Salesbill/Invoices/RenewalLetter';
import QuotationInvoices from './pages/QuotationInvoice/QuotationInvoices';
import TeleEditQuotation from './pages/TeleCaller/Quotation/EditQuotation';
import ExpertBills from './pages/Admin/Expert/ExpertBills';
import ViewExpertBill from './pages/Admin/Expert/ViewExpertBill';
import EditExpertBill from './pages/Admin/Expert/EditExpertBill';
import ExpertHistory from './pages/Admin/Expert/ExpertBillHistory';
// import SuperAdminUserDashboard from './pages/superadmin/User/Dashboard';


// // TeleCaller
// import SuperAdminTelecallerDashboard from './pages/superadmin/TeleCaller/Dashboard';
// // import SuperAdminTelecallerList from './pages/superadmin/TeleCaller/TelecallerList';
// import SuperAdminTelecallerAddTask from './pages/superadmin/TeleCaller/AddTask';
// import SuperAdminTelecallerViewTask from './pages/superadmin/TeleCaller/ViewTask';



// salesperson
import SalesEditQuotation from './pages/salesperson/Quotation/EditQuotation';
import SalesFollowUp from './pages/salesperson/Doctor/ViewFollowUps';
import SalesViewDoctor from './pages/salesperson/Doctor/ViewDoctor';
import SalesReport from './pages/salesperson/Reports/SalesReport';
import MonthlySA from './pages/Admin/Salesbill/Invoices/SA-fotMonthlyPlan';
import YearlySA from './pages/Admin/Salesbill/Invoices/SA-ForYearPlan';
import SAWHFYearlyPlan from './pages/Admin/Salesbill/Invoices/SAWHF-YearlyPlan';
import SAWHFMonthlyPlan from './pages/Admin/Salesbill/Invoices/SAWHF-MonthlyPlan';
import SAWithoutHeaderFooter from './pages/Admin/Salesbill/Invoices/serviceAgreement(SA)/SAWithoutHeaderFooter';
import ProfileAdvocate from './pages/Advocate/ProfileAdvocate';
import ProfileExpert from './pages/Expert/ProfileExpert';
import EmployeeProfile from './pages/salesperson/SalespersonProfile';
import SalespersonProfile from './pages/salesperson/SalespersonProfile';
import MembershipForm from './pages/Admin/Salesbill/MembershipForm/MembershipForm';
import NewMembershipForm from './pages/Admin/Salesbill/MembershipForm/NewMembershipForm';


const AppContent = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, refreshUserPermissions } = useAuth();
  const permissionsLoadedRef = useRef(false);

  // Fetch comprehensive permissions when user is loaded (on app refresh)
  // Using a ref to prevent infinite loop
  useEffect(() => {
    if (user && !permissionsLoadedRef.current) {
      // Only fetch comprehensive permissions on initial load or after login
      // Check if we already have the comprehensive permissions loaded
      const hasComprehensivePermissions = user.permissions &&
        user.permissions.some(perm =>
          perm.formName === 'User Management' ||
          perm.formName === 'Employee Management' ||
          perm.formName === 'Salesperson List' ||
          perm.formName === 'Telecaller List'
        );

      if (!hasComprehensivePermissions) {
        // Only fetch if we don't already have the extended permissions
        refreshUserPermissions().then(() => {
          permissionsLoadedRef.current = true; // Mark as loaded after successful fetch
        }).catch(err => {
          console.warn('Failed to fetch comprehensive permissions on app load:', err);
          permissionsLoadedRef.current = true; // Still mark as loaded to prevent infinite retries
        });
      } else {
        permissionsLoadedRef.current = true; // Already has comprehensive permissions
      }
    }
  }, [user, refreshUserPermissions]);

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 print:hidden">
        <Navbar toggleSidebar={toggleSidebar} onLogout={handleLogout} user={user} />
      </header>

      <div className="flex flex-1 pt-16 md:pt-16 print:pt-0">
        {/* Sidebar */}
        <aside className="fixed md:static z-30 print:hidden">
          <Sidebar
            onNavClick={handleNavClick}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-56 p-4 md:p-6 mt-0 md:mt-0 print:ml-0 print:p-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* Root redirect based on user role */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Salesperson Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Dashboard", action: "read" }]} />}>
              <Route path="/sales/dashboard" element={<SalesPersonDashboard />} />
              <Route path="/sales/add-doctor" element={<AddDoctorFormbySales />} />
              <Route path="/sales/view-doctor/:id" element={<SalesViewDoctor />} />
              <Route path="/sales/edit-doctor/:id" element={<EditDoctor />} />
              <Route path="/sales/addtional/edit-doctor/:id" element={<EditDoctorAddtional />} />
              <Route path="/sales/dr-followups" element={<SalesFollowUp />} />
              <Route path="/sales/revisit-doctor/:id" element={<RevisitForm />} />

              <Route path="/re-visit" element={<ReVisit />} />
              <Route path="/sales/edit-revisit/:drName" element={<EditReVisit />} />
              <Route path="/sales/all-doctors" element={<AllVisitedDoctorLists />} />
              <Route path="/sales/profile" element={<SalesProfile />} />
              <Route path="/sales/transfer" element={<TransferDoctor />} />
              {/* <Route path="/transfer" element={<TelecallerTransferDoctor />} /> */}
              <Route path="/sales/quotation-list" element={<QuotationList />} />
              <Route path="/sales/add/quotation" element={<AddQuotation />} />
              <Route path="/sales/quotation/edit/:id" element={<SalesEditQuotation />} />
              <Route path="/view/quotation" element={<ViewQuotation />} />
              <Route path="/sales/view/quotation-list" element={<QuotationList />} />
              <Route path="/sales/quotation/:id" element={<QuotationInvoices />} />
              <Route path="/sales/target-status" element={<TargetStatus />} />
              <Route path="/sales/tasks" element={<SalesmanTasksPage />} />
              <Route path="/reports" element={<Reports />} />
              {/* Additional salesperson routes to match navigation */}
              <Route path="/sales/doctor-management" element={<AllVisitedDoctorLists />} />
              <Route path="/sales/receipts" element={<ReceiptList />} />
              <Route path="/sales/sales-bills" element={<SalesBill />} />

              {/* Routes dynamically added based on permissions */}
              <Route path="/sales/add-policy" element={<AddPolicy />} />
              <Route path="/sales/queries-or-case" element={<QueriesOrCase />} />
              <Route path="/sales/create-query-case" element={<CreateQueryCase />} />
              <Route path="/sales/advocate-list" element={<AdvocateList />} />
              <Route path="/sales/expert-list" element={<ExpertList />} />
              <Route path="/sales/expense-list" element={<ExpenseList />} />
              <Route path="/sales/policy-list" element={<PolicyList />} />
              <Route path="/sales/service-package-list" element={<ServicePackageList />} />
              <Route path="/sales/create-service-package" element={<CreateServicePackage />} />
              <Route path="/sales/edit-service-package/:id" element={<EditServicePackage />} />
              <Route path="/sales/renewal-alert-list" element={<ServiceRenewalAlertList />} />
              <Route path="/sales/service-renewal-alert-list" element={<ServiceRenewalAlertList />} />
              <Route path="/sales/indemnity-renewal-alert-list" element={<IndemnityRenewalAlertList />} />
              <Route path="/sales/insurance-companies-list" element={<InsuranceCompanyList />} />
              <Route path="/sales/insurance-types" element={<InsuranceTypeList />} />
              <Route path="/sales/create-expert-list" element={<ExpertForm />} />
              <Route path="/sales/create-advocate" element={<CreateAdvocateForm />} />
              <Route path="/sales/create-advocate-bill" element={<CreateAvocateBill />} />
              <Route path="/sales/create-expert-bill" element={<ExpertBill />} />
              <Route path="/sales/create-expense" element={<CreateExpense />} />
              <Route path="/sales/employee-reports" element={<EmployeeReport />} />
              <Route path="/sales/doctor-reports" element={<DoctorReports />} />
              <Route path="/sales/policy-reports" element={<PolicyReportPage />} />
              <Route path="/sales/advocate-reports" element={<AdvocateReportPage />} />
              <Route path="/sales/expert-reports" element={<ExpertReportPage />} />
              <Route path="/sales/expense-reports" element={<ExpenseReportPage />} />
              <Route path="/sales/case-wise-reports" element={<CaseWiseReportPage />} />
              <Route path="/sales/dr-dob-reports" element={<DoctorMonthlyReportPage />} />
              <Route path="/sales/account-statement-reports" element={<AccountStatementReport />} />
              <Route path="/sales/master-report" element={<MasterReportPage />} />
              <Route path="/sales/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/sales/add-insurance-type" element={<AddInsuranceType />} />
              <Route path="/sales/edit-insurance-type/:id" element={<EditInsuranceType />} />
              <Route path="/sales/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/sales/view-policy/:id" element={<ViewPolicy />} />
              <Route path="/sales/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/sales/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/sales/send-message" element={<SendMessage />} />
              <Route path="/sales/create-bulk-receipt" element={<CreateBulkReceipt />} />
              <Route path="/sales/addbank" element={<AddBank />} />
              <Route path="/sales/employee/view/:id" element={<ViewEmployee />} />
              <Route path="/sales/employee/edit/:id" element={<EditEmployee />} />
              <Route path="/sales/users/:id" element={<UserView />} />
              <Route path="/sales/users/edit/:id" element={<UserEdit />} />
              <Route path="/sales/view-doctor/:id" element={<ViewDoctor />} />
              <Route path="/sales/view/attendance-record" element={<ViewAttendanceRecoed />} />
              <Route path="/sales/employee/salary/view/:id" element={<SalaryDetailView />} />
              <Route path="/sales/create-quotation" element={<CreateQuotation />} />
              <Route path="/sales/add-salesbill" element={<CreateBill />} />
              <Route path="/sales/create-receipt" element={<CreateReciept />} />
              <Route path="/sales/add-policy" element={<AddPolicy />} />
              <Route path="/sales/attendance-record" element={<AttendanceRecord />} />
              <Route path="/sales/salary-management" element={<SalaryManagement />} />
              <Route path="/sales/user" element={<CreateUser />} />
              <Route path="/sales/all-users" element={<UserList />} />
              <Route path="/sales/create-service-package" element={<CreateServicePackage />} />
              <Route path="/sales/create-query-case" element={<CreateQueryCase />} />
              <Route path="/sales/accept-doctor" element={<AcceptDoctor />} />
              <Route path="/sales/dr-followups" element={<FollowUps />} />
              <Route path="/sales/send-message" element={<SendMessage />} />
              <Route path="/sales/reports" element={<SalesReport />} />
              <Route path="/sales/emp/reports" element={<EmployeeReport />} />
              <Route path="/sales/employee-list" element={<EmployeeList />} />
              <Route path="/sales/salesperson-list" element={<SalespersonList />} />
              <Route path="/sales/telecaller-list" element={<TeleCallerList />} />
              <Route path="/sales/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/sales/doctors/:id/sales-bill" element={<SalesBillPage />} />
              <Route path="/sales/doctors/:id/receipts" element={<ReceiptsPage />} />
              <Route path="/sales/doctors/:id/quotations" element={<QuotationsPage />} />
              <Route path="/sales/doctors/:id/policies" element={<PoliciesPage />} />
              <Route path="/sales/doctors/:id/inquiries" element={<InquiriesPage />} />
              <Route path="/sales/quotation-list" element={<QuotattionAdmin />} />
              <Route path="/sales/salesbill/list" element={<SalesBill />} />
              <Route path="/sales/receipt-list" element={<ReceiptList />} />
              <Route path="/sales/policy" element={<PolicyList />} />
              <Route path="/sales/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/sales/add-policy" element={<AddPolicy />} />
              <Route path="/sales/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/sales/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/sales/insurance-companies-list" element={<InsuranceCompanyList />} />
              <Route path="/sales/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/sales/insurance-type-list" element={<InsuranceTypeList />} />
              <Route path="/sales/add-insurance-type" element={<AddInsuranceType />} />
              <Route path="/sales/service-package-list" element={<ServicePackageList />} />
              <Route path="/sales/create-service-package" element={<CreateServicePackage />} />
              <Route path="/sales/queries" element={<QueriesOrCase />} />
              <Route path="/sales/advocate-list" element={<AdvocateList />} />
              <Route path="/sales/create-advocate" element={<CreateAdvocateForm />} />
              <Route path="/sales/advocate/:id" element={<ViewAdvocate />} />
              <Route path="/sales/expert-list" element={<ExpertList />} />
              <Route path="/sales/create-expert-list" element={<ExpertForm />} />
              <Route path="/sales/expense-list" element={<ExpenseList />} />
              <Route path="/sales/doctor-list" element={<DoctorList />} />
              <Route path="/sales/api-test" element={<ApiTest />} />
              <Route path="/sales/master-report" element={<MasterReportPage />} />
              <Route path="/sales/addbank" element={<AddBank />} />
              <Route path="/sales/create-bulk-receipt" element={<CreateBulkReceipt />} />
              <Route path="/sales/invoices/individual-membership" element={<InvoiceIndividualMembership />} />
              <Route path="/sales/invoices/hospital-membership" element={<HospitalMembershipInvoice />} />
              <Route path="/sales/invoices/combined-membership" element={<CombinedMembershipInvoice />} />

            </Route>

            {/* Telecaller Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Dashboard", action: "read" }]} />}>
              <Route path="/" element={<TelecallerDashboard />} />
              <Route path="/telecaller/dashboard" element={<TelecallerDashboard />} />
              <Route path="/telecaller/add-doctor" element={<TelecallerAddDoctor />} />
              <Route path="/telecaller/all-doctors" element={<AllVisitedDoctorListsAddtional />} />
              <Route path="/telecaller/edit-doctor/:id" element={<EditdoctorTele />} />
              <Route path="/telecaller/calling-list" element={<TelecallerCallingList />} />
              <Route path="/telecaller/add/quotation" element={<AddQuotationTeleCaller />} />
              <Route path="/telecaller/quotation/:id" element={<QuotationInvoices />} />

              <Route path="/telecaller/quotation-list" element={<TeleQuotationList />} />
              <Route path="/telecaller/other-task/assign" element={<TelecallerOtherTaskAssign />} />
              <Route path="/telecaller/profile" element={<TelecallerProfile />} />
              <Route path="/telecaller/transfer-doctor" element={<TelecallerTransferDoctor />} />
              <Route path="/telecaller/reports" element={<TelecallerReport />} />
              <Route path="/telecaller/task-reports" element={<TelecallerTaskReport />} />
              {/* <Route path="/transfer" element={<TransferDoctor />} /> */}
              {/* Additional telecaller routes to match navigation */}
              <Route path="/telecaller/doctor-management" element={<AllVisitedDoctorLists />} />
              {/* New routes for dynamically added permissions */}
              <Route path="/telecaller/user-management" element={<UserList />} />
              <Route path="/telecaller/employee-management" element={<EmployeeList />} />
              <Route path="/telecaller/add-employee" element={<AddEmployee />} />
              <Route path="/telecaller/employee-list" element={<EmployeeList />} />
              <Route path="/telecaller/salesperson-list" element={<SalespersonList />} />
              <Route path="/telecaller/telecaller-list" element={<TeleCallerList />} />

              {/* Routes dynamically added based on permissions */}
              <Route path="/telecaller/add-policy" element={<AddPolicy />} />
              <Route path="/telecaller/queries-or-case" element={<QueriesOrCase />} />
              <Route path="/telecaller/create-query-case" element={<CreateQueryCase />} />
              <Route path="/telecaller/advocate-list" element={<AdvocateList />} />
              <Route path="/telecaller/expert-list" element={<ExpertList />} />
              <Route path="/telecaller/expense-list" element={<ExpenseList />} />
              <Route path="/telecaller/advocate/:id" element={<ViewAdvocate />} />
              <Route path="/telecaller/policy-list" element={<PolicyList />} />
              <Route path="/telecaller/service-package-list" element={<ServicePackageList />} />
              <Route path="/telecaller/create-service-package" element={<CreateServicePackage />} />
              <Route path="/telecaller/edit-service-package/:id" element={<EditServicePackage />} />
              <Route path="/telecaller/renewal-alert-list" element={<ServiceRenewalAlertList />} />
              <Route path="/telecaller/service-renewal-alert-list" element={<ServiceRenewalAlertList />} />
              <Route path="/telecaller/indemnity-renewal-alert-list" element={<IndemnityRenewalAlertList />} />
              <Route path="/telecaller/insurance-companies-list" element={<InsuranceCompanyList />} />
              <Route path="/telecaller/insurance-types" element={<InsuranceTypeList />} />
              <Route path="/telecaller/create-expert-list" element={<ExpertForm />} />
              <Route path="/telecaller/create-advocate" element={<CreateAdvocateForm />} />
              <Route path="/telecaller/create-advocate-bill" element={<CreateAvocateBill />} />
              <Route path="/telecaller/create-expert-bill" element={<ExpertBill />} />
              <Route path="/telecaller/create-expense" element={<CreateExpense />} />
              <Route path="/telecaller/employee-reports" element={<EmployeeReport />} />
              <Route path="/telecaller/doctor-reports" element={<DoctorReports />} />
              <Route path="/telecaller/policy-reports" element={<PolicyReportPage />} />
              <Route path="/telecaller/advocate-reports" element={<AdvocateReportPage />} />
              <Route path="/telecaller/expert-reports" element={<ExpertReportPage />} />
              <Route path="/telecaller/expense-reports" element={<ExpenseReportPage />} />
              <Route path="/telecaller/case-wise-reports" element={<CaseWiseReportPage />} />
              <Route path="/telecaller/dr-dob-reports" element={<DoctorMonthlyReportPage />} />
              <Route path="/telecaller/account-statement-reports" element={<AccountStatementReport />} />
              <Route path="/telecaller/master-report" element={<MasterReportPage />} />
              <Route path="/telecaller/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/telecaller/add-insurance-type" element={<AddInsuranceType />} />
              <Route path="/telecaller/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/telecaller/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/telecaller/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/telecaller/send-message" element={<SendMessage />} />
              <Route path="/telecaller/create-bulk-receipt" element={<CreateBulkReceipt />} />
              <Route path="/telecaller/addbank" element={<AddBank />} />
              <Route path="/telecaller/employee/view/:id" element={<ViewEmployee />} />
              <Route path="/telecaller/employee/edit/:id" element={<EditEmployee />} />
              <Route path="/telecaller/users/:id" element={<UserView />} />
              <Route path="/telecaller/users/edit/:id" element={<UserEdit />} />
               <Route path="/admin/employee/Tellecaller/edit-task/:taskId" element={<EditTask />} />
              <Route path="/telecaller/view-doctor/:id" element={<TeleViewDoctor />} />
              <Route path="/telecaller/view/attendance-record" element={<ViewAttendanceRecoed />} />
              <Route path="/telecaller/employee/salary/view/:id" element={<SalaryDetailView />} />
              <Route path="/telecaller/create-quotation" element={<CreateQuotation />} />
              <Route path="/telecaller/add-salesbill" element={<CreateBill />} />
              <Route path="/telecaller/edit-salesbill/:id" element={<EditSalesBill />} />
              <Route path="/telecaller/create-receipt" element={<CreateReciept />} />
              <Route path="/telecaller/add-policy" element={<AddPolicy />} />
              <Route path="/telecaller/attendance-record" element={<AttendanceRecord />} />
              <Route path="/telecaller/salary-management" element={<SalaryManagement />} />
              <Route path="/telecaller/user" element={<CreateUser />} />
              <Route path="/telecaller/all-users" element={<UserList />} />
              <Route path="/telecaller/create-service-package" element={<CreateServicePackage />} />
              <Route path="/telecaller/create-query-case" element={<CreateQueryCase />} />
              <Route path="/telecaller/accept-doctor" element={<AcceptDoctor />} />
              <Route path="/telecaller/dr-followups" element={<TeleFollowUps />} />
              <Route path="/telecaller/send-message" element={<SendMessage />} />
              <Route path="/telecaller/reports" element={<EmployeeReport />} />
              <Route path="/telecaller/employee-list" element={<EmployeeList />} />
              <Route path="/telecaller/salesperson-list" element={<SalespersonList />} />
              <Route path="/telecaller/telecaller-list" element={<TeleCallerList />} />
              <Route path="/telecaller/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/telecaller/doctors/:id/sales-bill" element={<SalesBillPage />} />
              <Route path="/telecaller/doctors/:id/receipts" element={<ReceiptsPage />} />
              <Route path="/telecaller/doctors/:id/quotations" element={<QuotationsPage />} />
              <Route path="/telecaller/doctors/:id/policies" element={<PoliciesPage />} />
              <Route path="/telecaller/doctors/:id/inquiries" element={<InquiriesPage />} />
              <Route path="/telecaller/quotation-list" element={<QuotattionAdmin />} />
              <Route path="/telecaller/quotation/edit/:id" element={<TeleEditQuotation />} />
              <Route path="/telecaller/quotation/:id" element={<QuotationInvoices />} />
              <Route path="/telecaller/salesbill/list" element={<SalesBillTele />} />
              <Route path="/telecaller/salesbill/print/:id" element={<SalesBillPrintWrapper />} />
              <Route path="/telecaller/salesbill/WN/:id" element={<WelcomeLetter />} />
              <Route path="/telecaller/salesbill/renewed/:id" element={<RenewalLetterExact />} />
              <Route path="/telecaller/salesbill/rwnl/:id" element={<RenewalContractLetter />} />
              <Route path="/telecaller/salesbill/membership-form/:id" element={<MembershipForm />} />
              <Route path="/telecaller/salesbill/membership-form-new/:id" element={<NewMembershipForm />} />
              <Route path="/telecaller/salesbill/sa-whf-monthly/:id" element={<SAWHFMonthlyPlan />} />
              <Route path="/telecaller/salesbill/sa-whf-yearly/:id" element={<SAWHFYearlyPlan />} />
              <Route path="/telecaller/salesbill/sa/monthly/:id" element={<MonthlySA />} />
              <Route path="/telecaller/salesbill/sa/yearly/:id" element={<YearlySA />} />
              <Route path="/telecaller/receipt-list" element={<ReceiptListTele />} />
              <Route path="/telecaller/create-receipt" element={<CreateRecieptAdditional />} />
              <Route path="/telecaller/edit-receipt/:id" element={<EditReceipt />} />
              <Route path="/telecaller/view-receipt/:id" element={<ViewReceipt />} />
              <Route path="/telecaller/print-receipt/:id" element={<PrintRecieptInvoice />} />
              <Route path="/telecaller/print-yearly-receipt/:id" element={<PrintRecieptInvoice />} />
              <Route path="/telecaller/print-monthly-receipt/:id" element={<MonthlyReceiptPrint />} />

              <Route path="/telecaller/policy" element={<PolicyList />} />
              <Route path="/telecaller/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/telecaller/add-policy" element={<AddPolicy />} />
              <Route path="/telecaller/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/telecaller/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/telecaller/insurance-companies-list" element={<InsuranceCompanyList />} />
              <Route path="/telecaller/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/telecaller/insurance-type-list" element={<InsuranceTypeList />} />
              <Route path="/telecaller/add-insurance-type" element={<AddInsuranceType />} />
              <Route path="/telecaller/service-package-list" element={<ServicePackageList />} />
              <Route path="/telecaller/create-service-package" element={<CreateServicePackage />} />
              <Route path="/telecaller/queries" element={<QueriesOrCase />} />
              <Route path="/telecaller/advocate-list" element={<AdvocateList />} />
              <Route path="/telecaller/create-advocate" element={<CreateAdvocateForm />} />
              <Route path="/telecaller/expert-list" element={<ExpertList />} />
              <Route path="/telecaller/create-expert-list" element={<ExpertForm />} />
              <Route path="/telecaller/expense-list" element={<ExpenseList />} />
              <Route path="/telecaller/doctor-list" element={<TotalDoctorListTele />} />
              <Route path="/telecaller/api-test" element={<ApiTest />} />
              <Route path="/telecaller/master-report" element={<MasterReportPage />} />
              <Route path="/telecaller/addbank" element={<AddBank />} />
              <Route path="/telecaller/create-bulk-receipt" element={<CreateBulkReceipt />} />
              <Route path="/telecaller/invoices/individual-membership" element={<InvoiceIndividualMembership />} />
              <Route path="/telecaller/invoices/hospital-membership" element={<HospitalMembershipInvoice />} />
              <Route path="/telecaller/invoices/combined-membership" element={<CombinedMembershipInvoice />} />

            </Route>

            {/* Superadmin Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "User Management", action: "read" }]} />}>
              {/* <Route path="/superadmin/dashboard" element={<AdminDashboard />} />*/}

              <Route path="/superadmin/*" element={<Navigate to="/superadmin/dashboard" replace />} />
              <Route path="/" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/employee-list" element={<SuperAdminEmployeeList />} />
              <Route path="/superadmin/employee/edit/:id" element={<SuperAdminEditEmployee />} />
              <Route path="/superadmin/employee/view/:id" element={<SuperAdminViewEmployee />} />
              <Route path="/superadmin/employee/add" element={<SuperAdminAddEmployee />} />
              <Route path="/superadmin/employee/telecaller" element={<SuperAdminTelecallerList />} />
              <Route path="/superadmin/api-test" element={<ApiTest />} />
              <Route path="/superadmin/services-package" element={<SuperAdminServicePackageList />} />
              <Route path="/superadmin/all-users" element={<SuperAdminUserList />} />
              <Route path="/superadmin/user" element={<CreateUser />} />
              <Route path="/superadmin/users/:id" element={<SuperAdminUserView />} />
              <Route path="/superadmin/users/edit/:id" element={<SuperAdminUserEdit />} />
              <Route path="/superadmin/add-user" element={<SuperAdminCreateUser />} />
              <Route path="/superadmin/employee/salesperson" element={<SuperAdminSalesPersonList />} />
              <Route path="/superadmin/employee/salesperson/:employeeId/task-summary" element={<TaskSummaryPage />} />
              <Route path="/superadmin/doctor-list" element={<SuperAdminTotalDoctorList />} />
              <Route path="/superadmin/dr-followups" element={<SuperAdminFollowUps />} />
              <Route path="/view-doctor/:id" element={<ViewDoctor />} />
              <Route path="/superadmin/attendance-record" element={<SuperAdminAttendanceRecord />} />
              <Route path="/superadmin/salary-management" element={<SuperAdminSalarymanagement />} />
              <Route path="/superadmin/add-doctor" element={<SuperAdminAddDoctor />} />
              <Route path="/superadmin/view/attendance-record" element={<SuperAdminViewAttendanceRecord />} />
              <Route path="/superadmin/employee/salary/view/:id" element={<SuperAdminSalaryDetail />} />
              <Route path="/superadmin/employee/Tellecaller/add-task" element={<SuperAdminAddTask />} />
              <Route path="/superadmin/employee/Tellecaller/view-task/:id" element={<SuperAdminViewTask />} />


              <Route path="/superadmin/salesbill/list" element={<SuperAdminSalesBillList />} />
              <Route path="/superadmin/add-salesbill" element={<SuperAdminCreateBill />} />
              <Route path="/superadmin/receipt-list" element={<SuperAdminReceiptList />} />
              <Route path="/superadmin/create-receipt" element={<SuperAdminCreateReceipt />} />
              <Route path="/superadmin/edit-receipt/:id" element={<EditReceipt />} />
              <Route path="/superadmin/view-receipt/:id" element={<SuperAdminViewReceipt />} />
              <Route path="/superadmin/addbank" element={<SuperAdminAddBank />} />
              <Route path="/superadmin/quotation-list" element={<SuperAdminQuotationList />} />
              <Route path="/superadmin/create-quotation" element={<SuperAdminCreateQuotation />} />
              <Route path="/superadmin/quotations/:id/edit" element={<SuperAdminEditQuotation />} />

              <Route path="/superadmin/accept-doctor" element={<SuperAdminAcceptDoctor />} />
              <Route path="/superadmin/create-bulk-receipt" element={<SuperAdminCreateBulkReceipt />} />
              <Route path="/superadmin/policy" element={<SuperAdminPolicyList />} />
              <Route path="/superadmin/renew-policy/:id" element={<SuperAdminRenewPolicy />} />
              <Route path="/superadmin/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/superadmin/add-policy" element={<SuperAdminAddPolicy />} />
              <Route path="/superadmin/insurance-companies" element={<SuperAdminInsuranceCompanyList />} />
              <Route path="/superadmin/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/superadmin/insurance-types" element={<SuperAdminInsuranceTypeList />} />
              <Route path="/superadmin/add-insurance-type" element={<SuperAdminAddInsuranceType />} />
              <Route path="/superadmin/service-alert-list" element={<SuperAdminServiceRenewalAlertList />} />
              <Route path="/superadmin/indemnity-alert-list" element={<SuperAdminIndemnityRenewalAlertList />} />
              <Route path="/superadmin/service-package-list" element={<ServicePackageList />} />
              <Route path="/superadmin/create-service-package" element={<SuperAdminCreateServicePkg />} />
              <Route path="/superadmin/queries" element={<SuperAdminQueriesOrCase />} />
              <Route path="/superadmin/create-query-case" element={<SuperAdminCreateQueries />} />
              <Route path="/superadmin/view-query-case/:id" element={<ViewQueries />} />

              <Route path="/superadmin/advocate-list" element={<SuperAdminAdvocateList />} />
              <Route path="/superadmin/create-advocate" element={<SuperAdminCreateAdvocateList />} />
              <Route path="/superadmin/create-advocate-bill" element={<SuperAdminCreateAdvocateBill />} />
              <Route path="/superadmin/advocate/:id" element={<ViewAdvocate />} />
              <Route path="/superadmin/expert-list" element={<SuperAdminExpertList />} />
              <Route path="/superadmin/create-expert-bill" element={<SuperAdminCreateExpertAdvocateBill />} />
              <Route path="/superadmin/create-expert" element={<SuperAdminCreateExpertList />} />
              <Route path="/superadmin/expert-bills" element={<ExpertBills />} />
              <Route path="/superadmin/expert-bill/:id" element={<ViewExpertBill />} />
              <Route path="/superadmin/edit-expert-bill/:id" element={<EditExpertBill />} />
              <Route path="/superadmin/expert-history/:expertId" element={<ExpertHistory />} />
              <Route path="/superadmin/expense-list" element={<SuperAdminExpenseList />} />
              <Route path="/superadmin/create-expense" element={<SuperAdminCreateExpense />} />
              <Route path="/superadmin/send-message" element={<SuperAdminSendMessage />} />
              <Route path="/superadmin/employee-reports" element={<SuperAdminEmployeeReports />} />
              <Route path="/superadmin/doctor-reports" element={<SuperAdminDoctorReports />} />
              {/* <Route path="/admin/doctors/:id" element={<DoctorDetailPage />} /> */}
              <Route path="/Superadmin/doctors/:id" element={<SuperAdminDoctorDetails />}>
                <Route index element={<OverviewContent />} />
                <Route path="sales-bill" element={<SalesBillPage />} />
                <Route path="receipts" element={<ReceiptsPage />} />
                <Route path="quotations" element={<QuotationsPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="inquiries" element={<InquiriesPage />} />   {/* ← Add yeh */}

              </Route>
              <Route path="/Superadmin/policy-reports" element={<SuperAdminPolicyReportPage />} />
              <Route path="/Superadmin/advocate-reports" element={<SuperAdminAdvocateReportPage />} />
              <Route path="/Superadmin/expert-reports" element={<SuperAdminExpertReportPage />} />
              <Route path="/Superadmin/expense-reports" element={<SuperAdminExpenseReportPage />} />
              <Route path="/Superadmin/case-wise-reports" element={<SuperAdminCaseWiseReportPage />} />
              <Route path="/Superadmin/dr-dob-reports" element={<SuperAdminDobReportPage />} />
              <Route path="/Superadmin/account-statement-reports" element={<SuperAdminAccountStatementReportPage />} />
              <Route path="/Superadmin/master-report" element={<MasterReportPage />} />

            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "User Management", action: "read" }]} />}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employee-list" element={<EmployeeList />} />
              <Route path="/admin/employee/view/:id" element={<ViewEmployee />} />
              <Route path="/admin/employee/edit/:id" element={<EditEmployee />} />
              <Route path="/admin/employee/add" element={<AddEmployee />} />
              <Route path="/admin/employee/Tellecaller" element={<TeleCallerList />} />
              <Route path="/admin/employee/Tellecaller/add-task" element={<AddTaskTelecaller />} />
              <Route path="/admin/employee/Tellecaller/view-task/:id" element={<ViewTask />} />
              <Route path="/admin/api-test" element={<ApiTest />} />
              <Route path="/admin/services-package" element={<ServicePackageList />} />
              <Route path="/admin/all-users" element={<UserList />} />
              <Route path="/admin/add-user" element={<CreateUser />} />
              <Route path="/admin/users/:id" element={<UserView />} />
              <Route path="/admin/users/edit/:id" element={<UserEdit />} />
              <Route path="/admin/employee/salesperson" element={<SalespersonList />} />
              <Route path="/admin/employee/salesperson/:employeeId/task-summary" element={<TaskSummaryPage />} />
              <Route path="/admin/doctor-list" element={<DoctorList />} />
              <Route path="/admin/monthly-doctors" element={<MonthlyDoctorList />} />
              <Route path="/admin/yearly-doctors" element={<YearlyDoctorList />} />
              <Route path="/admin/salesman-doctors" element={<SalesmanDoctorList />} />
              <Route path="/admin/telecaller-doctors" element={<TelecallerDoctorList />} />
              <Route path="/admin/dr-followups" element={<FollowUps />} />
              {/* <Route path="/view-doctor/:id" element={<ViewDoctor />} /> */}
              <Route path="/admin-edit-doctor/:id" element={<EditDoctorAdmin />} />
              <Route path="/admin/attendance-record" element={<AttendanceRecord />} />
              <Route path="/admin/salary-management" element={<SalaryManagement />} />
              <Route path="/admin/add-doctor" element={<AdminAddDoctor />} />
              <Route path="/admin/view/attendance-record" element={<ViewAttendanceRecoed />} />
              <Route path="/admin/attendance/employee/:employeeId" element={<ViewAttendanceRecoed />} />
              <Route path="/admin/employee/salary/view/:id" element={<SalaryDetailView />} />
              <Route path="/admin/salesbill/list" element={<SalesBill />} />
              <Route path="/admin/add-salesbill" element={<CreateBill />} />
              <Route path="/admin/edit-salesbill/:id" element={<EditSalesBill />} />
              <Route path="/admin/salesbill/print/:id" element={<SalesBillPrintWrapper />} />
              <Route path="/admin/salesbill/WN/:id" element={< WelcomeLetter />} />
              <Route path="/admin/salesbill/renewed/:id" element={< RenewalLetterExact />} />
              <Route path="/admin/salesbill/rwnl/:id" element={< RenewalContractLetter />} />
              <Route path="/admin/salesbill/membership-form/:id" element={<MembershipForm />} />
              <Route path="/admin/salesbill/membership-form-new/:id" element={<NewMembershipForm />} />
              {/* Service Agreement routes - with header and footer - handles both monthly and yearly based on type parameter */}
              {/* <Route path="/admin/salesbill/sa/:type/:id" element={<ServiceAgreement />} /> */}

              {/* Service Agreement Without Header Footer - without header and footer but with spacing */}
              <Route path="/admin/salesbill/sa-whf/:type/:id" element={<SAWithoutHeaderFooter />} />

              {/* SAWHF specific routes for monthly and yearly */}
              <Route path="/admin/salesbill/sa-whf-monthly/:id" element={<SAWHFMonthlyPlan />} />
              <Route path="/admin/salesbill/sa-whf-yearly/:id" element={<SAWHFYearlyPlan />} />

              {/* Legacy routes for backward compatibility */}
              <Route path="/admin/salesbill/sa/monthly/:id" element={<MonthlySA />} />
              <Route path="/admin/salesbill/sa/yearly/:id" element={<YearlySA />} />




              <Route path="/admin/receipt-list" element={<ReceiptList />} />
              <Route path="/admin/view-receipt/:id" element={<ViewReceipt />} />
              <Route path="/admin/edit-receipt/:id" element={<EditReceipt />} />
              <Route path="/admin/create-receipt" element={<CreateReciept />} />
              <Route path="/admin/print-receipt/:id" element={<PrintRecieptInvoice />} />
              <Route path="/admin/print-yearly-receipt/:id" element={<PrintRecieptInvoice />} />
              <Route path="/admin/print-monthly-receipt/:id" element={<MonthlyReceiptPrint />} />
              <Route path="/admin/addbank" element={<AddBank />} />


              <Route path="/admin/quotation-list" element={<QuotattionAdmin />} />
              <Route path="/admin/create-quotation" element={<CreateQuotation />} />
              <Route path="/admin/quotations/:id/edit" element={<EditQuotation />} />




              <Route path="/admin/accept-doctor" element={<AcceptDoctor />} />
              <Route path="/admin/create-bulk-receipt" element={<CreateBulkReceipt />} />
              <Route path="/admin/policy" element={<PolicyList />} />
              <Route path="/admin/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/superadmin/edit-policy/:id" element={<EditPolicy />} />
              <Route path="/admin/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/superadmin/renew-policy/:id" element={<RenewPolicy />} />
              <Route path="/admin/view-policy/:id" element={<ViewPolicy />} />
              <Route path="/superadmin/view-policy/:id" element={<ViewPolicy />} />
              <Route path="/admin/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/superadmin/policy-history/:policyNo" element={<PolicyHistory />} />
              <Route path="/admin/add-policy" element={<AddPolicy />} />
              <Route path="/admin/insurance-companies-list" element={<InsuranceCompanyList />} />
              <Route path="/admin/add-insurance-company" element={<AddInsuranceCompany />} />
              <Route path="/admin/insurance-type-list" element={<InsuranceTypeList />} />
              <Route path="/admin/add-insurance-type" element={<AddInsuranceType />} />
              <Route path="/admin/edit-insurance-type/:id" element={<EditInsuranceType />} />
              <Route path="/admin/service-alert-list" element={<ServiceRenewalAlertList />} />
              <Route path="/admin/indemnity-alert-list" element={<IndemnityRenewalAlertList />} />
              <Route path="/admin/service-package-list" element={<ServicePackageList />} />
              <Route path="/admin/create-service-package" element={<CreateServicePackage />} />
              <Route path="/admin/edit-service-package/:id" element={<EditServicePackage />} />
              <Route path="/admin/queries" element={<QueriesOrCase />} />
              <Route path="/admin/create-query-case" element={<CreateQueryCase />} />
              <Route path="/admin/view-query-case/:id" element={<ViewQueries />} />
              <Route path="/admin/queries/close-case/:id" element={<AdminCloseCase />} />
              <Route path="/admin/user" element={<CreateUser />} />
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Advocate List", action: "read" }]} />}>
                <Route path="/admin/advocate-list" element={<AdvocateList />} />
                <Route path="/admin/advocate-bills" element={<AdvocateBills />} />
                <Route path="/admin/advocate-bill/:id" element={<ViewAdvocateBill />} />
                <Route path="/admin/advocate-history/:advocateId" element={<AdvocateHistory />} />
                <Route path="/admin/advocate/:id" element={<ViewAdvocate />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Advocate List", action: "write" }]} />}>
                <Route path="/admin/create-advocate" element={<CreateAdvocateForm />} />
                <Route path="/admin/create-advocate-bill" element={<CreateAvocateBill />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Advocate List", action: "edit" }]} />}>
                <Route path="/admin/edit-advocate-bill/:id" element={<EditAdvocateBill />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Expense List", action: "read" }]} />}>
                <Route path="/admin/expense-list" element={<ExpenseList />} />
                <Route path="/admin/expense/:id" element={<ViewExpense />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Expense List", action: "write" }]} />}>
                <Route path="/admin/create-expense" element={<CreateExpense />} />
              </Route>
              <Route path="/admin/send-message" element={<SendMessage />} />

              {/* <Route path="/admin/doctors/:id" element={<DoctorDetailPage />} /> */}
              <Route path="/admin/doctors/:id" element={<DoctorDetailPage />}>
                <Route index element={<OverviewContent />} />
                <Route path="sales-bill" element={<SalesBillPage />} />
                <Route path="receipts" element={<ReceiptsPage />} />
                <Route path="quotations" element={<QuotationsPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="inquiries" element={<InquiriesPage />} />   {/* ← Add yeh */}

              </Route>

              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Expert List", action: "read" }]} />}>
                <Route path="/admin/expert-list" element={<ExpertList />} />
                <Route path="/admin/expert-bills" element={<ExpertBills />} />
                <Route path="/admin/expert-bill/:id" element={<ViewExpertBill />} />
                <Route path="/admin/expert-history/:expertId" element={<ExpertHistory />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Expert List", action: "write" }]} />}>
                <Route path="/admin/create-expert-bill" element={<ExpertBill />} />
                <Route path="/admin/create-expert" element={<ExpertForm />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Expert List", action: "edit" }]} />}>
                <Route path="/admin/edit-expert-bill/:id" element={<EditExpertBill />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Reports", action: "read" }]} />}>
                <Route path="/admin/employee-reports" element={<EmployeeReport />} />
                <Route path="/admin/doctor-reports" element={<DoctorReports />} />
                <Route path="/admin/quotation-reports" element={<QuotationReportPage />} />
                <Route path="/admin/sales-bill-reports" element={<SalesBillReportPage />} />
                <Route path="/admin/receipt-reports" element={<ReceiptReportPage />} />
                <Route path="/admin/attendance-reports" element={<AttendanceReportPage />} />
                <Route path="/admin/salary-reports" element={<SalaryReportPage />} />
                <Route path="/admin/target-reports" element={<TargetReportPage />} />
                <Route path="/admin/task-reports" element={<TaskReportPage />} />
                <Route path="/admin/policy-reports" element={<PolicyReportPage />} />
                <Route path="/admin/advocate-reports" element={<AdvocateReportPage />} />
                <Route path="/admin/expert-reports" element={<ExpertReportPage />} />
                <Route path="/admin/expense-reports" element={<ExpenseReportPage />} />
                <Route path="/admin/case-wise-reports" element={<CaseWiseReportPage />} />
                <Route path="/admin/dr-dob-reports" element={<DoctorMonthlyReportPage />} />
                <Route path="/admin/account-statement-reports" element={<AccountStatementReport />} />
                <Route path="/admin/master-report" element={<MasterReportPage />} />
              </Route>
              <Route path="/admin/invoices/individual-membership" element={<InvoiceIndividualMembership />} />
              <Route path="/admin/invoices/hospital-membership" element={<HospitalMembershipInvoice />} />
              <Route path="/admin/invoices/combined-membership" element={<CombinedMembershipInvoice />} />
              <Route path="/admin/invoice-preview" element={<QuotationInvoices />} />
              <Route path="/admin/quotation/:id" element={<QuotationInvoices />} />

            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Dashboard", action: "read" }]} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "My Profile", action: "read" }]} />}>
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/profile/membership" element={<DoctorProfile />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Personal Details", action: "read" }]} />}>
              <Route path="/doctor/profile/personal" element={<DoctorPersonalDetails />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Documents", action: "read" }]} />}>
              <Route path="/doctor/documents" element={<DoctorDocuments />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Policy History", action: "read" }]} />}>
              <Route path="/doctor/policies" element={<DoctorPolicies />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Case List", action: "read" }]} />}>
              <Route path="/doctor/cases" element={<DoctorCases />} />
              <Route path="/doctor/cases/history" element={<DoctorCases />} />
              <Route path="/doctor/view-case/:id" element={<DoctorViewCase />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Payments", action: "read" }]} />}>
              <Route path="/doctor/payments" element={<DoctorPayments />} />
            </Route>

            {/* Doctor Receipt View and Print Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Payments", action: "read" }]} />}>
              <Route path="/doctor/view-receipt/:id" element={<DoctorViewReceipt />} />
              <Route path="/doctor/print-receipt/:id" element={<DoctorPrintReceipt />} />
              <Route path="/doctor/print-monthly-receipt/:id" element={<DoctorPrintMonthlyReceipt />} />
            </Route>

            {/* Salesperson Routes - Use existing components */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Dashboard", action: "read" }]} />}>
              <Route path="/sales/dashboard" element={<SalesPersonDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Total Doctor List", action: "read" }]} />}>
              <Route path="/sales/all-doctors" element={<AllVisitedDoctorLists />} />
            </Route>


 <Route path="/salesman/profile" element={<SalespersonProfile />} />

            {/* Sales Bill List - Use admin component but with permission restrictions */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Sales Bill List", action: "read" }]} />}>
              <Route path="/sales/sales-bills" element={<SalesBill />} />
            </Route>

            {/* Advocate Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "My Assigned Cases", action: "read" }]} />}>
              <Route path="/advocate/dashboard" element={<AdvocateDashboard />} />
              <Route path="/advocate/cases" element={<AdvocateCasesPage />} />

              {/* Case Detail Routes */}
              <Route path="/advocate/case/:id" element={<CaseDetail />} />
              <Route path="/advocate/case/:id/update" element={<UpdateCase />} />
              <Route path="/advocate/case/:id/history" element={<CaseHistory />} />
              <Route path="/advocate/case/:id/close" element={<CloseCase />} />

              {/* Legacy routes (keeping for backward compatibility) */}
              <Route path="/advocate/cases/followup" element={<div className="p-6"><h1 className="text-2xl font-bold">Update Follow-up</h1><p>Follow-up management page for advocate cases.</p></div>} />
              <Route path="/advocate/cases/history" element={<div className="p-6"><h1 className="text-2xl font-bold">Case History</h1><p>Case history management page for advocate cases.</p></div>} />
              <Route path="/advocate/cases/close" element={<div className="p-6"><h1 className="text-2xl font-bold">Close Case</h1><p>Case closing page for advocate cases.</p></div>} />

              <Route path="/advocate/reports" element={<AdvocateReportPage />} /> 
              <Route path="/advocate/profile" element={<ProfileAdvocate />} />
            </Route>

            {/* Expert Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[{ formName: "Assigned Cases", action: "read" }]} />}>
              <Route path="/expert/dashboard" element={<ExpertDashboard />} />
              <Route path="/expert/cases" element={<ExpertCasesPage />} />

              {/* Case Detail Routes */}
              <Route path="/expert/case/:id" element={<ExpertCaseDetail />} />
              <Route path="/expert/case/:id/update" element={<ExpertUpdateCase />} />
              <Route path="/expert/case/:id/history" element={<ExpertCaseHistory />} />
              <Route path="/expert/case/:id/close" element={<ExpertCloseCase />} />

              <Route path="/expert/reports" element={<ExpertReportPage />} />
              <Route path="/expert/profile" element={<ProfileExpert />} />
            </Route>

            {/* Catch all other routes */}
            {/* <Route path="*" element={
              user ?
                <Navigate to={
                  user.role === 'admin' ? '/admin/dashboard' :
                  user.role === 'sales' ? '/sales/dashboard' :
                  '/telecaller/dashboard'
                } replace /> :
                <Navigate to="/login" replace />
            } /> */}

          </Routes>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

// Component to redirect user to appropriate dashboard based on their role
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'super_admin':
      return <Navigate to="/superadmin/dashboard" replace />;
    case 'sales':
    case 'salesman':
      return <Navigate to="/sales/dashboard" replace />;
    case 'telecaller':
      return <Navigate to="/telecaller/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'advocate':
      return <Navigate to="/advocate/dashboard" replace />;
    case 'expert':
      return <Navigate to="/expert/dashboard" replace />;
    default:
      return <Navigate to="/sales/dashboard" replace />;
  }
};

// Main App Component (AuthProvider now in main.jsx with Redux)
function App() {
  return <AppContent />;
}

export default App;