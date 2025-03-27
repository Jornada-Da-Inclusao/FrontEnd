// src/components/CadastroForm.js
import React, { useState } from "react";

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
        <div className="form-container">
            <h1>Cadastro para Jogos Educativos</h1>
            <p>Cadastre seu filho para participar das atividades interativas.</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome da Criança:</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />

                <label htmlFor="idade">Idade:</label>
                <input type="number" id="idade" name="idade" min="3" value={formData.idade} onChange={handleChange} required />

                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroForm;
