import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defaultSystem } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import { Provider } from "./components/ui/provider";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
