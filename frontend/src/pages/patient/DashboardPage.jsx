import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
} from "@mui/material";
import {
  Search,
  Event,
  Person,
  PendingActions,
  Payment,
} from "@mui/icons-material";
import { fetchAppointments } from "../../store/slices/appointmentsSlice";
import dayjs from "dayjs";
import GradientHeader from "../../components/common/GradientHeader";
import DoctorAvatar from "../../components/common/DoctorAvatar";
import StatCard from "../../components/common/StatCard";
import AnimatedCounter from "../../components/common/AnimatedCounter";
import EmptyState from "../../components/common/EmptyState";
import PageSection from "../../components/common/PageSection";
import StatusChip from "../../components/common/StatusChip";
import SectionHeader from "../../components/common/SectionHeader";
import AgentWidget from "../../components/agent/AgentWidget";

export default function PatientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: appointments, loading } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcoming = appointments.filter(
    (a) => dayjs(a.scheduled_at).isAfter(dayjs()) && a.status !== "CANCELLED",
  );
  const pending = appointments.filter((a) => a.status === "PENDING");

  const statCards = [
    {
      icon: <Search sx={{ fontSize: 28 }} />,
      label: "Find Doctors",
      value: "Browse",
      path: "/patient/doctors",
    },
    {
      icon: <Event sx={{ fontSize: 28 }} />,
      label: "Appointments",
      value: upcoming.length,
      path: "/patient/appointments",
    },
    {
      icon: <PendingActions sx={{ fontSize: 28 }} />,
      label: "Pending",
      value: pending.length,
      path: "/patient/appointments",
    },
    {
      icon: <Person sx={{ fontSize: 28 }} />,
      label: "Profile",
      value: "Edit",
      path: "/patient/profile",
    },
    {
      icon: <Payment sx={{ fontSize: 28 }} />,
      label: "Payments",
      value: "View",
      path: "/patient/payments",
    },
  ];

  return (
    <Box>
      {/* Welcome Hero — Split Layout */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 100%)",
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          mb: 4,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", bgcolor: "#fff", opacity: 0.06 }} />
        <Box sx={{ position: "absolute", bottom: -80, left: -40, width: 280, height: 280, borderRadius: "50%", bgcolor: "#fff", opacity: 0.06 }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
          {/* Left: text + stats + CTA */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Welcome, {user?.first_name || user?.username} 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2.5, maxWidth: 500 }}>
              Manage your medical appointments and connect with trusted healthcare providers.
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Montserrat", sans-serif' }}>
                  <AnimatedCounter end={upcoming.length} duration={1200} />
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>Upcoming</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Montserrat", sans-serif' }}>
                  <AnimatedCounter end={pending.length} duration={1200} />
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>Pending</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate("/patient/doctors")}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                fontWeight: 600,
                px: 3,
                py: 1.2,
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" },
              }}
            >
              Book Appointment
            </Button>
          </Box>

          {/* Right: Doctor image with floating card */}
          <Box sx={{ position: "relative", width: { xs: 200, md: 280 }, flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <Box
              component="img"
              src="/assets/img/health/staff-10.webp"
              alt="Doctor"
              sx={{ width: "100%", borderRadius: 3, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
            />
            {upcoming.length > 0 && (
              <Card
                sx={{
                  position: "absolute",
                  bottom: -16,
                  left: -24,
                  bgcolor: "#fff",
                  color: "#112344",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#175cdd" }}>
                  Next Appointment
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {dayjs(upcoming[0].scheduled_at).format("MMM D · h:mm A")}
                </Typography>
              </Card>
            )}
          </Box>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} mb={4}>
        {statCards.map((card, i) => (
          <Grid
            size={{ xs: 6, md: 3 }}
            key={i}
            data-aos="fade-up"
            data-aos-delay={String(i * 100)}
          >
            <StatCard
              icon={card.icon}
              value={card.value}
              label={card.label}
              gradientIndex={i}
              onClick={() => navigate(card.path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Appointments */}
      <PageSection bg="#fff">
        <Container maxWidth="lg">
          <SectionHeader title="Upcoming Appointments" dataAos="fade-up" />
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : upcoming.length === 0 ? (
            <EmptyState
              image="/assets/img/health/consultation-4.webp"
              title="No upcoming appointments"
              description="Book your first appointment and start your health journey."
              actionLabel="Find Doctors"
              actionTo="/patient/doctors"
            />
          ) : (
            <Grid container spacing={2}>
              {upcoming.slice(0, 6).map((appt, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={appt.id} data-aos="fade-up" data-aos-delay={String(i * 80)}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
                      borderLeft: "4px solid",
                      borderColor:
                        appt.status === "CONFIRMED"
                          ? "#059669"
                          : appt.status === "PENDING"
                            ? "#d97706"
                            : "#175cdd",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <DoctorAvatar doctor={{ first_name: appt.doctor_name?.split(" ")[0], last_name: appt.doctor_name?.split(" ").slice(1).join(" "), id: appt.doctor }} size={44} showStatus />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: "#112344" }}>
                            {appt.doctor_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appt.specialty_name}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1, color: "#3c4049" }}>
                        📅 {dayjs(appt.scheduled_at).format("MMM D, YYYY · h:mm A")}
                      </Typography>
                      <StatusChip status={appt.status} type="appointment" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </PageSection>

      <AgentWidget />
    </Box>
  );
}
