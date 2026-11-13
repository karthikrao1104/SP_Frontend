import React from "react";
import "./LoadingSpinner.css";

/**
 * LoadingSpinner component
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} color - optional color override (default inherit or theme primary)
 * @param {string} text - optional loading text displayed next to or below spinner
 * @param {boolean} inline - if true, displayed inline with text (e.g. inside buttons)
 * @param {string} className - extra custom classes
 */
function LoadingSpinner({
    size = "medium",
    color,
    text,
    inline = false,
    className = ""
}) {
    const spinnerStyle = color ? { borderTopColor: color } : {};

    return (
        <div
            className={`spinner-wrapper ${inline ? "spinner-inline" : "spinner-block"} ${className}`}
            role="status"
            aria-live="polite"
        >
            <div
                className={`loading-spinner spinner-${size}`}
                style={spinnerStyle}
                aria-hidden="true"
            />
            {text && <span className="spinner-text">{text}</span>}
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export default LoadingSpinner;

