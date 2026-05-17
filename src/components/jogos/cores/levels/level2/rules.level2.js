const ARTICLES = ["O", "A"];

export const level2 = {
  title: "O artigo correto",

  getDescription() {
    return "Arraste o artigo correto para cada imagem.";
  },

  setup() {
    const items = [
      { id: 1, label: "Coelho", article: "O" },
      { id: 2, label: "Borboleta", article: "A" },
      { id: 3, label: "Sapo", article: "O" },
      { id: 4, label: "Joaninha", article: "A" },
      { id: 5, label: "Leão", article: "O" },
    ];

    const targets = ARTICLES.map((a, index) => ({
      id: index,
      value: a,
    }));

    return {
      items,
      targets,
    };
  },

  validateMove({ item, target }) {
    return item.article === target.value;
  },

  isCompleted({ matchedTargets, gameData }) {
    return matchedTargets.length === gameData.items.length;
  },
};
