import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import styles from './login.module.css';
import logo from '../../assets/images/LOGO.png';

function Login() {
  const navigate = useNavigate();
  const { usuario, handleLogin } = useContext(AuthContext);
  const [usuarioLogin, setUsuarioLogin] = useState({ usuario: '', senha: '' });

  useEffect(() => {
    if (usuario?.token !== '') {
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
    <div className={styles.container}>
      <div className={styles.leftSide}></div>

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
              value={usuarioLogin.usuario}
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
              value={usuarioLogin.senha}
              onChange={atualizarEstado}
            />
          </div>

          <div className={styles.extraOptions}>
            <label>
              <input type="checkbox" /> Lembrar
            </label>
            <a href="#">Esqueci a senha</a>
          </div>

          <input type="submit" value="LOGIN" className={styles.btnLogin} />
          <p className={styles.links}>
                              <a href="/cadastro">Faça seu cadastro</a>
                    </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
