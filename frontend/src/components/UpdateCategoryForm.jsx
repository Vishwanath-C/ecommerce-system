import {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
} from "@mui/material";
import apiClient from "../api.js";

const UpdateCategoryForm = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const token = localStorage.getItem("token");

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

    return (
        <Box sx={{maxWidth: 600, mt: 4, mx: "auto", p: 2}}>
            <Typography variant="h5" fontWeight={"bold"}>Catergory</Typography>

            <FormControl fullWidth={true} sx={{mb: 2}}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={selectedCategory}
                    label={"category"}
                    onSelect={e => {setSelectedCategory(e.target.value); console.log(selectedCategory)}}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default UpdateCategoryForm;