import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import QueryProvider from "./lib/react-query/QueryProvider";
import AuthProvider from "./context/AuthProvider";

const root = ReactDom.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </React.StrictMode>
  </BrowserRouter>
);
