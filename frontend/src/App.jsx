import {CssBaseline, Snackbar} from "@mui/material";
import {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import ProductList from "./components/ProductList.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import AddCategory from "./components/AddCategory.jsx";
import AddProduct from "./components/AddProduct.jsx";
import apiClient from "./api.js";
import {getCurrentUser} from "./utils/auth.js";
import UserOrdersPage from "./components/UserOrdersPage.jsx";
import UpdateProductForm from "./components/UpdateProductForm.jsx";
import UpdateCategory from "./components/UpdateCategoryForm.jsx";
import UpdateCategoryForm from "./components/UpdateCategoryForm.jsx";
import UserOrdersForAdmin from "./components/UserOrdersForAdmin.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState(
        {
            cartId: null,
            userId: null,
            cartProducts: [],
            totalPrice: 0
        }
    );
    const [cartProducts, setCartProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = getCurrentUser()?.id;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {console.log("App : ", products, " Filtered : ", filteredProducts);}, [products, filteredProducts]);

    const fetchProducts = async (e) => {
        try {
            const res = await apiClient.get('/products',
                {
                    headers: {Authorization: null} // or just remove the header entirely
                });
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchProductsByCategory = async (categoryId) => {
        try {
            const res = await apiClient.get(`/categories/${categoryId}/products`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setProducts(res.data);
            setFilteredProducts(res.data);
            console.log("Click : ", res.data);
            navigate("/app/products-in-category", {state: {products: res.data}});


        } catch (err) {
            console.error("Error fetching products:", err);
        }
    }

    useEffect(() => {
        if (token) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            apiClient.get(`users/${userId}/cart`, {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then((response) => {
                    const data = response.data;

                    if (data) {
                        setCart(data);
                        setCartProducts(data.cartProducts || []);
                    } else {
                        setCart({cartProducts: [], totalPrice: 0});
                        setCartProducts([]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isLoggedIn]);

    const handleAddAfterLogin = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) return prev;
            return [...prev, {...product, quantity: 1}];
        });
    };

    const showSnackbar = (msg) => {
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    };

    // const handleOnViewDetails = (product) => {
    //     console.log(product);
    //     navigate(`/app/products/${product.id}`, {state: {product: product}});
    // };

    const handleIncrease = async (product) => {
        console.log("Product in app : ", product);
        try {
            const response = await apiClient.patch(
                `/users/${userId}/cart/products/${product.id}/increase?quantity=1`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            console.log("Increased product", response.data.totalPrice);

            setCart(prevCart => {
                const newCartProducts = prevCart.cartProducts.map(cartProduct =>
                    cartProduct.productId === product.id
                        ? {
                            ...cartProduct,
                            quantity: cartProduct.quantity + 1,
                            totalPrice: (cartProduct.totalPrice ?? cartProduct.quantity * product.unitPrice) + product.unitPrice
                        }
                        : cartProduct
                );

                const newTotalPrice = prevCart.totalPrice + product.unitPrice;

                return {
                    ...prevCart,
                    cartProducts: newCartProducts,
                    totalPrice: newTotalPrice
                };
            });
        } catch (err) {
            showSnackbar("Cannot increase quantity. Stock limit exceeded!");
        }
    };


    const handleDecrease = async (product) => {
        try {
            await apiClient.patch(
                `/users/${userId}/cart/products/${product.id}/decrease?quantity=1`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setCart(prev => {
                const updatedProducts = prev.cartProducts
                    .map(cartProduct =>
                        cartProduct.productId === product.id
                            ? {
                                ...cartProduct,
                                quantity: cartProduct.quantity - 1,
                                totalPrice: (cartProduct.totalPrice ?? cartProduct.quantity * product.unitPrice) - product.unitPrice
                            }
                            : cartProduct
                    )
                    .filter(item => item.quantity > 0);

                const newTotal = updatedProducts.reduce((sum, item) => sum + item.totalPrice, 0);

                return {
                    ...prev,
                    cartProducts: updatedProducts,
                    totalPrice: newTotal
                };
            });
        } catch (err) {
            showSnackbar("Cannot decrease quantity.");
        }
    };
    const handleAddToCart = async (product) => {
        if (!isLoggedIn) {
            navigate("/login", {state: {from: location.pathname, productToAdd: product}});
            return;
        }

        console.log("Product to add in cart : ", product);

        try {
            const response = await apiClient.post(`/users/${userId}/cart/products`, {
                productId: product.id,
                quantity: 1
            }, {
                headers: {Authorization: `Bearer ${token}`},
            });

            console.log(response);

            setCart(prevCart => {
                // Only add if product is not already in cart
                const exists = (prevCart.cartProducts ?? []).some(item => item.productId === product.id);
                console.log("Exsits : ", exists);

                if (exists) {
                    return {
                        ...prevCart,
                        cartProducts: prevCart.cartProducts.map(p =>
                            p.productId === product.id ? {...p} : p
                        )
                    };
                }


                const newCartProducts = [...(prevCart.cartProducts ?? []), {
                    productId: product.id,
                    productName: product.name,
                    quantity: 1,
                    totalPrice: product.unitPrice
                }];

                const newTotalPrice = (prevCart.totalPrice ?? 0) + product.unitPrice;

                console.log("New :", newCartProducts);

                return {
                    ...prevCart,
                    cartProducts: newCartProducts,
                    totalPrice: newTotalPrice
                };
            });


        } catch (err) {
            showSnackbar("Cannot add more. Stock limit reached!");
        }
    };

    return (
        <>
            <CssBaseline/>
            <Routes>
                {/* 🟢 Public routes */}
                <Route element={<PublicLayout
                    isLoggedIn={isLoggedIn}
                    fetchProducts={fetchProducts}
                    products={filteredProducts}
                    setProducts={setProducts}
                    setFilteredProducts={setFilteredProducts}
                />}>
                    <Route path="/" element={<ProductList
                        products={filteredProducts}
                        isLoggedIn={isLoggedIn}
                        // onViewDetails={handleOnViewDetails}
                        cart={cart}
                        // cartProducts={cartProducts}
                        fetchProducts={fetchProducts}
                        // setCart={setCart}
                    />}/>
                    <Route path="/products/:id" element={<ProductDetails
                        products={filteredProducts}
                        cart={cart}
                        // cartProducts={cartProducts}
                        isLoggedIn={isLoggedIn}
                        fetchProducts={fetchProducts}/>
                    }/>
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} onAddAfterLogin={handleAddAfterLogin}/>}
                    />
                </Route>

                {/* 🔒 Protected routes */}
                <Route
                    path="/app/*"
                    element={<ProtectedRoute setIsLoggedIn={setIsLoggedIn}/>}
                >
                    <Route
                        element={
                            <DashboardLayout
                                setProducts={setProducts}
                                setIsLoggedIn={setIsLoggedIn}
                                isLoggedIn={isLoggedIn}
                                cart={cart}
                                setCart={setCart}
                                products={filteredProducts}
                                fetchProducts={fetchProducts}
                                setFilteredProducts={setFilteredProducts}
                                fetchProductsByCategory={fetchProductsByCategory}
                            />
                        }
                    >
                        <Route path="home" element={<ProductList
                            products={filteredProducts}
                            isLoggedIn={isLoggedIn}
                            cart={cart}
                            setCart={setCart}
                            onAddToCart={handleAddToCart}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            // onViewDetails={handleOnViewDetails}
                            showSnackBar={showSnackbar}
                            fetchProducts={fetchProducts}
                        />}/>
                        <Route path={"user-orders"} element={<UserOrdersPage/>}/>
                        <Route path={"user-orders-admin"} element={<UserOrdersForAdmin/>}/>
                        <Route path={"add-category"} element={<AddCategory/>}/>
                        <Route path={"update-category"} element={<UpdateCategoryForm/>}/>
                        <Route path={"add-product"} element={<AddProduct/>}/>
                        <Route path={"update-product"} element={<UpdateProductForm/>}/>
                        <Route path={"products-in-category"}
                               element={<ProductList
                                   products={filteredProducts}
                                   isLoggedIn={isLoggedIn}
                                   // products={products.filter(p => p.c === product.id)}
                                   cart={cart}
                                   setCart={setCart}
                                   onAddToCart={handleAddToCart}
                                   onIncrease={handleIncrease}
                                   onDecrease={handleDecrease}
                                   // onViewDetails={handleOnViewDetails}
                                   showSnackBar={showSnackbar}
                                   fetchProducts={fetchProducts}/>}/>

                        <Route path="products/:id" element={<ProductDetails
                            products={filteredProducts}
                            cart={cart}
                            isLoggedIn={isLoggedIn}
                            onAddToCart={handleAddToCart}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}/>
                        }/>


                    </Route>
                </Route>
            </Routes>
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
}

export default App;
