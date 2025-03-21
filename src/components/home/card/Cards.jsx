// import 
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Styles from '../../../assets/styles/cards.module.css'
import Card from './Card.jsx';
import { Link } from 'react-router-dom';
import { cardsData } from '../data.js';

const Cards = () => {
    const cards = cardsData.map(element =>
        <>
            <Link style={{ textDecoration: "none" }} key={element.id} to={element.explicacao}>
                <Card key={element.id} image={element.img} alt={element.alt} title={element.title} desc={element.desc} />
            </Link>
        </>
    );

    return (
        <div id='games-section' className={Styles.cardsContainer}>
            {cards}
        </div>
    );
};

export default Cards;