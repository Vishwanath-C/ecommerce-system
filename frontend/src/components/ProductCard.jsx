import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Rating,
    Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NoImageAvailable from "../assets/no-image-placeholder.png";
import {useNavigate} from "react-router-dom";

const ProductCard = ({
                         isLoggedIn,
                         product,
                         cartProduct,
                         onAddToCart,
                         onIncrease,
                         onDecrease,
                         onViewDetails,
                         onBuyNow,
                         fetchProducts
                     }) => {
    if (!product) return null;

    const navigate = useNavigate();

    const handleOnViewDetails = () => {
        const url = isLoggedIn ? `/app/products/${product.id}` : `/products/${product.id}`;
        navigate(url, {
            state: {
                product
            }
        });
    };


    return (
        <Card
            sx={{
                width: 180,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
                bgcolor: "white",
                margin: "10px",
            }}
        >
            <CardActionArea onClick={handleOnViewDetails}>
                <CardMedia
                    component="img"
                    image={product?.imageUrl || product?.image || NoImageAvailable}
                    alt={product?.name || "Product image"}
                    sx={{
                        height: 200,
                        objectFit: "contain",
                        p: 1,
                    }}
                />

                <CardContent sx={{p: 2}}>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            minHeight: "3rem",
                        }}
                    >
                        {product.name}
                    </Typography>

                    <Rating
                        value={product.rating || 0}
                        readOnly
                        size="small"
                        sx={{mt: 1}}
                    />

                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{mt: 1, fontWeight: "bold"}}
                    >
                        {product.unitPrice !== undefined
                            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(product.unitPrice))
                            : "N/A"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mt: 1,
                        }}
                    >
                        {product.description}
                    </Typography>
                </CardContent>
            </CardActionArea>

            {/* ✅ Cart Controls */}
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
                                    // else handleAddToCartLocal(product);
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
        </Card>
    );
};

export default ProductCard;
