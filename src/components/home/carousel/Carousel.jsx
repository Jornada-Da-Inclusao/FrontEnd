import React, { useEffect, useState } from 'react';
import styles from './carousel.module.css';

import img1 from '../../../assets/images/img1.jpg';
import img2 from '../../../assets/images/img2.jpg';
import img3 from '../../../assets/images/img3.jpg';
import img4 from '../../../assets/images/img4.jpg';
import img5 from '../../../assets/images/img5.jpg';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Troca a imagem a cada 3 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  // TODO: Turn this into an accessible carousel according to W3 guidelines
  // (https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
  return (
    <div className={styles.carouselSection} id="pagina-principal">
      <input type="radio" name="carousel" id="item-1" className={styles.item1} checked={currentIndex === 0} readOnly />
      <input type="radio" name="carousel" id="item-2" className={styles.item2} checked={currentIndex === 1} readOnly />
      <input type="radio" name="carousel" id="item-3" className={styles.item3} checked={currentIndex === 2} readOnly />
      <input type="radio" name="carousel" id="item-4" className={styles.item4} checked={currentIndex === 3} readOnly />
      <input type="radio" name="carousel" id="item-5" className={styles.item5} checked={currentIndex === 4} readOnly />


      <div className={styles.carouselInner}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${index === currentIndex ? styles.active : ''}`}
          >
            <img src={img} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <label htmlFor="item-1"></label>
        <label htmlFor="item-2"></label>
        <label htmlFor="item-3"></label>
        <label htmlFor="item-4"></label>
        <label htmlFor="item-5"></label>
      </div>
    </div>
  );
};

export default Carousel;
