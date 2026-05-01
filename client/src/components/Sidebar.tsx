import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { socket } from '../utils/socket';
import { authService } from '../services/authService';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Handle user online status received from the websocket
    socket.on('user_online', (username: string) => {
      setOnlineUsers(prev => [...new Set([...prev, username])]);
    });
    
    socket.on('user_offline', (username: string) => {
      setOnlineUsers(prev => prev.filter(user => user !== username));
    });

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, []);

  // Handler for logout functionality
  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center p-4">
        <h1 className="text-xl font-bold">Todo + Chat App</h1>
      </div>
      <nav className="mt-8">
        <ul>
          <li>
            <NavLink
              to="/todos"
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                location.pathname === '/todos' ? 'bg-gray-700' : ''
              }`}
            >
              Todos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                location.pathname === '/chat' ? 'bg-gray-700' : ''
              }`}
            >
              Chat
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-gray-700">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 text-left hover:bg-gray-600 focus:outline-none"
        >
          Logout
        </button>
      </div>
      <div className="bg-gray-800 p-3">
        <h2 className="font-semibold mb-2">Online Users</h2>
        <ul>
          {onlineUsers.map((user, index) => (
            <li key={index} className="text-sm">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;