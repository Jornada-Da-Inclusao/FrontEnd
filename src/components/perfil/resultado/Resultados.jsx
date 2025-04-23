import React, { useState, useEffect } from "react";
import {
    BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer,
} from "recharts";
import styles from "./Resultados.module.css";

const Resultados = () => {
    const [nameFilter, setNameFilter] = useState("");
    const [viewMode, setViewMode] = useState("individual");
    const [resultados, setResultados] = useState([]);
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
    const [ids, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [jogosSelecionados, setJogosSelecionados] = useState([]); // isso já deve estar aí
    const [jogoSelecionado, setJogoSelecionado] = useState(""); // <-- adicione isso



    const handleSelectId = (e) => {
        const id = Number(e.target.value);
        setSelectedId(id);

        const dependente = ids.find((dep) => dep.id === id);
        if (dependente) {

            // 👇 Aqui populamos os jogos
            const jogosConvertidos = dependente.infoJogos.map((jogo) => ({
                jogo: jogo.infoJogos_id_fk.nome,
                acertos: jogo.acertos,
                erros: jogo.erros,
                tempo: parseFloat(jogo.tempoTotal.toFixed(2)),
                tentativas: jogo.tentativas,
            }));

            setJogosSelecionados(jogosConvertidos);
        }
    };


    useEffect(() => {
        if (!ids || ids.length === 0) return;

        if (viewMode === "jogos") {
            // Junta todos os infoJogos de todos os dependentes
            const todosJogos = ids.flatMap(dep =>
                dep.infoJogos.map(jogo => ({
                    jogo: jogo.infoJogos_id_fk.nome,
                    acertos: jogo.acertos,
                    erros: jogo.erros,
                    tempo: parseFloat(jogo.tempoTotal.toFixed(2)),
                }))
            );

            // Agrupa os dados por nome do jogo
            const agrupados = todosJogos.reduce((acc, curr) => {
                const key = curr.jogo;
                if (!acc[key]) {
                    acc[key] = { jogo: curr.jogo, acertos: 0, erros: 0, tempo: 0 };
                }
                acc[key].acertos += curr.acertos;
                acc[key].erros += curr.erros;
                acc[key].tempo += curr.tempo;
                return acc;
            }, {});

            setResultadosFiltrados(Object.values(agrupados));
        }
    }, [viewMode, ids]);

    const getUserData = () => {
        const usuarioData = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");
        if (!usuarioData || !token) {
            console.error("Usuário ou token não encontrado no localStorage.");
            return null;
        }
        return { usuario: JSON.parse(usuarioData), token };
    };


    useEffect(() => {
        const { usuario, token } = getUserData() || {};
        if (!usuario || !token) return;

        const fetchDependentes = async () => {
            try {
                const res = await fetch(
                    `https://backend-9qjw.onrender.com/dependente/getDependenteByIdUsuario/${usuario.id}`,
                    {
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
                const data = await res.json();
                console.log(data);

                setIds(data);

                // 🔁 Constrói os resultados dinamicamente com base em TODOS os dependentes e seus jogos
                const resultadosConvertidos = data.flatMap((dependente) => {
                    return (dependente.infoJogos || []).map((jogo) => ({
                        nome: dependente.nome,
                        jogo: jogo.infoJogos_id_fk?.nome || "Jogo Desconhecido",
                        fase: jogo.infoJogos_id_fk?.dificuldade || "Não informada",
                        acertos: jogo.acertos,
                        erros: jogo.erros,
                        tempo: jogo.tempoTotal,
                        tentativas: jogo.tentativas,
                    }));
                });

                setResultados(resultadosConvertidos);

            } catch (err) {
                console.error("Erro ao buscar IDs:", err);
            }
        };

        fetchDependentes();
    }, []);

    useEffect(() => {
        if (viewMode === "geral") {
            const agrupados = resultados.reduce((acc, curr) => {
                const key = curr.jogo;
                if (!acc[key]) {
                    acc[key] = {
                        jogo: curr.jogo,
                        acertos: 0,
                        erros: 0,
                        tempo: 0,
                        tentativas: 0,
                    };
                }
                acc[key].acertos += curr.acertos;
                acc[key].erros += curr.erros;
                acc[key].tempo += curr.tempo;
                acc[key].tentativas += curr.tentativas;
                return acc;
            }, {});
            setResultadosFiltrados(Object.values(agrupados));
        } else {
            const dependenteSelecionado = ids.find((crianca) => crianca.id === selectedId);
            const nomeSelecionado = dependenteSelecionado?.nome;

            const filtrados = resultados.filter((r) =>
                selectedId === null ? true : r.nome === nomeSelecionado
            );
            setResultadosFiltrados(filtrados);
        }
    }, [selectedId, viewMode, resultados, ids]);



    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Resultados dos Jogos</h2>
                <h3>Acompanhe o desempenho das crianças nos jogos educativos.</h3>

                <section className={styles.filter}>

                    {jogosSelecionados.length > 0 && (
                        <>
                            <label>Filtrar por jogo:</label>
                            <select
                                value={jogoSelecionado}
                                onChange={(e) => setJogoSelecionado(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {Array.from(new Set(jogosSelecionados.map((j) => j.jogo))).map((nomeJogo) => (
                                    <option key={nomeJogo} value={nomeJogo}>
                                        {nomeJogo}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}


                    <select id="idSelect" value={selectedId ?? ""} onChange={handleSelectId}>
                        <option value="" disabled>-- Escolha uma criança --</option>
                        {ids.map((crianca) => (
                            <option key={crianca.id} value={crianca.id}>
                                {crianca.nome}
                            </option>
                        ))}
                    </select>
                </section>

                {jogosSelecionados.length > 0 && (
                    <section className={styles.textContent}>
                        <div style={{ width: "100%", height: 400, marginTop: "2rem" }}>
                            <h3>Resultados dos Jogos</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={
                                        jogoSelecionado
                                            ? jogosSelecionados.filter((j) => j.jogo === jogoSelecionado)
                                            : jogosSelecionados
                                    }
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="jogo" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="acertos" fill="#4CAF50" name="Acertos" />
                                    <Bar dataKey="erros" fill="#F44336" name="Erros" />
                                    <Bar dataKey="tempo" fill="#2196F3" name="Tempo (s)" />
                                    <Bar dataKey="tentativas" fill="#9C27B0" name="tentativas" />
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
