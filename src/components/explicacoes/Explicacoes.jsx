import React from "react";
import { Link } from "react-router-dom";
import  Styles from "./explicacao.module.css";

export const ExplicacaoCores = () => {
  return (
    <>
      <div className={Styles.explicacaoBody}>
        <div className={Styles.containerExp}>
          <h2 className={Styles.headingExp}>Jogo dos Cores</h2>
          <p className={Styles.paragraphExp}>No Jogo das Cores, o objetivo é arrastar cada uma das cores para o container do animal correspondente.</p>
          <div className={Styles.choices}>
            <Link className={Styles.inlineButton} to="/jogo-cores">Ir ao Jogo</Link>
            <Link className={Styles.inlineButton} to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const ExplicacaoMemoria = () => {
  return (
    <>
      <div className={Styles.explicacaoBody}>
        <div className={Styles.containerExp}>
          <h2 className={Styles.headingExp}>Jogo da Memória</h2>
          <p className={Styles.paragraphExp}>No Jogo da Memória, as cartas começarão viradas de cabeça para baixo, esperando um clique para serem reveladas. Caso duas cartas iguais sejam selecionadas consecutivamente, elas serão tidas como reveladas, do contrário, elas voltarão a ficar ocultas. Seu objetivo é revelar todas as cartas.</p>
          <div className={Styles.choices}>
            <Link className={Styles.inlineButton} to="/jogo-memoria">Ir ao Jogo</Link>
            <Link className={Styles.inlineButton} to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const ExplicacaoNumeros = () => {
  return (
    <>
      <div className={Styles.explicacaoBody}>
        <div className={Styles.containerExp}>
          <h2 className={Styles.headingExp}>Jogo dos Números</h2>
          <p className={Styles.paragraphExp}>No Jogo dos Números, o objetivo é ordernar todos os números em sequência numérica ao arrastá-los para o container.</p>
          <div className={Styles.choices}>
            <Link className={Styles.inlineButton} to="/jogo-numeros">Ir ao Jogo</Link>
            <Link className={Styles.inlineButton} to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const ExplicacaoVogais = () => {
  return (
    <>
      <div className={Styles.explicacaoBody}>
        <div className={Styles.containerExp}>
          <h2 className={Styles.headingExp}>Jogo das Vogais</h2>
          <p className={Styles.paragraphExp}>No Jogo das Vogais, o objetivo é arrastar, dentre o alfabeto inteiro, apenas as letras vogais para o container.</p>
          <div className={Styles.choices}>
            <Link className={Styles.inlineButton} to="/jogo-vogais">Ir ao Jogo</Link>
            <Link className={Styles.inlineButton} to="/">Voltar</Link>
          </div>
        </div>
      </div>
    </>
  )
}

