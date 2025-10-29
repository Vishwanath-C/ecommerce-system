import {useEffect} from "react";
import ProductCard from "./ProductCard";
import {useLocation, useNavigate} from "react-router-dom";
import apiClient from "../api.js";

const ProductList = ({products, isLoggedIn, cart, onAddToCart, onIncrease, onDecrease, fetchProducts}) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Scroll smoothly to the top of the page or container
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [products]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleBuyNow = async (product) => {
        if (isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            const response = await apiClient.post();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div style={{display: "flex", flexWrap: "wrap", gap: 20, padding: 20, justifyContent: "left"}}>
                {products.map((product) => {
                    const cartProduct = cart.cartProducts.find((item) => item.productId === product.id);
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
                            // onViewDetails={onViewDetails}
                            // onViewDetails={(p) => navigate(`/app/products/${p.id}`, { state: { product: p } }

                        />
                    );
                })}
            </div>
        </>
    );
};


export default ProductList;
