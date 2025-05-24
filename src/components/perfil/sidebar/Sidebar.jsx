import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../sidebar/Sidebar.module.css";
import { AuthContext } from '../../../contexts/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen, faClipboard, faPencilAlt, faChartBar, faHome, faRunning, faPeopleArrows } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const { usuario, handleLogout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation(); // Hook para pegar a rota atual

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Função para verificar se o caminho atual corresponde
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <aside className={`${styles.sidebar} ${isOpen ? "" : styles.hidden}`}>
                <div className={styles.uploadContainer}>
                    <h2>Bem-vindo, {usuario?.nome || "Usuário"}</h2>
                </div>
                <nav className={styles.menu}>
                    <h2 className={styles.options}>Menu</h2>
                    <ul>
                        <li className={isActive("/perfil/editar-usuario") ? styles.ativo : ""}>
                            <Link to="/perfil/editar-usuario">
                                <FontAwesomeIcon icon={faUserPen} /> - Editar dados do responsável
                            </Link>
                        </li>
                        <li className={isActive("/perfil/cadastrar-dependente") ? styles.ativo : ""}>
                            <Link to="/perfil/cadastrar-dependente">
                                <FontAwesomeIcon icon={faClipboard} /> - Cadastrar criança
                            </Link>
                        </li>
                        <li className={isActive("/perfil/editar-dependente") ? styles.ativo : ""}>
                            <Link to="/perfil/editar-dependente">
                                <FontAwesomeIcon icon={faPencilAlt} /> - Editar dados da criança
                            </Link>
                        </li>
                        <li className={isActive("/perfil/resultados") ? styles.ativo : ""}>
                            <Link to="/perfil/resultados">
                                <FontAwesomeIcon icon={faChartBar} /> - Ver Resultados
                            </Link>
                        </li>
                        <li className={isActive("/selecionar-jogador") ? styles.ativo : ""}>
                            <Link to="/selecionar-jogador">
                                <FontAwesomeIcon icon={faPeopleArrows} /> - Selecionar / alterar Jogador
                            </Link>
                        </li>
                        <li className={isActive("/") ? styles.ativo : ""}>
                            <Link to="/">
                                <FontAwesomeIcon icon={faHome} /> - Voltar à Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRunning} /> - Fazer Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
