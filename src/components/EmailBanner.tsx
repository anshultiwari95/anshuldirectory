import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define prop interface for reusability
interface EmailBannerProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
}

// Create a public URL for the email image
const DEFAULT_EMAIL_IMAGE = '/email.png';

const EmailBanner = memo(({
  imageUrl = DEFAULT_EMAIL_IMAGE,
  title = "STAY CONNECTED",
  subtitle = "Subscribe to my newsletter for updates.",
  backgroundColor = '#3A0CA3'
}: EmailBannerProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    // Abort controller for cleanup
    const controller = new AbortController();
    
    const setupAnimations = () => {
      const ctx = gsap.context(() => {
        // Create a scroll-linked animation for the email
        const emailTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1,
            onEnter: () => {
              gsap.to(imageRef.current, { opacity: 1, duration: 0.5 });
            },
            onEnterBack: () => {
              gsap.to(imageRef.current, { opacity: 1, duration: 0.5 });
            }
          }
        });
        
        // Animate the email based on scroll position - from left to right
        emailTimeline.fromTo(
          imageRef.current,
          { 
            x: '-100%', 
            rotate: -15,
            scale: 0.7,
          },
          { 
            x: '0%', 
            rotate: 0,
            scale: 1,
            ease: "power2.out",
          }
        );
        
        // Animate the title and text with a single timeline for better performance
        const textTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 1
          }
        });
        
        textTimeline
          .fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 }
          )
          .fromTo(
            textRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            "-=0.5" // Start slightly before the title animation finishes
          );
      });
      
      return () => {
        ctx.revert();
      };
    };

    // Only set up animations if we're in a browser environment and the refs are available
    if (typeof window !== 'undefined' && sectionRef.current && imageRef.current) {
      setupAnimations();
    }
    
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="section-email relative overflow-hidden py-24 md:py-36 lg:py-56"
      style={{ backgroundColor }}
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10 pointer-events-none">
        {/* Email image that appears on scroll */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt={title}
          className="w-[70%] md:w-auto md:h-[400px] lg:h-[700px] opacity-0 max-w-none object-contain"
          style={{ 
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
            transform: 'translateX(-100%) scale(0.7) rotate(-15deg)'
          }}
          loading="lazy"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-12 md:mb-24 text-center"
        >
          {title}
        </h2>
         
        <p 
          ref={textRef}
          className="text-center text-white mt-32 md:mt-48 lg:mt-64 text-xl md:text-2xl lg:text-3xl" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
});

// Display name for debugging
EmailBanner.displayName = 'EmailBanner';

export default EmailBanner; 