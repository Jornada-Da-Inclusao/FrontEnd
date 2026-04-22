import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailService } from "../../../services/email.service";
import styles from "./VerifyToken.module.css";

function VerifyToken() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Proteção de rota
  useEffect(() => {
    const canAccess = localStorage.getItem("canAccessVerifyToken");
    if (!canAccess) {
      navigate("/");
    }
  }, [navigate]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setError("Digite um token válido.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await EmailService.verifyToken(token);

      localStorage.setItem("canAccessNovaSenha", "true");
      localStorage.setItem("token", token);

      navigate("/novaSenha");
    } catch (err) {
      setError(err?.message || "Token inválido ou expirado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h1>Verificar Token</h1>

        <form onSubmit={handleTokenSubmit} className={styles.form}>
          <label htmlFor="token">Digite o token recebido por e-mail</label>

          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token"
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={isLoading}
          >
            {isLoading ? "Verificando..." : "Verificar Token"}
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

export default VerifyToken;
