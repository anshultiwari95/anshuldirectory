import BackgroundTransition from '../components/BackgroundTransition';

const TestPage = () => {
  return (
    <>
      <BackgroundTransition />
      <div className="text-white">
        {/* Section 1 (Hero) */}
        <div className="section-hero h-screen flex items-center justify-center">
          <h1 className="text-6xl">Hero Section (Black)</h1>
        </div>
        
        {/* Section 2 (Phone) */}
        <div className="section-phone h-screen flex items-center justify-center">
          <h1 className="text-6xl">Phone Section (Red)</h1>
        </div>
        
        {/* Section 3 (Email) */}
        <div className="section-email h-screen flex items-center justify-center">
          <h1 className="text-6xl">Email Section (Purple)</h1>
        </div>
      </div>
    </>
  );
};

export default TestPage; 