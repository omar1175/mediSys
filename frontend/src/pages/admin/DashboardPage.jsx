import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, Container, Avatar, Chip,
} from "@mui/material";
import {
  People, Category, Event, MedicalServices, CheckCircle,
} from "@mui/icons-material";
import { fetchAppointments } from "../../store/slices/appointmentsSlice";
import { fetchDoctors, fetchSpecialties } from "../../store/slices/doctorsSlice";
import { adminService } from "../../services/adminService";
import dayjs from "dayjs";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import PageSection from "../../components/common/PageSection";
import AnimatedCounter from "../../components/common/AnimatedCounter";
import SectionHeader from "../../components/common/SectionHeader";

const QUICK_ACTION_IMAGES = [
  "/assets/img/health/staff-1.webp",
  "/assets/img/health/cardiology-1.webp",
  "/assets/img/health/consultation-4.webp",
];

const STATUS_DOT_COLORS = {
  PENDING: "#f59e0b",
  CONFIRMED: "#175cdd",
  COMPLETED: "#059669",
  CANCELLED: "#ef4444",
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: appointments } = useSelector((s) => s.appointments);
  const { list: doctors, specialties } = useSelector((s) => s.doctors);
  const [stats, setStats] = useState({ total_doctors: 0, total_patients: 0, total_appointments: 0, total_specialties: 0 });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    dispatch(fetchSpecialties());
    adminService.getStats().then((res) => setStats(res.data)).catch(() => {});
  }, [dispatch]);

  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  const statCards = [
    { icon: <MedicalServices sx={{ fontSize: 28 }} />, label: "Doctors", value: stats.total_doctors || doctors.length },
    { icon: <Category sx={{ fontSize: 28 }} />, label: "Specialties", value: stats.total_specialties || specialties.length },
    { icon: <Event sx={{ fontSize: 28 }} />, label: "Appointments", value: stats.total_appointments || appointments.length },
    { icon: <CheckCircle sx={{ fontSize: 28 }} />, label: "Completed", value: completed },
  ];

  const quickActions = [
    { icon: <People sx={{ fontSize: 32 }} />, title: "Manage Users", desc: "View, approve, or block users", path: "/admin/users" },
    { icon: <Category sx={{ fontSize: 32 }} />, title: "Specialties", desc: "Manage medical specialties", path: "/admin/specialties" },
    { icon: <Event sx={{ fontSize: 32 }} />, title: "All Appointments", desc: "View all system appointments", path: "/admin/appointments" },
  ];

  return (
    <Box>
      {/* Hero Section with Image */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #175cdd 100%)",
          color: "#fff",
          minHeight: 260,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
        <Box sx={{ position: "absolute", bottom: -40, left: "30%", width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", top: "20%", left: -30, width: 100, height: 100, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.03)" }} />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", width: "100%", alignItems: "center", px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 }, gap: 4, flexDirection: { xs: "column", md: "row" } }}>
          {/* Text Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Welcome back, {user?.first_name || "Admin"} 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 450, mb: 2 }}>
              Here is what is happening across your platform today.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={<><AnimatedCounter end={doctors.length} /> Doctors</>}
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, backdropFilter: "blur(4px)" }}
              />
              <Chip
                label={<><AnimatedCounter end={appointments.length} /> Appointments</>}
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, backdropFilter: "blur(4px)" }}
              />
            </Box>
          </Box>

          {/* Hero Image with floating cards */}
          <Box sx={{ position: "relative", width: { xs: "100%", md: 300 }, height: { xs: 200, md: 220 }, flexShrink: 0 }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src="/assets/img/health/facilities-9.webp"
                alt="Clinic"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            {/* Floating card 1 */}
            <Card
              sx={{
                position: "absolute",
                top: -12,
                left: -20,
                borderRadius: 2,
                p: 1.5,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
                color: "#112344",
              }}
            >
              <Avatar sx={{ bgcolor: "#175cdd", width: 36, height: 36 }}>
                <People sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{stats.total_patients}+</Typography>
                <Typography variant="caption" sx={{ display: "block", color: "#64748b", fontSize: "0.65rem" }}>Active Users</Typography>
              </Box>
            </Card>
            {/* Floating card 2 */}
            <Card
              sx={{
                position: "absolute",
                bottom: -10,
                right: -16,
                borderRadius: 2,
                p: 1.5,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
                color: "#112344",
              }}
            >
              <Avatar sx={{ bgcolor: "#059669", width: 36, height: 36 }}>
                <CheckCircle sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{completed}</Typography>
                <Typography variant="caption" sx={{ display: "block", color: "#64748b", fontSize: "0.65rem" }}>Completed</Typography>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ px: 0 }}>
        {/* Stat Cards */}
        <Grid container spacing={2.5} mb={4}>
          {statCards.map((card, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i} data-aos="fade-up" data-aos-delay={String(i * 100)}>
              <StatCard icon={card.icon} value={card.value} label={card.label} gradientIndex={i} />
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box data-aos="fade-up" data-aos-delay="0">
          <Typography variant="h5" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344", mb: 2.5 }}>
            Quick Actions
          </Typography>
        </Box>
        <Grid container spacing={2.5} mb={4}>
          {quickActions.map((item, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.path} data-aos="fade-up" data-aos-delay={String((i + 1) * 100)}>
              <Card
                onClick={() => navigate(item.path)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
                }}
              >
                <Box sx={{ height: 140, overflow: "hidden", position: "relative" }}>
                  <img
                    src={QUICK_ACTION_IMAGES[i]}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "60%",
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: "1rem" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Timeline */}
        {appointments.length > 0 && (
          <PageSection bg="#f4f8ff" sx={{ borderRadius: 3, mb: 4 }} data-aos="fade-up">
            <Box sx={{ px: { xs: 2, md: 3 } }}>
              <Typography variant="h5" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344", mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ position: "relative" }}>
                {/* Timeline vertical line */}
                <Box sx={{ position: "absolute", left: 15, top: 8, bottom: 8, width: 2, bgcolor: "#e2e8f0" }} />
                {appointments.slice(0, 6).map((a, idx) => (
                  <Box
                    key={a.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: idx < Math.min(appointments.length, 6) - 1 ? 2.5 : 0,
                      position: "relative",
                    }}
                    data-aos="fade-up"
                    data-aos-delay={String(idx * 80)}
                  >
                    {/* Colored dot */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: STATUS_DOT_COLORS[a.status] || "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                        flexShrink: 0,
                        boxShadow: `0 0 0 4px ${STATUS_DOT_COLORS[a.status] || "#94a3b8"}22`,
                      }}
                    >
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#fff" }} />
                    </Box>
                    {/* Content */}
                    <Card
                      sx={{
                        flex: 1,
                        transition: "all 0.2s ease",
                        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
                      }}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.25 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: "#112344" }}>
                            #{a.id} — {a.patient_name}
                          </Typography>
                          <StatusChip status={a.status} type="appointment" />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {a.doctor_name} · {dayjs(a.scheduled_at).format("MMM D, h:mm A")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          </PageSection>
        )}
      </Container>
    </Box>
  );
}
