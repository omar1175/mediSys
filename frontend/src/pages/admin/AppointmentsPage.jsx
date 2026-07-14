import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, TextField, InputAdornment,
  Grid, Card, CardContent, Avatar, IconButton, Tooltip,
} from "@mui/material";
import {
  Search, Event, Pending, CheckCircle, Cancel,
} from "@mui/icons-material";
import { fetchAppointments } from "../../store/slices/appointmentsSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import dayjs from "dayjs";

const STAT_CARDS = [
  { key: "total", label: "Total", icon: <Event />, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { key: "PENDING", label: "Pending", icon: <Pending />, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { key: "CONFIRMED", label: "Confirmed", icon: <CheckCircle />, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { key: "CANCELLED", label: "Cancelled", icon: <Cancel />, gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
];

export default function AdminAppointmentsPage() {
  const dispatch = useDispatch();
  const { list: appointments, loading } = useSelector((s) => s.appointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const counts = useMemo(() => {
    const c = { total: appointments.length, PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    appointments.forEach((a) => { if (c[a.status] !== undefined) c[a.status]++; });
    return c;
  }, [appointments]);

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.patient_name?.toLowerCase().includes(q) ||
          a.doctor_name?.toLowerCase().includes(q) ||
          a.specialty_name?.toLowerCase().includes(q) ||
          String(a.id).includes(q)
      );
    }
    return list;
  }, [appointments, statusFilter, search]);

  const paginated = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const statusColor = (s) => {
    if (s === "CONFIRMED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "CANCELLED") return "error";
    return "default";
  };

  const initials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const isPast = (dt) => dayjs(dt).isBefore(dayjs());

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Appointments Overview
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Monitor and manage all appointments across the platform
      </Typography>

      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 6, sm: 3 }} key={card.key}>
            <Card
              onClick={() => setStatusFilter(card.key === "total" ? "" : card.key)}
              sx={{
                cursor: "pointer",
                background: card.gradient,
                color: "#fff",
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                ...(statusFilter === card.key || (card.key === "total" && !statusFilter)
                  ? { outline: "3px solid rgba(255,255,255,0.6)", outlineOffset: 2 }
                  : {}),
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 48, height: 48 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {counts[card.key]}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search by patient, doctor, specialty, or ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ flexGrow: 1, maxWidth: 500 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Specialty</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Event sx={{ fontSize: 48, color: "grey.300", mb: 1 }} />
                  <Typography color="text.secondary">No appointments found</Typography>
                </TableCell>
              </TableRow>
            ) : paginated.map((a) => (
              <TableRow
                key={a.id}
                hover
                sx={{
                  opacity: isPast(a.scheduled_at) && a.status !== "COMPLETED" ? 0.7 : 1,
                  "&:last-child td": { border: 0 },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    #{a.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "primary.light", color: "primary.contrastText" }}>
                      {initials(a.patient_name)}
                    </Avatar>
                    <Typography variant="body2">{a.patient_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "secondary.light", color: "secondary.contrastText" }}>
                      {initials(a.doctor_name)}
                    </Avatar>
                    <Typography variant="body2">{a.doctor_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={a.specialty_name || "—"} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {dayjs(a.scheduled_at).format("MMM D, YYYY")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(a.scheduled_at).format("h:mm A")}
                  </Typography>
                </TableCell>
                <TableCell>{a.duration_minutes} min</TableCell>
                <TableCell>
                  <Chip
                    label={a.status}
                    size="small"
                    color={statusColor(a.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Chip
              key={i}
              label={i + 1}
              onClick={() => setPage(i)}
              color={page === i ? "primary" : "default"}
              variant={page === i ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
