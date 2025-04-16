import React, { useState } from "react";
import { Link } from "react-router-dom";  // Importando o Link do React Router
import styles from "../sidebar/Sidebar.module.css";  // Certifique-se de que o CSS está correto
import { AuthContext } from '../../../contexts/AuthContext'; // Importando o contexto
import { useContext } from "react";

const Sidebar = () => {
    const { usuario, handleLogout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);
    const [fotoPerfil, setFotoPerfil] = useState(usuario?.foto || "/default-profile.png");
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const previewImage = (event) => {
        const reader = new FileReader();
        reader.onload = function () {
            document.getElementById("profileImage").src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    return (
        <>
            <aside className={`${styles.sidebar} ${isOpen ? "" : styles.hidden}`}>
                <div className={styles.uploadContainer}>
                    <h2>Bem vindo, {usuario?.nome || "Usuário"}</h2>
                    <img
                        src={usuario?.foto || "/default-profile.png"}
                        alt="Foto de perfil"
                        className={styles.profilePicture}
                        id="profileImage"
                    />
                    <label htmlFor="profileUpload">Alterar Foto</label>
                    <input type="file" id="profileUpload" accept="image/*" onChange={previewImage} />
                </div>
                <nav className={styles.menu}>
                    <h2 className={styles.options}>Menu</h2>
                    <ul>
                        <li><Link to="/perfil/editar-usuario">✏️ - Editar dados do responsável</Link></li>
                        <li><Link to="/perfil/cadastrar-dependente">📋 - Cadastrar criança</Link></li>
                        <li><Link to="/perfil/editar-dependente">✏️ - Editar dados da criança</Link></li>
                        <li><Link to="/perfil/resultados">📊 - Ver Resultados</Link></li>
                        <li><Link to="/">🏚️ - Voltar à Home</Link></li>
                        <li><Link to="/" onClick={handleLogout}> 🏃 - Fazer Logout</Link></li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
