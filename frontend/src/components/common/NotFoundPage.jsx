import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home } from "@mui/icons-material";

const roleDashboards = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  PATIENT: "/patient/dashboard",
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const target = roleDashboards[user?.role] || "/login";

  return (
    <Box textAlign="center" py={10} px={3}>
      <Typography variant="h1" fontWeight={700} color="primary" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>Page not found</Typography>
      <Typography color="text.secondary" mb={3}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" startIcon={<Home />} onClick={() => navigate(target)}>
        Go to Dashboard
      </Button>
    </Box>
  );
}
