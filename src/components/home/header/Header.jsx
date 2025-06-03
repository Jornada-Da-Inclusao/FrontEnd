import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './header-footer.module.css';
import PiLogo from '../../../assets/images/nano-icon.png';
import { AuthContext } from '../../../contexts/AuthContext.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faEnvelope, faHome, faIdCardClip, faDoorOpen, faUser, faRightFromBracket, faChildren } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { usuario, handleLogout } = useContext(AuthContext);

  // 👇 fallback do localStorage caso o contexto ainda não tenha carregado
  const localUser = JSON.parse(localStorage.getItem("usuario"));
  const localToken = localStorage.getItem("token");
  const jogadorSelecionado = JSON.parse(sessionStorage.getItem("player"));

  // Combina os dados do contexto com os dados salvos localmente
  const userLogado = usuario?.token ? usuario : (
    localToken && localUser ? { ...localUser, token: localToken } : null
  );

  function scrollToElement(id) {
  const element = document.getElementById(id);
  if (element) {
    const headerHeight = 100; // ajuste conforme o seu CSS real
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}


  return (
    <div className={styles.head}>
      <li>
        <img src={PiLogo} alt="Logo da página Integra Kids, ilustrando um jogo educativo" />
      </li>
      <li onClick={() => scrollToElement('pagina-principal')} className={styles.linkStyles}> <FontAwesomeIcon icon={faHome} /> <span>Início</span></li>
      <li onClick={() => scrollToElement('games-section')} className={styles.linkStyles}> <FontAwesomeIcon icon={faGamepad} /> <span>Jogos</span></li>
      <li onClick={() => scrollToElement('sobre-nos')} className={styles.linkStyles}> <FontAwesomeIcon icon={faIdCardClip} /> <span>Sobre</span></li>
      <li onClick={() => scrollToElement('contato')} className={styles.linkStyles}> <FontAwesomeIcon icon={faEnvelope} /> <span>Contato</span></li>
      <li>
        {userLogado && userLogado.token ? (
          <div className={styles.userArea}>
            <Link className={styles.linkStylesLast2} to="/perfil/cadastrar-dependente">
              <FontAwesomeIcon icon={faUser} /><span>Perfil</span>
            </Link>

            {jogadorSelecionado && (
              <Link className={styles.jogadorButton} to="/selecionar-jogador">
                <img
                  src={jogadorSelecionado.foto}
                  alt={`Ícone de ${jogadorSelecionado.nome}`}
                  className={styles.avatarIcon}
                />
                <span>{jogadorSelecionado.nome}</span>
              </Link>
            )}

            {!jogadorSelecionado && (
              <Link className={styles.jogadorButton} to="/selecionar-jogador">
                <FontAwesomeIcon icon={faChildren} /><span>Selecionar jogador</span>
              </Link>
            )}

            <button className={styles.logoutButton} onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> <span>Sair</span>
            </button>
          </div>
        ) : (
          <Link className={styles.linkStylesLast} to="/login">
            <FontAwesomeIcon icon={faDoorOpen} /> <span>Login</span>
          </Link>
        )}

      </li>
    </div>
  );
}
