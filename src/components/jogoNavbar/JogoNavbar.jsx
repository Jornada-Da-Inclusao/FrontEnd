import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import style from "../../components/jogoNavbar/jogoNavbar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faChildren,
  faCircleExclamation,
  faGamepad,
  faRotateRight,
  faTrophy,
  faXmark,
  faDroplet,
  faBrain,
  faFont,
  faArrowDown19,
} from "@fortawesome/free-solid-svg-icons";
import { scoreStore } from "../jogos/scoreStore/scoreStore";

function reload() {
  window.location.reload();
}

const JogoNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  const [nome, setNome] = useState("Visitante");
  const [foto, setFoto] = useState("");
  const [isLogado, setIsLogado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    return scoreStore.subscribe((score) => {
      setAcertos(score.acertos);
      setErros(score.erros);
    });
  }, []);

  useEffect(() => {
    const playerData = sessionStorage.getItem("player");

    try {
      const player = JSON.parse(playerData);

      if (player && typeof player === "object") {
        setNome(player.nome || "Visitante");
        setFoto(player.foto || "");
        setIsLogado(true);
      } else {
        throw new Error("Player inválido");
      }
    } catch {
      setNome("Visitante");
      setFoto("");
      setIsLogado(false);
    }
  }, []);

  return (
    <>
      <div className={style.navbar}>
        <ul>
          <li>
            <button onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
          </li>

          <li>
            <button onClick={reload}>
              <FontAwesomeIcon icon={faRotateRight} /> Reiniciar
            </button>
          </li>

          <li>
            <button onClick={() => setModalAberto(true)}>
              <FontAwesomeIcon icon={faGamepad} /> Mudar Jogo
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/selecionar-jogador")}
              disabled={!isLogado}
              style={!isLogado ? { opacity: 0.5 } : {}}
            >
              <FontAwesomeIcon icon={faChildren} /> Mudar Jogador
            </button>
          </li>

          <li>
            {foto ? (
              <img src={foto} alt="Dependente" />
            ) : (
              <FontAwesomeIcon icon={faCircleExclamation} />
            )}
            <span>{nome}</span>
          </li>

          <li>
            <span>
              <FontAwesomeIcon icon={faTrophy} />{" "}
              <span style={{ color: "green" }}>
                <FontAwesomeIcon icon={faCheck} /> {acertos}
              </span>{" "}
              /{" "}
              <span style={{ color: "red" }}>
                <FontAwesomeIcon icon={faXmark} /> {erros}
              </span>
            </span>
          </li>
        </ul>
      </div>

      {modalAberto && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h3>Escolha o jogo</h3>

            <button onClick={() => navigate("/jogo-memoria")}>
              <FontAwesomeIcon icon={faBrain} /> Memória
            </button>

            <button onClick={() => navigate("/jogo-cores")}>
              <FontAwesomeIcon icon={faDroplet} /> Cores
            </button>

            <button onClick={() => navigate("/jogo-vogais")}>
              <FontAwesomeIcon icon={faFont} /> Vogais
            </button>

            <button onClick={() => navigate("/jogo-numeros")}>
              <FontAwesomeIcon icon={faArrowDown19} /> Números
            </button>

            <button onClick={() => setModalAberto(false)}>Voltar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default JogoNavbar;
