import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, CardActionArea,
  Avatar, Divider,
} from "@mui/material";
import {
  People, Category, Event, MedicalServices, CheckCircle,
} from "@mui/icons-material";
import { fetchAppointments } from "../../store/slices/appointmentsSlice";
import { fetchDoctors, fetchSpecialties } from "../../store/slices/doctorsSlice";
import dayjs from "dayjs";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: appointments } = useSelector((s) => s.appointments);
  const { list: doctors, specialties } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome back, {user?.first_name || "Admin"}
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Here is what is happening across your platform today
      </Typography>

      <Grid container spacing={2} mb={4}>
        {[
          { icon: <MedicalServices />, label: "Doctors", value: doctors.length, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
          { icon: <Category />, label: "Specialties", value: specialties.length, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
          { icon: <Event />, label: "Appointments", value: appointments.length, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
          { icon: <CheckCircle />, label: "Completed", value: completed, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
        ].map((card, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card sx={{ background: card.gradient, color: "#fff" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 48, height: 48 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{card.value}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{card.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2} mb={4}>
        {[
          { icon: <People sx={{ fontSize: 36 }} />, title: "Manage Users", desc: "View, approve, or block users", path: "/admin/users", color: "primary" },
          { icon: <Category sx={{ fontSize: 36 }} />, title: "Specialties", desc: "Manage medical specialties", path: "/admin/specialties", color: "secondary" },
          { icon: <Event sx={{ fontSize: 36 }} />, title: "All Appointments", desc: "View all system appointments", path: "/admin/appointments", color: "success" },
        ].map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.path}>
            <Card>
              <CardActionArea onClick={() => navigate(item.path)} sx={{ p: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: `${item.color}.light`, color: `${item.color}.contrastText`, mb: 1.5 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {appointments.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom mt={2}>
            Recent Activity
          </Typography>
          <Grid container spacing={1.5}>
            {appointments.slice(0, 6).map((a) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={a.id}>
                <Card sx={{ "&:hover": { boxShadow: 2 } }}>
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>#{a.id} — {a.patient_name}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontWeight: 600,
                          color: "#fff",
                          bgcolor:
                            a.status === "CONFIRMED" ? "success.main" :
                            a.status === "PENDING" ? "warning.main" :
                            a.status === "CANCELLED" ? "error.main" : "grey.500",
                        }}
                      >
                        {a.status}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {a.doctor_name} &middot; {dayjs(a.scheduled_at).format("MMM D, h:mm A")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
