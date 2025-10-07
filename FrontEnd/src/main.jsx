import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";

const clerkFrontendApi=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}
      navigate={(to) => window.history.pushState(null, "", to)}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
