import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PerfilCard from "../../../components/selecionarPlayer/PerfilCard";
import DependenteModals from "../../../components/Modal-custom-alert/DependenteModal";

import { DependenteService } from "../../../services/dependente.service";
import { playerStorage } from "../../../helper/playerStorage";

import style from "./selectPlayer.module.css";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";

const SelectPlayer = () => {
  const [dependentes, setDependentes] = useState([]);
  const [showAddPerfilModal, setShowAddPerfilModal] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        const usuarioId = UsuarioStorage.getId();

        const data = await DependenteService.buscarPorUsuario(usuarioId);
        setDependentes(data || []);

        const player = playerStorage.get();
        if (player?.id) {
          setPerfilSelecionado(player.id);
        }
      } catch (err) {
        console.error("Erro ao carregar dependentes:", err);
      }
    };

    carregar();
  }, []);

  const selecionarPerfil = useCallback(
    (dependente) => {
      playerStorage.set(dependente);
      setPerfilSelecionado(dependente.id);
      navigate(-1);
    },
    [navigate],
  );

  const abrirModal = useCallback(() => {
    setShowAddPerfilModal(true);
  }, []);

  const confirmarAdd = useCallback(() => {
    navigate("/perfil/cadastrar-dependente");
  }, [navigate]);

  const cancelarAdd = useCallback(() => {
    setShowAddPerfilModal(false);
  }, []);

  return (
    <div className={style.body}>
      <div className={style.container}>
        <h1>🎮 Quem irá jogar?</h1>

        <div className={style.perfis}>
          {dependentes.map((dep) => (
            <PerfilCard
              key={dep.id}
              nome={dep.nome}
              imagem={dep.foto}
              onClick={() => selecionarPerfil(dep)}
              ativo={dep.id === perfilSelecionado}
            />
          ))}

          <PerfilCard nome="Adicionar" onClick={abrirModal} adicionar />
        </div>
      </div>

      <DependenteModals
        showAddPerfilModal={showAddPerfilModal}
        setShowAddPerfilModal={setShowAddPerfilModal}
        onConfirmAddPerfil={confirmarAdd}
        onCancel={cancelarAdd}
      />
    </div>
  );
};

export default SelectPlayer;
