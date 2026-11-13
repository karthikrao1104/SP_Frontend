import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import SkeletonLoader from "../components/SkeletonLoader";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
    const { user, logout, isLoggingOut } = useAuth();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch prediction history
    const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("prediction/history/");
            setHistory(response.data.history || []);
        } catch (err) {
            console.error("History error:", err);
            setError("Unable to load prediction history. Please check your connection or retry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Logout
    const handleLogout = async () => {
        if (isLoggingOut) return;
        await logout();
        navigate("/login");
    };

    // Calculate statistics
    const totalPredictions = history.length;
    const passCount = history.filter((item) => item.prediction === "PASS").length;
    const failCount = history.filter((item) => item.prediction === "FAIL").length;

    return (
        <div className="dashboard">
            <header>
                <h2>Student Performance System</h2>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-label="Logout"
                >
                    {isLoggingOut ? (
                        <LoadingSpinner
                            size="small"
                            inline
                            text="Signing out..."
                        />
                    ) : (
                        "Logout"
                    )}
                </button>
            </header>

            <main>
                <h1>Welcome {user?.username || "Student"}</h1>
                <p>Student Performance Dashboard</p>

                {/* Statistics Cards */}
                <div className="stats" aria-busy={loading}>
                    {loading ? (
                        <>
                            <SkeletonLoader variant="card" />
                            <SkeletonLoader variant="card" />
                            <SkeletonLoader variant="card" />
                        </>
                    ) : (
                        <>
                            <div className="card">
                                <h3>Total Predictions</h3>
                                <h1>{totalPredictions}</h1>
                            </div>

                            <div className="card">
                                <h3>Predicted Pass</h3>
                                <h1 style={{ color: "#2a7a2a" }}>{passCount}</h1>
                            </div>

                            <div className="card">
                                <h3>Predicted Fail</h3>
                                <h1 style={{ color: "#c0392b" }}>{failCount}</h1>
                            </div>
                        </>
                    )}
                </div>

                {/* Prediction Button */}
                <section className="prediction-action-section">
                    <h2>Student Prediction</h2>
                    <p>
                        Predict student performance using the ML model.
                    </p>
                    <button
                        className="start-prediction-btn"
                        onClick={() => navigate("/prediction")}
                    >
                        Start Prediction
                    </button>
                </section>

                {/* Prediction History */}
                <section className="history-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h2 style={{ margin: 0 }}>Prediction History</h2>
                        {!loading && (
                            <button
                                type="button"
                                onClick={fetchHistory}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "6px 14px",
                                    fontSize: "13px",
                                    borderRadius: "6px"
                                }}
                            >
                                Refresh History
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="table-container" aria-busy="true">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Attendance</th>
                                        <th>Study Hours</th>
                                        <th>Internal Marks</th>
                                        <th>Assignment Marks</th>
                                        <th>Result</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SkeletonLoader variant="table-row" count={5} />
                                </tbody>
                            </table>
                            <div style={{ padding: "16px 0", textAlign: "center" }}>
                                <LoadingSpinner size="medium" text="Loading prediction history..." />
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="auth-error" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{error}</span>
                            <button
                                onClick={fetchHistory}
                                style={{
                                    background: "#c0392b",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    borderRadius: "4px"
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && history.length === 0 && (
                        <div style={{
                            background: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "36px 20px",
                            textAlign: "center",
                            color: "#666"
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" style={{ marginBottom: "12px" }}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <h3 style={{ fontSize: "16px", color: "#333", marginBottom: "6px" }}>No Prediction History Yet</h3>
                            <p style={{ fontSize: "13px" }}>Run your first student prediction to view performance data and history here.</p>
                        </div>
                    )}

                    {!loading && !error && history.length > 0 && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Attendance</th>
                                        <th>Study Hours</th>
                                        <th>Internal Marks</th>
                                        <th>Assignment Marks</th>
                                        <th>Result</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.attendance}%</td>
                                            <td>{item.study_hours}</td>
                                            <td>{item.internal_marks}</td>
                                            <td>{item.assignment_marks}</td>
                                            <td>
                                                <span
                                                    className={
                                                        item.prediction === "PASS"
                                                            ? "pass"
                                                            : "fail"
                                                    }
                                                >
                                                    {item.prediction}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(item.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
