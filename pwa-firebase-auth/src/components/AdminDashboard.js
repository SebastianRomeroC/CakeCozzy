import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, db } from "../firebase"; // db solo se usa para productos
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import logo from "../img/logoCakecozzy.png";
import "../style/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userId");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="CakeCozzy Logo" className="sidebar-logo" />
          <h1 className="logo-text">Admin</h1>
        </div>

        <nav>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            📦 Órdenes
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            🍰 Productos
          </button>
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => setActiveTab("stats")}
          >
            📊 Estadísticas
          </button>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          🔒 Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="content">
        {activeTab === "orders" && <Orders />}
        {activeTab === "products" && <Products />}
        {activeTab === "stats" && <Stats />}
      </main>
    </div>
  );
}

/* --------------------- */
/* COMPONENTES INTERNOS */
/* --------------------- */

// Órdenes desde MongoDB
function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders"); // endpoint Mongo
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="section-title">📦 Gestión de Órdenes</h2>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.cliente}</td>
              <td>{o.items?.map((i) => i.nombre).join(", ")}</td>
              <td>${o.total}</td>
              <td>{o.estado || "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Productos (Firestore)
function Products() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", precio: "", disponible: true });

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "productos"));
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const addProduct = async () => {
    if (!nuevo.nombre || !nuevo.precio) return alert("Completa los campos");
    const docRef = await addDoc(collection(db, "productos"), {
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      disponible: true,
    });
    setProductos([...productos, { id: docRef.id, ...nuevo }]);
    setNuevo({ nombre: "", precio: "", disponible: true });
  };

  const toggleDisponible = async (id, disponible) => {
    const ref = doc(db, "productos", id);
    await updateDoc(ref, { disponible: !disponible });
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, disponible: !disponible } : p
      )
    );
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "productos", id));
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="section-title">🍰 Gestión de Productos</h2>

      {/* Formulario */}
      <div className="form-producto">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
        />
        <button onClick={addProduct}>Agregar</button>
      </div>

      {/* Lista de productos en cards */}
      <div className="lista-productos">
        {productos.map((p) => (
          <div className="producto-card" key={p.id}>
            <img
              src={p.imagen || "https://via.placeholder.com/100"}
              alt={p.nombre}
            />
            <h3>{p.nombre}</h3>
            <p>${p.precio}</p>
            <div className="producto-actions">
              <button
                className="edit-btn"
                onClick={() => toggleDisponible(p.id, p.disponible)}
              >
                {p.disponible ? "Desactivar" : "Activar"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteProduct(p.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Estadísticas
function Stats() {
  const [productos, setProductos] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const snap = await getDocs(collection(db, "productos"));
      setProductos(snap.docs.map((d) => d.data()));
    };
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      }
    };
    fetchProductos();
    fetchOrders();
  }, []);

  const totalVentas = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div>
      <h2 className="section-title">📊 Estadísticas</h2>
      <div className="estadisticas-section">
        <div className="stats-card">
          <h4>Productos</h4>
          <p>{productos.length}</p>
        </div>
        <div className="stats-card">
          <h4>Órdenes</h4>
          <p>{orders.length}</p>
        </div>
        <div className="stats-card">
          <h4>Total Vendido</h4>
          <p>${totalVentas}</p>
        </div>
      </div>
    </div>
  );
}
