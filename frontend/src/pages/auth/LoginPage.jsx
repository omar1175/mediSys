import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import { login, clearError } from "../../store/slices/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (!result.error) {
      const role = result.payload?.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
      <Card sx={{ maxWidth: 440, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <LoginIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Sign in to MediSys</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Medical Appointment System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
              {typeof error === "string" ? error : error.detail || JSON.stringify(error)}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth label="Username" type="text" margin="normal"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username} helperText={errors.username?.message}
            />
            <TextField
              fullWidth label="Password" margin="normal" type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              error={!!errors.password} helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">Register</Link>
          </Typography>
          <Typography variant="body2" textAlign="center" mt={0.5}>
            <Link component={RouterLink} to="/resend-email">Resend confirmation email</Link>
          </Typography>
          <Typography variant="body2" textAlign="center" mt={0.5}>
            <Link component={RouterLink} to="/forgot-password">Forgot password?</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
