import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/slices/authSlice";

import AppLayout from "./components/Layout/AppLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import GuestRoute from "./components/Layout/GuestRoute";
import NotFoundPage from "./components/common/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import ResendEmailPage from "./pages/auth/ResendEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import PatientDashboard from "./pages/patient/DashboardPage";
import DoctorListPage from "./pages/patient/DoctorListPage";
import DoctorDetailPage from "./pages/patient/DoctorDetailPage";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import PatientAppointmentsPage from "./pages/patient/AppointmentsPage";
import PatientProfilePage from "./pages/patient/ProfilePage";

import DoctorDashboard from "./pages/doctor/DashboardPage";
import AvailabilityPage from "./pages/doctor/AvailabilityPage";
import DoctorAppointmentsPage from "./pages/doctor/AppointmentsPage";
import DoctorProfilePage from "./pages/doctor/ProfilePage";

import AdminDashboard from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminSpecialtiesPage from "./pages/admin/SpecialtiesPage";
import AdminAppointmentsPage from "./pages/admin/AppointmentsPage";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Guest routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      <Route path="/resend-email" element={<ResendEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Patient routes */}
      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]}><AppLayout /></ProtectedRoute>}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/doctors" element={<DoctorListPage />} />
        <Route path="/patient/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/patient/doctors/:id/book" element={<BookAppointmentPage />} />
        <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
      </Route>

      {/* Doctor routes */}
      <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]}><AppLayout /></ProtectedRoute>}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/availability" element={<AvailabilityPage />} />
        <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}><AppLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/specialties" element={<AdminSpecialtiesPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
