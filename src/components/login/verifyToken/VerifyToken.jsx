import { useEffect, useState } from 'react';
import { Gettoken } from '../../../services/Service'; // Função GET que você já tem
import { useNavigate } from 'react-router-dom';
import styles from './verifyToken.module.css'; // Estilos personalizados
import * as React from 'react';

function VerifyToken() {

  useEffect(() => {
    const canAccess = localStorage.getItem('canAccessVerifyToken');
    if (!canAccess) {
      navigate('/'); // ou outra rota segura
    }
  }, []);
  
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await Gettoken(`http://localhost:8080/emailApi/token/${token}`);
      if (response.status === 200) {
        localStorage.setItem('canAccessNovaSenha', 'true');
        localStorage.setItem('token', token);
        setIsLoading(false);
        navigate('/novaSenha'); // Página para atualizar a senha, que você pode criar depois
      }
    } catch (error) {
      setIsLoading(false);
      setError('Token inválido ou expirado. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h1>Verificar Token</h1>
        <form onSubmit={handleTokenSubmit} className={styles.form}>
          <label htmlFor="token">Digite o token recebido por e-mail</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            placeholder="Token"
          />
          <button type="submit" className={styles.btnLogin}>
            {isLoading ? 'Verificando...' : 'Verificar Token'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <div className={styles.returnLink}>
          <p>
            <a href="/login">Voltar ao Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyToken;
