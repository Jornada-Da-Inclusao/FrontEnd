import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cadastro.module.css";
import React from "react";
import { CustomModal } from "../../components/Modal-custom-alert/CustomModal.jsx";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../assets/images/LOGO.png";
import { UsuarioService } from "@/services/usuario.service.js";

function Cadastro() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: "",
    usuario: "",
    senha: "",
  });

  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [modalInvalido, setModalInvalido] = useState(false);

  function atualizarEstado(e) {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function cadastrarNovoUsuario(e) {
    e.preventDefault();

    const senhaValida =
      usuario.senha.length >= 8 && usuario.senha === confirmaSenha;

    if (!senhaValida) {
      setModalInvalido(true);
      setUsuario((prev) => ({ ...prev, senha: "" }));
      setConfirmaSenha("");
      return;
    }

    try {
      setLoading(true);

      await UsuarioService.cadastrar(usuario);

      setModalSucesso(true);

      setUsuario({
        nome: "",
        usuario: "",
        senha: "",
      });
      setConfirmaSenha("");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setModalErro(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.containerGeral}>
        <div className={styles.imgContainer}></div>

        <div className={styles.formArea}>
          <img src={logo} alt="Logo Integra Kids" className={styles.logo} />

          <p className={styles.boasVindas}>Bem-vindo!</p>
          <p className={styles.instrucao}>Crie sua conta para continuar.</p>

          <form onSubmit={cadastrarNovoUsuario} className={styles.formCad}>
            <label>Nome do Pai/Responsável</label>
            <input
              type="text"
              name="nome"
              value={usuario.nome}
              onChange={atualizarEstado}
            />

            <label>E-mail</label>
            <input
              type="email"
              name="usuario"
              value={usuario.usuario}
              onChange={atualizarEstado}
            />

            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={usuario.senha}
              onChange={atualizarEstado}
            />

            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.botaoLogin}
            >
              {loading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                "Cadastrar"
              )}
            </button>

            <p className={styles.cadlinks}>
              <a href="/login">Já tem conta? Faça login</a>
            </p>

            <p className={styles.cadlinks}>
              <a href="/">Voltar para Home</a>
            </p>
          </form>
        </div>
      </div>

      <CustomModal
        show={modalSucesso}
        onClose={() => {
          setModalSucesso(false);
          navigate("/login");
        }}
        title="Sucesso!"
        message="Usuário cadastrado com sucesso!"
        icon="✔️"
        color="#4caf50"
        doneButton={{ label: "OK", onClick: () => navigate("/login") }}
      />

      <CustomModal
        show={modalErro}
        onClose={() => setModalErro(false)}
        title="Erro!"
        message="Erro ao cadastrar o usuário. Tente novamente."
        icon="❌"
        color="#f44336"
        doneButton={{ label: "Fechar" }}
      />

      <CustomModal
        show={modalInvalido}
        onClose={() => setModalInvalido(false)}
        title="Dados Inválidos"
        message="A senha precisa ter ao menos 8 caracteres e coincidir com a confirmação."
        icon="⚠️"
        color="#ff9800"
        doneButton={{ label: "Entendi" }}
      />
    </>
  );
}

export default Cadastro;
