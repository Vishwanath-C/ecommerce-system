import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn }) => {
    const token = localStorage.getItem("token");

    if (!token && !isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>

            {/* Outlet will render the nested routes (like Layout) */}
            <Outlet />
        </Box>
    );
};

export default ProtectedRoute;
