import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import "../style/Home.css";
import logo from "../img/logoCakecozzy.png";

// Importar imágenes
import postreLimon from "../img/postrelimon.jpg";
import pastelArequipe from "../img/pasteldearequipe.jpg";
import pastelFlor from "../img/pasteldeflor.jpg";
import tresLeches from "../img/pasteldetresleches.jpg";
import pastelChocolate from "../img/pasteldechocolate.jpg";
import pastelCumple from "../img/pasteldecumpleaños.jpg";

// Lista de postres con precios
const postres = [
  { nombre: "Postre de Limón", imagen: postreLimon, precio: 12000 },
  { nombre: "Pastel de Arequipe y Nueces", imagen: pastelArequipe, precio: 18000 },
  { nombre: "Pastel de Flor de Loto", imagen: pastelFlor, precio: 20000 },
  { nombre: "Pastel de Tres Leches", imagen: tresLeches, precio: 15000 },
  { nombre: "Pastel de Chocolate", imagen: pastelChocolate, precio: 17000 },
  { nombre: "Pastel Cumpleaños", imagen: pastelCumple, precio: 25000 },
];

// Icono carrito
const CartIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="26"
    height="26"
    aria-hidden="true"
  >
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 
      0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 
      1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21 5H6.21l-.94-2H2v2h2l3.6 
      7.59-1.35 2.44C5.52 15.37 6.27 17 7.84 17H20v-2H7.84l1.32-1z"/>
  </svg>
);

const Home = () => {
  const [busqueda, setBusqueda] = useState("");
  const [tarjetas, setTarjetas] = useState(postres);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Filtrar postres según búsqueda
  useEffect(() => {
    if (!busqueda) {
      setTarjetas(postres);
    } else {
      const filtradas = postres.filter((postre) =>
        postre.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setTarjetas(filtradas);
    }
  }, [busqueda]);

  // Refrescar contador del carrito desde localStorage
  const refreshCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems")) || [];
      const count = items.reduce(
        (acc, it) => acc + (Number(it.quantity) || 1),
        0
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
    const onStorage = (e) => {
      if (e.key === "cartItems") refreshCartCount();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Ir al carrito
  const goCart = () => {
    navigate("/carrito");
  };

  // Agregar al carrito
  const addToCart = (postre) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((it) => it.nombre === postre.nombre);

    const postreToAdd = {
      ...postre,
      price: postre.precio, // <- Usar price para el carrito
    };

    if (index >= 0) {
      items[index].quantity += 1;
    } else {
      items.push({ ...postreToAdd, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(items));
    refreshCartCount();
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={logo} alt="Logo Cakecozzy" className="logo" />

        <div className="header-right">
          <button
            className="icon-btn cart-btn"
            onClick={goCart}
            aria-label="Carrito"
          >
            <CartIcon className="cart-icon" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="buscador-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid" id="contenedorTarjetas">
        {tarjetas.map((postre, index) => (
          <div className="tarjeta" key={index}>
            <img src={postre.imagen} alt={postre.nombre} />
            <p>{postre.nombre}</p>
            <p className="precio">$ {postre.precio.toLocaleString()}</p>
            <button
              className="btn-add-cart"
              onClick={() => addToCart(postre)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
