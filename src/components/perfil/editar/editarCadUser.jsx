import { useState } from 'react';
import styles from "../editar/editarCadUser.module.css";
import { atualizarUsuario, deletarUsuario } from '../../../services/UsuarioService';

const EditarUsuario = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const token = localStorage.getItem('token');
    const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        if (formData.senha && formData.senha !== formData.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        e.preventDefault();

        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        if (formData.senha && formData.senha !== formData.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        const dataToSend = {id: usuarioData?.id};
        if (formData.nome) dataToSend.nome = formData.nome;
        if (formData.email) dataToSend.email = formData.email;
        if (formData.senha) dataToSend.senha = formData.senha;

        try {
            const result = await atualizarUsuario(dataToSend, token);
            console.log('Usuário atualizado com sucesso:', result);
            alert("Dados atualizados com sucesso!");
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert("Erro ao atualizar usuário");
        }
    };


    const handleDelete = async () => {
        if (!usuarioData?.id || !token) {
            console.error("Dados do usuário ou token ausentes");
            return;
        }

        const confirmar = window.confirm("Tem certeza que deseja excluir sua conta?");
        if (!confirmar) return;

        try {
            const result = await deletarUsuario(usuarioData.id, token);
            console.log('Usuário deletado com sucesso:', result);
            alert("Conta excluída com sucesso!");
            // Aqui você pode redirecionar ou limpar o localStorage
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            alert("Erro ao deletar usuário");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <form onSubmit={handleSubmit}>
                    <h2>Editar dados do responsável</h2>
                    <label htmlFor="nome">Alterar nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Alterar E-mail:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="senha">Alterar senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                    />

                    <label htmlFor="confirmarSenha">Digite a nova senha novamente:</label>
                    <input
                        type="password"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                    />

                    <button type="submit">Alterar dados</button>
                </form>

                <button onClick={handleDelete}>Deletar Conta</button>
            </div>
        </div>
    );
};

export default EditarUsuario;
