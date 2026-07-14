import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, TextField, InputAdornment,
  Switch, Avatar, Grid, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem,
} from "@mui/material";
import {
  Search, People, AdminPanelSettings, MedicalServices, Person,
} from "@mui/icons-material";
import api from "../../services/api";
import { authService } from "../../services/authService";
import { doctorService } from "../../services/doctorService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AlertSnackbar from "../../components/common/AlertSnackbar";

const STAT_CARDS = [
  { key: "total", label: "Total Users", icon: <People />, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { key: "ADMIN", label: "Admins", icon: <AdminPanelSettings />, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { key: "DOCTOR", label: "Doctors", icon: <MedicalServices />, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { key: "PATIENT", label: "Patients", icon: <Person />, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
];

const AVATAR_COLORS = {
  ADMIN: "error.main",
  DOCTOR: "primary.main",
  PATIENT: "success.main",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const fetchUsers = async (role) => {
    try {
      const params = {};
      if (role) params.role = role;
      const res = await api.get("/users/", { params });
      setUsers(res.data.results || res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter]);

  const counts = useMemo(() => {
    const c = { total: users.length, ADMIN: 0, DOCTOR: 0, PATIENT: 0 };
    users.forEach((u) => { if (c[u.role] !== undefined) c[u.role]++; });
    return c;
  }, [users]);

  const handleToggleActive = async (user) => {
    try {
      const res = await authService.adminUpdateUser(user.id, { is_active: !user.is_active });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: res.data.is_active } : u)));
      setSnack({ open: true, msg: `User ${res.data.is_active ? "activated" : "deactivated"}.`, severity: "success" });
    } catch {
      setSnack({ open: true, msg: "Failed to update user.", severity: "error" });
    }
  };

  const handleToggleApproval = async (user) => {
    if (user.role !== "DOCTOR" || !user.doctor_profile_id) return;
    try {
      const res = await doctorService.approveDoctor(user.doctor_profile_id, { is_approved: !user.doctor_is_approved });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, doctor_is_approved: res.data.is_approved } : u)));
      setSnack({ open: true, msg: `Doctor ${res.data.is_approved ? "approved" : "unapproved"}.`, severity: "success" });
    } catch {
      setSnack({ open: true, msg: "Failed to update doctor approval.", severity: "error" });
    }
  };

  const filtered = useMemo(() => users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  const initials = (u) => {
    const name = `${u.first_name || ""} ${u.last_name || ""}`.trim();
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : u.username?.slice(0, 2).toUpperCase();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Management
      </Typography>
      <Typography color="text.secondary" mb={3}>
        View, approve, and manage all registered users
      </Typography>

      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 6, sm: 3 }} key={card.key}>
            <Card
              onClick={() => setRoleFilter(card.key === "total" ? "" : card.key)}
              sx={{
                cursor: "pointer",
                background: card.gradient,
                color: "#fff",
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                ...(roleFilter === card.key || (card.key === "total" && !roleFilter)
                  ? { outline: "3px solid rgba(255,255,255,0.6)", outlineOffset: 2 }
                  : {}),
              }}
            >
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

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search by name, username, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 450 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            },
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="DOCTOR">Doctor</MenuItem>
            <MenuItem value="PATIENT">Patient</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Verified</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <People sx={{ fontSize: 48, color: "grey.300", mb: 1 }} />
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : filtered.map((u) => (
              <TableRow key={u.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: AVATAR_COLORS[u.role] || "grey.500", color: "#fff", fontWeight: 700 }}>
                      {initials(u)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{u.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.role}
                    size="small"
                    color={u.role === "ADMIN" ? "error" : u.role === "DOCTOR" ? "primary" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.is_email_confirmed ? "Yes" : "No"}
                    size="small"
                    color={u.is_email_confirmed ? "success" : "warning"}
                    variant={u.is_email_confirmed ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell>
                  <Switch checked={u.is_active} onChange={() => handleToggleActive(u)} color="success" size="small" />
                </TableCell>
                <TableCell>
                  {u.role === "DOCTOR" ? (
                    <Switch checked={!!u.doctor_is_approved} onChange={() => handleToggleApproval(u)} color="primary" size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
