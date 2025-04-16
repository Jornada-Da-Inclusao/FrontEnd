import React, { createContext, useState, ReactNode, useEffect } from "react";
import UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";

/**
  * Define a interface para o contexto de autenticação, incluindo o estado do usuário e métodos de login e logout.
  * @typedef {Object} AuthContextProps
  * @property {UsuarioLogin} usuario
  * @property {function} handleLogout
  * @property {function} handleLogin
  * @property {boolean} isLoading
  */

/**
  * Define a interface para as propriedades do provedor de autenticação.
  * @typedef {Object} AuthProviderProps
  * @property {import("react").ReactNode} children
  */

// Cria o contexto de autenticação com um valor padrão vazio.
export const AuthContext = createContext({});

/**
  * Define o provedor de autenticação, que gerencia o estado de autenticação do usuário.
  * @param {Object} object
  * @param {import("react").ReactNode} object.children
  */
export function AuthProvider({ children }) {

  useEffect(() => {
    const token = localStorage.getItem("token");
    const dadosUsuario = localStorage.getItem("usuario");

    if (token && dadosUsuario) {
      const usuarioParse = JSON.parse(dadosUsuario);
      setUsuario({
        ...usuarioParse,
        token: token
      });
    }
  }, []);

  // Estado que armazena as informações do usuário autenticado.
  const [usuario, setUsuario] = useState(UsuarioLogin);

  // Estado que indica se o login está em andamento.
  const [isLoading, setIsLoading] = useState(false);

  /**
    * Método para realizar o login do usuário.
    * @param {UsuarioLogin} usuarioLogin
    */
  async function handleLogin(usuarioLogin) {
    setIsLoading(true); // Indica que a operação de login está em andamento.
    try {
      await login(`/usuarios/logar`, usuarioLogin, (resposta) => {
        setUsuario(resposta);

        // Salvar token e dados essenciais no localStorage
        localStorage.setItem("token", resposta.token);
        localStorage.setItem("usuario", JSON.stringify({
          id: resposta.id,
          nome: resposta.nome,
          email: resposta.usuario,
          foto: resposta.foto
        }));
      });
      alert("O Usuário foi autenticado com sucesso!"); // Mensagem de sucesso.
    } catch (error) {
      console.log(error);
      alert("Os Dados do usuário estão inconsistentes!"); // Mensagem de erro caso o login falhe.
    }
    setIsLoading(false); // Finaliza a operação de login.
  }

  // Método para realizar o logout do usuário.
  function handleLogout() {
    setUsuario(UsuarioLogin);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  // Retorna o provedor de autenticação com o valor do contexto.
  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
