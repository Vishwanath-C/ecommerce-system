import { jwtDecode } from "jwt-decode";  // note the curly braces


export function getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        return jwtDecode(token);
    } catch (err) {
        return null;
    }
}