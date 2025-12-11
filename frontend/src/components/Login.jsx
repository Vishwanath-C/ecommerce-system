import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Alert, Box, Button, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import apiClient from "../api";


const decodeJWT = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded;
    } catch (err) {
        console.error("Failed to decode JWT:", err);
        return null;
    }
};

const Login = ({setIsLoggedIn, onAddAfterLogin}) => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from  || '/';


    const productToAdd = location.state?.productToAdd;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const res = await apiClient.post('/auth/login', {email: email.trim(), password});
            const token = res.data.accessToken;

            if (!token) throw new Error("No token received from backend.");

            localStorage.setItem("token", token);

            const decodedJWT = decodeJWT(token);
            if (!decodedJWT) throw new Error("Failed to decode token.");

            localStorage.setItem("role", decodedJWT.role);

            console.log("Decoded JWT : ", decodedJWT);


            setIsLoggedIn(true);
            if(productToAdd && onAddAfterLogin){
                onAddAfterLogin(productToAdd);
            }
            navigate("/app/home", { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "#f0f2f5",
            p: 2
        }}>
            <Paper sx={{p: 4, width: 400, maxWidth: "90%", borderRadius: 3, boxShadow: 3}}>
                <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>Login</Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        edge="end"
                                        aria-label="toggle password visibility">
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mt: 2, fontWeight: "bold"}}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Typography variant="body2">
                            Not registered?{" "}
                            <Typography
                                component="span"
                                color="primary"
                                sx={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    "&:hover": {
                                        color: "primary.dark",
                                    },
                                }}
                                onClick={() => navigate("/register")}
                            >
                                Register here
                            </Typography>
                        </Typography>
                    </Box>



                    {error && (
                        <Alert
                            severity="error"
                            sx={{mt: 3}}
                            action={
                                <Button color="inherit" size="small" onClick={() => {
                                    setError(false);
                                    setEmail('');
                                    setPassword('');
                                }}>
                                    Retry
                                </Button>
                            }
                        >
                            Credentials are incorrect
                        </Alert>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
