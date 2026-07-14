import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Alert, Chip,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import {
  fetchAvailability, createAvailability, deleteAvailability,
} from "../../store/slices/doctorsSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AlertSnackbar from "../../components/common/AlertSnackbar";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityPage() {
  const dispatch = useDispatch();
  const { availability } = useSelector((s) => s.doctors);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [deleteId, setDeleteId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(createAvailability(data));
    if (!result.error) {
      reset();
      setSnack({ open: true, msg: "Availability added.", severity: "success" });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteAvailability(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Availability</Typography>

      <Card sx={{ mb: 3, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add Time Slot</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth select label="Day" {...register("day_of_week", { required: true })}
                  error={!!errors.day_of_week}
                >
                  {DAY_NAMES.map((d, i) => (
                    <MenuItem key={i} value={i}>{d}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth type="time" label="Start Time"
                  {...register("start_time", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth type="time" label="End Time"
                  {...register("end_time", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Button fullWidth variant="contained" type="submit" sx={{ height: "56px" }}>
                  <Add />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Your Schedule</Typography>
      {availability.length === 0 ? (
        <Typography color="text.secondary">No availability set yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availability.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{DAY_NAMES[a.day_of_week]}</TableCell>
                  <TableCell>{a.start_time}</TableCell>
                  <TableCell>{a.end_time}</TableCell>
                  <TableCell>
                    <Chip label={a.is_active ? "Active" : "Inactive"} size="small" color={a.is_active ? "success" : "default"} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => setDeleteId(a.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Availability"
        message="Are you sure you want to remove this time slot?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
