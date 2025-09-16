// src/components/Login.js
import { useTranslation } from "react-i18next";
import {
  auth,
  loginWithGoogle,
  registerWithEmail,
  loginWithEmail,
} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserRole } from "../hooks/useUserRole"; // Hook para rol
import "../style/Login.css";
import logo from "../img/logoCakecozzy.png";

const Login = () => {
  const { t, i18n } = useTranslation();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole(); // Estado del rol

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  // Redirige automáticamente según rol si ya hay un usuario logueado
  useEffect(() => {
    if (user && !roleLoading) {
      localStorage.setItem("userId", user.uid);
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [user, role, roleLoading, navigate]);

  // Mantener idioma de localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && i18n.language !== savedLang) i18n.changeLanguage(savedLang);
  }, [i18n]);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        if (!name.trim())
          throw new Error(
            t("requiredName", { defaultValue: "El nombre es obligatorio." })
          );
        if (password.length < 6)
          throw new Error(
            t("passwordMin", {
              defaultValue: "La contraseña debe tener al menos 6 caracteres.",
            })
          );
        await registerWithEmail(email, password, name.trim());
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // La redirección la maneja el useEffect
    } catch (err) {
      setError(err.message || "Error al iniciar sesión con Google");
    }
  };

  if (loading || roleLoading)
    return <div className="login-container">Cargando…</div>;

  // Si el usuario ya existe y el rol ya está cargado, no renderiza el login
  if (user) return null;

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Idiomas */}
        <div className="language-switcher">
          <button
            onClick={() => handleLanguageChange("en")}
            className={i18n.language === "en" ? "active" : ""}
          >
            🇬🇧
          </button>
          <button
            onClick={() => handleLanguageChange("es")}
            className={i18n.language === "es" ? "active" : ""}
          >
            🇪🇸
          </button>
          <button
            onClick={() => handleLanguageChange("fr")}
            className={i18n.language === "fr" ? "active" : ""}
          >
            🇫🇷
          </button>
        </div>

        <div className="logo-container">
          <img src={logo} alt="Cakecozzy Logo" className="login-logo" />
        </div>

        <h2 className="login-title">
          {isRegistering
            ? t("register", { defaultValue: "Registrarse" })
            : t("login", { defaultValue: "Iniciar sesión" })}
        </h2>

        <form onSubmit={handleAuth} className="login-form">
          {isRegistering && (
            <>
              <label>{t("name", { defaultValue: "Nombre" })}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder", { defaultValue: "Tu nombre" })}
              />
            </>
          )}

          <label>{t("email", { defaultValue: "Correo Electrónico" })}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder", { defaultValue: "correo@dominio.com" })}
          />

          <label>{t("password", { defaultValue: "Contraseña" })}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder", { defaultValue: "Mínimo 6 caracteres" })}
          />

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="primary-btn">
            {isRegistering
              ? t("register", { defaultValue: "Registrarse" })
              : t("signIn", { defaultValue: "Ingresar" })}
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? t("alreadyAccount", { defaultValue: "¿Ya tienes cuenta? Inicia sesión" })
              : t("noAccount", { defaultValue: "¿No tienes cuenta? Regístrate" })}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-btn"
          >
            {t("signInWithGoogle", { defaultValue: "Iniciar sesión con Google" })}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
