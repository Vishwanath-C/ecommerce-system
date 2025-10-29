import {useState} from "react";
import {useNavigate} from "react-router-dom";
import apiClient from "../api";
// MUI imports
import {Alert, Box, Button, Container, Paper, TextField, Typography} from "@mui/material";

const Register = () => {
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await apiClient.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
            });
            setSuccess(true);


            setTimeout(() => {
                setSuccess(false);
                navigate("/");
            }, 3000);


        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };


    const validate = () => {
        let tempErrors = {};

        if (!firstName.trim()) tempErrors.firstName = "First name is required";
        if (!lastName.trim()) tempErrors.lastName = "Last name is required";

        if (!email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = "Enter a valid email";
        }

        if (!password) {
            tempErrors.password = "Password is required";
        } else if (password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters";
        }

        if (password !== confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };



    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper
                elevation={4}
                sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafb" }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    color="primary"
                    gutterBottom
                    fontWeight="bold"
                >
                    Register
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        type="text"
                        margin="normal"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        error={Boolean(errors.firstName)}
                        helperText={errors.firstName}
                    />
                    <TextField
                        fullWidth
                        type="text"
                        margin="normal"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        error={Boolean(errors.lastName)}
                        helperText={errors.lastName}
                    />
                    <TextField
                        fullWidth
                        type="email"
                        margin="normal"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Re-enter Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, borderRadius: 2 }}
                    >
                        Register
                    </Button>
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Registration successful!
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
