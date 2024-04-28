import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// katex
// import "katex/dist/katex.min.css";
// import Latex from "react-latex-next";
