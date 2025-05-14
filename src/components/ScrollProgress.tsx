import { useEffect, useRef } from 'react';

const ScrollProgress = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!progressBarRef.current) return;
      
      
      const windowScroll = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (windowScroll / windowHeight) * 100;
      
      
      progressBarRef.current.style.height = `${scrollPercentage}%`;
      
      
      const glowIntensity = Math.min(5 + scrollPercentage / 5, 20);
      progressBarRef.current.style.boxShadow = `0 0 ${glowIntensity}px 0 rgba(255,255,255,0.7)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
   
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="fixed top-0 right-8 h-full z-50 flex items-center pointer-events-none">
      <div className="h-full w-0.5 bg-gray-700 relative">
        <div 
          ref={progressBarRef}
          className="absolute top-0 left-0 w-full bg-white h-0"
          style={{ boxShadow: '0 0 5px 0 rgba(255,255,255,0.7)' }}
        />
      </div>
    </div>
  );
};

export default ScrollProgress; 