import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CadastroForm from "./components/CadastroForm";
import Resultados from "./components/Resultados";

const AppRoutes = () => {
    return (
        <Router>
            <div className="container">
                <Sidebar />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<CadastroForm />} />
                        <Route path="/resultados" element={<Resultados />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default AppRoutes;
