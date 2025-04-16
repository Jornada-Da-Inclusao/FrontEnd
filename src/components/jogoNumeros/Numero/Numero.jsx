import React from "react"
import { useDraggable } from "@dnd-kit/core"; // Importa o hook useDraggable da biblioteca @dnd-kit
import { CSS } from "@dnd-kit/utilities"; // Importa utilidades da biblioteca @dnd-kit

import styles from './Numero.module.css'; // Importa o estilo do componente

// Define o componente Letters, que representa uma letra que pode ser arrastada.
function Numeros({ id, value }) {
  // Usa o hook useDraggable para tornar o componente arrastável.
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: id });

  // Define estilos dinâmicos que mudam com a transformação.
  const dynamicStyles = {
    transform: CSS.Translate.toString(transform), // Aplica a transformação de posição
    CSSTransition, // Aplica a transição
  };

  return (
    <div
      className={styles.number}
      ref={setNodeRef} // Referência para o elemento arrastável
      style={{ ...dynamicStyles }} // Aplica estilos estáticos e dinâmicos
      {...attributes} // Adiciona atributos de acessibilidade
      {...listeners} // Adiciona listeners para eventos de arrasto
    >
      {value} {/* Converte o valor numérico em uma letra */}
    </div>
  );
}

export default Numeros