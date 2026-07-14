import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10} px={3}>
          <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>Something went wrong</Typography>
          <Typography color="text.secondary" mb={3}>
            An unexpected error occurred. Please try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
