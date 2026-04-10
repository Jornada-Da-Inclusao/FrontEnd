import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioService } from "../services/usuario.service";
import { CustomModal } from "../components/Modal-custom-alert/CustomModal";

export const AuthContext = createContext({});

const STORAGE_KEYS = {
  token: "token",
  usuario: "usuario",
};

const initialUserState = {
  id: 0,
  nome: "",
  email: "",
  usuario: "",
  foto: "",
  token: "",
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(initialUserState);
  const [isLoading, setIsLoading] = useState(false);
  const [showExpireModal, setShowExpireModal] = useState(false);

  // 🔐 Carrega usuário do storage
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const storedUser = localStorage.getItem(STORAGE_KEYS.usuario);

    if (!token || !storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);

      setUsuario({
        ...parsedUser,
        token,
      });
    } catch (err) {
      handleLogout();
    }
  }, []);

  // ⏰ Expiração de sessão (30 min)
  useEffect(() => {
    if (!usuario.token) return;

    const timer = setTimeout(() => {
      setShowExpireModal(true);
    }, 1800000);

    return () => clearTimeout(timer);
  }, [usuario.token]);

  // 🔑 LOGIN
  async function handleLogin(credentials) {
    setIsLoading(true);

    try {
      const resposta = await UsuarioService.login(credentials);

      const userData = {
        id: resposta.id,
        nome: resposta.nome,
        email: resposta.usuario,
        foto: resposta.foto,
      };

      const token = resposta.token;

      setUsuario({ ...userData, token });

      saveAuthToStorage(token, userData);

      navigate("/home");
    } catch (error) {
      throw new Error("Usuário ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

  // 💾 Persistência centralizada
  function saveAuthToStorage(token, userData) {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(userData));
  }

  // 🚪 LOGOUT
  function handleLogout() {
    setUsuario(initialUserState);
    clearAuthStorage();
    navigate("/");
  }

  function clearAuthStorage() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.usuario);
  }

  // ⏰ modal de expiração
  function handleCloseModal() {
    setShowExpireModal(false);
    handleLogout();
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        handleLogin,
        handleLogout,
        isLoading,
        isAuthenticated: !!usuario.token,
      }}
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
