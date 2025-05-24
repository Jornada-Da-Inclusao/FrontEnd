import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import { login } from "../services/UsuarioService";
import { CustomModal } from "../components/Modal-custom-alert/CustomModal"; 
import UsuarioLogin from "../models/UsuarioLogin";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const navigate = useNavigate();  

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
  const [showExpireModal, setShowExpireModal] = useState(false);

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

  useEffect(() => {
    if (usuario.token) {
      const timer = setTimeout(() => {
        setShowExpireModal(true);
      }, 1800000);

      return () => clearTimeout(timer);
    }
  }, [usuario.token]);

  async function handleLogin(usuarioLogin) {
    setIsLoading(true);
    try {
      await login("/usuarios/logar", usuarioLogin, (resposta) => {
        setUsuario(resposta);

        localStorage.clear();
        sessionStorage.clear();

        localStorage.setItem("token", resposta.token);
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            id: resposta.id,
            nome: resposta.nome,
            email: resposta.usuario,
            foto: resposta.foto,
          })
        );
      });
    } catch (error) {
      throw new Error("Usuário ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUsuario({
      id: 0,
      nome: "",
      email: "",
      usuario: "",
      foto: "",
      senha: "",
      token: "",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/"); 
  }

  function handleCloseModal() {
    setShowExpireModal(false);
    handleLogout();
  }

  return (
    <AuthContext.Provider
      value={{ usuario, handleLogin, handleLogout, isLoading }}
    >
      {children}

      <CustomModal
        show={showExpireModal}
        onClose={handleCloseModal}
        title="Sessão expirada"
        message="Sua sessão expirou. Por favor, faça login novamente."
        icon="⏰"
        color="#f44336"
        doneButton={{ label: "OK", onClick: handleCloseModal }}
      />
    </AuthContext.Provider>
  );
}
