import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './jogoMemoria.module.css';

// Importando imagens
import img1 from '../../../assets/images/memoria/pequena.png';
import img2 from '../../../assets/images/memoria/pequena3.png';
import img3 from '../../../assets/images/memoria/pequena4.png';
import img4 from '../../../assets/images/memoria/pequena5.png';
import imgPlaceholder from '../../../assets/images/memoria/rosa.png';

const JogoMemoria = () => {
    const navigate = useNavigate();
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

    const [cards, setCards] = useState([]);
    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsChosenId, setCardsChosenId] = useState([]);
    const [cardsWon, setCardsWon] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);

    useEffect(() => {
        const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
    }, []);

    useEffect(() => {
        if (cardsChosenId.length === 2) {
            const checkMatchTimeout = setTimeout(checkForMatch, 500);
            return () => clearTimeout(checkMatchTimeout);
        }
    }, [cardsChosenId]);

    useEffect(() => {
        if (cardsWon.length === 8) { // 4 combinações corretas = 8 índices
            setPopupMessage('Missão concluída!');
            setShowPopup(true);
            setTimeout(() => navigate('/'), 2000);
        }
    }, [cardsWon, navigate]);

    const handlePopupClose = () => setShowPopup(false);

    const checkForMatch = () => {
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (optionOneId >= 0 && optionTwoId >= 0 && optionOneId < cards.length && optionTwoId < cards.length) {
            const optionOneName = cards[optionOneId]?.name;
            const optionTwoName = cards[optionTwoId]?.name;

            if (optionOneId === optionTwoId) {
                setPopupMessage('Você clicou na mesma imagem');
                setShowPopup(true);
            } else if (optionOneName === optionTwoName) {
                setCardsWon(prev => [...prev, optionOneId, optionTwoId]);
                setAcertos(prev => prev + 1); // Mantém acertos para controle em JS/Banco
            } else {
                setErros(prev => prev + 1); // Mantém erros para controle em JS/Banco
            }
            clearChosenCards();
        } else {
            console.error('IDs escolhidos estão fora do intervalo válido:', optionOneId, optionTwoId);
        }
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
    );
};

export default JogoMemoria;
