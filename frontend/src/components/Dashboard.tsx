import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardProps {}

interface DataItem {
  id: number;
  name: string;
  value: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DataItem[]>('/api/data');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        } else {
          setError('Error: Unable to fetch data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={refreshData}>Refresh Data</button>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;