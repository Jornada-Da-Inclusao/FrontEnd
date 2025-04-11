import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import Acessibility from "./components/acessibilidade/Acessibility";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Acessibility />
  </StrictMode>,
);
