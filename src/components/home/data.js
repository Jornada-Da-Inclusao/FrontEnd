import imgCores from "@assets/images/cores.jpg"
import imgMemoria from "@assets/images/memoria.png"
import imgNumeros from "@assets/images/numeros.png"
import imgVogais from "@assets/images/vogais.jpg"

export const cardsData = [
	{
		id: 0,
		name: "cores",
		alt: "Jogo das Cores",
		title: "Jogo das Cores",
		desc: "O Jogo das Cores ensina as crianças a identificar e nomear cores através de atividades lúdicas. Além de estimular a observação, ajuda a expandir o vocabulário e a criatividade.",
		descModal: "No Jogo das Cores, o objetivo é arrastar cada uma das cores para o container do animal correspondente.",
		img: imgCores,
		link: "/jogo-cores",
		explicacao: "/jogo-cores-exp"
	},
	{
		id: 1,
		name: "memoria",
		alt: "Jogo da Memória",
		title: "Jogo da Memória",
		desc: "O Jogo da Memória ajuda as crianças a melhorarem a concentração e a memória visual. Ao encontrar pares de cartas relacionadas a conceitos educativos, os alunos reforçam o aprendizado de forma divertida.",
		descModal: "No Jogo da Memória, as cartas começarão viradas de cabeça para baixo, esperando um clique para serem reveladas. Caso duas cartas iguais sejam selecionadas consecutivamente, elas serão tidas como reveladas, do contrário, elas voltarão a ficar ocultas. Seu objetivo é revelar todas as cartas.",
		img: imgMemoria,
		link: "/jogo-memoria",
		explicacao: "/jogo-memoria-exp"
	},
	{
		id: 2,
		name: "numeros",
		alt: "Jogo dos Números",
		title: "Jogo dos Números",
		desc: "Neste jogo, as crianças praticam a ordenação de números em sequência crescente ou decrescente. Essa atividade desenvolve o raciocínio lógico e familiariza os alunos com a sequência numérica.",
		descModal: "No Jogo dos Números, o objetivo é ordernar todos os números em sequência numérica ao arrastá-los para o container.",
		img: imgNumeros,
		link: "/jogo-numeros",
		explicacao: "/jogo-numeros-exp"
	},
	{
		id: 3,
		name: "vogais",
		alt: "Jogo das Vogais",
		title: "Jogo das Vogais",
		desc: "Neste jogo, as crianças aprendem sobre vogais de forma interativa. Através de atividades de reconhecimento e combinação, desenvolvem habilidades de leitura e aumentam o interesse pela linguagem.",
		descModal: "No Jogo das Vogais, o objetivo é arrastar, dentre o alfabeto inteiro, apenas as letras vogais para o container.",
		img: imgVogais,
		link: "/jogo-vogais",
		explicacao: "/jogo-vogais-exp"
	},
]
