// src/components/EditarDep.jsx
import React, { useState, useEffect } from "react";
import styles from "../editar/editarCadDep.module.css";
import { icons } from "../icons";
import { getUserData, fetchDependentes, updateDependente, deleteDependente } from "../../../services/dependenteService";

const EditarDep = () => {
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
  });
  const [ids, setIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [avatarSelecionado, setAvatarSelecionado] = useState("");

  useEffect(() => {
    const fetchDependentesData = async () => {
      try {
        const data = await fetchDependentes();
        setIds(data);
      } catch (err) {
        console.error("Erro ao buscar dependentes:", err);
      }
    };
  
    fetchDependentesData();
  }, []);
  

  const handleSelectId = (e) => {
    const id = Number(e.target.value);
    setSelectedId(id);

    const dependente = ids.find((dep) => dep.id === id);
    if (dependente) {
      setFormData({
        nome: dependente.nome,
        dataNascimento: dependente.dataNascimento,
        sexo: dependente.sexo,
      });
      setAvatarSelecionado(dependente.avatar || "");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await updateDependente(selectedId, formData, avatarSelecionado);
      alert("Dados alterados com sucesso!");
    } catch (err) {
      console.error("Erro ao alterar dependente:", err);
    }
  };
  

  const handleRemove = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja remover este dependente?");
    if (!confirmDelete || !selectedId) return;

    const { token } = getUserData() || {};
    if (!token) return;

    try {
      await deleteDependente(selectedId, token);
      alert("Dependente removido com sucesso!");
      setFormData({ nome: "", dataNascimento: "", sexo: "" });
      setSelectedId(null);
    } catch (err) {
      console.error("Erro ao remover dependente:", err);
    }
  };

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const dataMinima = new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate());
  const dataMaxima = new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate());
  const formatarData = (data) => data.toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Alterar dados das crianças</h2>
        <h3>Alterar dados de qual criança:</h3>
        <select id="idSelect" value={selectedId ?? ""} onChange={handleSelectId}>
          <option value="" disabled>-- Escolha uma criança --</option>
          {ids.map((crianca) => (
            <option key={crianca.id} value={crianca.id}>
              {crianca.nome}
            </option>
          ))}
        </select>

        <h3>Troque o avatar:</h3>
        <div className={styles.figures}>
          {icons.map((icon, index) => (
            <button key={index} type="button" onClick={() => setAvatarSelecionado(icon)}>
              <img
                src={icon}
                alt={`Avatar ${index}`}
                className={avatarSelecionado === icon ? styles.avatarSelecionado : ""}
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome da Criança:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          <label htmlFor="dataNascimento">
            Data de nascimento (mínimo 3 anos, máximo 10 anos):
          </label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            min={formatarData(dataMinima)}
            max={formatarData(dataMaxima)}
          />

          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="" disabled>
              --- escolha ---
            </option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          <button type="submit">Alterar dados</button>
        </form>

        <button onClick={handleRemove}>Remover dependente</button>
      </div>
    </div>
  );
};

export default EditarDep;
