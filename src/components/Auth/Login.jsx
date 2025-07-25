// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      await dispatch(loginAdmin({ email, password }));
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/admin/po-detail'); 
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white rounded shadow">
        <h2 className="text-2xl mb-4 font-bold text-center">Admin Login</h2>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-3 border px-3 py-2 rounded"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-3 border px-3 py-2 rounded"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
