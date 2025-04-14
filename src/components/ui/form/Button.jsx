import React from "react";
import styles from "./button.module.css"

/**
 * Componente de botão
 * @param {Object} props
 * @param {string=} props.id Atributo "ID".
 * @param {string=} props.value Atributo "value".
 * @param {Object=} props.style Atributo "style".
 * @param {Object=} props.theme Tema de CSS module. É necessário que tenha uma classe "btn". Caso não especificado, um estilo fallback será utilizado.
 * @param {string=} props.href Link para direcionamento
 * @param {React.ReactNode|string=} props.content Tags JSX ou string a ser posta dentro do componente.
 * @return {React.ReactNode} Componente de botão
 */
export default function Button({ id = "btn", value, style, theme, href, content }) {
    const isInput = !content ? true : false;
    const isLink = href ? true : false;
    const attributes = {
        id: id,
        value: value,
        style: style,
        className: theme ? theme.btn : styles.btn,
    };

    return (
        isInput ? <input {... { ...attributes, type: "submit" }}></input> :
            isLink ? <a {...{ ...attributes, href: href }}>{content}</a> :
                <button {...{ ...attributes, role: "button", type: "submit" }}>{content}</button>
    );
}
