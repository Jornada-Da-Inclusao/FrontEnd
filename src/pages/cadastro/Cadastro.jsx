import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Usuario from '../../models/Usuario.js'
import { cadastrarUsuario } from '../../services/Service.jsx'
import styles from './cadastro.module.css';
import React from 'react'

function Cadastro() {
  const navigate = useNavigate()

  // Estado para armazenar a confirmação de senha.
  const [confirmaSenha, setConfirmaSenha] = useState("")

  // Estado que armazena os dados do usuário a ser cadastrado.
  // Utiliza a interface `Usuario` para garantir que os dados tenham a estrutura correta.
  const [usuario, setUsuario] = useState(Usuario)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (usuario.id !== 0) {
      retornar()
    }
  }, [usuario])

  function retornar() {
    navigate('/login')
  }

  /**
    * Função que atualiza o estado do `usuario` com base nos valores digitados nos campos do formulário.
    * O nome do campo (atributo `name`) é usado para identificar qual propriedade deve ser atualizada.
    *
    * @param {import("react").ChangeEvent} e
    */
  function atualizarEstado(e) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  /**
    * Função que atualiza o estado da `confirmaSenha` quando o usuário digita na confirmação de senha.
    * @param {import("react").ChangeEvent} e
    */
  function handleConfirmarSenha(e) {
    setConfirmaSenha(e.target.value)
  }

  /**
    * Função assíncrona que é chamada ao enviar o formulário de cadastro.
    * @param {import("react").ChangeEvent} e
    */
  async function cadastrarNovoUsuario(e) {
    e.preventDefault() // Previne o comportamento padrão do formulário (recarregar a página).

    // Verifica se a senha e a confirmação são iguais e se a senha possui ao menos 8 caracteres.
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {
      try {
        setLoading(true)
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        alert('Usuário cadastrado com sucesso!')
        navigate("/login")
      } catch (error) {
        alert('Erro ao cadastrar o usuário!')
        window.location.reload();
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
              required
              value={usuario.nome}
              onChange={atualizarEstado}
            />
            <label htmlFor="parent-email">E-mail</label>
            <input
              type="email"
              name="usuario"
              id="parent-email"
              placeholder="Digite o e-mail"
              required
              value={usuario.usuario}
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
            <p className={styles.links}>
              Já tem conta? <a href="/login">Faça login</a>
            </p>
            <p className={styles.links}><a href="/">Voltar para Home</a></p>
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
