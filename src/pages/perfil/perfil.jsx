import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/perfil/sidebar/Sidebar";
import CadastroForm from "../../components/perfil/cadastrarDependente/CadastrarDep";
import Resultados from "../../components/perfil/resultado/Resultados";
import editarUsuario from "../../components/perfil/editar/editarCadUser";
import editarDep from "../../components/perfil/editar/editarCadDep";
import styles from "./perfil.module.css";

const Perfil = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <Routes>
                    <Route path="/" element={<CadastroForm />} />
                    <Route path="/resultados" element={<Resultados />} />
                </Routes>
            </main>
        </div>
    );
};

export default Perfil;
