import styles from "../editar/editarCadUser.module.css"

const EditarUsuario = () => {
    return(
        <div className={styles.container}>
            <div className={styles.content}>
                <form action="">
                    <h2>Editar dados do responsavel</h2>
                    <label htmlFor="nome">Alterar nome:</label>
                    <input type="text" />
                    <label htmlFor="email">Alterar E-mail:</label>
                    <input type="text" />
                    <label htmlFor="senha">Alterar senha:</label>
                    <input type="password" />
                    <button>Alterar dados</button>
                </form>
            </div>
        </div>
    )
}

export default EditarUsuario;