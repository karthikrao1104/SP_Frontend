import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import FullPageLoader from "../components/FullPageLoader";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, initializing } = useAuth();
    const navigate = useNavigate();

    // Prevent rendering before auth check finishes
    if (initializing) {
        return (
            <FullPageLoader
                message="Checking your session..."
                subtitle="Initializing application..."
            />
        );
    }

    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("accounts/register/", {
                username,
                email,
                password,
            });

            setMessage(response.data.message || "Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            const data = err.response?.data;
            if (data?.detail) {
                setError(data.detail);
            } else if (typeof data === "string") {
                setError(data);
            } else if (data) {
                setError(JSON.stringify(data));
            } else {
                setError(err.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Student Registration</h2>

                {error && <div className="auth-error">{error}</div>}

                {message && <div className="auth-success">{message}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                            placeholder="Create a password"
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
                                text="Creating your account..."
                            />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
