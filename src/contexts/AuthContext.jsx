import React, { createContext, useState } from "react";

import UsuarioLogin from "@/models/UsuarioLogin";
import { login } from "@/services/Service";

/**
 * Define a interface para o contexto de autenticação, incluindo o estado do usuário e métodos de login e logout.
 * @typedef {React.Context} AuthContextProps
 * @property {UsuarioLogin} usuario
 * @property {function} handleLogout
 * @property {function} handleLogin
 * @property {boolean} isLoading
 */

/**
 * Define a interface para as propriedades do provedor de autenticação.
 * @typedef {Object} AuthProviderProps
 * @property {React.ReactNode} children
 */

/**
 * Cria o contexto de autenticação com um valor padrão vazio.
 * @type {AuthContextProps}
 */
export const AuthContext = (createContext({}));

/**
 * Define o provedor de autenticação, que gerencia o estado de autenticação do usuário.
 * @param {Object} object
 * @param {import("react").ReactNode} object.children
 */
export function AuthProvider({ children }) {
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
      await login(`/usuarios/logar`, usuarioLogin, setUsuario); // Chama o método de login.
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
  }

  // Retorna o provedor de autenticação com o valor do contexto.
  return (
    <AuthContext.Provider
      value={{ usuario, handleLogin, handleLogout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
