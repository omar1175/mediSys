import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Card, CardContent, Avatar, Chip, IconButton,
  Tooltip, Divider, Grid, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Button,
} from "@mui/material";
import {
  CheckCircle, Cancel, Done, Event, Pending, Schedule,
} from "@mui/icons-material";
import {
  fetchAppointments, confirmAppointment, completeAppointment, cancelAppointment,
} from "../../store/slices/appointmentsSlice";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import dayjs from "dayjs";

const STAT_CARDS = [
  { key: "TODAY", label: "Today", icon: <Event />, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { key: "PENDING", label: "Pending", icon: <Pending />, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { key: "CONFIRMED", label: "Confirmed", icon: <Schedule />, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { key: "COMPLETED", label: "Completed", icon: <CheckCircle />, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
];

export default function DoctorAppointmentsPage() {
  const dispatch = useDispatch();
  const { list: appointments, loading } = useSelector((s) => s.appointments);
  const [actionNotes, setActionNotes] = useState("");
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const counts = useMemo(() => {
    const c = { total: appointments.length, PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, TODAY: 0 };
    const todayStr = dayjs().format("YYYY-MM-DD");
    appointments.forEach((a) => {
      if (c[a.status] !== undefined) c[a.status]++;
      if (dayjs(a.scheduled_at).format("YYYY-MM-DD") === todayStr) c.TODAY++;
    });
    return c;
  }, [appointments]);

  const today = useMemo(
    () => appointments.filter((a) => dayjs(a.scheduled_at).isSame(dayjs(), "day")),
    [appointments]
  );
  const upcoming = useMemo(
    () => appointments.filter(
      (a) => dayjs(a.scheduled_at).isAfter(dayjs(), "day") && ["CONFIRMED", "PENDING"].includes(a.status)
    ),
    [appointments]
  );
  const past = useMemo(
    () => appointments.filter((a) =>
      dayjs(a.scheduled_at).isBefore(dayjs(), "day") || ["COMPLETED", "CANCELLED"].includes(a.status)
    ),
    [appointments]
  );

  const openNotesDialog = (fn, id, label) => {
    setPendingAction({ fn, id, label });
    setActionNotes("");
    setNotesDialogOpen(true);
  };

  const executeConfirmedAction = async () => {
    if (!pendingAction) return;
    const { fn, id, label } = pendingAction;
    const result = await dispatch(fn({ id, notes: actionNotes }));
    if (!result.error) {
      setSnack({ open: true, msg: `${label} successfully.`, severity: "success" });
    } else {
      setSnack({ open: true, msg: `Failed to ${label.toLowerCase()}.`, severity: "error" });
    }
    setNotesDialogOpen(false);
    setPendingAction(null);
  };

  const statusColor = (s) => {
    if (s === "CONFIRMED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "CANCELLED") return "error";
    return "default";
  };

  const initials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const renderAppointmentCard = (a, showActions = true) => (
    <Card key={a.id} sx={{ mb: 1.5, "&:hover": { boxShadow: 2 } }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, "&:last-child": { pb: 2 } }}>
        <Avatar sx={{ width: 44, height: 44, bgcolor: "primary.light", color: "primary.contrastText", fontWeight: 700 }}>
          {initials(a.patient_name)}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography fontWeight={600}>{a.patient_name}</Typography>
            <Chip label={a.status} size="small" color={statusColor(a.status)} sx={{ fontWeight: 600 }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {a.specialty_name} &middot; {dayjs(a.scheduled_at).format("MMM D, YYYY h:mm A")} &middot; {a.duration_minutes} min
          </Typography>
          {a.notes && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {a.notes}
            </Typography>
          )}
        </Box>
        {showActions && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {a.status === "PENDING" && (
              <>
                <Tooltip title="Confirm">
                  <IconButton color="success" size="small" onClick={() => openNotesDialog(confirmAppointment, a.id, "Appointment confirmed")}>
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton color="error" size="small" onClick={() => openNotesDialog(cancelAppointment, a.id, "Appointment rejected")}>
                    <Cancel fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {a.status === "CONFIRMED" && (
              <Tooltip title="Mark Complete">
                <IconButton color="primary" size="small" onClick={() => {
                  setPendingAction({ fn: completeAppointment, id: a.id, label: "Appointment completed" });
                  setActionNotes("");
                  setNotesDialogOpen(true);
                }}>
                  <Done fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Appointments
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage your patient appointments
      </Typography>

      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 6, md: 3 }} key={card.key}>
            <Card sx={{ background: card.gradient, color: "#fff" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 48, height: 48 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{counts[card.key]}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{card.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {today.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Event color="primary" /> Today
          </Typography>
          {today.map((a) => renderAppointmentCard(a))}
        </Box>
      )}

      {upcoming.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Schedule color="info" /> Upcoming
          </Typography>
          {upcoming.map((a) => renderAppointmentCard(a))}
        </Box>
      )}

      {past.length > 0 && (
        <Box mb={3}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Past & Completed
          </Typography>
          {past.map((a) => renderAppointmentCard(a, false))}
        </Box>
      )}

      {appointments.length === 0 && (
        <Box textAlign="center" py={6}>
          <Event sx={{ fontSize: 64, color: "grey.300", mb: 1 }} />
          <Typography color="text.secondary" variant="h6">No appointments yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Appointments will appear here once patients book with you.
          </Typography>
        </Box>
      )}

      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {pendingAction?.label || "Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add a note to include with this action (optional).
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
            placeholder="Enter any notes for the patient..."
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setNotesDialogOpen(false); setPendingAction(null); }}>Cancel</Button>
          <Button variant="contained" onClick={executeConfirmedAction} color={pendingAction?.fn === cancelAppointment ? "error" : "primary"}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
