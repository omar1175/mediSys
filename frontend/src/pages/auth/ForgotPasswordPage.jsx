import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert } from "@mui/material";
import { LockReset } from "@mui/icons-material";
import { authService } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authService.requestPasswordReset(data);
      setMsg(res.data.detail);
      setErr(null);
    } catch (e) {
      setErr(e.response?.data?.detail || "Something went wrong");
      setMsg(null);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
      <Card sx={{ maxWidth: 440, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <LockReset color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Reset Your Password</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Enter your email and we'll send you a reset link.
            </Typography>
          </Box>

          {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
          {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField fullWidth label="Email" type="email" margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email} helperText={errors.email?.message}
            />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 2, mb: 2 }}>
              Send Reset Link
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            <Link component={RouterLink} to="/login">Back to Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
