import React, { useState } from 'react';
import axios from 'axios';

interface UserFormProps {
  formType: 'register' | 'login';
}

const UserForm: React.FC<UserFormProps> = ({ formType }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const endpoint = formType === 'register' ? '/register' : '/login';
    const userData = { email, password };

    try {
      const response = await axios.post(`http://localhost:8000/api${endpoint}`, userData);
      setLoading(false);

      if (formType === 'register') {
        setMessage('Registration successful! Please check your email for confirmation.');
      } else {
        setMessage('Login successful!');
      }

      console.log('Server Response:', response);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div className="user-form">
      <h2>{formType === 'register' ? 'Register' : 'Login'}</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : formType === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;