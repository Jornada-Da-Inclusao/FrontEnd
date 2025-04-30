import { useState } from 'react';
import styles from "./editarCadUser.module.css";
import { Navigate } from 'react-router-dom';

const EditarUsuario = () => {
    const [formData, setFormData] = useState({
        nome: '',
        usuario: '',
        senha: '',
        confirmarSenha: ''
    });

    const token = localStorage.getItem('token');
    const usuarioData = JSON.parse(localStorage.getItem("usuario")); // Parse para obter o objeto

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {};

        // Verificar se os campos têm valor antes de enviar
        if (formData.nome) dataToSend.nome = formData.nome;
        if (formData.usuario) dataToSend.usuario = formData.usuario;
        if (formData.senha) dataToSend.senha = formData.senha;

        // Verificar se o token está presente antes de enviar a requisição
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        try {
            const response = await fetch('https://backend-9qjw.onrender.com/usuarios/atualizar-parcial', {
                method: "PATCH",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token, // Enviando o token no cabeçalho
                },
                body: JSON.stringify({
                  id: usuarioData.id,  // Adicionando o ID do usuário
                  ...dataToSend            // Espalhando os outros dados
                }),
              })
              

            if (response.ok) {
                const result = await response.json();
                console.log('Usuário atualizado com sucesso:', result);
                window.location.reload();
            } else {
                const error = await response.json();
                console.error('Erro ao atualizar usuário:', error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const handleDelete = async () => {
        if (!usuarioData || !usuarioData.id) {
            console.error('ID do usuário não encontrado');
            return;
        }

        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        try {
            const response = await fetch(`https://backend-9qjw.onrender.com/usuarios/${usuarioData.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Usuário deletado com sucesso:', result);
                Navigate("/");
            } else {
                const error = await response.json();
                console.error('Erro ao deletar usuário:', error);
            }
        } catch (error) {
            console.error('Erro na requisição de deleção:', error);
        }
    };

    return(
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
                    <label htmlFor="usuario">Alterar E-mail:</label>
                    <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
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
