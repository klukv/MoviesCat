import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootElem = document.getElementById("root");

if (rootElem) {
  const root = ReactDOM.createRoot(rootElem);
  root.render(
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  );
}
