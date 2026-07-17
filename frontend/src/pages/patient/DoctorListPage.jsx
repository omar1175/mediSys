import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { Search as SearchIcon, Star, WorkOutlined } from "@mui/icons-material";
import {
  fetchDoctors,
  fetchSpecialties,
} from "../../store/slices/doctorsSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import GradientHeader from "../../components/common/GradientHeader";
import DoctorAvatar from "../../components/common/DoctorAvatar";
import EmptyState from "../../components/common/EmptyState";
import { templateColors } from "../../styles/templateTheme";

export default function DoctorListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: doctors, specialties, loading, error } = useSelector((s) => s.doctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const loadDoctors = useCallback(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (specialtyFilter) params.specialty = specialtyFilter;
    dispatch(fetchDoctors(params));
  }, [dispatch, searchTerm, specialtyFilter]);

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const filtered = doctors.filter((d) => {
    const matchesSearch =
      !searchTerm ||
      d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      !specialtyFilter || d.specialty_name === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <Box>
      {/* Header */}
      <GradientHeader
        title="Find Your Doctor"
        subtitle="Search through our comprehensive directory of experienced medical professionals"
        gradient="blue"
      >
        {/* Search Bar */}
        <Box
          data-aos="fade-up"
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            bgcolor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            p: 2,
          }}
        >
          <TextField
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                borderRadius: 2,
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "#175cdd" },
                "&.Mui-focused fieldset": { borderColor: "#175cdd" },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            label="Specialty"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                borderRadius: 2,
                "& fieldset": { borderColor: "transparent" },
              },
            }}
          >
            <MenuItem value="">All Specialties</MenuItem>
            {specialties.map((sp) => (
              <MenuItem key={sp.id} value={sp.name}>
                {sp.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </GradientHeader>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {filtered.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <EmptyState
                  image="/assets/img/health/consultation-4.webp"
                  title="No doctors found"
                  description="Try adjusting your search or filter criteria."
                />
              </Grid>
            ) : (
              filtered.map((doc, i) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={doc.id}
                  data-aos="zoom-in"
                  data-aos-delay={String(i * 80)}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <DoctorAvatar doctor={doc} size={110} showStatus />
                    <Typography
                      sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#112344",
                        mt: 1.5,
                      }}
                    >
                      {doc.full_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: templateColors.accent,
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {doc.specialty_name}
                    </Typography>
                    {/* Star Rating */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mb: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          sx={{
                            fontSize: 16,
                            color: s <= Math.round(doc.rating || 0) ? "#f59e0b" : "#e2e8f0",
                          }}
                        />
                      ))}
                      <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: "#64748b" }}>
                        {doc.rating || "—"}
                      </Typography>
                    </Box>
                    {/* Experience */}
                    {doc.years_of_experience && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <WorkOutlined sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography variant="caption" color="text.secondary">
                          {doc.years_of_experience} years experience
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: templateColors.default,
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      ${doc.consultation_fee} in-person
                      {doc.online_consultation_fee > 0 && (
                        <span> · ${doc.online_consultation_fee} online</span>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6, fontSize: "0.8rem", flex: 1 }}
                    >
                      {doc.bio?.substring(0, 100) ||
                        "Experienced medical professional dedicated to patient care."}
                      {doc.bio?.length > 100 ? "..." : ""}
                    </Typography>
                    {/* Dual Buttons */}
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                        sx={{
                          flex: 1,
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          borderColor: templateColors.accent,
                          color: templateColors.accent,
                          fontSize: "0.8rem",
                          "&:hover": { borderColor: "#1448b0", bgcolor: "#175cdd08" },
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/patient/doctors/${doc.id}/book`)}
                        sx={{
                          flex: 1,
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          bgcolor: templateColors.accent,
                          fontSize: "0.8rem",
                          "&:hover": { bgcolor: "#1448b0" },
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      )}
    </Box>
  );
}
