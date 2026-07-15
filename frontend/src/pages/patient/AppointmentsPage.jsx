import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, IconButton, Tooltip, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from "@mui/material";
import { Cancel, EventBusy, Schedule } from "@mui/icons-material";
import { fetchAppointments, cancelAppointment, rescheduleAppointment, clearAppointmentSuccess, clearAppointmentError } from "../../store/slices/appointmentsSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function PatientAppointmentsPage() {
  const dispatch = useDispatch();
  const { list: appointments, loading, success, error } = useSelector((s) => s.appointments);
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchAppointments(params));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (success) {
      setSnack({ open: true, msg: success, severity: "success" });
      dispatch(clearAppointmentSuccess());
    }
  }, [success, dispatch]);

  const handleCancel = () => {
    if (cancelId) {
      dispatch(cancelAppointment(cancelId));
      setCancelId(null);
    }
  };

  const handleReschedule = () => {
    if (rescheduleAppt && newDate) {
      dispatch(rescheduleAppointment({ id: rescheduleAppt.id, data: { scheduled_at: newDate.toISOString() } }));
      setRescheduleAppt(null);
      setNewDate(null);
    }
  };

  const upcoming = appointments.filter(
    (a) => dayjs(a.scheduled_at).isAfter(dayjs()) && a.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (a) => dayjs(a.scheduled_at).isBefore(dayjs()) || a.status === "CANCELLED"
  );

  const statusColor = (s) => {
    if (s === "CONFIRMED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "CANCELLED") return "error";
    return "default";
  };

  if (loading && appointments.length === 0) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Appointments</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearAppointmentError())}>
          {typeof error === "string" ? error : error.detail || "An error occurred."}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        {[
          { key: "", label: "Total", color: "primary", count: appointments.length },
          { key: "PENDING", label: "Pending", color: "warning.main", count: appointments.filter(a => a.status === "PENDING").length },
          { key: "CONFIRMED", label: "Confirmed", color: "success.main", count: appointments.filter(a => a.status === "CONFIRMED").length },
          { key: "CANCELLED", label: "Cancelled", color: "error.main", count: appointments.filter(a => a.status === "CANCELLED").length },
        ].map((card) => (
          <Grid size={{ xs: 12, md: 3 }} key={card.key}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                ...(statusFilter === card.key ? { outline: "2px solid", outlineColor: card.color, outlineOffset: 2 } : {}),
              }}
              onClick={() => setStatusFilter(card.key)}
            >
              <CardContent>
                <Typography variant="h3" color={card.color}>{card.count}</Typography>
                <Typography color="text.secondary">{card.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>Upcoming</Typography>
      {upcoming.length === 0 ? (
        <Typography color="text.secondary" mb={3}>No upcoming appointments.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcoming.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.doctor_name}</TableCell>
                  <TableCell>{a.specialty_name}</TableCell>
                  <TableCell>{dayjs(a.scheduled_at).format("MMM D, YYYY h:mm A")}</TableCell>
                  <TableCell><Chip label={a.status} size="small" color={statusColor(a.status)} /></TableCell>
                  <TableCell align="right">
                    {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                      <>
                        <Tooltip title="Reschedule">
                          <IconButton color="primary" onClick={() => { setRescheduleAppt(a); setNewDate(dayjs(a.scheduled_at)); }}>
                            <Schedule />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton color="error" onClick={() => setCancelId(a.id)}>
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6" gutterBottom>Past / Cancelled</Typography>
      {past.length === 0 ? (
        <Typography color="text.secondary">No past appointments.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {past.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.doctor_name}</TableCell>
                  <TableCell>{a.specialty_name}</TableCell>
                  <TableCell>{dayjs(a.scheduled_at).format("MMM D, YYYY h:mm A")}</TableCell>
                  <TableCell><Chip label={a.status} size="small" color={statusColor(a.status)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />

      <Dialog open={!!rescheduleAppt} onClose={() => setRescheduleAppt(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="New date & time"
            value={newDate}
            onChange={setNewDate}
            minDateTime={dayjs()}
            sx={{ mt: 2, width: "100%" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRescheduleAppt(null); setNewDate(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleReschedule} disabled={!newDate || newDate.isSame(dayjs(rescheduleAppt?.scheduled_at), "minute")}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
