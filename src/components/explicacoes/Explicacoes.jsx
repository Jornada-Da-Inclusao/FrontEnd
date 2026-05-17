import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./explicacao.module.css";
import { CustomModal } from "../Modal-custom-alert/CustomModal"; // ajuste se necessário
import { IDS_JOGOS } from "@/utils/constants/jogos/ids";

function TemplateExplicacao({ title, description, route, gameKey }) {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showMostraDificuldade, setShowMostraDificuldade] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    const usuarioTratado = usuarioStorage ? JSON.parse(usuarioStorage) : {};

    if (!sessionStorage.getItem("player") && usuarioTratado?.id) {
      setShowPlayerModal(true);
    }
  }, []);

  const getGameId = () => {
    if (!difficulty) return null;
    return IDS_JOGOS?.[difficulty]?.[gameKey] || null;
  };

  const handleNavigation = (targetRoute) => {
    if (targetRoute === "/") {
      navigate(targetRoute); // voltar sempre é permitido
      return;
    }

    const player = sessionStorage.getItem("player");

    if (player) {
      navigate(targetRoute);
    }
  };

  const handleStartGame = () => {
    const gameId = getGameId();

    if (!gameId) return;

    // exemplo: enviar via state (React Router)
    navigate(route, {
      state: { gameId, difficulty },
    });
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

      {!showMostraDificuldade ? (
        <>
          <div className={styles.explicacaoBody}>
            <div className={styles.containerExp}>
              <h2 className={styles.headingExp}>{title}</h2>
              <p className={styles.paragraphExp}>{description}</p>
              <div className={styles.choices}>
                <button
                  className={styles.inlineButton}
                  // onClick={() => handleNavigation(route)}
                  onClick={() => setShowMostraDificuldade(true)}
                >
                  Selecionar Dificuldade
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
      ) : (
        <>
          <div className={styles.difficultyContainer}>
            <h3>Selecione a dificuldade</h3>

            <div className={styles.difficultyOptions}>
              {["FACIL", "MEDIO", "DIFICIL"].map((level) => (
                <button
                  key={level}
                  className={`${styles.difficultyButton} ${
                    difficulty === level ? styles.active : ""
                  }`}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            <button
              className={styles.startButton}
              disabled={!difficulty}
              onClick={handleStartGame}
            >
              Iniciar Jogo
            </button>
          </div>
        </>
      )}
      {/* {showMostraDificuldade ? <></> : <></>} */}
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
      // sessionStorage.setItem("player", "2");
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return (
    <TemplateExplicacao
      title="Jogo das Cores"
      description="O objetivo é arrastar cada uma das cores para o container do animal correspondente."
      route="/jogo-cores"
      gameKey="CORES"
    />
  );
};

export const ExplicacaoMemoria = () => {
  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      // sessionStorage.setItem("player", "2");
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return (
    <TemplateExplicacao
      title="Jogo da Memória"
      description="Revele todas as cartas encontrando os pares iguais consecutivos."
      route="/jogo-memoria"
      gameKey="MEMORIA"
    />
  );
};

export const ExplicacaoNumeros = () => {
  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      // sessionStorage.setItem("player", "2");
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return (
    <TemplateExplicacao
      title="Jogo dos Números"
      description="Ordene todos os números em sequência numérica ao arrastá-los para o container."
      route="/jogo-numeros"
      gameKey="NUMEROS"
    />
  );
};

export const ExplicacaoVogais = () => {
  const [stateUserDeslogado, setStateUserDeslogado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setStateUserDeslogado(true); // Atualiza o estado se o usuário não estiver logado
      // sessionStorage.setItem("player", "2");
    }
  }, []); // O useEffect será executado apenas uma vez após a montagem do componente

  // Aqui a lógica de renderização condicional
  return (
    <TemplateExplicacao
      title="Jogo das Vogais"
      description="Arraste, dentre o alfabeto inteiro, apenas as letras vogais para o container."
      route="/jogo-vogais"
      gameKey="VOGAIS"
    />
  );
};
