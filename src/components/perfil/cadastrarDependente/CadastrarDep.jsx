import React, { useState } from "react";
import styles from "../cadastrarDependente/cadastrarDep.module.css";
import { cadastrarDependente } from "../../../services/dependenteService";
import { icons } from "../icons";

const CadastroForm = () => {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [avatarSelecionado, setAvatarSelecionado] = useState("");

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const dataMinima = new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate());
  const dataMaxima = new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate());

  const formatarData = (data) => data.toISOString().split("T")[0];

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

    const dependente = {
      nome,
      idade,
      sexo,
      foto: avatarSelecionado,
      usuario_id_fk: {
        id: usuarioId
      }
    };

    try {
      await cadastrarDependente(dependente);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar dependente");
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <h2>Cadastrar crianças</h2>

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

                <label htmlFor="dataNascimento">Data de nascimento (intervalo entre 3 anos a 10 anos):</label>
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
