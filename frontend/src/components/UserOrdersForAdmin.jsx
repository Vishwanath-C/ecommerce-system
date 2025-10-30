import React, { useEffect, useState } from "react";
import apiClient from "../api.js";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OrderSummary from "./OrderSummary.jsx";
import { getCurrentUser } from "../utils/auth.js";

// ---------- CHILD COMPONENT ----------
const UserOrders = ({ orders, userIdLabel }) => {
    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                {userIdLabel ? `Orders of User #${userIdLabel}` : "All Orders"}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {orders.map((order) => (
                    <Accordion key={order.orderId} elevation={2}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`order-${order.orderId}-content`}
                            id={`order-${order.orderId}-header`}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <Typography fontWeight="bold" sx={{ flex: 1 }}>
                                    Order #{order.orderId}
                                </Typography>
                                <Typography sx={{ flex: 1, textAlign: "center" }}>
                                    {new Date(order.orderDate).toLocaleDateString("en-IN")}
                                </Typography>
                                <Typography fontWeight="bold" sx={{ flex: 1, textAlign: "right" }}>
                                    ₹{order.totalPrice}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <OrderSummary order={order} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

// ---------- MAIN COMPONENT ----------
const UserOrdersForAdmin = () => {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [noUser, setNoUser] = useState(false);
    const [fetched, setFetched] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => console.log("Current Admin:", getCurrentUser()), []);

    // Fetch orders for a specific user
    const fetchUserOrders = async () => {
        if (!userId.trim()) return;

        setLoading(true);
        setFetched(false);
        setError(null);
        setNoUser(false);
        setUser(null);
        setOrders([]);

        try {
            const userResponse = await apiClient.get(`/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(userResponse.data);

            const orderResponse = await apiClient.get(`/users/${userId}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(Array.isArray(orderResponse.data) ? orderResponse.data : []);
            setNoUser(false);
        } catch (err) {
            console.error("Error fetching user orders:", err);
            if (err.response && err.response.status === 404) {
                setNoUser(true);
            } else {
                setError("Failed to fetch user or orders. Please try again.");
            }
        } finally {
            setLoading(false);
            setFetched(true);
        }
    };

    // Fetch all orders
    const fetchAllOrders = async () => {
        setLoading(true);
        setFetched(false);
        setError(null);
        setNoUser(false);
        setUser(null);
        setOrders([]);

        try {
            const response = await apiClient.get("/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching all orders:", err);
            setError("Failed to fetch all orders. Please try again.");
        } finally {
            setLoading(false);
            setFetched(true);
        }
    };

    return (
        <Box sx={{ maxWidth: 920, mx: "auto", mt: 6, px: 2 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Admin Order Search
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={7}>
                        <TextField
                            label="User ID"
                            placeholder="Enter user ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={fetchUserOrders}
                                    disabled={loading || !userId.trim()}
                                    startIcon={loading ? <CircularProgress size={18} /> : null}
                                >
                                    {loading ? "Loading..." : "Find Orders"}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={fetchAllOrders}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={18} /> : null}
                                >
                                    {loading ? "Loading..." : "All Orders"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        {fetched && noUser && (
                            <Alert severity="warning">No such user found (ID: {userId}).</Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {error}
                            </Alert>
                        )}
                    </Grid>
                </Grid>

                {/* User info table */}
                {user && (
                    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Orders section */}
            <Box sx={{ mt: 3 }}>
                {fetched && orders.length > 0 && (
                    <UserOrders orders={orders} userIdLabel={user ? userId : null} />
                )}
                {fetched && orders.length === 0 && !error && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {user ? "This user has no orders yet." : "No orders found."}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default UserOrdersForAdmin;
