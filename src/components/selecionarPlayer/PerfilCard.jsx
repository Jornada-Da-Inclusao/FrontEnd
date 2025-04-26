import React from 'react';
import './PerfilCard.css';

const PerfilCard = ({ nome, imagem, onClick, adicionar, ativo }) => {
  return (
    <button
      className={`perfil ${adicionar ? 'adicionar' : ''} ${ativo ? 'ativo' : ''}`}
      onClick={onClick}
      aria-label={`Selecionar ${nome}`}
    >
      <div className={`avatar ${adicionar ? 'plus' : ''}`}>
        {adicionar ? '+' : <img src={imagem} alt={nome} />}
      </div>
      <span>{nome}</span>
      {ativo && <span className="selecionado">Selecionado</span>} {/* Texto "Selecionado" */}
    </button>
  );
};

export default PerfilCard;
