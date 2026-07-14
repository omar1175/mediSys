import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  Alert, CircularProgress, Divider,
} from "@mui/material";
import { Save, LockReset } from "@mui/icons-material";
import { updateMe } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import AlertSnackbar from "../../components/common/AlertSnackbar";

export default function PatientProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
    },
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
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
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
                    <Button variant="contained" type="submit" startIcon={<Save />} disabled={isSubmitting}>
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Change Password</Typography>
              {pwMsg && <Alert severity="success" sx={{ mb: 2 }}>{pwMsg}</Alert>}
              {pwErr && <Alert severity="error" sx={{ mb: 2 }}>{pwErr}</Alert>}
              <Box component="form" onSubmit={pwForm.handleSubmit(onPwSubmit)}>
                <Grid container spacing={2}>
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
                    <Button variant="outlined" type="submit" startIcon={<LockReset />}>
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">Role: {user?.role}</Typography>
              <Typography variant="body2" color="text.secondary">
                Email Confirmed: {user?.is_email_confirmed ? "Yes" : "No"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
