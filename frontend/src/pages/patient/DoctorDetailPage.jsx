import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button,
  Divider, List, ListItem, ListItemText, Paper,
} from "@mui/material";
import { ArrowBack, Schedule, AttachMoney } from "@mui/icons-material";
import { fetchDoctor } from "../../store/slices/doctorsSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: doctor, loading, error } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(fetchDoctor(id));
    return () => dispatch({ type: "doctors/clearCurrent" });
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;
  if (error || !doctor) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Doctor not found.
        </Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Back</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}>
                  {doctor.first_name?.[0] || "D"}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </Typography>
                  <Chip label={doctor.specialty_detail?.name || "General"} color="primary" sx={{ mt: 0.5 }} />
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>About</Typography>
              <Typography color="text.secondary" mb={2}>
                {doctor.bio || "No bio available."}
              </Typography>

              {doctor.phone && (
                <Typography variant="body2" color="text.secondary">
                  Phone: {doctor.phone}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AttachMoney color="primary" />
                <Typography variant="h6">Consultation Fee</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                ${doctor.consultation_fee}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Schedule color="primary" />
                <Typography variant="h6">Availability</Typography>
              </Box>
              {doctor.availability && doctor.availability.length > 0 ? (
                <List dense>
                  {doctor.availability.filter(a => a.is_active).map((a) => (
                    <ListItem key={a.id}>
                      <ListItemText
                        primary={DAY_NAMES[a.day_of_week]}
                        secondary={`${a.start_time} - ${a.end_time}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No availability set.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Button
            fullWidth variant="contained" size="large"
            onClick={() => navigate(`/patient/doctors/${id}/book`)}
          >
            Book Appointment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
