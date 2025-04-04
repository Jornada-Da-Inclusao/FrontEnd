import React, { useState } from "react";
import styles from "../cadastrarDependente/cadastrarDep.module.css"

const CadastroForm = () => {
    const [formData, setFormData] = useState({
        nome: "",
        idade: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Cadastro realizado com sucesso!");
    };


    // lugar de onde tirei os icones: https://www.svgrepo.com/svg/420338/avatar-person-pilot
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
    ]


    // checa a idade pela data e impede menor de 3 e maior de 10
    const hoje = new Date()
    const anoAtual = hoje.getFullYear()

    const dataMinima = new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate())
    const dataMaxima = new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate())

    const formatarData = (data) => data.toISOString().split('T')[0]

    // seleciona o icone e guarda sua url no avatarSelecionado
    const [avatarSelecionado, setAvatarSelecionado] = useState("");

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
                            />
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome da Criança:</label>
                    <input type="text" />
                    <label htmlFor="idade">Data de nascimento (minimo 3 anos, maximo 10 anos):</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        min={formatarData(dataMinima)}
                        max={formatarData(dataMaxima)}
                        required
                    />
                    <label htmlFor="sexo">Sexo:</label>
                    <select name="" id="">
                        <option value="" disabled selected>--- escolha ---</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div >
    );
};

export default CadastroForm;
