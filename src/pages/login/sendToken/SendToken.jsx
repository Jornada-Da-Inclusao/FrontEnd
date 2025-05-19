import { useState } from 'react';
import { Posttoken } from '../../../services/Service'; // Supondo que você tenha essa função no seu serviço de API
import { useNavigate } from 'react-router-dom';
import styles from './SendToken.module.css'; // Estilos personalizados
import * as React from 'react';

function SendToken() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {

      const response = await Posttoken(`https://backend-9qjw.onrender.com/emailApi/token/${email}`);
      if (response.status === 200) {
        setIsLoading(false);
        navigate('/verifyToken'); // Página que será criada abaixo
      }
    } catch (error) {
      setIsLoading(false);
      setError('Falha ao enviar o token. Verifique o e-mail e tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <h1>Recuperar Senha</h1>
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <label htmlFor="email">Digite seu e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemplo@dominio.com"
          />
          <button type="submit" className={styles.btnLogin}>
            {isLoading ? 'Enviando...' : 'Enviar Token'}
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

export default SendToken;
