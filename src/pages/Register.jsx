import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            const response = await api.post(
                "accounts/register/",
                {
                    username,
                    email,
                    password
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {

            setError(
                JSON.stringify(err.response?.data || err.message)
            );

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
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Register
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