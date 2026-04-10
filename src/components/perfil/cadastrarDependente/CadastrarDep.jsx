import React, { useState, useMemo } from "react";
import styles from "../cadastrarDependente/cadastrarDep.module.css";
import { DependenteService } from "../../../services/dependente.service";
import { calcularIdade } from "../calcularIdade";
import DependenteModals from "../../../components/Modal-custom-alert/DependenteModal";
import { icons } from "../icons";

// ---------------- helpers ----------------
const getUsuarioId = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  return usuario?.id || null;
};

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
const CadastroForm = () => {
  const [form, setForm] = useState(initialForm);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { min, max } = useMemo(() => getDateLimits(), []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setForm(initialForm);

  const getPayload = (usuarioId) => ({
    nome: form.nome,
    idade: calcularIdade(form.dataNascimento),
    sexo: form.sexo,
    foto: form.avatar,
    usuario_id_fk: {
      id: usuarioId,
    },
  });

  const validate = () => {
    const usuarioId = getUsuarioId();

    return (
      form.nome && form.dataNascimento && form.sexo && form.avatar && usuarioId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setShowErrorModal(true);
      return;
    }

    const usuarioId = getUsuarioId();

    try {
      await DependenteService.cadastrar(getPayload(usuarioId));

      setShowConfirmModal(true);
      resetForm();
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Cadastrar crianças</h2>

        <h3>Escolha um avatar:</h3>

        <div className={styles.figures}>
          {icons.map((icon, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChange("avatar", icon)}
            >
              <img
                src={icon}
                className={form.avatar === icon ? styles.avatarSelecionado : ""}
                alt={`avatar ${index}`}
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nome da Criança:</label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />

          <label>Data de nascimento (3 a 10 anos):</label>
          <input
            type="date"
            min={formatarData(min)}
            max={formatarData(max)}
            value={form.dataNascimento}
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

          <button type="submit">Cadastrar</button>
        </form>
      </div>

      <DependenteModals
        showCreateConfirm={showConfirmModal}
        setShowCreateConfirm={setShowConfirmModal}
        showCreateError={showErrorModal}
        setShowCreateError={setShowErrorModal}
      />
    </div>
  );
};

export default CadastroForm;
