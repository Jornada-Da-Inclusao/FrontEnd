import styles from './contact.module.css';
import React, { useState } from 'react';
import { CustomModal } from '../../Modal-custom-alert/CustomModal'; // ajuste o caminho conforme seu projeto

const Contact = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch('https://api.sheetmonkey.io/form/nRyPAqMh8R3SKUjhnNGymn', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setModalMessage('Mensagem enviada com sucesso!');
        setShowModal(true);
        event.target.reset();
      } else {
        const result = await response.json(); // Só chama se for erro
        setModalMessage(`Erro ao enviar a mensagem: ${result.error || 'Tente novamente mais tarde.'}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Erro:', error);
      setModalMessage('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
      setShowModal(true);
    }
  };


  return (
    <section className={styles.contactContainer} id="contato">
      <h2>Entre em Contato Conosco</h2>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <input type="text" id="name" name="Nome" placeholder="Seu nome" />
        <input type="email" id="email" name="E-mail" placeholder="Seu e-mail" />
        <textarea
          id="message"
          name="Mensagem"
          placeholder="Sua mensagem"
          rows="5"
          required
        ></textarea>
        <button type="submit" role="button" className="button">Enviar</button>
      </form>

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Contato"
        message={modalMessage}
        icon="📨"
        color="#4caf50"
        doneButton={{
          label: 'Fechar',
          onClick: () => setShowModal(false),
        }}
      />
    </section>
  );
};

export default Contact;
