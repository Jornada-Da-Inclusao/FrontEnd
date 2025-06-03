// @ts-nocheck
import { useState, useEffect } from "react";
import "./timer.css";
import React from "react";
import JogoNavbar from "../jogoNavbar/JogoNavbar";

const Timer = ({ isActive, resetTrigger, onTimeUpdate }) => {
    const totalTime = 180;
    const [remainingTime, setRemainingTime] = useState(totalTime);

    useEffect(() => {
        setRemainingTime(totalTime);
    }, [resetTrigger]);

    useEffect(() => {
        if (!isActive || remainingTime <= 0) return;

        const countdown = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(countdown);
    }, [isActive, remainingTime]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // Envia o tempo formatado para o componente pai a cada atualização
    useEffect(() => {
        if (onTimeUpdate) {
            onTimeUpdate(formattedTime);
        }
    }, [formattedTime, onTimeUpdate]); // Atualiza sempre que o tempo muda

    const progress = (remainingTime / totalTime) * 100;

    const circleStyle = {
        width: "80px",
        height: "80px",
        background: `conic-gradient(#db2d09 ${progress}%, #f1c5b5 ${progress}%)`,
        borderRadius: "50%",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "20px",
        right: "20px",
        transition: "all 0.5s ease",
    };

    return (
        <>
        <JogoNavbar />
            <div style={circleStyle} className={remainingTime === 0 ? "alerta-final" : ""}>
                <div style={{
                    width: "65px",
                    height: "65px",
                    background: "linear-gradient(45deg, #db2d09, #f1c5b5)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}>
                    <div style={{
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        color: "#fff",
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
                        position: "absolute",
                    }}>
                        {formattedTime}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Timer;
