import {useEffect, useState} from "react";
import {Box, Button, Paper, TextField, Typography, Alert, MenuItem} from "@mui/material";
import apiClient from "../api.js";
import api from "../api.js";

const AddProduct = () => {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImageUrl, setProductImageUrl] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");

    const token = localStorage.getItem("token");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productName || !productDescription || !category || !price || !stockQuantity) {
            setError("Please fill all fields.");
            setSuccess(false);
        }

        try {
            const response = await api.post("/products", {
                    name: productName,
                    description: productDescription,
                    imageUrl: productImageUrl,
                    price: price,
                    categoryId: category,
                    stockQuantity: stockQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        } catch (err) {
            setError("An error occurred while adding the product.");
        }


        setError("");
        setSuccess(true);

        setProductName("");
        setProductDescription("");
        setPrice("");
        setCategory("");
        setStockQuantity("");
    }

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


    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
            }}
        >

            <Paper
                sx={{
                    p: 4,
                    width: 400,
                    maxWidth: "90%",
                    borderRadius: 3,
                    boxShadow: 3
                }}>
                <Typography variant={"h5"} fontWeight={"bold"} align={"center"} gutterBottom>Add Product</Typography>
                {success && (
                    <Alert severity="success" sx={{mb: 2}}>
                        Product added successfully!
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        select={true}
                        label="category"
                        fullWidth={true}
                        required={true}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        margin={"normal"}
                    >
                        {categories.map(category => (<MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>))}

                    </TextField>
                    <TextField
                        label="Product Name"
                        fullWidth
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline={true}
                        rows={4}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        margin={"normal"}
                        required
                    />
                    <TextField
                        label="Image URL"
                        fullWidth
                        multiline={true}
                        rows={4}
                        value={productImageUrl}
                        onChange={(e) => setProductDescription(e.target.value)}
                        margin={"normal"}
                        required
                    />
                    <TextField
                        label={"Price"}
                        type={"number"}
                        fullWidth
                        required={true}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        margin={"normal"}
                        slotProps={{input: {min: 1}}}
                    />

                    <TextField
                        label={"Stock Quantity"}
                        type={"number"}
                        fullWidth
                        required
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        margin={"normal"}
                        slotProps={{input: {min: 1}}}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        sx={{mt: 2, fontWeight: "bold"}}
                    >Add product</Button>
                </form>
            </Paper>
        </Box>
    )

}

export default AddProduct;