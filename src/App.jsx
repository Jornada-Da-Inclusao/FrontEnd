import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home.jsx';
import Cadastro from './pages/cadastro/Cadastro.jsx';
import Login from './pages/login/Login.jsx';
import SendToken from './components/login/sendToken/SendToken';
import VerifyToken from './components/login/verifyToken/VerifyToken';
import NovaSenha from './components/login/novaSenha/NovaSenha';
import Perfil from './pages/perfil/perfil.jsx';

// jogos logado
import SelectPlayer from './pages/jogosLogado/selecionarPlayer/selectPlayer.jsx';
import JogoCores from './pages/jogosLogado/jogoCores/JogoCores.jsx';
import JogoMemoria from './pages/jogosLogado/jogoMemoria/JogoMemoria.jsx';
import FaceJogoVogais from './pages/jogosLogado/faceJogoVogais/FaceJogoVogais.jsx';
import FaceJogoNumeros from './pages/jogosLogado/jogoNumeros/JogoNumeros.jsx';
import { ExplicacaoCores, ExplicacaoMemoria, ExplicacaoNumeros, ExplicacaoVogais } from './components/explicacoes/Explicacoes.jsx';

// jogos deslogado
import JogoCoresDeslogado from './pages/jogosDeslogado/jogoCoresDeslogado/JogoCoresDeslogado';
import JogoMemoriaDeslogado from './pages/jogosDeslogado/jogoMemoriaDeslogado/JogoMemoriaDeslogado';
import FaceJogoVogaisDeslogado from './pages/jogosDeslogado/faceJogoVogaisDeslogado/FaceJogoVogaisDeslogado';
import JogoNumerosDeslogado from './pages/jogosDeslogado/jogoNumerosDeslogado/JogoNumerosDeslogado';


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

          <Route path="/jogo-memoria-deslogado" element={<JogoMemoriaDeslogado />} />
          <Route path="/jogo-numeros-deslogado" element={<JogoNumerosDeslogado  />} />
          <Route path="/jogo-vogais-deslogado" element={<FaceJogoVogaisDeslogado  />} />
          <Route path="/jogo-cores-deslogado" element={<JogoCoresDeslogado  />} />

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
