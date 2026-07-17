import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip,
} from "@mui/material";
import { Add, Delete, Edit, Category, MedicalServices } from "@mui/icons-material";
import {
  fetchSpecialties, createSpecialty, deleteSpecialty, updateSpecialty,
} from "../../store/slices/doctorsSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import GradientHeader from "../../components/common/GradientHeader";
import StatCard from "../../components/common/StatCard";

const SPECIALTY_IMAGES = {
  cardiology: "/assets/img/health/cardiology-1.webp",
  neurology: "/assets/img/health/neurology-4.webp",
  orthopedics: "/assets/img/health/orthopedics-1.webp",
  pediatrics: "/assets/img/health/pediatrics-3.webp",
  dermatology: "/assets/img/health/dermatology-1.webp",
  oncology: "/assets/img/health/oncology-2.webp",
};

const SPECIALTY_FALLBACKS = [
  "/assets/img/health/cardiology-1.webp",
  "/assets/img/health/neurology-4.webp",
  "/assets/img/health/orthopedics-1.webp",
];

function getSpecialtyImage(sp) {
  if (SPECIALTY_IMAGES[sp.slug]) return SPECIALTY_IMAGES[sp.slug];
  return SPECIALTY_FALLBACKS[(sp.id || 0) % SPECIALTY_FALLBACKS.length];
}

export default function AdminSpecialtiesPage() {
  const dispatch = useDispatch();
  const { specialties } = useSelector((s) => s.doctors);
  const { register, handleSubmit, reset } = useForm();
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(createSpecialty(data));
    if (!result.error) {
      reset();
      setSnack({ open: true, msg: "Specialty created.", severity: "success" });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteSpecialty(deleteId));
      setDeleteId(null);
    }
  };

  const handleEditOpen = (sp) => {
    setEditItem(sp);
    setEditName(sp.name);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    const result = await dispatch(updateSpecialty({ slug: editItem.slug, data: { name: editName.trim() } }));
    if (!result.error) {
      setSnack({ open: true, msg: "Specialty updated.", severity: "success" });
    }
    setEditItem(null);
    setEditName("");
  };

  const totalDoctors = specialties.reduce((sum, sp) => sum + (sp.doctor_count || 0), 0);

  return (
    <Box>
      <GradientHeader title="Manage Specialties" subtitle="Add, edit, or remove medical specialties" gradient="blue" />

      {/* Stats Overview */}
      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 6, md: 4 }} data-aos="fade-up" data-aos-delay="0">
          <StatCard
            icon={<Category sx={{ fontSize: 28 }} />}
            value={specialties.length}
            label="Total Specialties"
            gradientIndex={0}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }} data-aos="fade-up" data-aos-delay="100">
          <StatCard
            icon={<MedicalServices sx={{ fontSize: 28 }} />}
            value={totalDoctors}
            label="Total Doctors"
            gradientIndex={2}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} data-aos="fade-up" data-aos-delay="200">
          <StatCard
            icon={<Add sx={{ fontSize: 28 }} />}
            value={specialties.length > 0 ? Math.round(totalDoctors / specialties.length) : 0}
            label="Avg. per Specialty"
            gradientIndex={3}
          />
        </Grid>
      </Grid>

      {/* Add Form */}
      <Card sx={{ mb: 4, maxWidth: 500 }} data-aos="fade-up" data-aos-delay="100">
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Category sx={{ color: "#175cdd" }} />
            <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344" }}>
              Add Specialty
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField fullWidth label="Name" {...register("name", { required: true })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="contained" type="submit" sx={{ height: "56px", background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 100%)" }}>
                  <Add />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Specialty Card Grid */}
      <Typography variant="h5" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344", mb: 2.5 }} data-aos="fade-up">
        All Specialties
      </Typography>
      <Grid container spacing={2.5}>
        {specialties.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box data-aos="fade-up" sx={{ textAlign: "center", py: 6, borderRadius: 3, bgcolor: "#f8fafc" }}>
              <Category sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
              <Typography color="text.secondary">No specialties yet. Add one above.</Typography>
            </Box>
          </Grid>
        ) : specialties.map((sp, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sp.id} data-aos="fade-up" data-aos-delay={String((i % 6) * 80)}>
            <Card
              sx={{
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
              }}
            >
              <Box sx={{ height: 140, overflow: "hidden", position: "relative" }}>
                <img
                  src={getSpecialtyImage(sp)}
                  alt={sp.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  }}
                />
                <Chip
                  label={`${sp.doctor_count || 0} doctors`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "rgba(255,255,255,0.9)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344", fontSize: "1rem" }}>
                      {sp.name}
                    </Typography>
                    <Chip label={sp.slug} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.7rem", mt: 0.5 }} />
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton color="primary" size="small" onClick={() => handleEditOpen(sp)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small" onClick={() => setDeleteId(sp.slug)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog open={!!deleteId} title="Delete Specialty" message="Are you sure you want to delete this specialty?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />

      <Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>Edit Specialty</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={!editName.trim() || editName === editItem?.name}>Save</Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
