import { useEffect, useState } from "react";

export function useGameScore() {
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const a = Number(sessionStorage.getItem("acertos") || 0);
      const e = Number(sessionStorage.getItem("erros") || 0);

      setAcertos(a);
      setErros(e);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return { acertos, erros };
}
