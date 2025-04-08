import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './header-footer.module.css';
import PiLogo from '../../../assets/images/nano-icon.png';
import { AuthContext } from '../../../contexts/AuthContext.jsx';

export default function Header() {
  const { usuario, handleLogout } = useContext(AuthContext);

  // 👇 fallback do localStorage caso o contexto ainda não tenha carregado
  const localUser = JSON.parse(localStorage.getItem("usuario"));
  const localToken = localStorage.getItem("token");

  // Combina os dados do contexto com os dados salvos localmente
  const userLogado = usuario?.token ? usuario : (
    localToken && localUser ? { ...localUser, token: localToken } : null
  );

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
      <li onClick={() => scrollToElement('pagina-principal')} className={styles.linkStyles}>Início</li>
      <li onClick={() => scrollToElement('lista-jogos')} className={styles.linkStyles}>Jogos</li>
      <li onClick={() => scrollToElement('sobre-nos')} className={styles.linkStyles}>Sobre</li>
      <li onClick={() => scrollToElement('contato')} className={styles.linkStyles}>Contato</li>
      <li>
        {userLogado && userLogado.token ? (
          <div className={styles.userArea}>
            <Link className={styles.linkStylesLast2} to="/perfil">
              <img
                src={userLogado.foto || PiLogo} // fallback para a imagem
                alt={userLogado.nome || "Usuário"}
                className={styles.profileImage}
              />
              {userLogado.nome}
            </Link>
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
