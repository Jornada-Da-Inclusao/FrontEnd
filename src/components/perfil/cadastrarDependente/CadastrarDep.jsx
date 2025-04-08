import React, { useState } from "react";
import styles from "../cadastrarDependente/cadastrarDep.module.css";
import axios from "axios";

const CadastroForm = () => {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [sexo, setSexo] = useState("");
    const [avatarSelecionado, setAvatarSelecionado] = useState("");

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const dataMinima = new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate());
    const dataMaxima = new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate());

    const formatarData = (data) => data.toISOString().split('T')[0];

    const icons = [
        "https://www.svgrepo.com/show/420338/avatar-person-pilot.svg",
        "https://www.svgrepo.com/show/420345/fighter-luchador-man.svg",
        "https://www.svgrepo.com/show/420315/avatar-cloud-crying.svg",
        "https://www.svgrepo.com/show/420322/avatar-female-portrait-2.svg",
        "https://www.svgrepo.com/show/420327/avatar-child-girl.svg",
        "https://www.svgrepo.com/show/420329/anime-away-face.svg",
        "https://www.svgrepo.com/show/420319/actor-chaplin-comedy.svg",
        "https://www.svgrepo.com/show/420333/afro-avatar-male.svg",
        "https://www.svgrepo.com/show/420360/avatar-batman-comics.svg",
        "https://www.svgrepo.com/show/420334/avatar-bad-breaking.svg",
        "https://www.svgrepo.com/show/420343/avatar-joker-squad.svg",
        "https://www.svgrepo.com/show/420347/avatar-einstein-professor.svg"
    ];

    const calcularIdade = (nascimento) => {
        const dataNasc = new Date(nascimento);
        const diff = hoje - dataNasc;
        const idade = new Date(diff).getUTCFullYear() - 1970;
        return idade;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!avatarSelecionado || !nome || !dataNascimento || !sexo) {
            alert("Preencha todos os campos e selecione um avatar.");
            return;
        }

        const idade = calcularIdade(dataNascimento);
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const usuarioId = usuario?.id;

        if (!usuarioId) {
            alert("Erro: usuário não encontrado.");
            return;
        }

        const dependente = { // mudar o back pra receber so o valor do id, e tbm permitir enviar a url do avatar
            nome,
            idade,
            sexo,
            usuario_id_fk: {
                id: usuarioId
              }           
        };     

        const token = localStorage.getItem("token");

        try {

            const response = await axios.post(
                "https://backend-9qjw.onrender.com/dependente",
                dependente,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Cadastro realizado com sucesso!");
            console.log(response.data); 

        } catch (error) {
            alert("Erro ao cadastrar dependente");
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Cadastrar dependentes</h2>

                <h3>Escolha um avatar:</h3>
                <div className={styles.figures}>
                    {icons.map((icon, index) => (
                        <button key={index} type="button" onClick={() => setAvatarSelecionado(icon)}>
                            <img
                                src={icon}
                                className={avatarSelecionado === icon ? styles.avatarSelecionado : ""}
                                alt={`avatar ${index}`}
                            />
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome da Criança:</label>
                    <input
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />

                    <label htmlFor="dataNascimento">Data de nascimento (mínimo 3 anos, máximo 10 anos):</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        min={formatarData(dataMinima)}
                        max={formatarData(dataMaxima)}
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                    />

                    <label htmlFor="sexo">Sexo:</label>
                    <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                        <option value="" disabled>--- escolha ---</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
};

export default CadastroForm;
