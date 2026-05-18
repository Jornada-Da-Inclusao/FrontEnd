// import 
import React from 'react';
import styles from './cards.module.css'
import Card from './Card.jsx';
import { Link } from 'react-router-dom';
import { cardsData } from '../data.js';
import { TextWithAudio } from '../../TTS/TextWithAudio';
import { getAudioContent } from '../../../services/gcs-audio.service';

const Cards = () => {
    const cards = cardsData.map(element => {
        const textId = `explicacao_${element.name}`;
        const content = getAudioContent(textId);
        const descNode = content ? (
            <TextWithAudio text={content.text} audioUrl={content.audioUrl} textId={content.textId} />
        ) : null;

        return (
            <Link style={{ textDecoration: "none" }} key={element.id} to={element.explicacao}>
                <Card key={element.id} image={element.img} alt={element.alt} title={element.title} desc={element.desc} descNode={descNode} />
            </Link>
        );
    });

    return (
        <div id='games-section' className={styles.cardsContainer}>
            {cards}
        </div>
    );
};

export default Cards;
