import { useState } from "react";
import axios from "axios";

export default function Predict() {
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    const res = await axios.get("http://localhost:5000/predict");
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Prediction Page</h2>
      <button onClick={handlePredict}>Test /predict API</button>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
