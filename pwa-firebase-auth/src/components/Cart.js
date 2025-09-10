// src/components/Cart.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Cart.css";

const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6h18v2H3V6zm2 3h14v12H5V9zm3 2v8h2v-8H8zm4 0v8h2v-8h-2z" />
  </svg>
);

const API_BASE = process.env.REACT_APP_API_BASE;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const normalized = items.map((item) => ({
      ...item,
      precio: item.precio ?? item.price ?? 0,
      quantity: item.quantity ?? 1,
    }));
    setCartItems(normalized);
  }, []);

  const saveCart = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
    setCartItems(items);
  };

  const increment = (index) => {
    const items = [...cartItems];
    items[index].quantity += 1;
    saveCart(items);
  };

  const decrement = (index) => {
    const items = [...cartItems];
    if (items[index].quantity > 1) {
      items[index].quantity -= 1;
      saveCart(items);
    }
  };

  const removeItem = (index) => {
    const items = [...cartItems];
    items.splice(index, 1);
    saveCart(items);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (item.precio ?? 0) * (item.quantity ?? 1),
    0
  );

  const normalizeAddress = (dir) => {
    let d = dir.trim();
    d = d.replace(/^Cll/i, "Calle");
    d = d.replace(/\s+/g, " ");
    if (!d.toLowerCase().includes("bogota")) d += ", Bogotá";
    if (!d.toLowerCase().includes("colombia")) d += ", Colombia";
    return d;
  };

  const geocode = async (dir) => {
    const query = encodeURIComponent(normalizeAddress(dir));
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Error conectando a Mapbox: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    if (!data.features || !data.features.length)
      throw new Error(
        `Dirección no encontrada: "${dir}". Intenta escribirla completa incluyendo ciudad y país.`
      );

    const [lng, lat] = data.features[0].center;
    return { lng, lat, placeName: data.features[0].place_name };
  };

  const goPayment = async () => {
    setError(null);
    if (!direccion) {
      setError("Por favor ingresa tu dirección de entrega.");
      return;
    }

    try {
      setLoading(true);
      const geo = await geocode(direccion);

      const body = {
        items: cartItems,
        total,
        direccion: geo.placeName,
        location: { coordinates: [geo.lng, geo.lat] },
      };

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error creando la orden");
      }

      // 🔹 Navegar usando el _id de la orden creada
      navigate(`/pago/${data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creando la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.nombre}</p>
                  <p className="cart-item-price">
                    $ {(item.precio ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => decrement(index)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increment(index)}>+</button>
                </div>
                <button
                  className="btn-remove"
                  onClick={() => removeItem(index)}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <p className="cart-total">Total: $ {total.toLocaleString()}</p>

            <input
              type="text"
              placeholder="Dirección de entrega"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="direccion-input"
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              className="btn-checkout"
              onClick={goPayment}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar y pagar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
