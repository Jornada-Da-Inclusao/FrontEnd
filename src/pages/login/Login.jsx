import { useContext } from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Usuario from '../../models/Usuario';
import { cadastrarUsuario } from '../../services/Service';
import { AuthContext } from "../../contexts/AuthContext"
import styles from './login.module.css';
import React from 'react';

function Login() {
  const navigate = useNavigate();
  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  const [usuarioLogin, setUsuarioLogin] = useState({ email: '', senha: '' });

  useEffect(() => {
    if (usuario && usuario.token !== '') {
      navigate('/home');
    }
  }, [usuario, navigate]);

  function atualizarEstado(e) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    });
  }

  function login(e) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }

  return (
    <>
      <div className={styles.bodyLogin}>
        <div className={styles.loginContainer}>
          <h1></h1>
          <form id="loginForm" onSubmit={login}>
            <div className={styles.fullBox}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                required
                value={usuarioLogin.email}
                onChange={atualizarEstado}
              />
            </div>
            <div className={styles.fullBox}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required
                value={usuarioLogin.senha}
                onChange={atualizarEstado}
              />
            </div>
            <input type="submit" value="Entrar" />
            <p>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
            <p><a href="/">Voltar Para Home</a></p>
          </form>
        </div>
      </div>
      <div className="enabled">
        <div className="active" vw-access-button></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      </script>
      <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    </>
  );
}

export default Login;