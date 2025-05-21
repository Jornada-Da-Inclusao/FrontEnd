import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './faceJogoVogais.module.css';
import image from '../../../assets/images/jacare-removebg.png'
import {
    DndContext, // Importa o contexto de drag-and-drop da biblioteca `@dnd-kit/core` que permite a implementação da funcionalidade de arrastar e soltar.
    useDroppable, // Importa o hook que permite criar uma área "droppable" (onde os itens podem ser soltos).
    useSensor, // Importa o hook que permite definir sensores que detectarão as interações de arraste (ex: mouse, toque).
    useSensors, // Importa o hook que permite criar e gerenciar múltiplos sensores.
    PointerSensor, // Importa o sensor que permite detectar interações de arraste com o mouse ou toque.
} from "@dnd-kit/core"; // Importa os componentes essenciais para drag-and-drop da biblioteca `@dnd-kit/core`.
import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";
import GameVogais from '../gameVogais/GameVogais.jsx';
import { randomizeArr } from '@/utils/utils';
import Timer from '@/components/timer/Timer';

function FaceJogoVogais() {
    const dialog = useRef(Object.prototype.constructor(HTMLDialogElement));
    const navigate = useNavigate();
    // Configura os sensores de arraste com o `PointerSensor`, que detecta interações de mouse ou toque.
    const sensors = useSensors(useSensor(PointerSensor));
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    // Estado que armazena as letras disponíveis para o arraste (A-Z).
    // Cria 26 letras com um valor numérico associado (1 = A, 2 = B, 3 = C, ..., 26 = Z).
    const [letters, setLetters] = useState(
        Array.from({ length: 26 }, (_, index) => ({
            id: index + 1, // O identificador único de cada letra (1 = A, 2 = B, etc.).
            value: index + 1, // O valor numérico correspondente à letra (1 = A, 2 = B, etc.).
        }))
    );

    // Estado que armazena as letras que foram arrastadas e soltas na área de destino.
    const [droppedLetters, setDroppedLetters] = useState([]);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00"); // Estado para armazenar o tempo formatado
    const idJogoVogais = 3;
    const idDependente = 10;
    const { registrarInfos } = useContext(JogoContext);
    const [infoJogoVogais, setInfoJogoVogais] = useState({});
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        if (usuario.token === "") {
            alert("Você precisa estar logado");
            navigate("/");
        }
    }, [usuario.token]);
    const token = usuario.token;

    useEffect(() => {
        const shuffledLetters = randomizeArr([...letters]);
        setLetters(shuffledLetters);
    }, []);

    const convertToMinutes = (time) => {
        // Divide o tempo em minutos e segundos
        const [minutes, seconds] = time.split(":").map(Number);

        // Converte tudo para minutos, incluindo os segundos
        return minutes + seconds / 60;
    };

    const handleTimeUpdate = (newTime) => {
        setTime(newTime); // Atualiza o estado com o novo tempo
    };

    function registrarInfosJogo() {
        registrarInfos(infoJogoVogais, token);
    }

    useEffect(() => {
        setInfoJogoVogais({
            tempoTotal: convertToMinutes(time),
            tentativas: tentativas,
            acertos: acertos,
            erros: erros,
            infoJogos_id_fk: {
                id: idJogoVogais,
            },
            dependente: {
                id: idDependente,
            },
        });

        if (droppedLetters.length === 5) {
            registrarInfosJogo();
            setPopupMessage("Missão concluída!");
            setShowPopup(true);
        }
    }, [droppedLetters, tentativas, acertos, erros, navigate]);

    useEffect(() => {
        if (dialog.current?.open && !showPopup) {
            dialog.current?.close();
        } else if (!dialog.current?.open && showPopup) {
            dialog.current?.showModal();
        }
    }, [showPopup]);

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/");
    };

    const { setNodeRef } = useDroppable({
        id: "droppable-area",
    });

    // Componente que representa a área onde as letras podem ser soltas.
    const DroppableArea = () => {
        // Hook `useDroppable` para tornar a área "droppable" (soltável).
        const { setNodeRef } = useDroppable({
            id: 'droppable-area', // Identificador da área de soltura.
        });

        return (
            <>
                <div ref={setNodeRef} className={styles.resultLetter}>
                    <div className={styles.dropaArea}>
                        {/* Exibe as letras que foram arrastadas para a área de soltura. */}
                        {droppedLetters.map(letter => (
                            <div key={letter.id} id={"num" + letter.id} className={styles.letterInDroppable}>
                                {String.fromCharCode(64 + letter.value)} {/* Converte o valor numérico para a letra correspondente. */}
                            </div>
                        ))}
                    </div>
                </div>
                <img className={styles.bgImage} src={image} alt="" />
            </>
        );
    };

    // Função chamada quando o usuário solta um item após arrastá-lo.
    const handleDragEnd = (event) => {
        const { active, over } = event;

        setTentativas((prev) => prev + 1);

        // Se o item não for solto sobre uma área válida, incremente erros.
        if (!over) {
            setErros((prev) => prev + 1);
            return;
        }

        const letterToDrop = letters.find(letter => letter.id === active.id);

        if (!letterToDrop) {
            return;
        }

        const ids = [1, 5, 9, 15, 21];

        console.log(letterToDrop.id)

        if (!droppedLetters.some(letter => letter.id === letterToDrop.id) && ids.some(id => id === letterToDrop.id)) {
            setDroppedLetters(prev => [...prev, letterToDrop]); // Adiciona a letra à lista de letras soltas.
            setLetters(prevLetters => prevLetters.filter(letter => letter.id !== letterToDrop.id)); // Remove a letra da lista de letras arrastáveis.
            setAcertos((prev) => prev + 1);
            return;
        }

        setErros((prev) => prev + 1);

        // Se o item for solto na área de soltura ('droppable-area').
        // if (over.id === 'droppable-area') {
        //     // Busca a letra arrastada com base em seu `id`.
        //     const letterToDrop = letters.find(letter => letter.id === active.id);
        //
        //     // Verifica se a letra ainda não foi solta anteriormente.
        //     if (letterToDrop && !droppedLetters.some(letter => letter.id === letterToDrop.id) && letterToDrop.id === 1 || letterToDrop.id === 5 || letterToDrop.id === 9 || letterToDrop.id === 15 || letterToDrop.id === 21) {
        //         setDroppedLetters(prev => [...prev, letterToDrop]); // Adiciona a letra à lista de letras soltas.
        //         setLetters(prevLetters => prevLetters.filter(letter => letter.id !== letterToDrop.id)); // Remove a letra da lista de letras arrastáveis.
        //         setAcertos((prev) => prev + 1);
        //     } else {
        //         setErros((prev) => prev + 1);
        //     }
        // }
    };

    return (
        <>
            <Timer
                isActive={true}
                resetTrigger={false}
                onTimeUpdate={handleTimeUpdate}
            />
            <div className={styles.bodyGame}>
                <div className={styles.game}>
                    <div className={styles.gameContent}>
                        <div className={styles.vogaisText}>
                            <h1 className={styles.vogaisHeading}>Jogo das Vogais</h1>
                            <p className={styles.vogaisParagraph}>ARRASTE PARA CIMA APENAS AS LETRAS VOGAIS</p>
                        </div>
                        <DndContext
                            sensors={sensors}
                            onDragEnd={handleDragEnd}
                        >
                            <DroppableArea />
                            <GameVogais letters={letters} /> {/* Componente que renderiza as letras arrastáveis. */}
                        </DndContext>
                    </div>
                </div>

                <dialog ref={dialog} className={styles.popup}>
                    <p>{popupMessage}</p>
                    <button id="popup-close" onClick={handlePopupClose}>
                        Voltar
                    </button>
                </dialog>
            </div>
            {/* <div className="btnJogos">
                <a href="/jogo-cores"><button href>Proximo Jogo</button></a>
            </div> */}
            <div className="enabled">
                <div className="active" vw-access-button></div>
                <div vw-plugin-wrapper>
                    <div className="vw-plugin-top-wrapper"></div>
                </div>
            </div>
            <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
            <script>
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            </script>
            <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
        </>
    );
}

export default FaceJogoVogais;
