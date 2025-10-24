import { useEffect, useState } from 'react';
import API from '../services/api';
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const n = useNavigate();

  useEffect(() => {
    const token = getToken();
    if(!token) return n('/login');
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    load();
  }, []);

  const load = async () => {
    try{
      const r = await API.get('/records');
      setRecords(r.data.records || []);
    }catch(e){
      console.error(e);
    }
  };

  const doPredict = async () => {
    try{
      const r = await API.post('/predict', { input: { raw: input } });
      alert('Prediction saved. See history');
      load();
    }catch(e){
      alert('Predict failed');
    }
  };

  const logout = () => {
    removeToken();
    n('/login');
  };

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <div style={{marginTop:20}}>
        <textarea placeholder="paste input JSON or text" value={input} onChange={e=>setInput(e.target.value)} rows={4} cols={50}></textarea>
        <br/>
        <button onClick={doPredict}>Upload & Predict</button>
      </div>

      <h3 style={{marginTop:20}}>History</h3>
      <ul>
        {records.map(r=>(
          <li key={r.id}>
            {new Date(r.createdAt).toLocaleString()} — {r.result?.disease || 'N/A'} — {Math.round((r.result?.confidence||0)*100)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
