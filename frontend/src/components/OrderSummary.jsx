import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
} from "@mui/material";

const OrderSummary = ({order}) => {
    if (!order) return null;

    return (
        <Box sx={{maxWidth: 700, mx: "auto", mt: 4}}>
            <Card sx={{borderRadius: 3, boxShadow: 3}}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                        🛒 Order Summary
                    </Typography>

                    <Typography variant="body2" color="text.secondary" align="center">
                        Order ID: {order.orderId} | Status: {order.orderStatus} |
                        Date: {new Date(order.orderDate).toLocaleString()}
                    </Typography>

                    <Divider sx={{my: 2}}/>

                    {order.orderProducts.length === 0 ? (
                        <Typography align="center" color="text.secondary">
                            No items in this order.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{boxShadow: "none"}}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow >
                                        <TableCell sx={{fontWeight: "bold"}}>Product</TableCell>
                                        <TableCell sx={{fontWeight: "bold"}} align="center">Unit Price</TableCell>
                                        <TableCell sx={{fontWeight: "bold"}} align="center">Quantity</TableCell>
                                        <TableCell sx={{fontWeight: "bold"}} align="right">Line Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderProducts.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell align="center">₹{item.unitPrice}</TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="right">₹{order.totalPrice}</TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell colSpan={3} align="right" fontWeight="bold">
                                            Total:
                                        </TableCell>
                                        <TableCell align="right" fontWeight="bold">
                                            ₹{order.totalPrice}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default OrderSummary;
