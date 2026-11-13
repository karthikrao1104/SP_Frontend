import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Lazy-loaded route components for performance & chunk optimization
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Prediction = lazy(() => import("./pages/Prediction"));

import ProtectedRoute from "./components/ProtectedRoute";
import FullPageLoader from "./components/FullPageLoader";

function App() {
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <FullPageLoader
                        message="Loading page..."
                        subtitle="Please wait a moment"
                    />
                }
            >
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/prediction" element={<Prediction />} />
                    </Route>

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/register" replace />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
