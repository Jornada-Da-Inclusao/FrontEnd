import React, { useState, useEffect } from "react";
import {
    BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer,
} from "recharts";
import styles from "./Resultados.module.css";

const Resultados = () => {
    const [nameFilter, setNameFilter] = useState("");
    const [viewMode, setViewMode] = useState("individual");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

    // 🧠 Dados com várias crianças e tempos simulados
    const resultados = [
        { nome: "João", fase: "diagnostico", jogo: "Jogo da Memória", acertos: 8, erros: 2 },
        { nome: "João", fase: "nivel2", jogo: "Jogo dos Números", acertos: 9, erros: 1 },
        { nome: "Maria", fase: "nivel1", jogo: "Jogo das Letras", acertos: 7, erros: 3 },
        { nome: "Maria", fase: "nivel3", jogo: "Jogo das Cores", acertos: 10, erros: 0 },
        { nome: "Lucas", fase: "diagnostico", jogo: "Jogo da Memória", acertos: 6, erros: 4 },
        { nome: "Ana", fase: "nivel2", jogo: "Jogo dos Números", acertos: 7, erros: 3 },
        { nome: "Carla", fase: "nivel3", jogo: "Jogo das Cores", acertos: 9, erros: 1 },
    ].map((item) => ({
        ...item,
        tempo: Math.floor(Math.random() * 270 + 30),
    }));

    useEffect(() => {
        if (viewMode === "geral") {
            // Agrupa resultados por jogo
            const agrupados = resultados.reduce((acc, curr) => {
                const key = curr.jogo;
                if (!acc[key]) {
                    acc[key] = {
                        jogo: curr.jogo,
                        acertos: 0,
                        erros: 0,
                        tempo: 0,
                    };
                }
                acc[key].acertos += curr.acertos;
                acc[key].erros += curr.erros;
                acc[key].tempo += curr.tempo;
                return acc;
            }, {});
            setResultadosFiltrados(Object.values(agrupados));
        } else {
            // Filtra por nome ou mostra todos
            const filtrados = resultados.filter((r) => nameFilter === "" || r.nome === nameFilter);
            setResultadosFiltrados(filtrados);
        }
    }, [nameFilter, viewMode]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Resultados dos Jogos</h2>
                <h3>Acompanhe o desempenho das crianças nos jogos educativos.</h3>

                <section className={styles.filter}>
                    <label>Modo de visualização:</label>
                    <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                        <option value="individual">Resultados por criança</option>
                        <option value="geral">Resultados gerais por jogo</option>
                    </select>

                    {viewMode === "individual" && (
                        <>
                            <label>Filtrar por nome:</label>
                            <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="João">João</option>
                                <option value="Maria">Maria</option>
                                <option value="Lucas">Lucas</option>
                                <option value="Ana">Ana</option>
                                <option value="Carla">Carla</option>
                            </select>
                        </>
                    )}
                </section>

                {resultadosFiltrados.length > 0 && (
                    <section className={styles.textContent}>
                        <div style={{ width: "100%", height: 400, marginTop: "2rem" }}>
                            <h3>Gráfico de desempenho</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={resultadosFiltrados}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={viewMode === "geral" ? "jogo" : "nome"} />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name, props) => {
                                            const jogo = props.payload?.jogo;
                                            const label = {
                                                acertos: "Acertos",
                                                erros: "Erros",
                                                tempo: "Tempo (s)",
                                            }[name] || name;

                                            return [`${value}`, `${label} (${jogo || "jogo desconhecido"})`];
                                        }}
                                    />

                                    <Legend />
                                    <Bar dataKey="acertos" fill="#4CAF50" name="Acertos" />
                                    <Bar dataKey="erros" fill="#F44336" name="Erros" />
                                    <Bar dataKey="tempo" fill="#2196F3" name="Tempo (s)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Resultados;
