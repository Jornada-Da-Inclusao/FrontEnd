// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import Timer from "../../../components/timer/timer";
import img1 from "@assets/images/memoria/pequena.png";
import img2 from "@assets/images/memoria/pequena3.png";
import img3 from "@assets/images/memoria/pequena4.png";
import img4 from "@assets/images/memoria/pequena5.png";
import imgPlaceholder from "@assets/images/memoria/rosa.png"; 
import styles from "./jogoMemoria.module.css"; 
import { JogoContext } from "../../../contexts/JogoContext";
import { AuthContext } from "../../../contexts/AuthContext";

const JogoMemoria = () => {
    const navigate = useNavigate(); 
    const cardsData = [
        { name: "imagem1", img: img1 },
        { name: "imagem2", img: img2 },
        { name: "imagem3", img: img3 },
        { name: "imagem4", img: img4 },
        { name: "imagem1", img: img1 },
        { name: "imagem2", img: img2 },
        { name: "imagem3", img: img3 },
        { name: "imagem4", img: img4 },
    ];
    
    const [cards, setCards] = useState([]); 
    const [cardsChosen, setCardsChosen] = useState([]); 
    const [cardsChosenId, setCardsChosenId] = useState([]); 
    const [cardsWon, setCardsWon] = useState([]); 
    const [popupMessage, setPopupMessage] = useState(''); 
    const [showPopup, setShowPopup] = useState(false); 
    const [acertos, setAcertos] = useState(0); 
    const [erros, setErros] = useState(0); 
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00");  
    const idJogoMemoria = 1;
    const idDependente = parseInt(sessionStorage.getItem("player"));
    const { registrarInfos } = useContext(JogoContext);
    const [infoJogoMemoria, setInfoJogoMemoria] = useState({});
    const { usuario } = useContext(AuthContext);
    const [timeInSeconds, setTimeInSeconds] = useState(180); 

    useEffect(() => {
        if (usuario.token === "") {
            alert("Você precisa estar logado")
            navigate("/")
        }
    }, [usuario.token])
    const token = usuario.token;

    const convertToMinutes = (time) => {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes + seconds / 60;
    };

    const handleTimeUpdate = (newTimeInSeconds) => {
        const segundosInteiros = Number.isFinite(newTimeInSeconds) ? Math.floor(newTimeInSeconds) : 0;
        if (segundosInteiros > 0) {
          setTimeInSeconds((prev) => {
            if (prev !== segundosInteiros) {
              return segundosInteiros;
            }
            return prev;
          });
        }
      };

    function registrarInfosJogo() {
        registrarInfos(infoJogoMemoria, token);
        console.log(infoJogoMemoria, token)
    }

    useEffect(() => {
        const originalCards = [...cardsData];
        const shuffled = new Array(originalCards.length);
        let availableIndices = [...Array(originalCards.length).keys()];
        for (let i = 0; i < originalCards.length / 2; i++) {
            const pair = [originalCards[i], originalCards[i + originalCards.length / 2]];
            const firstIndex = availableIndices.splice(Math.floor(Math.random() * availableIndices.length), 1)[0];
            let secondIndex;
            do {
                secondIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            } while (
                Math.abs(secondIndex - firstIndex) === 1 || 
                Math.abs(secondIndex - firstIndex) === 4    
            );
            availableIndices = availableIndices.filter(i => i !== secondIndex);
            shuffled[firstIndex] = pair[0];
            shuffled[secondIndex] = pair[1];
        }
        setCards(shuffled);
    }, []);

    useEffect(() => {
        if (cardsChosenId.length === 2) {
            const checkMatchTimeout = setTimeout(checkForMatch, 500);
            return () => clearTimeout(checkMatchTimeout);
        }
    }, [cardsChosenId]);

    useEffect(() => {
        setInfoJogoMemoria({
          tempoTotal: timeInSeconds > 0 ? timeInSeconds / 60 : 0.001, 
          tentativas,
          acertos,
          erros,
          infoJogos_id_fk: { id: idJogoMemoria },
          dependente: { id: idDependente },
        });
    }, [timeInSeconds, tentativas, acertos, erros]);
      
    useEffect(() => {
        if (cardsWon.length === 8) {
          registrarInfos(infoJogoMemoria, token);
          console.log("Enviando para o backend:", infoJogoMemoria);
          setPopupMessage("Missão concluída!");
          setShowPopup(true);
        }
    }, [cardsWon]);

    // *** Aqui o useEffect para atualizar o acertos conforme cardsWon ***
    useEffect(() => {
        setAcertos(cardsWon.length / 2);
    }, [cardsWon]);

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/");
    };    

    const checkForMatch = () => {
        const [optionOneId, optionTwoId] = cardsChosenId;
    
        if (optionOneId === optionTwoId) {
            setPopupMessage('Você clicou na mesma carta duas vezes!');
            setShowPopup(true);
            clearChosenCards();
            return;
        }
    
        if (cards[optionOneId]?.name === cards[optionTwoId]?.name) {
            setCardsWon(prev => [...prev, optionOneId, optionTwoId]);
            // Removida a linha que incrementava acertos diretamente:
            // setAcertos(prev => prev + 1);
        } else {
            setErros(prev => prev + 1);
        }
        setTentativas(prev => prev + 1);
        clearChosenCards();
    };
    
    const clearChosenCards = () => {
        setCardsChosen([]);
        setCardsChosenId([]);
    };

    const flipCard = (index) => {
        if (cardsChosenId.length < 2 && !cardsChosenId.includes(index) && !cardsWon.includes(index)) {
            setCardsChosen(prev => [...prev, cards[index].name]);
            setCardsChosenId(prev => [...prev, index]);
        }
    };

    return (
        <>
            <Timer isActive={true} resetTrigger={false} onTimeUpdate={handleTimeUpdate} />
            <div className={styles.gameContainer}>
                <div className={styles.resultContainer}>
                    <span className={styles.result}>Cartas combinadas: {cardsWon.length / 2}/{cards.length / 2}</span>
                </div>
                <div className={styles.board}>
                    {cards.map((card, index) => (
                        <img
                            key={index}
                            src={cardsWon.includes(index) || cardsChosenId.includes(index) ? card.img : imgPlaceholder}
                            alt={`card-${index}`}
                            onClick={() => flipCard(index)}
                            className={`card-image ${cardsWon.includes(index) ? 'disabled' : ''}`}
                        />
                    ))}
                </div>

                {showPopup && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <p>{popupMessage}</p>
                            <button id="popup-close" onClick={handlePopupClose}>Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JogoMemoria;
