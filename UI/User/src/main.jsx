import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="275588019008-6alnah17m20v67ochk40bbiudp5obblc.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
      <ToastContainer/>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
