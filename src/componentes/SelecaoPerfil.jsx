import React from 'react';
import PerfilCard from './PerfilCard';
import cria1 from '../assets/cria1.svg';
import cria2 from '../assets/cria2.svg';
import './SelecaoPerfil.css';

const SelecaoPerfil = () => {
  const selecionarPerfil = (nome) => {
    alert(`Perfil selecionado: ${nome}`);
    // window.location.href = "/jogo"; ← ou usar react-router
  };

  const adicionarPerfil = () => {
    alert('Vamos criar um novo perfil!');
    // abrir modal ou redirecionar
  };

  return (
    <div className="container">
      <h1>🎮 Quem irá jogar?</h1>
      <div className="perfis">
        <PerfilCard nome="Criança 1" imagem={cria1} onClick={() => selecionarPerfil("Criança 1")} />
        <PerfilCard nome="Criança 2" imagem={cria2} onClick={() => selecionarPerfil("Criança 2")} />
        <PerfilCard nome="Adicionar" onClick={adicionarPerfil} adicionar />
      </div>
    </div>
  );
};

export default SelecaoPerfil;
