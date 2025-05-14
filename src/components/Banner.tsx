import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BannerProps {
  finalWord?: string;
  interval?: number;
  words?: string[];
  fontMapping?: Record<string, string>;
}


const DEFAULT_FONT_MAPPING: Record<string, string> = {
  'λεξικόν': "'Playfair Display', serif", 
  'دفتر': "'Poppins', sans-serif", 
  'سِجل': "'Poppins', sans-serif", 
  'सूची': "'Montserrat', sans-serif", 
  '資料': "'Oswald', sans-serif", 
  '일기': "'Montserrat', sans-serif", 
  'DEFAULT': "'Oswald', sans-serif" 
};

const Banner = memo(({ 
  finalWord = "DIRECTORY", 
  interval = 700,
  words = ['λεξικόν', 'دفتر', 'सूची', '資料', 'سِجل', '일기'],
  fontMapping = DEFAULT_FONT_MAPPING
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [completed, setCompleted] = useState(false);
  const [inView, setInView] = useState(true);
  const [animationInitialized, setAnimationInitialized] = useState(false);
  
  const bannerRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  
  
  const currentFont = useMemo(() => {
    if (completed) {
      return fontMapping.DEFAULT || "'Oswald', sans-serif";
    }
    
    return fontMapping[displayText] || fontMapping.DEFAULT || "'Oswald', sans-serif";
  }, [displayText, completed, fontMapping]);
  
  const resetAnimation = () => {
   
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
  
    setCurrentIndex(0);
    setDisplayText(words[0]);
    setCompleted(false);
    setAnimationInitialized(false);
    
    
    if (bannerRef.current) {
      gsap.set(bannerRef.current, { clearProps: "all" });
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 50, rotationX: 0 },
        { opacity: 1, y: 0, duration: 1, onComplete: () => setAnimationInitialized(true) }
      );
    }
  };
  

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        setInView(true);
        if (!animationInitialized) {
          resetAnimation();
        }
      },
      onLeave: () => setInView(false),
      onEnterBack: () => {
        setInView(true);
        resetAnimation(); 
      },
      onLeaveBack: () => setInView(false)
    });
    
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, [animationInitialized, words]);
  
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  
  useEffect(() => {
    if (completed || !inView || !animationInitialized || typeof window === 'undefined') {
      
      return;
    }
    
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (currentIndex >= words.length - 1) {
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
      
        gsap.to(bannerRef.current, {
          duration: 0.25,
          opacity: 0,
          y: -50,
          rotationX: 90,
          onComplete: () => {
            setDisplayText(finalWord);
            setCompleted(true);
            
       
            gsap.fromTo(
              bannerRef.current, 
              { 
                opacity: 0, 
                y: 50, 
                rotationX: -90,
                letterSpacing: "0.1em",
              },
              { 
                duration: 0.5, 
                opacity: 1, 
                y: 0, 
                rotationX: 0,
                letterSpacing: "0.2em",
                scale: 1.1,
                ease: "power2.out",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
              }
            );
          }
        });
      } else {
        
        gsap.to(bannerRef.current, {
          duration: 0.25,
          opacity: 0,
          y: -50,
          rotationX: 90,
          onComplete: () => {
            setDisplayText(words[currentIndex + 1]);
            
           
            gsap.fromTo(
              bannerRef.current, 
              { opacity: 0, y: 50, rotationX: -90 },
              { 
                duration: 0.25, 
                opacity: 1, 
                y: 0, 
                rotationX: 0,
                onComplete: () => {
                  setCurrentIndex(prev => prev + 1);
                } 
              }
            );
          }
        });
      }
    }, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, words, finalWord, interval, completed, inView, animationInitialized]);
  
  return (
    <div ref={containerRef} className="overflow-hidden">
      <h1
        ref={bannerRef}
        className={`text-4xl md:text-6xl lg:text-9xl font-bold text-center mb-6 md:mb-12 perspective-500 tracking-wider ${
          completed ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 uppercase' : 'text-white'
        }`}
        style={{ 
          transformStyle: 'preserve-3d',
          fontFamily: currentFont,
          fontWeight: completed ? 900 : 700,
        }}
      >
        {displayText}
      </h1>
    </div>
  );
});

Banner.displayName = 'Banner';

export default Banner; 