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

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Cadastrar dependentes</h2>
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
        </div>
    );
};

export default CadastroForm;
