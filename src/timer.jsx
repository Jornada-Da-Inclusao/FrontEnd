import { useState, useEffect } from "react";
import "./timer.css";


const Timer = () => {
  const totalTime = 180; // Tempo total em segundos (3 minutos)
  const [remainingTime, setRemainingTime] = useState(totalTime);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [remainingTime]);

  // Formata os minutos e segundos
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Calcula o progresso para o efeito visual
  const progress = (remainingTime / totalTime) * 100;

  // Estilos
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
        }}>{formattedTime}</div>
      </div>
    </div>
  );
};

export default Timer;
