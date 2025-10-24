import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [health, setHealth] = useState("Loading...");

  useEffect(() => {
    // ye backend ka /health route call karega (abhi test ke liye)
    axios.get("http://localhost:5000/health")
      .then(res => setHealth(res.data.status))
      .catch(() => setHealth("Server not running"));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>MedTech AI (MVP)</h1>
      <p>Backend status: <b>{health}</b></p>
      <p><a href="/predict">Go to Predict Test Page</a></p>
      <p><a href="/signup">Signup</a> | <a href="/login">Login</a> | <a href="/dashboard">Dashboard</a></p>
    </div>
  );
}
