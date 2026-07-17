import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Container,
} from "@mui/material";
import { Schedule, AttachMoney, Phone, Star, WorkOutlined, CalendarMonth } from "@mui/icons-material";
import { fetchDoctor } from "../../store/slices/doctorsSlice";
import GradientHeader from "../../components/common/GradientHeader";
import DoctorAvatar from "../../components/common/DoctorAvatar";
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
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>Doctor not found.</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      </Box>
    );
  }

  return (
    <Box>
      <GradientHeader
        title={`Dr. ${doctor.first_name} ${doctor.last_name}`}
        subtitle={doctor.specialty_detail?.name || "General Practice"}
        gradient="dark"
        showBack
        onBack={() => navigate(-1)}
        action={
          <Button
            variant="contained"
            onClick={() => navigate(`/patient/doctors/${id}/book`)}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontFamily: '"Montserrat", sans-serif',
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            Book Appointment
          </Button>
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1 }}>
          <DoctorAvatar doctor={doctor} size={80} showStatus />
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
            {/* Star Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} sx={{ fontSize: 18, color: s <= Math.round(doctor.rating || 0) ? "#fbbf24" : "rgba(255,255,255,0.3)" }} />
              ))}
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{doctor.rating || "—"}</Typography>
            </Box>
            {/* Experience */}
            {doctor.years_of_experience && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
                <WorkOutlined sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctor.years_of_experience} years</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
              <AttachMoney sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>${doctor.consultation_fee} in-person</Typography>
            </Box>
            {doctor.online_consultation_fee > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
                <AttachMoney sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${doctor.online_consultation_fee} online</Typography>
              </Box>
            )}
            {doctor.phone && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="body2">{doctor.phone}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </GradientHeader>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* About */}
          <Grid size={{ xs: 12, md: 8 }} data-aos="fade-up" data-aos-delay="0">
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, mb: 2, color: "#112344" }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{ color: "#3c4049", lineHeight: 1.8, mb: 3 }}>
                  {doctor.bio || "No bio available."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Availability — Card-based layout */}
          <Grid size={{ xs: 12, md: 4 }} data-aos="fade-up" data-aos-delay="100">
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Schedule sx={{ color: "#175cdd" }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, color: "#112344" }}>
                    Availability
                  </Typography>
                </Box>
                {doctor.availability && doctor.availability.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {doctor.availability.filter(a => a.is_active).map((a) => (
                      <Card
                        key={a.id}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          px: 2,
                          py: 1.2,
                          borderColor: "#e2e8f0",
                          "&:hover": { borderColor: "#175cdd", bgcolor: "#f8fafc" },
                          transition: "all 0.2s",
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 18, color: "#175cdd" }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: "#112344" }}>
                            {DAY_NAMES[a.day_of_week]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.start_time} - {a.end_time}
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No availability set.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
