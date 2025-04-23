import React from 'react';
import './PerfilCard.css';

const PerfilCard = ({ nome, imagem, onClick, adicionar }) => {
  return (
    <button
      className={`perfil ${adicionar ? 'adicionar' : ''}`}
      onClick={onClick}
      aria-label={`Selecionar ${nome}`}
    >
      <div className={`avatar ${adicionar ? 'plus' : ''}`}>
        {adicionar ? '+' : <img src={imagem} alt={nome} />}
      </div>
      <span>{nome}</span>
    </button>
  );
};

export default PerfilCard;
