import React, { useState } from "react";
import { Link } from "react-router-dom";  // Importando o Link do React Router
import "./Sidebar.css";  // Certifique-se de que o CSS está correto

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

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
            <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
            <aside className={`sidebar ${isOpen ? "" : "hidden"}`}>
                <div className="upload-container">
                    <img src="/default-profile.png" alt="Foto de perfil" className="profile-picture" id="profileImage" />
                    <label htmlFor="profileUpload">Alterar Foto</label>
                    <input type="file" id="profileUpload" accept="image/*" onChange={previewImage} />
                </div>
                <nav className="menu">
                    <h2>Menu</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/resultados">Resultados</Link></li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;