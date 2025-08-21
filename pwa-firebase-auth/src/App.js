import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // <-- Aquí agregamos Navigate
import Login from "./components/Login";
import Home from "./components/Home";
import Payment from "./components/Payment";
import Cart from "./components/Cart";
import AuthForm from "./components/AuthForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./i18n";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal redirige a login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/*Pagos */}
        <Route path="/pago" element={<Payment />} />

        {/*Carrito */}
        <Route path="/carrito" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
