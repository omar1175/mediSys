import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  Alert, Chip, Container,
} from "@mui/material";
import { Save, LockReset } from "@mui/icons-material";
import { updateMe } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import GradientHeader from "../../components/common/GradientHeader";
import PatientAvatar from "../../components/common/PatientAvatar";
import AlertSnackbar from "../../components/common/AlertSnackbar";

export default function PatientProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { first_name: "", last_name: "", email: "", username: "" },
  });

  const pwForm = useForm();

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(updateMe(data));
    if (!result.error) {
      setSnack({ open: true, msg: "Profile updated successfully.", severity: "success" });
    } else {
      setSnack({ open: true, msg: "Failed to update profile.", severity: "error" });
    }
  };

  const onPwSubmit = async (data) => {
    try {
      await authService.changePassword({ old_password: data.old_password, new_password: data.new_password });
      setPwMsg("Password changed successfully.");
      setPwErr(null);
      pwForm.reset();
    } catch (e) {
      setPwErr(e.response?.data?.detail || "Failed to change password.");
      setPwMsg(null);
    }
  };

  return (
    <Box>
      <GradientHeader
        title="My Profile"
        subtitle="Manage your personal information"
        gradient="blue"
      />

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }} data-aos="fade-up" data-aos-delay="0">
            {/* Personal Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, mb: 2, color: "#112344" }}>
                  Personal Information
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="First Name" {...register("first_name")} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Last Name" {...register("last_name")} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label="Email" disabled {...register("email")} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label="Username" disabled {...register("username")} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<Save />}
                        disabled={isSubmitting}
                        sx={{
                          py: 1.2,
                          px: 4,
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 100%)",
                        }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, mb: 2, color: "#112344" }}>
                  Change Password
                </Typography>
                {pwMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{pwMsg}</Alert>}
                {pwErr && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{pwErr}</Alert>}
                <Box component="form" onSubmit={pwForm.handleSubmit(onPwSubmit)}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth type="password" label="Current Password"
                        {...pwForm.register("old_password", { required: "Current password is required" })}
                        error={!!pwForm.formState.errors.old_password}
                        helperText={pwForm.formState.errors.old_password?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth type="password" label="New Password"
                        {...pwForm.register("new_password", { required: "New password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                        error={!!pwForm.formState.errors.new_password}
                        helperText={pwForm.formState.errors.new_password?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button variant="outlined" type="submit" startIcon={<LockReset />} sx={{ py: 1.2, textTransform: "none", fontWeight: 600 }}>
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar — gradient avatar card */}
          <Grid size={{ xs: 12, md: 4 }} data-aos="fade-up" data-aos-delay="100">
            <Card sx={{ overflow: "hidden" }}>
              {/* Gradient cover banner */}
              <Box
                sx={{
                  height: 100,
                  background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 50%, #0ea5e9 100%)",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              />
              <CardContent sx={{ textAlign: "center", pt: 0, pb: 3, mt: -5, position: "relative" }}>
                <PatientAvatar patient={user} size={80} sx={{ mx: "auto", mb: 2, border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>
                <Chip
                  label={user?.role}
                  sx={{
                    bgcolor: user?.role === "ADMIN" ? "#fee2e2" : user?.role === "DOCTOR" ? "#e0f2fe" : "#d1fae5",
                    color: user?.role === "ADMIN" ? "#dc2626" : user?.role === "DOCTOR" ? "#0284c7" : "#059669",
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ mt: 2, textAlign: "left" }}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                    Email Confirmed: {user?.is_email_confirmed ? "Yes" : "No"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
