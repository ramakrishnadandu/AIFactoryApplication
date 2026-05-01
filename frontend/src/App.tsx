import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the interface for the interest
interface Interest {
  id: string;
  name: string;
}

// Define the interface for user interests
interface UserInterest {
  userId: string;
  interests: Interest[];
}

// Main App component
const App: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest | null>(null);
  const [customInterest, setCustomInterest] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch predefined interests from server
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get('/api/interests');
        setInterests(response.data);
      } catch (err) {
        console.error('Error fetching interests', err);
        setError('Failed to load interests. Please try again later.');
      }
    };

    fetchInterests();
  }, []);

  // Fetch user interests from server
  const fetchUserInterests = async () => {
    try {
      const response = await axios.get('/api/user/interests');
      setUserInterests(response.data);
    } catch (err) {
      console.error('Error fetching user interests', err);
      setError('Failed to load user interests. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUserInterests();
  }, []);

  // Handle adding of a custom interest
  const handleAddCustomInterest = async () => {
    if (!customInterest.trim()) return;

    try {
      await axios.post('/api/user/interests', { interest: customInterest });
      fetchUserInterests(); // Refresh user interests
      setCustomInterest(''); // Clear input
    } catch (err) {
      console.error('Error adding custom interest', err);
      setError('Failed to add interest. Please try again later.');
    }
  };

  // Render error message if there is an error
  const renderError = () => error && <div className="error">{error}</div>;

  return (
    <div>
      <h1>Customize Your Interests</h1>
      {renderError()}
      <div className="interests-list">
        <h2>Available Interests:</h2>
        {interests.map((interest) => (
          <div key={interest.id}>
            <label>
              <input
                type="checkbox"
                checked={!!userInterests?.interests.some((ui) => ui.id === interest.id)}
                // Handle changes optimistically
                onChange={async () => {
                  try {
                    await axios.put('/api/user/interests', { interestId: interest.id });
                    fetchUserInterests();
                  } catch (err) {
                    console.error('Error updating interest', err);
                    setError('Failed to update interest. Please try again later.');
                  }
                }}
              />
              {interest.name}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h2>Add Custom Interest</h2>
        <input
          type="text"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
        />
        <button onClick={handleAddCustomInterest}>Add</button>
      </div>
      <div>
        <h2>Your Interests</h2>
        {userInterests?.interests.map((interest) => (
          <span key={interest.id}>{interest.name}</span>
        ))}
      </div>
    </div>
  );
};

export default App;