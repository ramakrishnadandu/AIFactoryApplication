import React, { useState, useEffect, useRef } from 'react';
import './TranscriptDisplay.css'; // Assuming you have some basic styling here
import { WebSocketInterface } from '../services/WebSocketInterface'; // Custom WebSocket handler

interface TranscriptDisplayProps {
  apiUrl: string;
}

interface TranscriptData {
  id: string;
  transcribed_text: string;
  language: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ apiUrl }) => {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const webSocket = new WebSocketInterface(apiUrl);

      webSocket.onOpen(() => {
        console.log('WebSocket connection established.');
        setConnectionError(null);
      });

      webSocket.onClose((event) => {
        console.error('WebSocket connection closed:', event);
        setConnectionError('Connection closed. Trying to reconnect...');
        setTimeout(connectWebSocket, 3000); // Retry connection every 3 seconds
      });

      webSocket.onError((error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error. Trying to reconnect...');
      });

      webSocket.onMessage((event) => {
        try {
          const data: TranscriptData = JSON.parse(event.data);
          setTranscripts((prevTranscripts) => [...prevTranscripts, data]);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      });

      webSocketRef.current = webSocket;
    };

    connectWebSocket();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [apiUrl]);

  return (
    <div className="transcript-display">
      {connectionError && <div className="error">{connectionError}</div>}
      <div className="transcript-list">
        {transcripts.map((transcript) => (
          <div key={transcript.id} className="transcript-item">
            <div className="transcript-text">{transcript.transcribed_text}</div>
            <div className="transcript-language">Language: {transcript.language}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// services/WebSocketInterface.ts

export class WebSocketInterface {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
  }

  onOpen(callback: (event: Event) => void) {
    this.socket.onopen = callback;
  }

  onClose(callback: (event: CloseEvent) => void) {
    this.socket.onclose = callback;
  }

  onError(callback: (event: Event) => void) {
    this.socket.onerror = callback;
  }

  onMessage(callback: (event: MessageEvent) => void) {
    this.socket.onmessage = callback;
  }

  close() {
    this.socket.close();
  }
}