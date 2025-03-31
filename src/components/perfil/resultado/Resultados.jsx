import React, { useState, useEffect } from "react";
import styles1 from "../resultado/Resultados.module.css"; // Importando os estilos
import styles2 from "../sidebar/Sidebar.module.css";  // Certifique-se de que o CSS está correto


const Resultados = () => {
    const [nameFilter, setNameFilter] = useState("");
    const [gameFilter, setGameFilter] = useState("diagnostico");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

    const resultados = [
        { nome: "João", fase: "diagnostico", jogo: "Jogo da Memória", acertos: 8, erros: 2, data: "15/03/2025 10:00" },
        { nome: "Maria", fase: "nivel1", jogo: "Jogo das Letras", acertos: 7, erros: 3, data: "16/03/2025 11:00" },
        { nome: "João", fase: "nivel2", jogo: "Jogo dos Números", acertos: 9, erros: 1, data: "17/03/2025 12:00" },
        { nome: "Maria", fase: "nivel3", jogo: "Jogo das Cores", acertos: 10, erros: 0, data: "18/03/2025 13:00" }
    ];

    useEffect(() => {
        const filtrados = resultados.filter(crianca =>
            (nameFilter === "" || crianca.nome === nameFilter) && crianca.fase === gameFilter
        );
        setResultadosFiltrados(filtrados);
    }, [nameFilter, gameFilter]);

    return (
        <div className={styles1.container}>
            <aside className={styles1.sidebar}>
                <nav className={styles2.menu}>
                    <h2>Menu</h2>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/resultados">Resultados</a></li>
                    </ul>
                </nav>
            </aside>

            <main className={styles2.content}>
                <header>
                    <h1>Resultados dos Jogos</h1>
                    <p>Acompanhe o desempenho das crianças nos jogos educativos.</p>
                </header>

                <section className={styles1.filter}>
                    <label>Filtrar por nome:</label>
                    <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="João">João</option>
                        <option value="Maria">Maria</option>
                    </select>

                    <label>Filtrar por nível de jogo:</label>
                    <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
                        <option value="diagnostico">Diagnóstico</option>
                        <option value="nivel1">Nível 1</option>
                        <option value="nivel2">Nível 2</option>
                        <option value="nivel3">Nível 3</option>
                    </select>
                </section>

                <section className={styles1.textContent}>
                    {resultadosFiltrados.map((crianca, index) => (
                        <div key={index}>
                            <h2>Resultados de {crianca.nome}</h2>
                            <table>
                                <thead>
                                    <tr><th>Jogo</th><th>Acertos</th><th>Erros</th><th>Data</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{crianca.jogo}</td>
                                        <td>{crianca.acertos}</td>
                                        <td>{crianca.erros}</td>
                                        <td>{crianca.data}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Resultados;
