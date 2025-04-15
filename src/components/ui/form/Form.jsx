import React from "react";
import styles from "./Form.module.css"

/**
 * Componente de campo de submissão
 * @param {Object} props
 * @param {Object=} props.attributes Atributos de elementos HTML.
 * @return {React.ReactNode} Componente de campo de submissão
 */
export function Input({ attributes = {} }) {
    // Se input for do tipo "submit". Use o componente Button
    if (Object.entries(attributes).includes(["type", "submit"])) {
        console.log("Campo inclui 'type: \"submit\"'. Considere usar o componente Button");
    }

    // Se campo "className" não existir
    if (attributes.className === undefined) {
        attributes.className = styles.input;
    }

    return (
        <input {...attributes}></input>
    );
}

/**
 * Componente de botão
 * @param {Object} props
 * @param {Object=} props.attributes Atributos de elementos HTML.
 * @param {React.ReactNode|string=} props.children Elementos JSX ou string a ser posta dentro do componente.
 * @return {React.ReactNode} Componente de botão
 */
export function Button({ attributes = {}, children }) {
    // Se campo "className" não existir
    if (attributes.className === undefined) {
        attributes.className = styles.btn;
    }

    const isInput = !children ? true : false;
    const isLink = Object.keys(attributes).includes("href");

    return (
        isInput ? <input {... { ...attributes, type: "submit" }}></input> :
            isLink ? <a {...{ ...attributes }}>{children}</a> :
                <button {...{ ...attributes, role: "button", type: "submit" }}>{children}</button>
    );
}

/**
 * Componente de campo de submissão com label
 * @param {Object} props
 * @param {Object=} props.attributes Atributos de elementos HTML.
 * @param {string} props.id ID dos elementos
 * @return {React.ReactNode} Componente de campo de submissão com label
 */
export function LabeledInput({ attributes = {}, id = attributes.id }) {
    // Se campo "className" não existir
    if (attributes.className === undefined) {
        attributes.className = styles.input;
    }

    return (
        <>
            <label htmlFor={id}>
                <Input attributes={{ ...attributes, id: id }}></Input>
            </label>
        </>
    );
}

// TODO: Documentar de forma mais clara como entrar dados em componente Form

/**
 * Dados formatados em JSON para consumo de componentes de formulários
 * @typedef FormDataJSON
 * @property {string} type Tipo de componente a ser utilizado: "button" ou "field".
 * @property {Object} attributes Campos correspondentes a atributos de elementos HTML. Campos de submissão devem
 * conter, no mínimo, um ID.
 * @property {React.ReactNode|string=} children Elementos JSX ou string a ser posta dentro do componente.
 */

/**
 * Componente de formulário
 * @param {Object} props
 * @param {Object} props.attributes Atributos de elementos HTML para o formulário.
 * @param {FormDataJSON[]} props.data Dados em formato JSON para cada componente do formulário (campos e botão).
 * @return {React.ReactNode} Componente de formulário
 */
export function Form({ attributes = {}, data }) {
    if (data === undefined || data.length === 0) {
        throw Error("Array de dados não pode ser vazio");
    }

    /**
     * @param {Object} props
     * @param {Object=} props.attributes
     * @param {React.ReactNode|string=} props.children
     * @return {React.ReactNode}
     */
    const Form = ({ attributes = {}, children }) => {
        // Se campo "className" não existir
        if (attributes.className === undefined) {
            attributes.className = styles.form;
        }

        return (
            <form {...attributes}>
                {children}
            </form>
        )
    }

    return (
        <>
            <Form attributes={{ ...attributes }}>
                {data.map((element) => {
                    if (element.type === "button") {
                        return (
                            <Button {...element}>{element.children}</Button>
                        );
                    } else if (element.type === "field") {
                        return (
                            <LabeledInput id={element.attributes.id} {...element}></LabeledInput>
                        );
                    } else {
                        throw Error(`Campo desconhecido: ${element.type}`);
                    }
                })}
            </Form>
        </>
    );
}
