import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Usuario from '../../models/Usuario'
import { cadastrarUsuario } from '../../services/Service'
import './Cadastro.css'
import React from 'react'

function Cadastro() {
  
  // Hook para navegar entre as páginas, usado para redirecionar o usuário.
  const navigate = useNavigate()

  // Estado para armazenar a confirmação de senha.
  const [confirmaSenha, setConfirmaSenha] = useState<string>("")

  // Estado que armazena os dados do usuário a ser cadastrado.
  // Utiliza a interface `Usuario` para garantir que os dados tenham a estrutura correta.
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nomeResponsavel: '',
    email: '',
    senha: '',
  })

  // Hook de efeito que monitora a mudança no ID do usuário.
  // Se o ID for diferente de zero, significa que o usuário foi cadastrado com sucesso,
  // então redireciona para a página de login.
  useEffect(() => {
    if (usuario.id !== 0) {
      retornar() // Chama a função que redireciona para o login.
    }
  }, [usuario])

  // Função que redireciona para a página de login.
  function retornar() {
    navigate('/login')
  }

  // Função que atualiza o estado do `usuario` com base nos valores digitados nos campos do formulário.
  // O nome do campo (atributo `name`) é usado para identificar qual propriedade deve ser atualizada.
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  // Função que atualiza o estado da `confirmaSenha` quando o usuário digita na confirmação de senha.
  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value)
  }

  // Função assíncrona que é chamada ao enviar o formulário de cadastro.
  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // Previne o comportamento padrão do formulário (recarregar a página).

    // Verifica se a senha e a confirmação são iguais e se a senha possui ao menos 8 caracteres.
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {
      try {
        // Tenta cadastrar o usuário usando a função `cadastrarUsuario`.
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        alert('Usuário cadastrado com sucesso!')
      } catch (error) {
        alert('Erro ao cadastrar o usuário!')
      }
    } else {
      // Exibe um alerta caso as senhas sejam diferentes ou a senha seja menor que 8 caracteres.
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.')
      setUsuario({ ...usuario, senha: '' }) // Limpa a senha do usuário.
      setConfirmaSenha('') // Limpa a confirmação de senha.
    }
  }

  return (
    <>
      <div className="bodyCad">
        <div id="login-container" className="form-container">
          <h1></h1>
          <form className='formCad' id="login-form" onSubmit={cadastrarNovoUsuario}>
            <div className="half-box">
              <div className="full-box">
                <label className='labelCad' htmlFor="parent-name">Nome do Pai/Responsável</label>
                <input
                  className='inputCad'
                  type="text"
                  name="nomeResponsavel"
                  id="parent-name"
                  placeholder="Digite o nome do pai ou responsável"
                  required
                  value={usuario.nomeResponsavel}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                />
              </div>
              <div className="full-box">
                <label className='labelCad' htmlFor="parent-email">E-mail</label>
                <input
                  className='inputCad'
                  type="email"
                  name="email"
                  id="parent-email"
                  placeholder="Digite o e-mail do pai ou responsável"
                  required
                  value={usuario.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                />
              </div>
              <div className="full-box">
                <label className='labelCad' htmlFor="parent-password">Senha</label>
                <input
                  type="password"
                  id="parent-password"
                  name="senha"
                  placeholder="Digite a senha do pai ou responsável"
                  className="inputCad"
                  required
                  value={usuario.senha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                />
              </div>
              <div className="full-box">
                <label className='labelCad' htmlFor="parent-password-confirmation">Confirmar Senha</label>
                <input
                  className='inputCad'
                  type="password"
                  name="senha"
                  id="parent-password-confirmation"
                  placeholder="Digite novamente a senha"
                  required
                  value={confirmaSenha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)}
                />
              </div>
              <input type="submit" value="Cadastrar" />

              <p>Já tem cadastro?<a href="/login">  Faça seu login</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Cadastro
