import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  online: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io('http://localhost:8002', {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });

    socket.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.current.on('receive_message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socket.current.on('user_online', (user: User) => {
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? { ...u, online: true } : u)
      );
    });

    socket.current.on('user_offline', (user: User) => {
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? { ...u, online: false } : u)
      );
    });

    socket.current.on('typing', (userId: string) => {
      setTyping(userId);
      setTimeout(() => setTyping(null), 3000);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    axios.get<User[]>('/api/users')
      .then(response => setUsers(response.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedUser) {
      const newMessage: Message = {
        senderId: 'myUserId', // Replace with actual user ID from your auth logic
        receiverId: selectedUser.id,
        content: inputMessage,
        timestamp: new Date(),
      };
      socket.current?.emit('send_message', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
    }
  };

  const handleTyping = () => {
    socket.current?.emit('typing', selectedUser?.id);
  };

  return (
    <div className="chat-component flex flex-col h-full">
      <div className="users-list flex-none">
        {users.map(user => (
          <div 
            key={user.id} 
            className={`user-item ${user.online ? 'online' : 'offline'}`} 
            onClick={() => setSelectedUser(user)}
          >
            {user.name} {user.online ? '🟢' : '🔴'}
          </div>
        ))}
      </div>
      <div className="chat-window flex-1 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === 'myUserId' ? 'sent' : 'received'}`}>
            <div>{message.content}</div>
            <div className="text-xs">{new Date(message.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        {typing && <div className="typing-indicator">Typing...</div>}
      </div>
      <div className="input-area flex-none">
        <input 
          type="text" 
          className="w-full" 
          value={inputMessage} 
          onChange={e => setInputMessage(e.target.value)}
          onKeyUp={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;