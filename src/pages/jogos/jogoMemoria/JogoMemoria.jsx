// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react'; // Importa os hooks 'useState' e 'useEffect' do React para gerenciar o estado e os efeitos colaterais no componente.
import { useNavigate } from 'react-router-dom'; // Importa o hook 'useNavigate' para permitir a navegação programática entre as páginas.
import Timer from "../../../components/timer/timer";
import img1 from "@assets/images/memoria/pequena.png";
import img2 from "@assets/images/memoria/pequena3.png";
import img3 from "@assets/images/memoria/pequena4.png";
import img4 from "@assets/images/memoria/pequena5.png";
import imgPlaceholder from "@assets/images/memoria/rosa.png"; // Imagem que será exibida nas cartas viradas para baixo.
import styles from "./jogoMemoria.module.css"; // Importa os estilos CSS para estilizar o componente.
import { JogoContext } from "../../../contexts/JogoContext";
import { AuthContext } from "../../../contexts/AuthContext";

const JogoMemoria = () => {
    const navigate = useNavigate(); // Usado para navegar para outras páginas quando necessário.
    // Define os dados das cartas (nome e imagem) que serão usadas no jogo.
    const cardsData = [
        { name: "imagem1", img: img1 },
        { name: "imagem3", img: img2 },
        { name: "imagem4", img: img3 },
        { name: "imagem5", img: img4 },
        { name: "imagem1", img: img1 },
        { name: "imagem3", img: img2 },
        { name: "imagem4", img: img3 },
        { name: "imagem5", img: img4 },
    ];

    // Declara os estados que serão usados para controlar o jogo.
    const [cards, setCards] = useState([]); // Armazena as cartas embaralhadas
    const [cardsChosen, setCardsChosen] = useState([]); // Armazena os nomes das cartas que foram escolhidas
    const [cardsChosenId, setCardsChosenId] = useState([]); // Armazena os índices das cartas escolhidas
    const [cardsWon, setCardsWon] = useState([]); // Armazena as cartas que já foram combinadas
    const [popupMessage, setPopupMessage] = useState(''); // Mensagem que será exibida no popup
    const [showPopup, setShowPopup] = useState(false); // Controla se o popup será exibido
    const [acertos, setAcertos] = useState(0); // Armazena a quantidade de acertos no jogo
    const [erros, setErros] = useState(0); // Armazena a quantidade de erros no jogo
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00");  // Estado para armazenar o tempo formatado
    const idJogoMemoria = 1;
    const idDependente = 10;
    const { registrarInfos } = useContext(JogoContext);
    const [infoJogoMemoria, setInfoJogoMemoria] = useState({});
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        if (usuario.token === "") {
            alert("Você precisa estar logado")
            navigate("/")
        }
    }, [usuario.token])
    const token = usuario.token;


    const convertToMinutes = (time) => {
        // Divide o tempo em minutos e segundos
        const [minutes, seconds] = time.split(":").map(Number);

        // Converte tudo para minutos, incluindo os segundos
        return minutes + seconds / 60;
    };


    const handleTimeUpdate = (newTime) => {
        setTime(newTime);  // Atualiza o estado com o novo tempo
    };

    function registrarInfosJogo() {
        registrarInfos(infoJogoMemoria, token);
    }

    // Hook 'useEffect' para embaralhar as cartas assim que o componente for montado.
    useEffect(() => {
        const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5); // Embaralha as cartas aleatoriamente
        setCards(shuffledCards); // Atualiza o estado com as cartas embaralhadas
    }, []); // O array vazio [] indica que o efeito ocorre apenas uma vez após a renderização inicial.

    // Hook 'useEffect' para verificar se duas cartas foram escolhidas e iniciar a verificação de combinação.
    useEffect(() => {
        if (cardsChosenId.length === 2) {
            // Usa 'setTimeout' para chamar a função 'checkForMatch' após meio segundo.
            const checkMatchTimeout = setTimeout(checkForMatch, 500);
            return () => clearTimeout(checkMatchTimeout); // Limpa o timeout quando o efeito for re-executado.
        }
    }, [cardsChosenId]); // O efeito será executado toda vez que o estado 'cardsChosenId' mudar.

    // Hook 'useEffect' para verificar se todas as cartas foram combinadas corretamente.
    
      useEffect(() => {
        setInfoJogoMemoria({
          tempoTotal: convertToMinutes(time),
          tentativas: tentativas,
          acertos: acertos,
          erros: erros,
          infoJogos_id_fk: {
            id: idJogoMemoria,
          },
          dependente: {
            id: idDependente,
          },
        });
    
        if (cardsWon.length === 8) { // Quando 8 cartas forem combinadas (4 pares de cartas)
          registrarInfosJogo();
          setPopupMessage("Missão concluída!");
          setShowPopup(true);
        }
      }, [cardsWon, navigate]);// O efeito é executado toda vez que o estado 'cardsWon' ou a função 'navigate' mudar.

    // Função que fecha o popup.
    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/");
      };

    // Função que verifica se as duas cartas escolhidas são iguais ou não.
    const checkForMatch = () => {
        const [optionOneId, optionTwoId] = cardsChosenId; // Obtém os índices das cartas escolhidas.

        // Verifica se os índices das cartas estão dentro do intervalo válido.
        if (optionOneId >= 0 && optionTwoId >= 0 && optionOneId < cards.length && optionTwoId < cards.length) {
            const optionOneName = cards[optionOneId]?.name; // Obtém o nome da primeira carta.
            const optionTwoName = cards[optionTwoId]?.name; // Obtém o nome da segunda carta.

            setTentativas(prev => prev + 1);
            // Verifica se as cartas escolhidas são iguais.
            if (optionOneId === optionTwoId) {
                //setPopupMessage('Você clicou na mesma imagem'); // Informa que a mesma carta foi clicada duas vezes.
                setShowPopup(true); // Exibe o popup.
            } else if (optionOneName === optionTwoName) {
                setCardsWon(prev => [...prev, optionOneId, optionTwoId]); // Adiciona as cartas combinadas ao estado 'cardsWon'.
                setAcertos(prev => prev + 1); // Incrementa o contador de acertos.
            } else {
                setErros(prev => prev + 1); // Incrementa o contador de erros.
            }
            clearChosenCards(); // Limpa as cartas escolhidas para nova rodada.
        } else {
            console.error('IDs escolhidos estão fora do intervalo válido:', optionOneId, optionTwoId);
        }
    };

    // Função que limpa as cartas escolhidas.
    const clearChosenCards = () => {
        setCardsChosen([]); // Limpa os nomes das cartas escolhidas.
        setCardsChosenId([]); // Limpa os índices das cartas escolhidas.
    };

    // Função que vira uma carta ao ser clicada.
    const flipCard = (index) => {
        if (cardsChosenId.length < 2 && !cardsChosenId.includes(index) && !cardsWon.includes(index)) {
            setCardsChosen(prev => [...prev, cards[index].name]); // Adiciona o nome da carta ao estado 'cardsChosen'.
            setCardsChosenId(prev => [...prev, index]); // Adiciona o índice da carta ao estado 'cardsChosenId'.
        }
    };

    return (
        <>
            <Timer isActive={true} resetTrigger={false} onTimeUpdate={handleTimeUpdate} />
            <div className={styles.gameContainer}> {/* Contêiner principal do jogo */}
                <div className={styles.resultContainer}> {/* Exibe o resultado de cartas combinadas */}
                    <span className={styles.result}>Cartas combinadas: {cardsWon.length / 2}/{cards.length / 2}</span> {/* Exibe a quantidade de pares de cartas combinadas */}
                </div>
                <div className={styles.board}> {/* Tabuleiro onde as cartas serão exibidas */}
                    {cards.map((card, index) => ( // Mapeia todas as cartas e exibe cada uma
                        <img
                            key={index}
                            src={cardsWon.includes(index) || cardsChosenId.includes(index) ? card.img : imgPlaceholder} // Exibe a imagem da carta se ela foi virada ou combinada, caso contrário, exibe a imagem de placeholder.
                            alt={`card-${index}`} // Define o texto alternativo para a imagem da carta.
                            onClick={() => flipCard(index)} // Chama a função 'flipCard' ao clicar na carta.
                            className={`card-image ${cardsWon.includes(index) ? 'disabled' : ''}`} // Adiciona a classe 'disabled' às cartas combinadas.
                        />
                    ))}
                </div>

                {/* Exibe o popup caso haja uma mensagem para mostrar */}
                {showPopup && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <p>{popupMessage}</p> {/* Exibe a mensagem do popup */}
                            <button id="popup-close" onClick={handlePopupClose}>Fechar</button> {/* Botão para fechar o popup */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JogoMemoria; // Exporta o componente para ser utilizado em outras partes do aplicativo.