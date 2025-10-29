import {Outlet, useNavigate} from "react-router-dom";
import AppBarComponent from "./AppBarComponent";
import {Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import AddCategory from "./AddCategory.jsx";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = ({
                             isLoggedIn,
                             setIsLoggedIn,
                             cart,
                             setCart,
                             products,
                             setProducts,
                             fetchProducts,
                             setFilteredProducts,
                             fetchProductsByCategory
                         }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [activePage, setActivePage] = useState(null); // null | 'addCategory' | other pages
    const navigate = useNavigate();




    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* AppBar with cart */}
            <AppBarComponent
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                onMenuToggle={handleMenuToggle}
                cart={cart}
                setCart={setCart}
                products={products}
                setProducts={setProducts}
                setFilteredProducts={setFilteredProducts}
                fetchProducts={fetchProducts}
            />

            <Sidebar isMenuOpen={isMenuOpen} fetchProducts={fetchProducts}
                     fetchProductsByCategory={fetchProductsByCategory}/>

            {/* Page content */}
            <Box
                sx={{
                    position: "relative",
                    mt: "90px", // space for AppBar
                    mb: "50px",
                    ml: isMenuOpen ? "250px" : 0, // space for sidebar
                    width: isMenuOpen ? `calc(100% - 250px)` : "100%",
                    minHeight: "calc(100vh - 90px)",

                }}>
                <Outlet/>
            </Box>
        </>
    );
};

export default DashboardLayout;
