import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfilCard from '../../../components/selecionarPlayer/PerfilCard';
import { escolherDependenteComoPlayer, fetchDependentes } from '../../../services/dependenteService';
import DependenteModals from '../../../components/Modal-custom-alert/DependenteModal';
import style from './selectPlayer.module.css';

const SelectPlayer = () => {
  const [dependentes, setDependentes] = useState([]);
  const [showAddPerfilModal, setShowAddPerfilModal] = useState(false); // Controle do modal de adicionar
  const [perfilSelecionado, setPerfilSelecionado] = useState(null); // Estado para o perfil selecionado
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDependentes = async () => {
      try {
        const resultado = await fetchDependentes();
        setDependentes(resultado);

        // Verifica se já existe um player no sessionStorage e define o perfilSelecionado
        const player = sessionStorage.getItem('player');
        if (player) {
          setPerfilSelecionado(player);
        }
      } catch (error) {
        console.error('Erro ao carregar dependentes:', error);
      }
    };

    carregarDependentes();
  }, []);

  const selecionarPerfil = (dependente) => {
    escolherDependenteComoPlayer(dependente);
    sessionStorage.setItem('player', dependente.nome);
    setPerfilSelecionado(dependente.nome); // Atualiza o perfil selecionado no estado
    navigate(-1);
  };

  const adicionarPerfil = () => {
    setShowAddPerfilModal(true); // Exibe o modal para confirmar adição
  };

  const confirmarAdicionarPerfil = () => {
    navigate('/perfil/cadastrar-dependente');
  };

  const cancelarAdicionarPerfil = () => {
    setShowAddPerfilModal(false);
  };

  return (
    <div className={style.body}>
      <div className={style.container}>
        <h1>🎮 Quem irá jogar?</h1>
        <div className={style.perfis}>
          {dependentes.map((dep, index) => (
            <PerfilCard
              key={index}
              nome={dep.nome}
              imagem={dep.foto}
              onClick={() => selecionarPerfil(dep)}
              ativo={dep.nome === perfilSelecionado}
            />
          ))}
          <PerfilCard nome="Adicionar" onClick={adicionarPerfil} adicionar />
        </div>
      </div>

      {/* Modal para adicionar novo perfil */}
      <DependenteModals
        showAddPerfilModal={showAddPerfilModal}
        setShowAddPerfilModal={setShowAddPerfilModal}
        onConfirmAddPerfil={confirmarAdicionarPerfil}
      />
    </div>
  );
};

export default SelectPlayer;
