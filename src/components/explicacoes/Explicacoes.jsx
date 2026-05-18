import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./explicacao.module.css";
import { CustomModal } from "../Modal-custom-alert/CustomModal";
import { TextWithAudio } from "../TTS/TextWithAudio";
import { getAudioContent } from "../../services/gcs-audio.service";

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   route: string,
 *   audioTextId?: string,
 * }} props
 */
function TemplateExplicacao({ title, description, route, audioTextId }) {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const handleNavigation = (targetRoute) => {
    if (targetRoute === "/") {
      navigate(targetRoute); // voltar sempre é permitido
      return;
    }

    const usuario = localStorage.getItem("usuario");
    const player = sessionStorage.getItem("player");

    // if (!usuario) {
    //   setShowLoginModal(true);
    // } else 
    if (!player) {
      setShowPlayerModal(true);
    } else {
      navigate(targetRoute);
    }
  };

  return (
    <>
      {/* Modal de Login */}
      <CustomModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Acesso Restrito"
        message="Você precisa estar logado para acessar os jogos."
        icon="🔒"
        color="#e74c3c"
        firstButton={{
          label: "Ir para Login",
          onClick: () => navigate("/login"),
        }}
      />

      {/* Modal de Jogador */}
      <CustomModal
        show={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        title="Jogador não selecionado"
        message="Escolha um jogador antes de continuar."
        icon="🎮"
        color="#3498db"
        firstButton={{
          label: "Selecionar Jogador",
          onClick: () => navigate("/selecionar-jogador"),
        }}
      />

      <div className={styles.explicacaoBody}>
        <div className={styles.containerExp}>
          <h2 className={styles.headingExp}>{title}</h2>
          {audioTextId ? (() => {
            const content = getAudioContent(audioTextId);
            return content ? (
              <TextWithAudio text={content.text} audioUrl={content.audioUrl} textId={content.textId} textStyle={{ backgroundColor: 'transparent', border: 'none', padding: 0, margin: 0, fontSize: '1.4rem', fontFamily: 'sans-serif', textAlign: 'justify', color: 'var(--black, #000)' }} />
            ) : (
              <p className={styles.paragraphExp}>{description}</p>
            );
          })() : (
            <p className={styles.paragraphExp}>{description}</p>
          )}
          <div className={styles.choices}>
            <button
              className={styles.inlineButton}
              onClick={() => handleNavigation(route)}
            >
              Ir ao Jogo
            </button>
            <button
              className={styles.inlineButton}
              onClick={() => handleNavigation("/")}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Exportações
export const ExplicacaoCores = () => {
  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      sessionStorage.setItem('player', '2')
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return stateUserDeslogado ? (
    <TemplateExplicacao
      title="Jogo das Cores"
      description="O objetivo é arrastar cada uma das cores para a caixa do animal correspondente."
      route="/jogo-cores-deslogado"
      audioTextId="explicacao_page_cores"
    />
  ) : (
    <TemplateExplicacao
      title="Jogo das Cores"
      description="O objetivo é arrastar cada uma das cores para a caixa do animal correspondente."
      route="/jogo-cores"
      audioTextId="explicacao_page_cores"
    />
  );
};


export const ExplicacaoMemoria = () => {

  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      sessionStorage.setItem('player', '2')
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return stateUserDeslogado ? (
    <TemplateExplicacao
      title="Jogo da Memória"
      description="Revele todas as cartas encontrando os pares iguais consecutivos."
      route="/jogo-memoria-deslogado"
      audioTextId="explicacao_page_memoria"
    />
  ) : (
    <TemplateExplicacao
      title="Jogo da Memória"
      description="Revele todas as cartas encontrando os pares iguais consecutivos."
      route="/jogo-memoria"
      audioTextId="explicacao_page_memoria"
    />
  );
};

export const ExplicacaoNumeros = () => {

  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      sessionStorage.setItem('player', '2')
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return stateUserDeslogado ? (
    <TemplateExplicacao
      title="Jogo dos Números"
      description="Ordene todos os números em sequência numérica ao arrastá-los para a caixa."
      route="/jogo-numeros-deslogado"
      audioTextId="explicacao_page_numeros"
    />
  ) : (
    <TemplateExplicacao
      title="Jogo dos Números"
      description="Ordene todos os números em sequência numérica ao arrastá-los para a caixa."
      route="/jogo-numeros"
      audioTextId="explicacao_page_numeros"
    />
  );
};

export const ExplicacaoVogais = () => {

  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      sessionStorage.setItem('player', '2')
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return stateUserDeslogado ? (
    <TemplateExplicacao
      title="Jogo das Vogais"
      description="Arraste, dentre o alfabeto inteiro, apenas as letras vogais para a caixa."
      route="/jogo-vogais-deslogado"
      audioTextId="explicacao_page_vogais"
    />
  ) : (
    <TemplateExplicacao
      title="Jogo das Vogais"
      description="Arraste, dentre o alfabeto inteiro, apenas as letras vogais para a caixa."
      route="/jogo-vogais"
      audioTextId="explicacao_page_vogais"
    />
  );
};
