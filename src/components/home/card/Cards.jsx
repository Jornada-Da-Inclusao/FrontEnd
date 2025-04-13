// BUG: Card text color is red
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import Card from "./Card.jsx";
import { cardsData } from "./data.js";
import styles from "./cards.module.css";

export default function Cards() {

  const cards = Object.values(cardsData).map((value) => (
    <>
      <Link
        style={{ textDecoration: "none" }}
        key={value.id}
        to={value.explPath}
      >
        <Card
          key={value.id}
          image={value.img}
          alt={value.alt}
          title={value.title}
          desc={value.desc}
        />
      </Link>
    </>
  ));

  return (
    <div id="games-section" className={styles.cardsContainer}>
      {cards}
    </div>
  );
}
