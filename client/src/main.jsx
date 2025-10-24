import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Predict from "./pages/Predict";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./utils/auth";
import { setToken } from "./services/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";



const token = getToken();
if(token) setToken(token);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
