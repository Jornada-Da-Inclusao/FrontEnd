import React, { useEffect, useState } from "react";
import styles from "./novaSenha.module.css";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { AuthService } from "../../../services/auth.service";

function NovaSenha() {
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔒 Proteção de rota
  useEffect(() => {
    const canAccess = localStorage.getItem("canAccessNovaSenha");
    if (!canAccess) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!senha || !confirmarSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      await AuthService.updatePassword({
        token,
        novaSenha: senha,
      });

      // 🔐 Limpeza segura
      localStorage.removeItem("token");
      localStorage.removeItem("canAccessVerifyToken");
      localStorage.removeItem("canAccessNovaSenha");

      setSuccess("Senha atualizada com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Falha ao atualizar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h2>Nova Senha</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nova Senha</label>
          <div className={styles.inputGroup}>
            <FaLock />
            <input
              type="password"
              placeholder="Digite a nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <label>Confirmar Nova Senha</label>
          <div className={styles.inputGroup}>
            <FaLock />
            <input
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Atualizar Senha"}
          </button>

          <div className={styles.links}>
            <button onClick={() => navigate("/")}>Voltar para login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaSenha;
