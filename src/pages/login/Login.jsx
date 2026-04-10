import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState } from "react";
import React from "react";
import styles from "./login.module.css";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../assets/images/LOGO.png";
import { CustomModal } from "../../components/Modal-custom-alert/CustomModal.jsx";

const initialState = {
  usuario: "",
  senha: "",
};

function Login() {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useContext(AuthContext);

  const [form, setForm] = useState(initialState);
  const [modalErro, setModalErro] = useState({ show: false, message: "" });

  function atualizarEstado(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function login(e) {
    e.preventDefault();

    try {
      await handleLogin(form);
      navigate("/home");
    } catch (error) {
      setModalErro({
        show: true,
        message: error.message || "Erro ao fazer login.",
      });
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSide} />

        <div className={styles.rightSide}>
          <img src={logo} alt="logo" className={styles.logo} />

          <h1 className="login-title">Bem-vindo de volta!</h1>
          <h2 className="login-title">Faça seu login para continuar.</h2>

          <form onSubmit={login} className={styles.form}>
            <label htmlFor="usuario">Email</label>
            <div className={styles.inputGroup}>
              <input
                type="email"
                id="usuario"
                name="usuario"
                placeholder="Digite seu e-mail"
                required
                value={form.usuario}
                onChange={atualizarEstado}
              />
            </div>

            <label htmlFor="senha">Senha</label>
            <div className={styles.inputGroup}>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required
                value={form.senha}
                onChange={atualizarEstado}
              />
            </div>

            <div className={styles.extraOptions}>
              <label>
                <input type="checkbox" /> Lembrar
              </label>

              <Link to="/sendToken">Esqueci a senha</Link>
            </div>

            <button className={styles.btnLogin} type="submit">
              {isLoading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                <span>Entrar</span>
              )}
            </button>

            <p className={styles.loglinks}>
              <a href="/cadastro">Faça seu cadastro</a>
            </p>

            <p className={styles.loglinks}>
              <a href="/home">Voltar para Home</a>
            </p>
          </form>
        </div>
      </div>

      <CustomModal
        show={modalErro.show}
        onClose={() => setModalErro({ show: false, message: "" })}
        title="Erro ao fazer login"
        message={modalErro.message}
        icon="❌"
        color="#f44336"
        doneButton={{
          label: "Tentar novamente",
          onClick: () => setModalErro({ show: false, message: "" }),
        }}
      />
    </>
  );
}

export default Login;
