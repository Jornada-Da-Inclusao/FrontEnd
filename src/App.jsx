import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "@pages/home/Home";
import Cadastro from "@pages/cadastro/Cadastro";
import JogoCores from "@pages/jogos/jogoCores/JogoCores";
import JogoMemoria from "@pages/jogos/jogoMemoria/JogoMemoria";
import Login from "@pages/login/Login";
import FaceJogoVogais from "@pages/jogos/faceJogoVogais/FaceJogoVogais";
import FaceJogoNumeros from "@pages/jogos/jogoNumeros/JogoNumeros";
import { AuthProvider } from "@/contexts/AuthContext";
import { JogoProvider } from "@/contexts/JogoContext";
import {
  ExplicacaoCores,
  ExplicacaoMemoria,
  ExplicacaoNumeros,
  ExplicacaoVogais,
} from "@components/explicacoes/Explicacoes";
import { cardsData } from "@components/home/card/data"
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <JogoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/home" element={<Home />} />
            <Route path={cardsData.cores.explPath} element={<ExplicacaoCores />} />
            <Route path={cardsData.memoria.explPath} element={<ExplicacaoMemoria />} />
            <Route path={cardsData.numeros.explPath} element={<ExplicacaoNumeros />} />
            <Route path={cardsData.vogais.explPath} element={<ExplicacaoVogais />} />
            <Route path={cardsData.cores.jogoPath} element={<JogoCores />} />
            <Route path={cardsData.memoria.jogoPath} element={<JogoMemoria />} />
            <Route path={cardsData.numeros.jogoPath} element={<FaceJogoNumeros />} />
            <Route path={cardsData.vogais.jogoPath} element={<FaceJogoVogais />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </JogoProvider>
    </AuthProvider>
  );
}
