import {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Paper,
    Select,
    InputLabel,
    FormControl,
    Button,
} from "@mui/material";
import apiClient from "../api.js";

const UpdateProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        unitPrice: "",
        stockQuantity: "",
    });

    const [errors, setErrors] = useState({
        unitPrice: "",
        stockQuantity: "",
    });

    const token = localStorage.getItem("token");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get("/categories", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products when category changes
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchProducts = async () => {
            try {
                const res = await apiClient.get(`/categories/${selectedCategory}/products`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setProducts(res.data);
                setSelectedProductId("");
                setProductDetails({name: "", description: "", unitPrice: "", stockQuantity: ""});
                setErrors({unitPrice: "", stockQuantity: ""});
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    // Update product details when product is selected
    useEffect(() => {
        if (!selectedProductId) return;

        const product = products.find((p) => p.id === selectedProductId);
        if (product) {
            setProductDetails({
                name: product.name,
                description: product.description,
                unitPrice: product.unitPrice,
                stockQuantity: product.stockQuantity,
            });
            setErrors({unitPrice: "", stockQuantity: ""});
        }
    }, [selectedProductId, products]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        // Validate inputs immediately
        if (name === "unitPrice") {
            if (value === "" || parseFloat(value) <= 0) {
                setErrors((prev) => ({...prev, unitPrice: "Unit price must be positive"}));
            } else {
                setErrors((prev) => ({...prev, unitPrice: ""}));
            }
        }

        if (name === "stockQuantity") {
            if (value === "" || parseInt(value) < 0) {
                setErrors((prev) => ({...prev, stockQuantity: "Stock quantity cannot be negative"}));
            } else {
                setErrors((prev) => ({...prev, stockQuantity: ""}));
            }
        }

        setProductDetails((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if errors exist
        if (errors.unitPrice || errors.stockQuantity) {
            alert("Please fix validation errors before submitting.");
            return;
        }

        try {
            await apiClient.put(
                `/products/${selectedProductId}`,
                {
                    name: productDetails.name,
                    description: productDetails.description,
                    price: parseFloat(productDetails.unitPrice),
                    stockQuantity: parseInt(productDetails.stockQuantity),
                    categoryId: selectedCategory,
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );
            alert("Product updated successfully!");
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
            }}>
            <Paper sx={{maxWidth: 600, mx: "auto", mt: 4, p: 3, borderRadius: 3, boxShadow: 3}}>
                <Typography variant="h5" gutterBottom fontWeight="bold" align={"center"}>
                    Update Product
                </Typography>

                {/* Category Dropdown */}
                <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Category"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Product Dropdown */}
                {products.length > 0 && (
                    <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel>Product</InputLabel>
                        <Select
                            value={selectedProductId}
                            label="Product"
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            {products.map((prod) => (
                                <MenuItem key={prod.id} value={prod.id}>
                                    {prod.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Product Details */}
                {selectedProductId && (
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{display: "flex", flexDirection: "column", gap: 2}}
                    >
                        <TextField
                            label="Name"
                            value={productDetails.name}
                            name="name"
                            InputProps={{readOnly: true}}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={productDetails.description}
                            name="description"
                            InputProps={{readOnly: true}}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Unit Price"
                            value={productDetails.unitPrice}
                            name="unitPrice"
                            type="number"
                            onChange={handleChange}
                            error={!!errors.unitPrice}
                            helperText={errors.unitPrice}
                            fullWidth
                        />
                        <TextField
                            label="Stock Quantity"
                            value={productDetails.stockQuantity}
                            name="stockQuantity"
                            type="number"
                            onChange={handleChange}
                            error={!!errors.stockQuantity}
                            helperText={errors.stockQuantity}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" sx={{mt: 2}}>
                            Update Product
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default UpdateProductForm;
