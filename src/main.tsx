import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import DashboardApp from "./dashboard/DashboardApp";
import "./styles.css";

const root = document.getElementById("root");
const isDashboard = window.location.pathname.startsWith("/dashboard");

if (root) {
  createRoot(root).render(
    <StrictMode>{isDashboard ? <DashboardApp /> : <App />}</StrictMode>,
  );
}
