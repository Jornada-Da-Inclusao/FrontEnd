<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JogoVogais from "./pages/JogoVogais/JogoVogais";
import Teste from "./pages/teste/Teste";


export default function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Home />}></Route> */}
            <Route path="/jogoVogais" element={<JogoVogais />}></Route>
            <Route path="/teste" element={<Teste />}></Route>
        </Routes>
        </BrowserRouter>
    )
}
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home.jsx';
import JogoCores from './pages/jogoCores.jsx';
import JogoNumeros from './pages/jogoNumeros.jsx';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jogo-numeros" element={<JogoNumeros />} />
            <Route path="/jogo-cores" element={<JogoCores />} />
        </Routes>
    </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
>>>>>>> jogocores
