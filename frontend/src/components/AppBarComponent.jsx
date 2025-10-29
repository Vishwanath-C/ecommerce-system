import MenuIcon from "@mui/icons-material/Menu";
import {Home as HomeIcon, ShoppingCart as ShoppingCartIcon} from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import apiClient from "../api.js";
import {getCurrentUser} from "../utils/auth.js";
import SearchBar from "./SearchBar.jsx";

const AppBarComponent = ({
                             isLoggedIn,
                             setIsLoggedIn,
                             onMenuToggle,
                             cart,
                             setCart,
                             products,
                             setProducts,
                             setFilteredProducts,
                             fetchProducts
                         }) => {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");
    const [cartProducts, setCartProducts] = useState([]);

    const token = localStorage.getItem("token");
    const userId = getCurrentUser()?.id;

    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);

    useEffect(() => {
        setCartProducts(cart?.cartProducts || []);
    }, [cart]);


    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        if (setIsLoggedIn) setIsLoggedIn(false);
        setLogoutOpen(false);
        navigate("/"); // back to public products page
    };

    const handleCheckout = async () => {
        if (cartProducts.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setCheckoutTotal(cart.totalPrice);
        setCartOpen(false);
        setCheckoutDialogOpen(true);
    }

    const handleConfirmCheckout = async () => {
        try {
            const response = await apiClient.post(`/users/${userId}/cart/checkout`, {}, {
                headers: {Authorization: `Bearer ${token}`},
            });

            const cartBeforeCheckout = cart; // save cart before clearing
            setCart({cartProducts: [], totalPrice: 0});

            setProducts(prev =>
                prev.map(p => {
                    const cartItem = cartBeforeCheckout.cartProducts.find(c => c.productId === p.id);
                    if (cartItem) {
                        return {...p, stockQuantity: p.stockQuantity - cartItem.quantity};
                    }
                    return p;
                })
            );
        } catch (err) {
            console.log("Checkout failed! ", err);
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{backgroundColor: "#1976d2", color: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"}}
            >

                <Toolbar
                    sx={{minHeight: "90px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={() => {
                            fetchProducts();
                            if (!isLoggedIn) {
                                navigate("/");
                            } else {
                                navigate("/app/home");
                            }
                        }}
                        sx={{mr: 2}}
                    >
                        <HomeIcon/>
                    </IconButton>


                    {/* Mobile menu icon */}
                    {isMobile && isLoggedIn && (
                        <IconButton color="inherit" onClick={onMenuToggle}>
                            <MenuIcon/>
                        </IconButton>
                    )}

                    {/* Role badge */}
                    {!isMobile && isLoggedIn && (
                        <Box
                            sx={{
                                bgcolor: "#ffc107",
                                color: "#212529",
                                fontWeight: 600,
                                px: 2.5,
                                py: 0.5,
                                borderRadius: "8px",
                                mr: 1,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}
                        >
                            {role ? `Logged in as: ${role}` : "Guest"}
                        </Box>
                    )}


                    {/* Title */}
                    <Typography variant="h6"
                                sx={{flexGrow: 1, textAlign: "center", fontWeight: "bold", fontSize: "1.4rem"}}>
                        ECommerce System
                    </Typography>

                    <Box sx={{mx: 2}}>
                        <SearchBar products={products} setFilteredProducts={setFilteredProducts}/>
                    </Box>

                    {/* Cart icon */}
                    {location.pathname !== "/login" && (
                        isLoggedIn ? (
                            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                                <Badge badgeContent={cartProducts?.length || 0} color="error">
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                        ) : (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{fontWeight: "bold"}}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        )
                    )}

                    {/* Logout button */}
                    {!isMobile && isLoggedIn && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setLogoutOpen(true)}
                            sx={{
                                bgcolor: "white",
                                color: "#1976d2",
                                fontWeight: "bold",
                                ml: 2,
                                "&:hover": {bgcolor: "#f0f0f0"}
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Cart drawer */}
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 400,
                        p: 3,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                    },
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    align="center"
                    gutterBottom
                    sx={{mb: 2}}
                >
                    🛒 Your Cart
                </Typography>

                {cartProducts.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary">
                        Your cart is empty.
                    </Typography>
                ) : (
                    <>
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                                mb: 2,
                            }}
                        >
                            <Table size="small">
                                <TableHead sx={{bgcolor: "#f5f5f5"}}>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: "bold"}}>
                                            Product
                                        </TableCell>
                                        <TableCell align="center" sx={{fontWeight: "bold"}}>
                                            Quantity
                                        </TableCell>
                                        <TableCell align="right" sx={{fontWeight: "bold"}}>
                                            Price (₹)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {cartProducts.map((cartProduct, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{cartProduct.productName}</TableCell>

                                            {/* Quantity Controls */}
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onDecrease(cartProduct)}
                                                    >
                                                        <RemoveIcon fontSize="small"/>
                                                    </IconButton>
                                                    <Typography fontWeight="bold">{cartProduct.quantity}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onIncrease(cartProduct)}
                                                    >
                                                        <AddIcon fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </TableCell>

                                            <TableCell align="right">
                                                {cartProduct.totalPrice !== undefined
                                                    ? new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR'
                                                    }).format(Number(cartProduct.totalPrice))
                                                    : "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Grand Total Row */}
                                    <TableRow sx={{bgcolor: "#f5f5f5"}}>
                                        <TableCell colSpan={2} align="right" sx={{fontWeight: "bold"}}>
                                            Grand Total:
                                        </TableCell>
                                        <TableCell align="right" sx={{fontWeight: "bold"}}>
                                            {/*₹{cart.totalPrice}*/}
                                            {cart.totalPrice !== undefined
                                                ? new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                }).format(Number(cart.totalPrice))
                                                : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{my: 2}}/>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                fontWeight: "bold",
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: "#1976d2",
                                "&:hover": {backgroundColor: "#1565c0"},
                            }}
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </>
                )}
            </Drawer>

            {/* 🎉 Checkout Success Dialog */}
            {/* Checkout Dialog (Confirm ➜ Success) */}
            <Dialog
                open={checkoutDialogOpen}
                onClose={() => setCheckoutDialogOpen(false)}
                sx={{"& .MuiPaper-root": {borderRadius: 3, p: 2, minWidth: 300}}}
            >
                {cart?.totalPrice > 0 ? (
                    // Step 1: Confirmation view
                    <>
                        <DialogTitle sx={{textAlign: "center", fontWeight: "bold"}}>
                            🛒 Confirm Checkout
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{textAlign: "center", fontSize: "1rem"}}>
                                Are you sure you want to proceed with your order?
                            </DialogContentText>
                            <Typography
                                textAlign="center"
                                variant="h6"
                                sx={{mt: 2, fontWeight: "bold"}}
                            >
                                Total Amount: ₹{cart.totalPrice}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{justifyContent: "center", pb: 2}}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setCheckoutDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleConfirmCheckout();
                                    setCheckoutTotal(cart.totalPrice); // Switch to success view
                                    if (setCart) setCart({cartProducts: [], totalPrice: 0});
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    // Step 2: Success view
                    <>
                        <DialogTitle sx={{textAlign: "center", fontWeight: "bold"}}>
                            🎉 Order Placed!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{textAlign: "center", fontSize: "1rem"}}>
                                Thank you for shopping with us!
                            </DialogContentText>
                            {/*<Typography*/}
                            {/*    textAlign="center"*/}
                            {/*    variant="h6"*/}
                            {/*    sx={{ mt: 2, fontWeight: "bold" }}*/}
                            {/*>*/}
                            {/*    Total Amount: ₹{checkoutTotal}*/}
                            {/*</Typography>*/}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: "center", pb: 2}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setCheckoutDialogOpen(false);
                                    setCheckoutTotal(0); // reset for next time
                                }}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Logout dialog */}
            <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
                <DialogTitle sx={{textAlign: "center", fontWeight: "bold"}}>Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{textAlign: "center"}}>Are you sure you want to logout?</DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center", gap: 2, pb: 2}}>
                    <Button variant="outlined" onClick={() => setLogoutOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={handleLogoutConfirm}>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AppBarComponent;
