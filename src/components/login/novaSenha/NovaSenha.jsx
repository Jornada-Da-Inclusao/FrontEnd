import { useEffect, useState } from 'react';
import styles from './novaSenha.module.css';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import * as React from 'react';

function NovaSenha() {

  useEffect(() => {
    const canAccess = localStorage.getItem('canAccessNovaSenha');
    if (!canAccess) {
      navigate('/'); // bloqueia acesso direto
    }
  }, []);


  const [id, setId] = useState('2');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      debugger
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const dto = {
        token,
        senha
      };

      const response = await fetch('http://localhost:8080/usuarios/atualizar-parcial', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      });


      if (response.status === 200) {
        localStorage.removeItem('canAccessVerifyToken');
        localStorage.removeItem('canAccessNovaSenha');

        setSuccess('Senha atualizada com sucesso!');
        setTimeout(() => {
          navigate('/'); // ou "/login"
        }, 2000);
      } else {
        setError('Erro ao atualizar senha.');
      }
    } catch (err) {
      setError('Falha ao atualizar senha. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h2>Nova Senha</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="senha">Nova Senha</label>
          <div className={styles.inputGroup}>
            <FaLock />
            <input
              type="password"
              name="senha"
              required
              placeholder="Digite a nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
          <div className={styles.inputGroup}>
            <FaLock />
            <input
              type="password"
              name="confirmarSenha"
              required
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          {success && <p style={{ color: 'green', fontSize: '0.9rem' }}>{success}</p>}

          <button type="submit" className={styles.btnLogin} disabled={isLoading}>
            {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
          </button>

          <div className={styles.links}>
            <a href="/">Voltar para login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaSenha;
