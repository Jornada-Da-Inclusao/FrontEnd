import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailService } from "../../../services/email.service";
import styles from "./SendToken.module.css";

function SendToken() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Digite um e-mail válido.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await EmailService.sendToken({ email });

      localStorage.setItem("canAccessVerifyToken", "true");

      navigate("/verifyToken");
    } catch (err) {
      setError(
        err?.message ||
          "Falha ao enviar o token. Verifique o e-mail e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h1>Recuperar Senha</h1>

        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <label htmlFor="email">Digite seu e-mail</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@dominio.com"
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Token"}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.returnLink}>
          <p>
            <button onClick={() => navigate("/login")}>Voltar ao Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SendToken;
