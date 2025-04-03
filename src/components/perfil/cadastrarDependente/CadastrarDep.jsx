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


    // view this in home: https://www.svgrepo.com/svg/420338/avatar-person-pilot
    const icons = [
        {
            0: "https://www.svgrepo.com/show/420338/avatar-person-pilot.svg",
            1: "https://www.svgrepo.com/show/420314/builder-helmet-worker.svg",
            2: "https://www.svgrepo.com/show/420315/avatar-cloud-crying.svg",
            3: "https://www.svgrepo.com/show/420316/indian-man-sikh.svg",
            4: "https://www.svgrepo.com/show/420329/anime-away-face.svg",
            5: "https://www.svgrepo.com/show/420319/actor-chaplin-comedy.svg",
            6: "https://www.svgrepo.com/show/420333/afro-avatar-male.svg",
            7: "https://www.svgrepo.com/show/420347/avatar-einstein-professor.svg"
        }
    ]

    console.log(icons)

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Cadastrar dependentes</h2>

                <h3>escolha um avatar:</h3>
                <div className={styles.figures}>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                    <button type="button"><img src={icons[0]} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome da Criança:</label>
                    <input type="text" />
                    <label htmlFor="idade">Idade:</label>
                    <input type="number" min={3} max={10} />
                    <label htmlFor="idade">Sexo:</label>
                    <select name="" id="">
                        <option value="" disabled>- escolha</option>
                        <option value="">Masculino</option>
                        <option value="">Feminino</option>
                    </select>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div >
    );
};

export default CadastroForm;
