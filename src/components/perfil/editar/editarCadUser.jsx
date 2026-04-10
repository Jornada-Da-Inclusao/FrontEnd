import { useState } from "react";
import styles from "../editar/editarCadUser.module.css";

import { UsuarioService } from "../../../services/usuario.service";
import UsuarioModals from "../../../components/Modal-custom-alert/UsuarioModal";

const EditarUsuario = () => {
  const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [formData, setFormData] = useState({
    nome: usuarioData.nome || "",
    email: usuarioData.email || "",
    senha: "",
    confirmarSenha: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
    };

    if (formData.senha) {
      payload.senha = formData.senha;
    }

    try {
      await UsuarioService.atualizar(usuarioData.id, payload);

      const updatedUser = {
        ...usuarioData,
        nome: payload.nome,
        email: payload.email,
      };

      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      setFormData((prev) => ({
        ...prev,
        senha: "",
        confirmarSenha: "",
      }));

      setShowConfirmModal(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar usuário");
    }
  };

  const confirmDelete = async () => {
    try {
      await UsuarioService.deletar(usuarioData.id);

      alert("Conta excluída com sucesso!");

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <h2>Editar dados do responsável</h2>

          <label>Alterar nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          <label>Alterar E-mail:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Alterar senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />

          <label>Digite a nova senha novamente:</label>
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
          />

          <button type="submit">Alterar dados</button>
        </form>

        <button onClick={() => setShowDeleteModal(true)}>Deletar Conta</button>
      </div>

      <UsuarioModals
        showConfirm={showConfirmModal}
        setShowConfirm={setShowConfirmModal}
        showDelete={showDeleteModal}
        setShowDelete={setShowDeleteModal}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default EditarUsuario;
