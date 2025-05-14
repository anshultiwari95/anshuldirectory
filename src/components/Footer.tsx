import React from 'react';

// Define types for social links
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

// Social media icons as components for better maintainability
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const Footer: React.FC = () => {
  // Configurable social links - easily add more in the future
  const socialLinks: SocialLink[] = [
    {
      name: '@Anshul Tiwari',
      url: 'https://anshul-tiwari-portfolio.vercel.app/',
      icon: null,
      ariaLabel: 'Anshul Tiwari Portfolio'
    },
    {
      name: '',
      url: 'https://github.com/anshultiwari95',
      icon: <GitHubIcon />,
      ariaLabel: 'GitHub Profile'
    }
  ];


  return (
    <footer className="py-2 text-center text-gray-400 text-sm bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-gray-500 flex items-center justify-center">
          <span>Created by</span>
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.url}>
              {index > 0 && link.name === '' ? null : ' '}
              <a 
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className={`inline-flex items-center ${link.name ? 'text-violet-400 hover:text-violet-300 transition-colors duration-200 underline decoration-dotted underline-offset-2' : 'text-gray-400 hover:text-gray-300 transition-colors ml-1'}`}
              >
                {link.name}
                {link.icon && <span className="inline-block">{link.icon}</span>}
              </a>
            </React.Fragment>
          ))}
        </p>
        <p className="text-xs text-gray-600 mt-1">Open For Collaboration</p>
      </div>
    </footer>
  );
};

export default Footer; 