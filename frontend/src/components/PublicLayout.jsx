import AppBarComponent from "./AppBarComponent.jsx";
import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";

const PublicLayout = ({isLoggedIn, fetchProducts, products, setProducts, setFilteredProducts}) => {
    const APPBAR_HEIGHT = 90; // must match AppBarComponent minHeight

    return (
        <Box>
            <AppBarComponent
                isLoggedIn={isLoggedIn}
                products={products}
                fetchProducts={fetchProducts}
                setProducts={setProducts}
                setFilteredProducts={setFilteredProducts}/>

            {/* Spacer to push Outlet below fixed AppBar */}
            <Box sx={{p: 3, mt: "64px"}}>
                <Outlet/>
            </Box>
        </Box>
    );
};

export default PublicLayout;
