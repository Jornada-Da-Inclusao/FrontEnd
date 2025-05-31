import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../sidebar/Sidebar.module.css";
import { AuthContext } from '../../../contexts/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen, faChild, faPencilAlt, faChartBar, faArrowLeft, faRightFromBracket, faChildren, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const { usuario, handleLogout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);  // começa fechado no celular
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Botão para abrir/fechar no celular */}
            <button className={styles.menuToggle} onClick={toggleSidebar} aria-label="Toggle menu">
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

            <aside className={`${styles.sidebar} ${!isOpen ? styles.hidden : ""}`}>
                <div className={styles.uploadContainer}>
                    <h2>Bem-vindo, {usuario?.nome || "Usuário"}</h2>
                </div>
                <nav className={styles.menu}>
                    <h2 className={styles.options}>Menu</h2>
                    <ul>
                        <li className={isActive("/perfil/editar-usuario") ? styles.ativo : ""}>
                            <Link to="/perfil/editar-usuario" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faPencilAlt} /> ‎ Editar dados do responsável
                            </Link>
                        </li>
                        <li className={isActive("/perfil/cadastrar-dependente") ? styles.ativo : ""}>
                            <Link to="/perfil/cadastrar-dependente" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faChild} /> ‎  Cadastrar criança
                            </Link>
                        </li>
                        <li className={isActive("/perfil/editar-dependente") ? styles.ativo : ""}>
                            <Link to="/perfil/editar-dependente" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faUserPen} /> ‎  Editar dados da criança
                            </Link>
                        </li>
                        <li className={isActive("/perfil/resultados") ? styles.ativo : ""}>
                            <Link to="/perfil/resultados" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faChartBar} /> ‎  Ver Resultados
                            </Link>
                        </li>
                        <li className={isActive("/selecionar-jogador") ? styles.ativo : ""}>
                            <Link to="/selecionar-jogador" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faChildren} /> ‎  Selecionar / alterar Jogador
                            </Link>
                        </li>
                        <li className={isActive("/") ? styles.ativo : ""}>
                            <Link to="/" onClick={() => setIsOpen(false)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> ‎  Voltar à Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={() => { setIsOpen(false); handleLogout(); }}>
                                <FontAwesomeIcon icon={faRightFromBracket} /> ‎  Fazer Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
