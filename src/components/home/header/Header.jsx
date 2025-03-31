import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './header-footer.module.css';
import PiLogo from '../../../assets/images/nano-icon.png';
import { AuthContext } from '../../../contexts/AuthContext'; // Importando o contexto

export default function Header() {
  const { usuario, handleLogout } = useContext(AuthContext); // Pegando usuário e função de logout do contexto

  function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className={styles.head}>
      <li>
        <img src={PiLogo} alt="Logo da página Integra Kids, ilustrando um jogo educativo" />
      </li>
      <li onClick={() => scrollToElement('pagina-principal')} className={styles.linkStyles}>Inicio</li>
      <li onClick={() => scrollToElement('lista-jogos')} className={styles.linkStyles}>Jogos</li>
      <li onClick={() => scrollToElement('sobre-nos')} className={styles.linkStyles}>Sobre</li>
      <li onClick={() => scrollToElement('contato')} className={styles.linkStyles}>Contato</li>
      <li>
        {usuario && usuario.token ? (
          <div className={styles.userArea}>
            <Link className={styles.linkStylesLast2} to="/perfil">
              <img
                src={usuario.foto} // A imagem do usuário
                alt={usuario.nome}
                className={styles.profileImage}
              />
              {usuario.nome}
            </Link>
            {/* Botão de logout */}
            <button className={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </div>
        ) : (
          <Link className={styles.linkStylesLast} to="/login">
            Login
          </Link>
        )}
      </li>
    </div>
  );
}
