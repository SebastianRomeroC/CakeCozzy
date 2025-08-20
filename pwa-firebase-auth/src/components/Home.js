import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import "../style/Home.css";
import logo from "../img/logoCakecozzy.png";
import { useTranslation } from "react-i18next";

// Importar imágenes
import postreLimon from "../img/postrelimon.jpg";
import pastelArequipe from "../img/pasteldearequipe.jpg";
import pastelFlor from "../img/pasteldeflor.jpg";
import tresLeches from "../img/pasteldetresleches.jpg";
import pastelChocolate from "../img/pasteldechocolate.jpg";
import pastelCumple from "../img/pasteldecumpleaños.jpg";

const postres = [
  { nombre: "Postre de Limón", imagen: postreLimon },
  { nombre: "Pastel de Arequipe y Nueces", imagen: pastelArequipe },
  { nombre: "Pastel de Flor de Loto", imagen: pastelFlor },
  { nombre: "Pastel de Tres Leches", imagen: tresLeches },
  { nombre: "Pastel de Chocolate", imagen: pastelChocolate },
  { nombre: "Pastel Cumpleaños", imagen: pastelCumple },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [busqueda, setBusqueda] = useState("");
  const [tarjetas, setTarjetas] = useState(postres);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const irPasarelaPago = () => {
    navigate("/pago"); 
  };

  // Mantener idioma de localStorage al cargar la página
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={logo} alt="Logo Cakecozzy" className="logo" />
        <div className="header-buttons">
          <button className="btn-pago" onClick={irPasarelaPago}>{t("payment", { defaultValue: "Pasarela de Pago" })}</button>
          <button className="btn-logout" onClick={handleLogout}>{t("logout", { defaultValue: "Cerrar Sesión" })}</button>
        </div>
      </header>

      <div className="buscador-container">
        <input
          type="text"
          placeholder={t("search", { defaultValue: "Buscar..." })}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid" id="contenedorTarjetas">
        {tarjetas.map((postre, index) => (
          <div className="tarjeta" key={index}>
            <img src={postre.imagen} alt={postre.nombre} />
            <p>{postre.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
