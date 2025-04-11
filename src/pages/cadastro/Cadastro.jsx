import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Usuario from '../../models/Usuario';
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
    <div className={styles.containerGeral}>
      <div className={styles.imgContainer}></div>
      <div className={styles.formArea}>
        <h1 className={styles.titulo}>Integra Kids</h1>
        <p className={styles.boasVindas}>Bem-vindo!</p>
        <p className={styles.instrucao}>Crie sua conta para continuar.</p>
        <form onSubmit={cadastrarNovoUsuario} className={styles.formCad}>
          <label htmlFor="parent-name">Nome do Pai/Responsável</label>
          <input
            type="text"
            name="nomeResponsavel"
            id="parent-name"
            placeholder="Digite o nome do responsável"
            required
            value={usuario.nomeResponsavel}
            onChange={atualizarEstado}
          />

          <label htmlFor="parent-email">E-mail</label>
          <input
            type="email"
            name="email"
            id="parent-email"
            placeholder="Digite o e-mail"
            required
            value={usuario.email}
            onChange={atualizarEstado}
          />

          <label htmlFor="parent-password">Senha</label>
          <input
            type="password"
            id="parent-password"
            name="senha"
            placeholder="Digite a senha"
            required
            value={usuario.senha}
            onChange={atualizarEstado}
          />

          <label htmlFor="parent-password-confirmation">Confirmar Senha</label>
          <input
            type="password"
            id="parent-password-confirmation"
            placeholder="Digite novamente a senha"
            required
            value={confirmaSenha}
            onChange={handleConfirmarSenha}
          />

          <button type="submit" className={styles.botaoLogin}>CADASTRAR</button>

          <p className={styles.links}>
            Já tem conta? <a href="/login">Faça login</a>
          </p>
          <p className={styles.links}><a href="/">Voltar para Home</a></p>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
