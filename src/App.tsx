import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useState, useCallback, memo, useEffect, useMemo } from 'react';
import Footer from './components/Footer';
import { PersonProvider } from './context/PersonContext';
import './App.css';

// Constants for application configuration
const APP_CONFIG = {
  queryClient: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  },
  routes: {
    home: '/',
    add: '/add',
    list: '/list',
    test: '/test',
  }
};

// Lazy load pages for code splitting and better performance
const LazyComponents = {
  PersonHome: lazy(() => import('./pages/PersonHome')),
  PersonAdd: lazy(() => import('./pages/PersonAdd')),
  PersonList: lazy(() => import('./pages/PersonList')),
  TestPage: lazy(() => import('./pages/TestPage')),
};

// Create a queryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: APP_CONFIG.queryClient.refetchOnWindowFocus,
      staleTime: APP_CONFIG.queryClient.staleTime,
      retry: APP_CONFIG.queryClient.retry,
      refetchOnReconnect: true,
    },
  },
});

// Navigation link interface for type safety
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// Memoized NavLink component for better performance
const NavLink = memo(({ to, children, onClick, className = "" }: NavLinkProps) => (
  <Link
    to={to}
    className={`text-gray-300 font-medium relative inline-block transition-transform duration-300 ease-in-out hover:scale-110 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

// Loading indicator
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mb-4"></div>
      <div className="text-white text-lg">Loading...</div>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Navigation items definition for easier management
const navigationItems = [
  { label: 'Home', path: APP_CONFIG.routes.home },
  { label: 'Add Person', path: APP_CONFIG.routes.add },
  { label: 'View Directory', path: APP_CONFIG.routes.list },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu if window is resized to desktop view
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Memoize routes to prevent unnecessary rerenders
  const appRoutes = useMemo(() => [
    { path: APP_CONFIG.routes.home, element: <LazyComponents.PersonHome /> },
    { path: APP_CONFIG.routes.add, element: <LazyComponents.PersonAdd /> },
    { path: APP_CONFIG.routes.list, element: <LazyComponents.PersonList /> },
    { path: APP_CONFIG.routes.test, element: <LazyComponents.TestPage /> },
  ], []);

  return (
    <QueryClientProvider client={queryClient}>
      <PersonProvider>
        <Router>
          <div className="min-h-screen text-white flex flex-col bg-black">
            <nav className="sticky top-0 bg-black shadow-md z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link 
                  to="/" 
                  className="group relative flex items-center"
                  title="Anshul's Directory"
                  onClick={closeMenu}
                >
                  <div className="w-8 h-8 bg-white rounded-full mr-2 flex items-center justify-center text-black font-bold">
                    D
                  </div>
                  <span className="text-xl font-extrabold tracking-widest text-white">
                    DIRECTORY
                  </span>
                  
                  {/* Tooltip */}
                  <span className="absolute top-full left-0 mt-1 text-white text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Anshul's Directory
                  </span>
                </Link>

                {/* Desktop Navigation - ONLY VISIBLE FROM MD BREAKPOINT UP */}
                <div className="!hidden md:!flex items-center space-x-8">
                  {navigationItems.map(item => (
                    <NavLink 
                      key={item.path} 
                      to={item.path} 
                      onClick={closeMenu}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Mobile menu button - ONLY VISIBLE BELOW MD */}
                <button 
                  className="md:hidden text-white focus:outline-none"
                  onClick={toggleMenu}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile menu dropdown - ONLY SHOWN WHEN OPEN AND BELOW MD BREAKPOINT */}
              {mobileMenuOpen && (
                <div className="md:hidden bg-gray-900 py-4 px-4 shadow-lg w-full">
                  <div className="flex flex-row sm:flex-col justify-center items-center sm:items-start space-y-0 sm:space-y-4 space-x-6 sm:space-x-0">
                    {navigationItems.map(item => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className="text-gray-300 py-2 hover:text-white transition-colors"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {appRoutes.map(route => (
                    <Route 
                      key={route.path} 
                      path={route.path} 
                      element={route.element} 
                    />
                  ))}
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
          </div>
        </Router>
      </PersonProvider>
    </QueryClientProvider>
  );
}

export default App;
