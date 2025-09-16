import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../style/Home.css";
import logo from "../img/logoCakecozzy.png";

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
  const [tarjetas, setTarjetas] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Traer productos desde Firestore (solo disponibles)
  useEffect(() => {
    const fetchProductos = async () => {
      const q = query(collection(db, "productos"), where("disponible", "==", true));
      const snap = await getDocs(q);
      setTarjetas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchProductos();
  }, []);

  // Filtrar productos según búsqueda
  const productosFiltrados = tarjetas.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Refrescar contador del carrito desde localStorage
  const refreshCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems")) || [];
      const count = items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
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
  const addToCart = (producto) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((it) => it.id === producto.id);

    const productoToAdd = {
      ...producto,
      price: producto.precio,
    };

    if (index >= 0) {
      items[index].quantity += 1;
    } else {
      items.push({ ...productoToAdd, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(items));
    refreshCartCount();
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={logo} alt="Logo Cakecozzy" className="logo" />

        <div className="header-right">
          <button className="icon-btn cart-btn" onClick={goCart} aria-label="Carrito">
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
        {productosFiltrados.map((p) => (
          <div className="tarjeta" key={p.id}>
            <img src={p.imagen || "https://via.placeholder.com/150"} alt={p.nombre} />
            <p>{p.nombre}</p>
            <p className="precio">$ {p.precio.toLocaleString()}</p>
            <button className="btn-add-cart" onClick={() => addToCart(p)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
