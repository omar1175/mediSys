import { useEffect } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Link } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { confirmEmail } from "../../store/slices/authSlice";

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((s) => s.auth);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    if (uid && token) {
      dispatch(confirmEmail({ uid, token }));
    }
  }, [dispatch, uid, token]);

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={2}>
      <Card sx={{ maxWidth: 440, width: "100%" }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {loading && <CircularProgress sx={{ mb: 2 }} />}
          {success && (
            <>
              <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom>{success}</Typography>
              <Button component={RouterLink} to="/login" variant="contained" sx={{ mt: 2 }}>
                Go to Login
              </Button>
            </>
          )}
          {error && (
            <>
              <Error color="error" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="error">
                {error.detail || "Confirmation failed"}
              </Typography>
              <Button component={RouterLink} to="/resend-email" variant="contained" sx={{ mt: 2 }}>
                Resend Email
              </Button>
            </>
          )}
          {!loading && !success && !error && (
            <Typography color="text.secondary">Processing confirmation...</Typography>
          )}
          <Typography variant="body2" mt={3}>
            <Link component={RouterLink} to="/login">Back to Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
