
import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./FullPageLoader.css";

function FullPageLoader({
    message = "Initializing application...",
    subtitle = "Please wait while we set things up"
}) {
    return (
        <div
            className="fullpage-loader-overlay"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="fullpage-loader-card">

                <LoadingSpinner size="large" />

                <h3 className="fullpage-loader-title">
                    {message}
                </h3>

                {subtitle && (
                    <p className="fullpage-loader-subtitle">
                        {subtitle}
                    </p>
                )}

            </div>
        </div>
    );
}

export default FullPageLoader;
