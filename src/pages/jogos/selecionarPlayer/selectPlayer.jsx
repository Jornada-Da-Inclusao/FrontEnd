import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfilCard from '../../../components/selecionarPlayer/PerfilCard';
import { escolherDependenteComoPlayer, fetchDependentes } from '../../../services/dependenteService';
import style from './selectPlayer.module.css';

const SelectPlayer = () => {
  const [dependentes, setDependentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDependentes = async () => {
      try {
        const resultado = await fetchDependentes();
        setDependentes(resultado);
      } catch (error) {
        console.error('Erro ao carregar dependentes:', error);
      }
    };

    carregarDependentes();
  }, []);

  const selecionarPerfil = (dependente) => {
    escolherDependenteComoPlayer(dependente);
    window.location.href = "/jogo";
  };

  const adicionarPerfil = () => {
    alert('Vamos criar um novo perfil!');
    navigate('/perfil/cadastrar-dependente');
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
            />
          ))}
          <PerfilCard nome="Adicionar" onClick={adicionarPerfil} adicionar />
        </div>
      </div>
    </div>
  );
};

export default SelectPlayer;
