import React, { createContext, useState, useEffect } from "react";
import { login } from "../services/Service";
import UsuarioLogin from "../models/UsuarioLogin";

// Cria o contexto com valor inicial vazio
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState({
    id: 0,
    nome: "",
    email: "",
    usuario: "",
    foto: "",
    senha: "",
    token: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Recupera usuário do localStorage ao iniciar
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

  // 🔐 Faz login e salva no localStorage
  async function handleLogin(usuarioLogin) {
    setIsLoading(true);
    try {
      await login("/usuarios/logar", usuarioLogin, (resposta) => {
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

      alert("O Usuário foi autenticado com sucesso!");
    } catch (error) {
      alert("Os Dados do usuário estão inconsistentes!");
    }
    setIsLoading(false);
  }

  // 🔓 Faz logout e limpa localStorage
  function handleLogout() {
    setUsuario({
      id: 0,
      nome: "",
      email: "",
      usuario: "",
      foto: "",
      senha: "",
      token: ""
    });

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
