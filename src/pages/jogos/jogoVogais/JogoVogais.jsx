import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from './jogoVogais.module.css'; // Importa o arquivo CSS que contém os estilos específicos do componente.
import {
    DndContext, // Importa o contexto de drag-and-drop da biblioteca `@dnd-kit/core` que permite a implementação da funcionalidade de arrastar e soltar.
    useDroppable, // Importa o hook que permite criar uma área "droppable" (onde os itens podem ser soltos).
    useSensor, // Importa o hook que permite definir sensores que detectarão as interações de arraste (ex: mouse, toque).
    useSensors, // Importa o hook que permite criar e gerenciar múltiplos sensores.
    PointerSensor, // Importa o sensor que permite detectar interações de arraste com o mouse ou toque.
    closestCorners, // Importa a estratégia de detecção de colisão que identifica quando um item está próximo dos cantos de outra área.
} from "@dnd-kit/core"; // Importa os componentes essenciais para drag-and-drop da biblioteca `@dnd-kit/core`.
import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";
import VogaisGrid from '@/components/jogoVogais/vogaisGrid/VogaisGrid'; // Importa o componente que renderiza as letras arrastáveis do jogo.
import { randomizeArr } from '@/utils/utils';
import Timer from '@/components/timer/Timer';
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

function JogoVogais() {
    const dialog = useRef(Object.prototype.constructor(HTMLDialogElement));
    const navigate = useNavigate();
    // Configura os sensores de arraste com o `PointerSensor`, que detecta interações de mouse ou toque.
    const sensors = useSensors(useSensor(PointerSensor));
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [modalSucesso, setModalSucesso] = useState(false);
    // Estado que armazena as letras disponíveis para o arraste (A-Z).
    // Cria 26 letras com um valor numérico associado (1 = A, 2 = B, 3 = C, ..., 26 = Z).
    const [letras, setLetras] = useState(
        Array.from({ length: 26 }, (_, index) => ({
            id: index + 1, // O identificador único de cada letra (1 = A, 2 = B, etc.).
            value: index + 1, // O valor numérico correspondente à letra (1 = A, 2 = B, etc.).
        }))
    );

    // Estado que armazena as letras que foram arrastadas e soltas na área de destino.
    const [droppedLetras, setDroppedLetras] = useState([]);
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
        const shuffledLetras = randomizeArr([...letras]);
        setLetras(shuffledLetras);
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

        if (droppedLetras.length === 5) {            
            registrarInfosJogo();
            // setPopupMessage("Missão concluída!");
            // setShowPopup(true);
            setModalSucesso(true);
        }
    }, [droppedLetras, navigate]);

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

    // Componente que representa a área onde as letras podem ser soltadas.
    const DroppableArea = () => {
        // Hook `useDroppable` é usado para definir uma área "droppable" (onde os itens podem ser soltos).
        const { setNodeRef } = useDroppable({
            id: 'droppable-area', // O identificador único da área onde as letras serão soltas.
        });

        return (
            <div ref={setNodeRef} className={Style.resultletra}>
                <div className={Style.dropArea}>
                    {/* Exibe as letras que foram soltas na área */}
                    {droppedLetras.map(letra => (
                        <div key={letra.id} id={"num" + letra.id} className={Style.letraInDroppable}>
                            {String.fromCharCode(64 + letra.value)} {/* Converte o valor numérico da letra para o caractere correspondente. */}
                        </div>
                    ))}
                </div>
                <div className={Style.bgImage}>
                    <img src="'../../assets/images/jacare-removebg.png" alt="" />
                </div>
            </div>
        );
    };

    // Função chamada quando o usuário solta um item (letra) após arrastá-lo.
    const handleDragEnd = (event) => {
        const { active, over } = event;

        setTentativas((prev) => prev + 1);

        // Se o item não for solto sobre uma área válida, incremente erros.
        if (!over) {
            setErros((prev) => prev + 1);
            return;
        }

        // Verifica se o item foi solto na área de destino (identificada como 'droppable-area').
        if (over.id === 'droppable-area') {
            // Procura a letra que foi arrastada, com base no seu ID.
            const letraToDrop = letras.find(letra => letra.id === active.id);

            // Verifica se a letra ainda não foi solta e se é uma vogal.
            if (letraToDrop && !droppedLetras.some(letra => letra.id === letraToDrop.id) &&
                (letraToDrop.id === 1 || letraToDrop.id === 5 || letraToDrop.id === 9 || letraToDrop.id === 15 || letraToDrop.id === 21)) {

                // Adiciona a letra à lista de letras que foram soltas.
                setDroppedLetras(prev => [...prev, letraToDrop]);
                // Remove a letra da lista de letras arrastáveis.
                setLetras(prevLetras => prevLetras.filter(letra => letra.id !== letraToDrop.id));
                setAcertos((prev) => prev + 1);
            } else {
                setErros((prev) => prev + 1);
            }
        }
    };

    return (
        <>
            <Timer
                isActive={true}
                resetTrigger={false}
                onTimeUpdate={handleTimeUpdate}
            />
            <div className={Style.pagVogais}>
                <div></div>
                <div>
                    <div className={Style.bodyGame}>
                        <div className={Style.jogo}>
                            <div className={Style.gameContent}>
                                <div className={Style.phrase}>
                                    <p>ARRASTE PARA CIMA APENAS AS LETRAS VOGAIS</p>
                                </div>
                                <DndContext
                                    sensors={sensors} // Passa os sensores de arraste configurados para o DnDContext.
                                    collisionDetection={closestCorners} // Define a estratégia de detecção de colisão.
                                    onDragEnd={handleDragEnd} // Define a função a ser chamada quando o arraste terminar.
                                >
                                    <DroppableArea /> {/* Exibe a área onde as letras podem ser soltas. */}
                                    <VogaisGrid Letras={letras} /> {/* Componente que renderiza as letras disponíveis para arrasto. */}
                                </DndContext>
                            </div>
                        </div>
                    </div>

                    <dialog ref={dialog} className={styles.popup}>
                        <p>{popupMessage}</p>
                        <button id="popup-close" onClick={handlePopupClose}>
                            Voltar
                        </button>
                    </dialog>

                </div>
                <div></div>
            </div>
            {/* Bloco de código para acessibilidade e integração com o VLibras (para acessibilidade em libras). */}
            <div className="enabled">
                <div className="active" vw-access-button></div>
                <div vw-plugin-wrapper>
                    <div className="vw-plugin-top-wrapper"></div>
                </div>
            </div>
            <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
            <script>
                new window.VLibras.Widget('https://vlibras.gov.br/app'); {/* Inicializa o widget do VLibras. */}
            </script>
            <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
        </>
    );
    <CustomModal
            show={modalSucesso}
            onClose={() => {
              setModalSucesso(false);
              navigate('/');
            }}
            title="Missão concluída!"
            message="Você Finalizou Esse Jogo."
            icon="✔️"
            color="#4caf50"
            doneButton={{
              label: "OK",
              onClick: () => {
                setModalSucesso(false);
                navigate('/');
              }
            }}
          />
}

export default JogoVogais