import {useState} from "react";
import {Box, Button, Paper, TextField, Typography, Alert} from "@mui/material";
import apiClient from "../api"; // adjust path

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError("");

        if (!categoryName.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        try {

            const res = await apiClient.post(
                "/categories",
                {name: categoryName.trim(), description},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 201) {
                setSuccess(true);
                setCategoryName("");
                setDescription("");
            } else {
                setError("Failed to add category. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while adding the category.");
        }
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
            <Paper sx={{p: 4, width: 400, maxWidth: "90%", borderRadius: 3, boxShadow: 3}}>
                <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                    Add Category
                </Typography>

                {success && <Alert severity="success" sx={{mb: 2}}>Category added successfully!</Alert>}
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Category Name"
                        fullWidth
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mt: 2, fontWeight: "bold"}}
                    >
                        Add Category
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default AddCategory;
