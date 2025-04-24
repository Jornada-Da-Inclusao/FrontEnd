import { useState } from 'react';
import styles from "../editar/editarCadUser.module.css";
import { atualizarUsuario, deletarUsuario } from '../../../services/UsuarioService';
import UsuarioModals from '../../../components/Modal-custom-alert/UsuarioModal';

const EditarUsuario = () => {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', confirmarSenha: ''
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = localStorage.getItem('token');
  const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!token) return;

    const dataToSend = { id: usuarioData?.id };
    if (formData.nome) dataToSend.nome = formData.nome;
    if (formData.email) dataToSend.email = formData.email;
    if (formData.senha) dataToSend.senha = formData.senha;

    try {
      await atualizarUsuario(dataToSend, token);
      setShowConfirmModal(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário");
    }
  };

  const confirmDelete = async () => {
    try {
      await deletarUsuario(usuarioData.id, token);
      alert("Conta excluída com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar usuário");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <h2>Editar dados do responsável</h2>
          <label htmlFor="nome">Alterar nome:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

          <label htmlFor="email">Alterar E-mail:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} />

          <label htmlFor="senha">Alterar senha:</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />

          <label htmlFor="confirmarSenha">Digite a nova senha novamente:</label>
          <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />

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
