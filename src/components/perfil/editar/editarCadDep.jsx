import React, { useState, useEffect } from "react";
import styles from "../editar/editarCadDep.module.css";
import { icons } from "../icons";
import { calcularIdade } from '../calcularIdade';
import { getUserData, fetchDependentes, updateDependente, deleteDependente } from "../../../services/dependenteService";
import DependenteModals from "../../../components/Modal-custom-alert/DependenteModal";

const EditarDep = () => {
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
  });
  const [ids, setIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [avatarSelecionado, setAvatarSelecionado] = useState("");

  // Modais
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      setAvatarSelecionado(dependente.foto || "");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idade = calcularIdade(formData.dataNascimento);
      const dadosAtualizados = { ...formData, idade };

      await updateDependente(selectedId, dadosAtualizados, avatarSelecionado);
      setShowEditConfirm(true);
    } catch (err) {
      console.error("Erro ao alterar dependente:", err);
    }
  };

  const handleRemove = () => {
    if (!selectedId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const { token } = getUserData() || {};
    if (!token) return;

    try {
      await deleteDependente(selectedId, token);
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

      <DependenteModals
        showEditConfirm={showEditConfirm}
        setShowEditConfirm={setShowEditConfirm}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default EditarDep;
