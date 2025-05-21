import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home.jsx';
import Cadastro from './pages/cadastro/Cadastro.jsx';
import JogoCores from './pages/jogos/jogoCores/JogoCores.jsx';
import JogoMemoria from './pages/jogos/jogoMemoria/JogoMemoria.jsx';
import Login from './pages/login/Login.jsx';
import SendToken from './components/login/sendToken/sendToken';
import VerifyToken from './components/login/verifyToken/VerifyToken';
import NovaSenha from './components/login/novaSenha/NovaSenha';
import SelectPlayer from './pages/jogos/selecionarPlayer/selectPlayer.jsx';
import Perfil from './pages/perfil/perfil.jsx';
import FaceJogoVogais from './pages/jogos/faceJogoVogais/FaceJogoVogais.jsx';
import FaceJogoNumeros from './pages/jogos/jogoNumeros/JogoNumeros.jsx';
import { ExplicacaoCores, ExplicacaoMemoria, ExplicacaoNumeros, ExplicacaoVogais } from './components/explicacoes/Explicacoes.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { JogoProvider } from './contexts/JogoContext';

const App = () => (
  <Router>
    <AuthProvider>
      <JogoProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jogo-cores-exp" element={<ExplicacaoCores />} />
          <Route path="/jogo-memoria-exp" element={<ExplicacaoMemoria />} />
          <Route path="/jogo-numeros-exp" element={<ExplicacaoNumeros />} />
          <Route path="/jogo-vogais-exp" element={<ExplicacaoVogais />} />
          <Route path="/jogo-memoria" element={<JogoMemoria />} />
          <Route path="/jogo-numeros" element={<FaceJogoNumeros />} />
          <Route path="/jogo-vogais" element={<FaceJogoVogais />} />
          <Route path="/jogo-cores" element={<JogoCores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sendToken" element={<SendToken />} />
          <Route path="/verifyToken" element={<VerifyToken />} />
          <Route path="/novaSenha" element={<NovaSenha />} />
          <Route path="/perfil/*" element={<Perfil />} />
          <Route path="/selecionar-jogador" element={<SelectPlayer />} />
        </Routes>
      </JogoProvider>
    </AuthProvider>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
