import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/perfil/sidebar/Sidebar";
import CadastroForm from "../../components/perfil/cadastrarDependente/CadastrarDep";
import Resultados from "../../components/perfil/resultado/Resultados";
import EditarUsuario from "../../components/perfil/editar/editarCadUser";
import EditarDep from "../../components/perfil/editar/editarCadDep";
import styles from "./perfil.module.css";

const Perfil = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <Routes>
                    <Route path="/" element={<EditarUsuario />} />
                    <Route path="/editar-usuario" element={<EditarUsuario />} />
                    <Route path="/cadastrar-dependente" element={<CadastroForm />} />
                    <Route path="/resultados" element={<Resultados />} />
                    <Route path="/editar-dependente" element={<EditarDep />} />
                </Routes>
            </main>
        </div>
    );
};

export default Perfil;