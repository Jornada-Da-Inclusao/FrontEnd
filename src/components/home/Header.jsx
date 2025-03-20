import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../components/home/header-footer.module.css';
import PiLogo from '../../assets/images/nano-icon.png';

export default function Header() {
  return (
    <div className={styles.head}>
      <li>
        <img src={PiLogo} alt="Logo da página Integra Kids, ilustrando um jogo educativo" />
      </li>
      <li onClick={() => scrollToSection('pagina-principal')} className={styles.linkStyles}>Inicio</li>
      <li onClick={() => scrollToSection('lista-jogos')} className={styles.linkStyles}>Jogos</li>
      <li onClick={() => scrollToSection('sobre-nos')} className={styles.linkStyles}>Sobre</li>
      <li onClick={() => scrollToSection('contato')} className={styles.linkStyles}>Contato</li>
      <li><Link className={styles.linkStyles} to="/login">Login</Link></li>
    </div>
  );
}
