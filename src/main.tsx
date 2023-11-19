import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/css/app.css";
import { Suspense } from "react";

import { DbProvider, PagesProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DbProvider>
      <Suspense fallback="loading...">
        <PagesProvider>
          <App />
        </PagesProvider>
      </Suspense>
    </DbProvider>
  </React.StrictMode>,
);
