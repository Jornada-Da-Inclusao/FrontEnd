import React, { createContext, useState } from "react";
import { login } from "../services/Service";

// Cria o contexto de autenticação com um valor inicial vazio.
export const AuthContext = createContext({});

// Define o provedor de autenticação, que gerencia o estado de autenticação do usuário.
export function AuthProvider({ children }) {
    // Estado que armazena as informações do usuário autenticado.
    const [usuario, setUsuario] = useState({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    });

    // Estado que indica se o login está em andamento.
    const [isLoading, setIsLoading] = useState(false);

    // Método para realizar o login do usuário.
    async function handleLogin(usuarioLogin) {
        setIsLoading(true);
        try {
            await login(`/usuarios/logar`, usuarioLogin, setUsuario);
            alert("O Usuário foi autenticado com sucesso!");
        } catch (error) {
            alert("Os Dados do usuário estão inconsistentes!");
        }
        setIsLoading(false);
    }

    // Método para realizar o logout do usuário.
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        });
    }

    // Retorna o provedor de autenticação com o valor do contexto.
    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
