import React, { useState, useEffect, useRef } from 'react';

interface AudioPlaybackProps {
    audioUrl: string;
    onPlaybackEnd?: () => void;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({ audioUrl, onPlaybackEnd }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audioElement = new Audio(audioUrl);
        audioRef.current = audioElement;

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            onPlaybackEnd && onPlaybackEnd();
        };

        const handleError = (e: Event) => {
            console.error('Audio playback error:', e);
            setError('An error occurred during audio playback.');
        };

        audioElement.addEventListener('play', handlePlay);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('ended', handleEnded);
        audioElement.addEventListener('error', handleError);

        return () => {
            audioElement.removeEventListener('play', handlePlay);
            audioElement.removeEventListener('pause', handlePause);
            audioElement.removeEventListener('ended', handleEnded);
            audioElement.removeEventListener('error', handleError);

            // Cleanup the audio element
            audioElement.pause();
            audioRef.current = null;
        };
    }, [audioUrl, onPlaybackEnd]);

    const togglePlayback = () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play().catch((e) => {
                    console.error('Error attempting to play audio:', e);
                    setError('Failed to play audio.');
                });
            }
        }
    };

    return (
        <div>
            <button onClick={togglePlayback} disabled={!audioUrl}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default AudioPlayback;