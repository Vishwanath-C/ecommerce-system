import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import apiClient from "../api.js";
import OrderSummary from "../components/OrderSummary";
import {getCurrentUser} from "../utils/auth.js";


const ViewOrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    const userId = getCurrentUser()?.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data); // assuming List<OrderResponseDto>
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, token]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
                <Typography align="center" variant="h6" color="text.secondary">
                    You have no orders yet.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                Your Orders
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {orders.map((order) => (
                    <Accordion key={order.orderId} elevation={2}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`order-${order.orderId}-content`}
                            id={`order-${order.orderId}-header`}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <Typography fontWeight="bold" sx={{ flex: 1 }}>
                                    Order #{order.orderId}
                                </Typography>

                                <Typography sx={{ flex: 1, textAlign: "center" }}>
                                    {new Date(order.orderDate).toLocaleDateString()}
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

export default UserOrdersPage;
