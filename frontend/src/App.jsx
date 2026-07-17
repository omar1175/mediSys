import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { fetchMe } from "./store/slices/authSlice";

import AppLayout from "./components/Layout/AppLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import GuestRoute from "./components/Layout/GuestRoute";
import NotFoundPage from "./components/common/NotFoundPage";

// Public pages
const HomePage = lazy(() => import("./pages/public/HomePage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const DepartmentsPage = lazy(() => import("./pages/public/DepartmentsPage"));
const ServicesPage = lazy(() => import("./pages/public/ServicesPage"));
const DoctorsPage = lazy(() => import("./pages/public/DoctorsPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));
const FAQPage = lazy(() => import("./pages/public/FAQPage"));
const GalleryPage = lazy(() => import("./pages/public/GalleryPage"));
const TestimonialsPage = lazy(() => import("./pages/public/TestimonialsPage"));
const TermsPage = lazy(() => import("./pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/public/PrivacyPage"));
const DepartmentDetailsPage = lazy(
  () => import("./pages/public/DepartmentDetailsPage"),
);
const ServiceDetailsPage = lazy(
  () => import("./pages/public/ServiceDetailsPage"),
);
const AppointmentPage = lazy(() => import("./pages/public/AppointmentPage"));

// Auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ConfirmEmailPage = lazy(() => import("./pages/auth/ConfirmEmailPage"));
const ResendEmailPage = lazy(() => import("./pages/auth/ResendEmailPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

// Patient pages
const PatientDashboard = lazy(() => import("./pages/patient/DashboardPage"));
const DoctorListPage = lazy(() => import("./pages/patient/DoctorListPage"));
const DoctorDetailPage = lazy(() => import("./pages/patient/DoctorDetailPage"));
const BookAppointmentPage = lazy(
  () => import("./pages/patient/BookAppointmentPage"),
);
const PatientAppointmentsPage = lazy(
  () => import("./pages/patient/AppointmentsPage"),
);
const PatientProfilePage = lazy(() => import("./pages/patient/ProfilePage"));
const PatientMedicalHistoryPage = lazy(
  () => import("./pages/patient/MedicalHistoryPage"),
);
const PaymentHistory = lazy(() => import("./pages/payments/PaymentHistory"));
const PaymentDetails = lazy(() => import("./pages/payments/PaymentDetails"));

// Doctor pages
const DoctorDashboard = lazy(() => import("./pages/doctor/DashboardPage"));
const AvailabilityPage = lazy(() => import("./pages/doctor/AvailabilityPage"));
const DoctorAppointmentsPage = lazy(
  () => import("./pages/doctor/AppointmentsPage"),
);
const DoctorProfilePage = lazy(() => import("./pages/doctor/ProfilePage"));
const PatientSearchPage = lazy(
  () => import("./pages/doctor/PatientSearchPage"),
);
const DoctorPatientMedicalHistoryPage = lazy(
  () => import("./pages/doctor/PatientMedicalHistoryPage"),
);
const SubscriptionPlans = lazy(() => import("./pages/payments/SubscriptionPlans"));

// Chat pages
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));

// Video call pages
const VideoCallPage = lazy(() => import("./pages/calls/VideoCallPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminSpecialtiesPage = lazy(
  () => import("./pages/admin/SpecialtiesPage"),
);
const AdminAppointmentsPage = lazy(
  () => import("./pages/admin/AppointmentsPage"),
);

// Test pages
const TestDashboard = lazy(() => import("./pages/test/TestDashboard"));

function PageLoader() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
      <CircularProgress size={36} thickness={4} sx={{ color: "#175cdd" }} />
    </Box>
  );
}

function LazyRoute({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <LazyRoute>
              <HomePage />
            </LazyRoute>
          }
        />
        <Route
          path="/about"
          element={
            <LazyRoute>
              <AboutPage />
            </LazyRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <LazyRoute>
              <DepartmentsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/services"
          element={
            <LazyRoute>
              <ServicesPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <LazyRoute>
              <DoctorsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <LazyRoute>
              <ContactPage />
            </LazyRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <LazyRoute>
              <FAQPage />
            </LazyRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <LazyRoute>
              <GalleryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/testimonials"
          element={
            <LazyRoute>
              <TestimonialsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <LazyRoute>
              <TermsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <LazyRoute>
              <PrivacyPage />
            </LazyRoute>
          }
        />
        <Route
          path="/department-details"
          element={
            <LazyRoute>
              <DepartmentDetailsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/service-details"
          element={
            <LazyRoute>
              <ServiceDetailsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <LazyRoute>
              <AppointmentPage />
            </LazyRoute>
          }
        />
      </Route>

      {/* Guest routes */}
      <Route
        path="/login"
        element={
          <LazyRoute>
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          </LazyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <LazyRoute>
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          </LazyRoute>
        }
      />
      <Route
        path="/confirm-email"
        element={
          <LazyRoute>
            <ConfirmEmailPage />
          </LazyRoute>
        }
      />
      <Route
        path="/resend-email"
        element={
          <LazyRoute>
            <ResendEmailPage />
          </LazyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <LazyRoute>
            <ForgotPasswordPage />
          </LazyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <LazyRoute>
            <ResetPasswordPage />
          </LazyRoute>
        }
      />

      {/* Patient routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/patient/dashboard"
          element={
            <LazyRoute>
              <PatientDashboard />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <LazyRoute>
              <DoctorListPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/doctors/:id"
          element={
            <LazyRoute>
              <DoctorDetailPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/doctors/:id/book"
          element={
            <LazyRoute>
              <BookAppointmentPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <LazyRoute>
              <PatientAppointmentsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/medical-history"
          element={
            <LazyRoute>
              <PatientMedicalHistoryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <LazyRoute>
              <PatientProfilePage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/payments"
          element={
            <LazyRoute>
              <PaymentHistory />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/payments/:id"
          element={
            <LazyRoute>
              <PaymentDetails />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/chat"
          element={
            <LazyRoute>
              <ChatPage />
            </LazyRoute>
          }
        />
        <Route
          path="/patient/appointments/:appointmentId/call"
          element={
            <LazyRoute>
              <VideoCallPage />
            </LazyRoute>
          }
        />
      </Route>

      {/* Doctor routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/doctor/dashboard"
          element={
            <LazyRoute>
              <DoctorDashboard />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/availability"
          element={
            <LazyRoute>
              <AvailabilityPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <LazyRoute>
              <DoctorAppointmentsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/medical-history"
          element={
            <LazyRoute>
              <PatientSearchPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/medical-history/:patientId"
          element={
            <LazyRoute>
              <DoctorPatientMedicalHistoryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <LazyRoute>
              <DoctorProfilePage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/subscription"
          element={
            <LazyRoute>
              <SubscriptionPlans />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/chat"
          element={
            <LazyRoute>
              <ChatPage />
            </LazyRoute>
          }
        />
        <Route
          path="/doctor/appointments/:appointmentId/call"
          element={
            <LazyRoute>
              <VideoCallPage />
            </LazyRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <LazyRoute>
              <AdminDashboard />
            </LazyRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <LazyRoute>
              <AdminUsersPage />
            </LazyRoute>
          }
        />
        <Route
          path="/admin/specialties"
          element={
            <LazyRoute>
              <AdminSpecialtiesPage />
            </LazyRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <LazyRoute>
              <AdminAppointmentsPage />
            </LazyRoute>
          }
        />
      </Route>

      {/* Test route */}
      <Route
        path="/test"
        element={
          <LazyRoute>
            <TestDashboard />
          </LazyRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
