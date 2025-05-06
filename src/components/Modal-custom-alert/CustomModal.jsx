import React, { useEffect, useRef, useState } from "react";

export function CustomModal({
    show,
    onClose,
    title = "Title",
    message = "This is a customizable modal.",
    icon = "✔",
    color = "#4caf50",
    firstButton,
    secondButton,
    doneButton,
}) {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (show) {
            setTimeout(() => setVisible(true), 10); // pequeno delay para iniciar animação
        } else {
            setVisible(false);
        }
    }, [show]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                transition: "opacity 0.3s ease",
                opacity: visible ? 1 : 0,
            }}
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    width: "320px",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    transform: visible ? "scale(1)" : "scale(0.8)",
                    transition: "transform 0.3s ease",
                }}
            >
                <div
                    style={{
                        backgroundColor: color,
                        borderRadius: "50%",
                        padding: "12px",
                        position: "absolute",
                        top: "-30px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "#fff",
                        fontSize: "24px",
                    }}
                >
                    {icon}
                </div>
                <h2 style={{ marginTop: "30px" }}>{title}</h2>
                <p style={{ color: "#555", margin: "10px 0 20px" }}>{message}</p>

                {firstButton && (
                    <button
                        onClick={firstButton.onClick}
                        style={{
                            backgroundColor: color,
                            color: "#fff",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            width: "100%",
                            marginTop: "10px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {firstButton.label}
                    </button>
                )}

                {secondButton && (
                    <button
                        onClick={secondButton.onClick}
                        style={{
                            backgroundColor: color,
                            color: "#fff",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            width: "100%",
                            marginTop: "10px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {secondButton.label}
                    </button>
                )}

                {doneButton && (
                    <button
                        onClick={() => {
                            doneButton.onClick?.();
                            onClose();
                        }}
                        style={{
                            backgroundColor: color,
                            color: "#fff",
                            padding: "10px",
                            border: "none",
                            borderRadius: "6px",
                            width: "100%",
                            marginTop: "10px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {doneButton.label}
                    </button>
                )}
            </div>
        </div>
    );
}
