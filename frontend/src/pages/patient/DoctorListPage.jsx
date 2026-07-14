import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, TextField, MenuItem,
  Button, InputAdornment, Avatar, Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { fetchDoctors, fetchSpecialties } from "../../store/slices/doctorsSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function DoctorListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: doctors, specialties, loading } = useSelector((s) => s.doctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const filtered = doctors.filter((d) => {
    const matchesSearch = !searchTerm ||
      d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !specialtyFilter || d.specialty_name === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Find Doctors</Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          label="Filter by Specialty"
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Specialties</MenuItem>
          {specialties.map((sp) => (
            <MenuItem key={sp.id} value={sp.name}>{sp.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? <LoadingSpinner /> : (
        <Grid container spacing={3}>
          {filtered.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography textAlign="center" color="text.secondary" py={4}>
                No doctors found matching your criteria.
              </Typography>
            </Grid>
          ) : filtered.map((doc) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 24 }}>
                      {doc.full_name?.[0] || "D"}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{doc.full_name}</Typography>
                      <Chip label={doc.specialty_name || "General"} size="small" color="primary" variant="outlined" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {doc.bio?.substring(0, 120) || "No bio available."}
                    {doc.bio?.length > 120 ? "..." : ""}
                  </Typography>
                  <Typography variant="h6" color="primary" mt="auto">
                    ${doc.consultation_fee}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{ m: 2, mt: 0 }}
                  onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                >
                  View & Book
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
