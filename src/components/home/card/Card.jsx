import React from 'react';
import Styles from '../../../assets/styles/cards.module.css'

export default function Card({ image, alt, title, desc }) {
  return (
    <div className={Styles.cardComponent} id='lista-jogos'>
      <img className={Styles.image} src={image} alt={alt} />
      <div className={Styles.cardText}>
        <h3 className={Styles.title}>{title}</h3>
        <p className={Styles.description}>{desc}</p>
      </div>
    </div>
  );
};
