import React, { useState, useEffect, useMemo } from "react";
import styles from "../editar/editarCadDep.module.css";
import { icons } from "../icons";
import { calcularIdade } from "../calcularIdade";
import { DependenteService } from "../../../services/dependente.service";
import DependenteModals from "../../../components/Modal-custom-alert/DependenteModal";

// ---------------- helpers ----------------
const getDateLimits = () => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();

  return {
    min: new Date(anoAtual - 10, hoje.getMonth(), hoje.getDate()),
    max: new Date(anoAtual - 3, hoje.getMonth(), hoje.getDate()),
  };
};

const formatarData = (data) => data.toISOString().split("T")[0];

const initialForm = {
  nome: "",
  dataNascimento: "",
  sexo: "",
  avatar: "",
};

// ---------------- component ----------------
const EditarDep = () => {
  const [form, setForm] = useState(initialForm);
  const [dependentes, setDependentes] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { min, max } = useMemo(() => getDateLimits(), []);

  // ---------------- load dependentes ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await DependenteService.buscarPorUsuario(
          JSON.parse(localStorage.getItem("usuario"))?.id,
        );

        setDependentes(data || []);
      } catch (err) {
        console.error("Erro ao buscar dependentes:", err);
      }
    };

    load();
  }, []);

  // ---------------- helpers ----------------
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setForm(initialForm);

  const getSelectedDependente = () =>
    dependentes.find((dep) => dep.id === selectedId);

  // ---------------- select dependente ----------------
  const handleSelect = (e) => {
    const id = Number(e.target.value);
    setSelectedId(id);

    const dep = dependentes.find((d) => d.id === id);

    if (!dep) return;

    setForm({
      nome: dep.nome || "",
      dataNascimento: dep.dataNascimento || "",
      sexo: dep.sexo || "",
      avatar: dep.foto || "",
    });
  };

  // ---------------- update ----------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedId) return;

    const payload = {
      nome: form.nome,
      idade: calcularIdade(form.dataNascimento),
      sexo: form.sexo,
      foto: form.avatar,
    };

    try {
      await DependenteService.atualizar(selectedId, payload);
      setShowEditConfirm(true);
    } catch (err) {
      console.error("Erro ao alterar dependente:", err);
    }
  };

  // ---------------- delete ----------------
  const handleDelete = () => {
    if (!selectedId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await DependenteService.deletar(selectedId);

      setDependentes((prev) => prev.filter((d) => d.id !== selectedId));

      setSelectedId("");
      resetForm();
    } catch (err) {
      console.error("Erro ao remover dependente:", err);
    }
  };

  // ---------------- render ----------------
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Alterar dados das crianças</h2>

        <select value={selectedId} onChange={handleSelect}>
          <option value="" disabled>
            -- Qual criança? --
          </option>

          {dependentes.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.nome}
            </option>
          ))}
        </select>

        <h3>Trocar o avatar:</h3>

        <div className={styles.figures}>
          {icons.map((icon, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChange("avatar", icon)}
            >
              <img
                src={icon}
                alt={`Avatar ${index}`}
                className={form.avatar === icon ? styles.avatarSelecionado : ""}
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleUpdate}>
          <label>Nome da Criança:</label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />

          <label>Data de nascimento:</label>
          <input
            type="date"
            value={form.dataNascimento}
            min={formatarData(min)}
            max={formatarData(max)}
            onChange={(e) => handleChange("dataNascimento", e.target.value)}
          />

          <label>Sexo:</label>
          <select
            value={form.sexo}
            onChange={(e) => handleChange("sexo", e.target.value)}
          >
            <option value="" disabled>
              --- escolha ---
            </option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          <button type="submit">Alterar dados</button>
        </form>

        <button onClick={handleDelete}>Remover dependente</button>
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
