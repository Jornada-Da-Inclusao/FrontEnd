// src/data/resultados.js
const resultados = [
  { nome: "João", fase: "diagnostico", jogo: "Jogo da Memória", acertos: 8, erros: 2 },
  { nome: "João", fase: "nivel2", jogo: "Jogo dos Números", acertos: 9, erros: 1 },
  { nome: "Maria", fase: "nivel1", jogo: "Jogo das Letras", acertos: 7, erros: 3 },
  { nome: "Maria", fase: "nivel3", jogo: "Jogo das Cores", acertos: 10, erros: 0 },
  { nome: "Lucas", fase: "diagnostico", jogo: "Jogo da Memória", acertos: 6, erros: 4 },
  { nome: "Ana", fase: "nivel2", jogo: "Jogo dos Números", acertos: 7, erros: 3 },
  { nome: "Carla", fase: "nivel3", jogo: "Jogo das Cores", acertos: 9, erros: 1 },
].map((item) => ({
  ...item,
  tempo: Math.floor(Math.random() * 270 + 30),
}));

export default resultados;
