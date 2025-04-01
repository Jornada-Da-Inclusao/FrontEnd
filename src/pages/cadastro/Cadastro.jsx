import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  Usuario from '../../models/Usuario';
import { cadastrarUsuario } from '../../services/Service';
import styles from './cadastro.module.css';
import React from 'react';


function Cadastro() {
  const navigate = useNavigate();
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [usuario, setUsuario] = useState({
    id: 0,
    nomeResponsavel: '',
    email: '',
    senha: '',
  });

  useEffect(() => {
    if (usuario.id !== 0) {
      retornar();
    }
  }, [usuario]);

  function retornar() {
    navigate('/login');
  }

  function atualizarEstado(e) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  }

  function handleConfirmarSenha(e) {
    setConfirmaSenha(e.target.value);
  }

  async function cadastrarNovoUsuario(e) {
    e.preventDefault();
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {
      try {
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario);
        alert('Usuário cadastrado com sucesso!');
      } catch (error) {
        alert('Erro ao cadastrar o usuário!');
      }
    } else {
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.');
      setUsuario({ ...usuario, senha: '' });
      setConfirmaSenha('');
    }
  }

  return (
    <>
      <div className={styles.bodyCad}>
        <div id="login-container" className={styles.formContainer}>
          <h1></h1>
          <form className={styles.formCad} id="login-form" onSubmit={cadastrarNovoUsuario}>
            <div className="half-box">
              <div className={styles.fullBox}>
                <label className={styles.labelCad} htmlFor="parent-name">Nome do Pai/Responsável</label>
                <input
                  className={styles.inputCad}
                  type="text"
                  name="nomeResponsavel"
                  id="parent-name"
                  placeholder="Digite o nome do pai ou responsável"
                  required
                  value={usuario.nomeResponsavel}
                  onChange={atualizarEstado}
                />
              </div>
              <div className={styles.fullBox}>
                <label className={styles.labelCad} htmlFor="parent-email">E-mail</label>
                <input
                  className={styles.inputCad}
                  type="email"
                  name="email"
                  id="parent-email"
                  placeholder="Digite o e-mail do pai ou responsável"
                  required
                  value={usuario.email}
                  onChange={atualizarEstado}
                />
              </div>
              <div className={styles.fullBox}>
                <label className={styles.labelCad} htmlFor="parent-password">Senha</label>
                <input
                  type="password"
                  id="parent-password"
                  name="senha"
                  placeholder="Digite a senha do pai ou responsável"
                  className={styles.inputCad}
                  required
                  value={usuario.senha}
                  onChange={atualizarEstado}
                />
              </div>
              <div className={styles.fullBox}>
                <label className={styles.labelCad} htmlFor="parent-password-confirmation">Confirmar Senha</label>
                <input
                  className={styles.inputCad}
                  type="password"
                  id="parent-password-confirmation"
                  placeholder="Digite novamente a senha"
                  required
                  value={confirmaSenha}
                  onChange={handleConfirmarSenha}
                />
              </div>
              <input type="submit" value="Cadastrar" />
              <p>Já tem cadastro?<a href="/login">  Faça seu login</a></p>
              <p><a href="/">Voltar Para Home</a></p>
            </div>
          </form>
        </div>
      </div>
      <div className="enabled">
        <div className="active" vw-access-button='true'></div>
        <div vw-plugin-wrapper="true">
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

export default Cadastro;
