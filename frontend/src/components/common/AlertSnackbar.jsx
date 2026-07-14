import { Snackbar, Alert } from "@mui/material";

export default function AlertSnackbar({ open, severity = "info", message, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {typeof message === "string" ? message : JSON.stringify(message)}
      </Alert>
    </Snackbar>
  );
}
