import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem,
  Alert, CircularProgress, Grid, Chip,
} from "@mui/material";
import { ArrowBack, Event } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { fetchDoctor } from "../../store/slices/doctorsSlice";
import { createAppointment, clearAppointmentError, clearAppointmentSuccess } from "../../store/slices/appointmentsSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: doctor, loading: docLoading } = useSelector((s) => s.doctors);
  const { loading, error, success } = useSelector((s) => s.appointments);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { duration_minutes: 30, notes: "" },
  });

  useEffect(() => {
    dispatch(clearAppointmentSuccess());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDoctor(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/patient/appointments"), 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const onSubmit = (data) => {
    dispatch(createAppointment({
      doctor: parseInt(id),
      scheduled_at: data.scheduled_at.toISOString(),
      duration_minutes: parseInt(data.duration_minutes),
      notes: data.notes,
    }));
  };

  if (docLoading || !doctor) return <LoadingSpinner />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Typography variant="h4" gutterBottom>Book Appointment</Typography>
        <Typography color="text.secondary" mb={3}>
          with Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty_detail?.name}
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearAppointmentError())}>
            {typeof error === "string" ? error : error.scheduled_at || error.detail || JSON.stringify(error)}
          </Alert>
        )}

        {doctor.availability && doctor.availability.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Available Times</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {doctor.availability.filter(a => a.is_active).map((a) => (
                  <Chip key={a.id} label={`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][a.day_of_week]} ${a.start_time}-${a.end_time}`} variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="scheduled_at"
                    control={control}
                    rules={{ required: "Date and time are required" }}
                    render={({ field }) => (
                      <DateTimePicker
                        label="Appointment Date & Time"
                        value={field.value}
                        onChange={field.onChange}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.scheduled_at,
                            helperText: errors.scheduled_at?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Duration" {...register("duration_minutes", { required: true })}>
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={45}>45 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline rows={3} label="Notes (optional)" {...register("notes")} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Book Appointment"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
