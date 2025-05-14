import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import PhoneBanner from '../components/PhoneBanner';
import EmailBanner from '../components/EmailBanner';
// import ScrollProgress from '../components/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

const PersonHome = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // Mark as loaded for SSR compatibility
    
    if (typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      // Scroll-triggered animation for text
      gsap.fromTo(
        textRef.current,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animation for CTA section
      gsap.fromTo(
        ctaRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Use custom hook for checking viewport size
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <>
      {/* <ScrollProgress /> */}
      <div className="text-white w-full" ref={sectionRef}>
        {/* Hero section with black background */}
        <div className="section-hero container mx-auto px-4 py-16 md:py-32 lg:py-44 bg-black">
          <Banner />
          <p
            ref={textRef}
            className="text-2xl md:text-3xl lg:text-4xl text-gray-300 max-w-2xl mx-auto text-center mb-8 md:mb-16"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Everything. Organized.
          </p>
          <div
            ref={ctaRef}
            className="flex flex-row sm:flex-col md:flex-row justify-center items-center gap-4 md:gap-6"
          >
            <Link
              to="/add"
              className="px-6 md:px-8 py-3 md:py-4 bg-black text-white border border-white rounded-lg transition-all duration-300 text-center w-auto sm:w-64 md:w-auto font-medium hover:border-transparent hover:bg-black hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] relative after:absolute after:inset-0 after:p-[2px] after:rounded-lg after:content-[''] hover:after:bg-gradient-to-r hover:after:from-blue-500 hover:after:to-purple-600 after:mask-composite after:-z-10"
            >
              Add New Contact
            </Link>
            <Link
              to="/list"
              className="px-6 md:px-8 py-3 md:py-4 bg-black text-white border border-white rounded-lg transition-all duration-300 text-center w-auto sm:w-64 md:w-auto font-medium hover:border-transparent hover:bg-black hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] relative after:absolute after:inset-0 after:p-[2px] after:rounded-lg after:content-[''] hover:after:bg-gradient-to-r hover:after:from-blue-500 hover:after:to-purple-600 after:mask-composite after:-z-10"
            >
              View Directory
            </Link>
          </div>
        </div>
        
        {/* PhoneBanner and EmailBanner with responsive props */}
        {isLoaded && (
          <>
            <PhoneBanner 
              title={isMobile ? "CONTACT" : "CONTACT ME"}
              subtitle="Leave your number and I'll call you back."
            />
            <EmailBanner 
              title={isMobile ? "CONNECT" : "STAY CONNECTED"}
              subtitle="Subscribe to my newsletter for updates."
            />
          </>
        )}
      </div>
    </>
  );
};

export default PersonHome; 