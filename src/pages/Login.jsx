import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            await login(username, password);

            navigate("/dashboard");

        } catch (err) {

    console.log("Login Error:", err);

    console.log("Backend Response:", err.response?.data);

    setError(
        JSON.stringify(
            err.response?.data || err.message
        )
    );

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
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Login
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