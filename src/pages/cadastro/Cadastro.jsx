import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Usuario from '../../models/Usuario.js'
import { cadastrarUsuario } from '../../services/Service.jsx'
import styles from './cadastro.module.css'
import React from 'react'
import { CustomModal } from '../../components/Modal-custom-alert/CustomModal.jsx' // ajuste o caminho conforme a estrutura do seu projeto
import { RotatingLines } from 'react-loader-spinner'

function Cadastro() {
  const navigate = useNavigate()

  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [usuario, setUsuario] = useState(Usuario)
  const [loading, setLoading] = useState(false)

  // Estados dos modais
  const [modalSucesso, setModalSucesso] = useState(false)
  const [modalErro, setModalErro] = useState(false)
  const [modalInvalido, setModalInvalido] = useState(false)

  function retornar() {
    navigate('/login')
  }

  function atualizarEstado(e) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  function handleConfirmarSenha(e) {
    setConfirmaSenha(e.target.value)
  }

  async function cadastrarNovoUsuario(e) {
    e.preventDefault()

    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {
      try {
        setLoading(true)
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        setModalSucesso(true)
      } catch (error) {
        setModalErro(true)
      } finally {
        setLoading(false)
      }
    } else {
      setModalInvalido(true)
      setUsuario({ ...usuario, senha: '' })
      setConfirmaSenha('')
    }
  }

  return (
    <>
      {/* FORMULÁRIO */}
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
              name="nome"
              id="parent-name"
              placeholder="Digite o nome do responsável"
              value={usuario.nome}
              onChange={atualizarEstado}
            />
            <label htmlFor="parent-email">E-mail</label>
            <input
              type="email"
              name="usuario"
              id="parent-email"
              placeholder="Digite o e-mail"
              value={usuario.usuario}
              onChange={atualizarEstado}
            />
            <label htmlFor="parent-password">Senha</label>
            <input
              type="password"
              id="parent-password"
              name="senha"
              placeholder="Digite a senha"
              value={usuario.senha}
              onChange={atualizarEstado}
            />
            <label htmlFor="parent-password-confirmation">Confirmar Senha</label>
            <input
              type="password"
              id="parent-password-confirmation"
              placeholder="Digite novamente a senha"
              value={confirmaSenha}
              onChange={handleConfirmarSenha}
            />
            <button type="submit" className={styles.botaoLogin} disabled={loading}>
              {loading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                "Cadastrar"
              )}
            </button>
            <p className={styles.cadlinks}>
               <a href="/login">Já tem conta? Faça login</a>
            </p>
            <p className={styles.cadlinks}><a href="/">Voltar para Home</a></p>
          </form>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      <CustomModal
        show={modalSucesso}
        onClose={() => {
          setModalSucesso(false)
          navigate("/login")
        }}
        title="Sucesso!"
        message="Usuário cadastrado com sucesso!"
        icon="✔️"
        color="#4caf50"
        doneButton={{ label: "OK", onClick: () => navigate("/") }}
      />

      {/* MODAL DE ERRO */}
      <CustomModal
        show={modalErro}
        onClose={() => setModalErro(false)}
        title="Erro!"
        message="Erro ao cadastrar o usuário. Tente novamente."
        icon="❌"
        color="#f44336"
        doneButton={{ label: "Fechar" }}
      />

      {/* MODAL DE DADOS INVÁLIDOS */}
      <CustomModal
        show={modalInvalido}
        onClose={() => setModalInvalido(false)}
        title="Dados Inválidos"
        message="Verifique os dados informados. A senha precisa ter ao menos 8 caracteres e coincidir com a confirmação."
        icon="⚠️"
        color="#ff9800"
        doneButton={{ label: "Entendi" }}
      />
    </>
  )
}

export default Cadastro
