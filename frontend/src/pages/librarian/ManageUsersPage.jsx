import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import usersApi from "../../api/usersApi";
import { toast } from "react-toastify";

const ManageUsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getPending();
      setPendingUsers(data);
    } catch (err) {
      setError("Failed to fetch pending users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await usersApi.approve(id);
      toast.success("User approved successfully! Email sent.");
      fetchPendingUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve user.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this registration request?",
      )
    ) {
      try {
        await usersApi.deleteUser(id);
        toast.success("Registration request deleted successfully.");
        fetchPendingUsers(); // Refresh list
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  if (loading && pendingUsers.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        User Approval Management
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Review and approve new Reader and Author registrations.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary italic">
                    No pending approvals at the moment.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pendingUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:hover": { bgcolor: "action.hover" } }}
                >
                  <TableCell fontWeight="medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === "author" ? "secondary" : "info"}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Pending"
                      size="small"
                      variant="outlined"
                      color="warning"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        size="small"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageUsersPage;
