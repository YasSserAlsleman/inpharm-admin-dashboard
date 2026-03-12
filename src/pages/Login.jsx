import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handle} className="w-96 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin / Manager Login</h2>
        <label className="block mb-2">Email</label>
        <input
          className="w-full mb-3 border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full mb-4 border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Signing...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}