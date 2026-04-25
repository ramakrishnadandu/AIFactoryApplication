import React, { useState, useEffect } from 'react';
import { IoMic, IoMicOff } from 'react-icons/io5';
import './MicrophoneButton.css';
import { startRecording, stopRecording } from '../services/AudioService';

const MicrophoneButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize microphone access
  useEffect(() => {
    const initMicAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted');
      } catch (err: any) {
        console.error('Failed to access microphone:', err);
        setError('Microphone access denied. Please enable it in your browser settings.');
      }
    };

    initMicAccess();
  }, []);

  const handleClick = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        setIsRecording(false);
      } else {
        await startRecording();
        setIsRecording(true);
      }
    } catch (err: any) {
      console.error('Error handling microphone state:', err);
      setError('An error occurred while accessing the microphone. Please try again.');
    }
  };

  return (
    <div className="microphone-button-container">
      <button onClick={handleClick} className={`microphone-button ${isRecording ? 'recording' : ''}`} aria-label="Toggle recording">
        {isRecording ? <IoMicOff size={24} /> : <IoMic size={24} />}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MicrophoneButton;

// MicrophoneButton.css
.microphone-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.microphone-button {
  background-color: #007bff;
  border: none;
  border-radius: 50%;
  color: white;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.microphone-button:hover {
  background-color: #0056b3;
}

.microphone-button.recording {
  background-color: #ff4d4d;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 0.9em;
}

// AudioService.ts
export const startRecording = async () => {
  console.log('Recording started.');
  // Assuming implementation for starting audio recording exists here
};

export const stopRecording = async () => {
  console.log('Recording stopped.');
  // Assuming implementation for stopping audio recording exists here
};