import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Card, CardContent, TextField, Button, Typography, Link,
  Alert, CircularProgress, MenuItem, InputAdornment, IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";
import { register as registerUser, clearError } from "../../store/slices/authSlice";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((s) => s.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <PersonAdd color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Create an Account</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
              {typeof error === "string" ? error : error.detail || JSON.stringify(error)}
            </Alert>
          )}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField fullWidth label="Username" margin="normal"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username} helperText={errors.username?.message}
            />
            <TextField fullWidth label="Email" type="email" margin="normal"
              {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
              error={!!errors.email} helperText={errors.email?.message}
            />
            <Box display="flex" gap={2}>
              <TextField fullWidth label="First Name" margin="normal"
                {...register("first_name")}
              />
              <TextField fullWidth label="Last Name" margin="normal"
                {...register("last_name")}
              />
            </Box>
            <TextField fullWidth select label="Role" margin="normal" defaultValue="PATIENT"
              {...register("role", { required: true })}
            >
              <MenuItem value="PATIENT">Patient</MenuItem>
              <MenuItem value="DOCTOR">Doctor</MenuItem>
            </TextField>
            <TextField fullWidth label="Password" margin="normal"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })}
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
            <TextField fullWidth label="Confirm Password" margin="normal"
              type="password"
              {...register("password2", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
              error={!!errors.password2} helperText={errors.password2?.message}
            />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            Already have an account? <Link component={RouterLink} to="/login">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
