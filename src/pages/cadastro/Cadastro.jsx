import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cadastrarUsuario } from '../../services/usuarioService'
import { RotatingLines } from 'react-loader-spinner'
import styles from './cadastro.module.css'

function Cadastro() {
  const navigate = useNavigate()

  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [loading, setLoading] = useState(false)

  const [usuario, setUsuario] = useState({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })

  useEffect(() => {
    if (usuario.id !== 0) {
      retornar()
    }
  }, [usuario])

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
        alert('Usuário cadastrado com sucesso!')
      } catch (error) {
        alert('Erro ao cadastrar o usuário!')
      } finally {
        setLoading(false)
      }
    } else {
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.')
      setUsuario({ ...usuario, senha: '' })
      setConfirmaSenha('')
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
                  name="nome"
                  id="parent-name"
                  placeholder="Digite o nome do pai ou responsável"
                  required
                  value={usuario.nome}
                  onChange={atualizarEstado}
                />
              </div>
              <div className={styles.fullBox}>
                <label className={styles.labelCad} htmlFor="parent-usuario">E-mail</label>
                <input
                  className={styles.inputCad}
                  type="usuario"
                  name="usuario"
                  id="parent-usuario"
                  placeholder="Digite o e-mail do pai ou responsável"
                  required
                  value={usuario.usuario}
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
                  name="senha"
                  id="parent-password-confirmation"
                  placeholder="Digite novamente a senha"
                  required
                  value={confirmaSenha}
                  onChange={handleConfirmarSenha}
                />
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
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
        {`new window.VLibras.Widget('https://vlibras.gov.br/app');`}
      </script>
      <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    </>
  )
}

export default Cadastro
