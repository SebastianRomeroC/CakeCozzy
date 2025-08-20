import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./i18n"; // 👈 inicializa i18n

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
serviceWorkerRegistration.register();



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

