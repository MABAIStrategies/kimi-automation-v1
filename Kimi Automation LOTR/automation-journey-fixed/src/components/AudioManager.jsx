import { useEffect, useRef } from 'react';

const AUDIO_CONFIG = {
  ambient: { src: '/sounds/ambient-fantasy.mp3', volume: 0.3, loop: true },
  pageFlip: { src: '/sounds/page-flip.mp3', volume: 0.5, loop: false },
  success: { src: '/sounds/success-chime.mp3', volume: 0.6, loop: false },
  click: { src: '/sounds/button-click.mp3', volume: 0.4, loop: false }
};

const AudioManager = () => {
  const audioRef = useRef({});

  useEffect(() => {
    // Preload audio files safely
    Object.entries(AUDIO_CONFIG).forEach(([key, config]) => {
      try {
        const audio = new Audio(config.src);
        audio.volume = config.volume;
        audio.loop = config.loop;
        audio.onerror = () => console.warn(`Audio failed to load: ${config.src}`);
        audioRef.current[key] = audio;
      } catch (error) {
        console.warn(`Audio creation failed for ${key}:`, error);
      }
    });

    // Global audio event listener
    const handleAudioEvent = (e) => {
      const { type } = e.detail;
      const audio = audioRef.current[type];
      
      if (audio) {
        try {
          audio.currentTime = 0;
          audio.play().catch(err => {
            console.warn('Audio play failed:', err);
          });
        } catch (error) {
          console.warn('Audio playback error:', error);
        }
      }
    };

    window.addEventListener('playAudio', handleAudioEvent);

    // Cleanup
    return () => {
      window.removeEventListener('playAudio', handleAudioEvent);
      Object.values(audioRef.current).forEach(audio => {
        try {
          audio.pause();
          audio.src = '';
        } catch (e) {
          // Silent fail on cleanup
        }
      });
    };
  }, []);

  return null;
};

export default AudioManager;
