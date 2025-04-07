import styles from './contact.module.css';
import React from 'react';

const Contact = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    try {
      fetch('https://api.sheetmonkey.io/form/8GgQTUFYCm3iY6P6Szkqj3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).then((result) => {
        if (result.ok) {
          alert('Mensagem enviada com sucesso!');
          event.target.reset();
        } else {
          console.error('Erro:', result.statusText);
          alert('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
        }
      });
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
    }
  };

  return (
    <section className={styles.contactContainer} id="contato">
      <h2>Entre em Contato Conosco</h2>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          name="Name"
          placeholder="Seu nome"
          required
        />

        <input
          type="email"
          id="email"
          name="Email"
          placeholder="Seu e-mail"
          required
        />

        <textarea
          id="message"
          name="Message"
          placeholder="Sua mensagem"
          rows="5"
          className="formfield -textarea"
          required
        ></textarea>

        <button type="submit" role='button' className='button'>Enviar</button>
      </form>
    </section>
  );
};

export default Contact;
