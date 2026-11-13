import React from "react";
import "./SkeletonLoader.css";

/**
 * SkeletonLoader component for shimmer loading placeholders.
 * @param {string} variant - 'text', 'circular', 'rectangular', 'card', 'table-row'
 * @param {string|number} width - optional css width (e.g. '100%', 120, '40px')
 * @param {string|number} height - optional css height (e.g. 16, '120px')
 * @param {number} count - number of skeleton items to render (default 1)
 * @param {string} className - extra classes
 */
function SkeletonLoader({
    variant = "text",
    width,
    height,
    count = 1,
    className = ""
}) {
    const style = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    if (variant === "table-row") {
        return (
            <>
                {Array.from({ length: count }).map((_, index) => (
                    <tr key={index} className={`skeleton-table-row ${className}`}>
                        <td colSpan="100%">
                            <div className="skeleton-table-cell-placeholder" />
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    if (count > 1) {
        return (
            <div className="skeleton-group">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`skeleton skeleton-${variant} ${className}`}
                        style={style}
                        aria-hidden="true"
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}

export default SkeletonLoader;

