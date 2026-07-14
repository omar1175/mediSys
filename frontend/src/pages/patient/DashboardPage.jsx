import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, CardActionArea,
  Button, Chip, Divider,
} from "@mui/material";
import { Event, Search, Person } from "@mui/icons-material";
import { fetchAppointments } from "../../store/slices/appointmentsSlice";
import dayjs from "dayjs";

export default function PatientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: appointments, loading } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcoming = appointments.filter(
    (a) => dayjs(a.scheduled_at).isAfter(dayjs()) && a.status !== "CANCELLED"
  );
  const pending = appointments.filter((a) => a.status === "PENDING");

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.first_name || user?.username}
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage your medical appointments
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/patient/doctors")} sx={{ p: 3 }}>
              <CardContent>
                <Search color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Find Doctors</Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse available doctors and book
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/patient/appointments")} sx={{ p: 3 }}>
              <CardContent>
                <Event color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">My Appointments</Typography>
                <Typography variant="body2" color="text.secondary">
                  {upcoming.length} upcoming
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/patient/profile")} sx={{ p: 3 }}>
              <CardContent>
                <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">My Profile</Typography>
                <Typography variant="body2" color="text.secondary">
                  Edit your information
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : upcoming.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary" gutterBottom>No upcoming appointments</Typography>
          <Button variant="contained" onClick={() => navigate("/patient/doctors")}>
            Book Now
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {upcoming.slice(0, 5).map((appt) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={appt.id}>
              <Card>
                <CardContent>
                  <Typography fontWeight={600}>{appt.doctor_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appt.specialty_name}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {dayjs(appt.scheduled_at).format("MMM D, YYYY h:mm A")}
                  </Typography>
                  <Chip
                    label={appt.status}
                    size="small"
                    color={appt.status === "CONFIRMED" ? "success" : appt.status === "PENDING" ? "warning" : "default"}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {pending.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>Pending Approval ({pending.length})</Typography>
          <Typography variant="body2" color="text.secondary">
            You have {pending.length} appointment(s) waiting for doctor confirmation.
          </Typography>
        </>
      )}
    </Box>
  );
}
