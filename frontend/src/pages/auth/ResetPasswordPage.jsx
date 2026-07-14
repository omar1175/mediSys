import { useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box, Card, CardContent, TextField, Button, Typography, Link, Alert,
  InputAdornment, IconButton,
} from "@mui/material";
import { LockReset, Visibility, VisibilityOff } from "@mui/icons-material";
import { authService } from "../../services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!uid || !token) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
        <Card sx={{ maxWidth: 440, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Invalid password reset link. Please request a new one.</Alert>
            <Typography variant="body2" textAlign="center">
              <Link component={RouterLink} to="/forgot-password">Request new link</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const onSubmit = async (data) => {
    try {
      const res = await authService.confirmPasswordReset({
        uid,
        token,
        new_password: data.new_password,
      });
      setMsg(res.data.detail);
      setErr(null);
    } catch (e) {
      setErr(e.response?.data?.new_password?.[0] || e.response?.data?.detail || "Something went wrong");
      setMsg(null);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
      <Card sx={{ maxWidth: 440, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <LockReset color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Set New Password</Typography>
          </Box>

          {msg && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>
              <Typography variant="body2" textAlign="center">
                <Link component={RouterLink} to="/login">Go to Login</Link>
              </Typography>
            </>
          )}
          {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

          {!msg && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth label="New Password" margin="normal"
                type={showPassword ? "text" : "password"}
                {...register("new_password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                error={!!errors.new_password} helperText={errors.new_password?.message}
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
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3, mb: 2 }}>
                Reset Password
              </Button>
            </Box>
          )}

          {!msg && (
            <Typography variant="body2" textAlign="center">
              <Link component={RouterLink} to="/login">Back to Login</Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
