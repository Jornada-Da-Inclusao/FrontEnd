const nomes = ["Alice","Bruno","Camila","Diego","Eduarda","Felipe","Giovana","Henrique","Isabela","João",];
const fases = ["diagnostico", "nivel1", "nivel2", "nivel3"];
const jogos = [
  "Jogo da Memória",
  "Jogo dos Números",
  "Jogo das Letras",
  "Jogo das Cores",
];

const gerarResultadosAleatorios = () => {
  const resultados = [];

  for (let i = 0; i < 25; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const fase = fases[Math.floor(Math.random() * fases.length)];
    const jogo = jogos[Math.floor(Math.random() * jogos.length)];

    const tentativas = Math.floor(Math.random() * 35) + 5; // entre 5 e 40
    const acertos = Math.floor(Math.random() * (tentativas + 1));
    const erros = tentativas - acertos;
    const tempo = Math.floor(Math.random() * 171 + 10);

    resultados.push({ nome, fase, jogo, acertos, erros, tentativas, tempo });
  }

  return resultados;
};

const resultados = gerarResultadosAleatorios();

export default resultados;
