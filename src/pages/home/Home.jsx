import React from "react";

import Header from "@components/home/header/Header";
import Carousel from "@components/home/carousel/Carousel";
import Cards from "@components/home/card/Cards";
import Contact from "@components/home/contato/Contact";
import About from "@components/home/sobre/About";
import Footer from "@components/home/footer/Footer";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <Header />
      <Carousel />
      <h1>Confira os jogos da nossa plataforma</h1>
      <Cards />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
