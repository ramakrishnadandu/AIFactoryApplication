import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define types for props and state
interface GreetingProps {
  userId: string;
}

interface GreetingData {
  message: string;
}

const Greeting: React.FC<GreetingProps> = ({ userId }) => {
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch personalized greeting data from the GreetingService
    const fetchGreeting = async () => {
      try {
        const response = await axios.get<GreetingData>(`http://localhost:8001/greetings/${userId}`);
        setGreeting(response.data);
      } catch (err: any) {
        console.error('Error fetching greeting:', err);
        setError('Failed to load greeting. Please try again later.');
      }
    };
    
    fetchGreeting();
  }, [userId]);

  if (error) {
    return <div className="greeting-error">{error}</div>;
  }

  return (
    <div className="greeting">
      {greeting ? (
        <h1>{greeting.message}</h1>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default Greeting;