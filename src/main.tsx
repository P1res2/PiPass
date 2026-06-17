import { StrictMode } from 'react'
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { createRoot } from 'react-dom/client'
import './index.css'
import "./lib/i18n"
import App from '@/App.tsx'
import { AuthApp } from '@/AuthApp.tsx';

const label = getCurrentWebviewWindow().label;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {label === "auth" ? <AuthApp /> : <App />}
  </StrictMode>
);
