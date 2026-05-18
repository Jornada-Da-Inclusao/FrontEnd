import React from 'react';
import styles from './cards.module.css'

/**
 * @param {{
 *   image: string,
 *   alt: string,
 *   title: string,
 *   desc?: string,
 *   descNode?: React.ReactNode,
 * }} props
 */
export default function Card({ image, alt, title, desc, descNode }) {
  return (
    <div className={styles.cardComponent} id='lista-jogos'>
      <img className={styles.image} src={image} alt={alt} />
      <div className={styles.cardText}>
        <h3 className={styles.title}>{title}</h3>
        {descNode ? (
          descNode
        ) : (
          <p className={styles.description}>{desc}</p>
        )}
      </div>
    </div>
  );
};
