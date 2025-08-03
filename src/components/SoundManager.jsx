import { useRef, useEffect } from "react";

export function SoundManager({ 
  playRifle = false, 
  playHurt = false, 
  playDead = false,
  volume = 0.5 
}) {
  const rifleAudio = useRef(null);
  const hurtAudio = useRef(null);
  const deadAudio = useRef(null);

  useEffect(() => {
    // Initialize audio elements
    rifleAudio.current = new Audio("/rifle.mp3");
    hurtAudio.current = new Audio("/hurt.mp3");
    deadAudio.current = new Audio("/dead.mp3");

    // Set volume for all audio
    rifleAudio.current.volume = volume;
    hurtAudio.current.volume = volume;
    deadAudio.current.volume = volume;

    // Cleanup function
    return () => {
      if (rifleAudio.current) {
        rifleAudio.current.pause();
        rifleAudio.current = null;
      }
      if (hurtAudio.current) {
        hurtAudio.current.pause();
        hurtAudio.current = null;
      }
      if (deadAudio.current) {
        deadAudio.current.pause();
        deadAudio.current = null;
      }
    };
  }, [volume]);

  useEffect(() => {
    if (playRifle && rifleAudio.current) {
      rifleAudio.current.currentTime = 0;
      rifleAudio.current.play().catch(console.error);
    }
  }, [playRifle]);

  useEffect(() => {
    if (playHurt && hurtAudio.current) {
      hurtAudio.current.currentTime = 0;
      hurtAudio.current.play().catch(console.error);
    }
  }, [playHurt]);

  useEffect(() => {
    if (playDead && deadAudio.current) {
      deadAudio.current.currentTime = 0;
      deadAudio.current.play().catch(console.error);
    }
  }, [playDead]);

  return null; // This component doesn't render anything
}

// Hook for easy sound management
export function useSoundManager(volume = 0.5) {
  const rifleAudio = useRef(null);
  const hurtAudio = useRef(null);
  const deadAudio = useRef(null);

  useEffect(() => {
    rifleAudio.current = new Audio("/rifle.mp3");
    hurtAudio.current = new Audio("/hurt.mp3");
    deadAudio.current = new Audio("/dead.mp3");

    rifleAudio.current.volume = volume;
    hurtAudio.current.volume = volume;
    deadAudio.current.volume = volume;

    return () => {
      [rifleAudio, hurtAudio, deadAudio].forEach(audioRef => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      });
    };
  }, [volume]);

  const playRifle = () => {
    if (rifleAudio.current) {
      rifleAudio.current.currentTime = 0;
      rifleAudio.current.play().catch(console.error);
    }
  };

  const playHurt = () => {
    if (hurtAudio.current) {
      hurtAudio.current.currentTime = 0;
      hurtAudio.current.play().catch(console.error);
    }
  };

  const playDead = () => {
    if (deadAudio.current) {
      deadAudio.current.currentTime = 0;
      deadAudio.current.play().catch(console.error);
    }
  };

  return { playRifle, playHurt, playDead };
} 