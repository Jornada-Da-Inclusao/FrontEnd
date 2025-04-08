import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import styles from './login.module.css';
import { RotatingLines } from 'react-loader-spinner';

function Login() {
  const navigate = useNavigate();

  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  const [usuarioLogin, setUsuarioLogin] = useState({
    id: 0,
    nome: '',
    email: '',
    usuario: '',
    foto: '',
    senha: '',
    token: ''
  });

  useEffect(() => {
    if (usuario && usuario.token !== "") {
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
              <label htmlFor="usuario">E-mail</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Digite seu e-mail"
                required
                value={usuarioLogin.usuario}
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
            <button className={styles.btnSubmit} type="submit">
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
            <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
            <p><Link to="/">Voltar Para Home</Link></p>
          </form>
        </div>
      </div>

      {/* VLibras e widgets externos */}
      <div className="enabled">
        <div className="active" vw-access-button></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
        {`new window.VLibras.Widget('https://vlibras.gov.br/app');`}
      </script>
      <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    </>
  );
}

export default Login;
