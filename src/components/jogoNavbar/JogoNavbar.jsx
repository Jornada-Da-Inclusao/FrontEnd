import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import style from "../../components/jogoNavbar/jogoNavbar.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCheck,
    faChildren,
    faCircleExclamation,
    faGamepad,
    faRotateRight,
    faTrophy,
    faXmark
} from '@fortawesome/free-solid-svg-icons';

function reload() {
    window.location.reload();
}

const JogoNavbar = ({ acertos = 0, erros = 0 }) => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("Visitante");
    const [foto, setFoto] = useState("");
    const [isLogado, setIsLogado] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

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
    } catch (error) {
        console.error("Erro ao ler player do sessionStorage:", error);
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

                    <li className={style.dependenteInfo}>
                        {foto ? (
                            <img src={foto} alt="Dependente" className={style.avatar} />
                        ) : (
                            <FontAwesomeIcon icon={faCircleExclamation} className={style.avatarIcon} />
                        )}
                        <span>{nome}</span>
                    </li>

                    <li>
                        <span>
                            <FontAwesomeIcon icon={faTrophy} /> pontuação:&nbsp;
                            <span style={{ color: 'green', fontWeight: 'bold' }}><FontAwesomeIcon icon={faCheck} />{acertos}</span> /{" "}
                            <span style={{ color: 'red', fontWeight: 'bold' }}><FontAwesomeIcon icon={faXmark} />{erros}</span>
                        </span>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate('/selecionar-jogador')}
                            disabled={!isLogado}
                            style={!isLogado ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                        >
                            <FontAwesomeIcon icon={faChildren} /> Mudar Jogador
                        </button>
                    </li>

                    <li>
                        <button onClick={() => setModalAberto(true)}>
                            <FontAwesomeIcon icon={faGamepad} /> Mudar Jogo
                        </button>
                    </li>

                    <li>
                        <button onClick={reload}>
                            <FontAwesomeIcon icon={faRotateRight} /> Reiniciar
                        </button>
                    </li>
                </ul>
            </div>

            {modalAberto && (
                <div className={style.modalOverlay}>
                    <div className={style.modal}>
                        <h3>Escolha o jogo</h3>
                        <ul className={style.modalOptions}>
                            <li>
                                <button onClick={() => navigate(isLogado ? '/jogo-memoria' : '/jogo-memoria-deslogado')}>
                                    Jogo da Memória
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate(isLogado ? '/jogo-cores' : '/jogo-cores-deslogado')}>
                                    Jogo das Cores
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate(isLogado ? '/jogo-vogais' : '/jogo-vogais-deslogado')}>
                                    Jogo das Vogais
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate(isLogado ? '/jogo-numeros' : '/jogo-numeros-deslogado')}>
                                    Jogo dos Números
                                </button>
                            </li>
                        </ul>
                        <button onClick={() => setModalAberto(false)}>Voltar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default JogoNavbar;
