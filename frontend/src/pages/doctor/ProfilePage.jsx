import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  Chip, Avatar, Divider, Paper,
} from "@mui/material";
import { Save, Phone, AttachMoney, Info, Badge } from "@mui/icons-material";
import { fetchMyProfile, updateMyProfile } from "../../store/slices/doctorsSlice";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function DoctorProfilePage() {
  const dispatch = useDispatch();
  const { myProfile, loading } = useSelector((s) => s.doctors);
  const { user } = useSelector((s) => s.auth);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (myProfile) {
      reset({
        bio: myProfile.bio || "",
        phone: myProfile.phone || "",
        consultation_fee: myProfile.consultation_fee || "",
      });
    }
  }, [myProfile, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(updateMyProfile({
      ...data,
      consultation_fee: data.consultation_fee ? parseFloat(data.consultation_fee) : null,
    }));
    if (!result.error) {
      setSnack({ open: true, msg: "Profile updated successfully.", severity: "success" });
    } else {
      setSnack({ open: true, msg: "Failed to update profile.", severity: "error" });
    }
  };

  const initials = () => {
    const f = user?.first_name || myProfile?.first_name || "";
    const l = user?.last_name || myProfile?.last_name || "";
    return (f && l) ? `${f[0]}${l[0]}`.toUpperCase() : "DR";
  };

  if (loading && !myProfile) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Profile
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage your professional information visible to patients
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent sx={{ pt: 4 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 36,
                  bgcolor: myProfile?.is_approved ? "primary.main" : "warning.main",
                  color: "#fff",
                  fontWeight: 700,
                  mx: "auto",
                  mb: 2,
                }}
              >
                {initials()}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                Dr. {user?.first_name || myProfile?.first_name} {user?.last_name || myProfile?.last_name}
              </Typography>
              <Chip
                label={myProfile?.is_approved ? "Approved" : "Pending Approval"}
                color={myProfile?.is_approved ? "success" : "warning"}
                size="small"
                sx={{ mt: 1, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {user?.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: "left", px: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Badge fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Specialty</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {myProfile?.specialty_detail?.name || "Not assigned"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Phone fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {myProfile?.phone || "Not set"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoney fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Consultation Fee</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${myProfile?.consultation_fee || "0"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Edit Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Update your bio, contact info, and consultation fee
              </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Professional Bio"
                      placeholder="Tell patients about your experience, education, and approach to care..."
                      {...register("bio")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Phone Number" {...register("phone")} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Consultation Fee ($)"
                      slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                      {...register("consultation_fee")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<Save />}
                      size="large"
                      sx={{ borderRadius: 2 }}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
