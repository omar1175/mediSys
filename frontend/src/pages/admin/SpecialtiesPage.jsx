import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  fetchSpecialties, createSpecialty, deleteSpecialty, updateSpecialty,
} from "../../store/slices/doctorsSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AlertSnackbar from "../../components/common/AlertSnackbar";

export default function AdminSpecialtiesPage() {
  const dispatch = useDispatch();
  const { specialties } = useSelector((s) => s.doctors);
  const { register, handleSubmit, reset } = useForm();
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(createSpecialty(data));
    if (!result.error) {
      reset();
      setSnack({ open: true, msg: "Specialty created.", severity: "success" });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteSpecialty(deleteId));
      setDeleteId(null);
    }
  };

  const handleEditOpen = (sp) => {
    setEditItem(sp);
    setEditName(sp.name);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    const result = await dispatch(updateSpecialty({ slug: editItem.slug, data: { name: editName.trim() } }));
    if (!result.error) {
      setSnack({ open: true, msg: "Specialty updated.", severity: "success" });
    }
    setEditItem(null);
    setEditName("");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Specialties</Typography>

      <Card sx={{ mb: 3, maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add Specialty</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField fullWidth label="Name" {...register("name", { required: true })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="contained" type="submit" sx={{ height: "56px" }}>
                  <Add />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Doctors</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map((sp) => (
              <TableRow key={sp.id}>
                <TableCell>{sp.name}</TableCell>
                <TableCell>{sp.slug}</TableCell>
                <TableCell>{sp.doctor_count || 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEditOpen(sp)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => setDeleteId(sp.slug)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Specialty"
        message="Are you sure you want to delete this specialty?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Specialty</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Name" value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={!editName.trim() || editName === editItem?.name}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar open={snack.open} severity={snack.severity} message={snack.msg} onClose={() => setSnack({ ...snack, open: false })} />
    </Box>
  );
}
