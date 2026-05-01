import React, { useState } from 'react';
import axios from 'axios';
import RegistrationForm from './components/RegistrationForm';
import GreetingDashboard from './components/GreetingDashboard';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistration = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', { email, password });
      if (response.status === 201) {
        setIsRegistered(true);
        console.log('Registration successful!');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        setError('An unknown error occurred during registration.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/register">
            <RegistrationForm onSubmit={handleRegistration} />
            {error && <p className="error">{error}</p>}
          </Route>
          <Route path="/greetings">
            {!isRegistered ? (
              <p>Please register first to access your greetings.</p>
            ) : (
              <GreetingDashboard />
            )}
          </Route>
          <Route path="/">
            <h1>Welcome to SayHi!</h1>
            <p>Your personal greeting app for all occasions.</p>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;

// Components/RegistrationForm.tsx
import React, { useState } from 'react';

interface RegistrationFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;

// Components/GreetingDashboard.tsx
import React from 'react';

const GreetingDashboard: React.FC = () => {
  return (
    <div>
      <h2>Your Personalized Greetings</h2>
      <p>Here you will see your greetings based on your events.</p>
      {/* The implementation to fetch and display greetings will be added here */}
    </div>
  );
};

export default GreetingDashboard;

// App.css
.App {
  text-align: center;
}

.error {
  color: red;
}