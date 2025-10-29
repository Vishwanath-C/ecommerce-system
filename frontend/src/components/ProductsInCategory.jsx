import {List, ListItem, ListItemText, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import apiClient from "../api.js";

const ProductsInCategory = ({isLoggedIn, cart, onAddToCart, onIncrease, onDecrease, fetchProducts}) => {
    const location = useLocation();
    const products = location.state?.products || [];
    const navigate = useNavigate();

    if (!products || products.length === 0) {
        return <Typography variant="body2">No products found.</Typography>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                padding: 20,
                justifyContent: "left",


            }}
        >
            {products.map((product) => {
                const cartProduct = cart.cartProducts.find((item) => item.id === product.id);
                return (
                    <ProductCard
                        isLoggedIn={isLoggedIn}
                        key={product.id}
                        product={product}
                        cartProduct={cartProduct}
                        onAddToCart={onAddToCart}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        fetchProducts={fetchProducts}
                        onViewDetails={(p) => navigate(`/app/products/${p.id}`, {state: {product: p}})}
                    />
                );
            })}
        </div>
    );
};

export default ProductsInCategory;
