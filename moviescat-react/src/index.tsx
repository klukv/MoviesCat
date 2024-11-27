import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import store, { persistor } from "./redux/store";

const rootElem = document.getElementById("root");

if (rootElem) {
  const root = ReactDOM.createRoot(rootElem);
  root.render(
    <BrowserRouter>
      {/* <React.StrictMode> */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      {/* </React.StrictMode> */}
    </BrowserRouter>
  );
}
