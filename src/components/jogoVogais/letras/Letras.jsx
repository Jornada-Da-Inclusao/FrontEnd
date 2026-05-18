import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import style from "./Letras.module.css";

function Letras({ id, value }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({ id });

  const scale = 1.25;

  const transformScale = transform
    ? {
        ...transform,
        x: transform.x / scale,
        y: transform.y / scale,
      }
    : undefined;

  const staticStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    willChange: "transform",
  };

  const dynamicStyles = {
    transform: CSS.Translate.toString(transformScale),
    transition,
  };

  return (
    <div
      className={style.letter}
      ref={setNodeRef}
      style={{
        ...staticStyles,
        ...dynamicStyles,
      }}
      {...attributes}
      {...listeners}
    >
      {value}
    </div>
  );
}

export default Letras;
