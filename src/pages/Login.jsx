import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import FullPageLoader from "../components/FullPageLoader";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated, initializing } = useAuth();
    const navigate = useNavigate();

    // Prevent displaying login screen before initial authentication check finishes
    if (initializing) {
        return (
            <FullPageLoader
                message="Checking your session..."
                subtitle="Initializing application..."
            />
        );
    }

    // If already authenticated, redirect straight to dashboard (no flash of login)
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            console.log("Login Error:", err);
            console.log("Backend Response:", err.response?.data);

            const data = err.response?.data;
            if (data?.detail) {
                setError(data.detail);
            } else if (typeof data === "string") {
                setError(data);
            } else if (data) {
                setError(JSON.stringify(data));
            } else {
                setError(err.message || "Unable to sign in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Student Login</h2>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner
                                size="small"
                                inline
                                text="Signing in..."
                            />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
