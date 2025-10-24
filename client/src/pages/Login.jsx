import { useState } from 'react';
import API, { setToken } from '../services/api';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const n = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const r = await API.post('/auth/login', { email, password });
      saveToken(r.data.token);
      setToken(r.data.token);
      n('/dashboard');
    }catch(err){
      alert(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
