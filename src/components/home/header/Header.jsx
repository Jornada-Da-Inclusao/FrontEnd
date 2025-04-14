// BUG: Erro de alinhamento em itens do Header
// BUG: Header se torna irresponsivo caso screen size seja abaixo de 350px~
import React from "react";
import { Link } from "react-router-dom";

import Button from "@ui/form/Button";
import PiLogo from "@assets/images/nano-icon.png";
import styles from "./header-footer.module.css";

export default function Header() {
  function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    }
  }

  const staticStyle = {
    width: "max(100%, 125px)"
  }

  return (
    <div className={styles.head}>
      <li>
        <img
          src={PiLogo}
          alt="Logo da página Integra Kids, ilustrando um jogo educativo"
        />
      </li>
      <li
        onClick={() => scrollToElement("pagina-principal")}
        className={styles.linkStyles}
      >
        Inicio
      </li>
      <li
        onClick={() => scrollToElement("lista-jogos")}
        className={styles.linkStyles}
      >
        Jogos
      </li>
      <li
        onClick={() => scrollToElement("sobre-nos")}
        className={styles.linkStyles}
      >
        Sobre
      </li>
      <li
        onClick={() => scrollToElement("contato")}
        className={styles.linkStyles}
      >
        Contato
      </li>
      <li>
        <Button href="/login" style={staticStyle} content="Login"></Button>
      </li>
    </div>
  );
}
