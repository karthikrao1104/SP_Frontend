import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Create Context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access")
    );
    // Initial app authentication checking state
    const [initializing, setInitializing] = useState(true);
    // Asynchronous logout loading state
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Initial check: if token exists, verify or fetch user details
    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const token = localStorage.getItem("access");

            if (!token) {
                if (isMounted) {
                    setInitializing(false);
                }
                return;
            }

            try {
                // Fetch user info from accounts/dashboard/ endpoint to validate token and populate user state
                const response = await api.get("accounts/dashboard/");
                if (isMounted) {
                    setUser({ username: response.data.username });
                    setAccessToken(token);
                }
            } catch (err) {
                console.warn("Initial authentication verification failed:", err);
                // Token was invalid or expired (and refresh in api interceptor also failed)
                if (isMounted) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    setAccessToken(null);
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setInitializing(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    // Login function
    const login = async (username, password) => {
        const response = await api.post("accounts/login/", {
            username,
            password,
        });

        const { access, refresh } = response.data;

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        setAccessToken(access);
        setUser({ username });
    };

    // Logout function - handles asynchronous state if needed
    const logout = async () => {
        setIsLoggingOut(true);
        try {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setAccessToken(null);
            setUser(null);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                initializing,
                isLoggingOut,
                login,
                logout,
                isAuthenticated: Boolean(accessToken),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    return useContext(AuthContext);
}
