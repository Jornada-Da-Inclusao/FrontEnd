// @ts-nocheck
import { useState, useEffect } from "react";
import "./timer.css";
import React from "react";
import JogoNavbar from "../jogoNavbar/JogoNavbar";

const Timer = ({ isActive, resetTrigger, onTimeUpdate }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    setElapsedTime(0);
  }, [resetTrigger]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(formattedTime);
    }
  }, [formattedTime, onTimeUpdate]);

  return (
    <>
      <JogoNavbar />

      <div
        className={`timer-container ${elapsedTime === 0 ? "alerta-final" : ""}`}
      >
        <div className="timer-inner">
          <div className="timer-text">{formattedTime}</div>
        </div>
      </div>
    </>
  );
};

export default Timer;
