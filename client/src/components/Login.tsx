import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err?.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 max-w-md w-full bg-white rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-600">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;