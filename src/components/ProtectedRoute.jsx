import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullPageLoader from "./FullPageLoader";

function ProtectedRoute() {
    const { isAuthenticated, initializing } = useAuth();

    // Show professional loading screen while checking session / verifying tokens
    if (initializing) {
        return (
            <FullPageLoader
                message="Checking your session..."
                subtitle="Verifying credentials and preparing dashboard..."
            />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
