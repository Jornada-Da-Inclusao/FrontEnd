import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfilCard from '../../../components/selecionarPlayer/PerfilCard';
import { escolherDependenteComoPlayer, fetchDependentes } from '../../../services/dependenteService';
import DependenteModals from '../../../components/Modal-custom-alert/DependenteModal';
import style from './selectPlayer.module.css';

const SelectPlayer = () => {
  const [dependentes, setDependentes] = useState([]);
  const [showAddPerfilModal, setShowAddPerfilModal] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDependentes = async () => {
      try {
        const resultado = await fetchDependentes();
        setDependentes(resultado);

        // Recupera ID do player salvo no sessionStorage (como string)
        const playerId = sessionStorage.getItem('player');
        if (playerId) {
          setPerfilSelecionado(playerId);
        }
      } catch (error) {
        console.error('Erro ao carregar dependentes:', error);
      }
    };

    carregarDependentes();
  }, []);

  const selecionarPerfil = (dependente) => {
    escolherDependenteComoPlayer(dependente);
    sessionStorage.setItem('player', String(dependente.id)); // garante string
    setPerfilSelecionado(String(dependente.id));
    navigate(-1);
  };

  const adicionarPerfil = () => {
    setShowAddPerfilModal(true);
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
              ativo={String(dep.id) === perfilSelecionado} // Comparação como string
            />
          ))}
          <PerfilCard nome="Adicionar" onClick={adicionarPerfil} adicionar />
        </div>
      </div>

      <DependenteModals
        showAddPerfilModal={showAddPerfilModal}
        setShowAddPerfilModal={setShowAddPerfilModal}
        onConfirmAddPerfil={confirmarAdicionarPerfil}
      />
    </div>
  );
};

export default SelectPlayer;
