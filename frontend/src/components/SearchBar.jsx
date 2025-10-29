import { useState, useEffect } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ products, setFilteredProducts }) => {
    const [query, setQuery] = useState("");
    const [dupProducts, setDupProducts] = useState([]);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");


    // Store a local snapshot only once
    useEffect(() => {
        if (dupProducts.length === 0 && products.length > 0) {
            setDupProducts(products.slice());
            setFilteredProducts(products);
        }
    }, [products]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        if (!value) {
            setFilteredProducts(dupProducts);
            return;
        }

        const filtered = dupProducts.filter((product) =>
            product.name.toLowerCase().includes(value)
        );
        setFilteredProducts(filtered);
    };

    return (
        <Paper
            sx={{
                display: "flex",
                alignItems: "center",
                width: 300,
                height: 40,
                px: 1,
                borderRadius: "20px",
                bgcolor: "#ffffff",
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search products..."
                value={query}
                onChange={handleSearch}
            />
            <IconButton sx={{ p: "10px", color: "#1976d2" }}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;
