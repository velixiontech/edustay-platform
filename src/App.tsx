import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminKeys from "./pages/admin/AdminKeys";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentApplication from "./pages/student/StudentApplication";
import StudentContract from "./pages/student/StudentContract";
import StudentReport from "./pages/student/StudentReport";
import StudentAccommodation from "./pages/student/StudentAccommodation";
import StudentMessages from "./pages/student/StudentMessages";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerMessages from "./pages/owner/OwnerMessages";
import OwnerMaintenance from "./pages/owner/OwnerMaintenance";
import OwnerMandate from "./pages/owner/OwnerMandate";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import FinanceMessages from "./pages/finance/FinanceMessages";
import MaintenanceDashboard from "./pages/maintenance/MaintenanceDashboard";
import MaintenanceMessages from "./pages/maintenance/MaintenanceMessages";
import MaintenanceInvoices from "./pages/maintenance/MaintenanceInvoices";
import { BrowseProperties, PropertyUnits, UnitRooms } from "./pages/public/BrowseProperties";
import BookViewing from "./pages/public/BookViewing";
import SuretyDashboard from "./pages/surety/SuretyDashboard";
import SuretyApplication from "./pages/surety/SuretyApplication";
import SuretyContract from "./pages/surety/SuretyContract";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={<BrowseProperties />} />
          <Route path="/properties/:propertyId" element={<PropertyUnits />} />
          <Route path="/properties/:propertyId/units/:unitId" element={<UnitRooms />} />
          <Route path="/book-viewing" element={<BookViewing />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["principal", "admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/owners" element={<AdminOwners />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/contracts" element={<AdminContracts />} />
          <Route path="/admin/keys" element={<AdminKeys />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/messages" element={<AdminMessages />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/student/application" element={<StudentApplication />} />
          <Route path="/student/contract" element={<StudentContract />} />
          <Route path="/student/report" element={<StudentReport />} />
          <Route path="/student/accommodation" element={<StudentAccommodation />} />
          <Route path="/student/messages" element={<StudentMessages />} />

          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/owner/properties" element={<OwnerProperties />} />
          <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
          <Route path="/owner/mandate" element={<OwnerMandate />} />
          <Route path="/owner/messages" element={<OwnerMessages />} />

          <Route
            path="/finance"
            element={
              <ProtectedRoute allowedRoles={["finance"]}>
                <FinanceDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/finance/messages" element={<FinanceMessages />} />

          <Route
            path="/finance"
            element={
              <ProtectedRoute allowedRoles={["finance"]}>
                <FinanceDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/maintenance-team/invoices" element={<MaintenanceInvoices />} />
          <Route path="/maintenance-team/messages" element={<MaintenanceMessages />} />

          <Route
            path="/surety"
            element={
              <ProtectedRoute allowedRoles={["surety"]}>
                <SuretyDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/surety/application" element={<SuretyApplication />} />
          <Route path="/surety/contract" element={<SuretyContract />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
   </AuthProvider>
  </QueryClientProvider>
);

export default App;
