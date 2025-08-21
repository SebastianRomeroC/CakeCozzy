import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import "../style/Payment.css";

// Importar imágenes
import logo from "../img/logoCakecozzy.png";
import moneyImg from "../img/money.png";
import nequiImg from "../img/nequi.jpeg";
import daviImg from "../img/davi.jpeg";
import walletImg from "../img/wallet.png";
import qrImg from "../img/QR.jpeg";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [result, setResult] = useState("");
  const [total, setTotal] = useState(0); // <-- total del carrito

  // Cargar total del carrito desde localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const sumaTotal = items.reduce(
      (acc, item) => acc + (item.precio || 0) * (item.quantity || 1),
      0
    );
    setTotal(sumaTotal);
  }, []);

  // Simulación de sesión iniciada
  useEffect(() => {
    localStorage.setItem("userId", "123");
  }, []);

  const handleConfirm = () => {
    const userId = localStorage.getItem("userId") || null;

    if (!userId) {
      alert("Debes iniciar sesión para continuar.");
      return;
    }

    if (!selectedMethod) {
      alert("Por favor selecciona un método de pago.");
      return;
    }

    switch (selectedMethod) {
      case "efectivo": {
        const refCode = "REF-" + Math.floor(100000 + Math.random() * 900000);
        setResult(
          <div>
            <h3>Pago en efectivo</h3>
            <p>Total a pagar: <strong>$ {total.toLocaleString()}</strong></p>
            <p>Tu código de pago es: <strong>{refCode}</strong></p>
            <p>Entrégalo al repartidor.</p>
          </div>
        );
        break;
      }
      case "nequi":
        setResult(
          <div>
            <h3>Paga con Nequi</h3>
            <p>Total a pagar: <strong>$ {total.toLocaleString()}</strong></p>
            <p>Escanea el siguiente código QR para realizar tu pago:</p>
            <img src={qrImg} alt="QR Nequi" style={{ maxWidth: "200px" }} />
          </div>
        );
        break;
      case "daviplata":
        setResult(
          <div>
            <h3>Paga con Daviplata</h3>
            <p>Total a pagar: <strong>$ {total.toLocaleString()}</strong></p>
            <p>Escanea el siguiente código QR para realizar tu pago:</p>
            <img src={qrImg} alt="QR Daviplata" style={{ maxWidth: "200px" }} />
          </div>
        );
        break;
      case "pse":
        const dataphoneCode = Math.floor(100000 + Math.random() * 900000);
        setResult(
          <div>
            <h3>Paga con Datafono</h3>
            <p>Total a pagar: <strong>$ {total.toLocaleString()}</strong></p>
            <p>Ingresa este código en el datáfono:</p>
            <p><strong>{dataphoneCode}</strong></p>
          </div>
        );
        break;
      default:
        setResult("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="logo-name">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1>CAKECOZZY</h1>
        </div>
        <div className="header-buttons">
          <button className="btn-home" onClick={goHome}>Inicio</button>
          <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="welcome-message">
        <p>Selecciona tu método de pago favorito para continuar con tu pedido</p>
        <p><strong>Total a pagar: $ {total.toLocaleString()}</strong></p> {/* <-- mostrar total */}
      </div>

      <div className="payment-options">
        <div
          className={`payment-card ${selectedMethod === "efectivo" ? "selected" : ""}`}
          onClick={() => setSelectedMethod("efectivo")}
        >
          <img src={moneyImg} alt="Efectivo" />
          <span>Efectivo</span>
        </div>

        <div
          className={`payment-card ${selectedMethod === "nequi" ? "selected" : ""}`}
          onClick={() => setSelectedMethod("nequi")}
        >
          <img src={nequiImg} alt="Nequi" />
          <span>Nequi</span>
        </div>

        <div
          className={`payment-card ${selectedMethod === "daviplata" ? "selected" : ""}`}
          onClick={() => setSelectedMethod("daviplata")}
        >
          <img src={daviImg} alt="Daviplata" />
          <span>Daviplata</span>
        </div>

        <div
          className={`payment-card ${selectedMethod === "pse" ? "selected" : ""}`}
          onClick={() => setSelectedMethod("pse")}
        >
          <img src={walletImg} alt="Pago con Datafono" />
          <span>Pago con Datafono</span>
        </div>
      </div>

      <button id="confirmBtn" className="google-btn" onClick={handleConfirm}>
        Confirmar pago
      </button>

      <div id="result">{result}</div>
    </div>
  );
};

export default Payment;
