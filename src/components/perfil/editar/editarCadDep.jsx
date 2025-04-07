import React, { useState, useEffect } from "react";
import styles from "../editar/editarCadDep.module.css";

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
    fetch("http://localhost:3000/api/ids")
      .then((res) => res.json())
      .then((data) => setIds(data)) // deve retornar um array de objetos: [{ id: 1, nome: 'Fulano', foto: '...' }]
      .catch((err) => console.error("Erro ao buscar IDs:", err));
  }, []);

  const handleSelectId = (e) => {
    setSelectedId(Number(e.target.value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Dados alterados com sucesso!");
  };

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const dataMinima = new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate());
  const dataMaxima = new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate());
  const formatarData = (data) => data.toISOString().split("T")[0];

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
    "https://www.svgrepo.com/show/420347/avatar-einstein-professor.svg",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Alterar dados dos dependentes</h2>

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
        <button>Remover dependente</button>
      </div>
    </div>
  );
};

export default EditarDep;
