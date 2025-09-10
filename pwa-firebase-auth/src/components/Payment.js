// src/components/Payment.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../firebase";
import mapboxgl from "mapbox-gl";
import "../style/Payment.css";

import logo from "../img/logoCakecozzy.png";
import moneyImg from "../img/money.png";
import nequiImg from "../img/nequi.jpeg";
import daviImg from "../img/davi.jpeg";
import walletImg from "../img/wallet.png";
import qrImg from "../img/QR.jpeg";

const API_BASE = process.env.REACT_APP_API_BASE;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [coords, setCoords] = useState(null);

  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [result, setResult] = useState("");

  // Cargar la orden
  useEffect(() => {
    if (!orderId) return;
    fetch(`${API_BASE}/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error("Error cargando la orden:", err));
  }, [orderId]);

  // Inicializar mapa
  useEffect(() => {
    if (!order || !mapContainerRef.current) return;

    const initialCoords = order.location?.coordinates || [-74.08175, 4.60971];

    const initMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCoords,
      zoom: 14,
    });

    // Marker draggable
    const newMarker = new mapboxgl.Marker({ draggable: true, color: "#ff4081" })
      .setLngLat(initialCoords)
      .addTo(initMap);

    setMarker(newMarker);
    setCoords({ lng: initialCoords[0], lat: initialCoords[1] });

    // Actualizar coords mientras arrastras
    newMarker.on("drag", () => {
      const lngLat = newMarker.getLngLat();
      setCoords({ lng: lngLat.lng, lat: lngLat.lat });
    });

    // Click en mapa mueve marker
    initMap.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      newMarker.setLngLat([lng, lat]);
      setCoords({ lng, lat });
    });

    setMap(initMap);
    return () => initMap.remove();
  }, [order]);

  const handleConfirm = async () => {
    if (!selectedMethod) return alert("Selecciona un método de pago");
    if (!coords) return alert("Selecciona la ubicación en el mapa");

    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metodoPago: selectedMethod,
          location: { coordinates: [coords.lng, coords.lat] },
        }),
      });

      if (!res.ok) throw new Error("Error actualizando la orden");
      const updatedOrder = await res.json();
      setOrder(updatedOrder);

      const totalFormatted = updatedOrder.total.toLocaleString();
      switch (selectedMethod) {
        case "efectivo":
          const refCode = "REF-" + Math.floor(100000 + Math.random() * 900000);
          setResult(
            <div>
              <h3>Pago en efectivo</h3>
              <p>Total a pagar: <strong>$ {totalFormatted}</strong></p>
              <p>Código de pago: <strong>{refCode}</strong></p>
              <p>Entrégalo al repartidor en {updatedOrder.direccion}</p>
            </div>
          );
          break;
        case "nequi":
        case "daviplata":
          setResult(
            <div>
              <h3>Pago con {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}</h3>
              <p>Total a pagar: <strong>$ {totalFormatted}</strong></p>
              <p>Dirección: <strong>{updatedOrder.direccion}</strong></p>
              <img src={qrImg} alt={`QR ${selectedMethod}`} style={{ maxWidth: "200px" }} />
            </div>
          );
          break;
        case "pse":
          const code = Math.floor(100000 + Math.random() * 900000);
          setResult(
            <div>
              <h3>Pago con Datáfono</h3>
              <p>Total a pagar: <strong>$ {totalFormatted}</strong></p>
              <p>Dirección: <strong>{updatedOrder.direccion}</strong></p>
              <p>Ingresa este código en el datáfono: <strong>{code}</strong></p>
            </div>
          );
          break;
        default:
          setResult("");
      }
    } catch (err) {
      console.error(err);
      alert("Error procesando la orden");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const goHome = () => navigate("/home");

  if (!order) return <p>Cargando orden...</p>;

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
        <p>Total a pagar: <strong>$ {order.total.toLocaleString()}</strong></p>
        <p>Selecciona tu método de pago y confirma tu ubicación en el mapa</p>
      </div>

      <div className="map-container">
        <div className="map-coords">
          {coords ? `Lng: ${coords.lng.toFixed(5)}, Lat: ${coords.lat.toFixed(5)}` : "Selecciona tu ubicación"}
        </div>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }}></div>
      </div>

      <div className="payment-options">
        {["efectivo","nequi","daviplata","pse"].map((method) => {
          const imgMap = { efectivo: moneyImg, nequi: nequiImg, daviplata: daviImg, pse: walletImg };
          return (
            <div
              key={method}
              className={`payment-card ${selectedMethod === method ? "selected" : ""}`}
              onClick={() => setSelectedMethod(method)}
            >
              <img src={imgMap[method]} alt={method} />
              <span>{method === "pse" ? "Datáfono" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
            </div>
          );
        })}
      </div>

      <button id="confirmBtn" className="google-btn" onClick={handleConfirm}>
        Confirmar pago
      </button>

      <div id="result">{result}</div>
    </div>
  );
};

export default Payment;
