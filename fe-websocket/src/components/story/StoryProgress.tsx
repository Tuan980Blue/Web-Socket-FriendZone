import React, { useEffect, useRef } from 'react';

interface StoryProgressProps {
  currentIndex: number;
  onProgressComplete: () => void;
  isPaused: boolean;
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  currentIndex,
  onProgressComplete,
  isPaused
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!progressRef.current) return;
    
    // Reset progress bar
    progressRef.current.style.width = '0%';
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // If paused, don't start the timer
    if (isPaused) return;
    
    // Start timer
    const startTime = Date.now();
    const duration = 5000; // 5 seconds
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Update progress bar
      if (progressRef.current) {
        progressRef.current.style.width = `${progress * 100}%`;
      }
      
      // If complete, go to next story
      if (progress >= 1) {
        onProgressComplete();
      }
    }, 10);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, onProgressComplete, isPaused]);
  
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 z-10">
      <div 
        ref={progressRef}
        className="h-full bg-white"
        style={{ width: '0%' }}
      ></div>
    </div>
  );
};

export default StoryProgress; 