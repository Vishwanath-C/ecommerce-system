import {Box, Button, Card, CardContent, CardMedia, Chip, IconButton, Rating, Typography,} from "@mui/material";
import NoImageAvailable from "../assets/no-image-placeholder.png"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";

const ProductDetails = ({products, isLoggedIn, cart, onAddToCart, onIncrease, onDecrease, onBuyNow}) => {

    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const cartProduct = cart?.cartProducts?.find(item => item.productId === Number(id));
    const [product, setProduct] = useState(location.state?.product || null);

    useEffect(() => {
        if (products) {
            const updatedProduct = products.find(p => p.id === Number(id));
            if (updatedProduct) setProduct(updatedProduct);
        }
    }, [products, id]);


    if (!product) return null;

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: {xs: "column", md: "row"},
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                maxWidth: 900,
                mx: "auto",
                mt: 4,
            }}
        >
            {/* Product image */}
            <CardMedia
                component="img"
                image={product.imageUrl || product.image || NoImageAvailable}
                alt={product.name}
                sx={{
                    width: {xs: "100%", md: 400},
                    height: {xs: 300, md: "auto"},
                    objectFit: "contain",
                    borderRadius: 2,
                }}
            />

            {/* Product details */}
            <CardContent sx={{flex: 1}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.category}
                </Typography>

                <Rating value={product.rating || 0} readOnly sx={{mb: 2}}/>


                <Typography
                    variant="h6"
                    color="primary"
                    sx={{mt: 1, fontWeight: "bold"}}
                >
                    {product.unitPrice !== undefined
                        ? new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                        }).format(Number(product.unitPrice))
                        : "N/A"}
                </Typography>


                <Box sx={{display: "flex", gap: 2, mt: 2, justifyContent: "left", alignItems: "center"}}>

                    <Box sx={{p: 2, pt: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {product.stockQuantity === 0 ? (
                                <Chip
                                    label="Sold Out"
                                    color="error"
                                    variant="outlined"
                                    sx={{width: "100%", fontWeight: "bold"}}
                                />) :

                            !cartProduct ? (
                                <Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: 2,
                                        }}
                                        onClick={() => {
                                            if (!isLoggedIn) navigate('/login');
                                            else onAddToCart && onAddToCart(product);
                                        }}

                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        fullWidth
                                        size="small"
                                        sx={{
                                            mt: "4px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: 2,
                                        }}

                                        onClick={() => {
                                            if (!isLoggedIn) navigate('/login');
                                            else onBuyNow && onBuyNow(product);
                                        }}

                                    >Buy now</Button>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 2,
                                        p: 0.5,
                                    }}
                                >
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onDecrease && onDecrease(product)}
                                    >
                                        <RemoveIcon/>
                                    </IconButton>

                                    <Typography fontWeight="bold">{cartProduct.quantity}</Typography>

                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onIncrease && onIncrease(product)}
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </Box>
                            )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductDetails;
