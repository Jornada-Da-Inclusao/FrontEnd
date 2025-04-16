import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
<<<<<<< HEAD
import UsuarioLogin from '../../models/UsuarioLogin';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import styles from './login.module.css'
import { RotatingLines } from 'react-loader-spinner';

function Login() {
  // Hook para navegar entre as páginas, usado para redirecionar o usuário após o login.
  const navigate = useNavigate();

  // Obtém o `usuario`, `handleLogin` (função para realizar o login), e `isLoading` (indicador de carregamento) do contexto de autenticação.
  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  // Estado para armazenar os dados de login do usuário, como e-mail e senha.
  const [usuarioLogin, setUsuarioLogin] = useState(
    UsuarioLogin // Inicializa o estado com um objeto vazio que segue a interface `UsuarioLogin`.
  );

  // Hook de efeito que redireciona o usuário para a página '/home' se o login for bem-sucedido e um token for retornado.
=======
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import styles from './login.module.css';
import { RotatingLines } from 'react-loader-spinner';

function Login() {
  const navigate = useNavigate();

  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  const [usuarioLogin, setUsuarioLogin] = useState({
    id: 0,
    nome: '',
    email: '',
    usuario: '',
    foto: '',
    senha: '',
    token: ''
  });

>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
  useEffect(() => {
    if (usuario && usuario.token !== "") {
      navigate('/home');
    }
  }, [usuario, navigate]);

<<<<<<< HEAD
  /**
    * Função que atualiza o estado `usuarioLogin` quando os campos do formulário mudam.
    * Cada alteração nos campos de entrada é armazenada no estado usando o `name` dos inputs para definir a chave.
    *
    * @param {import("react").ChangeEvent} e
    */
=======
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
  function atualizarEstado(e) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    });
  }

<<<<<<< HEAD
  /**
    * Função que é chamada ao submeter o formulário de login.
    * Previne o comportamento padrão do formulário (recarregar a página) e chama a função `handleLogin`.
    *
    * @param {import("react").ChangeEvent} e
    */
  function login(e) {
    e.preventDefault();
    handleLogin(usuarioLogin); // Chama a função de login com os dados do usuário.
=======
  function login(e) {
    e.preventDefault();
    handleLogin(usuarioLogin);
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
  }

  return (
    <>
      <div className={styles.bodyLogin}>
        <div className={styles.loginContainer}>
          <h1></h1>
          <form id="loginForm" onSubmit={login}>
            <div className={styles.fullBox}>
              <label htmlFor="usuario">E-mail</label>
              <input
<<<<<<< HEAD
                type="usuario"
=======
                type="text"
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
                id="usuario"
                name="usuario"
                placeholder="Digite seu e-mail"
                required
                value={usuarioLogin.usuario}
<<<<<<< HEAD
                onChange={(e) => atualizarEstado(e)}
=======
                onChange={atualizarEstado}
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
              />
            </div>
            <div className={styles.fullBox}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required
                value={usuarioLogin.senha}
<<<<<<< HEAD
                onChange={(e) => atualizarEstado(e)}
              />
            </div>
            <button className={styles.btnSubmit}
              type="submit" value="Entrar"
            >

              {isLoading ? <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              /> :
                <span>Entrar</span>
              }
            </button>
            <p>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
            <p><a href="/">Voltar Para Home</a></p>
          </form>
        </div>
      </div>
=======
                onChange={atualizarEstado}
              />
            </div>
            <button className={styles.btnSubmit} type="submit">
              {isLoading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                <span>Entrar</span>
              )}
            </button>
            <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
            <p><Link to="/">Voltar Para Home</Link></p>
          </form>
        </div>
      </div>

      {/* VLibras e widgets externos */}
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
      <div className="enabled">
        <div className="active" vw-access-button></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
<<<<<<< HEAD
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      </script>
      <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    </>
  )
}
export default Login
=======
        {`new window.VLibras.Widget('https://vlibras.gov.br/app');`}
      </script>
      <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    </>
  );
}

export default Login;
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
